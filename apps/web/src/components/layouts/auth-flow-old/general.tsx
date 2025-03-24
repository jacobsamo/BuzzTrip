"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuthContext } from "./provider";

const schema = z.object({
  email: z.string().email(),
});

const GeneralForm = () => {
  const { setFlowState, REDIRECT_URL } = useAuthContext();

  const signInWithOAuth = (provider: "google") => {
    return authClient.signIn.social({
      provider: provider,
      callbackURL: REDIRECT_URL,
    });
  };

  const signInWithEmail = async (email: string) => {
    const { data, error } = await authClient.signIn.magicLink({
      email: email,
      callbackURL: REDIRECT_URL, //redirect after successful login (optional)
    });

    console.log("Return verify", {
      data,
      error,
    });
    setFlowState("verify");
  };

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="flex flex-col gap-2 items-center justify-center">
          <Image
            src="/logos/logo_x48.png"
            alt="Logo"
            width={44}
            height={44}
            className="rounded-full size-16"
          />
          <CardTitle className="text-2xl text-center">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => signInWithOAuth("google")}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  fill="currentColor"
                />
              </svg>
              Continue with Google
            </Button>
          </div>

          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((data: z.infer<typeof schema>) =>
                signInWithEmail(data.email)
              )}
            >
              <FormField
                control={form.control}
                name="email"
                rules={{ required: true }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="john@exmaple.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={form.formState.isSubmitting}>
                Continue
              </Button>
            </form>
          </Form>
          {/* <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" type="password" required />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="#" className="underline underline-offset-4">
                Sign up
              </a>
            </div>
          </form> */}
        </CardContent>
      </Card>
    </div>
    // <div className="flex flex-col">
    //   <Button
    //     type="button"
    //     variant="outline"
    //     className="w-full"
    //     onClick={() => signInWithOAuth("google")}
    //   >
    //     {" "}
    //     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    //       <path
    //         d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
    //         fill="currentColor"
    //       />
    //     </svg>
    //     Continue with Google
    //   </Button>
    //   <span className="my-2 mb-4 h-[0.125rem] w-3/4 rounded-md bg-grey dark:bg-white"></span>
    //   <Form {...form}>
    //     <form
    //       onSubmit={form.handleSubmit((data: z.infer<typeof schema>) =>
    //         signInWithEmail(data.email)
    //       )}
    //     >
    //       <FormField
    //         control={form.control}
    //         name="email"
    //         rules={{ required: true }}
    //         render={({ field }) => (
    //           <FormItem>
    //             <FormLabel>Email</FormLabel>
    //             <FormControl>
    //               <Input placeholder="john@exmaple.com" {...field} />
    //             </FormControl>
    //             <FormMessage />
    //           </FormItem>
    //         )}
    //       />

    //       <Button type="submit" disabled={form.formState.isSubmitting}>
    //         Continue
    //       </Button>
    //     </form>
    //   </Form>
    // </div>
  );
};

export default GeneralForm;
