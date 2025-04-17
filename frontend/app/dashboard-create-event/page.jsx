import ShopCreateEvent from "@/pages/ShopDashBoard/ShopCreateEvent";
import SellerProtectedRoute from "@/pages/ShopPages/SellerProtectedRoute";

export default function DashboardCreateEvent() {
  return (
    <SellerProtectedRoute>
      <ShopCreateEvent />
    </SellerProtectedRoute>
  );
}