import { loadRenderers } from "astro:container";
import { render } from "astro:content";
import { getContainerRenderer as getMDXRenderer } from "@astrojs/mdx/container-renderer";
import rss, { type RSSFeedItem } from "@astrojs/rss";
import { getSortedPosts } from "@utils/content-utils";
import { url } from "@utils/url-utils";
import type { APIContext } from "astro";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { transform, walk } from "ultrahtml";
import sanitize from "ultrahtml/transformers/sanitize";
import { siteConfig } from "@/config";

export async function GET(context: APIContext): Promise<Response> {
	const baseUrl = context.site?.href || "https://fuwari.oh1.top/";
	const blog = await getSortedPosts();
	const renderers = await loadRenderers([getMDXRenderer()]);
	const container = await AstroContainer.create({ renderers });
	const feedItems: RSSFeedItem[] = [];

	for (const post of blog) {
		const { Content } = await render(post);
		const rawContent = await container.renderToString(Content);

		// 处理内容：移除 DOCTYPE，转换相对路径为绝对路径，清理脚本和样式
		const content = await transform(
			rawContent.replace(/^<!DOCTYPE html>/, ""),
			[
				async (node) => {
					await walk(node, (n) => {
						if (n.name === "a" && n.attributes.href?.startsWith("/")) {
							n.attributes.href = baseUrl + n.attributes.href;
						}
						if (n.name === "img" && n.attributes.src?.startsWith("/")) {
							n.attributes.src = baseUrl + n.attributes.src;
						}
					});
					return node;
				},
				sanitize({ dropElements: ["script", "style"] }),
			],
		);

		feedItems.push({
			title: post.data.title,
			pubDate: post.data.published,
			description: post.data.description || "",
			link: url(`/posts/${post.id.replace(/\/index$/, "")}/`),
			content,
		});
	}

	return rss({
		title: siteConfig.title,
		description: siteConfig.subtitle || "No description",
		site: baseUrl,
		items: feedItems,
		customData: "<language>zh-CN</language>",
	});
}
