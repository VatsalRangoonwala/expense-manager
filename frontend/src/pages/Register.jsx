import { useState } from "react";
import API from "../services/api.js";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/register", {
        name,
        email,
        password,
      });

      toast.success(res.data.message);
      navigate("/");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        className="bg-white p-6 rounded-xl shadow-lg w-80"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold text-center mb-4">Register</h2>

        <input
          className="w-full border p-2 mb-3 rounded"
          name="name"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

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
          className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
          type="submit"
        >
          Register
        </button>

        <p className="text-center mt-3 text-sm">
          Already have account?{" "}
          <Link className="text-green-500 ml-1" to="/">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
