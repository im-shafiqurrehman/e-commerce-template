"use client"

import { useState, useEffect } from "react"
import { FaEye, FaEyeSlash } from "react-icons/fa"
import { RxAvatar } from "react-icons/rx"
import { FcGoogle } from "react-icons/fc"
import axios from "axios"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { server } from "../lib/server"
import { toast } from "react-toastify"
import { useSelector, useDispatch } from "react-redux"
import { FaArrowLeftLong } from "react-icons/fa6"
import { loadUserSuccess } from "../redux/reducers/user"
import { signInWithPopup } from "firebase/auth"
import { auth, googleProvider } from "../lib/firebase"

function Register() {
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector((state) => state.user)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [avatar, setAvatar] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, router])

  // Google Sign-In Function - FIXED
  const handleGoogleClick = async () => {
    try {
      setGoogleLoading(true)

      // 1. Sign in with Firebase
      const result = await signInWithPopup(auth, googleProvider)

      // 2. Get user data
      const userData = {
        name: result.user.displayName,
        email: result.user.email,
        photo: result.user.photoURL,
      }

      console.log("Firebase auth successful:", userData.email)

      // 3. Send to backend
      const res = await axios.post(`${server}/user/google`, userData, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      })

      // 4. Handle response
      if (res.data.success) {
        // Store user data
        localStorage.setItem("userData", JSON.stringify(res.data.user))
        dispatch(loadUserSuccess(res.data.user))
        toast.success("Successfully registered with Google!")
        router.push("/")
      } else {
        toast.error(res.data.message || "Authentication failed")
      }
    } catch (error) {
      console.error("Could not sign in with Google", error)

      if (error.code === "auth/popup-closed-by-user") {
        toast.info("Sign-in cancelled")
      } else if (error.response) {
        toast.error(error.response.data?.message || "Server error")
      } else {
        toast.error("Google sign-in failed")
      }
    } finally {
      setGoogleLoading(false)
    }
  }

  const handleFileInputChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setAvatar(file)
      setAvatarPreview(URL.createObjectURL(file))
    }
  }

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData()
    formData.append("name", name)
    formData.append("email", email)
    formData.append("password", password)
    if (avatar) {
      formData.append("file", avatar)
    }

    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }

      const response = await axios.post(`${server}/user/create-user`, formData, config)

      if (response.data.success) {
        toast.success(response.data.message)
        setName("")
        setEmail("")
        setPassword("")
        setAvatar(null)
        setAvatarPreview(null)
        router.push("/login")
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Link href="/">
        <span className="absolute mx-6 my-4 flex h-8 w-12 items-center justify-center rounded-md bg-blue-500 p-2 text-white shadow-sm">
          <FaArrowLeftLong size={20} />
        </span>
      </Link>
      <section className="bg-gray-50 py-6 dark:bg-gray-900">
        <div className="mx-auto flex flex-col items-center justify-center px-6 py-8 md:min-h-screen lg:py-0">
          <div className="mt-4 w-full rounded-lg bg-white shadow sm:max-w-md md:mt-0 xl:p-0 dark:border dark:border-gray-700 dark:bg-gray-800">
            <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Create an account
              </h1>

              <button
                onClick={handleGoogleClick}
                type="button"
                disabled={googleLoading}
                className="w-full flex items-center justify-center px-5 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800 transition-colors cursor-pointer disabled:opacity-70"
              >
                {googleLoading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  <>
                    <FcGoogle className="h-5 w-5 mr-2" />
                    Continue with Google
                  </>
                )}
              </button>

              <div className="flex items-center">
                <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
                <div className="px-3 text-gray-500 text-sm dark:text-gray-400">or</div>
                <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                    Username
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-600 focus:ring-blue-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                    placeholder="Username"
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                    Your email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-600 focus:ring-blue-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                    placeholder="name@company.com"
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={passwordVisible ? "text" : "password"}
                      name="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-600 focus:ring-blue-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                      required
                      disabled={loading}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm leading-5">
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="focus:outline-none"
                        disabled={loading}
                      >
                        {passwordVisible ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="mt-2 flex items-center">
                    <span className="inline-block h-8 w-8 overflow-hidden rounded-full">
                      {avatarPreview ? (
                        <img
                          src={avatarPreview || "/placeholder.svg"}
                          alt="avatar"
                          className="h-full w-full rounded-full object-cover"
                        />
                      ) : (
                        <RxAvatar className="h-8 w-8" />
                      )}
                    </span>
                    <label
                      htmlFor="file-input"
                      className="ml-3 flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 cursor-pointer"
                    >
                      <span>Upload a file</span>
                      <input
                        type="file"
                        name="avatar"
                        id="file-input"
                        accept=".jpg,.jpeg,.png"
                        onChange={handleFileInputChange}
                        className="sr-only"
                        disabled={loading}
                      />
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 flex items-center justify-center cursor-pointer"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                        ></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    "Sign up"
                  )}
                </button>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Already have an account?{" "}
                  <Link href="/login" className="font-medium text-blue-600 hover:underline dark:text-blue-500">
                    Sign in
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Register
