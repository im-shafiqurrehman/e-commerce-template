"use client"; // Required for client-side interactivity

import { useState, useEffect } from "react";
import { RxCross1 } from "react-icons/rx";
import {
  AiOutlineMessage,
  AiOutlineShoppingCart,
  AiFillHeart,
  AiOutlineHeart,
} from "react-icons/ai";
import { backend_url } from "../lib/server";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addTocartAction, removeFromCartAction } from "../redux/actions/cart";
import {
  addToWishlistAction,
  removeFromWishlistAction,
} from "../redux/actions/whishlist";

function ProductDetailsPopup({ setOpen, data }) {
  const { cart = [] } = useSelector((state) => state.cart);
  const { wishlist = [] } = useSelector((state) => state.wishlist);
  const [count, setCount] = useState(1);
  const [click, setClick] = useState(false);
  const [inCart, setInCart] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const isItemExists = cart.find((i) => i._id === data._id);
    setInCart(!!isItemExists);
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

  const decrementCount = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const incrementCount = () => {
    setCount(count + 1);
  };

  const handleCartButtonClick = () => {
    if (inCart) {
      dispatch(removeFromCartAction(data._id));
      setInCart(false);
    } else {
      if (data.stock < count) {
        toast.error("Product stock limited!");
      } else {
        const cartData = { ...data, qty: count };
        dispatch(addTocartAction(cartData));
        setInCart(true);
      }
    }
  };

  return (
    <div className="bg-white">
      {data && (
        <div className="fixed left-0 top-0 z-[400] flex h-screen w-full animate-fadeIn items-center justify-center bg-[#00000030]">
          <div className="custom-scrollbar relative h-[90vh] w-11/12 overflow-y-scroll rounded-md bg-white p-4 shadow-sm md:h-[75vh] md:max-w-2xl lg:w-3/5">
            <RxCross1
              size={30}
              className="absolute right-3 top-3 z-50 cursor-pointer"
              onClick={() => setOpen(false)}
            />
            <div className="block w-full gap-6 md:flex">
              {/* left */}
              <div className="w-full md:w-1/2">
                <div className="my-4 flex items-center justify-center">
                  <img
                    src={`${backend_url}/${data.images[0]}`}
                    className="w-60"
                    alt={data.name}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <div>
                    <img
                      src={`${backend_url}/${data?.shop?.avatar}`}
                      className="h-12 w-12 rounded-full"
                      alt={data.shop?.name}
                    />
                  </div>
                  <div>
                    <Link href={`/shop/preview/${data?.shop._id}`}>
                      <h3 className="text-[15px] text-blue-400">
                        {data.shop.name || "Unknown Shop"}
                      </h3>
                    </Link>
                    <h5 className="text-[15px]">4/5 ratings</h5>
                  </div>
                </div>
                {/* send message button */}
                <button
                  className="my-3 flex items-center gap-2 hover:cursor-pointer rounded-md bg-black px-5 py-3 text-white"
                  onClick={() => console.log("Message sent")}
                >
                  Send Message <AiOutlineMessage size={22} />
                </button>
                {/* sold out items */}
                <h6 className="text-base text-red-600">
                  ({data.sold_out}) sold out
                </h6>
              </div>
              {/* right */}
              <div className="w-full px-1.5 pt-5 md:w-1/2">
                <h1 className="text-[20px] font-semibold text-[#333]">
                  {data.name}
                </h1>
                <p className="pt-2">{data.description}</p>
                <div className="flex items-center pt-3">
                  <h5 className="font-Roboto text-[18px] font-bold text-[#333]">
                    {data.discountPrice
                      ? data.discountPrice
                      : data.originalPrice}
                    PKR
                  </h5>
                  {data.discountPrice && (
                    <h5 className="pl-2 text-[16px] font-[500] text-[#d55b45] line-through">
                      {data.originalPrice}PKR
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
                {/* add to cart / remove from cart button */}
                <button
                  className={`my-4 flex items-center gap-2 rounded-md px-5 py-3 text-white ${
                    inCart
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-black hover:bg-gray-800"
                  }`}
                  onClick={handleCartButtonClick}
                >
                  {inCart ? "Remove from cart" : "Add to cart"}{" "}
                  <AiOutlineShoppingCart size={22} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetailsPopup;