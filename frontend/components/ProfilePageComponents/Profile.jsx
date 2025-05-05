"use client"

import { useDispatch, useSelector } from "react-redux"
import { backend_url, server } from "../../lib/server"
import { AiOutlineCamera } from "react-icons/ai"
import { FaUserCircle } from "react-icons/fa"
import { useState, useEffect } from "react"
import Loader from "../Loader"
import { loadUser, updateUserInfomation } from "../../redux/actions/user"
import { toast } from "react-toastify"
import axios from "axios"

function Profile() {
  const { user, loading } = useSelector((state) => state.user)
  const [name, setName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [avatar, setAvatar] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [updateSuccess, setUpdateSuccess] = useState(false)

  const dispatch = useDispatch()

  useEffect(() => {
    if (user) {
      setName(user.name)
      setPhoneNumber(user.phoneNumber || "")
    }
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setUpdateSuccess(false)

    try {
      // Using axios directly to avoid page reload
      const response = await axios.put(
        `${server}/user/update-user-info`,
        { name, phoneNumber },
        { withCredentials: true },
      )

      if (response.data.success) {
        // Update local state instead of reloading the user
        setUpdateSuccess(true)
        toast.success("Profile updated successfully")

        // Update Redux state without full page reload
        dispatch({
          type: "UPDATE_USER_SUCCESS",
          payload: {
            ...user,
            name,
            phoneNumber,
          },
        })
      }
    } catch (err) {
      console.error("Profile update error:", err)
      toast.error(err.response?.data?.message || "Failed to update profile")
    } finally {
      setIsSubmitting(false)

      // Reset success message after 3 seconds
      if (updateSuccess) {
        setTimeout(() => setUpdateSuccess(false), 3000)
      }
    }
  }

  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setAvatar(file)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await axios.put(`${server}/user/update-avatar`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      })

      if (res.data.success) {
        toast.success("Avatar updated successfully")

        // Update avatar in Redux without full page reload
        if (res.data.user && res.data.user.avatar) {
          dispatch({
            type: "UPDATE_AVATAR_SUCCESS",
            payload: {
              ...user,
              avatar: res.data.user.avatar,
            },
          })
        } else {
          // Fallback to loadUser only if necessary
          dispatch(loadUser())
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update avatar")
    }
  }

  if (!user) {
    return <Loader />
  }

  return (
    <div className="bg-gray-100 rounded-lg shadow-sm p-6">
      <div className="flex w-full justify-center mb-8">
        <div className="relative">
          {user.avatar ? (
            <img
              src={`${backend_url}/${user.avatar}`}
              className="h-32 w-32 rounded-full border-4 border-blue-600 object-cover object-top"
              alt="User avatar"
            />
          ) : (
            <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-blue-600 bg-gray-200 object-cover">
              <FaUserCircle className="h-24 w-24 text-gray-400" />
            </div>
          )}
          <div className="absolute bottom-1.5 right-1.5 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors shadow-sm">
            <input type="file" id="avatar" hidden onChange={handleImageChange} accept="image/*" />
            <label htmlFor="avatar" className="cursor-pointer w-full h-full flex items-center justify-center">
              <AiOutlineCamera size={18} />
            </label>
          </div>
        </div>
      </div>

      <div className="section py-4">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* First row */}
            <div className="w-full">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                id="name"
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="w-full flex flex-col">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-700">
                {user.email}
              </div>
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>

            {/* Second row */}
            <div className="w-full">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                id="phone"
                name="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter your phone number"
              />
            </div>
            <div className="w-full flex items-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-md border-2 border-blue-600 bg-transparent px-6 py-2 text-blue-600 transition duration-300 hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Updating..." : updateSuccess ? "Updated!" : "Update Profile"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Profile

