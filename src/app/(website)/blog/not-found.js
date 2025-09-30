import Link from 'next/link';
import Image from 'next/image';

export default function BlogNotFound() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
            <div className="max-w-md mx-auto text-center">
                {/* Error Icon */}
                <div className="mb-8">
                    <div className="relative mx-auto w-24 h-24">
                        <Image
                            src="/bug.png"
                            alt="Blog not found"
                            fill
                            className="object-contain"
                            priority // Critical for LCP optimization
                            fetchPriority="high" // Resource hint
                        />
                    </div>
                </div>

                {/* Error Message */}
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    Blog Post Not Found
                </h1>

                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                    Sorry, the blog post you're looking for doesn't exist or has been moved.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/blog"
                        className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        aria-label="Back to Blog"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Blog
                    </Link>

                    <Link
                        href="/"
                        aria-label="Go Home"
                        className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Go Home
                    </Link>
                </div>

                {/* Additional Help */}
                <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                        Need Help?
                    </h3>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                        Check out our{' '}
                            <Link href="/blog" aria-label="Latest Blog Posts" className="underline hover:text-blue-800 dark:hover:text-blue-200">
                            latest blog posts
                        </Link>
                        {' '}or{' '}
                        <Link href="/contact" className="underline hover:text-blue-800 dark:hover:text-blue-200" aria-label="Contact Us">
                            contact us
                        </Link>
                        {' '}for assistance.
                    </p>
                </div>
            </div>
        </div>
    );
} 