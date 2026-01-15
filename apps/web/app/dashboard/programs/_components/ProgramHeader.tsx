import Link from "next/link";

export function ProgramHeader({ program }: { program: any }) {
  return (
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
  );
}
