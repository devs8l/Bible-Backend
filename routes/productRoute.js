import express from "express"
import { addProduct,updateProduct, listProduct, removeProduct, singleProduct , bulkAddProducts} from "../controllers/productController.js"
import upload from "../middleware/multer.js";
//import adminAuth from "../middleware/adminAuth.js";
import { verifyAdmin } from "../middleware/authMiddleware.js";

const productRouter = express.Router();


productRouter.post(
    "/add",
    verifyAdmin,
    upload.single("image"),  // 👈 handle single image
    addProduct
);

productRouter.put(
  "/update",
  verifyAdmin,
  upload.single("image"), 
  updateProduct
);

productRouter.post(
  "/bulk-add",
  verifyAdmin,
  upload.none(), // no image file upload here
  bulkAddProducts
);

productRouter.post("/remove", verifyAdmin, removeProduct);
productRouter.post("/single", singleProduct)
productRouter.get("/list", listProduct);


export default productRouter;