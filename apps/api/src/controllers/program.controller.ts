import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

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
    const { title, description, language_primary } = req.body;
    
    const program = await prisma.program.create({
      data: {
        title,
        description,
        language_primary: language_primary || "en",
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
    const { title, description, language_primary, status } = req.body;

    const program = await prisma.program.update({
      where: { id },
      data: {
        title,
        description,
        language_primary,
        status,
      },
    });

    res.json(program);
  } catch (error) {
    res.status(500).json({ message: "Failed to update program" });
  }
};
