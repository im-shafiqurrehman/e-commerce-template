import DashAllProducts from "@/pages/ShopDashBoard/DashAllProducts";
import SellerProtectedRoute from "@/pages/ShopPages/SellerProtectedRoute";

export default function DashboardProducts() {
  return (
    <SellerProtectedRoute>
      <DashAllProducts />
    </SellerProtectedRoute>
  );
}