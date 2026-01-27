import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import API from "../services/api.js";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [expenses, setExpenses] = useState([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [editId, setEditId] = useState(null);
  const [filter, setFilter] = useState("All");

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
