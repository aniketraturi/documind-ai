import { useState } from "react";
import { Link } from "react-router-dom";

import { registerUser } from "../api/authApi";

function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      setLoading(true);

      const user = await registerUser(formData);

      setMessage(`Account created for ${user.email}. You can log in now.`);
      setFormData({
        fullName: "",
        email: "",
        password: "",
      });
    } catch (error) {
      const detail = error.response?.data?.detail || "Registration failed";
      setMessage(detail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <p className="mb-2 text-sm font-medium text-cyan-400">DocuMind AI</p>

        <h1 className="text-3xl font-bold tracking-tight">Create account</h1>

        <p className="mt-3 text-sm text-slate-300">
          Register to access the enterprise AI knowledge base.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm text-slate-300">
              Full name
            </label>
            <input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
              placeholder="Test User"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-slate-300">Email</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
              placeholder="test@example.com"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-slate-300">
              Password
            </label>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
              placeholder="At least 6 characters"
              required
              minLength={6}
              maxLength={72}
            />
          </div>

          {message && (
            <div className="rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-slate-200">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950 hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>

        <Link
          to="/login"
          className="mt-6 block w-full text-center text-sm text-slate-300 hover:text-cyan-400"
        >
          Already have an account? Log in
        </Link>
      </div>
    </main>
  );
}

export default RegisterPage;