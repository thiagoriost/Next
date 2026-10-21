ALTER TYPE public.property_category ADD VALUE IF NOT EXISTS 'Commercial';

DO $$
BEGIN
  CREATE TYPE public.property_status AS ENUM ('for-sale', 'for-rent', 'sold', 'draft');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$$;

ALTER TABLE public.properties
  ADD COLUMN IF NOT EXISTS status public.property_status,
  ADD COLUMN IF NOT EXISTS year_built integer;

UPDATE public.properties
SET status = CASE
  WHEN type = 'rent' THEN 'for-rent'::public.property_status
  ELSE 'for-sale'::public.property_status
END
WHERE status IS NULL;

ALTER TABLE public.properties
  ALTER COLUMN status SET DEFAULT 'for-sale',
  ALTER COLUMN status SET NOT NULL;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'property-images',
  'property-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE
SET public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

CREATE POLICY "Public can read property images"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'property-images');

CREATE POLICY "Admins can upload property images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'property-images'
    AND public.is_current_user_admin()
  );

CREATE POLICY "Admins can update property images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'property-images'
    AND public.is_current_user_admin()
  )
  WITH CHECK (
    bucket_id = 'property-images'
    AND public.is_current_user_admin()
  );

CREATE POLICY "Admins can delete property images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'property-images'
    AND public.is_current_user_admin()
  );
