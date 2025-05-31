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
        <source src="/assets/video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay gradient for better text visibility */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent"></div>

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
