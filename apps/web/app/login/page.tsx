"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function login() {
    setLoading(true);
    setError("");
    setSuccess(false);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log("LOGIN RESULT", { data, error });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    if (data.session) {
      setSuccess(true);

      // Set cookie for Server Components
      // Note: 'Secure' flag can prevent cookies from being set on localhost (http).
      // We conditionally apply it only in production.
      const isProduction = process.env.NODE_ENV === "production";
      document.cookie = `access_token=${data.session.access_token}; path=/; max-age=${data.session.expires_in}; SameSite=Lax${isProduction ? "; Secure" : ""}`;

      // Redirect after short delay
      setTimeout(() => {
        // Force full page reload to ensure Server Components pick up the new cookie
        window.location.href = "/dashboard";
      }, 800);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-900">
      <div className="w-full max-w-sm space-y-4 p-8 bg-white border border-gray-200 rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight text-center mb-6">CMS Login</h1>

        <div className="space-y-4">
          <input
            className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          onClick={login}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors mt-2 shadow-sm"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {error && (
          <p className="text-red-600 text-sm bg-red-50 p-2 rounded border border-red-200 text-center">
            {error}
          </p>
        )}

        {success && (
          <p className="text-green-600 text-sm bg-green-50 p-2 rounded border border-green-200 text-center">
            Login successful - redirecting...
          </p>
        )}
      </div>
    </div>
  );
}

