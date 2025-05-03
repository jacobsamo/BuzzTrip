// import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
// import { generateId } from "@buzztrip/db/helpers";
// import { fileTypeFromBuffer } from "file-type";
// import { z } from "zod";
// import { AppRouteHandler } from "../../common/types";
// import { UploadFormParamsSchema, uploadType } from "./schema";
// import { uploadFileRoute } from "./upload.routes";

// export const uploadFileHandler: AppRouteHandler<
//   typeof uploadFileRoute
// > = async (c) => {
//   try {
//     let buffer: Buffer;
//     let mimeType: string;
//     let originalName: string | undefined;
//     let uploadTypeValue: z.infer<typeof uploadType>;

//     const contentType = c.req.header("content-type") || "";
//     const env = c.env;
//     const s3 = new S3Client({
//       endpoint: env.R2_ENDPOINT,
//       credentials: {
//         accessKeyId: env.R2_ACCESS_ID,
//         secretAccessKey: env.R2_SECRET_ACCESS_KEY,
//       },
//       region: "auto",
//     });

//     if (contentType.includes("multipart/form-data")) {
//       // Handle form-data upload
//       const formData = await c.req.parseBody();
//       const validated = UploadFormParamsSchema.safeParse({
//         file: formData.file,
//         uploadType: formData.uploadType,
//       });

//       if (!validated.success) {
//         throw new Error(validated.error.message);
//       }

//       const {
//         file,
//         uploadType,
//         fileName,
//         mimeType: requestMimeType,
//       } = validated.data;
//       uploadTypeValue = uploadType;
//       originalName = fileName;

//       if (typeof file === "string") {
//         // Handle base64 string
//         buffer = Buffer.from(file, "base64");
//       } else if (file instanceof ArrayBuffer) {
//         buffer = Buffer.from(new Uint8Array(file));
//       } else if (file instanceof Uint8Array) {
//         buffer = Buffer.from(file);
//       } else {
//         buffer = file;
//       }

//       const fileType = await fileTypeFromBuffer(buffer);
//       mimeType =
//         requestMimeType || fileType?.mime || "application/octet-stream";
//     } else if (contentType.includes("application/json")) {
//       // Handle JSON upload
//       const body = await c.req.valid("json");
//       uploadTypeValue = body.uploadType;
//       originalName = body?.fileName ?? "file";

//       if (body.file instanceof ArrayBuffer) {
//         buffer = Buffer.from(body.file);
//       } else if (body.file instanceof Buffer) {
//         buffer = body.file;
//       } else if (body.file instanceof Uint8Array) {
//         buffer = Buffer.from(body.file);
//       } else {
//         buffer = Buffer.from(body.file, "base64");
//       }

//       const fileType = await fileTypeFromBuffer(buffer);
//       mimeType = body.mimeType || fileType?.mime || "application/octet-stream";
//     } else {
//       throw new Error("Unsupported content type");
//     }

//     // Validate buffer
//     if (!buffer || buffer.length === 0) {
//       throw new Error("Empty file buffer");
//     }

//     // Generate unique file name
//     const extension = mimeType.split("/")[1] || "bin";
//     const uniqueFileName = `${uploadTypeValue}/${generateId(uploadTypeValue)}-${Date.now()}.${extension}`;

//     // Upload to S3
//     const putCommand = new PutObjectCommand({
//       Bucket: env.R2_BUCKET,
//       Key: uniqueFileName,
//       Body: buffer,
//       ContentType: mimeType,
//       ACL: "public-read",
//     });

//     await s3.send(putCommand);

//     // Construct response
//     const publicUrl = `${env.R2_PUBLIC_URL}/${uniqueFileName}`;
//     const response = {
//       status: "success" as const,
//       fileUrl: publicUrl,
//       message: "File uploaded successfully",
//       metadata: {
//         mimeType,
//         size: buffer.length,
//         uploadType: uploadTypeValue,
//         originalName,
//       },
//     };

//     return c.json(response, 200);
//   } catch (error: any) {
//     console.error("[Upload] Failed to upload file:", error);
//     if (c.get("sentry")) {
//       c.get("sentry").captureException(error);
//     }

//     return c.json(
//       {
//         code: "upload_failed",
//         message: error.message || "Failed to upload file",
//         requestId: c.get("requestId") || "unknown",
//       },
//       400
//     );
//   }
// };
