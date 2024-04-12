import { getUser } from "@/lib/getUser";
import { createAdminClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Logger } from "next-axiom";
import { withAuth } from "@/lib/utils/checks";

export type SearchUserReturn = {
  id: string;
  email: string | undefined;
  picture: string | undefined;
  name: string | undefined;
};

export const GET = withAuth(async ({ req, params }) => {
  try {
    const url = new URL(req.url);
    const search = url.searchParams;
    const searchValue = search.get("q")?.toLowerCase();

    if (!searchValue) {
      return NextResponse.json("Missing search value", { status: 400 });
    }

    const supabase = await createAdminClient();
    const {
      data: { users },
    } = await supabase.auth.admin.listUsers();

    const foundUsers = users
      .filter((user) => user.email?.includes(searchValue))
      .splice(0, 4)
      .map((user) => {
        return {
          id: user.id,
          email: user.email,
          picture: user.user_metadata.picture,
          name: user.user_metadata.name,
        } as SearchUserReturn;
      });

    const log = new Logger();
    log.info("found users: ", {
      foundUsers,
      users,
      searchValue,
    });

    return NextResponse.json(foundUsers);
  } catch (error) {
    const log = new Logger();
    log.error(`Error on /api/users/search: ${error}`, {
      error,
    });
    console.error(`Error on /api/users/search`, error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(JSON.stringify(error.issues), { status: 422 });
    }

    return NextResponse.json(null, {
      status: 500,
      statusText: `Error on /api/users/search: ${error}`,
    });
  }
});
