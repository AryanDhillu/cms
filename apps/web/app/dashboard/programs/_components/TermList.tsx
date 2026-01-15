import Link from "next/link";

interface TermListProps {
    programId: string;
    terms: any[];
    termTitle: string;
    setTermTitle: (val: string) => void;
    createTerm: () => void;
    isCreatingTerm: boolean;
    deleteTerm: (id: string) => void;
}

export function TermList({ 
    programId, terms, 
    termTitle, setTermTitle, 
    createTerm, isCreatingTerm,
    deleteTerm 
}: TermListProps) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                <h2 className="text-xl font-semibold text-gray-900">Terms & Curriculum</h2>
            </div>
            
            <ul className="space-y-3 mt-4">
               {terms?.map((term: any) => (
                  <li key={term.id} className="bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all group">
                     <Link href={`/dashboard/programs/${programId}/terms/${term.id}`} className="block p-5">
                        <div className="flex justify-between items-center">
                           <span className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                              Term {term.termNumber}: {term.title}
                           </span>
                           <span className="text-sm text-gray-400 group-hover:text-blue-500 transition-colors">
                              {term.lessons?.length || 0} lessons →
                           </span>
                        </div>
                     </Link>
                     <div className="border-t border-gray-100 flex justify-end p-2 bg-gray-50 rounded-b-lg">
                        <button 
                            onClick={() => deleteTerm(term.id)}
                            className="text-xs text-gray-400 hover:text-red-500 font-medium px-3 py-1 uppercase"
                        >
                           Delete Term
                        </button>
                     </div>
                  </li>
               ))}
               {!terms?.length && (
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
    );
}
