import ShopCoupounsCode from "../../pages/ShopDashBoard/ShopCouponsCode";
import SellerProtectedRoute from "@/pages/ShopPages/SellerProtectedRoute";

export default function DashboardCoupouns() {
  return (
    <SellerProtectedRoute>
      <ShopCoupounsCode />
    </SellerProtectedRoute>
  );
}