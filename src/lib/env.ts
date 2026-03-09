import { z } from "zod";

// Deploy-safe DB fallback for preview/build environments.
if (!process.env.DB_URL) {
  process.env.DB_URL = "file:./.tmp-fireplace-preview.db";
}
if (!process.env.DB_TOKEN) {
  process.env.DB_TOKEN = "fireplace-preview-token";
}

const serverEnvSchema = z.object({
  DB_URL: z.string().min(1).default("file:./.tmp-fireplace-preview.db"),
  DB_TOKEN: z.string().min(1).default("fireplace-preview-token"),
  ADMIN_PASSWORD: z.string().optional(),
});

export const env = serverEnvSchema.parse(process.env);
