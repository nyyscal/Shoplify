import mongoose from "mongoose"
import {ENV} from "./env.js"

export const connectDB = async()=>{
  try {
    const conn = await mongoose.connect(ENV.DB_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000, // 30 seconds
    socketTimeoutMS: 30000,
    })
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.log("❌ Error in DB connection",error)
    process.exit(1)
  }
}