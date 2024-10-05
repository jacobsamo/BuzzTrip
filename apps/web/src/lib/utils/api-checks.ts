// import { Permissions } from "@buzztrip/db/types";
import { currentUser, User } from "@clerk/nextjs/server";

// export async function hasAccess({
//   map_id,
// }: {
//   map_id: string;
// }): Promise<boolean> {
//   const supabase = createClient();
//   const { data: sharedMap } = await supabase
//     .from("shared_map")
//     .select()
//     .eq("map_id", map_id);

//   if (
//     !sharedMap ||
//     sharedMap.length == 0 ||
//     sharedMap[0].permission == "viewer"
//   ) {
//     return false;
//   }

//   return true;
// }

interface WithAuthHandler {
  ({
    req,
    params,
    searchParams,
    headers,
    user,
  }: {
    req: Request;
    params: Record<string, string>;
    searchParams: URLSearchParams;
    headers?: Headers;
    user: User;
  }): Promise<Response>;
}

export const withAuth = (
  handler: WithAuthHandler,
  {
    // requiredRole = ["viewer", "editor", "admin", "owner"],
  }: {
    // requiredRole?: Array<Permissions>;
  } = {}
) => {
  return async (
    req: Request,
    { params }: { params: Record<string, string> | undefined }
  ) => {
    const searchParams = new URL(req.url).searchParams;
    const user = await currentUser();

    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    return await handler({
      req,
      params: params || {},
      searchParams,
      headers: req.headers,
      user,
    });
  };
};
