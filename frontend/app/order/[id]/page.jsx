import ShopOrderDetails from ".../../../components/ShopPages/ShopOrderDetails";
import SellerProtectedRoute from "../../../components/ShopPages/SellerProtectedRoute";

export default function OrderDetails() {
  return (
    <SellerProtectedRoute>
      <ShopOrderDetails />
    </SellerProtectedRoute>
  );
}