export type HookCallback = (...args: unknown[]) => void;

type HookName =
	| "page:view"
	| "visit:start"
	| "visit:end"
	| "link:click"
	| "visit:swap"
	| "content:replace";
type HookCb = HookCallback;

const queue = new Map<HookName, HookCb[]>();

function flush() {
	if (!window.swup) return;
	for (const [h, cbs] of queue) {
		for (const cb of cbs) {
			window.swup?.hooks.on(h, cb);
		}
	}
	queue.clear();
}

function ensure() {
	if (window.swup) flush();
	else document.addEventListener("swup:enable", flush, { once: true });
}

function on(name: HookName, cb: HookCb) {
	const cbs = queue.get(name) || [];
	cbs.push(cb);
	queue.set(name, cbs);
	ensure();
}

export const onPageView = (cb: HookCb) => on("page:view", cb);
export const onVisitStart = (cb: HookCb) => on("visit:start", cb);
export const onVisitEnd = (cb: HookCb) => on("visit:end", cb);
export const onLinkClick = (cb: HookCb) => on("link:click", cb);
export const onVisitSwap = (cb: HookCb) => on("visit:swap", cb);
export const onContentReplace = (cb: HookCb) => on("content:replace", cb);
