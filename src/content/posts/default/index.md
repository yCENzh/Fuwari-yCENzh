---
title: Simple Guides for Fuwari
published: 1002-04-01
description: "How to use this blog template."
image: "./index.jpeg"
tags: [Fuwari, Blogging, Customization]
category: "Examples"
draft: false
---

> Cover image source: [Source](https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/208fc754-890d-4adb-9753-2c963332675d/width=2048/01651-1456859105-(colour_1.5),girl,_Blue,yellow,green,cyan,purple,red,pink,_best,8k,UHD,masterpiece,male%20focus,%201boy,gloves,%20ponytail,%20long%20hair,.jpeg)
> 封面图片来源：[来源](https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/208fc754-890d-4adb-9753-2c963332675d/width=2048/01651-1456859105-(colour_1.5),girl,_Blue,yellow,green,cyan,purple,red,pink,_best,8k,UHD,masterpiece,male%20focus,%201boy,gloves,%20ponytail,%20long%20hair,.jpeg)

This blog template is built with [Astro](https://astro.build/). For the things that are not mentioned in this guide, you may find the answers in the [Astro Docs](https://docs.astro.build/).
此博客模板使用 [Astro](https://astro.build/) 构建。对于本指南未提及的内容，您可以在 [Astro 文档](https://docs.astro.build/)中找到答案。

## Front-matter of Posts
## 文章的前言配置(Front-matter)

```yaml
---
title: My First Blog Post
published: 2023-09-09
description: This is the first post of my new Astro blog.
image: ./cover.jpg
tags: [Foo, Bar]
category: "Examples"
draft: false
---
```

| Attribute     | Description                                                                                                                                                                                                 |
|---------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `title`       | The title of the post. <br/> 文章的标题。                                                                                                                                                                 |
| `published`   | The date the post was published. <br/> 文章发布的日期。                                                                                                                                                    |
| `description` | A short description of the post. Displayed on index page. <br/> 文章的简短描述。显示在索引页上。                                                                                                           |
| `image`       | The cover image path of the post.<br/>1. Start with `http://` or `https://`: Use web image<br/>2. Start with `/`: For image in `public` dir<br/>3. With none of the prefixes: Relative to the markdown file <br/> 文章的封面图片路径。<br/>1. 以 `http://` 或 `https://` 开头：使用网络图片<br/>2. 以 `/` 开头：指向 `public` 目录中的图片<br/>3. 无前缀：相对于 Markdown 文件的位置 |
| `tags`        | The tags of the post. <br/> 文章的标签。                                                                                                                                                                  |
| `category`    | The category of the post. <br/> 文章的分类。                                                                                                                                                             |
| `draft`       | If this post is still a draft, which won't be displayed. <br/> 如果文章仍是草稿，则不会显示。                                                                                                           |

## Where to Place the Post Files
## 文章文件的存放位置

Your post files should be placed in `src/content/posts/` directory. You can also create sub-directories to better organize your posts and assets.
您的文章文件应放置在 `src/content/posts/` 目录中。您也可以创建子目录以更好地组织文章和资源。

```
src/content/posts/
├── post-1.md
└── post-2/
    ├── cover.png
    └── index.md
```
