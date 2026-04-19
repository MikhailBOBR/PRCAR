import path from "node:path";
import { spawnSync } from "node:child_process";

import { PrismaClient } from "@prisma/client";

import { loadProjectEnv } from "./env-loader";

loadProjectEnv();

const prisma = new PrismaClient();
const prismaCliPath = path.join(process.cwd(), "node_modules", "prisma", "build", "index.js");

async function main() {
  runPrismaStep("Синхронизирую схему базы данных", ["db", "push", "--skip-generate"]);

  try {
    const [userCount, carCount] = await Promise.all([prisma.user.count(), prisma.car.count()]);

    if (userCount === 0 && carCount === 0) {
      runPrismaStep("База пустая. Загружаю demo-данные", ["db", "seed"]);
    }
  } finally {
    await prisma.$disconnect();
  }

  process.stdout.write("[PRCAR] База данных готова к запуску.\n");
}

function runPrismaStep(label: string, args: string[]) {
  process.stdout.write(`[PRCAR] ${label}...\n`);

  const result = spawnSync(process.execPath, [prismaCliPath, ...args], {
    stdio: "inherit",
    env: process.env,
  });

  if (result.error) {
    process.stderr.write(`[PRCAR] Prisma step failed: ${result.error.message}\n`);
    process.exit(1);
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

main().catch((error: unknown) => {
  process.stderr.write("[PRCAR] Не удалось подготовить базу данных.\n");
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(1);
});
