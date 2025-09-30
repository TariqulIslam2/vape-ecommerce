export const dynamic = "force-dynamic"; // always SSR, no cache
export const revalidate = 0; // never cache

import ProductFilter from '@/components/ProductFilter';
import { fetchProductsByCategory } from '@/lib/data';


export const metadata = {
    title: 'Buy Disposable Vapes in UAE – Top Flavors & Deals',
    description: 'Shop Premium Disposable Vapes at Vape Marina– UAE’s trusted vape store. Enjoy smooth flavors, sleek designs & 100% authentic. Delivery in Dubai, Sharjah, Ajman & beyond. ',
    keywords: 'disposable vapes Dubai, buy disposable vape UAE, Elf Bar Dubai, Lost Mary UAE, best disposable e-cigarettes, vape shop Dubai, disposable vape price, Vape Marina',
    alternates: { canonical: 'https://vapmarina.ae/disposable/' },
    openGraph: {
        title: 'Buy Disposable Vapes in UAE – Top Flavors & Deals | Vape Marina',
        description: 'Shop Premium Disposable Vapes at Vape Marina– UAE’s trusted vape store. Enjoy smooth flavors, sleek designs & 100% authentic. Delivery in Dubai, Sharjah, Ajman & beyond. ',
        url: 'https://vapmarina.ae/disposable/',
        images: [{
            url: 'https://vapmarina.ae/disposable-og.jpg',
            width: 800,
            height: 600,
            alt: 'Disposable Vapes in Dubai',
        }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Buy Disposable Vapes in UAE – Top Flavors & Deals | Vape Marina',
        description: 'Shop Premium Disposable Vapes at Vape Marina– UAE’s trusted vape store. Enjoy smooth flavors, sleek designs & 100% authentic. Delivery in Dubai, Sharjah, Ajman & beyond. ',
        images: ['https://vapmarina.ae/disposable-twitter.jpg'],
    },
    robots: { index: true, follow: true },
};

export default async function DisposablePage() {
    const initialProducts = await fetchProductsByCategory(1);
    

    return (
        <ProductFilter
            initialProducts={initialProducts}
            category="Top Disposable Vapes in the UAE – No Charging, No Refilling"
        />
    )

}
