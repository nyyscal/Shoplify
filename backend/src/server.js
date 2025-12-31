import express from "express"

const app = express()

app.get("/api/health",(req,res)=>{
  res.status(200).send("Server is up and running.")
})

app.listen(3000,()=>{
  console.log(`Server is running on port http://localhost:3000`)
})