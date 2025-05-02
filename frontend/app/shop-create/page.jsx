
import ProtectedRoute from "@/pages/ProtectedRoute";
import ShopCreate from "../../pages/ShopPages/ShopCreate";

export default function Payment() {
  return (
    <ProtectedRoute>
      <ShopCreate />
    </ProtectedRoute>
  );
}