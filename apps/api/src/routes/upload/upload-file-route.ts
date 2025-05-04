import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { generateId } from "@buzztrip/db/helpers";
import { createRoute, z } from "@hono/zod-openapi";
import { fileTypeFromBuffer } from "file-type";
import { ErrorSchema } from "../../common/schema";
import { appRoute } from "../../common/types";

const FileFormParamsSchema = z.object({
  file: z.instanceof(File).refine(
    (file) => file.size <= 50 * 1024 * 1024, // 50MB max
    { message: "File size must be less than 50MB" }
  ),
  folder: z.string().optional(),
  metadata: z.record(z.string()).optional(),
});

const FileJSONParamsSchema = z.object({
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

export const uploadFileRoute = appRoute.openapi(
  createRoute({
    method: "post",
    path: "/files/upload",
    summary: "Upload a file to R2 storage",
    description:
      "Upload a file using either multipart/form-data or JSON with base64 encoded content",
    request: {
      body: {
        content: {
          "application/json": {
            schema: FileJSONParamsSchema,
          },
          "multipart/form-data": {
            schema: FileFormParamsSchema,
          },
        },
      },
    },
    responses: {
      200: {
        content: {
          "application/json": {
            schema: FileReturnSchema,
          },
        },
        description: "File uploaded successfully",
      },
      400: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description: "Returns an error if the upload fails",
      },
      401: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description: "Returns an error if user is not authenticated",
      },
    },
  }),
  async (c) => {
    try {
      let buffer: Buffer;
      let mimeType: string;
      let originalName: string;
      let folder: string | undefined;
      let metadata: Record<string, string> | undefined;

      const contentType = c.req.header("content-type") || "";
      const env = c.env;
      const s3 = new S3Client({
        endpoint: env.R2_ENDPOINT,
        credentials: {
          accessKeyId: env.R2_ACCESS_ID,
          secretAccessKey: env.R2_SECRET_ACCESS_KEY,
        },
        region: "auto",
      });

      if (contentType.includes("multipart/form-data")) {
        // Handle form-data upload
        const formData = await c.req.parseBody();
        const validated = FileFormParamsSchema.safeParse({
          file: formData.file,
          folder: formData.folder,
          metadata: formData.metadata,
        });

        if (!validated.success) {
          throw new Error(validated.error.message);
        }

        const {
          file,
          folder: validatedFolder,
          metadata: validatedMetadata,
        } = validated.data;
        folder = validatedFolder;
        metadata = validatedMetadata;

        if (!(file instanceof File)) {
          throw new Error("Invalid file format");
        }

        originalName = file.name;
        buffer = Buffer.from(await file.arrayBuffer());
        const fileType = await fileTypeFromBuffer(buffer);
        mimeType = fileType?.mime || "application/octet-stream";
      } else if (contentType.includes("application/json")) {
        // Handle JSON upload
        const body = await c.req.valid("json");
        const validated = FileJSONParamsSchema.safeParse(body);

        if (!validated.success) {
          throw new Error(validated.error.message);
        }

        const {
          file,
          fileName,
          mimeType: requestMimeType,
          folder: requestFolder,
          metadata: requestMetadata,
        } = validated.data;
        folder = requestFolder;
        metadata = requestMetadata;
        originalName = fileName;

        if (file instanceof ArrayBuffer) {
          buffer = Buffer.from(file);
        } else if (Buffer.isBuffer(file)) {
          buffer = file;
        } else if (file instanceof Uint8Array) {
          buffer = Buffer.from(file);
        } else if (typeof file === "string") {
          buffer = Buffer.from(file, "base64");
        } else {
          throw new Error("Invalid file format");
        }

        const fileType = await fileTypeFromBuffer(buffer);
        mimeType =
          requestMimeType || fileType?.mime || "application/octet-stream";
      } else {
        throw new Error("Unsupported content type");
      }

      // Validate buffer
      if (!buffer || buffer.length === 0) {
        throw new Error("Empty file buffer");
      }

      // Generate unique file name
      const extension = mimeType.split("/")[1] || "bin";
      const uniqueFileName = folder
        ? `${folder}/${generateId("generic")}-${Date.now()}.${extension}`
        : `${generateId("generic")}-${Date.now()}.${extension}`;

      // Upload to S3
      const putCommand = new PutObjectCommand({
        Bucket: env.R2_BUCKET,
        Key: uniqueFileName,
        Body: buffer,
        ContentType: mimeType,
        ACL: "public-read",
        Metadata: metadata,
      });

      await s3.send(putCommand);

      // Construct response
      const publicUrl = `${env.R2_PUBLIC_URL}/${uniqueFileName}`;
      const response = {
        status: "success" as const,
        fileUrl: publicUrl,
        message: "File uploaded successfully",
        metadata: {
          mimeType,
          size: buffer.length,
          folder,
          originalName,
          customMetadata: metadata,
        },
      };

      return c.json(response, 200);
    } catch (error: any) {
      console.error("[Files] Failed to upload file:", error);
      if (c.get("sentry")) {
        c.get("sentry").captureException(error);
      }

      return c.json(
        {
          code: "upload_failed",
          message: error.message || "Failed to upload file",
          requestId: c.get("requestId") || "unknown",
        },
        400
      );
    }
  }
);
