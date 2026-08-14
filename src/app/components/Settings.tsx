import { Save, Building2, IndianRupee, Bell, Shield, Database } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useState } from "react";

export function Settings() {
  const [exporting, setExporting] = useState(false);

  // Export data to CSV
  const exportData = async () => {
    try {
      setExporting(true);
      
      const tables = ['customers', 'suppliers', 'products', 'sales', 'purchases'];
      let csvContent = '';

      for (const table of tables) {
        const { data } = await supabase.from(table).select('*');
        
        if (data && data.length > 0) {
          csvContent += `\n\n=== ${table.toUpperCase()} ===\n`;
          const headers = Object.keys(data[0]).join(',');
          csvContent += headers + '\n';
          
          data.forEach(row => {
            const values = Object.values(row).map(v => 
              typeof v === 'string' ? `"${v}"` : v
            ).join(',');
            csvContent += values + '\n';
          });
        }
      }

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `kwality-erp-backup-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      
      alert('✅ Data exported successfully!');
      setExporting(false);
    } catch (error: any) {
      alert('❌ Export failed: ' + error.message);
      setExporting(false);
    }
  };

  // Backup data (same as export for now)
  const backupData = async () => {
    try {
      const confirmed = window.confirm('Create a backup of all data? This will download a CSV file.');
      if (!confirmed) return;
      
      await exportData();
      alert('✅ Backup created successfully!');
    } catch (error: any) {
      alert('❌ Backup failed: ' + error.message);
    }
  };

  // Delete all data
  const deleteAllData = async () => {
    const confirmed1 = window.confirm('⚠️ Are you sure? This will DELETE ALL data permanently!');
    if (!confirmed1) return;

    const confirmed2 = window.confirm('⚠️ This action CANNOT be undone. Type "DELETE" to confirm.');
    if (!confirmed2) return;

    try {
      const userInput = prompt('Type "DELETE" to confirm permanent data deletion:');
      if (userInput !== 'DELETE') {
        alert('Cancelled. Data was not deleted.');
        return;
      }

      // Delete data from all tables in order (respecting foreign keys)
      await supabase.from('sales').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('purchases').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('customers').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('suppliers').delete().neq('id', '00000000-0000-0000-0000-000000000000');

      alert('✅ All data has been deleted!');
      window.location.reload();
    } catch (error: any) {
      alert('❌ Delete failed: ' + error.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1>Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your application settings and preferences
        </p>
      </div>

      {/* Business Information */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-center gap-3 mb-6">
          <Building2 className="w-5 h-5 text-primary" />
          <h3>Business Information</h3>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-2">Business Name</label>
            <input
              type="text"
              defaultValue="Kwality Tiles & Granite"
              className="w-full px-4 py-2 bg-muted rounded-lg border border-transparent focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="block text-sm mb-2">GST Number</label>
            <input
              type="text"
              defaultValue="27XXXXX1234X1ZX"
              className="w-full px-4 py-2 bg-muted rounded-lg border border-transparent focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="block text-sm mb-2">Phone Number</label>
            <input
              type="tel"
              defaultValue="+91 9876543210"
              className="w-full px-4 py-2 bg-muted rounded-lg border border-transparent focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="block text-sm mb-2">Email Address</label>
            <input
              type="email"
              defaultValue="contact@kwalitytiles.com"
              className="w-full px-4 py-2 bg-muted rounded-lg border border-transparent focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="lg:col-span-2">
            <label className="block text-sm mb-2">Business Address</label>
            <textarea
              rows={3}
              defaultValue="Shop No. 12, Building Materials Market, Mumbai, Maharashtra 400001"
              className="w-full px-4 py-2 bg-muted rounded-lg border border-transparent focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            />
          </div>
        </div>
      </div>

      {/* Financial Settings */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-center gap-3 mb-6">
          <IndianRupee className="w-5 h-5 text-primary" />
          <h3>Financial Settings</h3>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-2">Default Tax Rate (%)</label>
            <input
              type="number"
              defaultValue="18"
              className="w-full px-4 py-2 bg-muted rounded-lg border border-transparent focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="block text-sm mb-2">Currency</label>
            <select className="w-full px-4 py-2 bg-muted rounded-lg border border-transparent focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
              <option>INR (₹)</option>
              <option>USD ($)</option>
              <option>EUR (€)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-2">Payment Terms (Days)</label>
            <input
              type="number"
              defaultValue="30"
              className="w-full px-4 py-2 bg-muted rounded-lg border border-transparent focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="block text-sm mb-2">Financial Year Start</label>
            <select className="w-full px-4 py-2 bg-muted rounded-lg border border-transparent focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
              <option>April</option>
              <option>January</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-5 h-5 text-primary" />
          <h3>Notification Preferences</h3>
        </div>
        <div className="space-y-4">
          {[
            { label: "Low Stock Alerts", description: "Get notified when inventory is running low" },
            { label: "Payment Reminders", description: "Receive reminders for pending payments" },
            { label: "New Order Notifications", description: "Get notified for new customer orders" },
            { label: "Daily Summary Report", description: "Receive daily sales and inventory summary" },
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <p className="font-medium text-foreground">{item.label}</p>
                <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-switch-background peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-5 h-5 text-primary" />
          <h3>Security Settings</h3>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-2">Change Password</label>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <input
                type="password"
                placeholder="Current Password"
                className="w-full px-4 py-2 bg-muted rounded-lg border border-transparent focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <input
                type="password"
                placeholder="New Password"
                className="w-full px-4 py-2 bg-muted rounded-lg border border-transparent focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <p className="font-medium text-foreground">Two-Factor Authentication</p>
              <p className="text-sm text-muted-foreground mt-1">
                Add an extra layer of security to your account
              </p>
            </div>
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
              Enable
            </button>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-center gap-3 mb-6">
          <Database className="w-5 h-5 text-primary" />
          <h3>Data Management</h3>
        </div>
        <div className="space-y-3">
          <button 
            onClick={backupData}
            className="w-full p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors text-left"
          >
            <p className="font-medium text-foreground">Backup Data</p>
            <p className="text-sm text-muted-foreground mt-1">
              Create a backup of all your business data
            </p>
          </button>
          <button 
            onClick={exportData}
            disabled={exporting}
            className="w-full p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors text-left disabled:opacity-50"
          >
            <p className="font-medium text-foreground">
              {exporting ? 'Exporting...' : 'Export Data'}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Export your data in CSV format
            </p>
          </button>
          <button 
            onClick={deleteAllData}
            className="w-full p-4 bg-destructive/5 border border-destructive/20 rounded-lg hover:bg-destructive/10 transition-colors text-left"
          >
            <p className="font-medium text-destructive">Delete All Data</p>
            <p className="text-sm text-muted-foreground mt-1">
              Permanently delete all your business data (This action cannot be undone)
            </p>
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>
    </div>
  );
}
