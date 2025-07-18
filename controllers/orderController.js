import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import sendDigitalCopy from "../utils/sendDigitalCopy.js";
import productModel from "../models/productModel.js";
/*import razorpay from "razorpay"

// global variables
const currency = "inr"
const deliverCharge = 50

// gateway initialize
const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
})
*/

// Placing orders using COD Method
const placedOrder = async (req, res) => {
  try {
    const { userId, name, email, phone, items, amount, address } = req.body;

    const orderData = {
      userId,
      name,
      email,
      phone,
      items,
      address,
      amount,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
    };

    // Save order
    const newOrder = new orderModel(orderData);
    await newOrder.save();

    // Get current user and remove only ordered items from cart
    const user = await userModel.findById(userId);
    if (user && user.cartData) {
      const updatedCart = { ...user.cartData };
      items.forEach(item => {
        delete updatedCart[item.itemId]; // Remove only ordered items
      });
      await userModel.findByIdAndUpdate(userId, { cartData: updatedCart });
    }

    res.json({ success: true, message: "Order Placed" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/*const placedOrder = async (req, res) => {
  try {
    const { userId, name, email, phone, items, amount, address, paymentMethod } = req.body;

    const orderData = {
      userId,
      name,
      email,
      phone,
      items,
      address,
      amount,
      paymentMethod,
      payment: paymentMethod !== "COD", // true only for prepaid
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    // Handle digital items
    for (const item of items) {
      const product = await productModel.findById(item.itemId);
      if (product?.digitalFile && item.format === "digital") {
        await sendDigitalCopy(email, name, product.digitalFile, product.name);
      }
    }

    // Remove ordered items from cart
    const user = await userModel.findById(userId);
    if (user && user.cartData) {
      const updatedCart = { ...user.cartData };
      items.forEach(item => {
        delete updatedCart[item.itemId];
      });
      await userModel.findByIdAndUpdate(userId, { cartData: updatedCart });
    }

    res.json({ success: true, message: "Order Placed Successfully" });
  } catch (error) {
    console.error("❌ placedOrder error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};*/

/*// Placing orders using RazorPay Method
const placedOrderRazorpay = async (req, res) => {
    try {
        const { userId , items, amount, address} = req.body

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "Razorpay",
            payment: false,
            date: Date.now()
        }
        const newOrder = new orderModel(orderData)
        await newOrder.save()

        const options = {
            amount: amount * 100,
            currency: currency.toUpperCase(), 
            receipt: newOrder.id.toString()
        }

        await razorpayInstance.orders.create(options, (error , order) => {
            if (error) {
                console.log(error)
                return res.json({ success: false, message: error})
            }
            res.json({success: true, order})
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

const verifyRazorpay = async (req, res) => {
    try {
        const { userId, razorpay_order_id} = req.body

        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)
        if (orderInfo.status === "paid") {
            await orderModel.findByIdAndUpdate(orderInfo.receipt, {payment:true});
            await userModel.findByIdAndUpdate(userId, {cartData: {}})
            res.json({success: true, message: "Payment Successful" })
        }
        else {
            res.json({success: false, message: "Payment Failed" })
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}
*/

// All order data for Admin Panel
const allOrders = async (req, res) => {
    try {

        const orders = await orderModel.find({})
        res.json({success: true, orders})

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}


// User data for frontend
const userOrders = async (req, res) => {
    try {
        const { userId } = req.body;

        const orders = await orderModel.find({ userId })
        res.json({success: true, orders})

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

// Update order Status from admin panel
const updateStatus = async (req, res) => {
        try {
            
            const { orderId ,  status } = req.body;


            await orderModel.findByIdAndUpdate(orderId, { status })
            res.json({ success: true, message: "Status Updated"})

        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: error.message });
        }
}


export {  placedOrder, allOrders, userOrders, updateStatus} // placedOrderRazorpay,  verifyRazorpay
