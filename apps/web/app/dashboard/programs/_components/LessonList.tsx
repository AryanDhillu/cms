interface LessonListProps {
    term: any;
    editingLessonId: string | null;
    setEditingLessonId: (val: string | null) => void;
    editLessonData: any;
    setEditLessonData: (val: any) => void;
    updateLesson: (id: string) => void;
    startEditingLesson: (lesson: any) => void;
    toggleLessonPublish: (lesson: any) => void;
}

export function LessonList({
    term,
    editingLessonId, setEditingLessonId,
    editLessonData, setEditLessonData,
    updateLesson, startEditingLesson, toggleLessonPublish
}: LessonListProps) {
    return (
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
                                                className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:border-blue-500 outline-none bg-white font-medium"
                                                placeholder="Title"
                                                value={editLessonData.title}
                                                onChange={e => setEditLessonData({...editLessonData, title: e.target.value})}
                                                autoFocus
                                            />
                                            <div className="mt-2 space-y-1">
                                                <input 
                                                    className="w-full border border-gray-200 rounded px-2 py-1 text-xs focus:border-blue-500 outline-none bg-gray-50 text-gray-600"
                                                    placeholder="Video URL (e.g. YouTube)"
                                                    value={editLessonData.videoUrl || ""}
                                                    onChange={e => setEditLessonData({...editLessonData, videoUrl: e.target.value})}
                                                />
                                                <input 
                                                    className="w-full border border-gray-200 rounded px-2 py-1 text-xs focus:border-blue-500 outline-none bg-gray-50 text-gray-600"
                                                    placeholder="Thumbnail URL"
                                                    value={editLessonData.thumbnailUrl || ""}
                                                    onChange={e => setEditLessonData({...editLessonData, thumbnailUrl: e.target.value})}
                                                />
                                            </div>
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
                                            <span className={`text-xs px-2 py-0.5 rounded border border-gray-200 uppercase ${
                                                lesson.status === 'published' 
                                                ? 'bg-green-50 text-green-700 border-green-200' 
                                                : 'bg-gray-100 text-gray-500'
                                            }`}>
                                                {lesson.status}
                                            </span>
                                        </td>
                                        <td className="p-3 align-middle text-right">
                                            <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                                                <button 
                                                    onClick={() => toggleLessonPublish(lesson)}
                                                    className={`text-xs font-medium uppercase ${
                                                        lesson.status === 'published' 
                                                        ? 'text-red-500 hover:text-red-700' 
                                                        : 'text-green-600 hover:text-green-700'
                                                    }`}
                                                >
                                                    {lesson.status === 'published' ? 'Unpublish' : 'Publish'}
                                                </button>
                                                <button 
                                                    onClick={() => startEditingLesson(lesson)}
                                                    className="text-gray-400 hover:text-blue-600 font-medium text-sm"
                                                >
                                                    Edit
                                                </button>
                                            </div>
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
    );
}
