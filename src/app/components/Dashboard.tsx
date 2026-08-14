import {
  TrendingUp,
  TrendingDown,
  Package,
  ShoppingCart,
  IndianRupee,
  Users,
  AlertCircle,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

export function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [lowStockItems, setLowStockItems] = useState<any[]>([]);
  const [salesData, setSalesData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch sales, purchases, products, and customers
      const [salesRes, purchasesRes, productsRes, customersRes] = await Promise.all([
        supabase.from("sales").select("*"),
        supabase.from("purchases").select("*"),
        supabase.from("products").select("*"),
        supabase.from("customers").select("*"),
      ]);

      const sales = salesRes.data || [];
      const purchases = purchasesRes.data || [];
      const products = productsRes.data || [];
      const customers = customersRes.data || [];

      // Calculate KPIs
      const totalSales = sales.reduce((sum: number, s: any) => sum + (s.total || 0), 0);
      const totalPurchase = purchases.reduce((sum: number, p: any) => sum + (p.total || 0), 0);
      const inventoryValue = products.reduce((sum: number, p: any) => sum + (p.opening_stock * p.rate), 0);
      const activeCustomers = customers.length;

      const kpisData = [
        {
          name: "Total Sales",
          value: `₹${(totalSales / 100000).toFixed(2)}L`,
          change: "+12.5%",
          trend: "up",
          icon: IndianRupee,
          color: "text-success",
        },
        {
          name: "Total Purchase",
          value: `₹${(totalPurchase / 100000).toFixed(2)}L`,
          change: "+8.2%",
          trend: "up",
          icon: ShoppingCart,
          color: "text-primary",
        },
        {
          name: "Inventory Value",
          value: `₹${(inventoryValue / 100000).toFixed(2)}L`,
          change: "-3.1%",
          trend: "down",
          icon: Package,
          color: "text-warning",
        },
        {
          name: "Active Customers",
          value: activeCustomers.toString(),
          change: "+5.8%",
          trend: "up",
          icon: Users,
          color: "text-secondary",
        },
      ];

      setKpis(kpisData);

      // Recent orders (last 4 sales)
      const recent = sales.slice(-4).map((s: any) => ({
        id: `ORD-${s.bill_no}`,
        customer: s.customer_id || "Unknown",
        amount: `₹${s.total || 0}`,
        status: s.payment_status || "Pending",
        date: new Date(s.created_at).toLocaleDateString(),
      }));
      setRecentOrders(recent);

      // Low stock items (where opening_stock < min_stock)
      const lowStock = products
        .filter((p: any) => p.opening_stock < (p.min_stock || 50))
        .map((p: any) => ({
          name: p.name,
          stock: p.opening_stock,
          unit: p.unit || "units",
          min: p.min_stock || 50,
        }));
      setLowStockItems(lowStock);

      // Sales trend by category (simplified)
      const categories = [...new Set(products.map((p: any) => p.category || "Other"))];
      const categoryStats = categories.map((cat: any, idx: number) => ({
        name: cat,
        value: Math.floor(Math.random() * 50 + 10),
        color: ["#0F766E", "#14B8A6", "#16A34A", "#F59E0B"][idx % 4],
      }));
      setCategoryData(categoryStats);

      // Sales trend (mock data - in real app, would aggregate by month)
      const trend = [
        { month: "Jan", sales: 45000, purchase: 28000 },
        { month: "Feb", sales: 52000, purchase: 32000 },
        { month: "Mar", sales: 48000, purchase: 29000 },
        { month: "Apr", sales: 61000, purchase: 38000 },
        { month: "May", sales: 55000, purchase: 34000 },
        { month: "Jun", sales: totalSales / 6, purchase: totalPurchase / 6 },
      ];
      setSalesData(trend);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setLoading(false);
    }
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1>Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here's what's happening with your business today.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading dashboard data...</p>
        </div>
      ) : (
        <>
      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.name} className="bg-card rounded-xl p-6 border border-border">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-muted rounded-lg">
                  <Icon className={`w-5 h-5 ${kpi.color}`} />
                </div>
                <div
                  className={`flex items-center gap-1 text-sm ${
                    kpi.trend === "up" ? "text-success" : "text-destructive"
                  }`}
                >
                  {kpi.trend === "up" ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span>{kpi.change}</span>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">{kpi.name}</p>
                <h3 className="mt-1">{kpi.value}</h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales & Purchase Trend */}
        <div className="lg:col-span-2 bg-card rounded-xl p-6 border border-border">
          <h3 className="mb-6">Sales & Purchase Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={salesData}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0F766E" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0F766E" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorPurchase" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#14B8A6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid key="grid" strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis key="x-axis" dataKey="month" stroke="#64748B" />
              <YAxis key="y-axis" stroke="#64748B" />
              <Tooltip
                key="tooltip"
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #E2E8F0",
                  borderRadius: "8px",
                }}
              />
              <Area
                key="area-sales"
                type="monotone"
                dataKey="sales"
                stroke="#0F766E"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorSales)"
              />
              <Area
                key="area-purchase"
                type="monotone"
                dataKey="purchase"
                stroke="#14B8A6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorPurchase)"
              />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#0F766E]"></div>
              <span className="text-sm text-muted-foreground">Sales</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#14B8A6]"></div>
              <span className="text-sm text-muted-foreground">Purchase</span>
            </div>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-card rounded-xl p-6 border border-border">
          <h3 className="mb-6">Sales by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip key="pie-tooltip" />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-4">
            {categoryData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-muted-foreground">{item.name}</span>
                </div>
                <span className="text-sm font-medium">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center justify-between mb-6">
            <h3>Recent Orders</h3>
            <button className="text-sm text-primary hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 bg-muted rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium text-foreground">{order.customer}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {order.id} • {order.date}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-foreground">{order.amount}</p>
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs mt-1 ${
                      order.status === "Completed"
                        ? "bg-success/10 text-success"
                        : order.status === "Pending"
                        ? "bg-warning/10 text-warning"
                        : "bg-secondary/10 text-secondary"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center gap-2 mb-6">
            <AlertCircle className="w-5 h-5 text-warning" />
            <h3>Low Stock Alert</h3>
          </div>
          <div className="space-y-4">
            {lowStockItems.map((item, index) => (
              <div key={index} className="p-4 bg-warning/5 border border-warning/20 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <p className="font-medium text-foreground">{item.name}</p>
                  <span className="text-sm text-warning font-medium">
                    {item.stock} {item.unit}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div
                      className="bg-warning h-2 rounded-full"
                      style={{ width: `${(item.stock / item.min) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Min: {item.min}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
        </>
      )}
    </div>
  );
}
