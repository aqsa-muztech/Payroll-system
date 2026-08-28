"use client";

import { useState } from "react";
import Cookies from "js-cookie";
import api from "@/lib/api";

export default function ClientLoginPage() {
  const [orgName, setOrgName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post("/client/login/", {
        org_name: orgName.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      const { access, refresh, user } = response.data;

      // Save tokens
      localStorage.setItem("client_access_token", access);

      if (refresh) {
        localStorage.setItem("client_refresh_token", refresh);
      }

      Cookies.set("client_access_token", access, {
        expires: 1,
        sameSite: "lax",
      });

      // Save user information
      localStorage.setItem(
        "client_user",
        JSON.stringify(user)
      );

      // Save organization information
      if (user.organization) {
        localStorage.setItem(
          "org_info",
          JSON.stringify(user.organization)
        );
      }

      // Redirect according to role
      if (
        user.role === "ORG_ADMIN" ||
        user.role === "HR_MANAGER"
      ) {
        window.location.href = "/dashboard/org-admin";
      } else {
        window.location.href = "/dashboard/employee";
      }
    } catch (err: any) {
      const apiError =
        err.response?.data?.error ||
        err.response?.data?.detail ||
        "Invalid organization, email or password.";

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
    <div className="min-h-screen flex items-center justify-center bg-slate-100 text-slate-800 px-4">

      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-md border border-slate-200 w-full max-w-md space-y-4"
      >

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            PayPulse Workspace
          </h1>

          <p className="text-xs text-slate-500 mt-1">
            Sign in to your organization
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="p-3 text-xs bg-red-100 border border-red-300 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Organization Name */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Organization Name
          </label>

          <input
            type="text"
            required
            placeholder="e.g. Acme Corp"
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
            className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Email Address
          </label>

          <input
            type="email"
            required
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Password
          </label>

          <input
            type="password"
            required
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2.5 rounded-lg text-sm transition-colors"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

      </form>
    </div>
  );
}