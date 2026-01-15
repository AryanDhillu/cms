import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

// POST /cms/terms/:termId/lessons
export const createLesson = async (req: Request, res: Response) => {
  try {
    const termId = req.params.termId as string;
    const { title, contentType, duration } = req.body; // duration is in minutes

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
    const { title, contentType, duration } = req.body;

    const updateData: any = {};
    if (title) updateData.title = title;
    if (contentType) updateData.contentType = contentType;
    if (duration !== undefined) updateData.durationMs = duration * 60 * 1000;

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
