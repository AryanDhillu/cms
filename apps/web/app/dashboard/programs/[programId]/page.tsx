"use client";

import { useEffect, useState, use } from "react";
import { apiFetch } from "@/lib/api";
import { ProgramHeader } from "../_components/ProgramHeader";
import { ProgramSettings } from "../_components/ProgramSettings";
import { TermList } from "../_components/TermList";

export default function ProgramDetail({ params }: { params: Promise<{ programId: string }> }) {
  // Unwrap params using React.use() or async await pattern since Next.js 15+ params are promises (implied by latest versions)
  // safe way:
  const { programId } = use(params);

  const [program, setProgram] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Program Edit State
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editThumbnailUrl, setEditThumbnailUrl] = useState("");
  const [editBannerUrl, setEditBannerUrl] = useState("");
  const [editPortraitUrl, setEditPortraitUrl] = useState("");
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
        setEditThumbnailUrl(data.thumbnailUrl || "");
        setEditBannerUrl(data.bannerUrl || "");
        setEditPortraitUrl(data.portraitUrl || "");
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
          thumbnailUrl: editThumbnailUrl,
          bannerUrl: editBannerUrl,
          portraitUrl: editPortraitUrl,
        }),
      });
      
      if (!res.ok) throw new Error("Failed");

      setProgram((p: any) => ({ 
          ...p, 
          title: editTitle, 
          description: editDescription,
          thumbnailUrl: editThumbnailUrl,
          bannerUrl: editBannerUrl,
          portraitUrl: editPortraitUrl
      }));
      alert("Program details saved.");
    } catch (err) {
      console.error(err);
      alert("Failed to update program");
    } finally {
      setIsUpdating(false);
    }
  }

  async function togglePublish() {
    const action = program.status === 'published' ? 'unpublish' : 'publish';
    if (!confirm(`Are you sure you want to ${action} this program?`)) return;

    try {
      const res = await apiFetch(`/cms/programs/${programId}/${action}`, {
        method: "POST"
      });
      
      if (!res.ok) throw new Error("Failed");
      const updated = await res.json();
      setProgram((p: any) => ({ ...p, status: updated.status }));
    } catch (err) {
      console.error(err);
      alert(`Failed to ${action} program`);
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
      <ProgramHeader program={program} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <ProgramSettings 
            editTitle={editTitle} setEditTitle={setEditTitle}
            editDescription={editDescription} setEditDescription={setEditDescription}
            editThumbnailUrl={editThumbnailUrl} setEditThumbnailUrl={setEditThumbnailUrl}
            editBannerUrl={editBannerUrl} setEditBannerUrl={setEditBannerUrl}
            editPortraitUrl={editPortraitUrl} setEditPortraitUrl={setEditPortraitUrl}
            isUpdating={isUpdating} updateProgram={updateProgram}
            programStatus={program.status} togglePublish={togglePublish}
         />

         <div className="md:col-span-2 space-y-6">
            <TermList 
                programId={program.id}
                terms={program.terms}
                termTitle={termTitle}
                setTermTitle={setTermTitle}
                createTerm={createTerm}
                isCreatingTerm={isCreatingTerm}
            />
         </div>
      </div>
    </div>
  );
}
