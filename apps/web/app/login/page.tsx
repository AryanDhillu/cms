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
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-semibold">CMS Login</h1>

        <input
          className="w-full p-2 text-black border rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full p-2 text-black border rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={login}
          disabled={loading}
          className="w-full bg-white text-black py-2 rounded font-medium hover:bg-gray-200 disabled:opacity-50 transition-colors"
        >
          {loading ? "Logging in…" : "Login"}
        </button>

        {error && (
          <p className="text-red-400 text-sm bg-red-900/20 p-2 rounded border border-red-900">
            ❌ {error}
          </p>
        )}

        {success && (
          <p className="text-green-400 text-sm bg-green-900/20 p-2 rounded border border-green-900">
            ✅ Login successful — redirecting…
          </p>
        )}
      </div>
    </div>
  );
}

