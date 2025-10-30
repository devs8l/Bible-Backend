import PaymentSettings from "../models/PaymentSettings.js";

// ✅ Get current settings (admin only)
export const getPaymentSettings = async (req, res) => {
  try {
    let settings = await PaymentSettings.findOne();
    if (!settings) {
      settings = await PaymentSettings.create({});
    }
    res.json({ success: true, settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Update settings (admin only)
export const updatePaymentSettings = async (req, res) => {
  try {
    const { codEnabled, razorpayEnabled } = req.body;

    let settings = await PaymentSettings.findOne();
    if (!settings) {
      settings = await PaymentSettings.create({ codEnabled, razorpayEnabled });
    } else {
      settings.codEnabled = codEnabled;
      settings.razorpayEnabled = razorpayEnabled;
      settings.updatedAt = new Date();
      await settings.save();
    }

    res.json({ success: true, message: "Payment settings updated", settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
