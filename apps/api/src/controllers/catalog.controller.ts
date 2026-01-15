import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const listPrograms = async (req: Request, res: Response) => {
  try {
    const language = req.query.language as string | undefined;

    const where: any = {
      status: "published",
      terms: {
        some: {
          lessons: {
            some: {
              status: "published",
            },
          },
        },
      },
    };

    if (language) {
        where.languagesAvailable = { has: language };
    }

    const programs = await prisma.program.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      select: {
        id: true,
        title: true,
        description: true,
        thumbnailUrl: true,
        bannerUrl: true,
        portraitUrl: true,
        languagesAvailable: true,
        languagePrimary: true,
      },
    });

    res.json(programs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch programs" });
  }
};

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

export const getLessonDetail = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const requestedLanguage = req.query.language as string | undefined;

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
        durationMs: true,
        contentLanguagePrimary: true,
        contentUrlsByLanguage: true,
      }
    });

    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found or unavailable" });
    }

    const urls = lesson.contentUrlsByLanguage as Record<string, string> || {};
    const primaryLang = lesson.contentLanguagePrimary || "en";
    
    const url = (requestedLanguage && urls[requestedLanguage]) 
        ? urls[requestedLanguage] 
        : (urls[primaryLang] || lesson.videoUrl);

    if (!url) {
        return res.status(404).json({ message: "Content unavailable this language" });
    }

    res.json({
        ...lesson,
        videoUrl: url,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch lesson detail" });
  }
};
