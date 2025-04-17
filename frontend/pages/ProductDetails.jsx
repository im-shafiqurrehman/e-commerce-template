/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "next/navigation"; // Replaced react-router-dom's useSearchParams with next/navigation's useSearchParams
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import NewsLetter from "@/components/NewsLetter";
import ProductDetail from "@/components/ProductDetail";
import SuggestedProducts from "@/components/SuggestedProducts";
import Loader from "@/components/Loader";

function ProductDetails({ id }) { // Replaced useParams with id prop
  const { allProducts, isLoading } = useSelector((state) => state.products);
  const { allEvents } = useSelector((state) => state.events);
  const [product, setProduct] = useState(null);
  const searchParams = useSearchParams(); // Replaced useSearchParams from react-router-dom
  const eventData = searchParams.get("isEvent");

  useEffect(() => {
    if (eventData !== null) {
      const foundProduct = allEvents.find((product) => product._id === id);
      setProduct(foundProduct);
    } else {
      const foundProduct = allProducts.find((product) => product._id === id);
      setProduct(foundProduct);
    }
    window.scrollTo({ top: 0, behavior: "smooth" }); // Updated to use smooth scrolling
  }, [id, allProducts, allEvents, eventData]); // Removed dispatch from dependencies since it's not used

  if (isLoading) {
    return (
      <h1 className="p-6 text-center">
        <Loader />
      </h1>
    );
  }

  return (
    <div>
      <Header />
      {product ? (
        <>
          <ProductDetail data={product} />
          {!eventData && (
            <>
              <SuggestedProducts data={product} />
            </>
          )}
        </>
      ) : (
        <h1 className="p-6 text-center">Product not found!</h1>
      )}
      <NewsLetter />
      <Footer />
    </div>
  );
}

export default ProductDetails;