
import { Button } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import { VscEyeClosed, VscEye } from "react-icons/vsc";
import { server } from "../../lib/server";

function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios
      .put(
        `${server}/user/update-user-password`,
        { oldPassword, newPassword, confirmPassword },
        { withCredentials: true },
      )
      .then(() => {
        toast.success("Password updated successfully!");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  return (
    <div className="w-full px-5 py-8">
      <h1 className="mb-4 text-xl font-semibold">Change Password</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="relative">
          <label
            htmlFor="oldPassword"
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
          >
            Old Password
          </label>
          <input
            type={showOldPassword ? "text" : "password"}
            name="oldPassword"
            id="oldPassword"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
            placeholder="Enter your old password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
          <div
            className="absolute top-10 right-0 flex items-center pr-3 cursor-pointer"
            onClick={() => setShowOldPassword((prev) => !prev)}
          >
            {showOldPassword ? <VscEyeClosed size={20} /> : <VscEye size={20} />}
          </div>
        </div>

        <div className="relative">
          <label
            htmlFor="newPassword"
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
          >
            New Password
          </label>
          <input
            type={showNewPassword ? "text" : "password"}
            name="newPassword"
            id="newPassword"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
            placeholder="Enter your new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <div
            className="absolute top-10 right-0 flex items-center pr-3 cursor-pointer"
            onClick={() => setShowNewPassword((prev) => !prev)}
          >
            {showNewPassword ? <VscEyeClosed size={20} /> : <VscEye size={20} />}
          </div>
        </div>

        <div className="relative">
          <label
            htmlFor="confirmPassword"
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
          >
            Confirm Password
          </label>
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            id="confirmPassword"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
            placeholder="Confirm your new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <div
            className="absolute top-10 right-0 flex items-center pr-3 cursor-pointer"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
          >
            {showConfirmPassword ? <VscEyeClosed size={20} /> : <VscEye size={20} />}
          </div>
        </div>

        <Button
          type="submit"
          variant="contained"
          className="rounded-lg bg-black px-4 py-2 text-white"
        >
          Change Password
        </Button>
      </form>
    </div>
  );
}

export default ChangePassword;