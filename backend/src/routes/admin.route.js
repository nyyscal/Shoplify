import { Router } from "express";
import { createProduct, getAllProducts, updateProduct } from "../controllers/admin.controller.js";
import { adminOnly, protectRoute } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router()

//Common middlewares for all admin routes - DRY
router.use(protectRoute,adminOnly)

router.post("/products",upload.array("images",3), createProduct) 
//fileName in frontend:images max: 3 images
router.get("/products", getAllProducts)
router.put("/products/:id",upload.array("images",3), updateProduct)

export default router