declare module "@types/pagefind" {
	interface PagefindResult {
		url: string;
		meta: {
			title: string;
		};
		excerpt: string;
		content?: string;
		word_count?: number;
		filters?: Record<string, unknown>;
		anchors?: Array<{
			element: string;
			id: string;
			text: string;
			location: number;
		}>;
		weighted_locations?: Array<{
			weight: number;
			balanced_score: number;
			location: number;
		}>;
		locations?: number[];
		raw_content?: string;
		raw_url?: string;
		sub_results?: PagefindResult[];
	}

	interface PagefindSearchResult {
		results: Array<{
			data: () => Promise<PagefindResult>;
		}>;
	}

	interface PagefindApi {
		init(): Promise<void>;
		preload(term: string): void;
		debouncedSearch(
			term: string,
			options: Record<string, unknown>,
			debounceMs: number,
		): Promise<PagefindSearchResult | null>;
	}

	export type { PagefindApi, PagefindResult, PagefindSearchResult };
}
