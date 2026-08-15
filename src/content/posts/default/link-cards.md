---
title: Link Cards Example
published: 2025-02-23T00:00:00+00:00
description: Guide to using the link card feature.
tags: [Markdown, Blogging, Demo]
category: "Examples"
draft: false
---

## About Link Cards  
## 关于链接卡片

Link Cards are similar to the `<LinkCard>` component in [Starlight](https://starlight.astro.build), displaying links in a card format.  
链接卡片类似于 [Starlight](https://starlight.astro.build) 中的 `<LinkCard>` 组件，以卡片形式展示链接。

## Usage  
## 使用方法
> 现已更新,调用方法如下
### 自定义标题和描述
```
::link-card{url="https://fuwari.oh1.top" title="yCENzh's Blog" description="Ciallo~"}
```
::link-card{url="https://fuwari.oh1.top" title="yCENzh's Blog" description="Ciallo~"}

### 带图片
```
::link-card{url="https://github.com" title="Github" description="Hello World!" icon="https://github.com/github.png"}
```
::link-card{url="https://github.com" title="Github" description="Hello World!" icon="https://github.com/github.png"}

> 下列均已失效

Include only a single "bare" link (a link without descriptive text), or something similar, within a paragraph in Markdown, and it will automatically be converted into a Link Card.  
在 Markdown 段落中仅包含一个"裸链接"（无描述文本的纯 URL）或类似结构，它将自动转换为链接卡片。

```markdown
**External Links**  
**外部链接**

https://astro.build/

<https://github.com/saicaca/fuwari/>

[https://fuwari.oh1.top/](https://fuwari.oh1.top/)

**Internal Links**  
**内部链接**

[/archive/](/archive/)

For more details, see the internalLink option section.  
更多细节请参见 internalLink 选项部分。

**IDN (Internationalized Domain Name)**  
**IDN（国际化域名）**

https://はじめよう.みんな/
```

https://astro.build/

<https://github.com/yCENzh/Fuwari-yCENzh/>

[https://fuwari.oh1.top/](https://fuwari.oh1.top/)

[/archive/](/archive/)

https://はじめよう.みんな/

> [!NOTE]  
> 注意
> Once the cards are displayed, try changing the theme color or enabling dark mode!  
> 卡片显示后，请尝试更改主题颜色或启用暗黑模式！

## Options  
## 配置选项

You can specify the options in the `astro.config.mjs` file.  
您可以在 `astro.config.mjs` 文件中指定配置选项。

```javascript
...
import fuwariLinkCard from "./src/plugins/fuwari-link-card.ts"
...
export default defineConfig({
  ...
  integrations: [
    ...
    fuwariLinkCard(), // Plugin here // 在此处添加插件
    ...
```

If the order of plugins is complex, you can also specify it as a remark plugin.  
如果插件顺序较复杂，也可将其指定为 remark 插件。

```javascript
...
import remarkLinkCard from "./src/plugins/remark-link-card.ts"
...
export default defineConfig({
  ...
  markdown: {
    ...
    remarkPlugins: [
      ...
      remarkLinkCard, // Plugin here // 在此处添加插件
      ...
```

| Name             | Type            | Default                                                                                                                                        | Description                                                                                                                                                                                                                                                                    |  
|------------------|-----------------|------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| devMode          | boolean         | [import.meta.env.DEV](https://docs.astro.build/en/guides/environment-variables/#default-environment-variables "Default environment variables") | Enable or disable development mode.                                                                                                                                                                                                                                            |
|                  |                 |                                                                                                                                                | 启用或禁用开发模式                                                                                                                                                                                                                                                            |
| excludedUrls     | Array<string \| RegExp> | []                                                                                                                                             | A list of strings or regular expressions to exclude specific URLs from processing. This can also help prevent conflicts with other plugins.                                                                                                                                    |
|                  |                 |                                                                                                                                                | 用于排除特定 URL 的字符串或正则表达式列表，可防止与其他插件冲突                                                                                                                                                                                                                |
| linkAttributes   | Object          | { target: '', rel: '' }                                                                                                                        | Set the target and relationship attributes for external links. These attributes can also be left unset to delegate handling to other plugins.                                                                                                                                  |
|                  |                 |                                                                                                                                                | 设置外部链接的 target 和 rel 属性，留空可交由其他插件处理                                                                                                                                                                                                                     |
| rewriteRules     | Array\<Object\> | []                                                                                                                                             | Rewrite specific metadata attributes fetched from links, such as the title and description.                                                                                                                                                                                    |
|                  |                 |                                                                                                                                                | 重写从链接获取的特定元数据属性（如标题和描述）                                                                                                                                                                                                                                |
| base             | string          | '/'                                                                                                                                            | Specify the same base path as Astro's. For details, refer [here](https://docs.astro.build/en/reference/configuration-reference/#base "Configuration Reference"). **When used as an integration, if not specified, this option will be determined automatically.**              |
|                  |                 |                                                                                                                                                | 指定与 Astro 相同的基准路径（[详情](https://docs.astro.build/en/reference/configuration-reference/#base)）。**作为集成使用时，如未指定将自动确定**                                                                                                                              |
| defaultThumbnail | string          | ''                                                                                                                                             | Path to the default thumbnail image to use when the metadata does not include image data. It should be relative to the public directory. For example, set `defaultThumbnail` to 'images/default-thumbnail.jpg' if the image is located at public/images/default-thumbnail.jpg. |
|                  |                 |                                                                                                                                                | 当元数据不含图片时使用的默认缩略图路径（相对于 public 目录）。例如：图片在 public/images/default-thumbnail.jpg 时设为 'images/default-thumbnail.jpg'                                                                                                                              |
| internalLink     | Object          | { enabled: false, site: '' }                                                                                                                   | Enable internal link processing within your site.                                                                                                                                                                                                                              |
|                  |                 |                                                                                                                                                | 启用站点内部链接处理                                                                                                                                                                                                                                                          |
| cache            | Object          | See detailed options below.                                                                                                                    | Download and cache images during the build process.                                                                                                                                                                                                                            |
|                  |                 |                                                                                                                                                | 在构建过程中下载并缓存图片                                                                                                                                                                                                                                                    |

### linkAttributes  
### 链接属性配置

| Name   | Type   | Default | Description                                                                                                                      |  
|--------|--------|---------|----------------------------------------------------------------------------------------------------------------------------------|
| target | string | ''      | Specify where to open linked documents. The default (empty) does not set a target on links.                                      |
|        |        |         | 指定链接文档打开位置（默认留空不设置 target）                                                                                    |
| rel    | string | ''      | Define the relationship between the current document and the linked document. The default (empty) does not set any relationship. |
|        |        |         | 定义当前文档与链接文档的关系（默认留空不设置 rel）                                                                               |

### rewriteRules  
### 重写规则

| Name         | Type            | Default | Description                                                   |  
|--------------|-----------------|---------|---------------------------------------------------------------|
| url          | RegExp          |         | A regular expression pattern is used to match a specific URL. |
|              |                 |         | 用于匹配特定 URL 的正则表达式模式                             |
| rewriteSteps | Array\<Object\> |         | Defines rewrite rules for specific metadata attributes.       |
|              |                 |         | 定义特定元数据属性的重写规则                                  |

Below is an example that shows how to rewrite the "title" and "description" for metadata fetched from links pointing to a GitHub repository.  
以下示例展示如何重写 GitHub 仓库链接的 "title" 和 "description" 元数据：

```javascript
rewriteRules: [
  {
    url: /^https:\/\/github\.com\/[^\/]+\/[^\/]+\/?$/,
    rewriteSteps: [
      { key: "title", pattern: /:.*/, replacement: "" },
      {
        key: "description",
        pattern: /(?: (?:\. )?Contribute to (?:.+\/.+) .+\.?)|(?: - (?:.+\/.+))$/,
        replacement: "",
      },
      {
        key: "description",
        pattern: /^Contribute to (?:.+\/.+) .+\.?$/,
        replacement: "No description provided.",
      },
    ],
  },
],
```

| Name        | Type   | Default | Description                                                                                                                                             |  
|-------------|--------|---------|---------------------------------------------------------------------------------------------------------------------------------------------------------|
| key         | string |         | Metadata attribute key to be rewritten.                                                                                                                 |
|             |        |         | 要重写的元数据属性键名                                                                                                                                  |
| pattern     | RegExp |         | Regular expression pattern used to match the current value of the metadata attribute. The part of the value that matches this pattern will be replaced. |
|             |        |         | 用于匹配元数据属性当前值的正则表达式，匹配部分将被替换                                                                                                  |
| replacement | string |         | String to replace the matched pattern in the metadata attribute.                                                                                        |
|             |        |         | 替换元数据属性中匹配项的字符串                                                                                                                          |

### internalLink  
### 内部链接配置

| Name    | Type    | Default | Description                                                                                                                                                                                                                                                          |  
|---------|---------|---------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| enabled | boolean | false   | Enable or disable internal link processing.                                                                                                                                                                                                                          |
|         |         |         | 启用或禁用内部链接处理                                                                                                                                                                                                                                               |
| site    | string  | ''      | Specify the same deployed URL as Astro's. For details, refer [here](https://docs.astro.build/en/reference/configuration-reference/#site "Configuration Reference"). **When used as an integration, if not specified, this option will be determined automatically.** |
|         |         |         | 指定与 Astro 相同的部署 URL（[详情](https://docs.astro.build/en/reference/configuration-reference/#site)）。**作为集成使用时，如未指定将自动确定**                                                                                                                      |

### cache  
### 缓存配置

| Name         | Type    | Default                                                                                                           | Description                                                                                                                                                                                                                              |  
|--------------|---------|-------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| enabled      | boolean | false                                                                                                             | Enable or disable caching.                                                                                                                                                                                                               |
|              |         |                                                                                                                   | 启用或禁用缓存                                                                                                                                                                                                                           |
| outDir       | string  | './dist/'                                                                                                         | Output directory path.  For details, refer [here](https://docs.astro.build/en/reference/configuration-reference/#outdir "Configuration Reference"). **Aligning with Astro allows you to benefit from features like image optimization.** |
|              |         |                                                                                                                   | 输出目录路径（[详情](https://docs.astro.build/en/reference/configuration-reference/#outdir)）。**与 Astro 对齐可享受图片优化等功能**                                                                                                       |
| cacheDir     | string  | './link-card/'                                                                                                    | Cache directory path. If `devMode` is set to true, the final URL to the cached images will be `base + outDir + cacheDir`. Otherwise, it will be `base + cacheDir`.                                                                       |
|              |         |                                                                                                                   | 缓存目录路径。`devMode=true` 时最终 URL 为 `base + outDir + cacheDir`，否则为 `base + cacheDir`                                                                                                                                           |
| maxFileSize  | number  | 0                                                                                                                 | Maximum file size (in bytes) to cache. Set to 0 for no limit.                                                                                                                                                                            |
|              |         |                                                                                                                   | 单文件最大缓存大小（字节），0 表示无限制                                                                                                                                                                                                 |
| maxCacheSize | number  | 0                                                                                                                 | Maximum total cache size (in bytes). Set to 0 for no limit.                                                                                                                                                                              |
|              |         |                                                                                                                   | 缓存总大小上限（字节），0 表示无限制                                                                                                                                                                                                     |
| userAgent    | string  | 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36' | Identifier included in HTTP request headers to specify the client.                                                                                                                                                                       |
|              |         |                                                                                                                   | HTTP 请求头中的客户端标识符                                                                                                                                                                                                              |

### Quick and Easy Options Setup  
### 快速配置选项

This plugin uses `@fastify/deepmerge` to simplify options setup.  
本插件使用 `@fastify/deepmerge` 简化选项配置。

<https://www.npmjs.com/package/@fastify/deepmerge>

## HTML Structure for Styling  
## 用于样式化的 HTML 结构

The styles are specified in `src/styles/link-card.css`, and the HTML is automatically generated. Below is an example structure to guide you when customizing the styles:  
样式定义在 `src/styles/link-card.css` 中，HTML 会自动生成。以下是自定义样式时的参考结构：

```html
<div class="link-card__container">
  <a href="https://astro.build/" class="link-card">
    <div class="link-card__info">
      <div class="link-card__title">Astro</div>
      <div class="link-card__description">Astro builds fast content sites, powerful web applications, dynamic server APIs, and everything in-between.</div>
      <div class="link-card__metadata">
        <div class="link-card__domain">
          <img alt="favicon" class="link-card__favicon" src="https://www.google.com/s2/favicons?domain=astro.build">
          <span class="link-card__domain-name">astro.build</span>
        </div>
      </div>
    </div>
    <div class="link-card__thumbnail">
      <img alt="Astro - Build the web you want." class="link-card__image" src="https://astro.build/og/astro.jpg">
    </div>
  </a>
</div>
```
