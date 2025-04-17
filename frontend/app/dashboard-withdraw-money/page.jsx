import DashWithDrawMoney from "@/pages/ShopDashBoard/DashWithDrawMoney";
import SellerProtectedRoute from "@/pages/ShopPages/SellerProtectedRoute";

export default function DashboardWithdrawMoney() {
  return (
    <SellerProtectedRoute>
      <DashWithDrawMoney />
    </SellerProtectedRoute>
  );
}