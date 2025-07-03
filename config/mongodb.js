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
  const uri = process.env.MONGODB_URI;

  if (!uri || (!uri.startsWith("mongodb://") && !uri.startsWith("mongodb+srv://"))) {
    console.error("❌ Invalid or missing MongoDB URI.");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
