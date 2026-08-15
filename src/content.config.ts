import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

export const postSchema = z.object({
	title: z.string(),
	published: z.date(),
	updated: z.date().optional(),
	draft: z.boolean().optional().default(false),
	description: z.string().optional().default(""),
	image: z.string().optional().default(""),
	tags: z.array(z.string()).optional().default([]),
	category: z.string().optional().nullable().default(""),

	pinned: z.boolean().optional().default(false),
});

const postsCollection = defineCollection({
	loader: glob({
		pattern: "**/*.{md,mdx}",
		base: "./src/content/posts/",
		// 使用完整相对路径作为 id，保留目录结构
		// index.md 文件保留 /index 后缀，确保 getDir() 能正确提取目录
		generateId: ({ entry }) => entry.replace(/\.mdx?$/, ""),
	}),
	schema: postSchema,
});

const specCollection = defineCollection({
	loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/spec/" }),
	schema: z.object({}),
});

export const collections = {
	posts: postsCollection,
	spec: specCollection,
} as const;
