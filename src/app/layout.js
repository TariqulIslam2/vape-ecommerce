import "./globals.css";
import { Poppins } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Script from 'next/script';
import GoogleTag from "@/components/GoogleTag";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-poppins",
});

export const metadata = {
  title: {
    default: "Vape Marina – Best Online Vape Shop in Dubai UAE",
    template: "%s | Vape Marina"
  },
  description: "Vape Marina – UAE’s trusted online vape store offering disposable vapes, e-juice, IQOS devices & Heets with fast delivery across Dubai, Sharjah & Ajman.",
  keywords: "vape, e-cigarette, e-juice, vape shop, Vape Marina, vapmarina, Disposable Vape, E-Juice, Nicotine Pouches, IQOS Iluma, Heets & Terea, Juul & Pods System, Vape Kits, vapmarina.ae, vape marina, vape shop Dubai, vape store Dubai, buy vape online Dubai, disposable vapes Dubai, vape delivery Dubai, vape shop near me, best vape shop Dubai, vape juice Dubai, CBD vape Dubai, e-cigarettes Dubai",
  authors: [{ name: "Vape Marina Team", url: "https://vapmarina.ae/" }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },
  openGraph: {
    title: "Vape Marina – Best Online Vape Shop in Dubai UAE",
    description: "Vape Marina – UAE’s trusted online vape store offering disposable vapes, e-juice, IQOS devices & Heets with fast delivery across Dubai, Sharjah & Ajman.",
    url: "https://vapmarina.ae/",
    siteName: "Vape Marina",
    images: [
      {
        url: "https://vapmarina.ae/Vape-Marina-1.png",
        width: 1200,
        height: 630,
        alt: "Vape Marina – Best Online Vape Shop in Dubai UAE"
      }
    ],
    type: "website",
    locale: "en_US"
  },
  twitter: {
    card: "summary_large_image",
    title: "Vape Marina – Best Online Vape Shop in Dubai UAE",
    description: "Vape Marina – UAE’s trusted online vape store offering disposable vapes, e-juice, IQOS devices & Heets with fast delivery across Dubai, Sharjah & Ajman.",
    site: "@vapemarina",
    creator: "@vapemarina",
    images: ["https://vapmarina.ae/Vape-Marina-1.png"]
  },
  alternates: {
    canonical: "https://vapmarina.ae/"
  },
  verification: {
    google: "84pa2XNxsjTQZJw4SQWmdipBfuAZ41auxXX17cH-j7Q"
  }
};


export default function RootLayout({ children }) {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "VapeShop",
    "name": "Vape Marina",
    "title": "Vape Marina  – Best Online Vape Shop in Dubai UAE",
    "image": "https://vapmarina.ae/Vape-Marina-1.png",
    "description": "Vape Marina – UAE’s trusted online vape store offering disposable vapes, e- juice, IQOS devices, and Heets with fast delivery across Dubai, Sharjah & Ajman at the best prices.",
    "url": "https://vapmarina.ae/",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "China A12 - International City China Cluster",
      "addressLocality": "Dubai",
      "addressRegion": "UAE",
      "postalCode": "00000",
      "addressCountry": "AE"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "25.2048",
      "longitude": "55.2708"
    },
    "telephone": "+971567404217",
    "openingHours": "Mo-Su 10:00-22:00",
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "10:00",
      "closes": "22:00"
    }
  };

  return (
    <html lang="en">
      <head>
        <GoogleTag />
        <meta property="og:image" content="https://vapmarina.ae/Vape-Marina-1.png" />
        <meta property="og:image:alt" content="Vape Marina - Best Vape Shop in Dubai UAE" />
        <meta name="twitter:image:alt" content="Vape Marina - Best Vape Shop in Dubai UAE" />
        <link rel="icon" href="/favicon-32x32.png" type="image/png" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />

        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="google-site-verification" content="84pa2XNxsjTQZJw4SQWmdipBfuAZ41auxXX17cH-j7Q" />
      </head>
      <body className={`${poppins.variable} antialiased`}>


        <Toaster position="top-right" />
        <ToastContainer />

        {children}

        <Script
          id="schema-org"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      </body>
    </html>
  );
}