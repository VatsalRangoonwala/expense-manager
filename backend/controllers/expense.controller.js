import { Expense } from "../models/Expense.model.js";

export const addExpense = async (req, res) => {
  try {
    const { title, amount, category, date } = req.body;

    if (!title || !amount || !category) {
      return res.status(400).json({
        success: false,
        message: "All fields required",
      });
    }

    const expense = await Expense.create({
      title,
      amount,
      category,
      date,
      user: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Expense added",
      expense,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// GET ALL EXPENSES
export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user._id })
      .select("title amount category createdAt")
      .sort({
        createdAt: -1,
      })
      .lean();
    return res.status(200).json(expenses);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// DELETE EXPENSE
export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    if (expense.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    await expense.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Expense deleted",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// UPDATE EXPENSE
export const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    if (expense.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );

    return res.status(200).json({
      success: true,
      message: "Expense Edited",
      updatedExpense,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
