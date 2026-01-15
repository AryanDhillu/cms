interface CreateLessonFormProps {
    title: string;
    setTitle: (val: string) => void;
    contentType: string;
    setContentType: (val: string) => void;
    duration: number;
    setDuration: (val: number) => void;
    videoUrl: string;
    setVideoUrl: (val: string) => void;
    thumbnailUrl: string;
    setThumbnailUrl: (val: string) => void;
    createLesson: () => void;
    isCreating: boolean;
}

export function CreateLessonForm({
    title, setTitle,
    contentType, setContentType,
    duration, setDuration,
    videoUrl, setVideoUrl,
    thumbnailUrl, setThumbnailUrl,
    createLesson, isCreating
}: CreateLessonFormProps) {
    return (
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
                    
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Video URL</label>
                            <input
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-gray-900 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                placeholder="e.g. YouTube URL"
                                value={videoUrl}
                                onChange={(e) => setVideoUrl(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Thumbnail URL</label>
                            <input
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-gray-900 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                placeholder="Image URL"
                                value={thumbnailUrl}
                                onChange={(e) => setThumbnailUrl(e.target.value)}
                            />
                        </div>
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
    );
}
