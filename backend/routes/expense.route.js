import express from "express";
import {
  addExpense,
  deleteExpense,
  getExpenses,
  updateExpense,
} from "../controllers/expense.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const expenseRouter = express.Router();

expenseRouter.post("/", protect, addExpense);
expenseRouter.get("/", protect, getExpenses);
expenseRouter.delete("/:id", protect, deleteExpense);
expenseRouter.put("/:id", protect, updateExpense)
export default expenseRouter;
