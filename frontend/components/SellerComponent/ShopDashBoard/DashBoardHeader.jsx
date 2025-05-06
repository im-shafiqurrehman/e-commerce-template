"use client";

import { AiOutlineGift } from "react-icons/ai";
import { BiMessageSquareDetail } from "react-icons/bi";
import { MdOutlineLocalOffer } from "react-icons/md";
import { FiPackage, FiShoppingBag } from "react-icons/fi";
import { useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import { backend_url } from "@/lib/server";
import logo from "../../../public/assets/logo1.png";

function DashBoardHeader() {
  const { seller } = useSelector((state) => state.seller);
  return (
    <div className="sticky top-0 z-50 h-20 w-full bg-white shadow-sm">
      <div className="flex h-20 items-center justify-between px-4">
        {/* logo */}
        <div className="">
        <Link href="/">
              <Image
                src={logo}
                alt="Logo"
                width={100}
                height={10}
                className="w-[120px] md:w-[100px]"
              />
            </Link>
        </div>
        {/* dashboard navbar icons */}
        <div className="flex items-center gap-10">
          <Link href="/dashboard/coupons" className="hidden md:block">
            <AiOutlineGift size={30} color="#555" />
          </Link>
          <Link href="/dashboard/events" className="hidden md:block">
            <MdOutlineLocalOffer size={30} color="#555" />
          </Link>
          <Link href="/dashboard/products" className="hidden md:block">
            <FiShoppingBag size={30} color="#555" />
          </Link>
          <Link href="/dashboard/orders" className="hidden md:block">
            <FiPackage size={30} color="#555" />
          </Link>
          <Link href="/dashboard/messages" className="hidden md:block">
            <BiMessageSquareDetail size={30} color="#555" />
          </Link>
          <Link href={`/shop/${seller._id}`}>
            <Image
              src={
                seller.avatar
                  ? `${backend_url}/${seller.avatar}`
                  : "/assets/fallback-avatar.png"
              }
              className="h-10 w-10 rounded-full object-cover object-top"
              alt="Seller Avatar"
              width={40}
              height={40}
            />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default DashBoardHeader;