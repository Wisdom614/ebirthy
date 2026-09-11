'use client';

import React, { useEffect, Suspense } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageView, flushSessionDuration, sendHeartbeat } from '../../utils/analytics/tracker';
import Script from 'next/script';

function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    // Track pageview on mount and pathname change
    trackPageView(pathname);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        flushSessionDuration();
      } else if (document.visibilityState === 'visible') {
        sendHeartbeat();
      }
    };

    const handleBeforeUnload = () => {
      flushSessionDuration();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      flushSessionDuration();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [pathname]);

  return null;
}

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <>
      <Suspense fallback={null}>
        <AnalyticsTracker />
      </Suspense>

      {/* Optional Microsoft Clarity Session Replays & Heatmaps */}
      {clarityId && (
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${clarityId}");
          `}
        </Script>
      )}

      {/* Optional Google Analytics 4 */}
      {gaId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}');
            `}
          </Script>
        </>
      )}

      {children}
    </>
  );
}
