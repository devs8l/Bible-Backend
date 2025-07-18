import express from "express"
import { addProduct,updateProduct, listProduct, removeProduct, singleProduct , bulkAddProducts} from "../controllers/productController.js"
import upload from "../middleware/multer.js";
//import adminAuth from "../middleware/adminAuth.js";
import { verifyAdmin } from "../middleware/authMiddleware.js";
import productModel from "../models/productModel.js";
import axios from "axios";

const productRouter = express.Router();


productRouter.post(
  "/add",
  verifyAdmin,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "digitalPdf", maxCount: 1 },
  ]),
  addProduct
);

productRouter.put(
  "/update",
  verifyAdmin,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "digitalPdf", maxCount: 1 },
  ]),
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

productRouter.get("/download/:id", async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);

    if (!product || !product.digitalFile) {
      return res.status(404).json({ message: "PDF not found" });
    }

    // Ensure file ends in .pdf
    let fileUrl = product.digitalFile;
    if (!fileUrl.endsWith(".pdf")) {
      fileUrl = `${fileUrl}.pdf`;
    }

    const filename = `${product.name.replace(/\s+/g, "_")}.pdf`;

    console.log("✅ Trying to fetch:", fileUrl);

    const response = await axios.get(fileUrl, {
      responseType: "stream",
    });

    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Type", "application/pdf");

    response.data.pipe(res);
  } catch (err) {
    console.error("🔥 PDF Download Error:", err.message);
    res.status(500).json({ message: "Could not download PDF" });
  }
});


productRouter.get("/view/:id", async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    if (!product || !product.digitalFile) {
      return res.status(404).json({ message: "PDF not found" });
    }

    const fileUrl = product.digitalFile;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline");

    const response = await fetch(fileUrl);
    if (!response.ok) throw new Error("Failed to fetch file");

    const fileStream = response.body;
    fileStream.pipe(res);
  } catch (err) {
    console.error("PDF View Error:", err);
    res.status(500).json({ message: "Could not view PDF" });
  }
});




export default productRouter;