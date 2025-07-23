import geospatial from "@convex-dev/geospatial/convex.config";
import migrations from "@convex-dev/migrations/convex.config";
import resend from "@convex-dev/resend/convex.config";
import { defineApp } from "convex/server";

const app = defineApp();
app.use(geospatial);
app.use(migrations);
app.use(resend);

export default app;
