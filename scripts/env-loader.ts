import fs from "node:fs";
import path from "node:path";

export const DEFAULT_DATABASE_URL =
  "postgresql://postgres:postgres@localhost:5433/prcar?schema=public";

const ENV_FILES = [".env", ".env.local", ".env.example"];

export function loadProjectEnv(projectRoot = process.cwd()) {
  for (const fileName of ENV_FILES) {
    loadEnvFile(path.join(projectRoot, fileName));
  }

  process.env.DATABASE_URL ??= DEFAULT_DATABASE_URL;
}

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
