import Link from "next/link";

interface TermHeaderProps {
    programId: string;
    term: any;
    isEditingTerm: boolean;
    setIsEditingTerm: (val: boolean) => void;
    editTermTitle: string;
    setEditTermTitle: (val: string) => void;
    updateTerm: () => void;
}

export function TermHeader({
    programId, term,
    isEditingTerm, setIsEditingTerm,
    editTermTitle, setEditTermTitle,
    updateTerm
}: TermHeaderProps) {
    return (
      <div className="mb-6">
         <Link href={`/dashboard/programs/${programId}`} className="text-sm text-gray-500 hover:text-gray-900 mb-2 block transition-colors">
            ← Back to Program
         </Link>
         
         {isEditingTerm ? (
            <div className="flex items-center gap-3">
                <span className="text-3xl text-gray-400 font-normal">Term {term.termNumber}:</span>
                <input 
                    className="text-3xl font-bold text-gray-900 border-b-2 border-blue-500 outline-none bg-transparent min-w-75"
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
    );
}
