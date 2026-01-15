import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

// 1️⃣ API: List Programs
// GET /catalog/programs
export const listPrograms = async (req: Request, res: Response) => {
  try {
    const programs = await prisma.program.findMany({
      where: {
        status: "published", // Lowercase as established in schema/seeds
        terms: {
          some: {
            lessons: {
              some: {
                status: "published",
              },
            },
          },
        },
      },
      orderBy: { publishedAt: "desc" },
      select: {
        id: true,
        title: true,
        description: true,
        thumbnailUrl: true,
        bannerUrl: true,
        portraitUrl: true,
      },
    });

    res.json(programs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch programs" });
  }
};

// 2️⃣ API: Program Detail
// GET /catalog/programs/:id
export const getProgramDetail = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const program = await prisma.program.findFirst({
      where: { 
        id, 
        status: "published" 
      },
      include: {
        terms: {
          orderBy: { termNumber: "asc" },
          include: {
            lessons: {
              where: { status: "published" },
              orderBy: { lessonNumber: "asc" },
            },
          },
        },
      },
    });

    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }

    res.json(program);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch program detail" });
  }
};

// 3️⃣ API: Lesson Watch
// GET /catalog/lessons/:id
export const getLessonDetail = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    // Check if lesson is published and parent program is published
    // We can join tables to check parent program status
    const lesson = await prisma.lesson.findFirst({
      where: {
        id,
        status: "published",
        term: {
          program: {
            status: "published"
          }
        }
      },
      select: {
        id: true,
        title: true,
        videoUrl: true,
        thumbnailUrl: true,
        durationMs: true
      }
    });

    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found or unavailable" });
    }

    res.json(lesson);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch lesson detail" });
  }
};
