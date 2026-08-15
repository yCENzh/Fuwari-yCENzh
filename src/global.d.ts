import type { PagefindApi } from "@types/pagefind";
import type { Swup } from "swup";

declare global {
	interface Window {
		swup: Swup;
		pagefind: PagefindApi;
	}
}
