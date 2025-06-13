"use client";
import ProfilePage from "@/pages/ProfilePage";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Profile() {
  return (
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  );
}