import { Product } from "../models/product.model.js";
import { Order } from "../models/order.model.js";
import { Review } from "../models/review.model.js";
import mongoose from "mongoose";

export async function createOrder(req, res) {
  const { orderItems, shippingAddress, paymentMethod, totalPrice } = req.body;
  const user = req.user;

  // Validate BEFORE transaction
  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: "No order items provided" });
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    //  Validate & decrement stock first
    for (const item of orderItems) {
      const product = await Product.findOneAndUpdate(
        {
          _id: item.product._id,
          stock: { $gte: item.quantity },
        },
        {
          $inc: { stock: -item.quantity },
        },
        { session, new: true }
      );

      if (!product) {
        throw new Error(`Insufficient stock or product not found`);
      }
    }

    //  Create order
    const order = await Order.create(
      [
        {
          user: user._id,
          orderItems,
          shippingAddress,
          paymentMethod,
          totalPrice,
        },
      ],
      { session }
    );

    //  Commit transaction
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      message: "Order created successfully",
      order: order[0],
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error("Transaction failed:", error.message);

    res.status(409).json({
      message: error.message || "Order creation failed",
    });
  }
}


export async function getUserOrder(req,res){
  try {
    const orders = (await Order.find({clerkId:req.user.clerkId}).populate('orderItems.product')).sort({createdAt:-1})

    //check if each order has been reviewed
    const orderIds = orders.map((order) =>order._id)
    const reviews = await Review.find({orderId: {$in: orderIds}})
    const reviewedOrderIds = new Set(reviews.map((review)=>review.orderId.toString()))

    const orderWithReviewStatus = await Promise.all(orders.map(async (order)=>{
      return {
        ...order.toObject(),
        hasReviewed: reviewedOrderIds.has(order._id.toString()), //double bang operator to convert to boolean
      }
    }))
    res.status(200).json({orders: orderWithReviewStatus})
  } catch (error) {
    console.error("Error getting order:", error);
    res.status(500).json({message:"Internal server error"})
  }
}