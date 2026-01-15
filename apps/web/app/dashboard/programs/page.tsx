"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

export default function ProgramsPage() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/cms/programs")
      .then(res => {
        if (res.ok) return res.json();
        throw new Error("Failed");
      })
      .then(setPrograms)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-4">Loading programs...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Programs</h1>
        <Link 
          href="/dashboard/programs/new"
          className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200 transition-colors font-medium"
        >
          New Program
        </Link>
      </div>

      <div className="grid gap-4">
        {programs.length === 0 && (
          <p className="text-gray-500">No programs found.</p>
        )}
        
        {programs.map((p: any) => (
          <Link key={p.id} href={`/dashboard/programs/${p.id}`} className="block">
            <div className="border border-gray-800 rounded p-4 hover:bg-gray-900 transition-colors flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">{p.title}</h3>
                {p.description && <p className="text-gray-400 text-sm mt-1">{p.description}</p>}
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-2 py-1 rounded text-xs uppercase font-mono ${
                  p.status === 'published' ? 'bg-green-900/40 text-green-400' : 'bg-gray-800 text-gray-400'
                }`}>
                  {p.status}
                </span>
                <span className="text-gray-600 text-sm">
                  {new Date(p.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
