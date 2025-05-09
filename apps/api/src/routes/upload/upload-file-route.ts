import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { generateId } from "@buzztrip/db/helpers";
import { createRoute, z } from "@hono/zod-openapi";
import { fileTypeFromBuffer } from "file-type";
import { ErrorSchema } from "../../common/schema";
import { appRoute } from "../../common/types";

const FileFormParamsSchema = z.object({
  file: z.instanceof(File).refine((file) => file.size <= 50 * 1024 * 1024, {
    message: "File size must be less than 50MB",
  }),
  folder: z.string().optional(),
  metadata: z.record(z.string()).optional(),
});

const FileJSONParamsSchema = z.object({
  file: z.union([
    z.instanceof(ArrayBuffer),
    z.instanceof(Uint8Array),
    z.string().base64(),  
  ]),
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

function base64ToUint8Array(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export const uploadFileRoute = appRoute.openapi(
  createRoute({
    method: "post",
    path: "/files/upload",
    summary: "Upload a file to R2 storage",
    description: "Upload a file via form-data or JSON (base64 or binary)",
    request: {
      body: {
        content: {
          "application/json": { schema: FileJSONParamsSchema },
          "multipart/form-data": { schema: FileFormParamsSchema },
        },
      },
    },
    responses: {
      200: {
        description: "File uploaded successfully",
        content: {
          "application/json": { schema: FileReturnSchema },
        },
      },
      400: {
        description: "Bad request",
        content: {
          "application/json": { schema: ErrorSchema },
        },
      },
      401: {
        description: "Unauthorized",
        content: {
          "application/json": { schema: ErrorSchema },
        },
      },
    },
  }),
  async (c) => {
    try {
      const contentType = c.req.header("content-type") || "";
      const env = c.env;

      const s3 = new S3Client({
        endpoint: env.R2_ENDPOINT,
        credentials: {
          accessKeyId: env.R2_ACCESS_ID,
          secretAccessKey: env.R2_ACCESS_KEY,
        },
        region: "auto",
      });

      let buffer: Uint8Array;
      let mimeType: string;
      let originalName: string;
      let folder: string | undefined;
      let metadata: Record<string, string> | undefined;

      if (contentType.includes("multipart/form-data")) {
        const formData = await c.req.parseBody();
        const validated = FileFormParamsSchema.safeParse({
          file: formData.file,
          folder: formData.folder,
          metadata: formData.metadata,
        });

        if (!validated.success) throw new Error(validated.error.message);

        const { file, folder: f, metadata: m } = validated.data;
        if (!(file instanceof File)) throw new Error("Invalid file");

        originalName = file.name;
        buffer = new Uint8Array(await file.arrayBuffer());
        folder = f;
        metadata = m;

        const fileType = await fileTypeFromBuffer(buffer);
        mimeType = fileType?.mime || "application/octet-stream";
      } else if (contentType.includes("application/json")) {
        const body = await c.req.valid("json");
        const validated = FileJSONParamsSchema.safeParse(body);

        if (!validated.success) throw new Error(validated.error.message);

        const {
          file,
          fileName,
          mimeType: m,
          folder: f,
          metadata: md,
        } = validated.data;
        originalName = fileName;
        folder = f;
        metadata = md;

        if (file instanceof ArrayBuffer) {
          buffer = new Uint8Array(file);
        } else if (file instanceof Uint8Array) {
          buffer = file;
        } else if (typeof file === "string") {
          buffer = base64ToUint8Array(file);
        } else {
          throw new Error("Invalid file format");
        }

        const fileType = await fileTypeFromBuffer(buffer);
        mimeType = m || fileType?.mime || "application/octet-stream";
      } else {
        throw new Error("Unsupported content type");
      }

      if (!buffer || buffer.length === 0) {
        throw new Error("Empty file buffer");
      }

      const extension = mimeType.split("/")[1] || "bin";
      const key = `${folder ? `${folder}/` : ""}${generateId("generic")}-${Date.now()}.${extension}`;

      await s3.send(
        new PutObjectCommand({
          Bucket: env.R2_BUCKET,
          Key: key,
          Body: buffer,
          ContentType: mimeType,
          ACL: "public-read",
          Metadata: metadata,
        })
      );

      const fileUrl = `${env.R2_PUBLIC_URL}/${key}`;

      const customMetadata = metadata ? metadata : {};

      return c.json(
        {
          status: "success" as const,
          message: "File uploaded successfully",
          fileUrl,
          metadata: {
            size: buffer.length,
            mimeType,
            originalName,
            folder,
            customMetadata,
          },
        },
        200
      );
    } catch (err: any) {
      console.error("[File Upload Error]", err);
      if (c.get("sentry")) c.get("sentry").captureException(err);

      return c.json(
        {
          code: "upload_failed",
          message: err.message || "Upload failed",
          requestId: c.get("requestId") || "unknown",
        },
        400
      );
    }
  }
);
