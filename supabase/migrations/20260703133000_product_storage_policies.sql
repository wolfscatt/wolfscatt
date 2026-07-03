INSERT INTO storage.buckets (id, name, public)
VALUES
  ('products', 'products', true),
  ('products-images', 'products-images', true)
ON CONFLICT (id) DO UPDATE
SET public = EXCLUDED.public,
    name = EXCLUDED.name;

DROP POLICY IF EXISTS "Public can view product files" ON storage.objects;
CREATE POLICY "Public can view product files"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id IN ('products', 'products-images'));

DROP POLICY IF EXISTS "Admins can upload product files" ON storage.objects;
CREATE POLICY "Admins can upload product files"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id IN ('products', 'products-images')
    AND public.is_admin()
  );

DROP POLICY IF EXISTS "Admins can update product files" ON storage.objects;
CREATE POLICY "Admins can update product files"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id IN ('products', 'products-images')
    AND public.is_admin()
  )
  WITH CHECK (
    bucket_id IN ('products', 'products-images')
    AND public.is_admin()
  );

DROP POLICY IF EXISTS "Admins can delete product files" ON storage.objects;
CREATE POLICY "Admins can delete product files"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id IN ('products', 'products-images')
    AND public.is_admin()
  );
