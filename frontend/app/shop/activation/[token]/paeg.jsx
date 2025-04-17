"use client";

import SellerActivation from "@/pages/ShopPages/SellerActivation";

export default function SellerActivationPage({ params }) {
  return <SellerActivation token={params.token} />;
}