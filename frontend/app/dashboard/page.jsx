import ShopDashBoard from "@/pages/ShopDashBoard/ShopDashBoard";
import SellerProtectedRoute from "@/pages/ShopPages/SellerProtectedRoute";

export default function Dashboard() {
  return (
    <SellerProtectedRoute>
      <ShopDashBoard />
    </SellerProtectedRoute>
  );
}