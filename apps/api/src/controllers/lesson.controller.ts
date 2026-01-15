import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

// POST /cms/terms/:termId/lessons
export const createLesson = async (req: Request, res: Response) => {
  try {
    const termId = req.params.termId as string;
    const { title, contentType, duration, videoUrl, thumbnailUrl } = req.body; // duration is in minutes

    if (!termId || !title || !contentType) {
        return res.status(400).json({ message: "Term ID, title and content type are required" });
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
        durationMs: duration ? duration * 60 * 1000 : 0, // Convert minutes to ms
        videoUrl,
        thumbnailUrl,
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
    const { title, contentType, duration, videoUrl, thumbnailUrl } = req.body;

    const updateData: any = {};
    if (title) updateData.title = title;
    if (contentType) updateData.contentType = contentType;
    if (duration !== undefined) updateData.durationMs = duration * 60 * 1000;
    if (videoUrl !== undefined) updateData.videoUrl = videoUrl;
    if (thumbnailUrl !== undefined) updateData.thumbnailUrl = thumbnailUrl;

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
