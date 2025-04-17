/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { backend_url, server } from "../../server";
import { AiOutlineCamera } from "react-icons/ai";
import axios from "axios";
import { loadSeller } from "../../redux/actions/user";
import { toast } from "react-toastify";

const ShopSetting = () => {
  const { seller } = useSelector((state) => state.seller);
  const [avatar, setAvatar] = useState();
  const [name, setName] = useState(seller && seller.name);
  const [description, setDescription] = useState(
    seller && seller.description ? seller.description : ""
  );
  const [address, setAddress] = useState(seller && seller.address);
  const [phoneNumber, setPhoneNumber] = useState(seller && seller.phoneNumber);
  const [zipCode, setZipcode] = useState(seller && seller.zipCode);

  const dispatch = useDispatch();

  const handleImage = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    setAvatar(file);

    const formData = new FormData();
    formData.append("file", file);

    await axios
      .put(`${server}/shop/update-shop-avatar`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      })
      .then(() => {
        dispatch(loadSeller());
        toast.success("Avatar updated successfully!");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const updateHandler = async (e) => {
    e.preventDefault();

    await axios
      .put(
        `${server}/shop/update-seller-info`,
        {
          name,
          address,
          zipCode,
          phoneNumber,
          description,
        },
        { withCredentials: true }
      )
      .then(() => {
        toast.success("Shop info updated successfully!");
        dispatch(loadSeller());
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-gray-100 p-4">
      <div className=" w-full max-w-2xl rounded-lg bg-white p-8 shadow-md">
        <div className="mb-6 flex w-full items-center justify-center">
          <div className="relative">
            <img
              src={
                avatar
                  ? URL.createObjectURL(avatar)
                  : `${backend_url}/${seller?.avatar}`
              }
              alt="Shop Avatar"
              className="h-32 w-32 rounded-full border-2 border-gray-300 object-cover"
            />
            <div className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-gray-800 p-1 text-white">
              <input
                type="file"
                id="image"
                className="hidden"
                onChange={handleImage}
              />
              <label htmlFor="image">
                <AiOutlineCamera size={20} />
              </label>
            </div>
          </div>
        </div>

        {/* Shop info */}
        <form className="space-y-6" onSubmit={updateHandler}>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Shop Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-600 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Shop Description
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-600 focus:outline-none"
            ></textarea>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Shop Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-600 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Shop Phone Number
            </label>
            <input
              type="number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-600 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Shop Zip Code
            </label>
            <input
              type="text"
              value={zipCode}
              onChange={(e) => setZipcode(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-600 focus:outline-none"
              required
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Update Shop
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShopSetting;