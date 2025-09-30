/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    serverExternalPackages: ['bcrypt', 'mysql2', 'nodemailer', 'pdf-lib'],
    trailingSlash: true,
    distDir: '.next',

    // Add this rewrite rule
    async rewrites() {
        return [
            {
                source: '/sitemap.xml',
                destination: '/sitemap.xml'
            },
        ];
    },

    // Keep your headers config
    async headers() {
        return [
            {
                source: '/sitemap.xml',
                headers: [
                    {
                        key: 'Content-Type',
                        value: 'application/xml',
                    },
                ],
            },
            {
                source: '/robots.txt',
                headers: [
                    {
                        key: 'Content-Type',
                        value: 'text/plain',
                    },
                ],
            },
        ];
    },
};

export default nextConfig;