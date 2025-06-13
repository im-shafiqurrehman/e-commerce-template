import TrackOrderPage from "@/pages/TrackOrderPage";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function TrackOrder() {
  return (
    <ProtectedRoute>
      <TrackOrderPage />
    </ProtectedRoute>
  );
}