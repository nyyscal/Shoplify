import { Product } from "../models/product.model.js";
import { Order } from "../models/order.model.js";
import { Review } from "../models/review.model.js";

export async function createOrder(req,res){
  try {
    const user = req.user
    const {orderItems, shippingAddress, paymentMethod, totalPrice} = req.body

    if(!orderItems || orderItems.length===0){
      return res.status(400).json({message:"No order items provided"})
    }

    //validate product and stocks
    for (const item of orderItems){
      const product = await Product.findById(item.product._id)
      if(!product){
        return res.status(404).json({message:`Product with id ${item.product._id} not found`})
      }
      if(product.stock < item.quantity){
        return res.status(400).json({message:`Insufficient stock for product ${product.name}`})
      }
    }
    const order = await Order.create({
      user: user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice
    })

    //update prodcut stock -1 for ordered stock
    for (const item of orderItems){
      await Product.findByIdAndUpdate(item.product._id,{
        $inc: {stock: -item.quantity}, //decrement by 1
      })
    }

    res.status(201).json({message:"Order created successfully", order})
  } catch (error) {
     console.error("Error creating order:", error);
    res.status(500).json({message:"Internal server error"})
  }
}

export async function getUserOrder(req,res){
  try {
    const orders = (await Order.find({clerkId:req.user.clerkId}).populate('orderItems.product')).sort({createdAt:-1})

    //check if each order has been reviewed
    const orderWithReviewStatus = await Promise.all(orders.map(async (order)=>{
      const review = await Review.findOne({orderId: order._id})
      return {
        ...order.toObject(),
        hasReviewed: !!review, //double bang operatror to convert to boolean
      }
    }))
    res.status(200).json({orders: orderWithReviewStatus})
  } catch (error) {
    console.error("Error getting order:", error);
    res.status(500).json({message:"Internal server error"})
  }
}