<script lang="ts">
import { AUTO_MODE, DARK_MODE, LIGHT_MODE } from "@constants/constants.ts";
import Icon from "@iconify/svelte";
import {
	applyThemeToDocument,
	getStoredTheme,
	setTheme,
} from "@utils/setting-utils.ts";
import type { LIGHT_DARK_MODE } from "@/types/config.ts";

const seq: LIGHT_DARK_MODE[] = [LIGHT_MODE, DARK_MODE, AUTO_MODE];
const icons: Record<LIGHT_DARK_MODE, string> = {
	[LIGHT_MODE]: "material-symbols:wb-sunny-outline-rounded",
	[DARK_MODE]: "material-symbols:dark-mode-outline-rounded",
	[AUTO_MODE]: "material-symbols:radio-button-partial-outline",
};

let mode = $state<LIGHT_DARK_MODE>(AUTO_MODE);

$effect(() => {
	mode = getStoredTheme();
	const mq = window.matchMedia("(prefers-color-scheme: dark)");
	const h = () => {
		if (mode === AUTO_MODE) applyThemeToDocument(AUTO_MODE);
	};
	mq.addEventListener("change", h);
	return () => mq.removeEventListener("change", h);
});

function toggle() {
	const next = seq[(seq.indexOf(mode) + 1) % seq.length];
	mode = next;
	setTheme(next);
	if (next === AUTO_MODE) applyThemeToDocument(AUTO_MODE);
}
</script>

<button aria-label="Light/Dark Mode" class="btn-plain scale-animation rounded-lg h-11 w-11 active:scale-90" onclick={toggle}>
  <Icon icon={icons[mode]} class="text-[1.25rem]" />
</button>
