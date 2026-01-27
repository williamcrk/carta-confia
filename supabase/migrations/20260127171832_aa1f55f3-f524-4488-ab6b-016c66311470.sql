
-- Enum para tipos de papel de usuário
CREATE TYPE public.app_role AS ENUM ('buyer', 'seller', 'partner', 'admin');

-- Enum para status de verificação KYC
CREATE TYPE public.kyc_status AS ENUM ('pending', 'under_review', 'verified', 'rejected');

-- Enum para tipo de consórcio
CREATE TYPE public.consortium_type AS ENUM ('property', 'vehicle');

-- Enum para status do anúncio
CREATE TYPE public.listing_status AS ENUM ('draft', 'pending_approval', 'published', 'sold', 'cancelled');

-- Enum para status da negociação
CREATE TYPE public.negotiation_status AS ENUM ('proposal_sent', 'proposal_review', 'partner_approved', 'in_progress', 'completed', 'cancelled');

-- Tabela de perfis de usuário
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  document_number TEXT, -- CPF ou CNPJ
  document_type TEXT CHECK (document_type IN ('cpf', 'cnpj')),
  phone TEXT,
  kyc_status kyc_status NOT NULL DEFAULT 'pending',
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabela de papéis de usuário (separada conforme recomendado para segurança)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Tabela de documentos KYC
CREATE TABLE public.kyc_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL CHECK (document_type IN ('rg', 'cnh', 'contract', 'selfie')),
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  status kyc_status NOT NULL DEFAULT 'pending',
  rejection_reason TEXT,
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabela de anúncios de cartas
CREATE TABLE public.listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  consortium_type consortium_type NOT NULL,
  credit_value DECIMAL(15, 2) NOT NULL,
  administrator TEXT NOT NULL,
  paid_percentage DECIMAL(5, 2) NOT NULL CHECK (paid_percentage >= 0 AND paid_percentage <= 100),
  entry_value DECIMAL(15, 2) NOT NULL,
  description TEXT,
  status listing_status NOT NULL DEFAULT 'draft',
  is_partner_approved BOOLEAN NOT NULL DEFAULT FALSE,
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMPTZ,
  rejection_reason TEXT,
  views_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabela de negociações
CREATE TABLE public.negotiations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  partner_id UUID REFERENCES auth.users(id),
  status negotiation_status NOT NULL DEFAULT 'proposal_sent',
  proposed_value DECIMAL(15, 2),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabela de mensagens do chat
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  negotiation_id UUID NOT NULL REFERENCES public.negotiations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_system_message BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabela de logs de auditoria (imutável)
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabela de notas internas da parceira
CREATE TABLE public.partner_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('user', 'listing', 'negotiation')),
  entity_id UUID NOT NULL,
  note TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Função para verificar papel do usuário (SECURITY DEFINER para evitar recursão RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Função para verificar se usuário é partner ou admin
CREATE OR REPLACE FUNCTION public.is_partner_or_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('partner', 'admin')
  )
$$;

-- Função para criar perfil automaticamente após registro
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  
  -- Adiciona papel padrão baseado no metadata
  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    NEW.id,
    COALESCE((NEW.raw_user_meta_data->>'user_type')::app_role, 'buyer')
  );
  
  RETURN NEW;
END;
$$;

-- Trigger para criar perfil após registro
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Triggers para updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_kyc_documents_updated_at
  BEFORE UPDATE ON public.kyc_documents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_listings_updated_at
  BEFORE UPDATE ON public.listings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_negotiations_updated_at
  BEFORE UPDATE ON public.negotiations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_partner_notes_updated_at
  BEFORE UPDATE ON public.partner_notes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kyc_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.negotiations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_notes ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para profiles
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Partners and admins can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (public.is_partner_or_admin(auth.uid()));

-- Políticas RLS para user_roles
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Políticas RLS para kyc_documents
CREATE POLICY "Users can view own documents"
  ON public.kyc_documents FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own documents"
  ON public.kyc_documents FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Partners can view all documents"
  ON public.kyc_documents FOR SELECT
  TO authenticated
  USING (public.is_partner_or_admin(auth.uid()));

CREATE POLICY "Partners can update documents"
  ON public.kyc_documents FOR UPDATE
  TO authenticated
  USING (public.is_partner_or_admin(auth.uid()));

-- Políticas RLS para listings
CREATE POLICY "Anyone can view published listings"
  ON public.listings FOR SELECT
  USING (status = 'published');

CREATE POLICY "Sellers can view own listings"
  ON public.listings FOR SELECT
  TO authenticated
  USING (auth.uid() = seller_id);

CREATE POLICY "Sellers can insert own listings"
  ON public.listings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Sellers can update own listings"
  ON public.listings FOR UPDATE
  TO authenticated
  USING (auth.uid() = seller_id);

CREATE POLICY "Partners can view all listings"
  ON public.listings FOR SELECT
  TO authenticated
  USING (public.is_partner_or_admin(auth.uid()));

CREATE POLICY "Partners can update listings"
  ON public.listings FOR UPDATE
  TO authenticated
  USING (public.is_partner_or_admin(auth.uid()));

-- Políticas RLS para negotiations
CREATE POLICY "Participants can view negotiations"
  ON public.negotiations FOR SELECT
  TO authenticated
  USING (
    auth.uid() = buyer_id OR 
    auth.uid() = seller_id OR 
    auth.uid() = partner_id OR
    public.is_partner_or_admin(auth.uid())
  );

CREATE POLICY "Buyers can create negotiations"
  ON public.negotiations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Participants can update negotiations"
  ON public.negotiations FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = buyer_id OR 
    auth.uid() = seller_id OR 
    auth.uid() = partner_id OR
    public.is_partner_or_admin(auth.uid())
  );

-- Políticas RLS para messages
CREATE POLICY "Participants can view messages"
  ON public.messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.negotiations n
      WHERE n.id = negotiation_id
      AND (
        auth.uid() = n.buyer_id OR 
        auth.uid() = n.seller_id OR 
        auth.uid() = n.partner_id OR
        public.is_partner_or_admin(auth.uid())
      )
    )
  );

CREATE POLICY "Participants can send messages"
  ON public.messages FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM public.negotiations n
      WHERE n.id = negotiation_id
      AND (
        auth.uid() = n.buyer_id OR 
        auth.uid() = n.seller_id OR 
        auth.uid() = n.partner_id OR
        public.is_partner_or_admin(auth.uid())
      )
    )
  );

-- Políticas RLS para audit_logs (somente leitura para admins)
CREATE POLICY "Admins can view audit logs"
  ON public.audit_logs FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "System can insert audit logs"
  ON public.audit_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Políticas RLS para partner_notes
CREATE POLICY "Partners can manage own notes"
  ON public.partner_notes FOR ALL
  TO authenticated
  USING (public.is_partner_or_admin(auth.uid()));

-- Criar bucket de storage para documentos KYC
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'kyc-documents',
  'kyc-documents',
  false,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
);

-- Políticas de storage para kyc-documents
CREATE POLICY "Users can upload own documents"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'kyc-documents' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can view own documents"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'kyc-documents' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Partners can view all documents"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'kyc-documents' AND public.is_partner_or_admin(auth.uid()));

-- Criar índices para performance
CREATE INDEX idx_listings_status ON public.listings(status);
CREATE INDEX idx_listings_consortium_type ON public.listings(consortium_type);
CREATE INDEX idx_listings_seller_id ON public.listings(seller_id);
CREATE INDEX idx_negotiations_listing_id ON public.negotiations(listing_id);
CREATE INDEX idx_negotiations_buyer_id ON public.negotiations(buyer_id);
CREATE INDEX idx_negotiations_seller_id ON public.negotiations(seller_id);
CREATE INDEX idx_messages_negotiation_id ON public.messages(negotiation_id);
CREATE INDEX idx_kyc_documents_user_id ON public.kyc_documents(user_id);
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity ON public.audit_logs(entity_type, entity_id);
