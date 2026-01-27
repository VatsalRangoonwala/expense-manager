import { useState, useContext } from "react";
import API from "../services/api.js";
import { AuthContext } from "../context/AuthContext.jsx";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", { email, password });
      login(res.data.user, res.data.token);
      toast.success(res.data.message);
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-lg w-80"
      >
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>

        <input
          className="w-full border p-2 mb-3 rounded"
          name="email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full border p-2 mb-3 rounded"
          name="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          type="submit"
        >
          Login
        </button>

        <p className="text-center mt-3 text-sm">
          Not registered?
          <Link className="text-blue-500 ml-1" to="/register">
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
