import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

// Force re-check
// GET /cms/programs
export const listPrograms = async (req: Request, res: Response) => {
  try {
    const programs = await prisma.program.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(programs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch programs" });
  }
};

// POST /cms/programs
export const createProgram = async (req: Request, res: Response) => {
  try {
    const { title, description, languagePrimary, languagesAvailable, thumbnailUrl, bannerUrl, portraitUrl } = req.body;
    
    // Default validation values
    const primary = languagePrimary || "en";
    const available = languagesAvailable && languagesAvailable.length > 0 ? languagesAvailable : [primary];

    if (!available.includes(primary)) {
        return res.status(400).json({ message: "Primary language must be included in available languages" });
    }

    const program = await prisma.program.create({
      data: {
        title,
        description,
        languagePrimary: primary,
        languagesAvailable: available,
        thumbnailUrl,
        bannerUrl,
        portraitUrl,
        status: "draft",
      },
    });
    
    res.status(201).json(program);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create program" });
  }
};

// GET /cms/programs/:id
export const getProgram = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const program = await prisma.program.findUnique({
      where: { id },
      include: {
        terms: {
          include: {
            lessons: true
          },
          orderBy: { termNumber: 'asc' }
        }
      }
    });

    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }

    res.json(program);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch program" });
  }
};

// PUT /cms/programs/:id
export const updateProgram = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { 
        title, description, languagePrimary, languagesAvailable, status, 
        thumbnailUrl, bannerUrl, portraitUrl, publishAt 
    } = req.body;

    // Fetch existing if partial update
    const current = await prisma.program.findUnique({ where: { id } });
    if (!current) return res.status(404).json({ message: "Program not found" });

    const newPrimary = languagePrimary || current.languagePrimary;
    const newAvailable = languagesAvailable || current.languagesAvailable;

    if (!newAvailable.includes(newPrimary)) {
        return res.status(400).json({ message: "Primary language must be included in available languages" });
    }

    const program = await prisma.program.update({
      where: { id },
      data: {
        title,
        description,
        languagePrimary: newPrimary,
        languagesAvailable: newAvailable,
        status,
        publishAt,
        thumbnailUrl,
        bannerUrl,
        portraitUrl
      },
    });

    res.json(program);
  } catch (error) {
    res.status(500).json({ message: "Failed to update program" });
  }
};

// POST /cms/programs/:id/publish
export const publishProgram = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const program = await prisma.program.update({
      where: { id },
      data: {
        status: "published",
        publishedAt: new Date(),
      },
    });

    res.json(program);
  } catch (error) {
    res.status(500).json({ message: "Failed to publish program" });
  }
};

// POST /cms/programs/:id/unpublish
export const unpublishProgram = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const program = await prisma.program.update({
      where: { id },
      data: {
        status: "draft",
        publishedAt: null,
      },
    });

    res.json(program);
  } catch (error) {
    res.status(500).json({ message: "Failed to unpublish program" });
  }
};
