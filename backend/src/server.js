import express from "express"
import path from "path"
import cors from "cors"
import { ENV } from "./config/env.js"
import { connectDB } from "./config/db.js"
import { clerkMiddleware } from "@clerk/express";
import {serve} from "inngest/express"
import { inngest, functions } from "./config/inngest.js"

import adminRoutes from "./routes/admin.route.js"
import userRoutes from "./routes/user.route.js"
import orderRoutes from "./routes/order.route.js"
import reviewRoutes from "./routes/review.route.js"
import productRoutes from "./routes/product.route.js"
import cartRoutes from "./routes/cart.route.js"

const app = express()

const __dirname = path.resolve()

const allowedOrigins =
  process.env.NODE_ENV === "development"
    ? [ENV.CLIENT_URL]          
    : [ENV.FRONTEND_URL];      

app.use(
  cors({
   origin: ["https://shoplify-adminpanel.vercel.app","http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

//credentials:true to allow cookies from frontend
app.use(express.json())
// app.use(clerkMiddleware()) //adds auth object under the request

app.use("/api/inngest",serve({client:inngest, functions}))

app.use("/api/admin",clerkMiddleware(),adminRoutes)
app.use("/api/user",clerkMiddleware(),userRoutes)
app.use("/api/orders",clerkMiddleware(),orderRoutes)
app.use("/api/reviews",clerkMiddleware(),reviewRoutes)
app.use("/api/products",clerkMiddleware(),productRoutes)
app.use("/api/cart",clerkMiddleware(),cartRoutes)

app.get("/api/health",(req,res)=>{
  res.status(200).send("Server is healthy.")
})

app.get("/",(req,res)=>{
  res.send("Server is up and running.")
})

// Make app ready for deployment
if(ENV.NODE_ENV==="production"){
  app.use(express.static(path.join(__dirname, "../admin/dist")))

  app.get("/{*any}",(req,res)=>{
    res.sendFile(path.join(__dirname,"../admin","dist","index.html"))
  })
}

app.listen(ENV.PORT,async()=>{
  await connectDB()
  console.log(`🚀 Server is running on port http://localhost:3000`)
})