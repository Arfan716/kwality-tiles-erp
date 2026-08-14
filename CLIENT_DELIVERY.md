# Kwality Tiles & Granite ERP - CLIENT DELIVERY PACKAGE

## ✅ What's Included

This is a complete, production-ready ERP system with:

- ✅ **User Authentication** via Supabase
- ✅ **Customer Management** (Add, Edit, Delete, Search)
- ✅ **Supplier Management** (Add, Edit, Delete, Search)  
- ✅ **Product Inventory** (Add products with stock tracking)
- ✅ **Sales Billing** (Create invoices, auto-calculate tax, update stock)
- ✅ **Purchase Orders** (Create purchase orders, update stock)
- ✅ **Bills Dashboard** (View all sales and purchase bills)
- ✅ **Staff Management** (Create users, assign roles & permissions)
- ✅ **Reports & Analytics** (Dashboard with KPIs)
- ✅ **PDF Export** (Download bills as PDF)
- ✅ **Mobile Responsive** (Works on phones, tablets, desktop)
- ✅ **Real-time Data Sync** (All changes sync instantly)

---

## 🚀 QUICK START (Do This First!)

### Step 1: Deploy the Database (3 minutes)

1. Go to: https://app.supabase.com
2. Log in to your Supabase account
3. Open your project: **qxuievsatwvxgvpnqczl**
4. Click **SQL Editor** tab
5. Click **New Query**
6. Copy the SQL from file: **`supabase/migrations/001_create_schema.sql`**
7. Paste it in Supabase SQL Editor
8. Click **Run** button (or Ctrl+Enter)
9. Wait for "Success" message

### Step 2: Add Sample Data (2 minutes)

1. Click **New Query** again
2. Copy the SQL from: **`supabase/migrations/002_sample_data.sql`**
3. Paste it in Supabase SQL Editor
4. Click **Run**
5. Verify you see:
   - 5 Customers
   - 5 Suppliers
   - 8 Products

### Step 3: Access Your App

1. Open: https://kwality-tiles-erp.vercel.app
2. Login with:
   - **Email**: `shaikharfan1@gmail.com`
   - **Password**: `password@123`
3. You should see the Dashboard with real data!

---

## 📋 FEATURES GUIDE

### 🏠 Dashboard
Shows real-time KPIs:
- Total Sales this month
- Total Purchases
- Current Inventory Value
- Active Customers
- Sales vs Purchase trend chart
- Inventory by category pie chart
- Recent orders list

### 👥 Customers
- **Add Customer**: Click "Add Customer" button, fill form, save
- **View Customers**: Auto-loads from Supabase
- **Search Customers**: Filter by name, phone, or email
- **Delete Customer**: Click trash icon
- All changes sync to Supabase instantly

### 🏪 Suppliers
- **Add Supplier**: Click "Add Supplier" button
- **Manage Suppliers**: View, search, delete
- Linked to Purchase Orders

### 📦 Inventory
- **Add Product**: Set name, code, category, unit, rate, min stock
- **View Stock**: See opening_stock for each product
- **Auto Stock Updates**: When you create sales/purchase, stock updates automatically
- **Delete Products**: Remove items (caution: may affect history)

### 💰 Sales Billing
**How to Create a Sale:**
1. Click "Sales" menu
2. Select Customer from dropdown
3. Click "Add Item" to add products
4. For each item:
   - Select Product
   - Enter Quantity
   - Rate auto-fills or edit
5. System auto-calculates:
   - Subtotal = Qty × Rate
   - GST 18% = Subtotal × 0.18
   - Total = Subtotal + GST
6. Click "Save Bill"
7. Stock updates automatically
8. Invoice saved to Supabase with unique bill number

### 📥 Purchase Entry
**How to Create a Purchase Order:**
1. Click "Purchase" menu
2. Select Supplier
3. Add Products (same as Sales)
4. Click "Save Purchase"
5. Stock increases automatically
6. Purchase saved to Supabase

### 📄 Bills
- View all Sales and Purchase bills
- Filter by date, bill type, status
- Click bill to view details
- Download as PDF
- Print bills

### 👨‍💼 Staff Management
- Create new staff members
- Set roles: owner, manager, staff
- Assign permissions
- Email sent to new staff with credentials
- Delete staff (removes login access)

### ⚙️ Settings
- System configuration
- Theme settings
- Backup options

### 👤 Profile
- View logged-in user details
- Update profile information

---

## 🔐 LOGIN CREDENTIALS

**Default Admin User:**
```
Email: shaikharfan1@gmail.com
Password: password@123
```

**To Create More Users:**
1. Go to Staff Management
2. Click "Add Staff"
3. Fill in email and password
4. Select role and permissions
5. Click "Create"
6. New user receives email with login link

---

## 💾 DATA & BACKUP

### Where is Data Stored?
- **Supabase Database** (Cloud-hosted PostgreSQL)
- All data is encrypted and backed up automatically
- Accessible only with your Supabase credentials

### Backup Your Data
1. Go to Supabase Dashboard
2. Click **Backups** tab
3. Click **Create Backup**
4. Download backup as SQL file

### Data Tables
- `customers` - Customer information
- `suppliers` - Supplier information
- `products` - Product/inventory details
- `sales` - All sales invoices and line items
- `purchases` - All purchase orders and line items
- `users` - Staff members and access control

---

## ⚠️ TROUBLESHOOTING

### Problem: "Failed to fetch" error
**Solution:**
- Check Supabase tables exist (run SQL migrations)
- Check environment variables in Vercel are set
- Refresh browser (Ctrl+Shift+Delete to clear cache)

### Problem: No data showing in Dashboard
**Solution:**
- Make sure you added sample data (Step 2 above)
- Or manually add customers/products via UI
- Hard refresh browser

### Problem: Can't login
**Solution:**
- Use email: `shaikharfan1@gmail.com`, password: `password@123`
- Check Supabase Auth is enabled (should be by default)

### Problem: "Stock too low" error when creating sale
**Solution:**
- Add more inventory to product
- Or create a Purchase Order first to increase stock

### Problem: Can't delete customer
**Solution:**
- Customer may be linked to sales/purchases
- Supabase prevents deletion due to foreign key constraints
- Create a new customer for new sales instead

---

## 🎯 IMPORTANT REMINDERS

1. **Supabase tables MUST be created** before app works
2. **Environment variables are already set** in Vercel (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
3. **Auto-deploys enabled**: Push to GitHub → Vercel auto-deploys
4. **All data is real**: Changes in app update Supabase instantly
5. **No fake data**: Dashboard only shows data you entered or sample data
6. **Mobile friendly**: Use on phone, tablet, or desktop

---

## 📱 DEVICE COMPATIBILITY

- ✅ Chrome, Firefox, Safari, Edge (latest versions)
- ✅ Mobile responsive (iOS & Android)
- ✅ Works offline for read-only access
- ✅ Desktop app performance optimized

---

## 🔗 USEFUL LINKS

- **App URL**: https://kwality-tiles-erp.vercel.app
- **Supabase Dashboard**: https://app.supabase.com
- **Vercel Dashboard**: https://vercel.com/dashboard
- **GitHub Repository**: https://github.com/Arfan716/kwality-tiles-erp

---

## 📞 SUPPORT CHECKLIST

When troubleshooting, check:

- [ ] Supabase tables created (run 001_create_schema.sql)
- [ ] Sample data inserted (run 002_sample_data.sql)
- [ ] Can login with shaikharfan1@gmail.com / password@123
- [ ] Dashboard shows real data
- [ ] Can add/edit customers
- [ ] Can add/edit suppliers
- [ ] Can add products to inventory
- [ ] Can create sales bills
- [ ] Stock updates after sale
- [ ] Can create purchase orders
- [ ] Bills show in Bills page

---

## ✨ NEXT STEPS

1. **Immediately**: Create database tables (see QUICK START)
2. **Then**: Login and explore the app
3. **Next**: Add your own customers/suppliers/products
4. **Finally**: Create sales and purchase orders
5. **Advanced**: Set up additional staff members with different roles

---

**App Status**: ✅ **PRODUCTION READY**

Deployed on Vercel | Database on Supabase | Code on GitHub | Ready for live use

Good luck! 🚀
