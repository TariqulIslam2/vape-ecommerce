'use client';
import { useState, useEffect } from "react";
import { FaFilter, FaChevronDown } from "react-icons/fa";
import { motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";

const ProductFilter = ({ initialProducts, category, searchTerm = "" }) => {
    const [showFilter, setShowFilter] = useState(false);
    const [productData, setProductData] = useState(initialProducts);
    const [sortOption, setSortOption] = useState("newest");
    const [minVal, setMinVal] = useState(0);
    const [maxVal, setMaxVal] = useState(3000);
    const minLimit = 0;
    const maxLimit = 3000;
    const gap = 10;

    // Initialize with searchTerm
    const [search, setSearch] = useState(searchTerm);

    // Update when searchTerm prop changes
    useEffect(() => {
        setSearch(searchTerm);
    }, [searchTerm]);

    const filteredProducts = productData
        ?.filter((product) => {
            const matchesPrice = product.single_price >= minVal && product.single_price <= maxVal;

            // Only apply search filter if search term exists
            if (search) {
                // Safe keyword/tag parsing
                let keywords = [];
                if (product.keywords) {
                    try {
                        keywords = Array.isArray(product.keywords)
                            ? product.keywords
                            : JSON.parse(product.keywords);
                    } catch {
                        keywords = [product.keywords];
                    }
                }

                let tags = [];
                if (product.tags) {
                    try {
                        tags = Array.isArray(product.tags)
                            ? product.tags
                            : JSON.parse(product.tags);
                    } catch {
                        tags = [product.tags];
                    }
                }

                const matchesSearch = (
                    product.product_name?.toLowerCase().includes(search) ||
                    (product.brand?.toLowerCase().includes(search) || false) ||
                    keywords.some(k => k?.toLowerCase().includes(search)) ||
                    tags.some(t => t?.toLowerCase().includes(search))
                );

                return matchesPrice && matchesSearch;
            }

            // If no search term, only match by price
            return matchesPrice;
        })
        .sort((a, b) => {
            if (sortOption === "lowToHigh") return a.single_price - b.single_price;
            if (sortOption === "highToLow") return b.single_price - a.single_price;
            if (sortOption === "newest") return new Date(b.create_date) - new Date(a.create_date);
            if (sortOption === "oldest") return new Date(a.create_date) - new Date(b.create_date);
            return 0;
        });

    const handleMinChange = (e) => {
        let value = Number(e.target.value);
        if (value < minLimit) value = minLimit;
        if (value > maxLimit) value = maxLimit;
        if (value > maxVal - gap) {
            setMaxVal(Math.min(value + gap, maxLimit));
        }
        setMinVal(value);
    };

    const handleMaxChange = (e) => {
        let value = Number(e.target.value);
        if (value < minLimit) value = minLimit;
        if (value > maxLimit) value = maxLimit;
        if (value < minVal + gap) {
            setMinVal(Math.max(value - gap, minLimit));
        }
        setMaxVal(value);
    };

    return (
        <div className="mx-auto mt-8 p-4 flex flex-col md:flex-row">
            {/* Mobile Filter Toggle */}
            <div className="md:hidden mb-4">
                <button
                    aria-label="Filter"
                    onClick={() => setShowFilter(!showFilter)}
                    className="flex items-center gap-2 text-base font-semibold text-gray-700 border border-gray-300 bg-white px-5 py-2.5 rounded-xl shadow-sm hover:bg-gray-100 hover:shadow-md transition-all duration-200"
                >
                    <FaFilter className="text-gray-500" /> Filter
                </button>
            </div>

            {/* Sidebar */}
            <aside
                className={`w-full md:w-1/4 md:block ${showFilter ? "block" : "hidden"} md:pr-6 space-y-6`}
            >
                <div className="wrapper">
                    <div className="header-range">
                        <h2>Price Range</h2>
                        <p>Use slider or enter min and max price</p>
                    </div>

                    <div className="price-input">
                        <div className="field">
                            <span>Min</span>
                            <input
                                type="number"
                                value={minVal}
                                onChange={handleMinChange}
                                min={minLimit}
                                max={maxLimit}
                            />
                        </div>
                        <div className="separator">-</div>
                        <div className="field">
                            <span>Max</span>
                            <input
                                type="number"
                                value={maxVal}
                                onChange={handleMaxChange}
                                min={minLimit}
                                max={maxLimit}
                            />
                        </div>
                    </div>

                    <div className="slider">
                        <div
                            className="progress"
                            style={{
                                left: `${(minVal / maxLimit) * 100}%`,
                                width: `${((maxVal - minVal) / maxLimit) * 100}%`,
                            }}
                        />
                    </div>

                    <div className="range-input">
                        <input
                            type="range"
                            min={minLimit}
                            max={maxLimit}
                            value={minVal}
                            step={10}
                            onChange={handleMinChange}
                        />
                        <input
                            type="range"
                            min={minLimit}
                            max={maxLimit}
                            value={maxVal}
                            step={10}
                            onChange={handleMaxChange}
                        />
                    </div>
                </div>
            </aside>

            {/* Product Grid */}
            <main className="w-full md:w-3/4">
                <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
                    <h1 className="text-xl font-bold">
                        {category} <span className="text-sm font-normal text-gray-500">
                            ({filteredProducts?.length} products)
                        </span>
                    </h1>

                    <div className="flex gap-4 items-center">
                        <div className="relative">
                            <select
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value)}
                                className="border border-gray-300 rounded px-4 py-2 pr-8 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                                aria-label="Sort"
                            >
                                <option value="newest">Date, new to old</option>
                                <option value="oldest">Date, old to new</option>
                                <option value="lowToHigh">Price: Low to High</option>
                                <option value="highToLow">Price: High to Low</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-label="Sort"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M19 9l-7 7-7-7"
                                    ></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>


                {/* Product Grid */}
                {filteredProducts?.length === 0 ? (
                    <div className="text-center py-10">
                        {/* <h3 className="text-lg font-medium">No products found</h3>
                        <p className="text-gray-500">Try adjusting your filters</p> */}
                    </div>
                ) : (
                    <div className={`grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 md:gap-6 lg:gap-8 auto-rows-fr`}>
                        {filteredProducts?.map((product) => (
                            <motion.div
                                key={product.id}
                                className="product-card-wrapper"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                                aria-label="Product"
                            >
                                <ProductCard product={product} />
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default ProductFilter;