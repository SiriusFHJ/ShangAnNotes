const withNextra = require('nextra')({
    theme: 'nextra-theme-docs',
    themeConfig: './theme.config.tsx',
    latex: true,
    normalizeSlashes: true, // 自动修正路径中的重复斜杠
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
        // 增加构建内存限制
        config.optimization.splitChunks = {
            chunks: 'all',
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

        return config
    },
    // 启用构建缓存
    experimental: {
        turbo: {
            memoryLimit: 8192,
        },
    },
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
