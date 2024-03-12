import { useOutletContext } from "@remix-run/react";
import { SupabaseClient } from "@supabase/auth-helpers-remix";

const SignOutPage = () => {
  const { supabase } = useOutletContext<{ supabase: SupabaseClient }>();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="flex flex-col items-center">
      <h1>We are sorry to see you go</h1>

      <Button onClick={() => handleLogout()}>Sign out of My Maps</Button>
    </div>
  );
};

export default SignOutPage;
