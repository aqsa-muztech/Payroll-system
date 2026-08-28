"use client";

import { useState } from "react";
import Cookies from "js-cookie";
import api from "@/lib/api";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post("/admin/login/", {
        email: email.trim().toLowerCase(),
        password,
      });

      const { access, refresh, user } = response.data;

      // Save access token
      localStorage.setItem(
        "admin_access_token",
        access
      );

      // Save refresh token
      if (refresh) {
        localStorage.setItem(
          "admin_refresh_token",
          refresh
        );
      }

      Cookies.set(
        "admin_access_token",
        access,
        {
          expires: 1,
          sameSite: "lax",
        }
      );

      // Save admin information
      if (user) {
        localStorage.setItem(
          "admin_user",
          JSON.stringify(user)
        );
      }

      // Redirect
      window.location.href = "/dashboard";

    } catch (err: any) {

      const apiError =
        err.response?.data?.error ||
        err.response?.data?.detail ||
        "Invalid Super Admin email or password.";

      setError(
        typeof apiError === "object"
          ? JSON.stringify(apiError)
          : apiError
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white px-4">

      <form
        onSubmit={handleLogin}
        className="bg-slate-800 p-8 rounded-xl border border-slate-700 w-full max-w-md space-y-5"
      >

        {/* Header */}
        <div>
          <h1 className="text-xl font-bold">
            PayPulse Platform
          </h1>

          <p className="text-xs text-slate-400 mt-1">
            Super Admin Control Center
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="p-3 text-xs bg-red-500/20 border border-red-500 text-red-300 rounded">
            {error}
          </div>
        )}

        {/* Email */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Email Address
          </label>

          <input
            type="email"
            required
            placeholder="admin@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Password
          </label>

          <input
            type="password"
            required
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 text-white font-medium py-2.5 rounded-lg text-sm transition-colors"
        >
          {loading
            ? "Authenticating..."
            : "Authenticate"}
        </button>

      </form>
    </div>
  );
}