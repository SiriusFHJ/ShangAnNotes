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
