import { Button } from "@/components/ui/button";
import { useOutletContext } from "@remix-run/react";
import { SupabaseClient } from "@supabase/auth-helpers-remix";
import { Database } from "database.types";

// export function AuhLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <div className="relative flex h-dvh w-full items-center justify-center">
//       <div className="z-10 flex max-w-md flex-col items-center justify-center  gap-3 rounded-3xl p-3 text-center shadow backdrop-blur-sm">
//         {children}
//       </div>
//       {/* <img
//         src="/images/auth-background.webp"
//         alt="background image"
//         fill
//         className="absolute -z-50 h-full w-full object-cover object-center"
//       /> */}
//     </div>
//   );
// }

export default function Auth() {
  const { supabase } = useOutletContext<{ supabase: SupabaseClient<Database> }>();
  

  const signIn = () => {
    console.log("singing in:  ")
     supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:5173/auth/callback",
      },
    });
  };

  return (
    <>
      <div className="flex flex-col items-center p-4">
        <img
          src="/logos/logo_x128.png"
          alt="Logo"
          width={128}
          height={128}
          className="h-32 w-32 rounded-full"
        />
        <h1 className="text-xl">Welcome to My Maps</h1>
      </div>

      <div className="inline-flex gap-2">
      
        <Button
          LeadingIcon={<svg
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
          </svg>}
          aria-label="sign in with google"
          className="text-step--3 flex w-56 max-w-sm cursor-pointer items-center gap-2 rounded-lg bg-white px-2 py-6 text-center text-black"
          onClick={() => signIn()}
        >
          Continue with Google
        </Button>
          <button onClick={() => console.log("clicked")}>Click</button>

      </div>
    </>
  );
}