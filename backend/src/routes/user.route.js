import {Router} from "express"
import { addAddress, addToWishlist, deleteAddress, getAddress, getWishlist, removeFromWishList, updateAddress } from "../controllers/user.controller.js"
import { protectRoute } from "../middleware/auth.middleware.js"

const router = Router()

router.use(protectRoute)

router.post("/addresess",addAddress)
router.get("/addresess",getAddress)
router.put("/addresess/:addressId",updateAddress)
router.delete("/addresess/:addressId",deleteAddress)


//wishlist routes
router.post("/wishlist",addToWishlist)
router.delete("/wishlist/:productId",removeFromWishList)
router.get("/wishlist",getWishlist)
export default router