"use client"; 

import axios from "axios";
import { useEffect, useState } from "react";
import { server } from "@/lib/server";

function SellerActivation({ token }) {
  const [error, setError] = useState(false);

  useEffect(() => {
    if (token) {
      const activationEmail = async () => {
        try {
          const res = await axios.post(`${server}/shop/seller/activation`, {
            activation_token: token, 
          });
          console.log(res.data.message);
        } catch (error) {
          console.log(error);
          setError(true);
        }
      };
      activationEmail();
    }
  }, [token]); 

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