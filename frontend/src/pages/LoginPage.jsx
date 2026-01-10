import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Email and password are required.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", form);
      const { token, user } = res.data;
      login(user, token);
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      const msg =
        err.response?.data?.message || "Login failed. Please check your details.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-56px)] px-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Sign in to continue
        </h2>
        {error && (
          <p className="mb-3 text-sm text-red-400">
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-md bg-zinc-800 text-sm border border-zinc-700 focus:border-blue-500 outline-none"
              placeholder="john@example.com"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-md bg-zinc-800 text-sm border border-zinc-700 focus:border-blue-500 outline-none"
              placeholder="Your password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-sm font-semibold disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <p className="mt-4 text-xs text-zinc-400 text-center">
          New here?{" "}
          <Link to="/register" className="text-blue-400 hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;