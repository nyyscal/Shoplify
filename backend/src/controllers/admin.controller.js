import cloudinary from "../config/cloudinary.js"
import {Product} from "../models/product.model.js"

export async function createProduct(req,res){
try {
  const {name,description,price,category,stock} = req.body

  if(!name || !description || !price || !category || !stock){
    return res.status(400).json({message:"All fields are required!"})
  }

  if(!req.files || req.files.length ===0){
    return res.status(400).json({message:"At least one product image is required!"})
  }

  if(req.files.length > 3){
    return res.status(400).json({message:"Maximum 3 images are allowed!"})
  }

  const uploadPromises = req.files.map((file)=>{
    return cloudinary.uploader.upload(file.path,{
      folder:"products"
    })
  })
  
  const uploadResults = await Promise.all(uploadPromises)
  
  const imageUrls = uploadResults.map((result)=>result.secure_url)
  const product = await Product.create({
    name, 
    description,
    price: parseFloat(price),
    stock: parseInt(stock),
    category,
    images: imageUrls
  })

  res.status(201).json({message:"Product created successfully!",product})
} catch (error) {
  console.error("Error in createProduct controller:", error)
  res.status(500).json({message:"Internal Server Error",error: error.message})
}
}

export async function getAllProducts(_,res){
try {
  const products =  await Product.find().sort({createdAt:-1}) //-1 : descinding order or latest order
  res.status(200).json({products})
} catch (error) {
  console.error("Error in getAllProducts controller:", error)
  res.status(500).json({message:"Internal Server Error",error: error.message})
}
}

export async function updateProduct(req,res){
try {
  const {id} = req.params;
  const {name,description,price,category,stock} = req.body

  if(!name || !description || !price || !category || !stock){
    return res.status(400).json({message:"All fields are required!"})
  }

  const product = await Product.findById(id)
  if(!product){
    return res.status(404).json({message:"Product not found!"})
  }

  let imageUrls = product.images //existing images

  if(req.files && req.files.length > 0){
    if(req.files.length > 3){
      return res.status(400).json({message:"Maximum 3 images are allowed!"})
    }

    const uploadPromises = req.files.map((file)=>{
      return cloudinary.uploader.upload(file.path,{
        folder:"products"
      })
    })
    
    const uploadResults = await Promise.all(uploadPromises)
    
    imageUrls = uploadResults.map((result)=>result.secure_url)
  }

  product.name = name
  product.description = description
  product.price = parseFloat(price)
  product.stock = parseInt(stock)
  product.category = category
  product.images = imageUrls

  await product.save()

  res.status(200).json({message:"Product updated successfully!",product})   
} catch (error) {
  console.error("Error in getAllProducts controller:", error)
  res.status(500).json({message:"Internal Server Error",error: error.message})
}
}