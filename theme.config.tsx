import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'
import Image from 'next/image';
import { useRouter } from "next/router";
import { useConfig } from 'nextra-theme-docs';
import ShangAn from 'public/favicon.webp'
const metaTags = (
    <>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/webp" href="/favicon.webp" />
        <meta
            name="description"
            content="最全面最容易上手的的考公教程"
        />
        <meta name="keywords" content="公考 考公 考公教育 公务员考试 公务员考试题库 公务员考试培训课程 资料分析 行测 申论 面试 常识 言语理解 数量关系 判断推理 资料分析 资料分析技巧 资料分析公式 资料分析速算 资料分析技巧 资料分析公式 资料分析速算" />
        <meta property="og:title" content="上岸学堂-格物智源Tech" />
        <meta property="og:description"
            content="上岸学堂，一个助力于使用最先进的AI技术帮助广大同学考试上岸的网站，提供行测、申论、面试等全方位的学习资源。" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="上岸学堂-格物智源Tech" />
        <meta property="og:image" content="/chapter0-dashboard.avif" />
    </>
);


const config: DocsThemeConfig = {
    head: metaTags,
    logo: <>
        <Image
            src={ShangAn}
            className="mb-2 mr-2 rounded-md shadow-lg"
            alt="#"
            width={48}
            height={48}
        />
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: '10px 10px' }}>上岸学堂</h2>
    </>,
    // project: {
    //     link: 'https://github.com/SiriusFHJ/ShangAnNotes',
    // },
    docsRepositoryBase: 'https://www.asyncook.com/',
    search: {
        placeholder: '搜索文档',
    },
    sidebar: {
        toggleButton: true,
    },
    footer: {
        text: (
            <span className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                <a href="" target="_blank" className="hover:text-blue-600 transition-colors duration-200">
                    {/* <span role="img" aria-label="copyright" className="anticon anticon-copyright"><svg viewBox="64 64 896 896" focusable="false" data-icon="copyright" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372zm5.6-532.7c53 0 89 33.8 93 83.4.3 4.2 3.8 7.4 8 7.4h56.7c2.6 0 4.7-2.1 4.7-4.7 0-86.7-68.4-147.4-162.7-147.4C407.4 290 344 364.2 344 486.8v52.3C344 660.8 407.4 734 517.3 734c94 0 162.7-58.8 162.7-141.4 0-2.6-2.1-4.7-4.7-4.7h-56.8c-4.2 0-7.6 3.2-8 7.3-4.2 46.1-40.1 77.8-93 77.8-65.3 0-102.1-47.9-102.1-133.6v-52.6c.1-87 37-135.5 102.2-135.5z"></path></svg></span> */}
                    上岸学堂-格物智源
                </a>
                <span className="text-gray-400"> | </span>
                <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer" className="text-blue-600">
                    赣ICP备2024030965号
                </a>
            </span>
        ),
    },
    feedback: {
        content: null,
        labels: "问题反馈"
    },
    editLink: {
        text: null,
    },
    toc: {
        backToTop: true,
        title: "回到顶部",
    },
    useNextSeoProps() {
        const { asPath } = useRouter();
        const { frontMatter } = useConfig()

        const defaultSeo = {
            titleTemplate: "%s - 上岸学堂 - 格物智源Tech",
            description: "公务员事业编上岸指南, AI行测申论辅导",
            openGraph: {
                type: 'website',
                locale: 'zh_CN',
                url: `https://www.note.gongkaoshangan.com${asPath}`,
                siteName: '上岸学堂-格物智源Tech',
            },
            // 结构化数据
            additionalLinkTags: [
                {
                    rel: 'canonical',
                    href: `https://www.note.gongkaoshangan.com${asPath}`,
                },
            ],
            additionalMetaTags: [
                {
                    name: 'keywords',
                    content: frontMatter.keywords || '公考, 考公教育, 公务员考试, 资料分析, 行测, 申论'
                },
                {
                    name: 'author',
                    content: '上岸学堂'
                },
            ],
        }

        if (asPath === "/") {
            return {
                ...defaultSeo,
                titleTemplate: "上岸学堂-格物智源Tech",
            };
        }

        // 使用 frontMatter 来获取页面中定义的元数据
        return {
            ...defaultSeo,
            title: frontMatter.title,
            description: frontMatter.description || defaultSeo.description,
            openGraph: {
                ...defaultSeo.openGraph,
                title: frontMatter.title,
                description: frontMatter.description || defaultSeo.description,
            },
            // keywords 的支持
            additionalMetaTags: [
                ...defaultSeo.additionalMetaTags,
                {
                    name: 'twitter:card',
                    content: 'summary_large_image'
                },
                {
                    name: 'twitter:site',
                    content: '@YourTwitterHandle'
                }
            ]
        };
    },
}

export default config
