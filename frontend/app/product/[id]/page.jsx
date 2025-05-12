"use client"

import { use } from "react"
import ProductDetails from "@/pages/ProductDetails"

export default function ProductDetailsPage({ params }) {
  // Use React.use to unwrap the params Promise
  const unwrappedParams = use(params)

  return <ProductDetails id={unwrappedParams.id} />
}
