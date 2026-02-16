import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const login = async () => {
    try {
      const res = await axios.post(
        "https://gidy-server.onrender.com/api/auth/login",
        { email, password }
      );

      localStorage.setItem("token", res.data.token);
      nav("/profile");
    } catch (err) {
      alert(err.response?.data || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow w-80 text-black dark:text-white">

        <h2 className="text-xl font-bold mb-4 text-center">
          Login
        </h2>

        <input
          className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2 w-full mb-3 rounded"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2 w-full mb-4 rounded"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={login}
          className="bg-blue-500 hover:bg-blue-600 text-white w-full py-2 rounded"
        >
          Login
        </button>

        <p className="text-sm mt-4 text-center">
          New user?{" "}
          <Link to="/register" className="text-blue-500">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
