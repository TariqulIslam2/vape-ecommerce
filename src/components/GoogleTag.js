import Script from 'next/script';

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

const GoogleTag = () => (
    <>
        {/* GTM Script */}
        <Script id="gtm-head" strategy="afterInteractive" dangerouslySetInnerHTML={{
            __html: `
      (function(w,d,s,l,i){
        w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
        var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
        j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
        f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${GTM_ID}');
      `
        }} />

        {/* Google gtag.js */}
        <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-BP50JENTVS"
            strategy="afterInteractive"
        />

        <Script id="gtag-init" strategy="afterInteractive" dangerouslySetInnerHTML={{
            __html: `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-BP50JENTVS');
      `
        }} />

        {/* noscript for GTM */}
        <noscript>
            <iframe
                src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
                height="0"
                width="0"
                style={{ display: 'none', visibility: 'hidden' }}
            />
        </noscript>
    </>
);

export default GoogleTag;
