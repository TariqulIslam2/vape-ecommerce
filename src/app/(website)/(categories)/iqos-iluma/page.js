export const dynamic = "force-dynamic"; // always SSR, no cache
export const revalidate = 0; // never cache

import ProductFilter from '@/components/ProductFilter';
import { fetchProductsByCategory } from '@/lib/data';

export const metadata = {
    title: "Buy IQOS ILUMA in UAE – Next-Gen Heat-Not-Burn Device | Vape Marina",
    description: "Experience smoke-free technology with IQOS ILUMA at Vape Marina. 100% authentic devices and no blades, no cleaning, just pure satisfaction with Fast Delivery. ",
    keywords: "iqos iluma dubai, buy iqos iluma uae, iluma prime, iluma one, iqos iluma price, heat-not-burn device, iqos dubai, iluma terea, iqos iluma sticks, vapemarina iqos",
    alternates: {
        canonical: "https://vapmarina.ae/iqos-iluma/",
    },
    openGraph: {
        title: "Buy IQOS ILUMA in UAE – Next-Gen Heat-Not-Burn Device",
        description: "Experience smoke-free technology with IQOS ILUMA at Vape Marina. 100% authentic devices and no blades, no cleaning, just pure satisfaction with Fast Delivery. ",
        url: "https://vapmarina.ae/iqos-iluma/",
        siteName: "Vape Marina",
        images: [
            {
                url: "/images/iqos-iluma-og.jpg",
                width: 1200,
                height: 630,
                alt: "IQOS Iluma Devices Collection",
            },
        ],
        type: "website",
        locale: "en_AE",
    },
    twitter: {
        card: "summary_large_image",
        title: "Buy IQOS ILUMA in UAE – Next-Gen Heat-Not-Burn Device",
        description: "Experience smoke-free technology with IQOS ILUMA at Vape Marina. 100% authentic devices and no blades, no cleaning, just pure satisfaction with Fast Delivery. ",
        images: ["/images/iqos-iluma-twitter.jpg"],
    },
    robots: {
        index: true,
        follow: true,
    },
    other: {
        "dc.title": "Buy IQOS ILUMA in UAE – Next-Gen Heat-Not-Burn Device",
        "product:price:currency": "AED",
        "product:category": "Heat-not-burn Devices",
    }
};

export default async function IqosIlumaPage() {
    const initialIqosIlumaProducts = await fetchProductsByCategory(13);
    return (
        <ProductFilter
            initialProducts={initialIqosIlumaProducts}
            category="IQOS Iluma Devices & Accessories – Next-Gen Tobacco Heating"
        />
    )
}
