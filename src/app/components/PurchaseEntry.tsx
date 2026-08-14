import { useState, useEffect } from "react";
import { Plus, Trash2, Calendar } from "lucide-react";
import { supabase } from "../../lib/supabase";

interface Supplier {
  id: string;
  name: string;
  phone: string;
}

interface Product {
  id: string;
  name: string;
  size: string;
  unit: string;
  opening_stock: number;
  purchase_rate: number;
}

interface PurchaseItem {
  id: number;
  productId: string;
  productName: string;
  quantity: number;
  rate: number;
  unit: string;
}

export function PurchaseEntry() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [selectedSupplier, setSelectedSupplier] = useState("");

  const [items, setItems] = useState<PurchaseItem[]>([
    {
      id: 1,
      productId: "",
      productName: "",
      quantity: 1,
      rate: 0,
      unit: "",
    },
  ]);

  useEffect(() => {
    loadSuppliers();
    loadProducts();
  }, []);

  async function loadSuppliers() {
    const { data } = await supabase
      .from("suppliers")
      .select("*")
      .order("name");

    if (data) setSuppliers(data);
  }

  async function loadProducts() {
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("name");

    if (data) setProducts(data);
  }

  function removeItem(id: number) {
    setItems(items.filter((x) => x.id !== id));
  }

  function updateQuantity(id: number, qty: number) {
    setItems((old) =>
      old.map((i) =>
        i.id === id
          ? {
              ...i,
              quantity: qty,
            }
          : i
      )
    );
  }

  function selectProduct(id: number, productId: string) {
    const product = products.find((p) => p.id === productId);

    if (!product) return;

    setItems((old) =>
      old.map((i) =>
        i.id === id
          ? {
              ...i,
              productId: product.id,
              productName: product.name,
              rate: Number(product.purchase_rate),
              unit: product.unit,
            }
          : i
      )
    );
  }

  function addItem() {
    setItems([
      ...items,
      {
        id: Date.now(),
        productId: "",
        productName: "",
        quantity: 1,
        rate: 0,
        unit: "",
      },
    ]);
  }

  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.rate,
    0
  );

  const gst = subtotal * 0.18;

  const grandTotal = subtotal + gst;

  async function savePurchase() {
    if (!selectedSupplier) {
      alert("Please select supplier");
      return;
    }

    const supplier = suppliers.find(
      (s) => s.id === selectedSupplier
    );

    if (!supplier) return;

    for (const item of items) {
      const product = products.find(
        (p) => p.id === item.productId
      );

      if (!product) {
        alert("Select all products");
        return;
      }

      const { error } = await supabase.from("purchases").insert({
        purchase_no: "PUR-" + Date.now(),

        purchase_date: new Date().toISOString(),

        supplier_id: supplier.id,
        supplier_name: supplier.name,

        product_id: product.id,
        material_name: product.name,

        quantity: item.quantity,

        unit: product.unit,

        rate: item.rate,

        amount: item.quantity * item.rate,

        discount: 0,

        tax_amount: item.quantity * item.rate * 0.18,

        total:
          item.quantity * item.rate +
          item.quantity * item.rate * 0.18,

        notes: "",
      });

      if (error) {
        console.log(error);
        alert(error.message);
        return;
      }

      await supabase
        .from("products")
        .update({
          opening_stock:
            product.opening_stock + item.quantity,
        })
        .eq("id", product.id);
    }

    alert("Purchase Saved Successfully");

    window.location.reload();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1>Purchase Entry</h1>
        <p className="text-muted-foreground mt-1">
          Create a new purchase order and update inventory
        </p>
      </div>

      {/* Purchase Form */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Supplier */}
          <div>
            <label className="block text-sm mb-2">Supplier</label>
            <select
              value={selectedSupplier}
              onChange={(e) => setSelectedSupplier(e.target.value)}
              className="w-full px-4 py-2 bg-muted rounded-lg border border-transparent focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Select Supplier</option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </select>
          </div>

          {/* Invoice Number */}
          <div>
            <label className="block text-sm mb-2">Invoice Number</label>
            <input
              type="text"
              placeholder="INV-00001"
              className="w-full px-4 py-2 bg-muted rounded-lg border border-transparent focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm mb-2">Purchase Date</label>
            <div className="relative">
              <input
                type="date"
                defaultValue={new Date().toISOString().split("T")[0]}
                className="w-full px-4 py-2 bg-muted rounded-lg border border-transparent focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="border border-border rounded-lg overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                    Product
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                    Qty
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                    Unit
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                    Rate
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase">
                    Total
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3">
                      <select
                        value={item.productId}
                        onChange={(e) => selectProduct(item.id, e.target.value)}
                        className="w-full min-w-[200px] px-2 py-1 bg-background rounded border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                      >
                        <option value="">Select Product</option>
                        {products.map((product) => (
                          <option key={product.id} value={product.id}>
                            {product.name} ({product.size})
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(item.id, Number(e.target.value))
                        }
                        className="w-20 px-2 py-1 bg-background rounded border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={item.unit}
                        readOnly
                        className="w-24 px-2 py-1 bg-muted rounded border border-border text-muted-foreground"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={item.rate}
                        readOnly
                        className="w-24 px-2 py-1 bg-muted rounded border border-border text-muted-foreground"
                      />
                    </td>
                    <td className="px-4 py-3 text-right font-medium">
                      ₹{(item.quantity * item.rate).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1 hover:bg-destructive/10 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <button
          onClick={addItem}
          className="inline-flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Item
        </button>
      </div>

      {/* Summary and Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notes */}
        <div className="bg-card rounded-xl p-6 border border-border">
          <label className="block text-sm mb-2">Notes</label>
          <textarea
            rows={6}
            placeholder="Add any additional notes or remarks..."
            className="w-full px-4 py-2 bg-muted rounded-lg border border-transparent focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
          />
        </div>

        {/* Summary */}
        <div className="bg-card rounded-xl p-6 border border-border">
          <h3 className="mb-4">Purchase Summary</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">GST (18%)</span>
              <span className="font-medium">₹{gst.toFixed(2)}</span>
            </div>
            <div className="pt-3 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium">Total Amount</span>
                <span className="text-2xl font-semibold text-primary">
                  ₹{grandTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={savePurchase}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Save Purchase
            </button>
            <button className="px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
