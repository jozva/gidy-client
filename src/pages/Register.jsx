import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Register() {
 const [firstName, setFirstName] = useState("");
const [lastName, setLastName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

  const nav = useNavigate();

  const register = async (e) => {
    e.preventDefault();

    try {
      await axios.post("https://gidy-server.onrender.com/api/auth/register", {
         firstName,
  lastName,
        email,
        password,
      });

      alert("Registration successful");
      nav("/");
    } catch (err) {
      alert(err.response?.data || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={register}
        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow w-80 text-black dark:text-white"
      >
        <h2 className="text-xl font-bold mb-4 text-center">
          Register
        </h2>

        <input
  className="border p-2 w-full mb-3 rounded"
  placeholder="First Name"
  value={firstName}
  onChange={(e) => setFirstName(e.target.value)}
  required
/>

<input
  className="border p-2 w-full mb-3 rounded"
  placeholder="Last Name"
  value={lastName}
  onChange={(e) => setLastName(e.target.value)}
  required
/>


        <input
          className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2 w-full mb-3 rounded"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2 w-full mb-4 rounded"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white w-full py-2 rounded"
        >
          Register
        </button>

        <p className="text-sm mt-4 text-center">
          Already have an account?{" "}
          <Link to="/" className="text-blue-500">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
