/**
 * // TODO: Write the logic to connect users to the durable object
 * If a user is in the pro plan they will be able to connect to the realtime map and get real-time updates from their team
 * If a user is on the free plan they will just be defaulted to the normal layer
 * If a user is on the free plan however the map that has been shared with them is in the pro plan they will be able to connect to the realtime map and get real-time updates from their team
 * This will also go and be implmented in all our other routes to ganrantee that when markers, collections, etc get updated that the realtime map will be updated as well
 */
import { app } from "../../common/types";

export const connectRealtimeMapRoute = app.get(
  "/map/:mapId/connect",
  async (c) => {
    const shouldConnect = false;
    if (!shouldConnect)
      return c.json({ success: false, message: "Not implemented" });

    // // Add type assertion to access MAPS_DURABLE_OBJECT
    // const stubId = c.env.MAPS_DURABLE_OBJECT.idFromName("default");
    // const stub = c.env.MAPS_DURABLE_OBJECT.get(stubId);
    // return stub.fetch(c.req.raw);
  }
);
