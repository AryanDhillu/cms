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
    if (!title) return;
    
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
        <Link href="/dashboard/programs" className="text-gray-500 hover:text-white">
          ← Back
        </Link>
        <h1 className="text-xl font-bold">Create Program</h1>
      </div>

      <div className="space-y-4 bg-white/5 p-6 rounded border border-gray-800">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Program Title</label>
          <input
            className="w-full bg-black border border-gray-700 rounded p-2 text-white placeholder:text-gray-600 focus:border-white transition-colors"
            placeholder="e.g. Full Stack Development"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Description</label>
          <textarea
            className="w-full bg-black border border-gray-700 rounded p-2 text-white placeholder:text-gray-600 focus:border-white transition-colors h-24"
            placeholder="Short description..."
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>

        <button 
          onClick={create}
          disabled={loading || !title}
          className="bg-white text-black px-4 py-2 rounded font-medium hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors w-full sm:w-auto"
        >
          {loading ? "Creating..." : "Create Program"}
        </button>
      </div>
    </div>
  );
}
