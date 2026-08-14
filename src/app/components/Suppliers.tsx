import { useState, useEffect, FormEvent } from "react";
import { supabase } from "../../lib/supabase";
import { Search, Plus, Edit, Trash2, Phone, Mail, MapPin } from "lucide-react";

export function Suppliers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSupplier, setNewSupplier] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const fetchSuppliers = async () => {
    const { data, error } = await supabase
      .from("suppliers")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setSuppliers(data || []);
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const addSupplier = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { data, error } = await supabase
      .from("suppliers")
      .insert([
        {
          name: newSupplier.name,
          phone: newSupplier.phone,
          address: newSupplier.address,
        },
      ])
      .select();

    console.log("DATA:", data);
    console.log("ERROR FULL:", JSON.stringify(error, null, 2));

    if (!error) {
      setShowAddModal(false);
      setNewSupplier({
        name: "",
        phone: "",
        address: "",
      });
      fetchSuppliers();
    }
  };

  const deleteSupplier = async (id: string) => {
    if (!confirm("Delete supplier?")) return;

    const { error } = await supabase.from("suppliers").delete().eq("id", id);

    if (!error) fetchSuppliers();
  };

  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.phone?.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1>Suppliers</h1>
          <p className="text-muted-foreground mt-1">
            Manage your supplier relationships and track orders
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Supplier
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-card rounded-xl p-6 border border-border">
          <p className="text-sm text-muted-foreground">Total Suppliers</p>
          <h3 className="mt-1">{suppliers.length}</h3>
        </div>
        <div className="bg-card rounded-xl p-6 border border-border">
          <p className="text-sm text-muted-foreground">Registered Suppliers</p>
          <h3 className="mt-1">{suppliers.length}</h3>
        </div>
      </div>

      {/* Search */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search suppliers by name or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-muted rounded-lg border border-transparent focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredSuppliers.map((supplier) => (
          <div key={supplier.id} className="bg-card rounded-xl p-6 border border-border">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="mb-1">{supplier.name}</h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-success/10 text-success">
                  Customer
                </span>
              </div>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                  <Edit className="w-4 h-4 text-muted-foreground" />
                </button>
                <button
                  onClick={() => deleteSupplier(supplier.id)}
                  className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground">{supplier.phone}</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                <span className="text-sm text-foreground">{supplier.address}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Supplier Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-card rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-border">
            <div className="flex items-center justify-between mb-6">
              <h2>Add New Supplier</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={addSupplier} className="space-y-4">
              <div>
                <label className="block text-sm mb-2">Company Name</label>
                <input
                  type="text"
                  value={newSupplier.name}
                  onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                  className="w-full px-4 py-2 bg-muted rounded-lg border border-transparent focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Enter company name"
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={newSupplier.phone}
                  onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })}
                  className="w-full px-4 py-2 bg-muted rounded-lg border border-transparent focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Address</label>
                <textarea
                  rows={3}
                  value={newSupplier.address}
                  onChange={(e) => setNewSupplier({ ...newSupplier, address: e.target.value })}
                  className="w-full px-4 py-2 bg-muted rounded-lg border border-transparent focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                  placeholder="Enter complete address"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Add Supplier
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
