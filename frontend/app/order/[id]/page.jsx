import ShopOrderDetails from "@/pages/ShopPages/ShopOrderDetails";
import SellerProtectedRoute from "@/pages/ShopPages/SellerProtectedRoute";

export default function OrderDetails() {
  return (
    <SellerProtectedRoute>
      <ShopOrderDetails />
    </SellerProtectedRoute>
  );
}