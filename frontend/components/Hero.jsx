"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Play } from "lucide-react"

function Hero() {
  const [isHovered, setIsHovered] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const videoRef = useRef(null)
  const videoContainerRef = useRef(null)

  // Handle play/pause
  const handlePlayClick = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play()
        setIsPlaying(true)
      } else {
        videoRef.current.pause()
        setIsPlaying(false)
      }
    }
  }

  // Handle video end
  const handleVideoEnd = () => {
    setIsPlaying(false)
  }

  // Check if video loaded successfully
  useEffect(() => {
    if (videoRef.current) {
      const handleLoadedData = () => {
        setVideoLoaded(true)
        console.log("Video loaded successfully")
      }

      const handleError = (error) => {
        console.error("Error loading video:", error)
      }

      videoRef.current.addEventListener("loadeddata", handleLoadedData)
      videoRef.current.addEventListener("error", handleError)

      return () => {
        if (videoRef.current) {
          videoRef.current.removeEventListener("loadeddata", handleLoadedData)
          videoRef.current.removeEventListener("error", handleError)
        }
      }
    }
  }, [])

  return (
    <div className="relative w-full bg-gray-50 py-12 md:py-16">
      <div className="container mx-auto flex flex-col items-center px-4 md:flex-row md:items-center md:justify-between md:gap-8">
        {/* Left Content - Text and Button */}
        <div className="mb-10 w-full text-center md:mb-0 md:w-1/2 md:text-left">
          <h1 className="animate-fadeIn text-[35px] font-[600] leading-[1.2] text-[#3321c8] md:text-[50px]">
            Elevate Your Style <br /> With Half Attire
          </h1>
          <p className="mx-auto mt-4 max-w-xl animate-fadeIn text-balance text-[16px] font-[400] text-gray-700 md:mx-0">
            Discover our premium collection of stylish and comfortable clothing. From casual everyday wear to elegant
            occasion outfits, we offer the finest quality fabrics with impeccable craftsmanship. Express your unique
            style with Half Attire's latest fashion trends.
          </p>

          {/* Fixed Shop Now button with proper hover effect */}
          <Link
            href="/products"
            className="mt-6 inline-block animate-fadeIn rounded-md border-2 border-[#3321c8] bg-transparent px-10 py-3 text-[#3321c8] transition-all duration-300 hover:bg-[#3321c8] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#3321c8] focus:ring-offset-2"
          >
            <span className="text-[18px]">Shop Now</span>
          </Link>
        </div>

        {/* Right Content - Video */}
        <div className="relative w-full md:w-1/2">
          <div
            ref={videoContainerRef}
            className="group relative overflow-hidden rounded-xl shadow-xl transition-all duration-500"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Video Element with corrected poster path */}
            <video
              ref={videoRef}
              className={`h-auto w-full transform object-cover transition-all duration-700 ${
                isHovered ? "scale-105" : "scale-100"
              }`}
              controls={isPlaying}
              onEnded={handleVideoEnd}
              poster="/assets/poster.png"
              muted
              preload="auto"
            >
              <source src="/assets/video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* Play Button Overlay */}
            {!isPlaying && (
              <div
                className={`absolute left-0 top-0 flex h-full w-full items-center justify-center bg-black/20 transition-all duration-500 ${
                  isHovered ? "opacity-100" : "opacity-80"
                }`}
              >
                <button
                  onClick={handlePlayClick}
                  className="group absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#3321c8] shadow-lg transition-all duration-300 hover:bg-[#3321c8] hover:text-white"
                  aria-label="Play video"
                >
                  <Play className="h-8 w-8" />
                  <span className="absolute -inset-4 animate-ping rounded-full bg-white/30 duration-1000"></span>
                </button>
              </div>
            )}

            {/* Video Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#3321c8]/20 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-40"></div>
          </div>

          {/* Video Caption */}
          <div className="mt-4 text-center">
            <p className="text-sm font-medium text-gray-700">Explore our latest seasonal collection</p>
          </div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-[#3321c8]/5 blur-3xl"></div>
      <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-[#3321c8]/5 blur-3xl"></div>
    </div>
  )
}

export default Hero
