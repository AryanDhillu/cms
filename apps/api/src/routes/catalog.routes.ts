import { Router } from "express";
import { getPrograms } from "../controllers/catalog.controller";

const router = Router();

router.get("/programs", getPrograms);

export default router;
