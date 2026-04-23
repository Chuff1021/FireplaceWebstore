import { z } from "zod";

const defaultDbUrl = `file:${process.cwd()}/.tmp-fireplace-preview.db`;

// Deploy-safe DB fallback for preview/build environments.
if (!process.env.DB_URL) {
  process.env.DB_URL = defaultDbUrl;
}
if (!process.env.DB_TOKEN) {
  process.env.DB_TOKEN = "fireplace-preview-token";
}

const serverEnvSchema = z.object({
  DB_URL: z.string().min(1).default(defaultDbUrl),
  DB_TOKEN: z.string().min(1).default("fireplace-preview-token"),
  ADMIN_PASSWORD: z.string().optional(),
});

export const env = serverEnvSchema.parse(process.env);
