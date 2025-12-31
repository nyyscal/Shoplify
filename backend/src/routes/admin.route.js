import { Router } from "express";
import { createProduct } from "../controllers/admin.controller.js";
import { adminOnly, protectRoute } from "../middleware/auth.middleware.js";

const router = Router()

router.post("/products", protectRoute, adminOnly, createProduct)

export default router