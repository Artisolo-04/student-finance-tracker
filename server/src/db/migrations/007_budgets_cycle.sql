-- Rename monthly_limit to allocated
ALTER TABLE budgets RENAME COLUMN monthly_limit TO allocated;

-- Add income cycle columns
ALTER TABLE budgets
  ADD COLUMN income_transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
  ADD COLUMN cycle_start DATE NOT NULL DEFAULT CURRENT_DATE,
  ADD COLUMN cycle_end DATE;

-- Drop old unique constraint (category per user)
ALTER TABLE budgets DROP CONSTRAINT budgets_user_id_category_id_key;

-- New constraint: unique per category per income cycle
ALTER TABLE budgets ADD CONSTRAINT budgets_user_category_cycle_key
  UNIQUE (user_id, category_id, income_transaction_id);

-- Rename check constraint to match new column name
ALTER TABLE budgets DROP CONSTRAINT budgets_monthly_limit_check;
ALTER TABLE budgets ADD CONSTRAINT budgets_allocated_check CHECK (allocated > 0);
