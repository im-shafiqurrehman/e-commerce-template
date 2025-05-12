"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"

function Hero() {
  const videoRef = useRef(null)

  // Ensure video plays automatically when component mounts
  useEffect(() => {
    if (videoRef.current) {
      // Some browsers require user interaction before autoplay
      // This is a workaround to try to play the video automatically
      const playVideo = async () => {
        try {
          await videoRef.current.play()
          console.log("Video playing automatically")
        } catch (error) {
          console.error("Autoplay prevented:", error)
        }
      }

      playVideo()
    }
  }, [])

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Full-screen background video */}
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        {/* <source src="/assets/video.mp4" type="video/mp4" /> */}
        Your browser does not support the video tag.
      </video>

      {/* Overlay gradient for better text visibility */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent"></div>

      {/* Content overlay */}
      <div className="relative z-10 flex h-full items-center">
        <div className="container mx-auto px-6">
          <div className="max-w-xl">
            <h1 className="animate-fadeIn text-[35px] font-[600] leading-[1.2] text-white md:text-[50px]">
              Elevate Your Style <br /> With Half Attire
            </h1>
            <p className="mt-4 animate-fadeIn text-balance text-[16px] font-[400] text-white/90">
              Discover our premium collection of stylish and comfortable clothing. Express your unique style with Half
              Attire's latest fashion trends.
            </p>
            <Link
              href="/products"
              className="mt-6 inline-block animate-fadeIn rounded-md border-2 border-white bg-transparent px-10 py-3 text-white transition-all duration-300 hover:bg-white hover:text-[#3321c8] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
            >
              <span className="text-[18px]">Shop Now</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Optional: Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </div>
  )
}

export default Hero
