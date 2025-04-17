"use client";

import { useEffect, useState } from "react";
import { AiOutlineArrowRight, AiOutlineMoneyCollect } from "react-icons/ai";
import { MdBorderClear } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import Link from "next/link";
import { getAllOrdersOfShop } from "@/redux/actions/order";
import { getAllShopProducts } from "@/redux/actions/product";
import Loader from "../../Loader";

function DashBoardHero() {
  const dispatch = useDispatch();
  const { orders, isLoading } = useSelector((state) => state.orders);
  const { seller } = useSelector((state) => state.seller);
  const { products } = useSelector((state) => state.products);
  const [deliveredOrder, setDeliveredOrder] = useState(null);

  useEffect(() => {
    dispatch(getAllOrdersOfShop(seller._id));
    dispatch(getAllShopProducts(seller._id));

    const orderData =
      orders && orders.filter((item) => item.status === "Delivered");
    setDeliveredOrder(orderData);
  }, [dispatch, seller._id, orders]);

  const totalEarningWithoutTax =
    deliveredOrder &&
    deliveredOrder.reduce((acc, item) => acc + item.totalPrice, 0);

  const serviceCharge = totalEarningWithoutTax * 0.1;
  const availableBalance = (totalEarningWithoutTax - serviceCharge).toFixed(2);

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) => {
        return params.row.status === "Delivered" ? "greenColor" : "redColor";
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },
    {
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <Link href={`/order/${params.id}`}>
            <Button variant="contained" color="primary">
              <AiOutlineArrowRight size={20} />
            </Button>
          </Link>
        );
      },
    },
  ];

  const rows =
    orders?.map((item) => ({
      id: item._id,
      itemsQty: item.cart.reduce((acc, item) => acc + item.qty, 0),
      total: "US$ " + item.totalPrice,
      status: item.status,
    })) || [];

  return (
    <div className="w-full bg-gray-100 p-8">
      <h3 className="pb-4 text-center font-Poppins text-[24px]">
        Dashboard Overview
      </h3>
      <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg bg-white p-6 shadow-md">
          <div className="mb-4 flex items-center">
            <AiOutlineMoneyCollect size={30} className="mr-2 text-blue-500" />
            <h3 className="font-Roboto text-[20px] font-medium text-[#333]">
              Account Balance
            </h3>
          </div>
          <h5 className="text-[22px] font-semibold">${availableBalance}</h5>
          <Link
            href="/dashboard/withdraw-money"
            className="mt-4 inline-block text-blue-500"
          >
            Withdraw Money
          </Link>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-md">
          <div className="mb-4 flex items-center">
            <MdBorderClear size={30} className="mr-2 text-green-500" />
            <h3 className="font-Roboto text-[20px] font-medium text-[#333]">
              All Orders
            </h3>
          </div>
          <h5 className="text-[22px] font-semibold">
            {orders && orders.length}
          </h5>
          <Link
            href="/dashboard/orders"
            className="mt-4 inline-block text-green-500"
          >
            View Orders
          </Link>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-md">
          <div className="mb-4 flex items-center">
            <AiOutlineMoneyCollect size={30} className="mr-2 text-red-500" />
            <h3 className="font-Roboto text-[20px] font-medium text-[#333]">
              All Products
            </h3>
          </div>
          <h5 className="text-[22px] font-semibold">
            {products && products.length}
          </h5>
          <Link
            href="/dashboard/products"
            className="mt-4 inline-block text-red-500"
          >
            View Products
          </Link>
        </div>
      </div>
      <br />
      <h3 className="pb-4 text-center font-Poppins text-[24px]">
        Latest Orders
      </h3>
      <div className="w-full rounded-lg bg-white p-6 shadow-md">
        {isLoading ? (
          <Loader />
        ) : (
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            pageSizeOptions={[5]}
            checkboxSelection
            disableRowSelectionOnClick
          />
        )}
      </div>
    </div>
  );
}

export default DashBoardHero;