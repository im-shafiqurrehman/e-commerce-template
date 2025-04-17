import DashAllOrders from "@/pages/ShopDashBoard/DashAllOrders";
import SellerProtectedRoute from "@/pages/ShopPages/SellerProtectedRoute";

export default function DashboardOrders() {
  return (
    <SellerProtectedRoute>
      <DashAllOrders />
    </SellerProtectedRoute>
  );
}