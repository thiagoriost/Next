-- 1. Add new columns to properties table
ALTER TABLE properties
  ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS lat DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS lng DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS parking_spots INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS agent_name TEXT,
  ADD COLUMN IF NOT EXISTS agent_image_url TEXT,
  ADD COLUMN IF NOT EXISTS amenities TEXT[] DEFAULT '{}';

-- 2. Create property_images table
CREATE TABLE IF NOT EXISTS property_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id TEXT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt TEXT NOT NULL DEFAULT '',
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_property_images_property_id ON property_images(property_id);
CREATE INDEX IF NOT EXISTS idx_properties_slug ON properties(slug);

-- 3. Generate slugs for existing properties from title + id suffix
UPDATE properties
SET slug = LOWER(
  REGEXP_REPLACE(
    REGEXP_REPLACE(title, '[^a-zA-Z0-9\s-]', '', 'g'),
    '\s+', '-', 'g'
  )
) || '-' || SUBSTRING(id::TEXT, 1, 8)
WHERE slug IS NULL;

-- 4. Make slug NOT NULL after backfill
ALTER TABLE properties ALTER COLUMN slug SET NOT NULL;;
