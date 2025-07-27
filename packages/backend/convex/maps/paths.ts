import { zid } from "convex-helpers/server/zod";
import { pathsSchema } from "../../zod-schemas";
import { authedQuery } from "../helpers";

export const getPathsForMap = authedQuery({
  args: {
    mapId: zid("maps"),
  },
  returns: pathsSchema.array().nullable(),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("paths")
      .withIndex("byMapId", (q) => q.eq("mapId", args.mapId))
      .collect();
  },
});

// export const createPath = authedMutation({})

// export const editPath = authedMutation({})

// export const deletePath = authedMutation({})
