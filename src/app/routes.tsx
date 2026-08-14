import { AuthGuard } from "./components/AuthGuard";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Dashboard } from "./components/Dashboard";
import { Inventory } from "./components/Inventory";
import { PurchaseEntry } from "./components/PurchaseEntry";
import { SalesBilling } from "./components/SalesBilling";
import { Customers } from "./components/Customers";
import { Suppliers } from "./components/Suppliers";
import { Bills } from "./components/Bills";
import { Reports } from "./components/Reports";
import { Settings } from "./components/Settings";
import { StaffManagement } from "./components/StaffManagement";
import { Profile } from "./components/Profile";
import { Login } from "./components/Login";


export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  
   {
  path: "/",
  element: (
    <AuthGuard>
      <Layout />
    </AuthGuard>
  ),
  children: [
      { index: true, Component: Dashboard },
      {
  path: "inventory",
  element: (
    <ProtectedRoute allowedRoles={["owner", "manager"]}>
      <Inventory />
    </ProtectedRoute>
  ),
},
      {
  path: "purchase",
  element: (
    <ProtectedRoute allowedRoles={["owner", "manager"]}>
      <PurchaseEntry />
    </ProtectedRoute>
  ),
},
      { path: "sales", Component: SalesBilling },
      { path: "customers", Component: Customers },
      {
  path: "suppliers",
  element: (
    <ProtectedRoute allowedRoles={["owner", "manager"]}>
      <Suppliers />
    </ProtectedRoute>
  ),
},
      { path: "bills", Component: Bills },
      {
  path: "reports",
  element: (
    <ProtectedRoute allowedRoles={["owner", "manager"]}>
      <Reports />
    </ProtectedRoute>
  ),
},
      {
  path: "settings",
  element: (
    <ProtectedRoute allowedRoles={["owner"]}>
      <Settings />
    </ProtectedRoute>
  ),
},
      {
  path: "staff",
  element: (
    <ProtectedRoute allowedRoles={["owner"]}>
      <StaffManagement />
    </ProtectedRoute>
  ),
},
      { path: "profile", Component: Profile },
    ],
  },
]);
