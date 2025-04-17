"use client";

import ProductDetails from "@/pages/ProductDetails";

export default function ProductDetailsPage({ params }) {
  return <ProductDetails id={params.id} />;
}