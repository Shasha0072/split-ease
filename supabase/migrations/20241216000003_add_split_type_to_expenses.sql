-- Add split_type column to expenses table
ALTER TABLE public.expenses
ADD COLUMN split_type TEXT DEFAULT 'equal' NOT NULL
CHECK (split_type IN ('equal', 'exact', 'percentage', 'shares'));

-- Add comment explaining the column
COMMENT ON COLUMN public.expenses.split_type IS 'Type of expense split: equal (default), exact (specific amounts), percentage, or shares';
