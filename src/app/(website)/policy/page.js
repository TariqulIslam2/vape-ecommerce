import React from "react";
export const metadata = {
  title: {
    default: "Privacy & Policy – Vape Marina Dubai UAE",
    template: "%s | Vape Marina",
  },
  description:
    "Read Vape Marina's Privacy & Policy. Learn how we collect, use, and protect your personal information in accordance with UAE laws for our online vape store.",
  keywords:
    "Vape Marina, Privacy Policy, data protection, UAE vape laws, vaping store Dubai, online vape shop, personal information, vape UAE, age restriction",
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
    title: "Privacy & Policy – Vape Marina Dubai UAE",
    description:
      "Learn how Vape Marina collects, uses, and protects your data in compliance with UAE laws for online vaping products.",
    url: "https://vapmarina.ae/policy/",
    siteName: "Vape Marina",
    images: [
      {
        url: "https://vapmarina.ae/Vape-Marina-1.png",
        width: 1200,
        height: 630,
        alt: "Vape Marina – Privacy & Policy",
      },
    ],
    type: "website",
    locale: "en_AE",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy & Policy – Vape Marina Dubai UAE",
    description:
      "Read Vape Marina's Privacy & Policy to know how we handle your personal data and comply with UAE regulations.",
    site: "@vapemarina",
    creator: "@vapemarina",
    images: ["https://vapmarina.ae/Vape-Marina-1.png"],
  },
  alternates: {
    canonical: "https://vapmarina.ae/policy/",
  },
  verification: {
    google: "84pa2XNxsjTQZJw4SQWmdipBfuAZ41auxXX17cH-j7Q",
  },
  metadataBase: new URL("https://vapmarina.ae/"),
};

const page = () => {
  return (
    <div>
      <section className="p-20 text-center text-[#2A4F5C] bg-gray-100 dark:bg-gray-900 dark:text-gray-100">
        <h1 className="text-4xl font-bold">Privacy & Policy</h1>
        <p className="text-gray-500 mt-2 dark:text-gray-400">Home &gt; Privacy & Policy</p>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-16 space-y-8 text-gray-700 dark:text-gray-200">
        <div>
          <h2 className="text-2xl font-semibold mb-2 dark:text-gray-100">
            SECTION 1 – WHAT INFORMATION DO WE COLLECT?
          </h2>
          <p>
            When you purchase from our store, we collect personal information such as your name, address, email, phone number, and order details.
          </p>
          <p>
            We automatically receive your device’s IP address and browser information to help us improve security and user experience.
          </p>
          <p>
            Our website is strictly for adults (18+). We do not knowingly collect information from minors.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2 dark:text-gray-100">SECTION 2 – HOW DO WE USE YOUR INFORMATION?</h2>
          <p>
            To process your orders, arrange delivery, and provide customer support.
          </p>
          <p>
            To comply with legal requirements, including age verification as per UAE law.
          </p>
          <p>
            With your consent, to send you marketing emails about new products, offers, or updates.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2 dark:text-gray-100">SECTION 3 – CONSENT & AGE RESTRICTION</h2>
          <p>
            By using our website and placing an order, you confirm that you are at least 18 years old and comply with all UAE regulations regarding vape products.
          </p>
          <p>
            You may withdraw your consent for us to contact you or use your information at any time by emailing: <a href="mailto:privacy@yourdomain.com" className="text-blue-600 underline dark:text-blue-400">privacy@yourdomain.com</a>.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2 dark:text-gray-100">SECTION 4 – DISCLOSURE</h2>
          <p>
            We do not share your personal information with third parties except as necessary to process your order (e.g., payment gateways, delivery services) or as required by UAE law.
          </p>
          <p>
            Third-party service providers (such as payment processors) have their own privacy policies regarding the information we provide to them.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2 dark:text-gray-100">SECTION 5 – DATA STORAGE & SECURITY</h2>
          <p>
            We take reasonable precautions and follow industry best practices to protect your personal information from loss, misuse, unauthorized access, disclosure, alteration, or destruction.
          </p>
          <p>
            Your data is stored securely and handled in accordance with UAE data protection laws.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2 dark:text-gray-100">SECTION 6 – INTERNATIONAL USERS</h2>
          <p>
            Our services are intended for customers within the United Arab Emirates. We do not accept orders from outside the UAE.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2 dark:text-gray-100">SECTION 7 – CHANGES TO THIS POLICY</h2>
          <p>
            We reserve the right to modify this privacy policy at any time. Changes will take effect immediately upon posting on the website.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2 dark:text-gray-100">CONTACT INFORMATION</h2>
          <p>
            Privacy Compliance Officer: <a href="mailto:privacy@yourdomain.com" className="text-blue-600 underline dark:text-blue-400">privacy@yourdomain.com</a>
            <br />
            Address: Dubai, United Arab Emirates
          </p>
        </div>
      </div>
    </div>
  );
};

export default page;
