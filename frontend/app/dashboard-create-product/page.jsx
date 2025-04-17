import ShopCreateProduct from "@/pages/ShopDashBoard/ShopCreateProduct";
import SellerProtectedRoute from "@/pages/ShopPages/SellerProtectedRoute";

export default function DashboardCreateProduct() {
  return (
    <SellerProtectedRoute>
      <ShopCreateProduct />
    </SellerProtectedRoute>
  );
}