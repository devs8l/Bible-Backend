import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },      
  phone: { type: String, required: true },      
  items: { type: Array, required: true },
  amount: { type: Number, required: true },
  address: { type: Object, required: true },
  status: {
  type: String,
  required: true,
  default: function () {
    try {
      // Check if items exist and any item is digital
      if (this.items && this.items.some(item => item.format === 'digital')) {
        return 'delivered';
      }
      return 'order placed';
    } catch (err) {
      return 'order placed';
    }
  },
},
  paymentMethod: { type: String, required: true },
  payment: { type: Boolean, required: true, default: false },
  date: { type: Number, required: true },

  // 🚀 Add this block for Delhivery tracking info
  shipment: {
    awb: { type: String }, 
    tracking_url: { type: String },
    courier: { type: String, default: "Delhivery" },
    shipment_status: { type: String, default: "Not Created" },
    created_at: { type: Date },
  },
});

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema)

export default orderModel;

