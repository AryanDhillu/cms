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
  const [termTitle, setTermTitle] = useState("");
  const [isCreatingTerm, setIsCreatingTerm] = useState(false);

  useEffect(() => {
    apiFetch(`/cms/programs/${programId}`)
      .then(res => res.json())
      .then(setProgram)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [programId]);

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
      <div className="mb-6">
         <Link href="/dashboard/programs" className="text-sm text-gray-500 hover:text-white mb-2 block">
            ← Back to Programs
         </Link>
         <div className="flex justify-between items-start">
            <div>
               <h1 className="text-3xl font-bold">{program.title}</h1>
               <p className="text-gray-400 mt-1">{program.description || "No description"}</p>
            </div>
            <div className="flex gap-2">
               <span className="px-3 py-1 bg-blue-900/30 text-blue-300 rounded border border-blue-900 text-sm uppercase font-mono">
                  {program.language_primary}
               </span>
               <span className={`px-3 py-1 rounded border text-sm uppercase font-mono ${
                  program.status === 'published' 
                     ? 'bg-green-900/30 text-green-300 border-green-900' 
                     : 'bg-yellow-900/30 text-yellow-300 border-yellow-900'
               }`}>
                  {program.status}
               </span>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white/5 rounded border border-gray-800 p-6">
            <h2 className="text-lg font-semibold mb-4">Program Settings</h2>
            {/* Placeholder for Edit Form */}
            <p className="text-sm text-gray-500">Title and metadata editing coming separately.</p>
         </div>

         <div className="md:col-span-2 space-y-6">
            <h2 className="text-xl font-semibold border-b border-gray-800 pb-2">Terms & Curriculum</h2>
            
            <ul className="space-y-3 mt-4">
               {program.terms?.map((term: any) => (
                  <li key={term.id} className="border border-gray-800 rounded bg-white/5 hover:bg-white/10 transition-colors">
                     <Link href={`/dashboard/programs/${program.id}/terms/${term.id}`} className="block p-4">
                        <div className="flex justify-between items-center">
                           <span className="font-medium">
                              Term {term.termNumber}: {term.title}
                           </span>
                           <span className="text-sm text-gray-400">
                              {term.lessons?.length || 0} lessons →
                           </span>
                        </div>
                     </Link>
                  </li>
               ))}
               {!program.terms?.length && (
                  <p className="text-gray-500 italic">No terms yet.</p>
               )}
            </ul>

            {/* Create Term Form */}
            <div className="mt-6 flex gap-2">
               <input
                  className="bg-black border border-gray-700 p-2 rounded text-white flex-1"
                  placeholder="New Term Title (e.g. 'Foundations')"
                  value={termTitle}
                  onChange={e => setTermTitle(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && createTerm()}
               />
               <button 
                  onClick={createTerm}
                  disabled={isCreatingTerm || !termTitle}
                  className="bg-white text-black px-4 py-2 rounded font-medium disabled:opacity-50 hover:bg-gray-200 transition-colors"
               >
                  {isCreatingTerm ? 'Adding...' : 'Add Term'}
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
