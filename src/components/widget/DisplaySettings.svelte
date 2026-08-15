<script lang="ts">
import Icon from "@iconify/svelte";
import { getDefaultHue, getHue, setHue } from "@utils/setting-utils";
import { onDestroy, onMount } from "svelte";
import { createPanelManager } from "../atoms/panel-manager";

let hue = $state(getHue());
const defaultHue = getDefaultHue();
let panelEl: HTMLDivElement;

const panel = createPanelManager({
	id: "display-settings",
	closeStrategy: ["clickOutside", "escape"],
	defaultOpen: false,
});

function resetHue() {
	hue = getDefaultHue();
}
$effect(() => setHue(hue));

onMount(() => {
	const triggerBtn = document.getElementById(
		"display-settings-switch",
	) as HTMLButtonElement | null;
	triggerBtn?.addEventListener("click", () => panel.toggle());
	panel.mount({ trigger: triggerBtn, content: panelEl });
});
onDestroy(() => panel.destroy());
</script>

<div bind:this={panelEl} id="display-setting" class="float-panel float-panel-closed absolute transition-all w-80 right-4 px-4 py-4">
  <div class="flex flex-row gap-2 mb-3 items-center justify-between">
    <div class="flex gap-2 font-bold text-lg text-neutral-900 dark:text-neutral-100 transition relative ml-3 before:w-1 before:h-4 before:rounded-md before:bg-(--primary) before:absolute before:-left-3 before:top-[0.33rem]">
      主题色
      <button aria-label="Reset to Default" class="btn-regular w-7 h-7 rounded-md active:scale-90 will-change-transform" class:opacity-0={hue === defaultHue} class:pointer-events-none={hue === defaultHue} onclick={resetHue}>
        <div class="text-(--btn-content)"><Icon icon="fa7-solid:arrow-rotate-left" class="text-[0.875rem]"></Icon></div>
      </button>
    </div>
    <div id="hueValue" class="transition bg-(--btn-regular-bg) w-10 h-7 rounded-md flex justify-center font-bold text-sm items-center text-(--btn-content)">{hue}</div>
  </div>
  <div class="w-full h-6 px-1 bg-[oklch(0.80_0.10_0)] dark:bg-[oklch(0.70_0.10_0)] rounded-sm select-none">
    <input aria-label="主题色" type="range" min="0" max="360" bind:value={hue} class="slider" id="colorSlider" step="5" style="width: 100%">
  </div>
</div>

<style>
  #display-setting input[type="range"] { -webkit-appearance: none; appearance: none; height: 1.5rem; cursor: pointer; }
  #display-setting input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; height: 0; width: 0; border: 0; background: transparent; box-shadow: none; }
  #display-setting input[type="range"]::-moz-range-thumb { height: 0; width: 0; border: 0; background: transparent; box-shadow: none; }
  #display-setting #colorSlider { background-image: var(--color-selection-bar); transition: background-image 0.15s ease-in-out; border: none; border-radius: 0; }
  #display-setting #colorSlider::-webkit-slider-thumb { -webkit-appearance: none; height: 1rem; width: 0.5rem; border-radius: 0.125rem; background: rgba(255,255,255,0.7); box-shadow: none; }
  #display-setting #colorSlider::-webkit-slider-thumb:hover { background: rgba(255,255,255,0.8); }
  #display-setting #colorSlider::-webkit-slider-thumb:active { background: rgba(255,255,255,0.6); }
  #display-setting #colorSlider::-moz-range-thumb { -webkit-appearance: none; height: 1rem; width: 0.5rem; border-radius: 0.125rem; border-width: 0; background: rgba(255,255,255,0.7); box-shadow: none; }
</style>
