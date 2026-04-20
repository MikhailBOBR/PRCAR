import path from "node:path";
import { spawnSync } from "node:child_process";

import { PrismaClient } from "@prisma/client";

import { loadProjectEnv } from "./env-loader.mjs";

loadProjectEnv();

const prisma = new PrismaClient();
const prismaCliPath = path.join(process.cwd(), "node_modules", "prisma", "build", "index.js");

async function main() {
  runPrismaStep("РЎРёРЅС…СЂРѕРЅРёР·РёСЂСѓСЋ СЃС…РµРјСѓ Р±Р°Р·С‹ РґР°РЅРЅС‹С…", ["db", "push", "--skip-generate"]);

  try {
    const [userCount, carCount] = await Promise.all([prisma.user.count(), prisma.car.count()]);

    if (userCount === 0 && carCount === 0) {
      runPrismaStep("Р‘Р°Р·Р° РїСѓСЃС‚Р°СЏ. Р—Р°РіСЂСѓР¶Р°СЋ demo-РґР°РЅРЅС‹Рµ", ["db", "seed"]);
    }
  } finally {
    await prisma.$disconnect();
  }

  process.stdout.write("[PRCAR] Р‘Р°Р·Р° РґР°РЅРЅС‹С… РіРѕС‚РѕРІР° Рє Р·Р°РїСѓСЃРєСѓ.\n");
}

function runPrismaStep(label, args) {
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

main().catch((error) => {
  process.stderr.write("[PRCAR] РќРµ СѓРґР°Р»РѕСЃСЊ РїРѕРґРіРѕС‚РѕРІРёС‚СЊ Р±Р°Р·Сѓ РґР°РЅРЅС‹С….\n");
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(1);
});
