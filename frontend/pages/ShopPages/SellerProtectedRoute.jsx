"use client"; // Added because of useEffect and useRouter

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation"; // Added useRouter for redirecting in Next.js
import Loader from "@/components/Loader";

const SellerProtectedRoute = ({ children }) => {
  const { isLoading, isSeller } = useSelector((state) => state.seller);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isSeller) {
      router.push("/shop-login"); // Replaced Navigate with router.push
    }
  }, [isLoading, isSeller, router]);

  if (isLoading) {
    return <Loader />;
  }

  if (!isSeller) {
    return null; // Return null while redirecting
  }

  return children;
};

export default SellerProtectedRoute;