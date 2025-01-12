import Navbar from "@/components/navbar";
import { buttonVariants } from "@/components/ui/button";
import { Layers, MapPin, Palette, Search, Tag, Users } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section
          id="hero"
          className="w-full bg-gradient-to-r from-primary/20 via-primary/10 to-background py-12 md:py-24 lg:py-32 xl:py-48"
        >
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Create Custom Maps with Ease
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    BuzzTrip lets you design personalized maps with custom
                    markers, collections, and more. Perfect for travel planning,
                    business locations, or any mapping needs.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link
                    href="/auth/sign-up"
                    className={buttonVariants({ size: "lg" })}
                  >
                    Get Started
                  </Link>
                  {/*   
                  <Button size="lg" variant="outline">
                    Learn More
                  </Button> */}
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-[300px] w-[300px] sm:h-[400px] sm:w-[400px] lg:h-[500px] lg:w-[500px]">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 opacity-50 blur-2xl"></div>
                  <div className="absolute inset-4 overflow-hidden rounded-2xl bg-white shadow-2xl">
                    <div className="h-full w-full bg-[url('/assets/app-screenshot.webp')] bg-cover bg-center"></div>
                    <div className="absolute left-4 top-4 rounded-full bg-white p-2 shadow-md">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div className="absolute bottom-4 right-4 rounded-full bg-white p-2 shadow-md">
                      <Layers className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="features"
          className="w-full bg-secondary p-8 py-12 md:py-24 lg:py-32"
        >
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tighter sm:text-5xl">
            Key Features
          </h2>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
            <div className="flex flex-col items-center space-y-4 rounded-md border p-2 text-center">
              <div className="rounded-full bg-primary/10 p-4">
                <MapPin className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Custom Markers</h3>
              <p className="text-muted-foreground">
                Create unique markers with custom icons, colors, and tags.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 rounded-md border p-2 text-center">
              <div className="rounded-full bg-primary/10 p-4">
                <Layers className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Collections</h3>
              <p className="text-muted-foreground">
                Organize your markers into collections for easy management.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 rounded-md border p-2 text-center">
              <div className="rounded-full bg-primary/10 p-4">
                <Tag className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Tagging System</h3>
              <p className="text-muted-foreground">
                Add tags to markers and collections for quick filtering.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 rounded-md border p-2 text-center">
              <div className="rounded-full bg-primary/10 p-4">
                <Palette className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Customization</h3>
              <p className="text-muted-foreground">
                Personalize your maps with custom colors and icons.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 rounded-md border p-2 text-center">
              <div className="rounded-full bg-primary/10 p-4">
                <Search className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Advanced Search</h3>
              <p className="text-muted-foreground">
                Easily find locations and your custom markers.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 rounded-md border p-2 text-center">
              <div className="rounded-full bg-primary/10 p-4">
                <Users className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Collaboration</h3>
              <p className="text-muted-foreground">
                Share and collaborate on maps with team members or friends.
              </p>
            </div>
          </div>
        </section>
        {/* 
        <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="mb-12 text-center text-3xl font-bold tracking-tighter sm:text-5xl">
              What Our Users Say
            </h2>
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center space-y-4 rounded-md border p-2 text-center">
                <img
                  alt="User"
                  className="rounded-full"
                  height="100"
                  src="/placeholder.svg?height=100&width=100"
                  style={{
                    aspectRatio: "100/100",
                    objectFit: "cover",
                  }}
                  width="100"
                />
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Sarah L.</h3>
                  <p className="text-sm text-muted-foreground">
                    Travel Blogger
                  </p>
                  <p className="text-muted-foreground">
                    "BuzzTrip has revolutionized how I plan and document my
                    travels. The custom collections feature is a game-changer!"
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-md border p-2 text-center">
                <img
                  alt="User"
                  className="rounded-full"
                  height="100"
                  src="/placeholder.svg?height=100&width=100"
                  style={{
                    aspectRatio: "100/100",
                    objectFit: "cover",
                  }}
                  width="100"
                />
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Michael R.</h3>
                  <p className="text-sm text-muted-foreground">
                    Small Business Owner
                  </p>
                  <p className="text-muted-foreground">
                    "I use BuzzTrip to track all our business locations and
                    deliveries. It's intuitive and has saved us so much time."
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-md border p-2 text-center">
                <img
                  alt="User"
                  className="rounded-full"
                  height="100"
                  src="/placeholder.svg?height=100&width=100"
                  style={{
                    aspectRatio: "100/100",
                    objectFit: "cover",
                  }}
                  width="100"
                />
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Emily T.</h3>
                  <p className="text-sm text-muted-foreground">Event Planner</p>
                  <p className="text-muted-foreground">
                    "The collaboration features in BuzzTrip make it easy to work
                    with clients and plan events efficiently."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="pricing"
          className="w-full bg-secondary py-12 md:py-24 lg:py-32"
        >
          <div className="container px-4 md:px-6">
            <h2 className="mb-12 text-center text-3xl font-bold tracking-tighter sm:text-5xl">
              Simple Pricing
            </h2>
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col rounded-lg bg-background p-6 shadow-lg">
                <h3 className="mb-4 text-center text-2xl font-bold">Basic</h3>
                <p className="mb-4 text-center text-4xl font-bold">$0</p>
                <ul className="mb-6 space-y-2">
                  <li className="flex items-center">
                    <MapPin className="mr-2 h-5 w-5 text-primary" />
                    Up to 50 custom markers
                  </li>
                  <li className="flex items-center">
                    <Layers className="mr-2 h-5 w-5 text-primary" />5
                    collections
                  </li>
                  <li className="flex items-center">
                    <Users className="mr-2 h-5 w-5 text-primary" />
                    Basic collaboration
                  </li>
                </ul>
                <Button className="mt-auto">Get Started</Button>
              </div>
              <div className="flex flex-col rounded-lg bg-primary p-6 text-primary-foreground shadow-lg">
                <h3 className="mb-4 text-center text-2xl font-bold">Pro</h3>
                <p className="mb-4 text-center text-4xl font-bold">$9.99</p>
                <ul className="mb-6 space-y-2">
                  <li className="flex items-center">
                    <MapPin className="mr-2 h-5 w-5" />
                    Unlimited custom markers
                  </li>
                  <li className="flex items-center">
                    <Layers className="mr-2 h-5 w-5" />
                    Unlimited collections
                  </li>
                  <li className="flex items-center">
                    <Users className="mr-2 h-5 w-5" />
                    Advanced collaboration
                  </li>
                  <li className="flex items-center">
                    <Palette className="mr-2 h-5 w-5" />
                    Custom branding
                  </li>
                </ul>
                <Button className="mt-auto bg-background text-primary hover:bg-secondary">
                  Upgrade to Pro
                </Button>
              </div>
              <div className="flex flex-col rounded-lg bg-background p-6 shadow-lg">
                <h3 className="mb-4 text-center text-2xl font-bold">
                  Enterprise
                </h3>
                <p className="mb-4 text-center text-4xl font-bold">Custom</p>
                <ul className="mb-6 space-y-2">
                  <li className="flex items-center">
                    <MapPin className="mr-2 h-5 w-5 text-primary" />
                    Unlimited everything
                  </li>
                  <li className="flex items-center">
                    <Layers className="mr-2 h-5 w-5 text-primary" />
                    Priority support
                  </li>
                  <li className="flex items-center">
                    <Users className="mr-2 h-5 w-5 text-primary" />
                    Dedicated account manager
                  </li>
                  <li className="flex items-center">
                    <Palette className="mr-2 h-5 w-5 text-primary" />
                    Custom integrations
                  </li>
                </ul>
                <Button className="mt-auto">Contact Sales</Button>
              </div>
            </div>
          </div>
        </section> */}

        <section className="w-full bg-gradient-to-r from-primary/20 via-primary/10 to-background py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 rounded-md border p-2 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Start Mapping Today
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  Join users who are already creating amazing custom maps with
                  BuzzTrip.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <Link href="/auth/sign-up" className={buttonVariants()}>
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="flex w-full shrink-0 flex-col items-center gap-2 border-t px-4 py-6 sm:flex-row md:px-6">
        <p className="text-xs text-muted-foreground">
          © 2023-2024 BuzzTrip. All rights reserved.
        </p>
        {/* <nav className="flex gap-4 sm:ml-auto sm:gap-6">
          <Link className="text-xs underline-offset-4 hover:underline" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs underline-offset-4 hover:underline" href="#">
            Privacy
          </Link>
        </nav> */}
      </footer>
    </>
  );
}
