import { Transformer } from 'markmap-lib';
import { fillTemplate } from 'markmap-render';
import nodeHtmlToImage from 'node-html-to-image';
import { writeFile } from 'node:fs/promises';

// 定义要转换的 markdown 内容
const markdown = `
# 公务员考试
## 行测
### 言语理解
### 数量关系
### 判断推理
### 资料分析
### 常识判断
## 申论
### 概括题
### 分析题
### 对策题
### 公文写作
`;

async function renderMarkmap(markdown: string, outFile: string) {
    const transformer = new Transformer();
    const { root, features } = transformer.transform(markdown);
    const assets = transformer.getUsedAssets(features);
    const html =
        fillTemplate(root, assets, {
            jsonOptions: {
                duration: 0,
                maxInitialScale: 5,
            },
        }) +
        `
<style>
body,
#mindmap {
  width: 2400px;
  height: 1800px;
}
</style>
`;
    const image = await nodeHtmlToImage({
        html,
    });
    await writeFile(outFile, image);
}

renderMarkmap(markdown, 'markmap.png');