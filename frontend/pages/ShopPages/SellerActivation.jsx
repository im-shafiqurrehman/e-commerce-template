"use client"; // Added because of useState and useEffect

import axios from "axios";
import { useEffect, useState } from "react";
import { server } from "@/lib/server";

function SellerActivation({ token }) { // Replaced useParams with token prop
  const [error, setError] = useState(false);

  useEffect(() => {
    if (token) {
      const activationEmail = async () => {
        try {
          const res = await axios.post(`${server}/shop/seller/activation`, {
            activation_token: token, // Updated to use token prop
          });
          console.log(res.data.message);
        } catch (error) {
          console.log(error);
          setError(true);
        }
      };
      activationEmail();
    }
  }, [token]); // Updated dependency array to use token prop

  return (
    <div className="w-full h-screen flex items-center justify-center p-4">
      {error ? (
        <p className="text-xl">Your token is expired</p>
      ) : (
        <p className="text-xl">Your shop account is created successfully</p>
      )}
    </div>
  );
}

export default SellerActivation;