import { useState, useEffect } from "react";
import { Search, Plus, Edit, Trash2, Filter, Download, Package } from "lucide-react";
import { supabase } from "../../lib/supabase";



export function Inventory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

const [inventoryItems, setInventoryItems] = useState<any[]>([]);

const [newProduct, setNewProduct] = useState({
  name: "",
  type: "",
  size: "",
  opening_stock: 0,
  unit: "",
  purchase_rate: 0,
  selling_rate: 0,
  notes: "",
});
useEffect(() => {
  fetchProducts();
}, []);

async function fetchProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  setInventoryItems(data || []);
}

async function addProduct() {
  const { error } = await supabase
    .from("products")
    .insert([newProduct]);

  if (error) {
    alert(error.message);
    return;
  }

  fetchProducts();
  setShowAddModal(false);
}

async function deleteProduct(id: string) {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this product?"
  );

  if (!confirmDelete) return;

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);

  if (error) {
    alert(error.message);
    return;
  }

  fetchProducts();
}

async function updateProduct() {
  if (!editingProduct) return;

  const { error } = await supabase
    .from("products")
    .update({
      name: editingProduct.name,
      type: editingProduct.type,
      size: editingProduct.size,
      opening_stock: editingProduct.opening_stock,
      unit: editingProduct.unit,
      purchase_rate: editingProduct.purchase_rate,
      selling_rate: editingProduct.selling_rate,
      notes: editingProduct.notes,
    })
    .eq("id", editingProduct.id);

  if (error) {
    alert(error.message);
    return;
  }

  fetchProducts();
  setShowEditModal(false);
  setEditingProduct(null);
}

const categories = ["All"];

const filteredItems = inventoryItems.filter((item) => {
  const matchesSearch =
    item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(item.id).includes(searchTerm);

  const matchesCategory =
    selectedCategory === "All" || item.type === selectedCategory;

  return matchesSearch && matchesCategory;
});

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1>Inventory Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage your stock and track inventory levels
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Package className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Products</p>
              <h3 className="mt-1">{inventoryItems.length}</h3>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-success/10 rounded-lg">
              <Package className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">In Stock</p>
              <h3 className="mt-1">
                {inventoryItems.filter((i) => i.opening_stock > 10).length}
              </h3>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-warning/10 rounded-lg">
              <Package className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Low Stock</p>
              <h3 className="mt-1">
                {inventoryItems.filter((i) => i.opening_stock <= 10).length}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-muted rounded-lg border border-transparent focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filter</span>
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-foreground">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.size}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{String(item.id)}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-secondary/10 text-secondary">
                      {item.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-foreground">
                        {item.opening_stock} {item.unit}
                      </p>
                      <p className="text-xs text-muted-foreground">Unit: {item.unit}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-foreground">
                    ₹{item.selling_rate}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs ${
                        item.opening_stock > 10
                          ? "bg-success/10 text-success"
                          : "bg-warning/10 text-warning"
                      }`}
                    >
                      {item.opening_stock > 10 ? "In Stock" : "Low Stock"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditingProduct(item);
                          setShowEditModal(true);
                        }}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => deleteProduct(item.id)}
                        className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-card rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-border">
            <div className="flex items-center justify-between mb-6">
              <h2>Add New Product</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>

            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm mb-2">Product Name</label>
                  <input
                      type="text"
                      value={newProduct.name}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, name: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-muted rounded-lg border border-transparent focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="Enter product name"
                      />
                </div>
                <div>
                  <label className="block text-sm mb-2">Purchase Rate</label>
                  <input
                    type="number"
                    value={newProduct.purchase_rate}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        purchase_rate: Number(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 bg-muted rounded-lg border border-transparent focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">Size</label>
                  <input
                    type="text"
                    value={newProduct.size}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, size: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-muted rounded-lg border border-transparent focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="600x600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2">Category</label>
                  <select
                    value={newProduct.type}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, type: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-muted rounded-lg border border-transparent focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">Select</option>
                    <option value="Tile">Tile</option>
                    <option value="Granite">Granite</option>
                    <option value="Marble">Marble</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-2">Supplier</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 bg-muted rounded-lg border border-transparent focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Enter supplier name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm mb-2">Stock Quantity</label>
                  <input
                    type="number"
                    value={newProduct.opening_stock}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        opening_stock: Number(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 bg-muted rounded-lg border border-transparent focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">Unit</label>
                  <select
                    value={newProduct.unit}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, unit: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-muted rounded-lg border border-transparent focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">Select</option>
                    <option value="Box">Box</option>
                    <option value="Piece">Piece</option>
                    <option value="Sqft">Sqft</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-2">Min Stock</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 bg-muted rounded-lg border border-transparent focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2">Price (₹)</label>
                <input
                  type="number"
                  value={newProduct.selling_rate}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      selling_rate: Number(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 bg-muted rounded-lg border border-transparent focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="0.00"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={addProduct}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Add Product
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

      {showEditModal && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-card rounded-xl p-6 max-w-2xl w-full border border-border">
            <div className="flex items-center justify-between mb-6">
              <h2>Edit Product</h2>

              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-muted rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">

              <input
                type="text"
                value={editingProduct.name}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    name: e.target.value,
                  })
                }
                className="w-full px-4 py-2 bg-muted rounded-lg"
                placeholder="Product Name"
              />

              <input
                type="text"
                value={editingProduct.size}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    size: e.target.value,
                  })
                }
                className="w-full px-4 py-2 bg-muted rounded-lg"
                placeholder="Size"
              />

              <select
                value={editingProduct.type}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    type: e.target.value,
                  })
                }
                className="w-full px-4 py-2 bg-muted rounded-lg"
              >
                <option value="Tile">Tile</option>
                <option value="Granite">Granite</option>
                <option value="Marble">Marble</option>
              </select>

              <input
                type="number"
                value={editingProduct.opening_stock}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    opening_stock: Number(e.target.value),
                  })
                }
                className="w-full px-4 py-2 bg-muted rounded-lg"
                placeholder="Stock"
              />

              <input
                type="number"
                value={editingProduct.purchase_rate}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    purchase_rate: Number(e.target.value),
                  })
                }
                className="w-full px-4 py-2 bg-muted rounded-lg"
                placeholder="Purchase Rate"
              />

              <input
                type="number"
                value={editingProduct.selling_rate}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    selling_rate: Number(e.target.value),
                  })
                }
                className="w-full px-4 py-2 bg-muted rounded-lg"
                placeholder="Selling Rate"
              />

              <div className="flex gap-3 pt-4">
                <button
                  onClick={updateProduct}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg"
                >
                  Update Product
                </button>

                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-muted rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
