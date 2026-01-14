"use client";

import { useAuth } from "@/context/AuthContext";

export function SessionDebug() {
  const { session, loading } = useAuth();

  if (loading) return <p>Checking session…</p>;

  if (!session) {
    return <p className="text-red-400">No active session</p>;
  }

  return (
    <div className="text-xs bg-gray-900 p-3 rounded text-white">
      <div className="flex justify-between items-start mb-2">
        <p className="text-green-400 font-bold">Session active</p>
      </div>
      <pre className="overflow-auto max-h-40">
        {JSON.stringify(
          {
            user: session.user.email,
            expiresAt: new Date(session.expires_at * 1000).toLocaleString(),
          },
          null,
          2
        )}
      </pre>
    </div>
  );
}
