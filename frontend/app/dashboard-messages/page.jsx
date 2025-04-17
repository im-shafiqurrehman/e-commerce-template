import ShopInboxPage from "@/pages/ShopDashBoard/ShopInboxPage";
import SellerProtectedRoute from "@/pages/ShopPages/SellerProtectedRoute";

export default function DashboardMessages() {
  return (
    <SellerProtectedRoute>
      <ShopInboxPage />
    </SellerProtectedRoute>
  );
}