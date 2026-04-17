import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "prisma/config";

const DEFAULT_DATABASE_URL = "postgresql://postgres:postgres@localhost:5433/prcar?schema=public";

for (const fileName of [".env", ".env.local", ".env.example"]) {
  loadEnvFile(path.join(process.cwd(), fileName));
}

process.env.DATABASE_URL ??= DEFAULT_DATABASE_URL;

function loadEnvFile(filePath: string) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const fileContents = fs.readFileSync(filePath, "utf8");

  for (const line of fileContents.split(/\r?\n/u)) {
    const trimmedLine = line.trim();

    if (!trimmedLine || trimmedLine.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmedLine.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmedLine.slice(0, separatorIndex).trim();

    if (!key || process.env[key] !== undefined) {
      continue;
    }

    const rawValue = trimmedLine.slice(separatorIndex + 1).trim();
    process.env[key] = rawValue.replace(/^(['"])(.*)\1$/u, "$2");
  }
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  engine: "classic",
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
