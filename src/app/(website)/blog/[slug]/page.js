export const dynamic = "force-dynamic"; // always SSR, no cache
export const revalidate = 0; // never cache

import { executeQuery } from '@/lib/db';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// Generate metadata for SEO
export async function generateMetadata({ params }) {
    try {
        const { slug } = await params;

        const post = await executeQuery(`
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
            WHERE bp.slug = ? AND bp.published = 1
        `, [slug]);

        if (!post || post.length === 0) {
            return {
                title: 'Blog Post Not Found',
                description: 'The requested blog post could not be found.',
            };
        }

        const blogPost = post[0];
        const imageUrl = blogPost.image || '/Vape-Marina-1.png';
        const fullImageUrl = imageUrl.startsWith('http') ? imageUrl : `https://vapemarina.ae${imageUrl}`;

        return {
            title: blogPost.title,
            description: blogPost.excerpt || `Read our latest article about ${blogPost.title} on Vape Marina UAE blog.`,
            keywords: `vape blog, ${blogPost.category_name || 'vaping'}, ${blogPost.title}, Vape Marina UAE`,
            openGraph: {
                title: blogPost.title,
                description: blogPost.excerpt || `Read our latest article about ${blogPost.title} on Vape Marina UAE blog.`,
                type: 'article',
                url: `https://vapemarina.ae/blog/${slug}`,
                images: [
                    {
                        url: fullImageUrl,
                        width: 1200,
                        height: 630,
                        alt: blogPost.title,
                    },
                ],
                publishedTime: blogPost.published_date,
                modifiedTime: blogPost.updated_at,
                authors: ['Vape Marina UAE'],
                section: blogPost.category_name || 'Vaping',
            },
            twitter: {
                card: 'summary_large_image',
                title: blogPost.title,
                description: blogPost.excerpt || `Read our latest article about ${blogPost.title} on Vape Marina UAE blog.`,
                images: [fullImageUrl],
            },
            alternates: {
                canonical: `https://vapemarina.ae/blog/${slug}`,
            },
        };
    } catch (error) {
        console.error('Error generating metadata:', error);
        return {
            title: 'Blog Post',
            description: 'Read our latest blog posts and articles about vaping.',
        };
    }
}

// Generate static params for better performance
export async function generateStaticParams() {
    try {
        const posts = await executeQuery(`
            SELECT slug FROM blog_posts 
            WHERE published = 1 
            ORDER BY published_date DESC 
    
        `);

        return posts.map((post) => ({
            slug: post.slug,
        }));
    } catch (error) {
        console.error('Error generating static params:', error);
        return [];
    }
}

// Server Component for fetching blog post data
async function getBlogPost(slug) {
    try {
        const post = await executeQuery(`
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
            WHERE bp.slug = ? AND bp.published = 1
        `, [slug]);

        if (!post || post.length === 0) {
            return null;
        }

        return post[0];
    } catch (error) {
        console.error('Error fetching blog post:', error);
        return null;
    }
}

// Get recent posts for sidebar
async function getRecentPosts(currentPostId, limit = 3) {
    try {
        const posts = (await executeQuery(`
    SELECT 
        bp.id,
        bp.title,
        bp.slug,
        bp.published_date
    FROM blog_posts bp
    WHERE bp.id != ? AND bp.published = 1
    ORDER BY bp.published_date DESC
`, [parseInt(currentPostId)])).slice(0, 10);

        return posts;
    } catch (error) {
        console.error('Error fetching recent posts:', error);
        return [];
    }
}

// Get next and previous posts for navigation
async function getNavigationPosts(currentPostId) {
    try {
        const [prevPost] = await executeQuery(`
            SELECT id, title, slug FROM blog_posts 
            WHERE id < ? AND published = 1 
            ORDER BY id DESC 
            LIMIT 1
        `, [currentPostId]);

        const [nextPost] = await executeQuery(`
            SELECT id, title, slug FROM blog_posts 
            WHERE id > ? AND published = 1 
            ORDER BY id ASC 
            LIMIT 1
        `, [currentPostId]);

        return { prevPost, nextPost };
    } catch (error) {
        console.error('Error fetching navigation posts:', error);
        return { prevPost: null, nextPost: null };
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

// Main Blog Detail Page Component
export default async function BlogDetailPage({ params }) {
    const { slug } = params;
    const post = await getBlogPost(slug);

    if (!post) {
        notFound();
    }

    // Get recent posts for sidebar
    const recentPosts = await getRecentPosts(post.id);

    // Get navigation posts
    const { prevPost, nextPost } = await getNavigationPosts(post.id);

    return (
        <div className="min-h-screen bg-white">
            {/* Header Section */}
            <div className="bg-white border-b border-gray-200 mt-16" >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    {/* Category Banner */}
                    <div className="mb-3">
                        <span className="inline-block bg-yellow-400 text-black px-3 py-1 text-xs font-bold uppercase tracking-wide">
                            {post.category_name || 'DISPOSABLE VAPE'}
                        </span>
                    </div>

                    {/* Main Title */}
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 leading-tight">
                        {post.title}
                    </h1>

                    {/* Author and Date */}
                    <div className="flex items-center text-gray-600 text-sm">
                        <span>Posted by vapeadmin On {formatDate(post.published_date)}</span>
                    </div>
                </div>
            </div>

            {/* Main Content Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Main Content - Left Column */}
                    <div className="lg:col-span-3">
                        {/* Featured Image */}
                        {post.image && (
                            <div className="mb-8">
                                <div className="relative h-80 md:h-96 rounded-lg overflow-hidden">
                                    <img
                                        src={post.image}
                                        alt={post.title}
                                        fill
                                        className="object-contain w-full h-full object-center dark:bg-gray-500 "
                                        loading="eager"
                                        fetchpriority="high"
                                        decoding="async"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 800px"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Article Content */}
                        <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-ul:text-gray-700 prose-li:text-gray-700">
                            <div
                                className="text-gray-700 leading-relaxed text-base"
                                dangerouslySetInnerHTML={{ __html: post.content }}
                            />
                        </div>

                        {/* Social Media Sharing */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <div className="flex items-center space-x-3">
                                <span className="text-gray-600 font-medium text-sm">Share:</span>
                                <a
                                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://vapmarina.ae/blog/${slug}`)}`}
                                    target="_blank"
                                    aria-label="Share on Facebook"
                                    rel="noopener noreferrer"
                                    className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                </a>
                                <a
                                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://vapemarina.com/blog/${slug}`)}`}
                                    target="_blank"
                                    aria-label="Share on Twitter"
                                    rel="noopener noreferrer"
                                    className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                    </svg>
                                </a>
                                <a
                                    href={`https://www.instagram.com/`}
                                    target="_blank"
                                    aria-label="Share on Instagram"
                                    rel="noopener noreferrer"
                                    className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center hover:from-purple-600 hover:to-pink-600 transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.418-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928.875 1.418 2.026 1.418 3.323s-.49 2.448-1.418 3.244c-.875.807-2.026 1.297-3.323 1.297zm7.83-9.781c-.49 0-.928-.175-1.297-.49-.368-.315-.49-.753-.49-1.243 0-.49.122-.928.49-1.243.369-.315.807-.49 1.297-.49s.928.175 1.297.49c.368.315.49.753.49 1.243 0 .49-.122.928-.49 1.243-.369.315-.807.49-1.297.49z" />
                                    </svg>
                                </a>
                                <a
                                    href={`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(`https://vapemarina.com/blog/${slug}`)}&description=${encodeURIComponent(post.title)}`}
                                    target="_blank"
                                    aria-label="Share on Pinterest"
                                    rel="noopener noreferrer"
                                    className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.418-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928.875 1.418 2.026 1.418 3.323s-.49 2.448-1.418 3.244c-.875.807-2.026 1.297-3.323 1.297zm7.83-9.781c-.49 0-.928-.175-1.297-.49-.368-.315-.49-.753-.49-1.243 0-.49.122-.928.49-1.243.369-.315.807-.49 1.297-.49s.928.175 1.297.49c.368.315.49.753.49 1.243 0 .49-.122.928-.49 1.243-.369.315-.807.49-1.297.49z" />
                                    </svg>
                                </a>
                                <a
                                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://vapemarina.com/blog/${slug}`)}`}
                                    target="_blank"
                                    aria-label="Share on LinkedIn"
                                    rel="noopener noreferrer"
                                    className="w-8 h-8 bg-blue-700 text-white rounded-full flex items-center justify-center hover:bg-blue-800 transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                        {/* Post Navigation */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                                {prevPost && (
                                    <Link
                                        href={`/blog/${prevPost.slug}`}
                                        className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                                        aria-label="Previous Post"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                        <div className="text-left">
                                            <div className="text-xs text-gray-500">Older</div>
                                            <div className="font-medium text-sm">{prevPost.title}</div>
                                        </div>
                                    </Link>
                                )}

                                <div className="flex-1 flex justify-center">
                                    <Link
                                        href="/blog"
                                        className="w-8 h-8 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                                        aria-label="Home"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                        </svg>
                                    </Link>
                                </div>

                                {nextPost && (
                                    <Link
                                        href={`/blog/${nextPost.slug}`}
                                        className="flex items-center text-blue-600 hover:text-blue-800 transition-colors text-right"
                                        aria-label="Next Post"
                                    >
                                        <div className="text-right">
                                            <div className="text-xs text-gray-500">Newer</div>
                                            <div className="font-medium text-sm">{nextPost.title}</div>
                                        </div>
                                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Comment Section */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Leave a Reply</h3>
                            <p className="text-gray-600 mb-6 text-sm">
                                Your email address will not be published. Required fields are marked *
                            </p>
                            <form className="space-y-4">
                                <div>
                                    <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                                        Comment *
                                    </label>
                                    <textarea
                                        id="comment"
                                        rows={6}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                        placeholder="Write your comment here..."
                                        required
                                    ></textarea>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                            Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                                        Website
                                    </label>
                                    <input
                                        type="url"
                                        id="website"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    />
                                </div>
                                <div className="flex items-center">
                                    <input
                                        id="save-info"
                                        type="checkbox"
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="save-info" className="ml-2 block text-sm text-gray-700">
                                        Save my name, email, and website in this browser for the next time I comment.
                                    </label>
                                </div>
                                <div>
                                    <button
                                        aria-label="Post Comment"
                                        type="submit"
                                        className="bg-orange-500 text-white px-6 py-2 rounded-md font-medium hover:bg-orange-600 transition-colors text-sm"
                                    >
                                        POST COMMENT
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Sidebar - Right Column */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8">
                            {/* Recent Posts */}
                            <div className="bg-white border border-gray-200 rounded-lg p-4">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">RECENT POSTS</h3>
                                <div className="space-y-3">
                                    {recentPosts.map((recentPost) => (
                                        <div key={recentPost.id} className="border-b border-gray-100 pb-3 last:border-b-0">
                                            <Link
                                                href={`/blog/${recentPost.slug}`}
                                                className="block hover:text-blue-600 transition-colors"
                                                aria-label="Recent Post"
                                            >
                                                <h4 className="font-medium text-gray-900 line-clamp-2 mb-1 text-sm">
                                                    {recentPost.title}
                                                </h4>
                                                <div className="flex items-center justify-between text-xs text-gray-500">
                                                    <span>{formatDate(recentPost.published_date)}</span>
                                                    <span>No Comments</span>
                                                </div>
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 