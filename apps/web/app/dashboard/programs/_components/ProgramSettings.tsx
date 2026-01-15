interface ProgramSettingsProps {
    editTitle: string;
    setEditTitle: (val: string) => void;
    editDescription: string;
    setEditDescription: (val: string) => void;
    editThumbnailUrl: string;
    setEditThumbnailUrl: (val: string) => void;
    editBannerUrl: string;
    setEditBannerUrl: (val: string) => void;
    editPortraitUrl: string;
    setEditPortraitUrl: (val: string) => void;
    isUpdating: boolean;
    updateProgram: () => void;
    programStatus: string;
    togglePublish: () => void;
}

export function ProgramSettings({ 
    editTitle, setEditTitle, 
    editDescription, setEditDescription,
    editThumbnailUrl, setEditThumbnailUrl,
    editBannerUrl, setEditBannerUrl,
    editPortraitUrl, setEditPortraitUrl,
    isUpdating, updateProgram, 
    programStatus, togglePublish 
}: ProgramSettingsProps) {
    return (
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

               <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Media Assets (URLs)</h3>
                  <div className="space-y-3">
                     <div>
                        <label className="text-xs font-medium text-gray-600 block mb-1">Thumbnail URL</label>
                        <input 
                           className="w-full border border-gray-300 rounded p-2 text-gray-900 text-sm focus:border-blue-500 outline-none"
                           placeholder="https://..."
                           value={editThumbnailUrl}
                           onChange={(e) => setEditThumbnailUrl(e.target.value)}
                        />
                     </div>
                     <div>
                        <label className="text-xs font-medium text-gray-600 block mb-1">Banner URL (Landscape)</label>
                        <input 
                           className="w-full border border-gray-300 rounded p-2 text-gray-900 text-sm focus:border-blue-500 outline-none"
                           placeholder="https://..."
                           value={editBannerUrl}
                           onChange={(e) => setEditBannerUrl(e.target.value)}
                        />
                     </div>
                     <div>
                        <label className="text-xs font-medium text-gray-600 block mb-1">Portrait URL (Poster)</label>
                        <input 
                           className="w-full border border-gray-300 rounded p-2 text-gray-900 text-sm focus:border-blue-500 outline-none"
                           placeholder="https://..."
                           value={editPortraitUrl}
                           onChange={(e) => setEditPortraitUrl(e.target.value)}
                        />
                     </div>
                  </div>
               </div>

               <button
                  onClick={updateProgram}
                  disabled={isUpdating || !editTitle}
                  className="w-full bg-blue-600 text-white py-2 rounded font-medium disabled:opacity-50 hover:bg-blue-700 transition-colors text-sm shadow-sm mt-2"
               >
                  {isUpdating ? "Saving..." : "Save Changes"}
               </button>

               <div className="pt-4 border-t border-gray-100 mt-4">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Publishing</h3>
                  <button
                    onClick={togglePublish}
                    className={`w-full py-2 rounded font-medium transition-colors text-sm shadow-sm border ${
                        programStatus === 'published'
                        ? 'bg-white text-red-600 border-red-200 hover:bg-red-50'
                        : 'bg-green-600 text-white border-transparent hover:bg-green-700'
                    }`}
                  >
                    {programStatus === 'published' ? "Unpublish Program" : "Publish Program"}
                  </button>
               </div>
            </div>
         </div>
    );
}
