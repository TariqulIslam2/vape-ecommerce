"use client";
import Link from "next/link";
import { useState } from "react";

const faqs = [
  // Dubai/UAE-specific FAQs
  {
    question: "Do you deliver vape products across Dubai and the UAE?",
    answer: "Yes, we deliver to all Emirates including Dubai, Abu Dhabi, Sharjah, Ajman, and more. Delivery is usually completed within 1-2 business days inside Dubai, and 2-3 days for other Emirates.",
    category: "delivery"
  },
  {
    question: "Is vaping legal in the UAE?",
    answer: "Yes, vaping is legal in the UAE for adults above 18 years old. All our products are compliant with UAE regulations.",
    category: "general"
  },
  {
    question: "What payment methods do you accept in Dubai?",
    answer: "We accept cash on delivery, credit/debit cards, Apple Pay, and Tabby installment payments for Dubai and UAE customers.",
    category: "payment"
  },
  {
    question: "Can I pay cash on delivery?",
    answer: "Yes, cash on delivery is available for all orders within the UAE.",
    category: "payment"
  },
  {
    question: "Do you offer same-day delivery in Dubai?",
    answer: "Yes, for orders placed before 5pm, we offer same-day delivery within Dubai city limits. For other Emirates, standard delivery applies.",
    category: "delivery"
  },
  {
    question: "Is there any age restriction for buying vape in UAE?",
    answer: "Yes, you must be at least 18 years old to purchase vape products in the UAE. Age verification may be required upon delivery.",
    category: "general"
  },
  {
    question: "Are your products authentic and approved in the UAE?",
    answer: "All our products are 100% authentic and approved by UAE authorities. We do not sell counterfeit or unregulated items.",
    category: "general"
  },
  {
    question: "What are the delivery charges within Dubai and UAE?",
    answer: "Delivery is free for orders above AED 200. For orders below AED 200, a small delivery fee applies (shown at checkout).",
    category: "delivery"
  },
  {
    question: "Can I return or exchange a product if I am not satisfied?",
    answer: "Yes, you can return or exchange unopened and unused products within 7 days of delivery. Please contact our support for assistance.",
    category: "return"
  },
  {
    question: "Do you sell nicotine-free e-liquids?",
    answer: "Yes, we offer a wide range of nicotine-free and various nicotine strength e-liquids.",
    category: "general"
  },
  {
    question: "How can I track my order?",
    answer: "Once your order is shipped, you will receive a tracking link via SMS or email. You can also check your order status in your account dashboard.",
    category: "delivery"
  },
  {
    question: "Do you have a physical store in Dubai?",
    answer: "Currently, we operate online only. All orders are processed and delivered from our Dubai warehouse.",
    category: "general"
  },

  // Delivery Policy FAQs
  {
    question: "How to order?",
    answer: "Browse our catalog, add items to cart, and follow the checkout process. Orders are confirmed via email.",
    category: "delivery"
  },
  {
    question: "How long will it take to get my package?",
    answer: "Delivery typically takes 2–5 business days depending on your location.",
    category: "delivery"
  },
  {
    question: "Where are your products sent from?",
    answer: "All orders are shipped from our central warehouse in MARINA .",
    category: "delivery"
  },
  {
    question: "What shipping methods are available?",
    answer: "We offer express delivery (1-2 days), standard delivery (3-5 days), and economy delivery (5-7 days). Express and standard delivery include tracking.",
    category: "delivery"
  },
  {
    question: "Do you offer international shipping?",
    answer: "Yes, we ship internationally to most countries. International delivery takes 7-14 business days depending on the destination.",
    category: "delivery"
  },
  {
    question: "Can I track my order?",
    answer: "Yes, once your order is shipped, you'll receive a tracking number via email to monitor your package's progress.",
    category: "delivery"
  },

  // Return & Refund FAQs
  {
    question: "What is your return policy?",
    answer: "We accept returns within 30 days of purchase. Items must be unused, in original packaging, and accompanied by the receipt.",
    category: "return"
  },
  {
    question: "How do I return an item?",
    answer: "Contact our customer service team to initiate a return. We'll provide you with a return shipping label and instructions.",
    category: "return"
  },
  {
    question: "When will I receive my refund?",
    answer: "Refunds are processed within 5-7 business days after we receive and inspect your returned item.",
    category: "return"
  },
  {
    question: "Can I exchange an item instead of returning it?",
    answer: "Yes, we offer exchanges for different sizes or colors within 30 days of purchase, subject to availability.",
    category: "return"
  },
  {
    question: "What items cannot be returned?",
    answer: "Personalized items, underwear, swimwear, and items marked as final sale cannot be returned for hygiene and safety reasons.",
    category: "return"
  },

  // Privacy Policy FAQs
  {
    question: "How do you protect my personal information?",
    answer: "We use industry-standard encryption and security measures to protect your personal data. We never sell your information to third parties.",
    category: "privacy"
  },
  {
    question: "What information do you collect?",
    answer: "We collect information you provide (name, email, address) and usage data to improve our services and fulfill orders.",
    category: "privacy"
  },
  {
    question: "Can I delete my account and data?",
    answer: "Yes, you can request account deletion and data removal by contacting our privacy team. We'll process your request within 30 days.",
    category: "privacy"
  },
  {
    question: "Do you use cookies?",
    answer: "Yes, we use cookies to enhance your browsing experience, remember preferences, and analyze site traffic. You can disable cookies in your browser settings.",
    category: "privacy"
  },

  // Size Guide FAQs
  {
    question: "How do I find my correct size?",
    answer: "Use our detailed size charts available on each product page. Measure yourself according to our guidelines for the best fit.",
    category: "size"
  },
  {
    question: "What if the size doesn't fit?",
    answer: "If the size doesn't fit, you can exchange it for a different size within 30 days. Return shipping is free for size exchanges.",
    category: "size"
  },
  {
    question: "Are your sizes true to fit?",
    answer: "Our sizes generally run true to fit, but we recommend checking the specific size chart for each brand as sizing may vary slightly.",
    category: "size"
  },
  {
    question: "Do you offer plus sizes?",
    answer: "Yes, we offer extended sizing up to 3XL in most of our product lines. Check individual product pages for available sizes.",
    category: "size"
  },

  // Payment & Taxes FAQs
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, PayPal, Apple Pay, Google Pay, and bank transfers. All payments are processed securely.",
    category: "payment"
  },
  {
    question: "Is my payment information secure?",
    answer: "Yes, we use SSL encryption and PCI-compliant payment processors to ensure your payment information is completely secure.",
    category: "payment"
  },
  {
    question: "Are taxes included in the price?",
    answer: "Taxes are calculated at checkout based on your shipping address. The final price including taxes will be shown before you complete your purchase.",
    category: "payment"
  },
  {
    question: "Can I pay in installments?",
    answer: "Yes, we offer installment payment options through select payment providers for orders over $100. Options will be shown at checkout.",
    category: "payment"
  },
  {
    question: "Why can't I log into my account?",
    answer: "Check your email/password or reset your credentials. Contact support if you need assistance.",
    category: "general"
  },
  {
    question: "How to change or modify billing address?",
    answer: "You can update your address under your account settings or contact support for help.",
    category: "general"
  }
];

const infoIcons = [
  { label: "Delivery Policy", src: "shipped", category: "delivery", color: "#4F46E5" },
  { label: "Return & Refund", src: "refund", category: "return", color: "#059669" },
  { label: "Privacy Policy", src: "privacy", category: "privacy", color: "#DC2626" },
  { label: "Size Guide", src: "resize", category: "size", color: "#7C2D12" },
  { label: "Payment & Taxes", src: "bank-card-back-side", category: "payment", color: "#1D4ED8" },
];

const page = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    setOpenIndex(null); // Close any open accordion when switching categories
  };

  const showAllFAQs = () => {
    setActiveCategory("all");
    setOpenIndex(null);
  };

  // Filter FAQs based on active category
  const filteredFAQs = activeCategory === "all"
    ? faqs
    : faqs.filter(faq => faq.category === activeCategory);

  // Get category title
  const getCategoryTitle = () => {
    if (activeCategory === "all") return "All Frequently Asked Questions";
    const categoryIcon = infoIcons.find(icon => icon.category === activeCategory);
    return categoryIcon ? `${categoryIcon.label} - Frequently Asked Questions` : "Frequently Asked Questions";
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gray-100 dark:bg-gray-900 py-16 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-[#2A4F5C] dark:text-[#93c5fd]">
            FREQUENTLY ASKED QUESTIONS
          </h1>
          <p className="text-gray-500 dark:text-gray-300 mt-2">
            Home &gt; Frequently Asked Questions
          </p>
        </div>
      </section>

      {/* Info Icons Section */}
      <section className="bg-white dark:bg-gray-800 py-16">
        <div className="max-w-6xl mx-auto px-4">
          {/* <h2 className="text-2xl font-bold text-center mb-8 text-[#2A4F5C] dark:text-[#93c5fd]">
            Select a Category
          </h2> */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 text-center">
            {infoIcons.map((icon, idx) => (
              <div
                key={idx}
                className={`flex flex-col items-center p-4 rounded-lg cursor-pointer transition-all duration-300 hover:shadow-lg ${activeCategory === icon.category
                  ? 'bg-blue-50 dark:bg-blue-900 border-2 border-blue-500 dark:border-blue-400 shadow-md'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700 border-2 border-transparent'
                  }`}
                onClick={() => handleCategoryClick(icon.category)}
              >
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-3 ${activeCategory === icon.category ? 'bg-blue-100 dark:bg-blue-800' : 'bg-gray-100 dark:bg-gray-700'
                  }`}>
                  <img
                    aria-label={icon.label}
                    src={`https://img.icons8.com/color/48/${icon.src}.png`}
                    alt={icon.label}
                    loading="eager"
                    fetchpriority="high"
                    decoding="async"
                    className="w-12 h-12"
                  />
                </div>
                <p className={`text-sm font-medium ${activeCategory === icon.category ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-200'
                  }`}>
                  {icon.label}
                </p>
                <span className={`text-xs mt-1 px-2 py-1 rounded-full ${activeCategory === icon.category
                  ? 'bg-blue-200 dark:bg-blue-700 text-blue-800 dark:text-blue-200'
                  : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                  }`}>
                  {faqs.filter(faq => faq.category === icon.category).length} FAQs
                </span>
              </div>
            ))}
          </div>

          {/* Show All Button */}
          <div className="text-center mt-8">
            <button
            
              onClick={showAllFAQs}
              aria-label="Show All FAQs"
              className={`px-6 py-3 rounded-lg transition-all duration-300 ${activeCategory === "all"
                ? 'bg-[#2A4F5C] dark:bg-[#2563eb] text-white shadow-md'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
            >
              Show All FAQs ({faqs.length})
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="max-w-4xl mx-auto py-16 px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-[#2A4F5C] dark:text-[#93c5fd]">
            {getCategoryTitle()}
          </h2>
          <span className="text-sm text-gray-500 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
            {filteredFAQs.length} question{filteredFAQs.length !== 1 ? 's' : ''}
          </span>
        </div>

        {filteredFAQs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-300 text-lg">No FAQs found for this category.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFAQs.map((faq, index) => (
              <div
                key={index}
                className="border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 bg-white dark:bg-gray-800"
              >
                <button
                  aria-label="Toggle FAQ"
                    onClick={() => toggleAccordion(index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center text-gray-800 dark:text-gray-100 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors duration-300"
                >
                  <span className="pr-4">{faq.question}</span>
                  <span className={`text-2xl font-bold transition-transform duration-300 ${openIndex === index ? 'rotate-45' : ''}
                    }`}>
                    +
                  </span>
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-4 text-gray-600 dark:text-gray-300 animate-fadeIn">
                    <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                      {faq.answer}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Help CTA */}
      <section className="bg-gray-100 dark:bg-gray-900 py-16 text-center">
        <div className="max-w-xl mx-auto px-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Can't find the answer you are looking for?
          </p>
          <h3 className="text-2xl font-bold mb-4 mt-2 text-[#2A4F5C] dark:text-[#93c5fd]">
            WE'RE HERE TO HELP!
          </h3>
          <Link
            href="/contact"
            className="inline-block bg-[#2A4F5C] dark:bg-[#2563eb] text-white px-8 py-3 rounded-lg hover:bg-[#1f3c45] dark:hover:bg-[#1e293b] transition-colors duration-300 font-medium"
            aria-label="Contact Us Now"
              >
            CONTACT US NOW
          </Link>
        </div>
      </section>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default page;