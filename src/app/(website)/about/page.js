import Image from "next/image";

export const metadata = {
  title: {
    default: "About Us – UAE’s Trusted Vape Store",
    template: "%s | Vape Marina",
  },
  description:
    "Learn about Vape Marina, a leading online vape shop in Dubai UAE. We provide premium vaping products, disposable vapes, e-juice, IQOS devices, and Heets with fast delivery across Dubai, Sharjah & Ajman.",
  keywords:
    "Vape Marina, vape shop Dubai, online vape UAE, disposable vapes, e-juice, IQOS devices, Heets, vaping products, vape store Dubai, premium vape, vape delivery Dubai",
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
    title: "About Vape Marina – Premium Vape Products in Dubai UAE",
    description:
      "Discover Vape Marina's mission, vision, retail presence, and commitment to quality vaping products across Dubai, Sharjah & Ajman.",
    url: "https://vapmarina.ae/about/",
    siteName: "Vape Marina",
    images: [
      {
        url: "https://vapmarina.ae/Vape-Marina-1.png",
        width: 1200,
        height: 630,
        alt: "Vape Marina – Premium Vape Products in Dubai UAE",
      },
    ],
    type: "website",
    locale: "en_AE",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Vape Marina – Premium Vape Products in Dubai UAE",
    description:
      "Learn about Vape Marina, a trusted online vape shop in Dubai UAE offering premium products and excellent customer service.",
    site: "@vapemarina",
    creator: "@vapemarina",
    images: ["https://vapmarina.ae/Vape-Marina-1.png"],
  },
  alternates: {
    canonical: "https://vapmarina.ae/about/",
  },
  verification: {
    google: "84pa2XNxsjTQZJw4SQWmdipBfuAZ41auxXX17cH-j7Q",
  },
  metadataBase: new URL("https://vapmarina.ae/"),
};



const page = () => {
  return (
    <div className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100">
      {/* Hero Section */}
      <div className="bg-black py-16 mb-8 dark:bg-gray-800">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/3 w-full">
            <Image
              src="/Vape-Marina-1.png"
              alt="Vape Marina Logo"
              width={300}
              height={200}
              priority // Critical for LCP optimization
              fetchPriority="high" // Resource hint
              className="w-full h-auto"
            />
          </div>
          <div className="md:w-2/3 w-full">
            <Image
              src="/aboutus-1-removebg-preview.png"
              alt="Vaping Products"
              width={600}
              height={300}
              priority // Critical for LCP optimization
              fetchPriority="high" // Resource hint
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="max-w-4xl mx-auto px-4 mb-10 text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to Vape Marina</h1>
        <p className="mb-4">
          Vape Marina is an online retailer and supplier offering new and
          premium vaping products to customers around the world with the finest
          vape brands, featuring an exquisite array of flavors and variety at
          competitive prices.
        </p>
        <p>
          At Vape Marina, we have created a community environment built with the
          finest vaping products and exceptional service. Our customer service
          representatives ensure customer satisfaction sets us apart in the
          industry.
        </p>
      </div>

      {/* Mission & Vision */}
      <section className="py-10 text-center ">
        <h2 className="text-3xl font-semibold text-[#2A4F5C] dark:text-[#7fd7ff] mb-8">
          Mission & Vision
        </h2>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-center items-center gap-6">
          <div className="bgColor text-white p-8 rounded-md w-72 h-64 flex flex-col items-center justify-center dark:bg-gray-800 dark:text-gray-100">
            <div className="text-yellow-400 text-4xl mb-4">⊕</div>
            <h3 className="text-xl font-semibold mb-2">Mission</h3>
            <p className="text-sm text-center">
              Our mission is to provide vapers with a fantastic experience by
              delivering a diverse range of high-quality vaping products that
              enhance their vaping journey.
            </p>
          </div>
          <div className="bgColor text-white p-8 rounded-md w-72 h-64 flex flex-col items-center justify-center dark:bg-gray-800 dark:text-gray-100">
            <div className="text-yellow-400 text-4xl mb-4">⊗</div>
            <h3 className="text-xl font-semibold mb-2">Vision</h3>
            <p className="text-sm text-center">
              We envision a world where vaping is recognized as a healthy
              alternative for smokers by providing an enjoyable and smooth
              vaping experience.
            </p>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-10 text-center">
        <h2 className="text-3xl font-semibold text-[#2A4F5C] dark:text-[#7fd7ff] mb-8">
          What We Offer
        </h2>
        <div className="flex flex-col md:flex-row justify-center items-center gap-6 max-w-5xl mx-auto">
          {[
            {
              title: "Premium Products",
              text: "Enjoy the convenience of shopping online with our wide and reliable product selection. Whether you're a vaping novice or expert, we have all the best and the newest for you.",
            },
            {
              title: "Expert Guidance",
              text: "Our knowledgeable team is always available to assist you in finding the perfect vaping solution based on your preferences and needs.",
            },
            {
              title: "Convenience",
              text: "Enjoy the convenience of shopping online with our wide and reliable product selection. Whether you're a vaping novice or expert, we have all the best and the newest for you.",
            },
          ].map(({ title, text }, i) => (
            <div
              key={i}
              className="p-6 rounded-md w-72 h-64 flex flex-col items-center justify-start text-center bg-[#F0C052] dark:bg-[#7d5c1e]"
            >
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">{title}</h3>
              <p className="text-sm text-gray-800 dark:text-gray-100">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Retail Presence */}
      <section className="py-10">
        <h2 className="text-3xl font-semibold text-[#2A4F5C] dark:text-[#7fd7ff] text-center mb-8">
          Our Retail Presence
        </h2>
        <div
          className="bg-gray-900 text-white rounded-md p-6 max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-6 dark:bg-gray-800 dark:text-gray-100"
        >
          <div className="md:w-1/2">
            <h3 className="text-xl font-semibold text-yellow-400 mb-2">
              Our Retail Presence
            </h3>
            <p>
              With 10 modern retail shops located across the city, we provide
              the same exceptional service and product quality in our physical
              stores as our online platform. Visit us to experience our service
              firsthand.
            </p>
          </div>
          <div className="md:w-1/2">
            <Image
              src="/WVA-Blog-Image-Template.webp"
              alt="Retail Store"
              width={500}
              height={300}
              priority // Critical for LCP optimization
              fetchPriority="high" // Resource hint
              className="rounded-md w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* Customer Satisfaction */}
      <section className="py-10">
        <h2 className="text-3xl font-semibold text-[#2A4F5C] dark:text-[#7fd7ff] text-center mb-6">
          Customer Satisfaction
        </h2>
        <div className="max-w-4xl mx-auto text-center mb-6">
          <p>
            We take pride in delivering the finest customer experience. Here's
            what some customers have to say about their journey with Vape
            Marina.
          </p>
        </div>
        <div className="flex justify-center items-start gap-6 flex-wrap max-w-5xl mx-auto">
          <Image
            src="/google-removebg-preview.png"
            alt="Google Reviews"
            width={150}
            height={50}
            priority // Critical for LCP optimization
            fetchPriority="high" // Resource hint
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            {[
              "Great service and fast delivery!",
              "Excellent product quality!",
              "Amazing variety of flavors!",
              "Helpful staff and competitive prices!",
              "Best vape shop in town!",
              "Will definitely order again!",
            ].map((review, i) => (
              <div
                key={i}
                className="bg-white border border-gray-300 p-3 rounded-md text-gray-700 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
              >
                <p>"{review}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Future Endeavors */}
      <section className="py-10">
        <h2 className="text-3xl font-semibold text-[#2A4F5C] dark:text-[#7fd7ff] text-center mb-6">
          Future Endeavors
        </h2>
        <div className="max-w-4xl mx-auto text-center">
          <p>
            As we continue to grow, we are excited about the future and
            committed to bringing you innovative products and improvements that
            enhance your vaping journey.
          </p>
          <p className="mt-4">
            Thank you for choosing Vape Marina. We invite you to explore our
            website, discover our offerings, and join us on this amazing
            journey.
          </p>
        </div>
      </section>
    </div>
  );
};

export default page;
