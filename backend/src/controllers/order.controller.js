import { Product } from "../models/product.model.js";

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
  } catch (error) {
     console.error("Error creating order:", error);
    res.status(500).json({message:"Internal server error"})
  }
}
export async function getUserOrder(req,res){

}