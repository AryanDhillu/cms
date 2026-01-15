import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

// POST /cms/terms/:termId/lessons
export const createLesson = async (req: Request, res: Response) => {
  try {
    const termId = req.params.termId as string;
    const { 
        title, contentType, duration, videoUrl, thumbnailUrl,
        contentLanguagePrimary, contentLanguagesAvailable, contentUrlsByLanguage 
    } = req.body; 

    if (!termId || !title || !contentType) {
        return res.status(400).json({ message: "Term ID, title and content type are required" });
    }

    // Language defaults/logic
    const primaryLang = contentLanguagePrimary || "en";
    const availableLangs = contentLanguagesAvailable || [primaryLang];
    const urlsByLang = contentUrlsByLanguage || (videoUrl ? { [primaryLang]: videoUrl } : {});

    // Validation
    if (!availableLangs.includes(primaryLang)) {
        return res.status(400).json({ message: "Primary content language must be included" });
    }
    if (!urlsByLang[primaryLang] && contentType === 'video') { 
        // Only enforce for video if strictly following rules, 
        // basically "if primary language content URL missing"
        // But if videoUrl is missing, maybe it's fine for draft?
        // Prompt says "Primary language content URL missing" error is required rule.
        // Assuming this applies when data is provided.
        // If it's a draft, maybe looser? 
        // Spec: "Backend Validation Rules (Very Important) ... throw new Error"
        // I will return 400.
        return res.status(400).json({ message: "Primary language content URL missing" });
    }

    // Get current lessons count to determine next number
    const lessonsCount = await prisma.lesson.count({
        where: { termId }
    });

    const lesson = await prisma.lesson.create({
      data: {
        termId,
        title,
        contentType,
        durationMs: duration ? duration * 60 * 1000 : 0, 
        videoUrl, // Legacy/Fallback
        thumbnailUrl,
        
        contentLanguagePrimary: primaryLang,
        contentLanguagesAvailable: availableLangs,
        contentUrlsByLanguage: urlsByLang,

        lessonNumber: lessonsCount + 1,
        status: "draft"
      },
    });

    res.status(201).json(lesson);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create lesson" });
  }
};

// PUT /cms/lessons/:id
export const updateLesson = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { 
        title, contentType, duration, videoUrl, thumbnailUrl,
        contentLanguagePrimary, contentLanguagesAvailable, contentUrlsByLanguage,
        publishAt, status
    } = req.body;

    const current = await prisma.lesson.findUnique({ where: { id } });
    if (!current) return res.status(404).json({ message: "Lesson not found" });

    const updateData: any = {};
    if (title) updateData.title = title;
    if (contentType) updateData.contentType = contentType;
    if (duration !== undefined) updateData.durationMs = duration * 60 * 1000;
    if (videoUrl !== undefined) updateData.videoUrl = videoUrl;
    if (thumbnailUrl !== undefined) updateData.thumbnailUrl = thumbnailUrl;
    if (publishAt !== undefined) updateData.publishAt = publishAt;
    if (status) updateData.status = status;

    // Language updates with validation
    if (contentLanguagePrimary || contentLanguagesAvailable || contentUrlsByLanguage) {
        const newPrimary = contentLanguagePrimary || current.contentLanguagePrimary;
        const newAvailable = contentLanguagesAvailable || current.contentLanguagesAvailable;
        // cast current.contentUrlsByLanguage to any/object to be safe
        const currentUrls = current.contentUrlsByLanguage as any || {};
        const newUrls = contentUrlsByLanguage || currentUrls;

        if (!newAvailable.includes(newPrimary)) {
            return res.status(400).json({ message: "Primary content language must be included" });
        }
        if (!newUrls[newPrimary] && (contentType === 'video' || current.contentType === 'video')) {
             return res.status(400).json({ message: "Primary language content URL missing" });
        }

        updateData.contentLanguagePrimary = newPrimary;
        updateData.contentLanguagesAvailable = newAvailable;
        updateData.contentUrlsByLanguage = newUrls;
    }

    const lesson = await prisma.lesson.update({
      where: { id },
      data: updateData,
    });

    res.json(lesson);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update lesson" });
  }
};

// POST /cms/lessons/:id/publish
export const publishLesson = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const lesson = await prisma.lesson.update({
      where: { id },
      data: {
        status: "published",
        publishedAt: new Date(),
      },
    });

    res.json(lesson);
  } catch (error) {
    res.status(500).json({ message: "Failed to publish lesson" });
  }
};

// POST /cms/lessons/:id/unpublish
export const unpublishLesson = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const lesson = await prisma.lesson.update({
      where: { id },
      data: {
        status: "draft",
        publishedAt: null,
      },
    });

    res.json(lesson);
  } catch (error) {
    res.status(500).json({ message: "Failed to unpublish lesson" });
  }
};
