
import DashAllRefunds from "@/pages/ShopDashBoard/DashAllRefunds";
import SellerProtectedRoute from "@/pages/ShopPages/SellerProtectedRoute";

export default function DashboardRefunds() {
  return (
    <SellerProtectedRoute>
      <DashAllRefunds />
    </SellerProtectedRoute>
  );
}