"use client"

import { useEffect, useState } from "react"
import { BsFillBagFill } from "react-icons/bs"
import { useDispatch, useSelector } from "react-redux"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { getAllOrdersOfShop } from "../../redux/actions/order"
import { backend_url, server } from "../../lib/server"
import axios from "axios"
import { toast } from "react-toastify"
import Image from "next/image"

function OrderDetails() {
  const { orders, isLoading } = useSelector((state) => state.orders)
  const { seller } = useSelector((state) => state.seller)
  const [status, setStatus] = useState()

  const params = useParams()
  const id = params.id
  const dispatch = useDispatch()
  const router = useRouter()

  useEffect(() => {
    dispatch(getAllOrdersOfShop(seller._id))
  }, [dispatch, seller._id])

  const data = orders && orders.find((item) => item._id === id)

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
        toast.success("Order updated!")
        router.push("/dashboard-orders")
      })
      .catch((error) => {
        toast.error(error.response.data.message)
      })
  }

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
        toast.success("Order updated!")
        dispatch(getAllOrdersOfShop(seller._id))
      })
      .catch((error) => {
        toast.error(error.response.data.message)
      })
  }

  return (
    <div className="section min-h-screen py-6 px-4 max-w-6xl mx-auto">
      <div className="flex items-center justify-between gap-4 py-4 border-b border-gray-200 mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-red-50 p-2 rounded-full">
            <BsFillBagFill size={24} color="#e94560" />
          </div>
          <h1 className="text-xl font-semibold text-gray-800">Order Details</h1>
        </div>
        <div>
          <Link href="/dashboard-orders">
            <button className="rounded-md bg-[#fce1e6] hover:bg-[#f8d0d8] transition-colors px-6 py-2.5 text-sm font-semibold text-[#e94560] shadow-sm">
              Order List
            </button>
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 pb-6">
        <h5 className="flex items-center gap-1 text-gray-600 text-sm">
          Order ID: <span className="font-medium text-gray-800">#{data && data._id}</span>
        </h5>
        <h5 className="flex items-center gap-1 text-gray-600 text-sm">
          Placed On: <span className="font-medium text-gray-800">{data && data.createdAt.slice(0, 10)}</span>
        </h5>
      </div>

      {/* order items */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
        <h3 className="text-lg font-medium mb-4 text-gray-800">Order Items</h3>
        {data &&
          data?.cart.map((item, index) => (
            <div
              key={index}
              className="mb-4 flex w-full items-start gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
            >
              <div className="flex items-center justify-center bg-gray-50 rounded-md p-2">
                <Image
                  src={item.images[0] ? `${backend_url}/${item.images[0]}` : "/assets/fallback-image.png"}
                  className="h-20 w-20 object-contain"
                  alt={item.name || "Product"}
                  width={80}
                  height={80}
                />
              </div>
              <div className="w-full">
                <h5 className="font-medium text-gray-800">{item?.name}</h5>
                <h5 className="text-sm text-gray-500 mt-1">
                  PKR {item?.discountPrice} × {item?.qty}
                </h5>
              </div>
            </div>
          ))}

        <div className="w-full border-t border-gray-200 pt-4 text-right">
          <h5 className="text-lg">
            Total Price: <strong className="text-[#e94560]">PKR {data?.totalPrice}</strong>
          </h5>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <h4 className="text-lg font-medium mb-3 text-gray-800">Shipping Address</h4>
          <div className="space-y-2 text-gray-700">
            <p>{data?.shippingAddress?.address1 + " " + data?.shippingAddress?.address2}</p>
            <p>{data?.shippingAddress?.country}</p>
            <p>{data?.shippingAddress?.city}</p>
            <p>{data?.user?.phoneNumber}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <h4 className="text-lg font-medium mb-3 text-gray-800">Payment Info</h4>
          <div className="space-y-2 text-gray-700">
            <p>
              Status:{" "}
              <span
                className={
                  data?.paymentInfo?.status === "Paid" ? "text-green-600 font-medium" : "text-amber-600 font-medium"
                }
              >
                {data?.paymentInfo?.status ? data?.paymentInfo?.status : "Not Paid"}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
        <h4 className="text-lg font-medium mb-4 text-gray-800">Order Status</h4>

        {data?.status !== "Processing refund" && data?.status !== "Refund Success" && (
          <select
            className="w-full max-w-xs rounded-md border border-gray-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-[#e94560] focus:border-[#e94560]"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {["Processing", "Transferred to delivery partner", "Shipping", "Received", "On the way", "Delivered"]
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

        {data?.status === "Processing refund" || data?.status === "Refund Success" ? (
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full max-w-xs rounded-md border border-gray-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-[#e94560] focus:border-[#e94560]"
          >
            {["Processing refund", "Refund Success"]
              .slice(["Processing refund", "Refund Success"].indexOf(data?.status))
              .map((option, index) => (
                <option value={option} key={index}>
                  {option}
                </option>
              ))}
          </select>
        ) : null}

        <button
          className="mt-4 ml-2 rounded-md bg-[#e94560] hover:bg-[#d03a53] transition-colors px-6 py-2.5 font-medium text-white shadow-sm"
          onClick={data?.status !== "Processing refund" ? handleUpdateOrder : refundOrderUpdateHandler}
        >
          Update Status
        </button>
      </div>
    </div>
  )
}

export default OrderDetails
