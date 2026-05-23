import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";

declare global {
    var prisma: PrismaClient | undefined;
}

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

const db =
    globalThis.prisma ??
    new PrismaClient({
        adapter,
        log: ["query", "info", "warn", "error"],
    });

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;

export default db;
