import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRouter from "./routes/auth.route.js";
import expenseRouter from "./routes/expense.route.js";
import compression from "compression";
import helmet from "helmet";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

connectDB();

app.set("trust proxy", 1);
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(compression());
app.use(helmet());
app.use("/api/auth", authRouter);
app.use("/api/expense", expenseRouter);

app.listen(process.env.PORT, () => console.log(`server running`));
