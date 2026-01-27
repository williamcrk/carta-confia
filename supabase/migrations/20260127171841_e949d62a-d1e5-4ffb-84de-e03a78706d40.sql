
-- Corrigir search_path da função update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Remover política permissiva de audit_logs e criar uma mais segura
DROP POLICY IF EXISTS "System can insert audit logs" ON public.audit_logs;

-- Criar política que permite inserir logs apenas para ações do próprio usuário
CREATE POLICY "Users can insert own audit logs"
  ON public.audit_logs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
