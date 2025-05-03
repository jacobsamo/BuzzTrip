// import { z } from "@hono/zod-openapi";

// export const uploadType = z.enum(["user", "map", "place", "marker"]);

// export const UploadFormParamsSchema = z.object({
//   file: z.instanceof(File).refine(
//     (file) => file.size <= 10 * 1024 * 1024, // 10MB max
//     { message: "File size must be less than 10MB" }
//   ),
//   uploadType: uploadType,
// });

// export const UploadJSONParamsSchema = z.object({
//   file: z
//     .union([
//       z.instanceof(ArrayBuffer),
//       z.instanceof(Buffer),
//       z.instanceof(Uint8Array),
//       z.string().base64(),
//     ])
//     .refine(
//       (data) => {
//         if (typeof data === "string") {
//           try {
//             Buffer.from(data, "base64");
//             return true;
//           } catch {
//             return false;
//           }
//         }
//         return true;
//       },
//       { message: "Invalid file data format" }
//     ),
//   uploadType: uploadType,
//   fileName: z.string().optional(),
//   mimeType: z.string().optional(),
// });

// export const UploadReturnSchema = z.object({
//   status: z.enum(["success", "failed"]),
//   message: z.string(),
//   fileUrl: z.string().url(),
//   metadata: z.object({
//     size: z.number(),
//     mimeType: z.string(),
//     uploadType: uploadType,
//     originalName: z.string().optional(),
//   }),
// });