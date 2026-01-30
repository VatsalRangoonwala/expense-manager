import { useContext, useEffect, useState, memo, useMemo } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import API from "../services/api.js";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext.jsx";
import toast from "react-hot-toast";
import {
  PieChart,
  Pie,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

const ExpenseItem = memo(({ expense, onEdit, onDelete }) => {
  return (
    <div
      className="bg-white p-3 rounded shadow flex justify-between items-center dark:bg-slate-800"
      key={expense._id}
    >
      <div>
        <p className="font-semibold dark:text-white">{expense.title}</p>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          ₹{expense.amount} • {expense.category}
        </p>
      </div>

      <div className="space-x-2">
        <button
          className="bg-gray-200 px-2 py-1 rounded cursor-pointer"
          onClick={() => onEdit(expense)}
        >
          Edit
        </button>

        <button
          className="bg-red-500 text-white px-2 py-1 rounded cursor-pointer"
          onClick={() => onDelete(expense._id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
});

function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [editId, setEditId] = useState(null);
  const [filter, setFilter] = useState("All");
  const axisColor = theme === "dark" ? "white" : "black";
  const COLORS = [
    "#3b82f6", // blue
    "#22c55e", // green
    "#f97316", // orange
    "#ef4444", // red
    "#a855f7", // purple
    "#14b8a6", // teal
    "#eab308", // yellow
  ];

  const getMonthlyTotal = () => {
    const currentMonth = new Date().getMonth();

    return expenses
      .filter((exp) => new Date(exp.createdAt).getMonth() === currentMonth)
      .reduce((total, exp) => total + Number(exp.amount), 0);
  };

  const categoryData = useMemo(() => {
    const map = {};

    expenses.forEach((exp) => {
      map[exp.category] = (map[exp.category] || 0) + Number(exp.amount);
    });

    return Object.keys(map).map((key, index) => ({
      name: key,
      value: map[key],
      fill: COLORS[index % COLORS.length],
    }));
  }, [expenses]);

  // Fetch expenses
  const fetchExpenses = async () => {
    try {
      const res = await API.get("/expense");
      setExpenses(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Add expense
  const addExpense = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      if (editId) {
        const res = await API.put(`/expense/${editId}`, {
          title: title.trim(),
          amount,
          category,
        });
        toast.success(res.data.message);
        setEditId(null);
      } else {
        const res = await API.post("/expense", {
          title: title.trim(),
          amount,
          category,
        });
        toast.success(res.data.message);
      }

      setTitle("");
      setAmount("");
      setCategory("");
      fetchExpenses();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete expense
  const deleteExpense = async (id) => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      const res = await API.delete(`/expense/${id}`);
      fetchExpenses();
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-slate-900 bg-gray-200">
        <h2 className="text-xl font-semibold animate-pulse dark:text-white">
          Loading Dashboard...
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-200 dark:bg-slate-900 p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold dark:text-white">
          Welcome {user.name}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={toggleTheme}
            className="px-3 py-1 rounded dark:bg-gray-200 bg-slate-800 text-white dark:text-black cursor-pointer"
          >
            {theme === "dark" ? "☀ Light" : "🌙 Dark"}
          </button>

          <button
            onClick={handleLogout}
            className="bg-white px-3 py-1 rounded dark:bg-slate-800 dark:text-white cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-white dark:bg-slate-800 dark:text-white p-4 rounded shadow">
          <h3 className="text-gray-600 dark:text-white">Total Expenses</h3>
          <p className="text-xl font-bold">
            ₹{expenses.reduce((t, e) => t + Number(e.amount), 0)}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 dark:text-white p-4 rounded shadow">
          <h3 className="text-gray-600 dark:text-white">This Month</h3>
          <p className="text-xl font-bold">₹{getMonthlyTotal()}</p>
        </div>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* CATEGORY PIE CHART */}
        <div className="bg-white p-4 rounded shadow dark:bg-slate-800">
          <h3 className="font-bold mb-2 dark:text-white">Category Breakdown</h3>

          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              />
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* BAR CHART */}
        <div className="bg-white p-4 rounded shadow dark:bg-slate-800">
          <h3 className="font-bold mb-2 dark:text-white">Expense Overview</h3>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fill: axisColor }} />
              <YAxis tick={{ fill: axisColor }} />
              <Tooltip />
              <Bar dataKey="value" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow mb- dark:bg-slate-800 dark:text-white">
        <h3>Add Expense</h3>
        <form
          className="grid grid-cols-1 md:grid-cols-3 gap-2"
          onSubmit={addExpense}
        >
          <input
            className="border p-2 rounded dark:bg-slate-700 dark:text-white dark:border-slate-600"
            name="title"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            className="border p-2 rounded dark:bg-slate-700 dark:text-white dark:border-slate-600"
            name="amount"
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <select
            className="border p-2 rounded dark:bg-slate-700 dark:text-white dark:border-slate-600"
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            <option>Food</option>
            <option>Travel</option>
            <option>Shopping</option>
            <option>Bills</option>
            <option>Other</option>
          </select>

          <button
            disabled={isSubmitting}
            className="bg-green-700 text-white p-2 rounded md:col-span-3 cursor-pointer"
            type="submit"
          >
            {editId ? "Update Expense" : "Add Expense"}
          </button>
        </form>
      </div>
      <select
        className="border p-2 mb-3 mt-3 rounded dark:bg-slate-900 dark:text-white dark:border-slate-500"
        onChange={(e) => setFilter(e.target.value)}
      >
        <option>All</option>
        <option>Food</option>
        <option>Travel</option>
        <option>Shopping</option>
        <option>Bills</option>
      </select>
      <div className="grid gap-2">
        {expenses
          .filter((exp) => (filter === "All" ? true : exp.category === filter))
          .map((expense) => (
            <ExpenseItem
              key={expense._id}
              expense={expense}
              onEdit={(exp) => {
                setEditId(exp._id);
                setTitle(exp.title);
                setAmount(exp.amount);
                setCategory(exp.category);
              }}
              onDelete={deleteExpense}
            />
          ))}
      </div>
    </div>
  );
}
export default Dashboard;
