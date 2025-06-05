import axios from "axios"
import { auth, googleProvider } from "./firebase"
import { signInWithPopup, signInWithRedirect, getRedirectResult } from "firebase/auth"
import { server } from "./server"
import { toast } from "react-toastify"

export const handleGoogleSignIn = async () => {
  try {
    let result

    // Try popup first, fallback to redirect if blocked
    try {
      result = await signInWithPopup(auth, googleProvider)
    } catch (popupError) {
      if (popupError.code === "auth/popup-blocked") {
        // Fallback to redirect
        await signInWithRedirect(auth, googleProvider)
        return { success: true, redirect: true }
      }
      throw popupError
    }

    const user = result.user

    const response = await axios.post(
      `${server}/user/google`,
      {
        name: user.displayName || user.email?.split("@")[0] || "User",
        email: user.email,
        photo: user.photoURL || "/assets/user.png",
      },
      { withCredentials: true },
    )

    if (response.data.success) {
      const userData = response.data.user
      localStorage.setItem("userData", JSON.stringify(userData))

      toast.success(response.data.message || "Successfully signed in with Google!")
      return { success: true, user: userData }
    } else {
      throw new Error(response.data.message || "Authentication failed")
    }
  } catch (error) {
    console.error("Google auth error:", error)
    if (error.code === "auth/popup-closed-by-user") {
      toast.info("Sign-in cancelled")
    } else {
      toast.error(error.response?.data?.message || "Google sign-in failed")
    }
    return { success: false, error }
  }
}

// Check for redirect result on page load
export const checkRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth)
    if (result) {
      const user = result.user

      const response = await axios.post(
        `${server}/user/google`,
        {
          name: user.displayName || user.email?.split("@")[0] || "User",
          email: user.email,
          photo: user.photoURL || "/assets/user.png",
        },
        { withCredentials: true },
      )

      if (response.data.success) {
        const userData = response.data.user
        localStorage.setItem("userData", JSON.stringify(userData))
        toast.success("Successfully signed in with Google!")
        return { success: true, user: userData }
      }
    }
    return { success: false }
  } catch (error) {
    console.error("Redirect result error:", error)
    return { success: false, error }
  }
}

export const logoutUser = async () => {
  try {
    await auth.signOut()
    await axios.get(`${server}/user/logout`, { withCredentials: true })
    localStorage.removeItem("userData")
    return { success: true }
  } catch (error) {
    console.error("Logout error:", error)
    return { success: false, error }
  }
}
