import AgeVerificationModal from "@/components/AgeVerificationModal";
import CarouselBanner from "@/components/CarouselBanner";
import PopularCategories from "@/components/PopularCategories";
import ProductSections from "@/components/ProductSections";
import GoogleTag from "@/components/GoogleTag";

// SEO metadata
export const metadata = {
  title: {
    default: "Vape Marina – Best Online Vape Shop in Dubai UAE",
    template: "%s | Vape Marina",
  },
  description:
    "Vape Marina – UAE’s trusted online vape store offering IQOS devices, Heets, disposable vapes and more with fast delivery across Dubai, Sharjah & Ajman.",
  keywords:
    "vape, e-cigarette, IQOS, Heets, disposable vapes, Vape Marina, UAE, vape shop Dubai, online vape UAE,vape shop,vape marina,marina vape,vap marina,marina vap",
  authors: [{ name: "Vape Marina Team", url: "https://vapmarina.ae/" }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Vape Marina – Best Online Vape Shop in Dubai UAE",
    description:
      "Vape Marina – UAE’s trusted online vape store offering IQOS devices, Heets, disposable vapes and more with fast delivery across Dubai, Sharjah & Ajman.",
    url: "https://vapmarina.ae/",
    siteName: "Vape Marina",
    images: [
      {
        url: "https://vapmarina.ae/Vape-Marina-1.png",
        width: 1200,
        height: 630,
        alt: "Vape Marina – Best Online Vape Shop in Dubai UAE",
      },
    ],
    type: "website",
    locale: "en_AE",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vape Marina – Best Online Vape Shop in Dubai UAE",
    description:
      "Vape Marina – UAE’s trusted online vape store offering IQOS devices, Heets, disposable vapes and more with fast delivery across Dubai, Sharjah & Ajman.",
    site: "@vapemarina",
    creator: "@vapemarina",
    images: ["https://vapmarina.ae/Vape-Marina-1.png"],
  },
  alternates: {
    canonical: "https://vapmarina.ae/",
  },
  verification: {
    google: "84pa2XNxsjTQZJw4SQWmdipBfuAZ41auxXX17cH-j7Q",
  },
  metadataBase: new URL("https://vapmarina.ae/"),
};

export default async function Home() {
  return (
    <div className="mt-4 container mx-auto dark:bg-gray-950 dark:text-gray-100">
      {/* Google Tag */}
      <GoogleTag />

      {/* Age Verification */}
      <AgeVerificationModal />

      {/* Carousel Banner */}
      <div>
        <CarouselBanner />
      </div>

      {/* Welcome Text */}
      <div>
        <p className="max-w-6xl mx-auto my-5 text-wrap border border-stone-200 dark:border-stone-700 rounded-md p-5 text-center bg-white dark:bg-stone-900 dark:text-gray-200">
          Welcome to Vape Marina Dubai UAE online vape shop. We are UAE based
          online vape shop. You can order all types of IQOS devices, Heets, and
          Disposable Vape from us. We deliver products in Dubai, Sharjah, Ajman via Cash on Delivery, Card Payment and Bank Transfer payment. We also deliver products Cash on Delivery in Abu Dhabi, Al Ain, Umm Al Quwain, Ras Al Khaimah, Fujairah.
        </p>
      </div>

      {/* Popular Categories */}
      <div>
        <PopularCategories />
      </div>

      {/* Product Sections */}
      <ProductSections />

      {/* Warning Section */}
      <div className="m-8 border border-red-500 dark:border-red-700 p-5 bg-white dark:bg-stone-900">
        <h1 className="text-2xl text-red-500 dark:text-red-400 text-center font-bold p-5">
          WARNING / تحذير
        </h1>
        <h2 className="max-w-7xl text-center text-sm/8 dark:text-gray-200">
          Not for Sale for Minors – Products sold on this site may contain
          nicotine which is a highly addictive substance. <br />
          WARNING: This product can expose you to chemicals including nicotine, which is known
          to cause birth defects or other reproductive harm.
          <br /> Products sold on this site are intended for adult smokers.
          <br /> You must be of legal smoking age in your territory to purchase
          products.
          <br /> Use All Products On This Site At Your Own Risk!
          <br />{" "}
          <span className="font-bold">
            للبالغين فقط – قد تحتوي المنتجات التي يتم بيعها على هذا الموقع على
            مادة النيكوتين وهي مادة تسبب الإدمان بدرجة كبيرة. تحذير: يمكن لهذا
            المنتج أن يعرضك لمواد كيميائية بما في ذلك النيكوتين ، المعروف أنها
            تسبب تشوهات خلقية أو غيرها من الأضرار التناسلية. المنتجات المباعة
            على هذا الموقع مخصصة للمدخنين البالغين. يجب أن تكون في سن التدخين
            القانوني في منطقتك لشراء المنتجات. استخدام جميع المنتجات على هذا
            الموقع على مسؤوليتك الخاصة!
          </span>
        </h2>
      </div>
    </div>
  );
}
