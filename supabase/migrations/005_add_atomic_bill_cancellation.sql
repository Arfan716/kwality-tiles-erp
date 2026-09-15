-- Add reversible cancellation support without deleting historical sales.
ALTER TABLE public.sales
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'paid';

-- Multi-product invoices are represented by multiple sales rows sharing bill_no.
-- Existing rows are preserved; only the old uniqueness restriction is removed.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conrelid = 'public.sales'::regclass
      AND conname = 'sales_bill_no_key'
  ) THEN
    ALTER TABLE public.sales DROP CONSTRAINT sales_bill_no_key;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS sales_bill_no_idx ON public.sales (bill_no);

CREATE OR REPLACE FUNCTION public.cancel_and_reverse_sale(p_sale_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_bill_no TEXT;
  v_role TEXT;
  v_permissions JSONB;
  v_restored_quantity INTEGER := 0;
  v_product RECORD;
BEGIN
  SELECT role, permissions
  INTO v_role, v_permissions
  FROM public.users
  WHERE id = auth.uid();

  IF COALESCE(v_role, '') <> 'admin'
     AND NOT (
       COALESCE(v_permissions, '[]'::jsonb) @> '["all"]'::jsonb
       OR COALESCE(v_permissions, '[]'::jsonb) @> '["bills"]'::jsonb
       OR COALESCE(v_permissions, '[]'::jsonb) @> '["sales"]'::jsonb
     ) THEN
    RAISE EXCEPTION 'You do not have permission to cancel bills';
  END IF;

  SELECT bill_no
  INTO v_bill_no
  FROM public.sales
  WHERE id = p_sale_id
  FOR UPDATE;

  IF v_bill_no IS NULL THEN
    RAISE EXCEPTION 'Sale record not found';
  END IF;

  -- Lock every line belonging to this invoice before checking or changing status.
  PERFORM 1
  FROM public.sales
  WHERE bill_no = v_bill_no
  FOR UPDATE;

  IF EXISTS (
    SELECT 1
    FROM public.sales
    WHERE bill_no = v_bill_no
      AND LOWER(COALESCE(status, 'paid')) = 'cancelled'
  ) THEN
    RAISE EXCEPTION 'This bill has already been cancelled';
  END IF;

  FOR v_product IN
    SELECT product_id, SUM(quantity)::INTEGER AS quantity
    FROM public.sales
    WHERE bill_no = v_bill_no
    GROUP BY product_id
  LOOP
    IF v_product.product_id IS NULL OR v_product.quantity IS NULL OR v_product.quantity <= 0 THEN
      RAISE EXCEPTION 'Bill contains an invalid product quantity';
    END IF;

    UPDATE public.products
    SET opening_stock = COALESCE(opening_stock, 0) + v_product.quantity,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = v_product.product_id;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Product for bill line was not found';
    END IF;

    v_restored_quantity := v_restored_quantity + v_product.quantity;
  END LOOP;

  UPDATE public.sales
  SET status = 'cancelled'
  WHERE bill_no = v_bill_no;

  RETURN jsonb_build_object(
    'bill_no', v_bill_no,
    'restored_quantity', v_restored_quantity,
    'status', 'cancelled'
  );
END;
$$;

REVOKE ALL ON FUNCTION public.cancel_and_reverse_sale(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.cancel_and_reverse_sale(UUID) TO authenticated;
