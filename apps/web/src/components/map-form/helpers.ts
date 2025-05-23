import { CreateMapSchema } from "@buzztrip/db/mutations/maps";
import { labelsEditSchema } from "@buzztrip/db/zod-schemas";

export const mapFormSchema = CreateMapSchema.extend({
  labels: labelsEditSchema.array().nullish(),
});
