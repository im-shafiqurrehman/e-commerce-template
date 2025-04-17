import TrackOrderPage from "@/pages/TrackOrderPage";
import ProtectedRoute from "@/pages/ProtectedRoute";

export default function TrackOrder() {
  return (
    <ProtectedRoute>
      <TrackOrderPage />
    </ProtectedRoute>
  );
}