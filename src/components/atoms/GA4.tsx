import React from 'react'
import Script from 'next/script'

export const GA4: React.FC<{ id: string }> = ({ id }) => {
  return (
    <div>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${id}');
        `}
      </Script>
    </div>
  )
}

export default GA4
