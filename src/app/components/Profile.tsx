import { User, Mail, Phone, MapPin, Calendar, Shield, Edit, Camera } from "lucide-react";

export function Profile() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1>My Profile</h1>
        <p className="text-muted-foreground mt-1">
          Manage your personal information and account settings
        </p>
      </div>

      {/* Profile Overview */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-12 h-12 text-primary" />
            </div>
            <button className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1">
            <h2>Shop Owner</h2>
            <p className="text-muted-foreground mt-1">Owner & Administrator</p>
            <div className="flex gap-2 mt-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-success/10 text-success">
                Active
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-primary/10 text-primary">
                Administrator
              </span>
            </div>
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
            <Edit className="w-4 h-4" />
            Edit Profile
          </button>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <h3 className="mb-6">Personal Information</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="font-medium text-foreground mt-1">Shop Owner</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Email Address</p>
                <p className="font-medium text-foreground mt-1">owner@kwality.com</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Phone Number</p>
                <p className="font-medium text-foreground mt-1">+91 9876543210</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="font-medium text-foreground mt-1">
                  Shop No. 12, Building Materials Market,<br />
                  Mumbai, Maharashtra 400001
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Member Since</p>
                <p className="font-medium text-foreground mt-1">January 15, 2022</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Account Statistics */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <h3 className="mb-6">Activity Overview</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">Total Sales</p>
            <h3 className="mt-1 text-success">₹45,28,900</h3>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">Total Purchase</p>
            <h3 className="mt-1 text-primary">₹28,94,500</h3>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">Total Customers</p>
            <h3 className="mt-1">156</h3>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">Total Products</p>
            <h3 className="mt-1">342</h3>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-5 h-5 text-primary" />
          <h3>Security & Access</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <p className="font-medium text-foreground">Password</p>
              <p className="text-sm text-muted-foreground mt-1">
                Last changed 3 months ago
              </p>
            </div>
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
              Change
            </button>
          </div>
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <p className="font-medium text-foreground">Two-Factor Authentication</p>
              <p className="text-sm text-muted-foreground mt-1">
                Not enabled - Add an extra layer of security
              </p>
            </div>
            <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors">
              Enable
            </button>
          </div>
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <p className="font-medium text-foreground">Login History</p>
              <p className="text-sm text-muted-foreground mt-1">
                View your recent login activity
              </p>
            </div>
            <button className="px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors border border-border">
              View
            </button>
          </div>
        </div>
      </div>

      {/* Permissions */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <h3 className="mb-6">Your Permissions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {[
            "Dashboard",
            "Inventory",
            "Purchase",
            "Sales",
            "Customers",
            "Suppliers",
            "Bills",
            "Reports",
            "Settings",
            "Staff Management",
          ].map((permission) => (
            <div
              key={permission}
              className="flex items-center gap-2 p-3 bg-success/5 border border-success/20 rounded-lg"
            >
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span className="text-sm text-foreground">{permission}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-card rounded-xl p-6 border border-destructive/20">
        <h3 className="text-destructive mb-6">Danger Zone</h3>
        <div className="space-y-3">
          <button className="w-full p-4 bg-muted rounded-lg hover:bg-destructive/10 transition-colors text-left border border-transparent hover:border-destructive/20">
            <p className="font-medium text-foreground">Deactivate Account</p>
            <p className="text-sm text-muted-foreground mt-1">
              Temporarily disable your account
            </p>
          </button>
          <button className="w-full p-4 bg-destructive/5 rounded-lg hover:bg-destructive/10 transition-colors text-left border border-destructive/20">
            <p className="font-medium text-destructive">Delete Account</p>
            <p className="text-sm text-muted-foreground mt-1">
              Permanently delete your account and all data
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
