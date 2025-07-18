const withNextra = require('nextra')({
    theme: 'nextra-theme-docs',
    themeConfig: './theme.config.tsx',
    latex: true,
    normalizeSlashes: true, // 自动修正路径中的重复斜杠
    defaultShowCopyCode: true,
    readingTime: true,
})


module.exports = withNextra({
    // 配置图片域名
    images: {
        domains: ['kaogong-1301372224.cos.ap-nanjing.myqcloud.com'],
    },
    // 将纯 esm 模块转为 node 兼容模块
    transpilePackages: [
        'lodash-es',
        '@ant-design/icons',
        '@ant-design/pro-chat',
        'react-intersection-observer',
        '@ant-design/pro-editor',
        '@ant-design/pro-components'
    ],
    // 构建优化配置
    webpack: (config, { isServer }) => {
        // 内存优化的代码分割
        config.optimization.splitChunks = {
            chunks: 'all',
            minSize: 20000,
            maxSize: 200000, // 降低到200KB
            cacheGroups: {
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true,
                },
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    reuseExistingChunk: true,
                    maxSize: 200000,
                },
                antd: {
                    test: /[\\/]node_modules[\\/]antd[\\/]/,
                    priority: 10,
                    reuseExistingChunk: true,
                    maxSize: 200000,
                },
                react: {
                    test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
                    priority: 10,
                    reuseExistingChunk: true,
                    maxSize: 200000,
                },
                // 分离大型内容页面
                pages: {
                    test: /[\\/]src[\\/]pages[\\/]/,
                    priority: 5,
                    reuseExistingChunk: true,
                    maxSize: 150000,
                },
            },
        }

        // 减少内存使用
        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                fs: false,
                net: false,
                tls: false,
            }
        }

        // 优化构建性能和内存
        config.optimization.usedExports = true
        config.optimization.sideEffects = false

        // 限制并发处理
        config.optimization.minimize = true
        config.optimization.minimizer = config.optimization.minimizer || []

        // 内存优化
        config.resolve.symlinks = false
        config.watchOptions = {
            ignored: ['**/node_modules/**', '**/.next/**']
        }

        return config
    },
    // 启用构建缓存和内存优化
    experimental: {
        turbo: {
            memoryLimit: 3072,
        },
        optimizeCss: true,
        swcMinify: true,
        // 启用增量构建
        incrementalCacheHandlerPath: require.resolve('next/dist/server/lib/incremental-cache'),
    },
    // 输出配置优化
    output: 'standalone',
    // 页面优化
    pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
    // 压缩配置
    compress: true,
    // 配置静态文件访问，支持微信校验文件
    async headers() {
        return [
            {
                // 匹配所有.txt文件（微信校验文件）
                source: '/(.*).txt',
                headers: [
                    {
                        key: 'Content-Type',
                        value: 'text/plain; charset=utf-8',
                    },
                    {
                        key: 'Cache-Control',
                        value: 'no-cache, no-store, must-revalidate',
                    },
                ],
            },
        ]
    }
})
