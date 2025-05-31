"use client"

import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useRouter } from "next/navigation"
import { loadUserSuccess } from "@/redux/reducers/user"
import Cookies from "js-cookie"

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const router = useRouter()

  useEffect(() => {
    // Check for Google auth token if not authenticated
    if (!isAuthenticated && !loading) {
      const token = localStorage.getItem("token") || Cookies.get("token")
      const userData = localStorage.getItem("userData") || Cookies.get("userData")

      if (token && userData) {
        try {
          const parsedUserData = JSON.parse(userData)
          dispatch(loadUserSuccess(parsedUserData))
          return // Don't redirect if we found valid auth data
        } catch (error) {
          // Clear invalid data
          localStorage.removeItem("token")
          localStorage.removeItem("userData")
          Cookies.remove("token")
          Cookies.remove("userData")
        }
      }

      // Redirect to login if no valid auth found
      router.push("/login")
    }
  }, [loading, isAuthenticated, router, dispatch])

  // Show loading while checking auth
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )

  // Show loading while verifying Google auth
  if (!isAuthenticated) {
    const token = localStorage.getItem("token") || Cookies.get("token")
    if (token) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )
    }
    return null // Return null while redirecting
  }

  return children
}

export default ProtectedRoute
