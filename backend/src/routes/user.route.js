import {Router} from "express"
import { addAddress, addToWishlist, deleteAddress, getAddress, getWishlist, removeFromWishList, updateAddress } from "../controllers/user.controller.js"
import { protectRoute } from "../middleware/auth.middleware.js"

const router = Router()

router.use(protectRoute)

router.post("/addressess",addAddress)
router.get("/addressess",getAddress)
router.put("/addressess/:addressId",updateAddress)
router.delete("/addressess/:addressId",deleteAddress)


//wishlist routes
router.post("/wishlist",addToWishlist)
router.delete("/wishlist/:productId",removeFromWishList)
router.get("/wishlist",getWishlist)
export default router