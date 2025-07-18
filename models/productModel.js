/*import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },
  
  bookDetailDescription: {
    type: String,
    required: false, 
  },

  price: {
    type: Number,
    required: true,
  },

  stock: {
    type: Number,
    required: true,
    default: 0,
  },

  category: {
    type: String,
    required: true,
  },

  image: {
    type: Array,
    required: true,
  },
  date: {
    type: Number, 
    required:true,
   }

});

const productModel = mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;*/

import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  bookDetailDescription: { type: String, required: false },
  price: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 },
  category: { type: String, required: true },
  image: { type: Array, required: true },
  date: { type: Number, required: true },

  // New fields
  author: { type: String },
  discount: { type: Number, default: 0 },
  digitalPrice: { type: Number },
  digitalFile: { type: String }, // PDF file URL
});

const productModel =
  mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;
