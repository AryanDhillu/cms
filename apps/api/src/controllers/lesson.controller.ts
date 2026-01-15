import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

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

    const primaryLang = contentLanguagePrimary || "en";
    const availableLangs = contentLanguagesAvailable || [primaryLang];
    const urlsByLang = contentUrlsByLanguage || (videoUrl ? { [primaryLang]: videoUrl } : {});

    if (!availableLangs.includes(primaryLang)) {
        return res.status(400).json({ message: "Primary content language must be included" });
    }
    if (!urlsByLang[primaryLang] && contentType === 'video') { 
        return res.status(400).json({ message: "Primary language content URL missing" });
    }

    const lessonsCount = await prisma.lesson.count({
        where: { termId }
    });

    const lesson = await prisma.lesson.create({
      data: {
        termId,
        title,
        contentType,
        durationMs: duration ? duration * 60 * 1000 : 0, 
        videoUrl, 
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

    if (title !== undefined && title.trim().length === 0) {
      return res.status(400).json({ message: "Lesson title cannot be empty" });
    }

    const updateData: any = {};
    if (title) updateData.title = title;
    if (contentType) updateData.contentType = contentType;
    if (duration !== undefined) updateData.durationMs = duration * 60 * 1000;
    if (videoUrl !== undefined) updateData.videoUrl = videoUrl;
    if (thumbnailUrl !== undefined) updateData.thumbnailUrl = thumbnailUrl;
    if (publishAt !== undefined) updateData.publishAt = publishAt;
    if (status) updateData.status = status;

    if (contentLanguagePrimary || contentLanguagesAvailable || contentUrlsByLanguage) {
        const newPrimary = contentLanguagePrimary || current.contentLanguagePrimary;
        const newAvailable = contentLanguagesAvailable || current.contentLanguagesAvailable;
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

export const deleteLesson = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await prisma.lesson.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete lesson" });
  }
};
