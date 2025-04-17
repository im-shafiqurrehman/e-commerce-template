import ShopHomePage from "@/pages/ShopPages/ShopHomePage";
import SellerProtectedRoute from "@/pages/ShopPages/SellerProtectedRoute";

export default function ShopHome() {
  return (
    <SellerProtectedRoute>
      <ShopHomePage />
    </SellerProtectedRoute>
  );
}