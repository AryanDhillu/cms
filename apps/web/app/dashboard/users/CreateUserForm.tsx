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
    <div className="max-w-md space-y-4 p-4 border rounded bg-white/5 text-black">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">User Email</label>
        <input
          className="w-full border rounded p-2 bg-black text-white placeholder:text-gray-500"
          placeholder="user@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Password (Optional)</label>
        <input
          className="w-full border rounded p-2 bg-black text-white placeholder:text-gray-500"
          placeholder="Leave blank for 'ChangeMe123!'"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <p className="text-xs text-gray-500">If creating a new user, you can set an initial password.</p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Role</label>
        <select
          className="w-full border rounded p-2 bg-black text-white"
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
        className="w-full bg-white text-black font-medium px-4 py-2 rounded hover:bg-gray-200 disabled:opacity-50 transition-colors"
      >
        {loading ? "Creating..." : "Create User"}
      </button>

      {message && (
        <p className={`text-sm p-2 rounded ${isError ? 'bg-red-900/20 text-red-200 border border-red-800' : 'bg-green-900/20 text-green-200 border border-green-800'}`}>
          {message}
        </p>
      )}
    </div>
  );
}
