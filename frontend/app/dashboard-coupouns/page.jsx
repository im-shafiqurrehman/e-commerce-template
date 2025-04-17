import ShopCoupounsCode from "@/pages/ShopDashBoard/ShopCoupounsCode";
import SellerProtectedRoute from "@/pages/ShopPages/SellerProtectedRoute";

export default function DashboardCoupouns() {
  return (
    <SellerProtectedRoute>
      <ShopCoupounsCode />
    </SellerProtectedRoute>
  );
}