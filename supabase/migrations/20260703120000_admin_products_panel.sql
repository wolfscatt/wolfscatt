CREATE TABLE IF NOT EXISTS public.admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

UPDATE public.admins
SET email = lower(email)
WHERE email <> lower(email);

CREATE UNIQUE INDEX IF NOT EXISTS admins_email_lower_idx
  ON public.admins (lower(email));

CREATE UNIQUE INDEX IF NOT EXISTS admins_user_id_idx
  ON public.admins (user_id)
  WHERE user_id IS NOT NULL;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admins
    WHERE lower(email) = lower(COALESCE(auth.jwt() ->> 'email', ''))
  );
$$;

DROP POLICY IF EXISTS "Authenticated users can view their admin record" ON public.admins;
CREATE POLICY "Authenticated users can view their admin record"
  ON public.admins
  FOR SELECT
  TO authenticated
  USING (lower(email) = lower(COALESCE(auth.jwt() ->> 'email', '')));

DROP POLICY IF EXISTS "Admins can insert products" ON public.products;
CREATE POLICY "Admins can insert products"
  ON public.products
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update products" ON public.products;
CREATE POLICY "Admins can update products"
  ON public.products
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete products" ON public.products;
CREATE POLICY "Admins can delete products"
  ON public.products
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

COMMENT ON TABLE public.admins IS 'Admin access list for the /admin panel.';
COMMENT ON FUNCTION public.is_admin() IS 'Checks whether the authenticated user email exists in public.admins.';

-- Example admin insert after creating the auth user:
-- INSERT INTO public.admins (email) VALUES ('admin@example.com');
