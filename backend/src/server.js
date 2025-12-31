import express from "express"
import path from "path"
import { ENV } from "./config/env.js"
import { connectDB } from "./config/db.js"
import { clerkMiddleware } from "@clerk/express";
import {serve} from "inngest/express"
import { inngest, functions } from "./config/inngest.js"
const app = express()

const __dirname = path.resolve()

app.use(express.json())
app.use(clerkMiddleware()) //adds auth object under the request

app.use("/api/inngest",serve({client:inngest, functions}))

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