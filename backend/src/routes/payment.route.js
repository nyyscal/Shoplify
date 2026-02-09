import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { createPaymentIntent } from "../controllers/payment.controller.js";

const router = Router()

//payment req =? payment intent

router.post("/create-intent",protectRoute, createPaymentIntent)

export default router