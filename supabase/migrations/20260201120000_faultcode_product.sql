-- Generic products table for site products (FaultCode, future products).
-- Replaces faultcode_product: one table, one row per product (slug = 'faultcode', etc.).

DROP TABLE IF EXISTS public.faultcode_product;

CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  apk_url TEXT,
  pdf_url TEXT,
  whatsapp_phone TEXT,
  screenshot_urls TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view products"
  ON public.products
  FOR SELECT
  USING (true);

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Default row for FaultCode product page
INSERT INTO public.products (slug, name, description, apk_url, pdf_url, whatsapp_phone, screenshot_urls)
VALUES (
  'faultcode',
  'FaultCode',
  'Kombi ve ısıtma sistemleri için hata kodu rehberi — marka bazlı arama, açıklamalar ve çözüm önerileri.',
  NULL,
  NULL,
  NULL,
  '{}'
)
ON CONFLICT (slug) DO NOTHING;
