import OrderDetailPage from "@/pages/OrderDetailPage";
import ProtectedRoute from "@/pages/ProtectedRoute";

export default function OrderDetailPageWrapper({ params }) {
  return (
    <ProtectedRoute>
    <OrderDetailPage orderId={params.id} />;
    </ProtectedRoute>
  );
}