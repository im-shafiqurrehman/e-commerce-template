"use client";

import { RxPerson } from "react-icons/rx";
import { HiOutlineReceiptRefund, HiOutlineShoppingBag } from "react-icons/hi";
import { AiOutlineLogin, AiOutlineMessage } from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";
import { MdOutlineTrackChanges } from "react-icons/md";
import { TbAddressBook } from "react-icons/tb";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axios from "axios";
import { server } from "../../lib/server";

// Props:
// - active: Number indicating the active menu item
// - setActive: Function to set the active menu item
function ProfileSidebar({ active, setActive }) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await axios.get(`${server}/user/logout`, {
        withCredentials: true,
      });
      toast.success(res.data.message);
      router.push("/login");
      // Removed window.location.reload() to avoid full page refresh
    } catch (error) {
      console.log(error.message);
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  return (
    <div className="md:mr-6 w-full rounded-lg bg-white p-4 shadow-sm sticky top-32 md:top-20">
      <div
        className="flex w-full cursor-pointer items-center gap-3 rounded-md px-2 py-3 transition-all"
        onClick={() => setActive(1)}
      >
        <RxPerson size={20} color={active === 1 ? "red" : ""} />
        <span
          className={`${
            active === 1 ? "font-semibold text-red-600" : ""
          } hidden md:block`}
        >
          Person
        </span>
      </div>

      <div
        className="flex w-full cursor-pointer items-center gap-3 rounded-md px-2 py-3 transition-all"
        onClick={() => setActive(2)}
      >
        <HiOutlineShoppingBag size={20} color={active === 2 ? "red" : ""} />
        <span
          className={`${
            active === 2 ? "font-semibold text-red-600" : ""
          } hidden md:block`}
        >
          Orders
        </span>
      </div>

      <div
        className="flex w-full cursor-pointer items-center gap-3 rounded-md px-2 py-3 transition-all"
        onClick={() => setActive(3)}
      >
        <HiOutlineReceiptRefund size={20} color={active === 3 ? "red" : ""} />
        <span
          className={`${
            active === 3 ? "font-semibold text-red-600" : ""
          } hidden md:block`}
        >
          Refunds
        </span>
      </div>

      <div
        className="flex w-full cursor-pointer items-center gap-3 rounded-md px-2 py-3 transition-all"
        onClick={() => {
          setActive(4);
          router.push("/inbox");
        }}
      >
        <AiOutlineMessage size={20} color={active === 4 ? "red" : ""} />
        <span
          className={`${
            active === 4 ? "font-semibold text-red-600" : ""
          } hidden md:block`}
        >
          Inbox
        </span>
      </div>

      <div
        className="flex w-full cursor-pointer items-center gap-3 rounded-md px-2 py-3 transition-all"
        onClick={() => setActive(5)}
      >
        <MdOutlineTrackChanges size={20} color={active === 5 ? "red" : ""} />
        <span
          className={`${
            active === 5 ? "font-semibold text-red-600" : ""
          } hidden md:block`}
        >
          Track Order
        </span>
      </div>

      <div
        className="flex w-full cursor-pointer items-center gap-3 rounded-md px-2 py-3 transition-all"
        onClick={() => setActive(6)}
      >
        <RiLockPasswordLine size={20} color={active === 6 ? "red" : ""} />
        <span
          className={`${
            active === 6 ? "font-semibold text-red-600" : ""
          } hidden md:block`}
        >
          Change Password
        </span>
      </div>

      <div
        className="flex w-full cursor-pointer items-center gap-3 rounded-md px-2 py-3 transition-all"
        onClick={() => setActive(7)}
      >
        <TbAddressBook size={20} color={active === 7 ? "red" : ""} />
        <span
          className={`${
            active === 7 ? "font-semibold text-red-600" : ""
          } hidden md:block`}
        >
          Address
        </span>
      </div>

      <div
        className="flex w-full cursor-pointer items-center gap-3 rounded-md px-2 py-3 transition-all hover:text-red-600"
        onClick={handleLogout}
      >
        <AiOutlineLogin size={20} />
        <span className="font-semibold hidden md:block">Logout</span>
      </div>
    </div>
  );
}

export default ProfileSidebar;