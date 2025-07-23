<script lang="ts">
import { onMount } from "svelte";
import I18nKey from "../i18n/i18nKey";
import { i18n } from "../i18n/translation";
import { getPostUrlBySlug } from "../utils/url-utils";

// 定义组件接收的属性
export let tags: string[] = [];
export let categories: string[] = [];
export let sortedPosts: Post[] = [];

// 定义文章和年份分组的数据结构
interface Post {
    slug: string;
    data: {
        title: string;
        tags: string[];
        category?: string;
        published: Date;
    };
}

interface Group {
    year: number;
    posts: Post[];
}

// 存储分组后的文章数据
let groups: Group[] = [];

/**
 * 格式化日期为 MM-DD 格式
 * @param date 日期对象
 * @returns 格式化后的日期字符串
 */
function formatDate(date: Date) {
    return `${(date.getMonth() + 1).toString().padStart(2, "0")}-${date
        .getDate()
        .toString()
        .padStart(2, "0")}`;
}

/**
 * 格式化标签数组为 #标签1 #标签2 的字符串形式
 * @param tagList 标签数组
 * @returns 格式化后的标签字符串
 */
function formatTag(tagList: string[]) {
    return tagList?.map((t) => `#${t}`).join(" ") || "";
}

onMount(async () => {
    // 从URL查询参数中获取过滤条件
    const params = new URLSearchParams(window.location.search);
    const urlTags = params.getAll("tag");
    const urlCategories = params.getAll("category");
    const uncategorized = params.has("uncategorized");

    // 初始化为全部文章
    let filteredPosts: Post[] = [...sortedPosts];

    // 根据标签过滤
    if (urlTags.length > 0) {
        filteredPosts = filteredPosts.filter(
            (post) =>
                Array.isArray(post.data.tags) &&
                urlTags.some((tag) => post.data.tags.includes(tag))
        );
    }

    // 根据分类过滤
    if (urlCategories.length > 0) {
        filteredPosts = filteredPosts.filter(
            (post) => post.data.category && urlCategories.includes(post.data.category)
        );
    }

    // 过滤未分类文章
    if (uncategorized) {
        filteredPosts = filteredPosts.filter((post) => !post.data.category);
    }

    // 按年份分组文章
    const grouped = filteredPosts.reduce((acc, post) => {
        const year = post.data.published.getFullYear();
        if (!acc[year]) acc[year] = [];
        acc[year].push(post);
        return acc;
    }, {} as Record<number, Post[]>);

    // 将分组对象转换为数组并按年份降序排序
    groups = Object.entries(grouped)
        .map(([year, posts]) => ({
            year: parseInt(year),
            posts,
        }))
        .sort((a, b) => b.year - a.year);
});
</script>

<div class="card-base px-8 py-6">
    <!-- 按年份循环分组 -->
    {#each groups as group}
        <div>
            <!-- 年份标题行 -->
            <div class="flex flex-row w-full items-center h-[3.75rem]">
                <!-- 年份显示 -->
                <div class="w-[15%] md:w-[10%] transition text-2xl font-bold text-right text-75">
                    {group.year}
                </div>
                
                <!-- 年份标记点 -->
                <div class="w-[15%] md:w-[10%]">
                    <div class="h-3 w-3 bg-none rounded-full outline outline-[var(--primary)] mx-auto -outline-offset-[2px] z-50 outline-3"></div>
                </div>
                
                <!-- 文章数量统计 -->
                <div class="w-[70%] md:w-[80%] transition text-left text-50">
                    {group.posts.length} {i18n(group.posts.length === 1 ? I18nKey.postCount : I18nKey.postsCount)}
                </div>
            </div>

            <!-- 当前年份下的文章列表 -->
            {#each group.posts as post}
                <a
                    href={getPostUrlBySlug(post.slug)}
                    aria-label={post.data.title}
                    class="group btn-plain !block h-10 w-full rounded-lg hover:text-[initial]"
                >
                    <div class="flex flex-row justify-start items-center h-full">
                        <!-- 发布日期 -->
                        <div class="w-[15%] md:w-[10%] transition text-sm text-right text-50">
                            {formatDate(post.data.published)}
                        </div>

                        <!-- 时间线标记 -->
                        <div class="w-[15%] md:w-[10%] relative dash-line h-full flex items-center">
                            <div
                                class="transition-all mx-auto w-1 h-1 rounded group-hover:h-5
                                       bg-[oklch(0.5_0.05_var(--hue))] group-hover:bg-[var(--primary)]
                                       outline outline-4 z-50
                                       outline-[var(--card-bg)]
                                       group-hover:outline-[var(--btn-plain-bg-hover)]
                                       group-active:outline-[var(--btn-plain-bg-active)]"
                            ></div>
                        </div>

                        <!-- 文章标题 -->
                        <div
                            class="w-[70%] md:max-w-[65%] md:w-[65%] text-left font-bold
                                   group-hover:translate-x-1 transition-all group-hover:text-[var(--primary)]
                                   text-75 pr-8 whitespace-nowrap overflow-ellipsis overflow-hidden"
                        >
                            {post.data.title}
                        </div>

                        <!-- 文章标签（大屏显示） -->
                        <div
                            class="hidden md:block md:w-[15%] text-left text-sm transition
                                   whitespace-nowrap overflow-ellipsis overflow-hidden text-30"
                        >
                            {formatTag(post.data.tags)}
                        </div>
                    </div>
                </a>
            {/each}
        </div>
    {/each}
</div>
