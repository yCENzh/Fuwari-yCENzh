<script lang="ts">
import Icon from "@iconify/svelte";
import type { PagefindApi, PagefindResult } from "@types/pagefind";
import { url } from "@utils/url-utils";
import { onDestroy, onMount } from "svelte";
import { createPanelManager } from "./atoms/panel-manager";

let query = $state("");
let results = $state<PagefindResult[]>([]);
let loading = $state(false);
let pagefind: PagefindApi | null = null;

let desktopInput: HTMLInputElement;
let mobileInput: HTMLInputElement;
let mobileBtn: HTMLButtonElement;
let panelEl: HTMLDivElement;

const getTrigger = () =>
	window.innerWidth < 1024 ? [mobileInput, mobileBtn] : [desktopInput];

const panel = createPanelManager({
	id: "search-panel",
	closeStrategy: ["clickOutside", "blur", "escape"],
	closeStrategyOptions: { blurDelay: 200 },
	onClose: () => {
		query = "";
		results = [];
	},
});

function escapeHtml(t: string) {
	return t
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}
function highlightText(t: string, term: string) {
	if (!term || !t) return t;
	const st = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	return escapeHtml(t).replace(new RegExp(`(${st})`, "gi"), "<mark>$1</mark>");
}

async function loadPagefind() {
	if (pagefind) return pagefind;
	try {
		const p = url("/pagefind/pagefind.js");
		pagefind = (await import(/* @vite-ignore */ p)) as PagefindApi;
		await pagefind.init();
		return pagefind;
	} catch {
		console.warn("Pagefind not available");
		return null;
	}
}

async function onFocus() {
	if (query) panel.open();
	if (!pagefind) loadPagefind();
}

function handleResultClick(e: MouseEvent, u: string) {
	if (e.ctrlKey || e.metaKey || e.button === 1) return;
	e.preventDefault();
	panel.close();
	window.swup?.navigate(u);
}

async function handleSearch(term: string) {
	panel.open();
	if (!pagefind) {
		loading = true;
		await loadPagefind();
	}
	if (!pagefind) {
		loading = false;
		results = [];
		return;
	}
	loading = true;
	try {
		const s = await pagefind.debouncedSearch(term, {}, 300);
		if (!s) {
			loading = false;
			return;
		}
		const d = await Promise.all(s.results.slice(0, 10).map((r) => r.data()));
		results = d.map((r) => ({ url: r.url, meta: r.meta, excerpt: r.excerpt }));
	} catch (err) {
		console.warn("Pagefind search failed", err);
		results = [];
	} finally {
		loading = false;
	}
}

function onInput() {
	const t = query.trim();
	if (!t) {
		results = [];
		return;
	}
	if (pagefind) pagefind.preload(t);
	handleSearch(t);
}

onMount(() => panel.mount({ trigger: null, content: panelEl, getTrigger }));
onDestroy(() => panel.destroy());
</script>

<div class="relative">
  <div class="hidden lg:flex items-center h-11 mr-2 rounded-lg transition-colors bg-black/[0.04] hover:bg-black/[0.06] focus-within:bg-black/[0.06] dark:bg-white/5 dark:hover:bg-white/10 dark:focus-within:bg-white/10">
    <Icon icon="material-symbols:search-rounded" class="absolute text-xl ml-3 text-black/30 dark:text-white/30 pointer-events-none" />
    <input bind:this={desktopInput} placeholder="往事书" bind:value={query} oninput={onInput} onfocus={onFocus} class="pl-10 text-sm bg-transparent outline-hidden h-full w-40 focus:w-60 transition-all text-black/50 dark:text-white/50" />
  </div>

  <button bind:this={mobileBtn} onclick={() => panel.toggle()} aria-label="Search" class="btn-plain scale-animation lg:hidden! rounded-lg w-11 h-11 active:scale-90">
    <Icon icon="material-symbols:search-rounded" class="text-xl" />
  </button>

  <div bind:this={panelEl} class="float-panel float-panel-closed fixed md:absolute top-20 md:top-12 left-4 right-4 md:left-auto md:right-0 shadow-2xl w-auto md:w-120 z-50 max-h-[80vh] flex flex-col">
    <div class="flex relative lg:hidden items-center h-11 flex-shrink-0 bg-black/[0.04] dark:bg-white/5">
      <Icon icon="material-symbols:search-rounded" class="absolute text-xl ml-3 text-black/30 dark:text-white/30" />
      <input bind:this={mobileInput} placeholder="往事书" bind:value={query} oninput={onInput} onfocus={onFocus} class="pl-10 w-full h-full text-sm bg-transparent outline-hidden text-black/50 dark:text-white/50" />
    </div>

    <div class="overflow-y-auto overflow-x-hidden p-2 flex-1">
      {#if loading}
        <div class="flex items-center justify-center py-6 text-black/50 dark:text-white/50 gap-2">
          <Icon icon="svg-spinners:90-ring-with-bg" class="text-xl" />
          <span class="text-xs">搜索中...</span>
        </div>
      {:else if !query}
        <div class="text-center py-6 text-sm text-black/30 dark:text-white/30">搜点什么吧</div>
      {:else if !results.length}
        <div class="text-center py-6 text-sm text-black/40 dark:text-white/40">未找到结果</div>
      {:else}
        {#each results as item (item.url)}
          <a href={item.url} onclick={(e) => handleResultClick(e, item.url)} class="group block rounded-xl px-3 py-2 hover:bg-(--btn-plain-bg-hover) transition-colors">
            <div class="font-bold text-lg group-hover:text-(--primary) flex items-center transition-colors">
              <span>{@html highlightText(item.meta.title, query)}</span>
              <Icon icon="material-symbols:chevron-right-rounded" class="text-xs ml-1 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-(--primary)" />
            </div>
            <div class="text-xs text-black/40 dark:text-white/40 truncate mt-0.5">{item.url}</div>
            <div class="text-sm text-black/60 dark:text-white/60 line-clamp-2 leading-relaxed mt-1">{@html item.excerpt}</div>
          </a>
        {/each}
      {/if}
    </div>
  </div>
</div>

<style>
  :global(mark) { background-color: rgba(250,200,210,0.5); color: inherit; border-radius: 2px; padding: 0 2px; }
</style>
