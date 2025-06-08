import geospatial from "@convex-dev/geospatial/convex.config";
import { defineApp } from "convex/server";
import migrations from "@convex-dev/migrations/convex.config";

const app = defineApp();
app.use(geospatial);
app.use(migrations);

export default app;
