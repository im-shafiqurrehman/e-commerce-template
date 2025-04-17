import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import orderModel from "../model/orderModel.js";
import productModel from "../model/productModel.js";
import shopModel from "../model/shopModel.js";
import ErrorHandler from "../utils/ErrorHandler.js";

// create new product
export const createProduct = catchAsyncErrors(async (req, res, next) => {
  try {
    const { shopId } = req.body;
    // console.log("Received Shop ID:", shopId);
    const shop = await shopModel.findById(shopId);

    if (!shop) {
      return next(new ErrorHandler("Invalid shop Id", 400));
    }

    const files = req.files;
    const imageUrls = files.map((file) => `${file.filename}`);

    const productData = {
      ...req.body,
      images: imageUrls,
      shop: {
        _id: shop._id,
        name: shop.name,
        email: shop.email,
        phoneNumber: shop.phoneNumber,
        address: shop.address,
        description: shop.description,
        zipCode: shop.zipCode,
        role: shop.role,
        avatar: shop.avatar,
        createdAt: shop.createdAt,
      },
    };

    // console.log(productData);

    const product = await productModel.create(productData);

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// get all shop products
export const getAllShopProducts = catchAsyncErrors(async (req, res, next) => {
  try {
    const products = await productModel.find({ shopId: req.params.id });
    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// delete product route
export const deleteShopProduct = catchAsyncErrors(async (req, res, next) => {
  try {
    const productId = req.params.id;

    const product = await productModel.findByIdAndDelete(productId);

    if (!product) {
      return next(new ErrorHandler("Product not found", 400));
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// get all products
export const getAllProducts = catchAsyncErrors(async (req, res, next) => {
  try {
    const products = await productModel.find().sort({ createdAt: -1 });

    res.status(201).json({
      success: true,
      products,
    });
  } catch (error) {
    return next(new ErrorHandler(error, 404));
  }
});

// review for a product
export const createReview = catchAsyncErrors(async (req, res, next) => {
  try {
    const { user, rating, comment, productId, orderId } = req.body;

    const product = await productModel.findById(productId);

    const review = {
      user,
      rating,
      comment,
      productId,
    };

    const isReviewed = product.reviews.find(
      (rev) => rev.user._id === req.user._id
    );

    if (isReviewed) {
      product.reviews.forEach((rev) => {
        if (rev.user._id === req.user._id) {
          (rev.rating = rating), (rev.comment = comment), (rev.user = user);
        }
      });
    } else {
      product.reviews.push(review);
    }

    let avg = 0;

    product.reviews.forEach((rev) => {
      avg += rev.rating;
    });

    product.ratings = avg / product.reviews.length;

    await product.save({ validateBeforeSave: false });

    await orderModel.findByIdAndUpdate(
      orderId,
      { $set: { "cart.$[elem].isReviewed": true } },
      { arrayFilters: [{ "elem._id": productId }], new: true }
    );

    res.status(200).json({
      success: true,
      message: "Reviwed succesfully!",
    });
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
});
