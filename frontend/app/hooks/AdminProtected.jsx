// components/AdminProtected.jsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export const AdminProtected = ({ children }) => {
  const { user } = useSelector((state) => state.user);
  const router = useRouter();

  useEffect(() => {
    if (!user || user?.role !== "admin") {
      router.push("/");
    }
  }, [user, router]);

  if (user?.role === "admin") {
    return children;
  }

  // Return null or loading spinner while checking auth status
  return null;
};