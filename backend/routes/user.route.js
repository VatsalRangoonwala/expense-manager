import express, { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";

const userRouter = express.Router();

userRouter.get("/profile", protect, (req, res) => {
  return res.json(req.user);
});

export default userRouter;
