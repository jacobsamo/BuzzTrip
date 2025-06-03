import { z } from "zod";
import {userMapsSchema} from "../zod-schemas"

export * from "./icons"

export type UserMap = z.infer<typeof userMapsSchema>