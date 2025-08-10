import express from "express"
import cors from "cors"
import "dotenv/config"
import connectDB from "./config/mongodb.js"
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js"
import productRouter from "./routes/productRoute.js"
import cartRouter from "./routes/cartRoute.js"
import orderRouter from "./routes/orderRoute.js"
import reviewRouter from "./routes/reviewRoute.js"
/*import bibleVerseRoute from "./routes/BibleArticlesRoute/bibleVerseRoute.js";
import studyQuestionRoutes from "./routes/BibleArticlesRoute/studyQuestionRoutes.js";*/
import articleRoutes from './routes/BibleArticlesRoute/articleRoutes.js';
import imagePostRoutes from"./routes/BibleArticlesRoute/imageTitleRoutes.js";
import subscribeRoute from './routes/subscribeRoute.js';
import contactRoutes from "./routes/contact.js";
import session from "express-session";
import passport from "passport";
import cookieParser from "cookie-parser";
import "./config/passport.js"; 
import cron from "node-cron";
import { sendDailyVerseToSubscribers } from "./utils/dailyVerseEmail.js";


// App config

const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary();

// middlewares

app.use(cors())
app.use(express.json());
app.use(cookieParser());
/*app.use(session({
  secret: "your-session-secret",
  resave: false,
  saveUninitialized: false,
}));*/

app.use(session({
  secret: "your-session-secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set true only in production with HTTPS
    httpOnly: true
  }
}));

cron.schedule("0 10 * * *", () => {
  console.log("📬 Sending daily Bible verse at 10:00 AM IST...");
  sendDailyVerseToSubscribers();
}, {
  scheduled: true,
  timezone: "Asia/Kolkata"
});



// api endpoints

app.use("/api/user", userRouter)
app.use("/api/product", productRouter)
app.use("/api/cart", cartRouter)
app.use("/api/order", orderRouter)
app.use("/api/review", reviewRouter);
/*app.use("/api/article", bibleVerseRoute)*/
app.use('/api/article', articleRoutes);
/*app.use('/api/study-questions', studyQuestionRoutes);*/
app.use("/api/image-posts", imagePostRoutes);
app.use('/api', subscribeRoute);
app.use('/api/contact', contactRoutes);

app.get("/" , (req, res) => {
    res.send("Bible E-com Server is running")
})

app.listen(port, () => console.log("Server Started on PORT : " + port))