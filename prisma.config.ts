import { defineConfig } from "prisma/config";
import { DEFAULT_DATABASE_URL, loadProjectEnv } from "./scripts/env-loader.mjs";

loadProjectEnv();

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "node prisma/seed.mjs",
  },
  engine: "classic",
  datasource: {
    url: process.env.DATABASE_URL ?? DEFAULT_DATABASE_URL,
  },
});
