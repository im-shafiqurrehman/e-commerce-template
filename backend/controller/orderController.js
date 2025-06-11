import orderModel from "../model/orderModel.js";
import productModel from "../model/productModel.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import shopModel from "../model/shopModel.js";

// create new order
export const createOrder = catchAsyncErrors(async (req, res, next) => {
  try {
    const { cart, shippingAddress, user, totalPrice, paymentInfo } = req.body;

    // group cart items by shopId
    const shopItemsMap = new Map();

    for (const item of cart) {
      const shopId = item.shopId;
      if (!shopItemsMap.has(shopId)) {
        shopItemsMap.set(shopId, []);
      }
      shopItemsMap.get(shopId).push(item);
    }

    // create an order for each shop
    const orders = [];

    for (const [shopId, items] of shopItemsMap) {
      const order = await orderModel.create({
        cart: items,
        shippingAddress,
        user,
        totalPrice,
        paymentInfo,
      });
      orders.push(order);
    }

    res.status(201).json({
      success: true,
      orders,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// get all orders of user
export const getAllUserOrders = catchAsyncErrors(async (req, res, next) => {
  try {
    const orders = await orderModel
      .find({ "user._id": req.params.userId })
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// get all orders of seller
export const getAllSellerOrders = catchAsyncErrors(async (req, res, next) => {
  try {
    const orders = await orderModel
      .find({
        "cart.shopId": req.params.shopId,
      })
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// update order status for seller
export const updateOrderStatus = catchAsyncErrors(async (req, res, next) => {
  try {
    const order = await orderModel.findById(req.params.id);

    if (!order) {
      return next(new ErrorHandler("Order not found with this id", 400));
    }
    if (req.body.status === "Transferred to delivery partner") {
      order.cart.forEach(async (o) => {
        await updateOrder(o._id, o.qty);
      });
    }

    order.status = req.body.status;

    if (req.body.status === "Delivered") {
      order.deliveredAt = Date.now();
      order.paymentInfo.status = "Succeeded";
      const serviceCharge = order.totalPrice * 0.1;
      await updateSellerInfo(order.totalPrice - serviceCharge);
    }

    await order.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      order,
    });

    async function updateOrder(id, qty) {
      const product = await productModel.findById(id);

      product.stock -= qty;
      product.sold_out += qty;

      await product.save({ validateBeforeSave: false });
    }

    async function updateSellerInfo(amount) {
      const seller = await shopModel.findById(req.seller.id);

      seller.availableBalance = amount;

      await seller.save();
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// give a refund ----- user
export const orderRefund = catchAsyncErrors(async (req, res, next) => {
  try {
    const order = await orderModel.findById(req.params.id);

    if (!order) {
      return next(new ErrorHandler("Order not found with this id", 400));
    }

    order.status = req.body.status;

    await order.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      order,
      message: "Order Refund Request successfully!",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// accept the refund ---- seller
export const shopRefundOrders = catchAsyncErrors(async (req, res, next) => {
  try {
    const order = await orderModel.findById(req.params.id);

    if (!order) {
      return next(new ErrorHandler("Order not found with this id", 400));
    }

    order.status = req.body.status;

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order Refund successfull!",
    });

    if (req.body.status === "Refund Success") {
      order.cart.forEach(async (o) => {
        await updateOrder(o._id, o.qty);
      });
    }

    async function updateOrder(id, qty) {
      const product = await productModel.findById(id);

      product.stock += qty;
      product.sold_out -= qty;

      await product.save({ validateBeforeSave: false });
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});










// Get all orders (Admin)
export const adminAllOrders = catchAsyncErrors(async (req, res, next) => {
  try {
    // console.log("📋 Admin fetching all orders...")

    const orders = await orderModel.find().sort({
      createdAt: -1,
    })

    // console.log(`✅ Found ${orders.length} orders`)

    res.status(200).json({
      success: true,
      orders,
    })
  } catch (error) {
    console.error("❌ Error fetching admin orders:", error)
    return next(new ErrorHandler(error.message, 500))
  }
})

// Get single order details for admin
export const adminOrderDetails = catchAsyncErrors(async (req, res, next) => {
  try {
    const orderId = req.params.id
    // console.log(`🔍 Admin fetching order details for ID: ${orderId}`)

    // Check if the ID is valid MongoDB ObjectId format
    if (!orderId.match(/^[0-9a-fA-F]{24}$/)) {
      // console.log("❌ Invalid order ID format")
      return next(new ErrorHandler("Invalid order ID format", 400))
    }

    const order = await orderModel.findById(orderId)

    if (!order) {
      console.log("❌ Order not found in database")

      // Let's also check what orders exist
      const allOrders = await orderModel.find({}, "_id").limit(5)
      // console.log(
      //   "📋 Available order IDs:",
      //   allOrders.map((o) => o._id.toString()),
      // )

      return next(new ErrorHandler("Order not found", 404))
    }

    console.log("✅ Order found successfully")

    res.status(200).json({
      success: true,
      order,
    })
  } catch (error) {
    console.error("❌ Error fetching order details:", error)
    return next(new ErrorHandler(error.message, 500))
  }
})

// Update order status for admin
export const adminUpdateOrderStatus = catchAsyncErrors(async (req, res, next) => {
  try {
    const orderId = req.params.id
    const { status } = req.body

    // console.log(`🔄 Admin updating order ${orderId} to status: ${status}`)

    const order = await orderModel.findById(orderId)

    if (!order) {
      return next(new ErrorHandler("Order not found", 404))
    }

    order.status = status

    if (status === "Delivered") {
      order.deliveredAt = Date.now()
    }

    await order.save()

    console.log("✅ Order status updated successfully")

    res.status(200).json({
      success: true,
      order,
      message: `Order status updated to ${status}`,
    })
  } catch (error) {
    console.error("❌ Error updating order status:", error)
    return next(new ErrorHandler(error.message, 500))
  }
})
