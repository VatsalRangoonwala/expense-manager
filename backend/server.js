import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import expenseRouter from "./routes/expense.route.js";
import compression from "compression";
import helmet from "helmet";

dotenv.config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(compression());
app.use(helmet());
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/expense", expenseRouter);

app.listen(process.env.PORT, () => console.log(`server running`));
