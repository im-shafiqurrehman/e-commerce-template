import ShopSettingPage from "@/pages/ShopPages/ShopSettingPage";
import SellerProtectedRoute from "@/pages/ShopPages/SellerProtectedRoute";

export default function Settings() {
  return (
    <SellerProtectedRoute>
      <ShopSettingPage />
    </SellerProtectedRoute>
  );
}