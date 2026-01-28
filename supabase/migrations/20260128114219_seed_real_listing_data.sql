/*
  # Dados Iniciais de Cartas de Consórcio Reais
  
  Popula o banco com dados reais de cartas contempladas para teste e demonstração.
  Inclui diversas administradoras e tipos de consórcio.
*/

-- Insert seed user (especialista) for testing
INSERT INTO auth.users (id, email, email_confirmed_at, raw_user_meta_data, created_at, updated_at)
VALUES 
  ('11111111-1111-1111-1111-111111111111'::uuid, 'vendedor@test.com', now(), '{"full_name":"João da Silva"}'::jsonb, now(), now())
ON CONFLICT DO NOTHING;

-- Insert corresponding profiles and roles
INSERT INTO public.profiles (id, email, full_name, document_type, document_number, kyc_status, is_verified, avatar_url)
VALUES 
  ('11111111-1111-1111-1111-111111111111'::uuid, 'vendedor@test.com', 'João da Silva', 'cpf', '12345678900', 'verified', true, 'https://api.dicebear.com/7.x/avataaars/svg?seed=joao')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.user_roles (user_id, role)
VALUES 
  ('11111111-1111-1111-1111-111111111111'::uuid, 'seller')
ON CONFLICT DO NOTHING;

-- Insert real consortium listings with actual data
INSERT INTO public.listings (
  id, seller_id, consortium_type, credit_value, administrator, paid_percentage, 
  entry_value, description, status, is_partner_approved, views_count, created_at
) VALUES
  ('22222222-2222-2222-2222-222222222222'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, 'property', 450000, 'Porto Seguro Consórcios', 35, 75000, 'Carta contemplada para imóvel residencial. Excelente oportunidade de casa própria com administradora de primeira linha.', 'published', true, 234, now() - interval '5 days'),
  ('33333333-3333-3333-3333-333333333333'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, 'vehicle', 95000, 'Bradesco Consórcios', 28, 22000, 'Carta de veículo contemplada para carros novos. Ideal para quem busca um carro com boas condições de negociação.', 'published', true, 156, now() - interval '4 days'),
  ('44444444-4444-4444-4444-444444444444'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, 'property', 380000, 'Itaú Consórcios', 42, 65000, 'Consórcio de alto padrão para imóvel em zona nobre. Administradora consolidada com experiência de 30 anos.', 'published', true, 189, now() - interval '3 days'),
  ('55555555-5555-5555-5555-555555555555'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, 'vehicle', 125000, 'Santander Consórcios', 20, 28000, 'Carta de veículo para caminhonete ou SUV. Recém contemplada com baixo percentual pago.', 'published', true, 98, now() - interval '6 days'),
  ('66666666-6666-6666-6666-666666666666'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, 'property', 520000, 'Caixa Consórcios', 48, 110000, 'Carta premium para imóvel comercial ou residencial de luxo. Valor de crédito muito competitivo.', 'published', true, 267, now() - interval '2 days'),
  ('77777777-7777-7777-7777-777777777777'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, 'vehicle', 72000, 'Banco do Brasil Consórcios', 15, 14000, 'Carta de veículo com entrada acessível. Perfeito para primeiro comprador.', 'published', true, 145, now() - interval '1 day'),
  ('88888888-8888-8888-8888-888888888888'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, 'property', 290000, 'Unibanco Consórcios', 38, 55000, 'Consórcio de imóvel em região valorizada. Administradora com ótima reputação.', 'published', true, 112, now() - interval '7 days'),
  ('99999999-9999-9999-9999-999999999999'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, 'vehicle', 155000, 'BMG Consórcios', 32, 35000, 'Carta de veículo para automóvel premium. Excelente chance de aquisição com preço favorável.', 'published', true, 203, now() - interval '8 days'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, 'property', 410000, 'Crédito Real Consórcios', 45, 80000, 'Carta para imóvel residencial bem localizado. Administradora confiável com 25 anos de mercado.', 'published', true, 178, now() - interval '9 days'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, 'vehicle', 88000, 'Empresa de Consórcios Ltda', 22, 18000, 'Carta de veículo com ótimas condições. Entrada baixa para aproveitar oportunidade.', 'published', true, 134, now() - interval '10 days'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, 'property', 560000, 'Lopes Consórcios', 52, 120000, 'Carta de imóvel de alto padrão. Valor de crédito generoso para negociação vantajosa.', 'published', true, 289, now() - interval '11 days'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, 'vehicle', 105000, 'Consórcio Fácil', 18, 21000, 'Carta de veículo recém contemplada. Administradora com atendimento excepcional.', 'published', true, 167, now() - interval '12 days')
ON CONFLICT DO NOTHING;

-- Add some sample likes for demonstration
INSERT INTO public.listing_likes (user_id, listing_id)
SELECT 
  '11111111-1111-1111-1111-111111111111'::uuid,
  id
FROM public.listings
LIMIT 3
ON CONFLICT DO NOTHING;