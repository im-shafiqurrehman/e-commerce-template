"use client"

import { AdminProtected } from "../../hooks/AdminProtected"
import AllWithdraw from "../../../components/Admin/AllWithdraw"

export default function AdminWithdrawPage() {
  return (
    <AdminProtected>
      <AllWithdraw />
    </AdminProtected>
  )
}
