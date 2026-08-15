---
title: Markdown Extended Features
published: 1002-05-01
updated: 1002-11-29
description: 'Read more about Markdown features in Fuwari'
image: 'https://api.lxtu.cn/api.php?category=ys'
tags: [Demo, Example, Markdown, Fuwari]
category: "Examples"
draft: false 
---

## GitHub Repository Cards
## GitHub 仓库卡片

You can add dynamic cards that link to GitHub repositories, on page load, the repository information is pulled from the GitHub API.
您可以添加链接到 GitHub 仓库的动态卡片，页面加载时，仓库信息将从 GitHub API 获取。

::github{repo="Fabrizz/MMM-OnSpotify"}

Create a GitHub repository card with the code `::github{repo="<owner>/<repo>"}`.
使用代码 `::github{repo="<所有者>/<仓库名>"}` 创建 GitHub 仓库卡片。

```markdown
::github{repo="saicaca/fuwari"}
```

## Admonitions
## 提示框

Following types of admonitions are supported: `note` `tip` `important` `warning` `caution`
支持以下类型的提示框：`note`（说明）`tip`（技巧）`important`（重要）`warning`（警告）`caution`（注意）

:::note
Highlights information that users should take into account, even when skimming.
:::note
突出显示用户应重视的信息，即使是在略读时。
:::

:::tip
Optional information to help a user be more successful.
:::tip
帮助用户更成功的可选信息。
:::

:::important
Crucial information necessary for users to succeed.
:::important
用户成功所需的关键信息。
:::

:::warning
Critical content demanding immediate user attention due to potential risks.
:::warning
因潜在风险需要用户立即关注的关键内容。
:::

:::caution
Negative potential consequences of an action.
:::caution
行动可能带来的负面后果。
:::

### Basic Syntax
### 基本语法

```markdown
:::note
Highlights information that users should take into account, even when skimming.
:::

:::tip
Optional information to help a user be more successful.
:::
```

### Custom Titles
### 自定义标题

The title of the admonition can be customized.
提示框的标题可以自定义。

:::note[MY CUSTOM TITLE]
This is a note with a custom title.
:::note[我的自定义标题]
这是一个带有自定义标题的说明框。
:::

```markdown
:::note[MY CUSTOM TITLE]
This is a note with a custom title.
:::
```

### GitHub Syntax
### GitHub 语法

> [!TIP]
> [The GitHub syntax](https://github.com/orgs/community/discussions/16925) is also supported.
> [!TIP]
> 也支持 [GitHub 语法](https://github.com/orgs/community/discussions/16925)。

```
> [!NOTE]
> The GitHub syntax is also supported.

> [!TIP]
> The GitHub syntax is also supported.
```

### Spoiler
### 剧透

You can add spoilers to your text. The text also supports **Markdown** syntax.  
你可以给文本添加剧透效果。文本同样支持 Markdown 语法。

The content :spoiler[is hidden **ayyy**]!
内容：剧透[被隐藏了 **哎呀**]！

```markdown
The content :spoiler[is hidden **ayyy**]!
```
