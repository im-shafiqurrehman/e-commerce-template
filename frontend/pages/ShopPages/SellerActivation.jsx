"use client"

import axios from "axios"
import { useEffect, useState } from "react"
import { server } from "@/lib/server"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"

export default function SellerActivationPage({ params }) {
  const router = useRouter()
  const [error, setError] = useState(false)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    console.log("Activation Page - Params:", params)

    // Extract token directly from URL if params is undefined
    const token = params?.token || window.location.pathname.split("/").pop()
    console.log("Activation Page - Token:", token)

    if (token) {
      activateSellerAccount(token)
    } else {
      console.error("No token found in URL parameters")
      setLoading(false)
      setError(true)
      setErrorMessage("No activation token provided")
    }
  }, [params])

  const activateSellerAccount = async (activationToken) => {
    try {
      setLoading(true)
      console.log("Activating seller with token:", activationToken)

      // Add a timeout to prevent infinite loading
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Request timeout")), 15000))

      const fetchPromise = axios.post(
        `${server}/shop/seller/activation`,
        { activation_token: activationToken },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      )

      // Race between the fetch and the timeout
      const res = await Promise.race([fetchPromise, timeoutPromise])

      console.log("Activation response:", res.data)

      setSuccess(true)
      setError(false)

      // Store the seller token in localStorage and sessionStorage for backup
      if (res.data.token) {
        localStorage.setItem("seller_token", res.data.token)
        sessionStorage.setItem("seller_token", res.data.token)
        toast.success("Shop activated successfully! Redirecting to dashboard...")

        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          router.push("/dashboard")
        }, 3000)
      }
    } catch (error) {
      console.error("Activation error:", error)

      // Extract the error message
      let message = "Activation failed. Please try again."

      if (error.message === "Request timeout") {
        message = "Request timed out. The server took too long to respond."
      } else if (error.response?.data?.message) {
        message = error.response.data.message
      } else if (error.message) {
        message = error.message
      }

      setErrorMessage(message)
      setError(true)
      setSuccess(false)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <h1 className="text-xl font-bold text-[#3321c8] mb-6">Shop Activation</h1>

        {loading ? (
          <div className="py-8">
            <div className="animate-spin h-12 w-12 border-4 border-[#3321c8] border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-lg text-gray-700">Activating your shop account...</p>
            <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
          </div>
        ) : error ? (
          <div className="py-8">
            <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
              <p className="text-xl font-semibold mb-2">Activation Failed</p>
              <p>{errorMessage || "Your activation token is expired or invalid."}</p>
            </div>
            <div className="mt-6 space-y-3">
              <button
                onClick={() => router.push("/shop-create")}
                className="w-full px-6 py-2 bg-[#3321c8] text-white rounded-md hover:bg-[#2a1ba3] transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => router.push("/")}
                className="w-full px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
              >
                Return to Home
              </button>
            </div>
          </div>
        ) : success ? (
          <div className="py-8">
            <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-4">
              <p className="text-xl font-semibold mb-2">Activation Successful!</p>
              <p>Your shop account has been created successfully.</p>
            </div>
            <button
              onClick={() => router.push("/dashboard")}
              className="mt-4 px-6 py-2 bg-[#3321c8] text-white rounded-md hover:bg-[#2a1ba3] transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        ) : null}
      </div>
    </div>
  )
}
