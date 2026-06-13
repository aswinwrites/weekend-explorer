-- ─────────────────────────────────────────────────────────────────────────────
-- Weekend Explorer Bengaluru — Database Schema
-- ─────────────────────────────────────────────────────────────────────────────

-- ─── Categories ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL UNIQUE,
  slug        TEXT NOT NULL UNIQUE,
  icon        TEXT NOT NULL,
  color       TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Locations ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS locations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  slug            TEXT NOT NULL UNIQUE,
  primary_category TEXT NOT NULL REFERENCES categories(slug),
  all_categories  TEXT[] NOT NULL DEFAULT '{}',
  distance_km     INTEGER NOT NULL,
  latitude        DOUBLE PRECISION NOT NULL,
  longitude       DOUBLE PRECISION NOT NULL,
  google_maps_url TEXT,
  description     TEXT,
  image_url       TEXT,
  is_visited      BOOLEAN NOT NULL DEFAULT false,
  is_featured     BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_locations_coords   ON locations(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_locations_category ON locations(primary_category);
CREATE INDEX IF NOT EXISTS idx_locations_distance ON locations(distance_km);
CREATE INDEX IF NOT EXISTS idx_locations_search   ON locations USING gin(to_tsvector('english', name));

-- ─── Collections ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS collections (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  cover_image TEXT,
  is_public   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS collection_locations (
  collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  location_id   UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  sort_order    INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (collection_id, location_id)
);

-- ─── Auto-update updated_at ───────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER locations_updated_at
  BEFORE UPDATE ON locations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── Row Level Security ───────────────────────────────────────────────────────
ALTER TABLE categories           ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations            ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections          ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_categories"           ON categories          FOR SELECT USING (true);
CREATE POLICY "public_read_locations"            ON locations           FOR SELECT USING (true);
CREATE POLICY "public_read_collections"          ON collections         FOR SELECT USING (is_public = true);
CREATE POLICY "public_read_collection_locations" ON collection_locations FOR SELECT USING (true);

CREATE POLICY "admin_insert_locations"  ON locations FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "admin_update_locations"  ON locations FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "admin_delete_locations"  ON locations FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "admin_insert_collections" ON collections FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "admin_update_collections" ON collections FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "admin_delete_collections" ON collections FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "admin_write_collection_locations" ON collection_locations
  FOR ALL USING (auth.role() = 'authenticated');

-- ─── Seed: Categories ─────────────────────────────────────────────────────────
INSERT INTO categories (name, slug, icon, color) VALUES
  ('Trek',      'trek',      'Mountain',      'text-emerald-400'),
  ('Waterfall', 'waterfall', 'Waves',         'text-blue-400'),
  ('Fort',      'fort',      'Castle',        'text-amber-400'),
  ('Lake',      'lake',      'Droplets',      'text-cyan-400'),
  ('Temple',    'temple',    'Landmark',      'text-orange-400'),
  ('Museum',    'museum',    'Building2',     'text-purple-400'),
  ('Nature',    'nature',    'Leaf',          'text-green-400'),
  ('Park',      'park',      'Trees',         'text-lime-400'),
  ('Palace',    'palace',    'Crown',         'text-yellow-400'),
  ('Campus',    'campus',    'GraduationCap', 'text-indigo-400'),
  ('Cafe',      'cafe',      'Coffee',        'text-rose-400'),
  ('Boating',   'boating',   'Sailboat',      'text-sky-400')
ON CONFLICT (slug) DO NOTHING;
