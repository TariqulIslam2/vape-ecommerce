import AgeVerificationModal from "@/components/AgeVerificationModal";
import CarouselBanner from "@/components/CarouselBanner";
import PopularCategories from "@/components/PopularCategories";
import ProductSections from "@/components/ProductSections";
import { executeQuery } from "@/lib/db";

// Server component to fetch data
async function getProducts() {
  try {
    // Direct database query instead of API call
    const products = await executeQuery(`
      SELECT 
        p.*, 
        c.name AS category_name,
        GROUP_CONCAT(pi.image_url) AS images
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN product_images pi ON p.id = pi.product_id
      WHERE p.status = 1
      GROUP BY p.id
      ORDER BY p.id DESC
    `);

    // Process the images string into an array
    return products.map(product => ({
      ...product,
      images: product.images ? product.images.split(',') : []
    }));
  } catch (err) {
    console.error("Failed to fetch products:", err);
    return [];
  }
}

export default async function Home() {
  const productData = await getProducts();
  // console.log(productData);

  return (
    <div className="mt-4 container mx-auto dark:bg-gray-950 dark:text-gray-100">
      <AgeVerificationModal />

      <div className="">
        <CarouselBanner />
      </div>

      <div>
        <p className="max-w-6xl mx-auto my-5 text-wrap border border-stone-200 dark:border-stone-700 rounded-md p-5 text-center bg-white dark:bg-stone-900 dark:text-gray-200">
          Welcome to Vape Marina Dubai UAE online vape shop. We are UAE based
          online vape shop. You can order all types of IQOS devices, Heets, and
          Disposable Vape from us. We deliver products in Dubai, Sharjah, Ajman via Cash on Delivery, Card Payment and Bank Transfer payment. We also deliver products Cash on Delivery in Abu Dhabi, Al Ain, Umm Al Quwain, Ras Al Khaimah, Fujairah.
        </p>
      </div>

      <div>
        <PopularCategories />
      </div>

      {/* Client component handles all the interactive state */}
      <ProductSections productData={productData} />

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