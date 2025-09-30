export const dynamic = "force-dynamic"; // always SSR, no cache
export const revalidate = 0; // never cache

import ProductFilter from '@/components/ProductFilter';
import { fetchProductsByCategory } from '@/lib/data';

export const metadata = {
    title: 'Buy Premium E Juice Vapes in UAE – Fruity, Dessert & Classic Flavors',
    description: 'Explore premium E Juice flavors at Vape Marina. From juicy mango & watermelon to creamy desserts & rich tobacco blends. 100% authentic and Fast UAE Delivery. ',
    keywords: 'e-juice Dubai, vape liquid UAE, buy e-liquid online, premium vape juice, nicotine salts Dubai, shortfill e-liquid, best e-juice flavors, Vape Marina e-juice',
    alternates: {
        canonical: 'https://vapmarina.ae/e-juice/',
    },
    openGraph: {
        title: 'Buy Premium E Juice Vapes in UAE – Fruity, Dessert & Classic Flavors | Vape Marina',
        description: 'Explore premium E Juice flavors at Vape Marina. From juicy mango & watermelon to creamy desserts & rich tobacco blends. 100% authentic and Fast UAE Delivery.',
        url: 'https://vapmarina.ae/e-juice/',
        images: [
            {
                url: 'https://vapmarina.ae/ejuice-collection-og.jpg',
                width: 1200,
                height: 630,
                alt: 'Vape Marina E-Juice Flavor Collection',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        site: '@vapemarina',
        title: 'Buy Premium E Juice Vapes in UAE – Fruity, Dessert & Classic Flavors | Vape Marina',
        description: 'Explore premium E Juice flavors at Vape Marina. From juicy mango & watermelon to creamy desserts & rich tobacco blends. 100% authentic and Fast UAE Delivery.',
        images: ['https://vapmarina.ae/ejuice-twitter-card.jpg'],
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default async function EJuicePage() {
    const initialEJuiceProducts = await fetchProductsByCategory(3);
    return (
        <ProductFilter
            initialProducts={initialEJuiceProducts}
            category="E-Juice Online – Salt Nic & Freebase E-Liquids in the UAE"
        />
    );
}
