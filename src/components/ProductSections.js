"use client";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { useState, useMemo, useEffect } from "react";

export default function ProductSections() {
    const [visibleCountTopChoose, setVisibleCountTopChoose] = useState(8);
    const [visibleCountDisposableVape, setVisibleCountDisposableVape] = useState(8);
    const [visibleCountMyle, setVisibleCountMyle] = useState(8);
    const [visibleCountEJuice, setVisibleCountEJuice] = useState(8);
    const [visibleNicotinePouches, setVisibleNicotinePouches] = useState(8);
    const [visibleCountIQOSIluma, setVisibleCountIQOSIluma] = useState(8);
    const [visibleCountPodsSystem, setVisibleCountPodsSystem] = useState(8);
    const [productData, setProductData] = useState([]);



    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch("/api/products");
                const data = await res.json();
                // console.log(data);
                const product = data.filter(item => item.status === 1);
                setProductData(product);

            } catch (err) {
                console.error("Failed to fetch products:", err);
            }
        };

        fetchProducts();
    }, []);

    const categorizedProducts = useMemo(() => {
        return {
            topChoose: productData.filter(product =>
                product.top === 1
            ),
            disposableVape: productData.filter(product =>
                product.category_name?.toLowerCase().includes('disposable')

            ),
            myle: productData.filter(product =>
                product.category_name?.toLowerCase().includes('myle')
            ),
            heetsTerea: productData.filter(product =>
                product.category_name?.toLowerCase().includes('Heets and Terea') ||
                product.category_name?.toLowerCase().includes('heets and terea') ||
                product.category_name?.toLowerCase().includes('HeetsTerea') ||
                product.category_name?.toLowerCase().includes('Heets and Terea')

            ),
            nicotinePouches: productData.filter(product =>
                product.category_name?.toLowerCase().includes('Nicotine Pouches') ||
                product.category_name?.toLowerCase().includes('nicotine pouches') ||
                product.category_name?.toLowerCase().includes('nicotinepouches') ||
                product.category_name?.toLowerCase().includes('NicotinePouches')

            ),
            iqosIluma: productData.filter(product =>
                product.category_name?.toLowerCase().includes('iqos') ||
                product.category_name?.toLowerCase().includes('iluma') ||
                product.category_name?.toLowerCase().includes('IQOS') ||
                product.category_name?.toLowerCase().includes('IQOS Iluma') ||
                product.category_name?.toLowerCase().includes('iqos and iluma') ||
                product.category_name?.toLowerCase().includes('Iqos and Iluma')

            ),
            podsSystem: productData.filter(product =>
                product.category_name?.toLowerCase().includes('pods') ||
                product.category_name?.toLowerCase().includes('system') ||
                product.category_name?.toLowerCase().includes('pods system') ||
                product.category_name?.toLowerCase().includes('Juul and Pods System') ||
                product.category_name?.toLowerCase().includes('juul and pods system') ||
                product.category_name?.toLowerCase().includes('juul pods system')

            )
        };
    }, [productData]);
    //console.log(categorizedProducts.eJuice);

    const handleSeeMoreTopChoose = () =>
        setVisibleCountTopChoose((prev) => prev + 8);

    const handleSeeMoreEJuice = () => setVisibleCountEJuice((prev) => prev + 8);

    const handleSeeMoreMyle = () => setVisibleCountMyle((prev) => prev + 8);

    const handleSeeMorePodsSystem = () =>
        setVisibleCountPodsSystem((prev) => prev + 8);

    const handleSeeMoreDisposableVape = () =>
        setVisibleCountDisposableVape((prev) => prev + 8);

    const handleSeeMoreNicotinePouches = () =>
        setVisibleNicotinePouches((prev) => prev + 8);

    const handleSeeMoreIQOSIluma = () =>
        setVisibleCountIQOSIluma((prev) => prev + 8);
    const sections = [
        {
            title: "Top Choose in Dubai",
            products: categorizedProducts.topChoose,
            visibleCount: visibleCountTopChoose,
            handleSeeMore: handleSeeMoreTopChoose,

        },
        {
            title: "DISPOSABLE VAPE",
            products: categorizedProducts.disposableVape,
            visibleCount: visibleCountDisposableVape,
            handleSeeMore: handleSeeMoreDisposableVape,
            Link: "/disposable/"
        },
        {
            title: "MYLE",
            products: categorizedProducts.myle,
            visibleCount: visibleCountMyle,
            handleSeeMore: handleSeeMoreMyle,
            Link: "/myle/"

        },
        {
            title: "HEETS & TEREA",
            products: categorizedProducts.heetsTerea,
            visibleCount: visibleCountEJuice,
            handleSeeMore: handleSeeMoreEJuice,
            Link: "/heets-and-terea/"
        },
        {
            title: "Nicotine Pouches",
            products: categorizedProducts.nicotinePouches,
            visibleCount: visibleNicotinePouches,
            handleSeeMore: handleSeeMoreNicotinePouches,
            Link: "/nicotine-pouches/"
        },
        {
            title: "IQOS Iluma",
            products: categorizedProducts.iqosIluma,
            visibleCount: visibleCountIQOSIluma,
            handleSeeMore: handleSeeMoreIQOSIluma,
            Link: "/iqos-iluma/"
        },
        {
            title: "Juul & Pods System",
            products: categorizedProducts.podsSystem,
            visibleCount: visibleCountPodsSystem,
            handleSeeMore: handleSeeMorePodsSystem,
            Link: "/juul/"
        },
    ];

    return (
        <div className="max-w-8xl mx-auto">
            {sections.map((section, index) => (
                <div key={index} className="py-5 mb-5">
                    <h2 className="text-4xl text-white dark:text-gray-100 text-center my-6 font-bold bg-stone-950 dark:bg-gray-900 py-8">
                        {section.title}
                    </h2>
                    <div className="px-4 md:px-8 lg:px-12 py-6">
                        {section.products.length > 0 ? (
                            <>
                                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-6 lg:gap-8 auto-rows-fr">
                                    {section.products.slice(0, section.visibleCount).map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>

                                {section.visibleCount < section.products.length && (
                                    <div className="flex justify-center mt-6">
                                        {
                                            section.title == "Top Choose in Dubai" ?

                                                <>

                                                    <button
                                                        onClick={section.handleSeeMore}
                                                        className="px-6 py-2 bgColor dark:bg-sky-900 cursor-pointer text-white font-semibold rounded hover:bg-gray-300 dark:hover:bg-gray-700 transition"
                                                        aria-label="See More Products"
                                                    >
                                                        See More Products ({section.products.length - section.visibleCount} more)
                                                    </button>
                                                </>
                                                :
                                                <>
                                                    <Link href={section.Link}>
                                                        <button
                                                            className="px-6 py-2 bgColor dark:bg-sky-900 cursor-pointer text-white font-semibold rounded hover:bg-gray-300 dark:hover:bg-gray-700 transition"
                                                            aria-label="See More Products"
                                                        >
                                                            See More Products ({section.products.length - section.visibleCount} more)
                                                        </button>
                                                    </Link></>

                                        }

                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                <p>Coming Soon</p>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}