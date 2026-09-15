import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../../lib/supabase";
import {
  Plus,
  Trash2,
  Calendar,
  Printer,
  Download,
} from "lucide-react";

interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
}

interface Product {
  id: string;
  name: string;
  size?: string;
  unit: string;
  opening_stock: number;
  rate: number;
}

interface BillItem {
  id: number;
  productId: string;
  productName: string;
  quantity: number;
  rate: number;
  unit: string;
}

export function SalesBilling() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [discount, setDiscount] = useState(0);

  const [paymentMethod, setPaymentMethod] = useState("Cash");

  const [items, setItems] = useState<BillItem[]>([
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
    loadCustomers();
    loadProducts();
  }, []);

  async function loadCustomers() {
    const { data } = await supabase
      .from("customers")
      .select("*")
      .order("name");

    if (data) setCustomers(data);
  }

  async function loadProducts() {
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("name");

    if (data) {
      const activeProducts = data.filter((product) => product.is_active !== false);
      setProducts(activeProducts);
    }
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
              rate: Number(product.rate ?? 0),
              unit: product.unit,
            }
          : i
      )
    );
  }

  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.rate,
    0
  );

  const discountAmount = Math.min(discount, subtotal);
  const discountedSubtotal = Math.max(subtotal - discountAmount, 0);
  const grandTotal = discountedSubtotal;

  async function saveBill() {
    if (!selectedCustomer) {
      alert("Please select customer");
      return;
    }

    const customer = customers.find(
      (c) => c.id === selectedCustomer
    );

    if (!customer) return;

    for (const item of items) {
      const product = products.find(
        (p) => p.id === item.productId
      );

      if (!product) {
        alert("Select all products");
        return;
      }

      if (item.quantity > product.opening_stock) {
        alert(
          `${product.name} has only ${product.opening_stock} in stock`
        );
        return;
      }

      const lineAmount = item.quantity * item.rate;
      const lineDiscount =
        subtotal > 0 ? (discountAmount * (lineAmount / subtotal)) : 0;
      const discountedLineAmount = Math.max(lineAmount - lineDiscount, 0);

      const { error } = await supabase.from("sales").insert({
        bill_no: "SALE-" + Date.now(),

        bill_date: new Date(),

        customer_id: customer.id,
        customer_name: customer.name,
        customer_phone: customer.phone,
        customer_address: customer.address,

        product_id: product.id,
        material_name: product.name,

        unit: product.unit,

        quantity: item.quantity,

        rate: item.rate,

        amount: lineAmount,

        discount: lineDiscount,

        total: discountedLineAmount,

        payment_status: paymentMethod,
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
            product.opening_stock - item.quantity,
        })
        .eq("id", product.id);
    }

    alert("Invoice Saved Successfully");

    navigate("/sales", { replace: true });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1>Sales Billing</h1>
          <p className="text-muted-foreground mt-1">Create a new sales invoice</p>
        </div>
        <div className="flex gap-2">
          <button type="button" className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
            <Printer className="w-4 h-4" />
            Print
          </button>
          <button type="button" className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>
      </div>

      {/* Invoice Form */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Customer */}
          <div>
            <label htmlFor="sales-customer" className="block text-sm mb-2">Customer</label>
            <select
              id="sales-customer"
              name="salesCustomer"
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(e.target.value)}
              className="w-full px-4 py-2 bg-muted rounded-lg border border-transparent focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Select Customer</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} - {customer.phone}
                </option>
              ))}
            </select>
          </div>

          {/* Invoice Number */}
          <div>
            <label htmlFor="sales-invoice-number" className="block text-sm mb-2">Invoice Number</label>
            <input
              id="sales-invoice-number"
              name="salesInvoiceNumber"
              type="text"
              placeholder="SALE-00001"
              defaultValue="SALE-00123"
              className="w-full px-4 py-2 bg-muted rounded-lg border border-transparent focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Date */}
          <div>
            <label htmlFor="sales-invoice-date" className="block text-sm mb-2">Invoice Date</label>
            <div className="relative">
              <input
                id="sales-invoice-date"
                name="salesInvoiceDate"
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
                        id={`sales-product-${item.id}`}
                        name={`salesProduct-${item.id}`}
                        value={item.productId}
                        onChange={(e) => selectProduct(item.id, e.target.value)}
                        className="w-full min-w-[200px] px-2 py-1 bg-background rounded border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                      >
                        <option value="">Select Product</option>
                        {products.map((product) => (
                          <option key={product.id} value={product.id}>
                            {product.name}
                            {product.size ? ` (${product.size})` : ""} - Stock: {product.opening_stock}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <input
                        id={`sales-qty-${item.id}`}
                        name={`salesQty-${item.id}`}
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
                        id={`sales-unit-${item.id}`}
                        name={`salesUnit-${item.id}`}
                        type="text"
                        value={item.unit}
                        readOnly
                        className="w-24 px-2 py-1 bg-muted rounded border border-border text-muted-foreground"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        id={`sales-rate-${item.id}`}
                        name={`salesRate-${item.id}`}
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
                        type="button"
                        aria-label={`Remove item ${item.id}`}
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
          type="button"
          onClick={addItem}
          className="inline-flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Item
        </button>
      </div>

      {/* Summary and Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Details */}
        <div className="bg-card rounded-xl p-6 border border-border">
          <h3 className="mb-4">Payment Details</h3>
          <div className="space-y-4">
            <div>
              <p className="block text-sm mb-2">Payment Method</p>
              <div className="grid grid-cols-2 gap-2">
                {["Cash", "Card", "Upi", "Cheque"].map((method) => (
                  <button
                    type="button"
                    key={method}
                    onClick={() => setPaymentMethod(method)}
                    className={`px-4 py-2 rounded-lg transition-colors capitalize ${
                      paymentMethod === method
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label htmlFor="sales-notes" className="block text-sm mb-2">Notes</label>
              <textarea
                id="sales-notes"
                name="salesNotes"
                rows={4}
                placeholder="Add any additional notes..."
                className="w-full px-4 py-2 bg-muted rounded-lg border border-transparent focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-card rounded-xl p-6 border border-border">
          <h3 className="mb-4">Invoice Summary</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Discount</span>
              <input
                type="number"
                min="0"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value) || 0)}
                className="w-28 px-2 py-1 bg-muted rounded border border-transparent focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-right"
              />
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
              type="button"
              onClick={saveBill}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Save & Print
            </button>
            <button type="button" className="px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
