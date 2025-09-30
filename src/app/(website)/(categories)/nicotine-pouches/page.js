export const dynamic = "force-dynamic"; // always SSR, no cache
export const revalidate = 0; // never cache

import ProductFilter from '@/components/ProductFilter';
import { fetchProductsByCategory } from '@/lib/data';

export const metadata = {
    title: "Buy Nicotine Pouches in UAE – Smoke-Free Satisfaction",
    description: "Discover best nicotine pouches in UAE at Vape Marina. 100% tobacco-free, discreet & smoke-free refreshing flavors. Fast delivery Dubai, Sharjah, Ajman & more.",
    keywords: [
        "nicotine pouches Dubai",
        "buy snus UAE",
        "nicotine pods",
        "tobacco-free nicotine",
        "white pouches",
        "mint nicotine pouches",
        "Vape Marina nicotine",
        "NicPods Dubai"
    ],
    alternates: {
        canonical: "https://vapmarina.ae/nicotine-pouches/",
    },
    openGraph: {
        title: "Buy Nicotine Pouches in UAE – Smoke-Free Satisfaction | Vape Marina",
        description: "Discover best nicotine pouches in UAE at Vape Marina. 100% tobacco-free, discreet & smoke-free refreshing flavors. Fast delivery Dubai, Sharjah, Ajman & more.",
        url: "https://vapmarina.ae/nicotine-pouches/",
        siteName: "Vape Marina",
        images: [
            {
                url: "/nicotine-pouches-og.jpg",
                width: 1200,
                height: 630,
                alt: "Nicotine Pouches Collection at Vape Marina",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Buy Nicotine Pouches in UAE – Smoke-Free Satisfaction | Vape Marina",
        description: "Discover best nicotine pouches in UAE at Vape Marina. 100% tobacco-free, discreet & smoke-free refreshing flavors. Fast delivery Dubai, Sharjah, Ajman & more.",
        images: ["/nicotine-pouches-twitter.jpg"],
    },
    robots: {
        index: true,
        follow: true,
    },
    other: {
        "dc.title": "Buy Nicotine Pouches in UAE – Smoke-Free Satisfaction | Vape Marina",
        "product:category": "Tobacco Alternatives",
        "product:price:currency": "AED",
        "age_restriction": "18+"
    }
};

export default async function NicotinePouchesPage() {
    const initialNicotinePouchesProducts = await fetchProductsByCategory(2);
    return (
        <ProductFilter
            initialProducts={initialNicotinePouchesProducts}
            category="Nicotine Pouches in UAE – Clean & Smoke-Free Option"
        />
    )
}
