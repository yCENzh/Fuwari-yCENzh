<script lang="ts">
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import Icon from "@iconify/svelte";
import { url } from "@utils/url-utils.ts";
import { onMount, onDestroy } from "svelte";
import type { SearchResult } from "@/global";

// 搜索状态变量
let keywordDesktop = "";
let keywordMobile = "";
let result: SearchResult[] = [];
let isSearching = false;
let pagefindLoaded = false;
let initialized = false;

// 防抖定时器ID
let debounceTimer: number | null = null;

// 开发环境下的模拟搜索结果
const fakeResult: SearchResult[] = [
    {
        url: url("/"),
        meta: {
            title: "This Is a Fake Search Result",
        },
        excerpt:
            "Because the search cannot work in the <mark>dev</mark> environment.",
    },
    {
        url: url("/"),
        meta: {
            title: "If You Want to Test the Search",
        },
        excerpt: "Try running <mark>npm build && npm preview</mark> instead.",
    },
];

/**
 * 切换搜索面板的可见性
 */
const togglePanel = () => {
    const panel = document.getElementById("search-panel");
    panel?.classList.toggle("float-panel-closed");
};

/**
 * 设置搜索面板的可见性
 * @param show 是否显示面板
 * @param isDesktop 是否是桌面端
 */
const setPanelVisibility = (show: boolean, isDesktop: boolean): void => {
    const panel = document.getElementById("search-panel");
    if (!panel || !isDesktop) return;

    if (show) {
        panel.classList.remove("float-panel-closed");
    } else {
        panel.classList.add("float-panel-closed");
    }
};

/**
 * 防抖函数，避免频繁搜索
 * @param func 要执行的函数
 * @param delay 延迟时间(毫秒)
 * @returns 防抖后的函数
 */
const debounce = (func: Function, delay: number) => {
    return (...args: any[]) => {
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func(...args), delay);
    };
};

/**
 * 执行搜索操作
 * @param keyword 搜索关键词
 * @param isDesktop 是否是桌面端
 */
const performSearch = async (keyword: string, isDesktop: boolean): Promise<void> => {
    // 空关键词处理
    if (!keyword.trim()) {
        setPanelVisibility(false, isDesktop);
        result = [];
        return;
    }

    // 确保搜索已初始化
    if (!initialized) {
        console.warn("Search not initialized yet");
        return;
    }

    isSearching = true;

    try {
        let searchResults: SearchResult[] = [];

        // 生产环境使用Pagefind搜索
        if (import.meta.env.PROD && pagefindLoaded && window.pagefind) {
            console.log(`Searching for: "${keyword}"`);
            const response = await window.pagefind.search(keyword);
            searchResults = await Promise.all(
                response.results.map((item) => item.data())
            );
        } 
        // 开发环境使用模拟数据
        else if (import.meta.env.DEV) {
            console.log(`Development search for: "${keyword}"`);
            searchResults = fakeResult;
        } 
        // 生产环境但Pagefind不可用
        else {
            console.error("Pagefind is not available in production environment.");
            searchResults = [];
        }

        result = searchResults;
        setPanelVisibility(result.length > 0, isDesktop);
    } catch (error) {
        console.error("Search error:", error);
        result = [];
        setPanelVisibility(false, isDesktop);
    } finally {
        isSearching = false;
    }
};

// 创建防抖版本的搜索函数（300毫秒延迟）
const debouncedSearch = debounce(performSearch, 300);

/**
 * 初始化搜索功能
 */
const initializeSearch = () => {
    initialized = true;
    
    // 检查Pagefind是否可用
    pagefindLoaded = 
        typeof window !== "undefined" &&
        !!window.pagefind &&
        typeof window.pagefind.search === "function";
    
    console.log("Pagefind status:", pagefindLoaded);
    
    // 如果有待处理的搜索词，执行搜索
    if (keywordDesktop) debouncedSearch(keywordDesktop, true);
    if (keywordMobile) debouncedSearch(keywordMobile, false);
};

// 组件挂载时执行
onMount(() => {
    // 开发环境直接初始化
    if (import.meta.env.DEV) {
        console.log("Development mode: Using mock search data");
        initializeSearch();
    } 
    // 生产环境监听Pagefind事件
    else {
        const handlePagefindReady = () => {
            console.log("Pagefind ready event received.");
            initializeSearch();
        };

        const handlePagefindError = () => {
            console.warn("Pagefind load error event received.");
            initializeSearch(); // 即使出错也初始化，但pagefindLoaded为false
        };

        // 添加事件监听器
        document.addEventListener("pagefindready", handlePagefindReady);
        document.addEventListener("pagefindloaderror", handlePagefindError);

        // 超时回退机制
        const timeoutId = setTimeout(() => {
            if (!initialized) {
                console.warn("Fallback: Initializing search after timeout.");
                initializeSearch();
            }
        }, 2000);

        // 组件卸载时清理
        onDestroy(() => {
            document.removeEventListener("pagefindready", handlePagefindReady);
            document.removeEventListener("pagefindloaderror", handlePagefindError);
            clearTimeout(timeoutId);
            if (debounceTimer) clearTimeout(debounceTimer);
        });
    }
});

// 响应式语句：当桌面端关键词变化时执行搜索
$: if (initialized && keywordDesktop) {
    debouncedSearch(keywordDesktop, true);
}

// 响应式语句：当移动端关键词变化时执行搜索
$: if (initialized && keywordMobile) {
    debouncedSearch(keywordMobile, false);
}
</script>

<!-- 桌面端搜索栏 -->
<div 
    id="search-bar" 
    class="hidden lg:flex transition-all items-center h-11 mr-2 rounded-lg
           bg-black/[0.04] hover:bg-black/[0.06] focus-within:bg-black/[0.06]
           dark:bg-white/5 dark:hover:bg-white/10 dark:focus-within:bg-white/10"
>
    <Icon 
        icon="material-symbols:search" 
        class="absolute text-[1.25rem] pointer-events-none ml-3 transition my-auto 
               text-black/30 dark:text-white/30"
    />
    <input 
        placeholder="{i18n(I18nKey.search)}" 
        bind:value={keywordDesktop}
        on:focus={() => debouncedSearch(keywordDesktop, true)}
        class="transition-all pl-10 text-sm bg-transparent outline-0
               h-full w-40 active:w-60 focus:w-60 text-black/50 dark:text-white/50"
    />
</div>

<!-- 移动端搜索切换按钮 -->
<button 
    on:click={togglePanel} 
    aria-label="Search Panel" 
    id="search-switch"
    class="btn-plain scale-animation lg:!hidden rounded-lg w-11 h-11 active:scale-90"
>
    <Icon icon="material-symbols:search" class="text-[1.25rem]" />
</button>

<!-- 搜索面板 -->
<div 
    id="search-panel" 
    class="float-panel float-panel-closed search-panel absolute md:w-[30rem]
           top-20 left-4 md:left-[unset] right-4 shadow-2xl rounded-2xl p-2"
>
    <!-- 移动端搜索输入框 -->
    <div 
        id="search-bar-inside" 
        class="flex relative lg:hidden transition-all items-center h-11 rounded-xl
               bg-black/[0.04] hover:bg-black/[0.06] focus-within:bg-black/[0.06]
               dark:bg-white/5 dark:hover:bg-white/10 dark:focus-within:bg-white/10"
    >
        <Icon 
            icon="material-symbols:search" 
            class="absolute text-[1.25rem] pointer-events-none ml-3 transition my-auto 
                   text-black/30 dark:text-white/30"
        />
        <input 
            placeholder="Search" 
            bind:value={keywordMobile}
            class="pl-10 absolute inset-0 text-sm bg-transparent outline-0
                   focus:w-60 text-black/50 dark:text-white/50"
        />
    </div>

    <!-- 搜索状态指示器 -->
    {#if isSearching}
        <div class="flex justify-center items-center py-4">
            <Icon 
                icon="svg-spinners:3-dots-fade" 
                class="text-[2rem] text-[var(--primary)]" 
            />
        </div>
    {:else if result.length === 0 && (keywordDesktop || keywordMobile)}
        <div class="text-center py-6 text-50">
            {i18n(I18nKey.noResults)}
        </div>
    {/if}

    <!-- 搜索结果列表 -->
    {#each result as item}
        <a 
            href={item.url}
            class="transition first-of-type:mt-2 lg:first-of-type:mt-0 group block
                   rounded-xl text-lg px-3 py-2 hover:bg-[var(--btn-plain-bg-hover)] 
                   active:bg-[var(--btn-plain-bg-active)]"
        >
            <div class="transition text-90 inline-flex font-bold group-hover:text-[var(--primary)]">
                {item.meta.title}
                <Icon 
                    icon="fa6-solid:chevron-right" 
                    class="transition text-[0.75rem] translate-x-1 my-auto 
                           text-[var(--primary)] opacity-0 group-hover:opacity-100"
                />
            </div>
            <div class="transition text-sm text-50">
                {@html item.excerpt}
            </div>
        </a>
    {/each}
</div>

<style>
    input:focus {
        outline: 0;
    }
    
    .search-panel {
        max-height: calc(100vh - 100px);
        overflow-y: auto;
        z-index: 100; /* 确保面板在其他内容之上 */
        transition: transform 0.3s ease, opacity 0.3s ease;
        
        /* 自定义滚动条 - 更细更美观 */
        scrollbar-width: thin; /* 支持Firefox */
        scrollbar-color: rgba(128, 128, 128, 0.3) transparent; /* Firefox支持 */
    }
    
    /* Webkit浏览器滚动条样式 */
    .search-panel::-webkit-scrollbar {
        width: 5px; /* 更细的滚动条宽度 */
    }
    
    .search-panel::-webkit-scrollbar-track {
        background: transparent;
        border-radius: 3px;
        margin: 8px 0;
    }
    
    .search-panel::-webkit-scrollbar-thumb {
        background: rgba(128, 128, 128, 0.3);
        border-radius: 3px;
        transition: background 0.2s ease;
    }
    
    .search-panel::-webkit-scrollbar-thumb:hover {
        background: rgba(128, 128, 128, 0.5);
    }
    
    /* 深色模式滚动条样式 */
    .dark .search-panel::-webkit-scrollbar-thumb {
        background: rgba(200, 200, 200, 0.3);
    }
    
    .dark .search-panel::-webkit-scrollbar-thumb:hover {
        background: rgba(200, 200, 200, 0.5);
    }
    
    .float-panel-closed {
        transform: translateY(20px);
        opacity: 0;
        pointer-events: none;
    }
</style>
