import type { ZodError } from "zod";
import type { FieldErrors } from "@/lib/action-result";

export function toFieldErrors(error: ZodError): FieldErrors {
  const { fieldErrors } = error.flatten() as {
    fieldErrors: Record<string, string[] | undefined>;
  };
  const result: FieldErrors = {};

  for (const [key, messages] of Object.entries(fieldErrors)) {
    if (messages && messages.length > 0) {
      result[key] = messages;
    }
  }

  return result;
}
