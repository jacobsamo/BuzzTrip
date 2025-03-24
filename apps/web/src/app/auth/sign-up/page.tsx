"use client";
import {AuthForm} from "@/components/layouts/auth-flow";

// TODO improve the design of the page
export default function Page() {
  return (
    // <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
    //   <div className="flex w-full max-w-sm flex-col gap-6">
    //     <Link
    //       href="/"
    //       className="flex items-center gap-2 self-center font-medium"
    //     >
    //       <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
    //         <Image
    //           width={44}
    //           height={44}
    //           src="/logos/logo_x48.png"
    //           alt="Logo"
    //           className="h-11 w-11 rounded-full"
    //         />
    //       </div>
    //       Expense Tracker
    //     </Link>
    //     <div className="flex flex-col gap-6">
    //       <Card>
    //         <CardHeader className="text-center">
    //           <CardTitle className="text-xl">Welcome back</CardTitle>
    //           <CardDescription>Login with your Google account</CardDescription>
    //         </CardHeader>
    //         <CardContent>
    //           <div className="grid gap-6">
    //             <div className="flex flex-col gap-4">
    //               <Button
    //                 type="button"
    //                 variant="outline"
    //                 className="w-full"
    //                 onClick={() =>
    //                   authClient.signIn.social({
    //                     provider: "google",
    //                     callbackURL: "/app",
    //                   })
    //                 }
    //               >
    //                 {" "}
    //                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    //                   <path
    //                     d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
    //                     fill="currentColor"
    //                   />
    //                 </svg>
    //                 Continue with Google
    //               </Button>
    //             </div>
    //             <p>OR</p>
    //             <div>
    //               <EmailForm />
    //             </div>
    //           </div>
    //         </CardContent>
    //       </Card>
    //       <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary  ">
    //         By clicking continue, you agree to our{" "}
    //         <a href="https://jacobsamo.com/legal/terms">Terms of Service</a> and{" "}
    //         <a href="https://jacobsamo.com/legal/privacy">Privacy Policy</a>.
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <AuthForm />
  );
}
