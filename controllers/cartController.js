import userModel from "../models/userModel.js"


// add products to user cart
const addToCart = async (req, res) => {
  try {
    const { userId, itemId, quantity } = req.body;

    if (!userId || !itemId) {
      return res.status(400).json({ success: false, message: "Missing userId or itemId" });
    }

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const cart = userData.cartData;

    if (cart[itemId]) {
      // If item already exists, increase quantity
      cart[itemId] += quantity || 1;
    } else {
      // Else, add item with quantity 1 or provided
      cart[itemId] = quantity || 1;
    }

    await userModel.findByIdAndUpdate(userId, { cartData: cart });

    res.json({ success: true, message: "Item added to cart", cartData: cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// update user cart
const updateCart = async (req, res) => {
    try {
    const { userId, itemId, quantity } = req.body;

    if (!userId || !itemId) {
      return res.status(400).json({ success: false, message: "Missing userId or itemId" });
    }

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const cart = userData.cartData;

    if (quantity <= 0) {
      // Remove item if quantity is zero or negative
      delete cart[itemId];
    } else {
      cart[itemId] = quantity;
    }

    await userModel.findByIdAndUpdate(userId, { cartData: cart });

    res.json({ success: true, message: "Cart updated", cartData: cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
}

// get  user cart data
const getUserCart = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ success: false, message: "Missing userId" });
        }

        const userData = await userModel.findById(userId);

        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        
        res.json({ success: true, cartData: userData.cartData });
    
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }

};

export {addToCart ,updateCart,getUserCart}