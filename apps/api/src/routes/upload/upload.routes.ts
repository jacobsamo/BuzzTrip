// import { createRoute } from "@hono/zod-openapi";
// import { ErrorSchema } from "../../common/schema";
// import {
//   UploadFormParamsSchema,
//   UploadJSONParamsSchema,
//   UploadReturnSchema,
// } from "./schema";

// export const uploadFileRoute = createRoute({
//   method: "post",
//   path: "/upload/file",
//   summary: "Upload a file",
//   request: {
//     body: {
//       content: {
//         "application/json": {
//           schema: UploadJSONParamsSchema,
//         },
//         "multipart/form-data": {
//           schema: UploadFormParamsSchema, // Form-data schema is handled in handler
//         },
//       },
//     },
//   },
//   responses: {
//     200: {
//       content: {
//         "application/json": {
//           schema: UploadReturnSchema,
//         },
//       },
//       description: "The uploaded file and its metadata",
//     },
//     400: {
//       content: {
//         "application/json": {
//           schema: ErrorSchema,
//         },
//       },
//       description: "Returns an error",
//     },
//   },
// });
