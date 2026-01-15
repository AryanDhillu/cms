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
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    if (!password || password.trim().length === 0) {
      setError("Password is required");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    if (data.session) {
      setSuccess(true);
      const isProduction = process.env.NODE_ENV === "production";
      document.cookie = `access_token=${data.session.access_token}; path=/; max-age=${data.session.expires_in}; SameSite=Lax${isProduction ? "; Secure" : ""}`;

      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 800);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden md:max-w-xl">
        <div className="md:flex">
            <div className="w-full p-8 md:p-10">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                    <p className="text-gray-500 text-sm">Sign in to your account</p>
                </div>

                <div className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            placeholder="name@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        onClick={login}
                        disabled={loading}
                        className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                    
                    {error && (
                        <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm text-center">
                            {error}
                        </div>
                    )}
                    
                    {success && (
                        <div className="p-3 rounded-lg bg-green-50 border border-green-100 text-green-600 text-sm text-center">
                            Login successful. Redirecting...
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

