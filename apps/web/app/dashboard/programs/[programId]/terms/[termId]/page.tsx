"use client";

import { useEffect, useState, use } from "react";
import { apiFetch } from "@/lib/api";
import { TermHeader } from "@/app/dashboard/programs/_components/TermHeader";
import { LessonList } from "@/app/dashboard/programs/_components/LessonList";
import { CreateLessonForm } from "@/app/dashboard/programs/_components/CreateLessonForm";

export default function LessonsPage({ params }: { params: Promise<{ programId: string, termId: string }> }) {
  const { programId, termId } = use(params);

  const [term, setTerm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Term Edit
  const [isEditingTerm, setIsEditingTerm] = useState(false);
  const [editTermTitle, setEditTermTitle] = useState("");

  // Lesson Edit
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [editLessonData, setEditLessonData] = useState<any>({ title: "", contentType: "video", duration: 10, videoUrl: "", thumbnailUrl: "" });

  // Create Lesson Form State
  const [title, setTitle] = useState("");
  const [contentType, setContentType] = useState("video");
  const [duration, setDuration] = useState(10);
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
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
        duration: Math.round(lesson.durationMs / 60000),
        videoUrl: lesson.videoUrl || "",
        thumbnailUrl: lesson.thumbnailUrl || ""
    });
  }

  async function updateLesson(lessonId: string) {
    try {
        await apiFetch(`/cms/lessons/${lessonId}`, {
            method: "PUT",
            body: JSON.stringify({
                title: editLessonData.title,
                contentType: editLessonData.contentType,
                duration: Number(editLessonData.duration),
                videoUrl: editLessonData.videoUrl,
                thumbnailUrl: editLessonData.thumbnailUrl
            })
        });
        
        // Update local state
        setTerm((t: any) => ({
            ...t,
            lessons: t.lessons.map((l: any) => l.id === lessonId ? {
                ...l,
                title: editLessonData.title,
                contentType: editLessonData.contentType,
                durationMs: editLessonData.duration * 60000,
                videoUrl: editLessonData.videoUrl,
                thumbnailUrl: editLessonData.thumbnailUrl
            } : l)
        }));
        setEditingLessonId(null);
    } catch (e) {
        console.error(e);
        alert("Failed to update lesson");
    }
  }

  async function toggleLessonPublish(lesson: any) {
    const action = lesson.status === 'published' ? 'unpublish' : 'publish';
    if (!confirm(`Are you sure you want to ${action} this lesson?`)) return;

    try {
        const res = await apiFetch(`/cms/lessons/${lesson.id}/${action}`, {
            method: "POST"
        });

        if (!res.ok) throw new Error("Failed");
        const updated = await res.json();

        setTerm((t: any) => ({
            ...t,
            lessons: t.lessons.map((l: any) => l.id === lesson.id ? { ...l, status: updated.status } : l)
        }));
    } catch (e) {
        console.error(e);
        alert(`Failed to ${action} lesson`);
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
                duration: Number(duration),
                videoUrl,
                thumbnailUrl
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
      <TermHeader 
        programId={programId}
        term={term}
        isEditingTerm={isEditingTerm}
        setIsEditingTerm={setIsEditingTerm}
        editTermTitle={editTermTitle}
        setEditTermTitle={setEditTermTitle}
        updateTerm={updateTerm}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
            <LessonList 
                term={term}
                editingLessonId={editingLessonId}
                setEditingLessonId={setEditingLessonId}
                editLessonData={editLessonData}
                setEditLessonData={setEditLessonData}
                updateLesson={updateLesson}
                startEditingLesson={startEditingLesson}
                toggleLessonPublish={toggleLessonPublish}
            />
        </div>

        <div className="md:col-span-1">
            <CreateLessonForm 
                title={title} setTitle={setTitle}
                contentType={contentType} setContentType={setContentType}
                duration={duration} setDuration={setDuration}
                videoUrl={videoUrl} setVideoUrl={setVideoUrl}
                thumbnailUrl={thumbnailUrl} setThumbnailUrl={setThumbnailUrl}
                createLesson={createLesson}
                isCreating={isCreating}
            />
        </div>
      </div>
    </div>
  );
}
