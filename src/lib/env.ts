import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z
    .string()
    .min(1)
    .default("postgresql://postgres:postgres@localhost:5433/prcar?schema=public"),
  AUTH_SECRET: z
    .string()
    .min(32)
    .default("development-auth-secret-that-should-be-replaced"),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  UPLOAD_STORAGE: z.enum(["local", "s3"]).default("local"),
  UPLOAD_DIR: z.string().default("./public/uploads"),
  S3_ENDPOINT: z.string().optional(),
  S3_REGION: z.string().default("us-east-1"),
  S3_BUCKET: z.string().optional(),
  S3_ACCESS_KEY: z.string().optional(),
  S3_SECRET_KEY: z.string().optional(),
  S3_FORCE_PATH_STYLE: z
    .string()
    .transform((value) => value === "true")
    .optional(),
});

export const env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL,
  AUTH_SECRET: process.env.AUTH_SECRET,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  UPLOAD_STORAGE: process.env.UPLOAD_STORAGE,
  UPLOAD_DIR: process.env.UPLOAD_DIR,
  S3_ENDPOINT: process.env.S3_ENDPOINT,
  S3_REGION: process.env.S3_REGION,
  S3_BUCKET: process.env.S3_BUCKET,
  S3_ACCESS_KEY: process.env.S3_ACCESS_KEY,
  S3_SECRET_KEY: process.env.S3_SECRET_KEY,
  S3_FORCE_PATH_STYLE: process.env.S3_FORCE_PATH_STYLE,
});
