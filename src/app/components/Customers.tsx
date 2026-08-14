import { useState, useEffect, FormEvent } from "react";
import { supabase } from "../../lib/supabase";
import { Search, Plus, Edit, Trash2, Phone, Mail, MapPin } from "lucide-react";


export function Customers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
  });

  const fetchCustomers = async () => {
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setCustomers(data || []);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const addCustomer = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { error } = await supabase.from("customers").insert([newCustomer]);

    if (!error) {
      setShowAddModal(false);
      setNewCustomer({
        name: "",
        phone: "",
        email: "",
        address: "",
        notes: "",
      });
      fetchCustomers();
    }
  };

  const deleteCustomer = async (id: string) => {
    if (!confirm("Delete this customer?")) return;

    const { error } = await supabase.from("customers").delete().eq("id", id);

    if (!error) {
      fetchCustomers();
    }
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1>Customers</h1>
          <p className="text-muted-foreground mt-1">
            Manage your customer database and track relationships
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Customer
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-card rounded-xl p-6 border border-border">
          <p className="text-sm text-muted-foreground">Total Customers</p>
          <h3 className="mt-1">{customers.length}</h3>
        </div>
        <div className="bg-card rounded-xl p-6 border border-border">
          <p className="text-sm text-muted-foreground">Customers with Email</p>
          <h3 className="mt-1">{customers.filter((c) => c.email).length}</h3>
        </div>
      </div>

      {/* Search */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search customers by name, phone, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-muted rounded-lg border border-transparent focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredCustomers.map((customer) => (
          <div key={customer.id} className="bg-card rounded-xl p-6 border border-border">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="mb-1">{customer.name}</h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-success/10 text-success">
                  Customer
                </span>
              </div>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                  <Edit className="w-4 h-4 text-muted-foreground" />
                </button>
                <button
                  onClick={() => deleteCustomer(customer.id)}
                  className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground">{customer.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground">{customer.email}</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                <span className="text-sm text-foreground">{customer.address}</span>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-card rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-border">
            <div className="flex items-center justify-between mb-6">
              <h2>Add New Customer</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={addCustomer} className="space-y-4">
              <div>
                <label className="block text-sm mb-2">Customer Name</label>
                <input
                  type="text"
                  value={newCustomer.name}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, name: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-muted rounded-lg border border-transparent focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Enter customer name"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={newCustomer.phone}
                    onChange={(e) =>
                      setNewCustomer({ ...newCustomer, phone: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-muted rounded-lg border border-transparent focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">Email Address</label>
                  <input
                    type="email"
                    value={newCustomer.email}
                    onChange={(e) =>
                      setNewCustomer({ ...newCustomer, email: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-muted rounded-lg border border-transparent focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Enter email address"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2">Address</label>
                <textarea
                  rows={3}
                  value={newCustomer.address}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, address: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-muted rounded-lg border border-transparent focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                  placeholder="Enter complete address"
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Notes</label>
                <textarea
                  rows={3}
                  value={newCustomer.notes}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, notes: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-muted rounded-lg border border-transparent focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                  placeholder="Additional notes"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Add Customer
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
