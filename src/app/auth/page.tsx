"use client";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import { redirect, usePathname } from "next/navigation";

const LoginPage = () => {
  console.log(`${window.location}/api/auth/callback`);

  const signIn = async () => {
    const supabase = createClient();

    // console.log('message', variable);
    const { error, data } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo:
          process.env.NODE_ENV === "development"
            ? "http://192.168.0.109:5173/auth/callback" // if you want to test on your local network
            : "https://buzztrip.co/api/auth/callback",
      },
    });

    if (error) console.log(error);
  };

  return (
    <>
      <div className="flex flex-col items-center p-4">
        <Image
          src="/icons/svg/icon-128.svg"
          alt="Logo"
          width={128}
          height={128}
          className="h-32 w-32 rounded-full"
        />
        <h1 className="text-xl">Welcome to My Maps</h1>
      </div>

      <div className="inline-flex gap-2">
        <Button
          LeadingIcon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMidYMid"
              viewBox="0 0 256 262"
              className="h-8"
            >
              <path
                fill="#4285F4"
                d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
              ></path>
              <path
                fill="#34A853"
                d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
              ></path>
              <path
                fill="#FBBC05"
                d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
              ></path>
              <path
                fill="#EB4335"
                d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
              ></path>
            </svg>
          }
          aria-label="sign in with google"
          className="text-step--3 flex w-56 max-w-sm cursor-pointer items-center gap-2 rounded-lg bg-white px-2 py-6 text-center text-black"
          onClick={() => signIn()}
        >
          Continue with Google
        </Button>
      </div>
    </>
  );
};

export default LoginPage;
