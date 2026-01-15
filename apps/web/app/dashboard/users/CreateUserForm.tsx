"use client";

import { useState } from "react";

export default function CreateUserForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // Optional password
  const [role, setRole] = useState("EDITOR");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  async function submit() {
    // Validation
    if (!email || !email.includes("@")) {
      setIsError(true);
      setMessage("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setMessage("");
    setIsError(false);

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, role, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setIsError(true);
        setMessage(data.message || "Error creating user");
      } else {
        setMessage(data.message || `User '${email}' created successfully as ${role}`);
        setEmail("");
        setPassword("");
      }
    } catch (e) {
      setIsError(true);
      setMessage("Network error or server unavailable");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md space-y-4 p-6 border border-gray-200 rounded-lg bg-white shadow-sm">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">User Email</label>
        <input
          className="w-full border border-gray-300 rounded p-2 bg-white text-gray-900 placeholder:text-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          placeholder="user@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Password (Optional)</label>
        <input
          className="w-full border border-gray-300 rounded p-2 bg-white text-gray-900 placeholder:text-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          placeholder="Leave blank for 'ChangeMe123!'"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <p className="text-xs text-gray-500">If creating a new user, you can set an initial password.</p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Role</label>
        <select
          className="w-full border border-gray-300 rounded p-2 bg-white text-gray-900 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="EDITOR">Editor</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>

      <button
        onClick={submit}
        disabled={loading}
        className="w-full bg-blue-600 text-white font-medium px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm"
      >
        {loading ? "Creating..." : "Create User"}
      </button>

      {message && (
        <p className={`text-sm p-3 rounded-md ${isError ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
          {message}
        </p>
      )}
    </div>
  );
}
