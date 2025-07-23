import { convexNextjsOptions, getConvexServerSession } from "@/lib/auth";
import { api } from "@buzztrip/backend/api";
import { Id } from "@buzztrip/backend/dataModel";
import { mapsEditSchema } from "@buzztrip/backend/zod-schemas";
import * as Sentry from "@sentry/nextjs";
import { fetchMutation } from "convex/nextjs";
import { NextRequest, NextResponse } from "next/server";

type Params = Promise<{ mapId: string }>;

const schema = mapsEditSchema
  .pick({
    lat: true,
    lng: true,
    bounds: true,
    location_name: true,
  })
  .required();

export const POST = async (
  req: NextRequest,
  { params }: { params: Params }
) => {
  const { logger } = Sentry;
  try {
    logger.info("Starting update map location");
    const { mapId } = await params;
    const session = await getConvexServerSession();
    logger.info("Session & Map Id", {
      mapId,
      session,
    });

    if (!session || session.message !== "Logged In" || !mapId) {
      logger.error("Not logged in");
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    const body = await req.json();
    logger.info("Body", body);
    const data = await schema.parseAsync(body);
    logger.info("Data", data);

    if (!data) {
      logger.error("Invalid data");
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const options = await convexNextjsOptions();

    await fetchMutation(
      api.maps.index.updateMap,
      {
        mapId: mapId as Id<"maps">,
        map: data,
      },
      options
    );

    logger.info("Updated map location");
    return NextResponse.json({ success: true });
  } catch (error: Error | any) {
    logger.error("An error occurred", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
};
