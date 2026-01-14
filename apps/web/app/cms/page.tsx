"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { SessionDebug } from "@/components/SessionDebug";
import { supabase } from "@/lib/supabase";

export default function CMSPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    apiFetch("/cms/me")
      .then((res) => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  return (
    <div className="p-6 space-y-4 max-w-2xl mx-auto">
      <div className="flex justify-between items-center border-b pb-4">
        <h1 className="text-xl font-semibold">CMS Dashboard</h1>
        <button
          className="text-sm text-red-600 hover:underline"
          onClick={async () => {
            await supabase.auth.signOut();
            window.location.href = "/login";
          }}
        >
          Logout
        </button>
      </div>

      <SessionDebug />

      <div className="mt-8">
        <h2 className="font-medium mb-2">/cms/me response</h2>
        <pre className="bg-gray-100 p-4 text-black text-sm rounded border overflow-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
}

