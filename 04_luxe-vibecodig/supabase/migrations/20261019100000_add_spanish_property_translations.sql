ALTER TABLE public.properties
  ADD COLUMN IF NOT EXISTS description_es text,
  ADD COLUMN IF NOT EXISTS amenities_es text[];
