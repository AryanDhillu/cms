"use client";

import { useEffect, useState, use } from "react";
import { apiFetch } from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProgramDetail({ params }: { params: Promise<{ programId: string }> }) {
  // Unwrap params using React.use() or async await pattern since Next.js 15+ params are promises (implied by latest versions)
  // safe way:
  const { programId } = use(params);

  const [program, setProgram] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Program Edit State
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Term Creation State
  const [termTitle, setTermTitle] = useState("");
  const [isCreatingTerm, setIsCreatingTerm] = useState(false);

  useEffect(() => {
    apiFetch(`/cms/programs/${programId}`)
      .then(res => res.json())
      .then(data => {
        setProgram(data);
        setEditTitle(data.title);
        setEditDescription(data.description || "");
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [programId]);

  async function updateProgram() {
    setIsUpdating(true);
    try {
      const res = await apiFetch(`/cms/programs/${programId}`, {
        method: "PUT",
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
        }),
      });
      
      if (!res.ok) throw new Error("Failed");

      setProgram((p: any) => ({ ...p, title: editTitle, description: editDescription }));
      alert("Program details saved.");
    } catch (err) {
      console.error(err);
      alert("Failed to update program");
    } finally {
      setIsUpdating(false);
    }
  }

  async function createTerm() {
    if (!termTitle) return;
    setIsCreatingTerm(true);

    try {
      await apiFetch(`/cms/programs/${program.id}/terms`, {
        method: "POST",
        body: JSON.stringify({
          title: termTitle,
          termNumber: (program.terms?.length || 0) + 1,
        }),
      });
  
      window.location.reload();
    } catch(err) {
      console.error(err);
      alert("Failed to create term");
      setIsCreatingTerm(false);
    }
  }

  if (loading) return <div className="p-4 text-gray-500">Loading details...</div>;
  if (!program) return <div className="p-4 text-red-500">Program not found</div>;

  return (
    <div>
      <div className="mb-8">
         <Link href="/dashboard/programs" className="text-sm text-gray-500 hover:text-gray-900 mb-2 block transition-colors">
            ← Back to Programs
         </Link>
         <div className="flex justify-between items-start">
            <div>
               <h1 className="text-3xl font-bold text-gray-900">{program.title}</h1>
               <p className="text-gray-500 mt-1">{program.description || "No description"}</p>
            </div>
            <div className="flex gap-2">
               <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded border border-blue-200 text-sm uppercase font-mono tracking-wide">
                  {program.language_primary}
               </span>
               <span className={`px-3 py-1 rounded border text-sm uppercase font-mono tracking-wide ${
                  program.status === 'published' 
                     ? 'bg-green-50 text-green-700 border-green-200' 
                     : 'bg-amber-50 text-amber-700 border-amber-200'
               }`}>
                  {program.status}
               </span>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm h-fit">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">Program Settings</h2>
            
            <div className="space-y-4">
               <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Title</label>
                  <input 
                     className="w-full border border-gray-300 rounded p-2 text-gray-900 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                     value={editTitle}
                     onChange={(e) => setEditTitle(e.target.value)}
                  />
               </div>

               <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Description</label>
                  <textarea 
                     className="w-full border border-gray-300 rounded p-2 text-gray-900 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm h-24 resize-none"
                     value={editDescription}
                     onChange={(e) => setEditDescription(e.target.value)}
                  />
               </div>

               <button
                  onClick={updateProgram}
                  disabled={isUpdating || !editTitle}
                  className="w-full bg-blue-600 text-white py-2 rounded font-medium disabled:opacity-50 hover:bg-blue-700 transition-colors text-sm shadow-sm"
               >
                  {isUpdating ? "Saving..." : "Save Changes"}
               </button>
            </div>
         </div>

         <div className="md:col-span-2 space-y-6">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                <h2 className="text-xl font-semibold text-gray-900">Terms & Curriculum</h2>
            </div>
            
            <ul className="space-y-3 mt-4">
               {program.terms?.map((term: any) => (
                  <li key={term.id} className="bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all group">
                     <Link href={`/dashboard/programs/${program.id}/terms/${term.id}`} className="block p-5">
                        <div className="flex justify-between items-center">
                           <span className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                              Term {term.termNumber}: {term.title}
                           </span>
                           <span className="text-sm text-gray-400 group-hover:text-blue-500 transition-colors">
                              {term.lessons?.length || 0} lessons →
                           </span>
                        </div>
                     </Link>
                  </li>
               ))}
               {!program.terms?.length && (
                  <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg bg-gray-50">
                    <p className="text-gray-500 italic">No terms yet.</p>
                  </div>
               )}
            </ul>

            {/* Create Term Form */}
            <div className="mt-6 flex gap-3 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
               <input
                  className="bg-white border border-gray-300 p-2 rounded text-gray-900 flex-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="New Term Title (e.g. 'Foundations')"
                  value={termTitle}
                  onChange={e => setTermTitle(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && createTerm()}
               />
               <button 
                  onClick={createTerm}
                  disabled={isCreatingTerm || !termTitle}
                  className="bg-blue-600 text-white px-4 py-2 rounded font-medium disabled:opacity-50 hover:bg-blue-700 transition-colors shadow-sm"
               >
                  {isCreatingTerm ? 'Adding...' : 'Add Term'}
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
