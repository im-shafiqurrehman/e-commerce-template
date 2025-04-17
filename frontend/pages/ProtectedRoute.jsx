"use client"; // Added "use client" since this component uses useEffect and useRouter

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation"; // Added useRouter for redirecting in Next.js

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.user);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login"); // Replaced Navigate with router.push
    }
  }, [loading, isAuthenticated, router]);

  if (loading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    return null; // Return null while redirecting
  }

  return children;
};

export default ProtectedRoute;