// app/blog/page.js (App Router) or pages/blog.js (Pages Router)
export const dynamic = "force-dynamic"; // always SSR, no cache
export const revalidate = 0; // never cache

import { executeQuery } from '@/lib/db';
import Link from 'next/link';

// Metadata for SEO
export const metadata = {
    title: 'Blog',
    description: 'Discover the latest vaping news, product reviews, tips, and insights from Vape Marina UAE. Stay updated with industry trends and expert advice.',
    keywords: 'vape blog, vaping news, vape reviews, vaping tips, e-cigarette blog, UAE vape shop, Vape Marina blog',
    openGraph: {
        title: 'Blog - Latest Vaping News, Tips & Reviews',
        description: 'Discover the latest vaping news, product reviews, tips, and insights from Vape Marina UAE. Stay updated with industry trends and expert advice.',
        type: 'website',
        url: 'https://vapemarina.ae/blog',
        images: [
            {
                url: 'https://vapemarina.ae/Vape-Marina-1.png',
                width: 1200,
                height: 630,
                alt: 'Vape Marina Blog',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Blog - Latest Vaping News, Tips & Reviews',
        description: 'Discover the latest vaping news, product reviews, tips, and insights from Vape Marina UAE.',
        images: ['https://vapemarina.ae/Vape-Marina-1.png'],
    },
    alternates: {
        canonical: 'https://vapemarina.ae/blog',
    },
};

// Server Component for fetching data
async function getBlogPosts(page = 1, limit = 9) {
    try {
        const offset = (page - 1) * limit;

        // Get total count
        const countResult = await executeQuery(
            "SELECT COUNT(*) as total FROM blog_posts WHERE published = 1"
        );
        const totalPosts = countResult[0]?.total || 0;

        // Get paginated posts with category information using MySQL-compatible LIMIT syntax
        const posts = await executeQuery(`
            SELECT 
                bp.id,
                bp.title,
                bp.excerpt,
                bp.slug,
                bp.content,
                bp.image,
                bp.published_date,
                bp.updated_at,
                c.name AS category_name
            FROM blog_posts bp
            LEFT JOIN categories c ON bp.category = c.id
            WHERE bp.published = 1
            ORDER BY bp.published_date DESC
            
        `, []);
        // console.log("posts--------------------------", posts);
        return {
            posts: posts || [],
            totalPosts,
            totalPages: Math.ceil(totalPosts / limit),
            currentPage: page
        };
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        return {
            posts: [],
            totalPosts: 0,
            totalPages: 0,
            currentPage: page
        };
    }
}

// Format date function
function formatDate(dateString) {
    if (!dateString) return '';

    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';

        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch (error) {
        console.error('Error formatting date:', error);
        return '';
    }
}

// Pagination Component
function Pagination({ currentPage, totalPages, baseUrl = '/blog' }) {
    const getPaginationNumbers = () => {
        const delta = 2;
        const range = [];
        const rangeWithDots = [];

        for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
            range.push(i);
        }

        if (currentPage - delta > 2) {
            rangeWithDots.push(1, '...');
        } else {
            rangeWithDots.push(1);
        }

        rangeWithDots.push(...range);

        if (currentPage + delta < totalPages - 1) {
            rangeWithDots.push('...', totalPages);
        } else if (totalPages > 1) {
            rangeWithDots.push(totalPages);
        }

        return rangeWithDots;
    };

    if (totalPages <= 1) return null;

    return (
        <div className="flex justify-center items-center mt-12 gap-2 flex-wrap">
            {/* Previous button */}
            {currentPage > 1 ? (
                <Link
                    aria-label="Previous Page"
                    href={`${baseUrl}?page=${currentPage - 1}`}
                    className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg text-gray-600 hover:bg-[#2b5a6c] hover:text-white hover:border-[#2b5a6c] transition-all duration-300 shadow-sm"
                >
                    ←
                </Link>
            ) : (
                <span className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-lg text-gray-400 cursor-not-allowed">
                    ←
                </span>
            )}

            {/* Page numbers */}
            {getPaginationNumbers().map((page, index) => (
                <span key={index}>
                    {page === '...' ? (
                        <span className="w-10 h-10 flex items-center justify-center text-gray-400">
                            ...
                        </span>
                    ) : (
                        <Link
                            aria-label="Page Number"
                            href={currentPage === page ? '#' : `${baseUrl}?page=${page}`}
                            className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-300 shadow-sm ${currentPage === page
                                ? 'bg-[#2b5a6c] text-white border-[#2b5a6c]'
                                : 'border border-gray-300 text-gray-600 hover:bg-[#2b5a6c] hover:text-white hover:border-[#2b5a6c]'
                                }`}

                        >
                            {page}
                        </Link>
                    )}
                </span>
            ))}

            {/* Next button */}
            {currentPage < totalPages ? (
                <Link
                    aria-label="Next Page"
                    href={`${baseUrl}?page=${currentPage + 1}`}
                    className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg text-gray-600 hover:bg-[#2b5a6c] hover:text-white hover:border-[#2b5a6c] transition-all duration-300 shadow-sm"
                >
                    →
                </Link>
            ) : (
                <span className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-lg text-gray-400 cursor-not-allowed">
                    →
                </span>
            )}
        </div>
    );
}

// Main Blog Page Component
export default async function BlogPage({ searchParams }) {
    const params = await searchParams;
    const page = parseInt(params?.page) || 1;
    const { posts, totalPosts, totalPages, currentPage } = await getBlogPosts(page);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Hero Section */}
            <div className="bg-[#2b5a6c] text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[#2b5a6c] to-[#1e4a5a] opacity-90"></div>
                <div className="relative max-w-7xl mx-auto px-6 pt-15 pb-5">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
                            Vape Marina Blog
                        </h1>
                        <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                            Discover the latest vaping news, product reviews, tips, and insights from the UAE's premier vape shop
                        </p>
                        <div className="mt-8 flex justify-center">
                            <div className="w-24 h-1 bg-white rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-5">
                {/* Posts Count */}

                {/* Blog grid */}
                {posts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {posts.map((post) => (
                            <article
                                key={post.id}
                                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-2xl transition-all duration-500 group transform hover:-translate-y-2"
                            >
                                {/* Image */}
                                <div className="relative overflow-hidden h-56">
                                    {post.image ? (
                                        <img
                                            src={post.image}
                                            alt={post.title}
                                            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                                            loading="eager"
                                            fetchpriority="high"
                                            decoding="async"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-[#2b5a6c] to-[#1e4a5a] flex items-center justify-center">
                                            <svg className="w-16 h-16 text-white opacity-50" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"></path>
                                            </svg>
                                        </div>
                                    )}
                                    {/* Category Badge */}
                                    {post.category_name && (
                                        <div className="absolute top-4 left-4">
                                            <span className="bg-[#2b5a6c] text-white px-4 py-2 rounded-full text-xs font-semibold shadow-lg">
                                                {post.category_name}
                                            </span>
                                        </div>
                                    )}
                                    {/* Overlay on hover */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>

                                {/* Content */}
                                <div className="p-8">
                                    {/* Date */}
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex items-center">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        {formatDate(post.published_date)}
                                    </p>

                                    {/* Title */}
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 line-clamp-2 group-hover:text-[#2b5a6c] dark:group-hover:text-[#4a7c8e] transition-colors duration-300">
                                        <Link href={`/blog/${post.slug}`} aria-label={post.title} className="hover:underline">
                                            {post.title}
                                        </Link>
                                    </h2>

                                    {/* Excerpt */}
                                    {post.excerpt && (
                                        <p className="text-gray-600 dark:text-gray-300 line-clamp-3 mb-6 leading-relaxed">
                                            {post.excerpt}
                                        </p>
                                    )}

                                    {/* Read More */}
                                    <Link
                                        href={`/blog/${post.slug}`}
                                        className="inline-flex items-center text-[#2b5a6c] dark:text-[#4a7c8e] hover:text-[#1e4a5a] dark:hover:text-[#2b5a6c] font-semibold transition-colors duration-300 group/readmore"
                                        aria-label="Read More"
                                    >
                                        Read More
                                        <svg className="w-4 h-4 ml-2 transform group-hover/readmore:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="max-w-md mx-auto">
                            <div className="w-24 h-24 bg-[#2b5a6c] rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No blog posts found</h3>
                            <p className="text-gray-600 dark:text-gray-400">Check back soon for new articles and updates.</p>
                        </div>
                    </div>
                )}
                {totalPosts > 0 && (
                    <div className="text-end mb-5">
                        <p className="text-gray-600 dark:text-gray-400 text-md bg-white dark:bg-gray-800 px-6 py-3  inline-block">
                            Showing <span className="font-semibold text-[#2b5a6c]">{((currentPage - 1) * 9) + 1}</span> - <span className="font-semibold text-[#2b5a6c]">{Math.min(currentPage * 9, totalPosts)}</span> of <span className="font-semibold text-[#2b5a6c]">{totalPosts}</span> articles
                        </p>
                    </div>
                )}


                {/* Pagination */}
                <Pagination currentPage={currentPage} totalPages={totalPages} />

                {/* Page info */}
                {totalPages > 1 && (
                    <div className="text-center mt-6 text-sm text-gray-600 dark:text-gray-400">
                        Page {currentPage} of {totalPages}
                    </div>
                )}
            </div>
        </div>
    );
}