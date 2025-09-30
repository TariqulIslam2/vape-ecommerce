"use client"
import React, { useEffect, useState } from 'react';
import { Printer, Eye, Calendar, Package, DollarSign, Tag, Users, Star } from 'lucide-react';

import { useParams } from 'next/navigation';

const AdminProductReceipt = () => {
    const { id } = useParams();
    // console.log("id", id);
    // Sample product data - replace with your actual data from database

    const [productData, setproductData] = useState({});
    // console.log("productData", productData);
    useEffect(() => {
        const fetchSingleProduct = async () => {
            const res = await fetch(`/api/products/${id}`);
            const data = await res.json();
            // console.log("data", data);
            setproductData(data);
        };
        fetchSingleProduct();
    }, [id]);

    // const handlePrint = () => {
    //     window.print();
    // };

    const [isMounted, setIsMounted] = useState(false);
    const [currentDate, setCurrentDate] = useState("");
    const [currentTime, setCurrentTime] = useState("");

    useEffect(() => {
        setIsMounted(true);
        setCurrentDate(new Date().toLocaleDateString());
        setCurrentTime(new Date().toLocaleTimeString());
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-2 sm:p-4">
            {/* Print Controls - Hidden in print */}
            <div className="max-w-6xl mx-auto mb-4 sm:mb-6 print:hidden">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3 sm:p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">Product Information</h1>
                    <div className="flex space-x-3 w-full sm:w-auto">
                        <button
                            // onClick={handlePrint}
                            className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base flex-1 sm:flex-initial"
                        >
                            <Printer className="w-4 h-4" />
                            <span>Print Receipt</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Receipt Content */}
            <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 shadow-lg print:shadow-none print:max-w-none rounded-lg sm:rounded-none">
                {/* Header */}
                <div className="border-b-2 border-gray-300 dark:border-gray-700 p-4 sm:p-6 lg:p-8 print:p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start space-y-4 sm:space-y-0">
                        <div className="w-full sm:w-auto">
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">PRODUCT INFORMATION</h1>
                            <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">Admin Product Entry</p>
                        </div>
                        <div className="text-left sm:text-right text-sm text-gray-600 dark:text-gray-300 w-full sm:w-auto bg-gray-50 dark:bg-gray-900 sm:bg-transparent p-3 sm:p-0 rounded-lg sm:rounded-none">
                            <p><strong>Generated:</strong> {isMounted ? currentDate : "-"}</p>
                            <p><strong>Time:</strong> {isMounted ? currentTime : "-"}</p>
                            <p><strong>Receipt ID:</strong> RCP-{productData.id}</p>
                        </div>
                    </div>
                </div>

                {/* Product Basic Information */}
                <div className="p-4 sm:p-6 lg:p-8 print:p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                        <Package className="w-5 sm:w-6 h-5 sm:h-6 text-blue-600" />
                        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">Basic Product Information</h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                        <div className="space-y-3 sm:space-y-4">
                            <div className="flex flex-col sm:flex-row sm:justify-between border-b border-gray-100 dark:border-gray-700 pb-2 space-y-1 sm:space-y-0">
                                <span className="font-medium text-gray-700 dark:text-gray-200 text-sm sm:text-base">Product ID:</span>
                                <span className="text-gray-900 dark:text-gray-100 font-mono text-sm sm:text-base break-all">{productData.id}</span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:justify-between border-b border-gray-100 dark:border-gray-700 pb-2 space-y-1 sm:space-y-0">
                                <span className="font-medium text-gray-700 dark:text-gray-200 text-sm sm:text-base">Product Name:</span>
                                <span className="text-gray-900 dark:text-gray-100 font-semibold text-sm sm:text-base break-words">{productData.product_name}</span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:justify-between border-b border-gray-100 dark:border-gray-700 pb-2 space-y-1 sm:space-y-0">
                                <span className="font-medium text-gray-700 dark:text-gray-200 text-sm sm:text-base">Category :</span>
                                <span className="text-gray-900 dark:text-gray-100 font-mono text-sm sm:text-base">{productData.category_name}</span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:justify-between border-b border-gray-100 dark:border-gray-700 pb-2 space-y-1 sm:space-y-0">
                                <span className="font-medium text-gray-700 dark:text-gray-200 text-sm sm:text-base">Brand:</span>
                                <span className="text-gray-900 dark:text-gray-100 text-sm sm:text-base break-words">{productData.brand}</span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:justify-between border-b border-gray-100 dark:border-gray-700 pb-2 space-y-1 sm:space-y-0">
                                <span className="font-medium text-gray-700 dark:text-gray-200 text-sm sm:text-base">Slug:</span>
                                <span className="text-gray-900 dark:text-gray-100 text-sm sm:text-base break-words">{productData.slug}</span>
                            </div>
                        </div>

                        <div className="space-y-3 sm:space-y-4">
                            <div className="flex flex-col sm:flex-row sm:justify-between border-b border-gray-100 dark:border-gray-700 pb-2 space-y-1 sm:space-y-0">
                                <span className="font-medium text-gray-700 dark:text-gray-200 text-sm sm:text-base">Status:</span>
                                <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium w-fit ${productData.status === 1
                                    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                                    : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                                    }`}>
                                    {productData.status === 1 ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:justify-between border-b border-gray-100 dark:border-gray-700 pb-2 space-y-1 sm:space-y-0">
                                <span className="font-medium text-gray-700 dark:text-gray-200 text-sm sm:text-base">Published:</span>
                                <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium w-fit ${productData.published
                                    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                                    : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                                    }`}>
                                    {productData.published ? 'YES' : 'NO'}
                                </span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:justify-between border-b border-gray-100 dark:border-gray-700 pb-2 space-y-1 sm:space-y-0">
                                <span className="font-medium text-gray-700 dark:text-gray-200 text-sm sm:text-base">Stock Quantity:</span>
                                <span className="text-gray-900 dark:text-gray-100 font-semibold text-sm sm:text-base">{productData.stock} units</span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:justify-between border-b border-gray-100 dark:border-gray-700 pb-2 space-y-1 sm:space-y-0">
                                <span className="font-medium text-gray-700 dark:text-gray-200 text-sm sm:text-base">Review Rating:</span>
                                <div className="flex items-center space-x-1">
                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    <span className="text-gray-900 dark:text-gray-100 font-semibold text-sm sm:text-base">{productData.review}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pricing Information */}
                <div className="p-4 sm:p-6 lg:p-8 print:p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                        <DollarSign className="w-5 sm:w-6 h-5 sm:h-6 text-green-600" />
                        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">Pricing Information</h2>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                        <div className="bg-blue-50 dark:bg-blue-900 p-3 sm:p-4 rounded-lg">
                            <p className="text-xs sm:text-sm text-blue-600 dark:text-blue-200 font-medium mb-1">Single Price</p>
                            <p className="text-lg sm:text-2xl font-bold text-blue-900 dark:text-blue-100 break-all">{productData.single_price} AED</p>
                        </div>
                        <div className="bg-green-50 dark:bg-green-900 p-3 sm:p-4 rounded-lg">
                            <p className="text-xs sm:text-sm text-green-600 dark:text-green-200 font-medium mb-1">Sale Price</p>
                            <p className="text-lg sm:text-2xl font-bold text-green-900 dark:text-green-100 break-all">{productData.sale_price} AED</p>
                        </div>
                        <div className="bg-purple-50 dark:bg-purple-900 p-3 sm:p-4 rounded-lg">
                            <p className="text-xs sm:text-sm text-purple-600 dark:text-purple-200 font-medium mb-1">Box Price</p>
                            <p className="text-lg sm:text-2xl font-bold text-purple-900 dark:text-purple-100 break-all">{productData.box_price} AED</p>
                        </div>
                        <div className="bg-red-50 dark:bg-red-900 p-3 sm:p-4 rounded-lg">
                            <p className="text-xs sm:text-sm text-red-600 dark:text-red-200 font-medium mb-1">Discount</p>
                            <p className="text-lg sm:text-2xl font-bold text-red-900 dark:text-red-100">{productData.discount}%</p>
                        </div>
                    </div>
                </div>

                {/* Product Details */}
                <div className="p-4 sm:p-6 lg:p-8 print:p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                        <Tag className="w-5 sm:w-6 h-5 sm:h-6 text-purple-600" />
                        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">Product Details</h2>
                    </div>

                    <div className="space-y-4 sm:space-y-6">
                        <div>
                            <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-2 text-sm sm:text-base">Description:</h3>
                            <div
                                className="text-gray-600 dark:text-gray-300 leading-relaxed border-l-4 border-blue-200 dark:border-blue-700 pl-3 sm:pl-4 py-2 bg-blue-50 dark:bg-blue-900 prose prose-sm max-w-none text-sm sm:text-base"
                                dangerouslySetInnerHTML={{ __html: productData.description }}
                                style={{
                                    '--tw-prose-headings': 'rgb(55 65 81)',
                                    '--tw-prose-body': 'rgb(75 85 99)',
                                    '--tw-prose-bold': 'rgb(31 41 55)',
                                    '--tw-prose-links': 'rgb(59 130 246)'
                                }}
                            />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                            {/* Available Flavors */}
                            {productData.flavors && (
                                <div>
                                    <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-3 flex items-center text-sm sm:text-base">
                                        <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                                        Available Flavors:
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {(() => {
                                            let flavors = [];

                                            try {
                                                flavors = (productData?.flavors.split(','))
                                                // console.log("flavors", flavors);
                                            } catch (e) {
                                                flavors = [];
                                            }

                                            return flavors.map((flavor, index) => (
                                                <span
                                                    key={index}
                                                    className="px-2 sm:px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 text-purple-800 dark:text-purple-200 rounded-full text-xs sm:text-sm font-medium border border-purple-200 dark:border-purple-700 break-words"
                                                >
                                                    {flavor}
                                                </span>
                                            ));
                                        })()}
                                    </div>
                                </div>
                            )}
                            {/* Special Offers */}
                            {productData.offers && (
                                <div>
                                    <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-3 flex items-center text-sm sm:text-base">
                                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                        Special Offers:
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {(() => {
                                            let offers = [];

                                            try {
                                                offers = (productData?.offers.split(','))
                                                //console.log("offers", offers);
                                            } catch (e) {
                                                offers = [];
                                            }

                                            return offers.map((offer, index) => (
                                                <span
                                                    key={index}
                                                    className="px-2 sm:px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900 text-green-800 dark:text-green-200 rounded-full text-xs sm:text-sm font-medium border border-green-200 dark:border-green-700 flex items-center break-words"
                                                >
                                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 flex-shrink-0"></span>
                                                    {offer}
                                                </span>
                                            ));
                                        })()}
                                    </div>
                                </div>
                            )}
                            {/* Colors */}
                            {productData.colors && (
                                <div>
                                    <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-3 flex items-center text-sm sm:text-base">
                                        <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                                        Colors:
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {(() => {
                                            let colors = [];

                                            try {
                                                colors = (productData?.colors.split(','))
                                                //console.log("colors", colors);
                                            } catch (e) {
                                                colors = [];
                                            }

                                            return colors.map((color, index) => (
                                                <span
                                                    key={index}
                                                    className="px-2 sm:px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900 text-green-800 dark:text-green-200 rounded-full text-xs sm:text-sm font-medium border border-green-200 dark:border-green-700 flex items-center break-words"
                                                >
                                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 flex-shrink-0"></span>
                                                    {color}
                                                </span>
                                            ));
                                        })()}
                                    </div>
                                </div>
                            )}
                            {/* nicotine */}
                            {productData.nicotines && (
                                <div>
                                    <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-3 flex items-center text-sm sm:text-base">
                                        <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                                        Nicotine:
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {(() => {
                                            let nicotines = [];
                                            try {
                                                nicotines = (productData?.nicotines.split(','))
                                                //console.log("nicotines", nicotines);
                                            } catch (e) {
                                                nicotines = [];
                                            }
                                            return nicotines.map((nicotine, index) => (
                                                <span
                                                    key={index}
                                                    className="px-2 sm:px-3 py-1 bg-gradient-to-r from-orange-100 to-orange-200 dark:from-orange-900 dark:to-orange-800 text-orange-800 dark:text-orange-200 rounded-full text-xs sm:text-sm font-medium border border-orange-200 dark:border-orange-700 flex items-center break-words"
                                                >
                                                    {nicotine}
                                                </span>
                                            ));
                                        })()}
                                    </div>
                                </div>
                            )}

                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                            <div>
                                <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-3 flex items-center text-sm sm:text-base">
                                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                    Keywords:
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {(() => {
                                        let keywords = [];

                                        try {
                                            keywords = (productData?.keywords.split(','))
                                            //console.log("keywords", keywords);
                                        } catch (e) {
                                            keywords = [];
                                        }

                                        return keywords.map((keyword, index) => (
                                            <span
                                                key={index}
                                                className="px-2 sm:px-3 py-1 bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900 dark:to-cyan-900 text-blue-800 dark:text-blue-200 rounded-full text-xs sm:text-sm font-medium border border-blue-200 dark:border-blue-700 flex items-center break-words"
                                            >
                                                <span className="text-blue-500 dark:text-blue-300 mr-1 flex-shrink-0">#</span>
                                                {keyword}
                                            </span>
                                        ));
                                    })()}
                                </div>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-3 flex items-center text-sm sm:text-base">
                                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                                    Tags:
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {(() => {
                                        let tags = [];

                                        try {
                                            tags = (productData?.tags.split(','))
                                            //console.log("tags", tags);
                                        } catch (e) {
                                            tags = [];
                                        }

                                        return tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="px-2 sm:px-3 py-1 bg-gradient-to-r from-orange-100 to-yellow-100 dark:from-orange-900 dark:to-yellow-900 text-orange-800 dark:text-orange-200 rounded-full text-xs sm:text-sm font-medium border border-orange-200 dark:border-orange-700 flex items-center break-words"
                                            >
                                                <Tag className="w-3 h-3 mr-1 flex-shrink-0" />
                                                {tag}
                                            </span>
                                        ));
                                    })()}
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-3 flex items-center text-sm sm:text-base">
                                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                Images:
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {productData?.images?.map((image, index) => (
                                    <img key={index} src={image} loading="eager"
                                        fetchpriority="high"
                                        decoding="async" alt={`Image ${index + 1}`} className="w-60 h-60 object-cover" />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 sm:p-6 lg:p-8 print:p-6 bg-gray-50 dark:bg-gray-900 rounded-b-lg sm:rounded-b-none">
                    <div className="text-center text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                        <p className="mb-2"><strong>Product Entry Summary</strong></p>
                        <p className="mb-1">This receipt contains all product information as entered in the database.</p>
                        <p className="mb-2">Generated on {isMounted ? currentDate : "-"} at {isMounted ? currentTime : "-"}</p>
                        <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-700">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                For any discrepancies or updates, please contact the database administrator.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminProductReceipt;