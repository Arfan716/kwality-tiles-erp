# Kwality Tiles ERP - Quick Setup Guide

## 1. CREATE DATABASE SCHEMA (5 minutes)

1. Go to https://app.supabase.com
2. Log in with your Supabase account
3. Click your project: **qxuievsatwvxgvpnqczl**
4. Go to **SQL Editor** tab
5. Click **New Query**
6. Open file: `supabase/migrations/001_create_schema.sql` from your project
7. Copy the entire SQL content
8. Paste into Supabase SQL Editor
9. Click **Run** (or Ctrl+Enter)
10. You should see: "Success. No rows returned."

## 2. ADD SAMPLE DATA (2 minutes)

1. Click **New Query** again
2. Open file: `supabase/migrations/002_sample_data.sql`
3. Copy and paste into Supabase
4. Click **Run**
5. Check that customers, suppliers, and products were added

## 3. VERIFY YOUR APP IS DEPLOYED

1. Go to https://kwality-tiles-erp.vercel.app
2. Login with: 
   - Email: `shaikharfan1@gmail.com`
   - Password: `password@123`
3. You should see the Dashboard with real data

## 4. TEST EACH FEATURE

### Customers
- Click "Customers" in left menu
- You should see 5 sample customers
- Try adding a new customer
- Try deleting a customer

### Suppliers  
- Click "Suppliers"
- You should see 5 sample suppliers
- Try adding a new supplier

### Inventory
- Click "Inventory"
- You should see 8 products
- Try adding a new product

### Sales Billing
- Click "Sales"
- Select a customer
- Select products and quantities
- Click "Save Bill" - should save to Supabase

### Purchase Entry
- Click "Purchase"
- Select a supplier
- Select products and quantities
- Click "Save Purchase" - should save to Supabase

### Bills
- Click "Bills"
- You should see all sales and purchase bills

## CRITICAL: If you still see fake data

This means the environment variables aren't loaded yet. Go back to:
1. Vercel Dashboard → kwality-tiles-erp project
2. Settings → Environment Variables
3. Make sure these are set:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. If missing, add them
5. Click the "Redeploy" button on latest deployment

## TROUBLESHOOTING

### "Failed to fetch" error
- Check browser Console (F12)
- Make sure Supabase tables were created
- Verify environment variables are set in Vercel

### "No data showing"
- Check if you ran the SQL migrations
- Check if browser is pulling from cache (Ctrl+Shift+Delete)

### Forms not saving
- Check browser Network tab (F12)
- Look for failed requests to Supabase
- Check Supabase table permissions (RLS policies)

## DELIVERY CHECKLIST

- [ ] All 8 Supabase tables created
- [ ] Sample data inserted
- [ ] Login works
- [ ] Dashboard shows real data
- [ ] Can add/edit/delete customers
- [ ] Can add/edit/delete suppliers
- [ ] Can add products
- [ ] Can create sales bills
- [ ] Can create purchase orders
- [ ] Bills show in Bills page

Good luck! 🚀
