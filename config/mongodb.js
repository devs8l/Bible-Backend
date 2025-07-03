/*import mongoose from "mongoose";

const connectDB = async () => {

    mongoose.connection.on("connected" , () => {
        console.log("DB Connect E-com")
    })
    
    await mongoose.connect(`${process.env.MONGODB_URI}`)

}

export default connectDB*/

import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri || !uri.startsWith("mongodb")) {
      throw new Error("Invalid MongoDB URI");
    }

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1); // Stops the server
  }
};

export default connectDB;
