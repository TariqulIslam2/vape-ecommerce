export const dynamic = "force-dynamic"; // always SSR, no cache
export const revalidate = 0; // never cache

import { Suspense } from "react";
import ProductFilter from "@/components/ProductFilter";
import { fetchAllProducts } from "@/lib/data";

export const metadata = {
  title: 'Shop Vape Marina',
  description: 'Shop the best vape products in Dubai with fast UAE delivery. Premium e-liquids, devices, pods, and accessories at competitive prices. 100% authentic products with warranty.',
  keywords: 'vape shop dubai, buy vape uae, e-liquid dubai, disposable vapes, vape devices, nicotine pouches, vaping accessories, vapemarina',
  alternates: {
    canonical: 'https://vapmarina.ae/shop/',
  },
  openGraph: {
    title: 'Vape Products | Vape Marina Dubai',
    description: 'Your one-stop shop for all vaping needs in UAE. Authentic products with next-day delivery across Dubai, Abu Dhabi, and Sharjah.',
    url: 'https://vapmarina.ae/shop/',
    images: [{
      url: 'https://vapmarina.ae/images/vape-shop-og.jpg',
      width: 800,
      height: 600,
      alt: 'Vape Marina Product Collection',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vape Shop Dubai | Premium Products UAE',
    description: 'Best prices on vape devices, e-liquids, pods and accessories with express UAE delivery',
    images: ['https://vapmarina.ae/images/vape-shop-twitter.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};



export default async function ShopPage({ searchParams }) {
  const initialProducts = await fetchAllProducts();
  const search = searchParams.search?.toLowerCase() || "";
  console.log(initialProducts)
  return (
    <Suspense fallback={<div>Loading products...</div>}>
      <ProductFilter
        initialProducts={initialProducts}
        category="Vape Marina Dubai - Premium Vape Products UAE"
        searchTerm={search}
      />
    </Suspense>
  );
}