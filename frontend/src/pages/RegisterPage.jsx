import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios.js";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    avatar: ""
  });
  const [errors, setErrors] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    if (!form.username || form.username.length < 3) {
      return "Username must be at least 3 characters.";
    }
    if (!form.email || !form.email.includes("@")) {
      return "Please enter a valid email address.";
    }
    if (!form.password || form.password.length < 6) {
      return "Password must be at least 6 characters long.";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setErrors(validationError);
      return;
    }
    setErrors("");
    setLoading(true);

    try {
      const res = await api.post("/auth/register", form);
      setSuccessMsg(res.data.message || "Registered successfully. Redirecting...");
      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      console.error("Register error:", error);
      const msg =
        error.response?.data?.message || "Registration failed. Please try again.";
      setErrors(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-56px)] px-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Create your account
        </h2>
        {errors && (
          <p className="mb-3 text-sm text-red-400">
            {errors}
          </p>
        )}
        {successMsg && (
          <p className="mb-3 text-sm text-green-400">
            {successMsg}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-md bg-zinc-800 text-sm border border-zinc-700 focus:border-blue-500 outline-none"
              placeholder="JohnDoe"
            />
          </div>
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
              placeholder="At least 6 characters"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Avatar URL (optional)</label>
            <input
              type="text"
              name="avatar"
              value={form.avatar}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-md bg-zinc-800 text-sm border border-zinc-700 focus:border-blue-500 outline-none"
              placeholder="https://example.com/avatar.png"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-sm font-semibold disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>
        <p className="mt-4 text-xs text-zinc-400 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;