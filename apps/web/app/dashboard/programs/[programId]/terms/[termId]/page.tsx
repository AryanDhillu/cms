"use client";

import { useEffect, useState, use } from "react";
import { apiFetch } from "@/lib/api";
import Link from "next/link";

export default function LessonsPage({ params }: { params: Promise<{ programId: string, termId: string }> }) {
  const { programId, termId } = use(params);

  const [term, setTerm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Term Edit
  const [isEditingTerm, setIsEditingTerm] = useState(false);
  const [editTermTitle, setEditTermTitle] = useState("");

  // Lesson Edit
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [editLessonData, setEditLessonData] = useState({ title: "", contentType: "video", duration: 10 });

  // Create Lesson Form State
  const [title, setTitle] = useState("");
  const [contentType, setContentType] = useState("video");
  const [duration, setDuration] = useState(10);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    apiFetch(`/cms/terms/${termId}`)
      .then(res => res.json())
      .then(data => {
        setTerm(data);
        setEditTermTitle(data.title);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [termId]);

  async function updateTerm() {
    if (!editTermTitle) return;
    try {
      await apiFetch(`/cms/terms/${termId}`, {
        method: "PUT",
        body: JSON.stringify({ title: editTermTitle }),
      });
      setTerm((t: any) => ({ ...t, title: editTermTitle }));
      setIsEditingTerm(false);
    } catch (e) {
      console.error(e);
      alert("Failed to update term");
    }
  }

  function startEditingLesson(lesson: any) {
    setEditingLessonId(lesson.id);
    setEditLessonData({
        title: lesson.title,
        contentType: lesson.contentType,
        duration: Math.round(lesson.durationMs / 60000)
    });
  }

  async function updateLesson(lessonId: string) {
    try {
        await apiFetch(`/cms/lessons/${lessonId}`, {
            method: "PUT",
            body: JSON.stringify({
                title: editLessonData.title,
                contentType: editLessonData.contentType,
                duration: Number(editLessonData.duration)
            })
        });
        
        // Update local state
        setTerm((t: any) => ({
            ...t,
            lessons: t.lessons.map((l: any) => l.id === lessonId ? {
                ...l,
                title: editLessonData.title,
                contentType: editLessonData.contentType,
                durationMs: editLessonData.duration * 60000
            } : l)
        }));
        setEditingLessonId(null);
    } catch (e) {
        console.error(e);
        alert("Failed to update lesson");
    }
  }

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
         <Link href={`/dashboard/programs/${programId}`} className="text-sm text-gray-500 hover:text-gray-900 mb-2 block transition-colors">
            ← Back to Program
         </Link>
         
         {isEditingTerm ? (
            <div className="flex items-center gap-3">
                <span className="text-3xl text-gray-400 font-normal">Term {term.termNumber}:</span>
                <input 
                    className="text-3xl font-bold text-gray-900 border-b-2 border-blue-500 outline-none bg-transparent min-w-[300px]"
                    value={editTermTitle}
                    onChange={e => setEditTermTitle(e.target.value)}
                    autoFocus
                />
                <button onClick={updateTerm} className="text-sm bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition-colors">Save</button>
                <button onClick={() => setIsEditingTerm(false)} className="text-sm text-gray-500 hover:text-gray-900 px-2">Cancel</button>
            </div>
         ) : (
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2 group">
                <span className="text-gray-400 font-normal">Term {term.termNumber}:</span> 
                {term.title}
                <button 
                  onClick={() => setIsEditingTerm(true)} 
                  className="opacity-0 group-hover:opacity-100 ml-2 p-1 text-gray-400 hover:text-blue-600 transition-all"
                  title="Edit Term Title"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                </button>
            </h1>
         )}
         <p className="text-gray-500 mt-1">Manage lessons content.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Lessons List - Main Content */}
        <div className="md:col-span-2">
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 text-sm border-b border-gray-200">
                        <tr>
                            <th className="p-3 font-medium w-12">#</th>
                            <th className="p-3 font-medium">Title</th>
                            <th className="p-3 font-medium w-32">Type</th>
                            <th className="p-3 font-medium w-32">Duration</th>
                            <th className="p-3 font-medium w-24">Status</th>
                            <th className="p-3 font-medium w-24"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {term.lessons?.map((lesson: any) => (
                            <tr key={lesson.id} className="hover:bg-gray-50 transition-colors group">
                                {editingLessonId === lesson.id ? (
                                    <>
                                        <td className="p-3 text-gray-500 align-middle">{lesson.lessonNumber}</td>
                                        <td className="p-3 align-middle">
                                            <input 
                                                className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:border-blue-500 outline-none bg-white"
                                                value={editLessonData.title}
                                                onChange={e => setEditLessonData({...editLessonData, title: e.target.value})}
                                                autoFocus
                                            />
                                        </td>
                                        <td className="p-3 align-middle">
                                            <select 
                                                className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:border-blue-500 outline-none bg-white"
                                                value={editLessonData.contentType}
                                                onChange={e => setEditLessonData({...editLessonData, contentType: e.target.value})}
                                            >
                                                <option value="video">Video</option>
                                                <option value="article">Article</option>
                                            </select>
                                        </td>
                                        <td className="p-3 align-middle">
                                            <div className="flex items-center gap-1">
                                                <input 
                                                    type="number"
                                                    className="w-16 border border-gray-300 rounded px-2 py-1 text-sm focus:border-blue-500 outline-none bg-white"
                                                    value={editLessonData.duration}
                                                    onChange={e => setEditLessonData({...editLessonData, duration: Number(e.target.value)})}
                                                />
                                                <span className="text-xs text-gray-500">m</span>
                                            </div>
                                        </td>
                                        <td className="p-3 align-middle">
                                            <span className="text-gray-400 text-sm">-</span>
                                        </td>
                                        <td className="p-3 align-middle">
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => updateLesson(lesson.id)} className="text-green-600 hover:text-green-700 font-medium text-xs uppercase">Save</button>
                                                <button onClick={() => setEditingLessonId(null)} className="text-gray-400 hover:text-gray-600 text-xs uppercase">Cancel</button>
                                            </div>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td className="p-3 text-gray-500 align-middle">{lesson.lessonNumber}</td>
                                        <td className="p-3 font-medium text-gray-900 align-middle">{lesson.title}</td>
                                        <td className="p-3 align-middle">
                                            <span className={`text-xs px-2 py-0.5 rounded border uppercase ${
                                                lesson.contentType === 'video' 
                                                    ? 'bg-purple-50 text-purple-700 border-purple-200' 
                                                    : 'bg-blue-50 text-blue-700 border-blue-200'
                                            }`}>
                                                {lesson.contentType}
                                            </span>
                                        </td>
                                        <td className="p-3 text-gray-500 text-sm align-middle">
                                            {Math.round(lesson.durationMs / 60000)}m
                                        </td>
                                        <td className="p-3 align-middle">
                                            <span className="text-xs px-2 py-0.5 rounded border border-gray-200 bg-gray-100 text-gray-500 uppercase">
                                                {lesson.status}
                                            </span>
                                        </td>
                                        <td className="p-3 align-middle text-right">
                                            <button 
                                                onClick={() => startEditingLesson(lesson)}
                                                className="text-gray-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all font-medium text-sm"
                                            >
                                                Edit
                                            </button>
                                        </td>
                                    </>
                                )}
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
        <div className="md:col-span-1">
            <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <div className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                    </div>
                    <h2 className="font-semibold text-gray-900">Add New Lesson</h2>
                </div>
                
                <div className="space-y-5">
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Lesson Title</label>
                        <input
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-gray-900 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                            placeholder="e.g. 'Introduction to React'"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Content Type</label>
                            <div className="relative">
                                <select 
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-gray-900 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none appearance-none"
                                    value={contentType}
                                    onChange={(e) => setContentType(e.target.value)}
                                >
                                    <option value="video">Video</option>
                                    <option value="article">Article</option>
                                </select>
                                <div className="absolute right-3 top-3 pointer-events-none text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Duration</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-gray-900 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none pr-8"
                                    placeholder="0"
                                    value={duration}
                                    onChange={(e) => setDuration(Number(e.target.value))}
                                />
                                <span className="absolute right-3 top-2.5 text-gray-400 text-xs font-medium">min</span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={createLesson}
                        disabled={isCreating || !title}
                        className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-black disabled:opacity-50 transition-colors shadow-sm flex items-center justify-center gap-2 mt-4 text-sm"
                    >
                        {isCreating ? "Adding..." : "Add to Term"}
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
