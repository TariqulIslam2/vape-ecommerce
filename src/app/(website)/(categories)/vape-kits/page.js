export const dynamic = "force-dynamic"; // always SSR, no cache
export const revalidate = 0; // never cache

import ProductFilter from '@/components/ProductFilter';
import { fetchProductsByCategory } from '@/lib/data';

export const metadata = {
    title: 'Buy Vape Kits in UAE – Starter & Advanced Vape Kits',
    description: 'Shop high-quality Vape Kits at Vape Marina. From beginner-friendly starters advanced mods 100% authentic brands guaranteed with fast delivery in UAE.',
    keywords: 'vape kits dubai, vape devices uae, vape starter kits, premium vape mods, disposable vapes, vaping products, vape shop dubai marina, best vape kits',

    alternates: {
        canonical: 'https://vapmarina.ae/vape-kits/',
    },

    openGraph: {
        title: 'Buy Vape Kits in UAE – Starter & Advanced Vape Kits | Vape Marina',
        description: 'Shop high-quality Vape Kits at Vape Marina. From beginner-friendly starters advanced mods 100% authentic brands guaranteed with fast delivery in UAE.',
        url: 'https://vapmarina.ae/vape-kits/',
        images: [{
            url: 'https://vapmarina.ae/images/vape-kits-og-image.jpg',
            width: 1200,
            height: 630,
            alt: 'Vape Kits Collection at Vape Marina',
        }],
        siteName: 'Vape Marina',
        locale: 'en_AE',
        type: 'website',
    },

    twitter: {
        card: 'summary_large_image',
        site: '@vapemarina',
        title: 'Buy Vape Kits in UAE – Starter & Advanced Vape Kits | Vape Marina',
        description: 'Shop high-quality Vape Kits at Vape Marina. From beginner-friendly starters advanced mods 100% authentic brands guaranteed with fast delivery in UAE. ',
        images: ['https://vapmarina.ae/images/vape-kits-twitter-image.jpg'],
    },

    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },

    other: {
        'dc.title': 'Buy Vape Kits in UAE – Starter & Advanced Vape Kits | Vape Marina',
        'product:price:currency': 'AED',
        'product:category': 'Vaping Devices',
    },
};


export default async function VapeKitsPage() {
    const initialVapeKitsProducts = await fetchProductsByCategory(16);
    return (
        <ProductFilter
            initialProducts={initialVapeKitsProducts}
            category="Vape Kits in UAE – Starter Kits to High-End Mods"
        />
    )
}