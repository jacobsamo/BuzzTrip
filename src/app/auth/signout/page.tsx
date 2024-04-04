"use client";
import { Button } from "@/components/ui/button";
import {
  createClientComponentClient
} from "@supabase/auth-helpers-nextjs";
import { redirect, useRouter } from "next/navigation";

const SignOutPage = () => {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const user = supabase.auth.getUser();

  if (!user) {
    return redirect("/auth");
  }

  const signOut = () => {
    supabase.auth.signOut();
    router.push("/auth");
  };

  return (
    <div className="flex flex-col items-center bg-red-400">
      <h1>We are sorry to see you go</h1>

      <Button onClick={() => signOut()}>Sign out of My Maps</Button>
    </div>
  );
};

export default SignOutPage;
