import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { createPaymentIntent, handleWebhook } from "../controllers/payment.controller.js";

const router = Router()

//payment req =? payment intent

router.post("/create-intent",protectRoute, createPaymentIntent)
router.post("/webhook", handleWebhook) //no middleware needed as stripe  will do it atomatically

export default router