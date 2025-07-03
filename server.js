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
import bibleVerseRoute from "./routes/BibleArticlesRoute/bibleVerseRoute.js";
import articleRoutes from './routes/BibleArticlesRoute/articleRoutes.js';
import studyQuestionRoutes from "./routes/BibleArticlesRoute/studyQuestionRoutes.js";
import imagePostRoutes from"./routes/BibleArticlesRoute/imageTitleRoutes.js";


// App config

const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary();

// middlewares

app.use(express.json())
app.use(cors())

// api endpoints

app.use("/api/user", userRouter)
app.use("/api/product", productRouter)
app.use("/api/cart", cartRouter)
app.use("/api/order", orderRouter)
app.use("/api/review", reviewRouter);
app.use("/api/article", bibleVerseRoute)
app.use('/api/article', articleRoutes);
app.use('/api/study-questions', studyQuestionRoutes);
app.use("/api/image-posts", imagePostRoutes);

app.get("/" , (req, res) => {
    res.send("Bible E-com Server is running")
})

app.listen(port, () => console.log("Server Started on PORT : " + port))