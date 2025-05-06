// // create token and saving that in cookies
const sendShopToken = (user, statusCode, res) => {
    const token = user.getJwtToken();
  
    // Options for cookies
    const options = {
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      sameSite: "none",
      secure: true,
    };
  
    res.status(statusCode).cookie("seller_token", token, options).json({
      success: true,
      user,
      seller,
      token,
    });
  };
  
  export default sendShopToken;



// create token and saving that in cookies
// const sendShopToken = (seller, statusCode, res) => {
//   const token = seller.getJwtToken()

//   // Options for cookies - modified for local development
//   const options = {
//     expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
//     httpOnly: true,
//     sameSite: "lax", // Changed from "none" to "lax" for local development
//     secure: process.env.NODE_ENV === "production", // Only secure in production
//   }

//   res.status(statusCode).cookie("seller_token", token, options).json({
//     success: true,
//     seller,
//     token,
//   })
// }

// export default sendShopToken




  