import { Router } from "express";
import { createProduct, deleteProduct, getAllCustomers, getAllOrders, getAllProducts, getDashboardStats, updateOrderStatus, updateProduct } from "../controllers/admin.controller.js";
import { adminOnly, protectRoute } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router()

//Common middlewares for all admin routes - DRY
// router.use(protectRoute,adminOnly)

router.post("/products",upload.array("images",3), createProduct) 
//fileName in frontend:images max: 3 images
router.get("/products", getAllProducts)
router.put("/products/:id",upload.array("images",3), updateProduct)
router.delete("/products/:id", deleteProduct)

//PUT - Update entire resource
//PATCH - Update partial resource
router.get("/orders",getAllOrders)
router.patch("/orders/:orderId/status",updateOrderStatus)

router.get("/customers",getAllCustomers)
router.get("/stats",getDashboardStats)

export default router