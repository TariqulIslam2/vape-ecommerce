import Image from "next/image";

const categories = [
  {
    title: "DISPOSABLES",
    img: "/disposables.png",
    colSpan: "col-span-2",
  },
  { title: "HEETS & TEREA", title2: "Heets & Terea", img: "/terea.png" },
  { title: "MYLE", img: "/myle.webp" },
  { title: "JUUL & PODS SYSTEM", img: "/podsandcoils.png" },
];
const PopularCategories = () => {
  return (
    <section className="p-6 bg-white dark:bg-gray-900">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">
        Popular Categories
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map((cat, index) => (
          <div
            key={index}
            className={`border-4 border-white dark:border-gray-700 overflow-hidden relative h-[190px] w-full backgroundImage flex items-center justify-center ${cat.colSpan ? cat.colSpan + " md:col-span-3" : ""
              } bg-white dark:bg-gray-800`}
          >
            {/* Centered Image */}
            <Image
              src={cat.img}
              alt={`${cat?.title} in Dubai - Vape Marina`}
              aria-label={`${cat?.title} in Dubai - Vape Marina`}
              priority // Critical for LCP optimization
              fetchPriority="high" // Resource hint
              width={300}
              height={300}
              className="object-contain"
            />
            {/* Category Title */}
            <div className="absolute bottom-4 left-0 w-full text-center">
              <span className="bg-white dark:bg-gray-900 text-black dark:text-gray-100 font-bold text-base md:text-lg px-3 md:px-5 py-1.5 md:py-2 rounded shadow-lg">
                {cat.title}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PopularCategories;
