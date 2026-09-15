-- Add GSTIN support for customers and business settings.
ALTER TABLE customers
  ADD COLUMN IF NOT EXISTS gstin TEXT;

CREATE TABLE IF NOT EXISTS business_settings (
  id TEXT PRIMARY KEY DEFAULT 'main',
  business_name TEXT NOT NULL DEFAULT 'Kwality Tiles & Granite',
  gstin TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE business_settings ENABLE ROW LEVEL SECURITY;

INSERT INTO business_settings (
  id,
  business_name,
  gstin,
  phone,
  email,
  address
)
VALUES (
  'main',
  'Kwality Tiles & Granite',
  NULL,
  '+91 9876543210',
  'contact@kwalitytiles.com',
  'Shop No. 12, Building Materials Market, Mumbai, Maharashtra 400001'
)
ON CONFLICT (id) DO NOTHING;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'business_settings'
      AND policyname = 'Allow all for authenticated users'
  ) THEN
    CREATE POLICY "Allow all for authenticated users"
      ON business_settings
      FOR ALL
      USING (auth.role() = 'authenticated');
  END IF;
END $$;
