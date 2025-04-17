/* eslint-disable no-unused-vars */
import { useDispatch, useSelector } from "react-redux";
import { backend_url, server } from "../../lib/server";
import { AiOutlineCamera } from "react-icons/ai";
import { FaUserCircle } from "react-icons/fa";
import { useState, useEffect } from "react";
import Loader from "../Loader";
import { loadUser, updateUserInfomation } from "../../redux/actions/user";
import { toast } from "react-toastify";
import axios from "axios";

function Profile() {
  const { user } = useSelector((state) => state.user);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPhoneNumber(user.phoneNumber || "");
      setPassword("");
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateUserInfomation(email, name, password, phoneNumber));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    setAvatar(file);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.put(`${server}/user/update-avatar`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success("Avatar updated successfully");
        dispatch(loadUser());
      }
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  if (!user) {
    return <Loader />;
  }

  return (
    <div>
      <div className="flex w-full justify-center">
        <div className="relative">
          {user.avatar ? (
            <img
              src={`${backend_url}/${user.avatar}`}
              className="h-32 w-32 rounded-full border-4 border-blue-700 object-cover object-top"
              alt=""
            />
          ) : (
            <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-blue-700 bg-gray-200 object-cover">
              <FaUserCircle className="h-24 w-24 text-gray-400" />
            </div>
          )}
          <div className="absolute bottom-1.5 right-1.5 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-[#E3E9EE] shadow-sm">
            <input
              type="file"
              id="avatar"
              hidden
              onChange={handleImageChange}
            />
            <label htmlFor="avatar">
              <AiOutlineCamera />
            </label>
          </div>
        </div>
      </div>
      <div className="section py-8">
        <form onSubmit={handleSubmit}>
          <div className="mb-2 flex flex-col items-center justify-between gap-2 sm:mb-4 sm:flex-row sm:gap-6">
            <div className="w-full sm:w-1/2">
              <label htmlFor="name" className="text-base font-semibold">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                id="name"
                className="mt-1 w-full px-2 py-1"
              />
            </div>
            <div className="w-full sm:w-1/2">
              <label htmlFor="email" className="text-base font-semibold">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full px-2 py-1"
              />
            </div>
          </div>
          <div className="mb-2 flex flex-col items-center justify-between gap-2 sm:mb-4 sm:flex-row sm:gap-6">
            <div className="w-full sm:w-1/2">
              <label htmlFor="phone" className="text-base font-semibold">
                Phone Number
              </label>
              <input
                type="text"
                id="phone"
                name="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="mt-1 w-full px-2 py-1"
              />
            </div>
            <div className="w-full sm:w-1/2">
              <label htmlFor="password" className="text-base font-semibold">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full px-2 py-1"
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-6 cursor-pointer rounded-md border-2 border-blue-500 bg-transparent px-14 py-2 text-blue-500 transition duration-300 hover:bg-blue-500 hover:text-white"
          >
            Update
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;
