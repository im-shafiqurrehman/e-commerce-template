import OrderDetailPage from "@/pages/OrderDetailPage";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function OrderDetailPageWrapper({ params }) {
  return (
    <ProtectedRoute>
    <OrderDetailPage orderId={params.id} />;
    </ProtectedRoute>
  );
}