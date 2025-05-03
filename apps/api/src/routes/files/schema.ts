import { z } from "@hono/zod-openapi";

export const FileFormParamsSchema = z.object({
  file: z.instanceof(File).refine(
    (file) => file.size <= 50 * 1024 * 1024, // 50MB max
    { message: "File size must be less than 50MB" }
  ),
  folder: z.string().optional(),
  metadata: z.record(z.string()).optional(),
});

export const FileJSONParamsSchema = z.object({
  file: z
    .union([
      z.instanceof(ArrayBuffer),
      z.instanceof(Buffer),
      z.instanceof(Uint8Array),
      z.string().base64(),
    ])
    .refine(
      (data) => {
        if (typeof data === "string") {
          try {
            Buffer.from(data, "base64");
            return true;
          } catch {
            return false;
          }
        }
        return true;
      },
      { message: "Invalid file data format" }
    ),
  fileName: z.string(),
  mimeType: z.string().optional(),
  folder: z.string().optional(),
  metadata: z.record(z.string()).optional(),
});

export const FileReturnSchema = z.object({
  status: z.enum(["success", "failed"]),
  message: z.string(),
  fileUrl: z.string().url(),
  metadata: z.object({
    size: z.number(),
    mimeType: z.string(),
    folder: z.string().optional(),
    originalName: z.string(),
    customMetadata: z.record(z.string()).optional(),
  }),
});
