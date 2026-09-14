-- Add is_active to products if it doesn't already exist.
-- Existing products will retain their current rows and default to TRUE.

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE;
