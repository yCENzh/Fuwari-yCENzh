import { type CollectionEntry, getCollection, render } from "astro:content";
import { getCategoryUrl } from "@utils/url-utils.ts";

// 缓存已渲染的文章元数据
const renderedPostsCache = new Map<
	string,
	{ excerpt: string; words: number; minutes: number }
>();

// 缓存排序后的文章列表
let sortedPostsCache: CollectionEntry<"posts">[] | null = null;

// 发布状态过滤函数 - 统一用于所有 Collection 查询
export function isPublished({ data }: { data: { draft?: boolean } }): boolean {
	return import.meta.env.PROD ? data.draft !== true : true;
}

async function getRawSortedPosts(): Promise<CollectionEntry<"posts">[]> {
	if (sortedPostsCache) return sortedPostsCache;

	const allBlogPosts = await getCollection("posts", isPublished);

	sortedPostsCache = allBlogPosts.sort((a, b) => {
		if (a.data.pinned && !b.data.pinned) return -1;
		if (!a.data.pinned && b.data.pinned) return 1;
		const dateA = new Date(a.data.published);
		const dateB = new Date(b.data.published);
		if (dateA > dateB) return -1;
		if (dateA < dateB) return 1;
		return 0;
	});
	return sortedPostsCache;
}

async function prerenderPostsMetadata(posts: CollectionEntry<"posts">[]) {
	const results = new Map<
		string,
		{ excerpt: string; words: number; minutes: number }
	>();

	await Promise.all(
		posts.map(async (post) => {
			if (renderedPostsCache.has(post.id)) {
				results.set(
					post.id,
					renderedPostsCache.get(post.id) as {
						excerpt: string;
						words: number;
						minutes: number;
					},
				);
				return;
			}

			const { remarkPluginFrontmatter } = await render(post);
			const metadata = {
				excerpt: remarkPluginFrontmatter.excerpt || "",
				words: remarkPluginFrontmatter.words || 0,
				minutes: remarkPluginFrontmatter.minutes || 1,
			};
			renderedPostsCache.set(post.id, metadata);
			results.set(post.id, metadata);
		}),
	);

	return results;
}

export async function getSortedPosts(): Promise<CollectionEntry<"posts">[]> {
	return await getRawSortedPosts();
}

export interface PostNav {
	slug: string;
	title: string;
}

export async function getPostNav(
	slug: string,
): Promise<{ prev: PostNav | null; next: PostNav | null }> {
	const sorted = await getSortedPosts();
	const idx = sorted.findIndex((p) => p.id === slug);
	if (idx === -1) return { prev: null, next: null };
	return {
		prev:
			idx < sorted.length - 1
				? { slug: sorted[idx + 1].id, title: sorted[idx + 1].data.title }
				: null,
		next:
			idx > 0
				? { slug: sorted[idx - 1].id, title: sorted[idx - 1].data.title }
				: null,
	};
}

// 带预渲染元数据的文章类型
export type PostWithMetadata = CollectionEntry<"posts"> & {
	metadata: {
		excerpt: string;
		words: number;
		minutes: number;
	};
};

// 获取带预渲染元数据的文章列表
export async function getSortedPostsWithMetadata(): Promise<
	PostWithMetadata[]
> {
	const sorted = await getSortedPosts();
	const metadataMap = await prerenderPostsMetadata(sorted);

	return sorted.map((post) => ({
		...post,
		metadata: metadataMap.get(post.id) || { excerpt: "", words: 0, minutes: 1 },
	}));
}
export type PostForList = {
	id: string;
	data: CollectionEntry<"posts">["data"];
};
export async function getSortedPostsList(): Promise<PostForList[]> {
	const sortedFullPosts = await getRawSortedPosts();
	// delete post.body
	const sortedPostsList = sortedFullPosts.map((post) => ({
		id: post.id,
		data: post.data,
	}));

	return sortedPostsList;
}
export type Tag = {
	name: string;
	count: number;
};

export async function getTagList(): Promise<Tag[]> {
	const allBlogPosts = await getCollection("posts", isPublished);

	const countMap: { [key: string]: number } = {};
	allBlogPosts.forEach((post: { data: { tags: string[] } }) => {
		post.data.tags.forEach((tag: string) => {
			if (!countMap[tag]) countMap[tag] = 0;
			countMap[tag]++;
		});
	});

	// sort tags
	const keys: string[] = Object.keys(countMap).sort((a, b) => {
		return a.toLowerCase().localeCompare(b.toLowerCase());
	});

	return keys.map((key) => ({ name: key, count: countMap[key] }));
}

export type Category = {
	name: string;
	count: number;
	url: string;
};

export async function getCategoryList(): Promise<Category[]> {
	const allBlogPosts = await getCollection("posts", isPublished);
	const count: { [key: string]: number } = {};
	allBlogPosts.forEach((post: { data: { category: string | null } }) => {
		if (!post.data.category) {
			// 不再为未分类的文章创建"未分类"分类
			return;
		}

		const categoryName =
			typeof post.data.category === "string"
				? post.data.category.trim()
				: String(post.data.category).trim();

		count[categoryName] = count[categoryName] ? count[categoryName] + 1 : 1;
	});

	const lst = Object.keys(count).sort((a, b) => {
		return a.toLowerCase().localeCompare(b.toLowerCase());
	});

	const ret: Category[] = [];
	for (const c of lst) {
		ret.push({
			name: c,
			count: count[c],
			url: getCategoryUrl(c),
		});
	}
	return ret;
}
