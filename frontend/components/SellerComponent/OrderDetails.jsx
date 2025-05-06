"use client";

import { useEffect, useState } from "react";
import { BsFillBagFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import { backend_url, server } from "../../lib/server";
import axios from "axios";
import { toast } from "react-toastify";
import Image from "next/image";

function OrderDetails() {
  const { orders, isLoading } = useSelector((state) => state.orders);
  const { seller } = useSelector((state) => state.seller);
  const [status, setStatus] = useState();

  const params = useParams();
  const id = params.id;
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch(getAllOrdersOfShop(seller._id));
  }, [dispatch, seller._id]);

  const data = orders && orders.find((item) => item._id === id);

  const handleUpdateOrder = async () => {
    await axios
      .put(
        `${server}/order/update-order-status/${id}`,
        {
          status,
        },
        { withCredentials: true },
      )
      .then((res) => {
        toast.success("Order updated!");
        router.push("/dashboard-orders");
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  const refundOrderUpdateHandler = async () => {
    await axios
      .put(
        `${server}/order/order-refund-success/${id}`,
        {
          status,
        },
        { withCredentials: true },
      )
      .then((res) => {
        toast.success("Order updated!");
        dispatch(getAllOrdersOfShop(seller._id));
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  return (
    <div className="section min-h-screen py-4 pb-10">
      <div className="flex items-center justify-between gap-4 py-4">
        <div className="flex items-center gap-2">
          <BsFillBagFill size={30} color="crimson" />
          <h1 className="text-xl font-semibold">Order Details</h1>
        </div>
        <div className="">
          <Link href="/dashboard-orders">
            <button className="rounded-md bg-[#fce1e6] px-6 py-2 text-lg font-semibold text-[#e94560]">
              Order List
            </button>
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 pb-8">
        <h5 className="flex items-center gap-1 text-gray-600">
          Order ID: <span>#{data && data._id}</span>
        </h5>
        <h5 className="flex items-center gap-1 text-gray-600">
          Placed On: <span>{data && data.createdAt.slice(0, 10)}</span>
        </h5>
      </div>

      {/* order items */}
      {data &&
        data?.cart.map((item, index) => (
          <div key={index} className="mb-5 flex w-full items-start gap-4">
            <div className="flex items-center justify-center bg-white">
              <Image
                src={
                  item.images[0]
                    ? `${backend_url}/${item.images[0]}`
                    : "/assets/fallback-image.png"
                }
                className="h-20 w-20 bg-white object-contain"
                alt={item.name || "Product"}
                width={80}
                height={80}
              />
            </div>
            <div className="w-full">
              <h5>{item?.name}</h5>
              <h5 className="text-sm text-gray-500">
                ${item?.discountPrice} * {item?.qty}
              </h5>
            </div>
          </div>
        ))}

      <div className="w-full border-t border-black pt-4 text-right">
        <h5 className="text-lg">
          Total Price: <strong>${data?.totalPrice}</strong>
        </h5>
      </div>
      <br />

      <div className="w-full items-start md:flex">
        <div className="w-full md:w-3/5">
          <h4 className="pt-3 text-lg font-semibold">Shipping Address:</h4>
          <h4 className="pt-3 text-lg">
            {data?.shippingAddress.address1 +
              " " +
              data?.shippingAddress.address2}
          </h4>
          <h4 className="text-lg">{data?.shippingAddress.country}</h4>
          <h4 className="text-lg">{data?.shippingAddress.city}</h4>
          <h4 className="text-lg">{data?.user?.phoneNumber}</h4>
        </div>
        <div className="w-full md:w-2/5">
          <h4 className="py-3 text-lg font-semibold">Payment Info:</h4>
          <h4>
            Status:{" "}
            {data?.paymentInfo?.status ? data?.paymentInfo?.status : "Not Paid"}
          </h4>
        </div>
      </div>

      <br />

      <h4 className="py-3 text-lg font-semibold">Order Status</h4>
      {data?.status !== "Processing refund" &&
        data?.status !== "Refund Success" && (
          <select
            className="w-full max-w-60 rounded-md p-2"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {[
              "Processing",
              "Transferred to delivery partner",
              "Shipping",
              "Received",
              "On the way",
              "Delivered",
            ]
              .slice(
                [
                  "Processing",
                  "Transferred to delivery partner",
                  "Shipping",
                  "Received",
                  "On the way",
                  "Delivered",
                ].indexOf(data?.status),
              )
              .map((option, index) => (
                <option value={option} key={index}>
                  {option}
                </option>
              ))}
          </select>
        )}

      {data?.status === "Processing refund" ||
      data?.status === "Refund Success" ? (
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full max-w-60 rounded-md p-2"
        >
          {["Processing refund", "Refund Success"]
            .slice(
              ["Processing refund", "Refund Success"].indexOf(data?.status),
            )
            .map((option, index) => (
              <option value={option} key={index}>
                {option}
              </option>
            ))}
        </select>
      ) : null}

      <button
        className="my-4 block rounded-md bg-[#fce1e6] px-4 py-2 font-semibold text-[#e94560]"
        onClick={
          data?.status !== "Processing refund"
            ? handleUpdateOrder
            : refundOrderUpdateHandler
        }
      >
        Update Status
      </button>
    </div>
  );
}

export default OrderDetails;