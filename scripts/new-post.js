/* 这是一个用于创建带有 front-matter 的新文章 markdown 文件的脚本 */

import fs from "fs"
import path from "path"

// 获取当前日期的函数，格式为 YYYY-MM-DD
function getDate() {
  const today = new Date()
  return today.toISOString().split("T")[0]
}

// 获取命令行参数
const args = process.argv.slice(2)

// 检查是否提供了文件名参数
if (args.length === 0) {
  console.error(`错误: 未提供文件名参数
用法: npm run new-post -- <filename>`)
  process.exit(1) // 终止脚本并返回错误代码 1
}

let fileName = args[0]

// 如果文件名不包含 .md 或 .mdx 扩展名，则添加 .md
const fileExtensionRegex = /\.(md|mdx)$/i
if (!fileExtensionRegex.test(fileName)) {
  fileName += ".md"
}

// 定义目标目录
const targetDir = "./src/content/posts/"

// 使用 path.resolve 获取绝对路径
const fullPath = path.resolve(targetDir, fileName)

// 检查文件是否已存在
if (fs.existsSync(fullPath)) {
  console.error(`错误: 文件 ${fullPath} 已存在`)
  process.exit(1)
}

// 如果目录不存在，则创建目录
const dirPath = path.dirname(fullPath)
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath, { recursive: true })
}

// 生成 front-matter 内容
// 使用文件名（去掉扩展名）作为默认标题
const title = fileName.replace(fileExtensionRegex, "")
const content = `---
title: ${title}
published: ${getDate()}
description: ''
image: ''
tags: []
category: ''
draft: false 
lang: ''
---
`

// 写入文件
fs.writeFileSync(fullPath, content)

// 输出成功消息
console.log(`文章 ${fullPath} 已创建`)