/*
  # Adiciona tabela de likes e contato com especialista

  ## Tabelas Criadas
  - `listing_likes`: Sistema de likes para anúncios
  - `expert_contacts`: Registro de contatos com especialista

  ## Colunas
  - `id` (uuid, PK)
  - `user_id` (uuid, FK)
  - `listing_id` (uuid, FK)
  - Timestamps apropriados
*/

CREATE TABLE IF NOT EXISTS listing_likes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id uuid NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, listing_id)
);

CREATE TABLE IF NOT EXISTS expert_contacts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id uuid NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  message text,
  contact_type text DEFAULT 'whatsapp',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_listing_likes_user ON listing_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_listing_likes_listing ON listing_likes(listing_id);
CREATE INDEX IF NOT EXISTS idx_expert_contacts_listing ON expert_contacts(listing_id);
CREATE INDEX IF NOT EXISTS idx_expert_contacts_user ON expert_contacts(user_id);

ALTER TABLE listing_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE expert_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can like listings"
  ON listing_likes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own likes"
  ON listing_likes FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can count likes on published listings"
  ON listing_likes FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM listings WHERE listings.id = listing_likes.listing_id AND status = 'published'
    )
  );

CREATE POLICY "Users can unlike listings"
  ON listing_likes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can contact expert"
  ON expert_contacts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own contacts"
  ON expert_contacts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all contacts"
  ON expert_contacts FOR SELECT
  TO authenticated
  USING (is_partner_or_admin(auth.uid()));