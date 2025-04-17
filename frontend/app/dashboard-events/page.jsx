import DashAllEvents from "@/pages/ShopDashBoard/DashAllEvents";
import SellerProtectedRoute from "@/pages/ShopPages/SellerProtectedRoute";

export default function DashboardEvents() {
  return (
    <SellerProtectedRoute>
      <DashAllEvents />
    </SellerProtectedRoute>
  );
}