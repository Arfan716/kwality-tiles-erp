import { useState } from "react";
import { Download, Calendar, FileText, TrendingUp, Package, Users, IndianRupee } from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { supabase } from "../../lib/supabase";

const monthlySalesData = [
  { month: "Jan", sales: 450000, purchases: 280000, profit: 170000 },
  { month: "Feb", sales: 520000, purchases: 320000, profit: 200000 },
  { month: "Mar", sales: 480000, purchases: 290000, profit: 190000 },
  { month: "Apr", sales: 610000, purchases: 380000, profit: 230000 },
  { month: "May", sales: 550000, purchases: 340000, profit: 210000 },
  { month: "Jun", sales: 670000, purchases: 410000, profit: 260000 },
];

const reportTypes = [
  { name: "Sales Report", icon: TrendingUp, color: "text-success" },
  { name: "Purchase Report", icon: IndianRupee, color: "text-primary" },
  { name: "Inventory Report", icon: Package, color: "text-warning" },
  { name: "Customer Report", icon: Users, color: "text-secondary" },
];

export function Reports() {
  const [selectedReport, setSelectedReport] = useState("Sales Report");
  const [dateRange, setDateRange] = useState("This Month");
  const [exporting, setExporting] = useState(false);

  const exportPDF = async () => {
    try {
      setExporting(true);
      
      let data: any = [];
      let fileName = "report";

      if (selectedReport === "Sales Report") {
        const { data: sales } = await supabase.from("sales").select("*");
        data = sales || [];
        fileName = "sales-report";
      } else if (selectedReport === "Purchase Report") {
        const { data: purchases } = await supabase.from("purchases").select("*");
        data = purchases || [];
        fileName = "purchase-report";
      } else if (selectedReport === "Inventory Report") {
        const { data: products } = await supabase.from("products").select("*");
        data = products || [];
        fileName = "inventory-report";
      } else if (selectedReport === "Customer Report") {
        const { data: customers } = await supabase.from("customers").select("*");
        data = customers || [];
        fileName = "customer-report";
      }

      // Create CSV content
      if (data.length === 0) {
        alert("No data available for this report");
        setExporting(false);
        return;
      }

      const headers = Object.keys(data[0]).join(",");
      const csvContent = [
        headers,
        ...data.map((row: any) =>
          Object.values(row)
            .map((v: any) => (typeof v === "string" ? `"${v}"` : v))
            .join(",")
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${fileName}-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();

      alert("✅ PDF exported successfully!");
      setExporting(false);
    } catch (error: any) {
      alert("❌ Export failed: " + error.message);
      setExporting(false);
    }
  };

  const exportExcel = async () => {
    try {
      setExporting(true);

      let data: any = [];
      let fileName = "report";

      if (selectedReport === "Sales Report") {
        const { data: sales } = await supabase.from("sales").select("*");
        data = sales || [];
        fileName = "sales-report";
      } else if (selectedReport === "Purchase Report") {
        const { data: purchases } = await supabase.from("purchases").select("*");
        data = purchases || [];
        fileName = "purchase-report";
      } else if (selectedReport === "Inventory Report") {
        const { data: products } = await supabase.from("products").select("*");
        data = products || [];
        fileName = "inventory-report";
      } else if (selectedReport === "Customer Report") {
        const { data: customers } = await supabase.from("customers").select("*");
        data = customers || [];
        fileName = "customer-report";
      }

      if (data.length === 0) {
        alert("No data available for this report");
        setExporting(false);
        return;
      }

      // Create CSV (Excel compatible)
      const headers = Object.keys(data[0]).join(",");
      const csvContent = [
        headers,
        ...data.map((row: any) =>
          Object.values(row)
            .map((v: any) => (typeof v === "string" ? `"${v}"` : v))
            .join(",")
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "application/vnd.ms-excel" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${fileName}-${new Date().toISOString().split("T")[0]}.xlsx`;
      a.click();

      alert("✅ Excel file exported successfully!");
      setExporting(false);
    } catch (error: any) {
      alert("❌ Export failed: " + error.message);
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1>Reports & Analytics</h1>
        <p className="text-muted-foreground mt-1">
          Generate and analyze business reports
        </p>
      </div>

      {/* Report Type Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {reportTypes.map((report) => {
          const Icon = report.icon;
          return (
            <button
              key={report.name}
              onClick={() => setSelectedReport(report.name)}
              className={`bg-card rounded-xl p-6 border-2 transition-all text-left ${
                selectedReport === report.name
                  ? "border-primary"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div className={`p-3 bg-muted rounded-lg inline-block mb-3`}>
                <Icon className={`w-6 h-6 ${report.color}`} />
              </div>
              <h4>{report.name}</h4>
            </button>
          );
        })}
      </div>

      {/* Date Range and Export */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-4">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 bg-muted rounded-lg border border-transparent focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option>Today</option>
              <option>This Week</option>
              <option>This Month</option>
              <option>Last Month</option>
              <option>This Quarter</option>
              <option>This Year</option>
              <option>Custom Range</option>
            </select>
            <div className="flex gap-2">
              <div className="relative">
                <input
                  type="date"
                  className="px-4 py-2 bg-muted rounded-lg border border-transparent focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <span className="text-muted-foreground py-2">to</span>
              <div className="relative">
                <input
                  type="date"
                  className="px-4 py-2 bg-muted rounded-lg border border-transparent focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={exportPDF}
              disabled={exporting}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {exporting ? "Exporting..." : "Export PDF"}
            </button>
            <button 
              onClick={exportExcel}
              disabled={exporting}
              className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {exporting ? "Exporting..." : "Export Excel"}
            </button>
          </div>
        </div>
      </div>

      {/* Monthly Performance Chart */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <h3 className="mb-6">Monthly Performance</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={monthlySalesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis dataKey="month" stroke="#64748B" />
            <YAxis stroke="#64748B" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #E2E8F0",
                borderRadius: "8px",
              }}
            />
            <Bar dataKey="sales" fill="#16A34A" radius={[8, 8, 0, 0]} />
            <Bar dataKey="purchases" fill="#0F766E" radius={[8, 8, 0, 0]} />
            <Bar dataKey="profit" fill="#14B8A6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex items-center justify-center gap-6 mt-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#16A34A]"></div>
            <span className="text-sm text-muted-foreground">Sales</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#0F766E]"></div>
            <span className="text-sm text-muted-foreground">Purchases</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#14B8A6]"></div>
            <span className="text-sm text-muted-foreground">Profit</span>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-card rounded-xl p-6 border border-border">
          <h3 className="mb-4">Top Selling Products</h3>
          <div className="space-y-3">
            {[
              { name: "Vitrified Tiles 600x600", sold: 450, revenue: 540000 },
              { name: "Black Galaxy Granite", sold: 45, revenue: 675000 },
              { name: "Italian Marble White", sold: 28, revenue: 518000 },
              { name: "Wall Tiles 300x450", sold: 180, revenue: 117000 },
            ].map((product, index) => (
              <div key={index} className="p-3 bg-muted rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-foreground">{product.name}</p>
                  <span className="text-xs text-muted-foreground">#{index + 1}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{product.sold} units</span>
                  <span className="text-sm font-medium text-success">
                    ₹{product.revenue.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border">
          <h3 className="mb-4">Top Customers</h3>
          <div className="space-y-3">
            {[
              { name: "Amit Patel", orders: 12, spent: 356000 },
              { name: "Rajesh Kumar", orders: 9, spent: 245000 },
              { name: "Priya Sharma", orders: 7, spent: 189000 },
              { name: "Sneha Reddy", orders: 5, spent: 128000 },
            ].map((customer, index) => (
              <div key={index} className="p-3 bg-muted rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-foreground">{customer.name}</p>
                  <span className="text-xs text-muted-foreground">#{index + 1}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{customer.orders} orders</span>
                  <span className="text-sm font-medium text-primary">
                    ₹{customer.spent.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border">
          <h3 className="mb-4">Payment Summary</h3>
          <div className="space-y-4">
            <div className="p-4 bg-success/5 border border-success/20 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Total Collected</p>
              <p className="text-2xl font-semibold text-success">₹3,28,500</p>
            </div>
            <div className="p-4 bg-warning/5 border border-warning/20 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Pending Collection</p>
              <p className="text-2xl font-semibold text-warning">₹81,500</p>
            </div>
            <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Overdue Payments</p>
              <p className="text-2xl font-semibold text-destructive">₹42,400</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl p-6 border border-border">
          <p className="text-sm text-muted-foreground">Total Transactions</p>
          <h3 className="mt-1">1,234</h3>
        </div>
        <div className="bg-card rounded-xl p-6 border border-border">
          <p className="text-sm text-muted-foreground">Average Order Value</p>
          <h3 className="mt-1">₹32,450</h3>
        </div>
        <div className="bg-card rounded-xl p-6 border border-border">
          <p className="text-sm text-muted-foreground">New Customers</p>
          <h3 className="mt-1">24</h3>
        </div>
        <div className="bg-card rounded-xl p-6 border border-border">
          <p className="text-sm text-muted-foreground">Gross Profit Margin</p>
          <h3 className="mt-1 text-success">38.5%</h3>
        </div>
      </div>
    </div>
  );
}
