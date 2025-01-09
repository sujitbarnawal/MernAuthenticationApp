import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from './config/mongodb.js'
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js" 


const app = express();
const port = process.env.PORT || 3000;

connectDB()

app.use(express.json()); // It is a middleware used for parsing incoming requests with JSON
app.use(cookieParser()); //The cookie-parser middleware simplifies the process of parsing and
//  managing cookies in ExpressJS applications

const allowedOrigins=[process.env.FRONTEND_URL]
app.use(cors({origin: allowedOrigins, credentials: true })); //enables your server to handle cross-origin requests
//  allowing cookies, authorization headers, and other credentials to be included.


//API end points

app.get("/", (req, res) => {
    res.send("Working");
});
app.use('/api/auth', authRouter)
app.use('/api/user',userRouter)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
