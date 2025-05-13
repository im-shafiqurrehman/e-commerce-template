
import SellerProtectedRoute from "@/pages/ShopPages/SellerProtectedRoute";
import DashAllProducts from "../../pages/ShopDashBoard/DashAllProducts";

export default function DashboardProducts() {
  return (
    <SellerProtectedRoute>
      <DashAllProducts />
    </SellerProtectedRoute>
  );
}