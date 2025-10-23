'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

export function BetaWelcomeToast() {
  const searchParams = useSearchParams();
  const showBetaWelcome = searchParams.get('beta_welcome') === 'true';

  useEffect(() => {
    if (showBetaWelcome) {
      toast.success(
        "Welcome to BuzzTrip Beta! 🎉 Check your email for the WhatsApp community link where you can connect with other beta testers.",
        {
          duration: 10000,
          position: 'top-center',
        }
      );

      // Clean up URL
      window.history.replaceState({}, '', '/app');
    }
  }, [showBetaWelcome]);

  return null;
}
