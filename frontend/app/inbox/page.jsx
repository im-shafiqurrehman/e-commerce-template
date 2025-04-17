import UserInbox from "@/components/ProfilePageComponents/UserInbox";
import ProtectedRoute from "@/pages/ProtectedRoute";

export default function Inbox() {
  return (
    <ProtectedRoute>
      <UserInbox />
    </ProtectedRoute>
  );
}