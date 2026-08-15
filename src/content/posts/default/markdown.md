---
title: Markdown Example
published: 1001-10-01
description: A simple example of a Markdown blog post.
image: "https://api.boxmoe.com/random.php"
tags: [Markdown, Blogging, Demo]
category: "Examples"
draft: false
---

# An h1 header
# 一级标题

Paragraphs are separated by a blank line.
段落之间用空行分隔。

2nd paragraph. _Italic_, **bold**, and `monospace`. Itemized lists
look like:
第二段。*斜体*，**粗体**，和`等宽字体`。项目列表看起来像这样：

- this one
- 这一个
- that one
- 那一个
- the other one
- 另一个

Note that --- not considering the asterisk --- the actual text
content starts at 4-columns in.
请注意 --- 不考虑星号 --- 实际文本内容从第4列开始。

> Block quotes are
> written like so.
>
> They can span multiple paragraphs,
> if you like.
> 引用块是这样写的。
> 
> 如果你愿意，它们可以跨越多段。

Use 3 dashes for an em-dash. Use 2 dashes for ranges (ex., "it's all
in chapters 12--14"). Three dots ... will be converted to an ellipsis.
Unicode is supported. ☺
使用三个连字符表示长破折号。使用两个连字符表示范围（例如："都在12-14章"）。三个点...将被转换为省略号。支持Unicode。☺

## An h2 header
## 二级标题

Here's a numbered list:
这是一个有序列表：

1. first item
1. 第一项
2. second item
2. 第二项
3. third item
3. 第三项

Note again how the actual text starts at 4 columns in (4 characters
from the left side). Here's a code sample:
再次注意实际文本如何从第4列开始（距左侧4个字符）。这是一个代码示例：

    # Let me re-iterate ...
    for i in 1 .. 10 { do-something(i) }

As you probably guessed, indented 4 spaces. By the way, instead of
indenting the block, you can use delimited blocks, if you like:
如你所料，缩进4个空格。顺便说一句，如果你愿意，可以使用定界块代替缩进块：

```
define foobar() {
    print "Welcome to flavor country!";
}
```

(which makes copying & pasting easier). You can optionally mark the
delimited block for Pandoc to syntax highlight it:
（这使得复制粘贴更容易）。你可以选择标记定界块以便Pandoc进行语法高亮：

```python
import time
# Quick, count to ten!
for i in range(10):
    # (but not *too* quick)
    time.sleep(0.5)
    print i
```

### An h3 header
### 三级标题

Now a nested list:
现在是一个嵌套列表：

1. First, get these ingredients:
1. 首先，准备这些材料：

    - carrots
    - 胡萝卜
    - celery
    - 芹菜
    - lentils
    - 扁豆

2. Boil some water.
2. 烧开一些水。

3. Dump everything in the pot and follow
    this algorithm:
3. 将所有东西倒入锅中，并按照以下算法操作：

        find wooden spoon
        uncover pot
        stir
        cover pot
        balance wooden spoon precariously on pot handle
        wait 10 minutes
        goto first step (or shut off burner when done)

    Do not bump wooden spoon or it will fall.
    不要碰木勺，否则它会掉下来。

Notice again how text always lines up on 4-space indents (including
that last line which continues item 3 above).
再次注意文本如何在4空格缩进处对齐（包括上面继续第3项的最后一行）。

Here's a link to [a website](http://foo.bar), to a [local
doc](local-doc.html), and to a [section heading in the current
doc](#an-h2-header). Here's a footnote [^1].
这是一个指向[网站](http://foo.bar)的链接，指向[本地文档](local-doc.html)的链接，以及指向[当前文档中的章节标题](#an-h2-header)的链接。这是一个脚注[^1]。

[^1]: Footnote text goes here.
[^1]: 脚注文本放在这里。

Tables can look like this:
表格可以像这样：

size material color

---

9 leather brown
10 hemp canvas natural
11 glass transparent

Table: Shoes, their sizes, and what they're made of
表格：鞋子、尺寸及材质

(The above is the caption for the table.) Pandoc also supports
multi-line tables:
（以上是表格的标题。）Pandoc也支持多行表格：

---

keyword text

---

red Sunsets, apples, and
other red or reddish
things.

green Leaves, grass, frogs
and other things it's
not easy being.

---

A horizontal rule follows.
接下来是一条水平线。

---

Here's a definition list:
这是一个定义列表：

apples
: Good for making applesauce.
苹果
: 适合做苹果酱。

oranges
: Citrus!
橙子
: 柑橘类水果！

tomatoes
: There's no "e" in tomatoe.
番茄
: "tomato"中没有"e"。

Again, text is indented 4 spaces. (Put a blank line between each
term/definition pair to spread things out more.)
同样，文本缩进4个空格。（在每个术语/定义对之间加空行可以使内容更分散。）

Here's a "line block":
这是一个"行块"：

| Line one
| 第一行
| Line too
| 第二行
| Line tree
| 第三行

and images can be specified like so:
图片可以这样指定：

[//]: # (![example image]&#40;./demo-banner.png "An exemplary image"&#41;)

Inline math equations go in like so: $\omega = d\phi / dt$. Display
math should get its own line and be put in in double-dollarsigns:
行内数学公式这样插入：$\omega = d\phi / dt$。显示数学应独占一行并用双美元符号包围：

$$I = \int \rho R^{2} dV$$

$$
\begin{equation*}
\pi
=3.1415926535
 \;8979323846\;2643383279\;5028841971\;6939937510\;5820974944
 \;5923078164\;0628620899\;8628034825\;3421170679\;\ldots
\end{equation*}
$$

And note that you can backslash-escape any punctuation characters
which you wish to be displayed literally, ex.: \`foo\`, \*bar\*, etc.
并且注意，你可以用反斜杠转义任何你想原样显示的标点字符，例如：\`foo\`, \*bar\*等。
