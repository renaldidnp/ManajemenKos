import "server-only";
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  BETTER_AUTH_SECRET: z.string().min(32),
  BETTER_AUTH_URL: z.url(),
  OLLAMA_BASE_URL: z.url().default("http://localhost:11434"),
  OLLAMA_CHAT_MODEL: z.string().default("llama3.2"),
  OLLAMA_EMBED_MODEL: z.string().default("nomic-embed-text"),
  UPLOAD_DIR: z.string().default("public/uploads"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(
    "Invalid environment variables:",
    z.treeifyError(parsed.error),
  );
  throw new Error("Invalid environment variables");
}

export const env = parsed.data;
