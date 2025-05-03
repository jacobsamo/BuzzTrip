import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { generateId } from "@buzztrip/db/helpers";
import { fileTypeFromBuffer } from "file-type";
import { AppRouteHandler } from "../../common/types";
import { uploadFileRoute } from "./files.routes";
import { FileFormParamsSchema, FileJSONParamsSchema } from "./schema";

export const uploadFileHandler: AppRouteHandler<
  typeof uploadFileRoute
> = async (c) => {
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
};
