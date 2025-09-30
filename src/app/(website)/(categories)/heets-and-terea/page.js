export const dynamic = "force-dynamic"; // always SSR, no cache
export const revalidate = 0; // never cache

import ProductFilter from '@/components/ProductFilter';
import { fetchProductsByCategory } from '@/lib/data';

export const metadata = {
    title: "Buy HEETS & TEREA Sticks Authentic Tobacco IQOS Devices",
    description: "Shop original HEETS & TEREA sticks for your IQOS & ILUMA devices at Vape Marina. Wide flavor selection, fresh stock & 100% genuine Products with fast Delivery.",
    keywords: "heets dubai, terea sticks, iqos heets, buy heets online, heets flavors, terea uae, iqos tobacco, heat-not-burn, heets amber, terea turquoise, vapemarina heets",
    alternates: {
        canonical: "https://vapmarina.ae/heets-and-terea/",
    },
    openGraph: {
        title: "Buy HEETS & TEREA Sticks Authentic Tobacco IQOS Devices | Vape Marina",
        description: "Shop original HEETS & TEREA sticks for your IQOS & ILUMA devices at Vape Marina. Wide flavor selection, fresh stock & 100% genuine Products with fast Delivery.",
        url: "https://vapmarina.ae/heets-and-terea/",
        siteName: "Vape Marina",
        images: [
            {
                url: "/images/heets-terea-og.jpg",
                width: 1200,
                height: 630,
                alt: "Heets and Terea Tobacco Sticks Collection",
            },
        ],
        type: "website",
        locale: "en_AE",
    },
    twitter: {
        card: "summary_large_image",
        title: "Buy HEETS & TEREA Sticks Authentic Tobacco IQOS Devices | Vape Marina",
        description: "Shop original HEETS & TEREA sticks for your IQOS & ILUMA devices at Vape Marina. Wide flavor selection, fresh stock & 100% genuine Products with fast Delivery.",
        images: ["/images/heets-terea-twitter.jpg"],
    },
    robots: {
        index: true,
        follow: true,
    },
    other: {
        "dc.title": "Heets & Terea Tobacco Sticks - Vape Marina Dubai",
        "product:price:currency": "AED",
        "product:category": "Heat-not-burn Tobacco",
    }
};

export default async function HeetsTereaPage() {
    const initialHeetsTereaProducts = await fetchProductsByCategory(15);
    return (
        <ProductFilter
            initialProducts={initialHeetsTereaProducts}
            category="Heets & Terea for IQOS – All Flavors in Stock, Fast UAE Delivery"
        />
    )
}
