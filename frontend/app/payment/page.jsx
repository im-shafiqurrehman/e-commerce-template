"use client";

import PaymentPage from "@/pages/PaymentPage";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Payment() {
  return (
    <ProtectedRoute>
      <PaymentPage />
    </ProtectedRoute>
  );
}