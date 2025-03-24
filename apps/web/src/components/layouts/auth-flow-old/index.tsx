"use client";
import { DisplayActiveForm } from "./display-active-form";
import { AuthFormProvider } from "./provider";

/**
 * This is a form to handle multiple flows from general auth e.g google, microsoft, etc to email, passkey, etc
 * While certain features are still to be implmented we need this form sign up and sign in
 * to be do:
 * - Passkey
 * - MFA (OTP,)
 * - Input OTP
 * @returns
 */
const AuthForm = () => {
  return (
    <AuthFormProvider>
      <div className="flex h-screen items-center justify-center">
        <div className="rounded-md w-1/2 h-1/2 p-2 bg-background text-foreground">
          <DisplayActiveForm />
        </div>
      </div>
    </AuthFormProvider>
  );
};

export default AuthForm;
