CREATE TABLE IF NOT EXISTS menu_categories (
  id          TEXT PRIMARY KEY,
  label       TEXT NOT NULL,
  emoji       TEXT NOT NULL DEFAULT '',
  sort_order  INTEGER NOT NULL DEFAULT 0,
  is_active   INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS menu_items (
  id              TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(8)))),
  category_id     TEXT NOT NULL REFERENCES menu_categories(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  description     TEXT NOT NULL DEFAULT '',
  price           TEXT,
  price_gf        TEXT,
  is_vegetarian   INTEGER NOT NULL DEFAULT 0,
  is_gluten_free  INTEGER NOT NULL DEFAULT 0,
  is_seafood      INTEGER NOT NULL DEFAULT 0,
  badge           TEXT,
  allergens       TEXT,
  sort_order      INTEGER NOT NULL DEFAULT 0,
  is_active       INTEGER NOT NULL DEFAULT 1,
  created_at      TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_items_category ON menu_items(category_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_categories_order ON menu_categories(sort_order);

CREATE TRIGGER IF NOT EXISTS menu_items_updated_at
AFTER UPDATE ON menu_items
BEGIN
  UPDATE menu_items SET updated_at = datetime('now') WHERE id = NEW.id;
END;
