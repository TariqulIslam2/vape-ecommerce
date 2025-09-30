export const dynamic = "force-dynamic"; // always SSR, no cache
export const revalidate = 0; // never cache

import ProductFilter from '@/components/ProductFilter';
import { fetchProductsByCategory } from '@/lib/data';

export const metadata = {
    title: "Original MYLE Pods & Devices in UAE – Best Deals & Fast Delivery",
    description: "Shop authentic MYLE pods and vape devices at Vape Marina. Enjoy smooth flavors, reliable performance & 100% genuine MYLE products guaranteed.",
    keywords: [
        "Myle vape Dubai",
        "Myle pods UAE",
        "Myle Meta Box",
        "Myle Mini",
        "buy Myle online",
        "Myle vape price",
        "Myle flavors",
        "Vape Marina Myle"
    ],
    alternates: {
        canonical: "https://vapmarina.ae/myle/",
    },
    openGraph: {
        title: "Original MYLE Pods & Devices in UAE – Best Deals & Fast Delivery | Vape Marina",
        description: "Shop authentic MYLE pods and vape devices at Vape Marina. Enjoy smooth flavors, reliable performance & 100% genuine MYLE products guaranteed. ",
        url: "https://vapmarina.ae/myle/",
        siteName: "Vape Marina",
        images: [
            {
                url: "/images/myle-products-og.jpg",
                width: 1200,
                height: 630,
                alt: "Myle Vape Products Collection at Vape Marina",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Original MYLE Pods & Devices in UAE – Best Deals & Fast Delivery | Vape Marina",
        description: "Shop authentic MYLE pods and vape devices at Vape Marina. Enjoy smooth flavors, reliable performance & 100% genuine MYLE products guaranteed. ",
        images: ["/images/myle-twitter-card.jpg"],
    },
    robots: {
        index: true,
        follow: true,
    },
    other: {
        "dc.title": "Original MYLE Pods & Devices in UAE – Best Deals & Fast Delivery | Vape Marina",
        "product:brand": "Myle",
        "product:price:currency": "AED"
    }
};

export default async function MylePage() {
    const initialMyleProducts = await fetchProductsByCategory(12);
    return (
        <ProductFilter
            initialProducts={initialMyleProducts}
            category="Myle Vape Devices & Pods – Original & Authentic in Dubai"
        />
    )
}
