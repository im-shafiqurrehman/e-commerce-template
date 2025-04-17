"use client";

import Link from "next/link";

function Hero() {
  return (
    <div
      className="flex min-h-[70vh] w-full items-center bg-cover bg-no-repeat py-12 md:min-h-[90vh]"
      style={{
        backgroundImage:
          "url(https://themes.rslahmed.dev/rafcart/assets/images/banner-2.jpg)",
      }}
    >
      <div className="mx-auto w-11/12 space-y-6">
        <h1 className="animate-fadeIn text-[35px] font-[600] capitalize leading-[1.2] text-[#3d3a3a] md:text-[60px]">
          Best Collection for <br /> home Decoration
        </h1>
        <p className="max-w-3xl animate-fadeIn text-balance text-[16px] font-[400] text-[#000000ba]">
          Discover the finest selection of products tailored to your needs.
          Enjoy a seamless shopping experience with our extensive range of
          high-quality items. Our commitment to excellence ensures that you
          receive the best value and service. Explore our collection and find
          the perfect products to enhance your lifestyle. Shop with confidence
          and convenience at our eCommerce platform.
        </p>
        <Link href="/products" className="inline-block animate-fadeIn">
          <div className="rounded-md bg-black px-10 py-3">
            <span className="text-[18px] text-[#fff]">Shop Now</span>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Hero;