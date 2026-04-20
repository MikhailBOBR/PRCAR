const target = process.env.HEALTHCHECK_URL ?? "http://127.0.0.1:3000/api/health";

try {
  const response = await fetch(target, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Healthcheck responded with status ${response.status}`);
  }
} catch (error) {
  process.stderr.write(`[PRCAR] Healthcheck failed for ${target}\n`);
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(1);
}
