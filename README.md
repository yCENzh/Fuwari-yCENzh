# 🍥Fuwari

基于 [Astro](https://astro.build) 开发的静态博客模板。

[**🖥️在线预览（Vercel）**](https://fuwari.vercel.app)
[**🖥️作者博客**](https://fuwari-17l.pages.dev/)

![Preview Image](https://raw.githubusercontent.com/saicaca/resource/main/fuwari/home.png)

## 食用方法(基础版构建
1.  [Fork本项目](https://github.com/yCENzh/fuwari/fork) (PS:请不要勾选Copy the master branch only选项)
2.  使用 [Cloudflare](https://dash.cloudflare.com/) 提供的Pages -> 创建一个Pages -> 导入现有Git存储库 -> 将生产分支更改为Build,框架预设选择Astro,再将构建命令npm run build更改为pnpm run build -> 保存并构建
3.  没了,非常的简单,后续食用方法请查看我的博客

## 更新日志(25-07-05)
1. 修复了上古时期的markdown.css中link及btn-regular-dark类未定义(应该是吧)导致构建有概率失败的bug(PS:好消息修好了,坏消息修好了)

## ✨ 功能特性

- [x] 基于 Astro 和 Tailwind CSS 开发
- [x] 流畅的动画和页面过渡
- [x] 亮色 / 暗色模式
- [x] 自定义主题色和横幅图片
- [x] 响应式设计
- [ ] 评论(e其实可以用[giscus](https://giscus.app/)的)
- [x] 搜索
- [x] 文内目录

## 👀 要求

- Node.js <= 22
- pnpm <= 9

## PS:部署方法可以参照我博客的文章
## 🚀 方法1

使用 [create-fuwari](https://github.com/L4Ph/create-fuwari) 在本地初始化项目。

```sh
# npm
npm create fuwari@latest

# yarn
yarn create fuwari

# pnpm
pnpm create fuwari@latest

# bun
bun create fuwari@latest

# deno
deno run -A npm:create-fuwari@latest
```

1. 通过配置文件 `src/config.ts` 自定义博客
2. 执行 `pnpm new-post <filename>` 创建新文章，并在 `src/content/posts/` 目录中编辑
3. 参考[官方指南](https://docs.astro.build/zh-cn/guides/deploy/)将博客部署至 Vercel, Netlify, GitHub Pages 等；部署前需编辑 `astro.config.mjs` 中的站点设置。

## 🚀 方法2

1. 使用此模板[生成新仓库](https://github.com/saicaca/fuwari/generate)或 Fork 此仓库
2. 进行本地开发，Clone 新的仓库，执行 `pnpm install` 和 `pnpm add sharp` 以安装依赖  
   - 若未安装 [pnpm](https://pnpm.io)，执行 `npm install -g pnpm`
3. 通过配置文件 `src/config.ts` 自定义博客
4. 执行 `pnpm new-post <filename>` 创建新文章，并在 `src/content/posts/` 目录中编辑
5. 参考[官方指南](https://docs.astro.build/zh-cn/guides/deploy/)将博客部署至 Vercel, Netlify, GitHub Pages 等；部署前需编辑 `astro.config.mjs` 中的站点设置。

## ⚙️ 文章 Frontmatter

```yaml
---
title: My First Blog Post
published: 2023-09-09
description: This is the first post of my new Astro blog.
image: ./cover.jpg
tags: [Foo, Bar]
category: Front-end
draft: false
lang: jp      # 仅当文章语言与 `config.ts` 中的网站语言不同时需要设置
---
```

## 🧞 指令

下列指令均需要在项目根目录执行：

| Command                           | Action                            |
|:----------------------------------|:----------------------------------|
| `pnpm install` 并 `pnpm add sharp` | 安装依赖                              |
| `pnpm dev`                        | 在 `localhost:4321` 启动本地开发服务器      |
| `pnpm build`                      | 构建网站至 `./dist/`                   |
| `pnpm preview`                    | 本地预览已构建的网站                        |
| `pnpm new-post <filename>`        | 创建新文章                             |
| `pnpm astro ...`                  | 执行 `astro add`, `astro check` 等指令 |
| `pnpm astro --help`               | 显示 Astro CLI 帮助                   |


# 🍥Fuwari  
![Node.js >= 20](https://img.shields.io/badge/node.js-%3E%3D20-brightgreen) 
![pnpm >= 9](https://img.shields.io/badge/pnpm-%3E%3D9-blue) 
[![DeepWiki](https://img.shields.io/badge/DeepWiki-saicaca%2Ffuwari-blue.svg?logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAyCAYAAAAnWDnqAAAAAXNSR0IArs4c6QAAA05JREFUaEPtmUtyEzEQhtWTQyQLHNak2AB7ZnyXZMEjXMGeK/AIi+QuHrMnbChYY7MIh8g01fJoopFb0uhhEqqcbWTp06/uv1saEDv4O3n3dV60RfP947Mm9/SQc0ICFQgzfc4CYZoTPAswgSJCCUJUnAAoRHOAUOcATwbmVLWdGoH//PB8mnKqScAhsD0kYP3j/Yt5LPQe2KvcXmGvRHcDnpxfL2zOYJ1mFwrryWTz0advv1Ut4CJgf5uhDuDj5eUcAUoahrdY/56ebRWeraTjMt/00Sh3UDtjgHtQNHwcRGOC98BJEAEymycmYcWwOprTgcB6VZ5JK5TAJ+fXGLBm3FDAmn6oPPjR4rKCAoJCal2eAiQp2x0vxTPB3ALO2CRkwmDy5WohzBDwSEFKRwPbknEggCPB/imwrycgxX2NzoMCHhPkDwqYMr9tRcP5qNrMZHkVnOjRMWwLCcr8ohBVb1OMjxLwGCvjTikrsBOiA6fNyCrm8V1rP93iVPpwaE+gO0SsWmPiXB+jikdf6SizrT5qKasx5j8ABbHpFTx+vFXp9EnYQmLx02h1QTTrl6eDqxLnGjporxl3NL3agEvXdT0WmEost648sQOYAeJS9Q7bfUVoMGnjo4AZdUMQku50McDcMWcBPvr0SzbTAFDfvJqwLzgxwATnCgnp4wDl6Aa+Ax283gghmj+vj7feE2KBBRMW3FzOpLOADl0Isb5587h/U4gGvkt5v60Z1VLG8BhYjbzRwyQZemwAd6cCR5/XFWLYZRIMpX39AR0tjaGGiGzLVyhse5C9RKC6ai42ppWPKiBagOvaYk8lO7DajerabOZP46Lby5wKjw1HCRx7p9sVMOWGzb/vA1hwiWc6jm3MvQDTogQkiqIhJV0nBQBTU+3okKCFDy9WwferkHjtxib7t3xIUQtHxnIwtx4mpg26/HfwVNVDb4oI9RHmx5WGelRVlrtiw43zboCLaxv46AZeB3IlTkwouebTr1y2NjSpHz68WNFjHvupy3q8TFn3Hos2IAk4Ju5dCo8B3wP7VPr/FGaKiG+T+v+TQqIrOqMTL1VdWV1DdmcbO8KXBz6esmYWYKPwDL5b5FA1a0hwapHiom0r/cKaoqr+27/XcrS5UwSMbQAAAABJRU5ErkJggg==)](https://deepwiki.com/saicaca/fuwari)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fsaicaca%2Ffuwari.svg?type=shield&issueType=license)](https://app.fossa.com/projects/git%2Bgithub.com%2Fsaicaca%2Ffuwari?ref=badge_shield&issueType=license)

A static blog template built with [Astro](https://astro.build).

[**🖥️ Live Demo (Vercel)**](https://fuwari.vercel.app)

![Preview Image](https://raw.githubusercontent.com/saicaca/resource/main/fuwari/home.png)

🌏 README in
[**中文**](https://github.com/yCENzh/fuwari/blob/main/docs/README.zh-CN.md) /
[**日本語**](https://github.com/yCENzh/fuwari/blob/main/docs/README.ja.md) /
[**한국어**](https://github.com/yCENzh/fuwari/blob/main/docs/README.ko.md) /
[**Español**](https://github.com/yCENzh/fuwari/blob/main/docs/README.es.md) /
[**ไทย**](https://github.com/yCENzh/fuwari/blob/main/docs/README.th.md) (Provided by the community and may not always be up-to-date)

## ✨ Features

- [x] Built with [Astro](https://astro.build) and [Tailwind CSS](https://tailwindcss.com)
- [x] Smooth animations and page transitions
- [x] Light / dark mode
- [x] Customizable theme colors & banner
- [x] Responsive design
- [x] Search functionality with [Pagefind](https://pagefind.app/)
- [x] [Markdown extended features](https://github.com/saicaca/fuwari?tab=readme-ov-file#-markdown-extended-syntax)
- [x] Table of contents
- [x] RSS feed

## 🚀 Getting Started

1. Create your blog repository:
    - [Generate a new repository](https://github.com/saicaca/fuwari/generate) from this template or fork this repository.
    - Or run one of the following commands:
       ```sh
       npm create fuwari@latest
       yarn create fuwari
       pnpm create fuwari@latest
       bun create fuwari@latest
       deno run -A npm:create-fuwari@latest
       ```
2. To edit your blog locally, clone your repository, run `pnpm install` to install dependencies.
    - Install [pnpm](https://pnpm.io) `npm install -g pnpm` if you haven't.
3. Edit the config file `src/config.ts` to customize your blog.
4. Run `pnpm new-post <filename>` to create a new post and edit it in `src/content/posts/`.
5. Deploy your blog to Vercel, Netlify, GitHub Pages, etc. following [the guides](https://docs.astro.build/en/guides/deploy/). You need to edit the site configuration in `astro.config.mjs` before deployment.

## 📝 Frontmatter of Posts

```yaml
---
title: My First Blog Post
published: 2023-09-09
description: This is the first post of my new Astro blog.
image: ./cover.jpg
tags: [Foo, Bar]
category: Front-end
draft: false
lang: jp      # Set only if the post's language differs from the site's language in `config.ts`
---
```

## 🧩 Markdown Extended Syntax

In addition to Astro's default support for [GitHub Flavored Markdown](https://github.github.com/gfm/), several extra Markdown features are included:

- Admonitions ([Preview and Usage](https://fuwari.vercel.app/posts/markdown-extended/#admonitions))
- GitHub repository cards ([Preview and Usage](https://fuwari.vercel.app/posts/markdown-extended/#github-repository-cards))
- Enhanced code blocks with Expressive Code ([Preview](https://fuwari.vercel.app/posts/expressive-code/) / [Docs](https://expressive-code.com/))

## ⚡ Commands

All commands are run from the root of the project, from a terminal:

| Command                    | Action                                              |
|:---------------------------|:----------------------------------------------------|
| `pnpm install`             | Installs dependencies                               |
| `pnpm dev`                 | Starts local dev server at `localhost:4321`         |
| `pnpm build`               | Build your production site to `./dist/`             |
| `pnpm preview`             | Preview your build locally, before deploying        |
| `pnpm check`               | Run checks for errors in your code                  |
| `pnpm format`              | Format your code using Biome                        |
| `pnpm new-post <filename>` | Create a new post                                   |
| `pnpm astro ...`           | Run CLI commands like `astro add`, `astro check`    |
| `pnpm astro --help`        | Get help using the Astro CLI                        |

## ✏️ Contributing

Check out the [Contributing Guide](https://github.com/saicaca/fuwari/blob/main/CONTRIBUTING.md) for details on how to contribute to this project.

## 📄 License

This project is licensed under the MIT License.

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fsaicaca%2Ffuwari.svg?type=large&issueType=license)](https://app.fossa.com/projects/git%2Bgithub.com%2Fsaicaca%2Ffuwari?ref=badge_large&issueType=license)
