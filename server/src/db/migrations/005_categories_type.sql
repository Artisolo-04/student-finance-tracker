ALTER TABLE categories
ADD COLUMN IF NOT EXISTS category_type VARCHAR(10) CHECK (category_type IN ('income', 'expense')) NOT NULL DEFAULT 'expense';
