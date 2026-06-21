import Script from 'next/script'

const GA_ID = 'G-S448TRNRLS'

/**
 * Injects the GA4 gtag.js script using Next.js's `afterInteractive` strategy
 * so it loads after hydration without blocking the page.
 * Add this once inside <RootLayout>.
 */
export function GoogleAnalytics() {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { send_page_view: true });
        `}
      </Script>
    </>
  )
}
