//app/admin/page.jsx
"use client";

import DashAllEvents from "@/pages/ShopDashBoard/DashAllEvents";
import SellerProtectedRoute from "@/pages/ShopPages/SellerProtectedRoute";
import { AdminProtected } from "@/components/AdminProtected"; 

export default function DashboardEvents() {
  return (
    <AdminProtected>
      <SellerProtectedRoute>
        <DashAllEvents />
      </SellerProtectedRoute>
    </AdminProtected>
  );
}