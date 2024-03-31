import { buttonVariants } from '@/components/ui/button';
import { Link } from '@remix-run/react';


export default function Hero() {
  return (
    <section
      className="flex size-full w-full items-start justify-center bg-[url('https://tailframes.com/images/squares-bg.webp')] bg-cover bg-center bg-no-repeat"
>
      <div
        className="flex max-w-screen-2xl flex-1 grow flex-col items-start justify-start gap-12 px-3 py-12 md:px-24 md:pt-24 xl:flex-row"
      >
        <div className="lx:px-36 mb-0 flex flex-1 flex-col items-start gap-12 xl:mb-24">
          <div className="flex max-w-lg flex-col gap-6">
            <h3 className="text-4xl font-semibold text-slate-950 md:text-6xl">
              BuzzTrip
            </h3>
            <h4 className="text-lg font-normal leading-7 text-slate-500">
                Plan the trip you've always dreamed of
            </h4>
          </div>
          <div className="flex gap-4">
            <Link to="/auth" className={buttonVariants()} >
              Sign up now
            </Link>
          </div>
        </div>
        <div
          className="relative flex flex-1 flex-col drop-shadow-xl xl:translate-x-1/2 xl:translate-y-3/4 xl:scale-[2] min-[1440px]:translate-y-1/2 2xl:translate-x-1/2 2xl:translate-y-1/2 2xl:scale-[2] min-[1900px]:translate-x-1/4 min-[1900px]:translate-y-1/4 min-[1900px]:scale-150"
        >
          {/* <img
            src="https://www.tailframes.com/images/browser-mockup.webp"
            role="presentation"
            alt=""
            width={0}
            height={0}
            sizes="100vw"
            className="w-full 2xl:absolute 2xl:inset-0 2xl:h-auto"
          /> */}
        </div>
      </div>
    </section>
  );
};