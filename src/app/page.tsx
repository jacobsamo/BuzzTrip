import { getUser } from "@/lib/getUser";
import { redirect } from "next/navigation";
import Image from "next/image";
import Nav from "@/components/routes/landing/nav";
import Hero from "@/components/routes/landing/hero";

export default async function Home() {
  const user = await getUser();

  if (user) return redirect("/home");

  return (
    <>
      <Nav />
      <main>
        <Hero />
      </main>
    </>
  );
}
