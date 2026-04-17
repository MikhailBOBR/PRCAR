import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import sharp from "sharp";

import { MAX_IMAGE_SIZE_BYTES } from "@/lib/constants";
import { AppError } from "@/lib/errors";
import { env } from "@/lib/env";

const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/svg+xml"]);

export type PersistedImage = {
  key: string;
  url: string;
  alt: string;
};

function ensureSupportedImage(file: File) {
  if (!allowedMimeTypes.has(file.type)) {
    throw new AppError("Допустимы только JPG, PNG, WEBP или SVG.", 400);
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    throw new AppError("Файл слишком велик. Максимум 5 МБ.", 400);
  }
}

function createAltText(carTitle: string, index: number) {
  return `${carTitle} — фото ${index + 1}`;
}

async function convertToWebp(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());
  return sharp(buffer).rotate().resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 84 }).toBuffer();
}

async function persistLocally(files: File[], slug: string, carTitle: string): Promise<PersistedImage[]> {
  const uploadRoot = path.resolve(process.cwd(), env.UPLOAD_DIR, "cars", slug);
  await fs.mkdir(uploadRoot, { recursive: true });

  const persisted: PersistedImage[] = [];

  for (const [index, file] of files.entries()) {
    ensureSupportedImage(file);
    const key = `${slug}/${randomUUID()}.webp`;
    const outputPath = path.join(uploadRoot, path.basename(key));
    const webpBuffer = await convertToWebp(file);

    await fs.writeFile(outputPath, webpBuffer);

    persisted.push({
      key: `cars/${key}`,
      url: `/uploads/cars/${key}`,
      alt: createAltText(carTitle, index),
    });
  }

  return persisted;
}

async function persistToS3(files: File[], slug: string, carTitle: string): Promise<PersistedImage[]> {
  if (!env.S3_BUCKET || !env.S3_ENDPOINT || !env.S3_ACCESS_KEY || !env.S3_SECRET_KEY) {
    throw new AppError("S3-конфигурация неполная.", 500);
  }

  const client = new S3Client({
    region: env.S3_REGION,
    endpoint: env.S3_ENDPOINT,
    forcePathStyle: env.S3_FORCE_PATH_STYLE ?? true,
    credentials: {
      accessKeyId: env.S3_ACCESS_KEY,
      secretAccessKey: env.S3_SECRET_KEY,
    },
  });

  const persisted: PersistedImage[] = [];

  for (const [index, file] of files.entries()) {
    ensureSupportedImage(file);
    const key = `cars/${slug}/${randomUUID()}.webp`;
    const body = await convertToWebp(file);

    await client.send(
      new PutObjectCommand({
        Bucket: env.S3_BUCKET,
        Key: key,
        Body: body,
        ContentType: "image/webp",
      }),
    );

    persisted.push({
      key,
      url: `${env.S3_ENDPOINT.replace(/\/$/, "")}/${env.S3_BUCKET}/${key}`,
      alt: createAltText(carTitle, index),
    });
  }

  return persisted;
}

/**
 * Persists uploaded car photos either locally or into S3-compatible storage.
 */
export async function persistCarImages(files: File[], slug: string, carTitle: string) {
  if (files.length === 0) {
    return [];
  }

  if (env.UPLOAD_STORAGE === "s3") {
    return persistToS3(files, slug, carTitle);
  }

  return persistLocally(files, slug, carTitle);
}
