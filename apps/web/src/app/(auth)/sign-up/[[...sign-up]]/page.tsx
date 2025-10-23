'use client';

import { SignUp } from '@clerk/nextjs';
import { useSearchParams } from 'next/navigation';
import { Sparkles } from 'lucide-react';

export default function Page() {
  const searchParams = useSearchParams();
  const isBeta = searchParams.get('beta') === 'true';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12">
      {isBeta && (
        <div className="mb-6 rounded-lg bg-primary p-6 text-white text-center max-w-md mx-4 shadow-lg">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-5 h-5" />
            <p className="font-semibold text-xl">Welcome Beta Tester!</p>
            <Sparkles className="w-5 h-5" />
          </div>
          <p className="text-sm opacity-90 mt-2">
            You're joining an exclusive group of early adopters helping shape
            the future of BuzzTrip. We can't wait to build this with you!
          </p>
        </div>
      )}

      <SignUp
        unsafeMetadata={isBeta ? { isBetaUser: true } : undefined}
        afterSignUpUrl="/app?beta_welcome=true"
      />
    </div>
  );
}
