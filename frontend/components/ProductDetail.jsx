"use client";

import { useState, useEffect } from "react";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineMessage,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { MdOutlineRemoveShoppingCart } from "react-icons/md";
import ProductDetailInfo from "./ProductDetailInfo";
import { backend_url, server } from "../lib/server";
import Loader from "../components/Loader";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { addTocartAction, removeFromCartAction } from "../redux/actions/cart";
import {
  addToWishlistAction,
  removeFromWishlistAction,
} from "../redux/actions/wishlist";
import axios from "axios";
import { toast } from "react-toastify";

// Props:
// - data: Object containing product details (_id, images, name, description, originalPrice, discountPrice, shop, reviews)
function ProductDetail({ data }) {
  const [count, setCount] = useState(1);
  const [click, setClick] = useState(false);
  const [select, setSelect] = useState(0);
  const [inCart, setInCart] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();
  const cart = useSelector((state) => state.cart.cart);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const { wishlist = [] } = useSelector((state) => state.wishlist);
  const { products } = useSelector((state) => state.products);

  useEffect(() => {
    const isInCart = cart.some((item) => item._id === data._id);
    setInCart(isInCart);
    if (wishlist && wishlist.find((item) => item._id === data._id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [cart, data._id, wishlist]);

  const removeFromWishlistHandler = (data) => {
    setClick(!click);
    dispatch(removeFromWishlistAction(data));
  };

  const addFromWishlistHandler = (data) => {
    setClick(!click);
    dispatch(addToWishlistAction(data));
  };

  const handleMessageSubmit = async () => {
    if (isAuthenticated) {
      const groupTitle = data._id + user._id;
      const userId = user._id;
      const sellerId = data.shop._id;
      await axios
        .post(`${server}/conversation/create-new-conversation`, {
          groupTitle,
          userId,
          sellerId,
        })
        .then((res) => {
          router.push(`/conversation/${res.data.conversation._id}`);
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        });
    } else {
      toast.error("Please login to create a conversation");
    }
  };

  const decrementCount = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const incrementCount = () => {
    setCount(count + 1);
  };

  const handleCartClick = () => {
    if (inCart) {
      dispatch(removeFromCartAction(data._id));
    } else {
      dispatch(addTocartAction({ ...data, qty: count }));
    }
    setInCart(!inCart);
  };

  if (!data) {
    return (
      <h1 className="p-6 text-center">
        <Loader />
      </h1>
    );
  }

  const { images, name, description, originalPrice, discountPrice, shop } = data;

  // Ensure images array and shop are not empty
  if (!images || images.length === 0) {
    console.log("No images available for this product.");
  }

  const productReviewsLength =
    products &&
    products.reduce((acc, product) => acc + product.reviews.length, 0);

  const totalRatings =
    products &&
    products.reduce(
      (acc, product) =>
        acc + product.reviews.reduce((sum, review) => sum + review.rating, 0),
      0
    );

  const avg = totalRatings / productReviewsLength || 0;

  const averageRating = avg.toFixed(1);

  return (
    <div className="bg-white">
      {data ? (
        <div className="container mx-auto px-4">
          {/* product details */}
          <div className="w-full py-5">
            <div className="flex flex-col items-start gap-6 md:flex-row">
              {/* left section */}
              <div className="flex w-full flex-col items-center md:w-1/2">
                <Image
                  src={
                    images && images.length > 0
                      ? `${backend_url}/${images[select]}`
                      : "/assets/fallback-image.png"
                  }
                  className="mb-4 max-h-[350px] w-[80%] object-contain"
                  alt={name || "Product Image"}
                  width={400}
                  height={350}
                />
                <div className="flex w-full items-center justify-center gap-4 overflow-x-auto">
                  {images &&
                    images.map((i, index) => (
                      <div
                        key={index}
                        className={`${
                          select === index ? "border" : ""
                        } cursor-pointer`}
                      >
                        <Image
                          src={`${backend_url}/${i}`}
                          alt={`Thumbnail ${index + 1}`}
                          className="mr-3 mt-3 h-24 flex-shrink-0 overflow-hidden object-contain"
                          width={96}
                          height={96}
                          onClick={() => setSelect(index)}
                        />
                      </div>
                    ))}
                </div>
              </div>
              {/* right section */}
              <div className="w-full px-1.5 pt-5 md:w-1/2">
                <h1 className="font-Roboto text-2xl font-[600] text-[#333]">
                  {name || "Product Name"}
                </h1>
                <p className="pt-2">
                  {description || "No description available."}
                </p>
                <div className="flex items-center pt-3">
                  <h5 className="font-Roboto text-[18px] font-bold text-[#333]">
                    {discountPrice ? discountPrice : originalPrice}$
                  </h5>
                  {discountPrice && (
                    <h5 className="pl-2 text-[16px] font-[500] text-[#d55b45] line-through">
                      {originalPrice}$
                    </h5>
                  )}
                </div>
                <div className="mt-8 flex items-center justify-between pr-3">
                  <div>
                    <button
                      className="rounded-l bg-gradient-to-r from-teal-400 to-teal-500 px-4 py-2 font-bold text-white shadow-lg transition duration-300 ease-in-out hover:opacity-75"
                      onClick={decrementCount}
                    >
                      -
                    </button>
                    <span className="bg-gray-200 px-4 py-[11px] font-medium text-gray-800">
                      {count}
                    </span>
                    <button
                      className="rounded-r bg-gradient-to-r from-teal-400 to-teal-500 px-4 py-2 font-bold text-white shadow-lg transition duration-300 ease-in-out hover:opacity-75"
                      onClick={incrementCount}
                    >
                      +
                    </button>
                  </div>
                  <div>
                    {click ? (
                      <AiFillHeart
                        size={30}
                        className="cursor-pointer"
                        onClick={() => removeFromWishlistHandler(data)}
                        color="red"
                        title="Remove from wishlist"
                      />
                    ) : (
                      <AiOutlineHeart
                        size={30}
                        className="cursor-pointer"
                        onClick={() => addFromWishlistHandler(data)}
                        color="#333"
                        title="Add to wishlist"
                      />
                    )}
                  </div>
                </div>
                {/* add to cart button */}
                <button
                  className={`my-4 flex items-center gap-2 rounded-md bg-black px-5 py-3 text-white ${
                    inCart
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-black hover:bg-gray-800"
                  } `}
                  onClick={handleCartClick}
                >
                  {inCart ? (
                    <>
                      Remove from cart <MdOutlineRemoveShoppingCart size={22} />
                    </>
                  ) : (
                    <>
                      Add to cart <AiOutlineShoppingCart size={22} />
                    </>
                  )}
                </button>
                <div className="my-8 flex flex-wrap items-center gap-2 sm:flex-nowrap sm:gap-6">
                  <div className="flex items-center gap-2">
                    <div>
                      <Image
                        src={
                          shop?.avatar
                            ? `${backend_url}/${shop.avatar}`
                            : "/assets/fallback-image.png"
                        }
                        className="h-12 w-12 rounded-full"
                        alt={shop?.name || "Shop Avatar"}
                        width={48}
                        height={48}
                      />
                    </div>
                    <div>
                      <Link href={`/shop/preview/${data?.shop._id}`}>
                        <h3 className="text-[15px] text-blue-400">
                          {shop?.name || "Unknown Shop"}
                        </h3>
                      </Link>
                      <h5 className="text-[15px]">{averageRating} Ratings</h5>
                    </div>
                  </div>
                  {/* send message button */}
                  <button
                    className="my-3 flex items-center gap-2 rounded-md bg-indigo-800 px-5 py-3 text-white"
                    onClick={handleMessageSubmit}
                  >
                    Send Message <AiOutlineMessage size={22} />
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* product detail info */}
          <ProductDetailInfo data={data} />
        </div>
      ) : (
        <h1 className="p-6 text-center">Product not found!</h1>
      )}
    </div>
  );
}

export default ProductDetail;