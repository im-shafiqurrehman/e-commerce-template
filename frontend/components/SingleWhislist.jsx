import { IoClose, IoCartOutline } from "react-icons/io5";
import { backend_url } from "../lib/server";

function SingleWhislist({ data, removeFromWishlistHandler, handleAddToCart }) {
  return (
    <div className="border-b p-4">
      <div className="flex w-full items-center gap-4">
        <div
          className="cursor-pointer"
          onClick={() => removeFromWishlistHandler(data)}
        >
          <IoClose />
        </div>
        <div className="min-w-20">
          <img
            src={`${backend_url}/${data.images[0]}`}
            className="h-20 w-20 object-contain"
            alt=""
          />
        </div>
        <div className="flex w-full items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold">{data.name}</h2>
            <h3 className="text-lg font-semibold text-[#d02222]">
              ${data.discountPrice}
            </h3>
          </div>
          <div className="cursor-pointer">
            <IoCartOutline
              size={22}
              title="Add to cart"
              onClick={() => handleAddToCart(data)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SingleWhislist;
