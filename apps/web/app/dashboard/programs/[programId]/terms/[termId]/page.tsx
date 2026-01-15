"use client";

import { useEffect, useState, use } from "react";
import { apiFetch } from "@/lib/api";
import Link from "next/link";

export default function LessonsPage({ params }: { params: Promise<{ programId: string, termId: string }> }) {
  const { programId, termId } = use(params);

  const [term, setTerm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [title, setTitle] = useState("");
  const [contentType, setContentType] = useState("video");
  const [duration, setDuration] = useState(10);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    apiFetch(`/cms/terms/${termId}`)
      .then(res => res.json())
      .then(setTerm)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [termId]);

  async function createLesson() {
    if (!title) return;
    setIsCreating(true);

    try {
        await apiFetch(`/cms/terms/${termId}/lessons`, {
            method: "POST",
            body: JSON.stringify({ 
                title, 
                contentType, 
                duration: Number(duration) 
            }),
        });
        
        window.location.reload();
    } catch (error) {
        console.error(error);
        alert("Failed to create lesson");
        setIsCreating(false);
    }
  }

  if (loading) return <div className="p-8 text-gray-500">Loading term...</div>;
  if (!term) return <div className="p-8 text-red-500">Term not found</div>;

  return (
    <div>
      <div className="mb-6">
         <Link href={`/dashboard/programs/${programId}`} className="text-sm text-gray-500 hover:text-white mb-2 block">
            ← Back to Program
         </Link>
         <h1 className="text-3xl font-bold">
            <span className="text-gray-500 font-normal">Term {term.termNumber}:</span> {term.title}
         </h1>
         <p className="text-gray-400 mt-1">Manage lessons content.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Lessons List - Main Content */}
        <div className="md:col-span-2">
            <div className="bg-white/5 border border-gray-800 rounded overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-white/5 text-gray-400 text-sm">
                        <tr>
                            <th className="p-3 font-medium">#</th>
                            <th className="p-3 font-medium">Title</th>
                            <th className="p-3 font-medium">Type</th>
                            <th className="p-3 font-medium">Duration</th>
                            <th className="p-3 font-medium">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {term.lessons?.map((lesson: any) => (
                            <tr key={lesson.id} className="hover:bg-white/5">
                                <td className="p-3 text-gray-500">{lesson.lessonNumber}</td>
                                <td className="p-3 font-medium">{lesson.title}</td>
                                <td className="p-3">
                                    <span className={`text-xs px-2 py-0.5 rounded border uppercase ${
                                        lesson.contentType === 'video' 
                                            ? 'bg-purple-900/30 text-purple-300 border-purple-900' 
                                            : 'bg-blue-900/30 text-blue-300 border-blue-900'
                                    }`}>
                                        {lesson.contentType}
                                    </span>
                                </td>
                                <td className="p-3 text-gray-400 text-sm">
                                    {Math.round(lesson.durationMs / 60000)}m
                                </td>
                                <td className="p-3">
                                    <span className="text-xs px-2 py-0.5 rounded border border-gray-700 bg-gray-800 text-gray-300 uppercase">
                                        {lesson.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {!term.lessons?.length && (
                    <div className="p-8 text-center text-gray-500">
                        No lessons added yet.
                    </div>
                )}
            </div>
        </div>

        {/* Create Lesson Sidebar */}
        <div>
            <div className="bg-white/5 border border-gray-800 rounded p-6 sticky top-6">
                <h2 className="font-semibold mb-4">Add Lesson</h2>
                
                <div className="space-y-4">
                    <div>
                        <label className="text-sm text-gray-400 block mb-1">Title</label>
                        <input
                            className="w-full bg-black border border-gray-700 rounded p-2 text-white"
                            placeholder="Lesson Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm text-gray-400 block mb-1">Type</label>
                            <select 
                                className="w-full bg-black border border-gray-700 rounded p-2 text-white"
                                value={contentType}
                                onChange={(e) => setContentType(e.target.value)}
                            >
                                <option value="video">Video</option>
                                <option value="article">Article</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm text-gray-400 block mb-1">Duration (m)</label>
                            <input
                                type="number"
                                className="w-full bg-black border border-gray-700 rounded p-2 text-white"
                                placeholder="Min"
                                value={duration}
                                onChange={(e) => setDuration(Number(e.target.value))}
                            />
                        </div>
                    </div>

                    <button
                        onClick={createLesson}
                        disabled={isCreating || !title}
                        className="w-full bg-white text-black py-2 rounded font-medium hover:bg-gray-200 disabled:opacity-50 transition-colors"
                    >
                        {isCreating ? "Adding..." : "Add Lesson"}
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
