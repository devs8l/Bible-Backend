import {v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js"


// function for add product
const addProduct = async (req, res) => {
    try {
        const { name, description, price, stock, category, bookDetailDescription} = req.body;
        const image = req.file;

        if (!image) {
            return res.status(400).json({ success: false, message: "Image is required" });
        }

        // Upload single image to Cloudinary
        const result = await cloudinary.uploader.upload(image.path, { resource_type: "image" });
        const imageUrl = result.secure_url;

        const productData = {
            name,
            description,
            bookDetailDescription,
            price: Number(price),
            stock: Number(stock),
            category,
            image: [imageUrl], // storing it as an array for future-proofing
            date: Date.now()
        };

        const product = new productModel(productData);
        await product.save();

        res.json({ success: true, message: "Product Added" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// function for update product
const updateProduct = async (req, res) => {
  try {
    const { id, name, description, price, stock, category, bookDetailDescription } = req.body;
    let imageUrl;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, { resource_type: "image" });
      imageUrl = result.secure_url;
    }

    const updateData = {
      ...(name && { name }),
      ...(description && { description }),
      ...(price && { price: Number(price) }),
      ...(stock && { stock: Number(stock) }),
      ...(category && { category }),
      ...(bookDetailDescription && { bookDetailDescription }),
    };

    if (imageUrl) {
      updateData.image = [imageUrl]; // override old image
    }

    const updated = await productModel.findByIdAndUpdate(id, updateData, { new: true });

    if (!updated) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, message: "Product updated", product: updated });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// function for list product
const listProduct = async (req, res) => {
    try {
        const products = await productModel.find({});
        res.json({success:true, products})

    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message })
    }
}

// function for removing product
const removeProduct = async (req, res) => {
  try {
    const { _id } = req.body;
    if (!_id) return res.status(400).json({ success: false, message: "Product ID required" });

    const deleted = await productModel.findByIdAndDelete(_id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, message: "Product Removed" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// function for single product info
/*const singleProduct = async (req, res) => {
    try {
        const { productId } = req.body
        const product = await productModel.findById(productId)
        res.json({success:true, product})

    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message })
    }
}*/

// controllers/productController.js



// Get single product by ID
const singleProduct = async (req, res) => {
  try {
    const { _id } = req.body;

    if (!_id) {
      return res.status(400).json({ success: false, message: "Product ID is required" });
    }

    const product = await productModel.findById(_id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, product });

  } catch (error) {
    console.error("Error fetching single product:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


//function call for bulk data
const bulkAddProducts = async (req, res) => {
  try {
    const { products } = req.body; // expect JSON stringified

    const parsedProducts = JSON.parse(products);

    const createdProducts = [];

    for (const prod of parsedProducts) {
      const { name, description, price, stock, category, imageUrl,bookDetailDescription } = prod;

      const product = new productModel({
        name,
        description,
        bookDetailDescription,
        price: Number(price),
        stock: Number(stock),
        category,
        image: [imageUrl],
        date: Date.now()
      });

      await product.save();
      createdProducts.push(product);
    }

    res.json({
      success: true,
      message: `${createdProducts.length} products added`,
      data: createdProducts
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


export {addProduct, updateProduct, listProduct, removeProduct, singleProduct, bulkAddProducts}
