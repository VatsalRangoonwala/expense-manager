import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import API from "../services/api.js";
import { useNavigate } from "react-router-dom";
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
  Cell,
  Legend,
} from "recharts";

function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [expenses, setExpenses] = useState([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [editId, setEditId] = useState(null);
  const [filter, setFilter] = useState("All");
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

  const categoryData = () => {
    const map = {};

    expenses.forEach((exp) => {
      map[exp.category] = (map[exp.category] || 0) + Number(exp.amount);
    });

    return Object.keys(map).map((key, index) => ({
      name: key,
      value: map[key],
      fill: COLORS[index % COLORS.length],
    }));
  };

  // Fetch expenses
  const fetchExpenses = async () => {
    try {
      const res = await API.get("/expense");
      setExpenses(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Add expense
  const addExpense = async (e) => {
    e.preventDefault();

    try {
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
    }
  };

  // Delete expense
  const deleteExpense = async (id) => {
    try {
      const res = await API.delete(`/expense/${id}`);
      fetchExpenses();
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Welcome {user.name}</h2>
        <button
          className="bg-black text-white px-3 py-1 rounded"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-gray-600">Total Expenses</h3>
          <p className="text-xl font-bold">
            ₹{expenses.reduce((t, e) => t + Number(e.amount), 0)}
          </p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-gray-600">This Month</h3>
          <p className="text-xl font-bold">₹{getMonthlyTotal()}</p>
        </div>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* CATEGORY PIE CHART */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-bold mb-2">Category Breakdown</h3>

          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categoryData()}
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
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-bold mb-2">Expense Overview</h3>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={categoryData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow mb-4">
        <h3>Add Expense</h3>
        <form
          className="grid grid-cols-1 md:grid-cols-3 gap-2"
          onSubmit={addExpense}
        >
          <input
            className="border p-2 rounded"
            name="title"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            className="border p-2 rounded"
            name="amount"
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <select
            className="border p-2 rounded"
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
            className="bg-green-700 text-white p-2 rounded md:col-span-3"
            type="submit"
          >
            {editId ? "Update Expense" : "Add Expense"}
          </button>
        </form>
      </div>
      <select
        className="border p-2 mb-3 rounded"
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
            <div
              className="bg-white p-3 rounded shadow flex justify-between items-center"
              key={expense._id}
            >
              <div>
                <p className="font-semibold">{expense.title}</p>
                <p className="text-sm text-gray-600">
                  ₹{expense.amount} • {expense.category}
                </p>
              </div>

              <div className="space-x-2">
                <button
                  className="bg-gray-300 px-2 py-1 rounded"
                  onClick={() => {
                    setEditId(expense._id);
                    setTitle(expense.title);
                    setAmount(expense.amount);
                    setCategory(expense.category);
                  }}
                >
                  Edit
                </button>

                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => deleteExpense(expense._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
export default Dashboard;
