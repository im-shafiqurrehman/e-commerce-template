"use client";

import { AiOutlineArrowRight } from "react-icons/ai";
import Link from "next/link";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getAllOrdersOfUser } from "../../redux/actions/order";

function AllOrders() {
  const { user } = useSelector((state) => state.user);
  const { orders } = useSelector((state) => state.orders);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllOrdersOfUser(user._id));
  }, [dispatch, user._id]);

  const columns = [
    {
      field: "id",
      headerName: "Order ID",
      minWidth: 150,
      flex: 0.7,
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) => {
        return params.value === "Delivered" ? "greenColor" : "redColor";
      },
    },
    {
      field: "itemsQty",
      headerName: "Item Qty",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "Order Detail",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <Link href={`/user/order/${params.id}`}>
            <Button>
              <AiOutlineArrowRight size={20} />
            </Button>
          </Link>
        );
      },
    },
  ];

  const rows = orders
    ? orders.map((item) => ({
        id: item._id,
        itemsQty: item.cart.length,
        total: "US$ " + item.totalPrice,
        status: item.status,
      }))
    : [];

  return (
    <div className="w-full pl-6 pt-1 font-semibold">
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
    </div>
  );
}

export default AllOrders;