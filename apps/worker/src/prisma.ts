import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";
import path from "path";

// Try to load .env from root, then local
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });
dotenv.config();

const connectionString = process.env.DATABASE_URL;

// Prevent initializing with undefined connection string in build phase if env parsers are missing
// but allow it to fail at runtime if missing.
const pool = new Pool({ connectionString: connectionString || "" });
const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });
