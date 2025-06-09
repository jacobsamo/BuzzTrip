import { getConvexServerSession } from "@/lib/auth";
import * as Sentry from "@sentry/nextjs";
import { headers } from "next/headers";

export default async function NotFound() {
  const session = await getConvexServerSession();

  const headersList = await headers();
  const path = headersList.get("referer");

  Sentry.addBreadcrumb({
    data: {
      path: path,
      session,
    },
    category: "request",
  });
  Sentry.captureMessage("User attempted to access a map that does not exist", {
    level: "warning",
    user: session?.user?._id
      ? {
          id: session?.user?._id,
        }
      : undefined,
  });

  return (
    <div>
      <h1>Not Found</h1>
      <p>
        The map you are looking either does not exist or you do not have access
        to it.
      </p>
      <p>Please contact the map owner or try another map.</p>
    </div>
  );
}
