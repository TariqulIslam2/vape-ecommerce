export const dynamic = "force-dynamic"; // always SSR, no cache
export const revalidate = 0; // never cache

import ProductFilter from '@/components/ProductFilter';
import { fetchProductsByCategory } from '@/lib/data';

export const metadata = {
    title: "Buy JUUL Devices & Pods in UAE – Compact Vape System",
    description: "Discover authentic JUUL devices and pods at Vape Marina. Enjoy smooth nicotine compact, easy-to-use pod systems & 100% genuine products with Fast delivery in UAE. ",
    keywords: "juul pods dubai, juul starter kit uae, buy juul dubai, juul vape price uae, juul device dubai, juul mango pods, juul abu dhabi, juul shop near me, juul vape marina",
    alternates: {
        canonical: "https://vapmarina.ae/juul/",
    },
    openGraph: {
        title: "Buy JUUL Devices & Pods in UAE – Compact Vape System | Vape Marina",
        description: "Discover authentic JUUL devices and pods at Vape Marina. Enjoy smooth nicotine compact, easy-to-use pod systems & 100% genuine products with Fast delivery in UAE. ",
        url: "https://vapmarina.ae/juul/",
        siteName: "Vape Marina",
        images: [
            {
                url: "/images/juul-collection.jpg",
                width: 1200,
                height: 630,
                alt: "JUUL Pods & Devices Collection at Vape Marina",
            },
        ],
        type: "website",
        locale: "en_AE",
    },
    twitter: {
        card: "summary_large_image",
        site: "@vapemarina",
        title: "Buy JUUL Devices & Pods in UAE – Compact Vape System | Vape Marina",
        description: "Discover authentic JUUL devices and pods at Vape Marina. Enjoy smooth nicotine compact, easy-to-use pod systems & 100% genuine products with Fast delivery in UAE. ",
        images: ["/images/juul-pods-twitter.jpg"],
    },
    robots: {
        index: true,
        follow: true,
    },
    other: {
        "dc.title": "Buy JUUL Devices & Pods in UAE – Compact Vape System | Vape Marina",
        "product:price:currency": "AED",
        "product:category": "Vape Devices & Pods",
    }
};

export default async function JuulPage() {
    const initialJuulProducts = await fetchProductsByCategory(17);
    return (
        <ProductFilter
            initialProducts={initialJuulProducts}
            category="JUUL Vape & Pods – Authentic Products, Delivered Anywhere in UAE"
        />
    )
}
