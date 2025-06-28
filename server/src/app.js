import express from 'express'
import userRoute from './routes/user.route.js';
import cookieParser from 'cookie-parser'
import cors from "cors"

const app = express();

// default middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

// apis
app.use("/api/v1/user", userRoute)

export {app}