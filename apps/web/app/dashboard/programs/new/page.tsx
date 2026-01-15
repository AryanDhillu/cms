"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewProgramPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function create() {
    if (!title || title.trim().length === 0) {
      alert("Program title is required");
      return;
    }

    setLoading(true);
    try {
      await apiFetch("/cms/programs", {
        method: "POST",
        body: JSON.stringify({
          title,
          description,
          language_primary: "en",
        }),
      });

      router.push("/dashboard/programs");
      router.refresh();
    } catch (e) {
      console.error(e);
      alert("Failed to create program");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/dashboard/programs" className="text-gray-500 hover:text-gray-900 transition-colors">
          ← Back
        </Link>
        <h1 className="text-xl font-bold text-gray-900">Create Program</h1>
      </div>

      <div className="space-y-4 bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Program Title</label>
          <input
            className="w-full bg-white border border-gray-300 rounded p-2 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
            placeholder="e.g. Full Stack Development"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            className="w-full bg-white border border-gray-300 rounded p-2 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all h-24"
            placeholder="Short description..."
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>

        <button 
          onClick={create}
          disabled={loading || !title}
          className="bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors w-full sm:w-auto shadow-sm"
        >
          {loading ? "Creating..." : "Create Program"}
        </button>
      </div>
    </div>
  );
}
