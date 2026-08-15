export function onScrollThrottled(cb: (scrollY: number) => void) {
	let ticking = false;
	const handler = () => {
		if (ticking) return;
		ticking = true;
		requestAnimationFrame(() => {
			cb(window.scrollY);
			ticking = false;
		});
	};
	window.addEventListener("scroll", handler, { passive: true });
	return () => window.removeEventListener("scroll", handler);
}

export function createIntersectionObserver(
	targets: Element | Element[],
	callback: (entries: IntersectionObserverEntry[]) => void,
	options?: IntersectionObserverInit,
) {
	const observer = new IntersectionObserver(callback, options);
	const targetArray = Array.isArray(targets) ? targets : [targets];
	for (const el of targetArray) {
		observer.observe(el);
	}
	return {
		disconnect: () => observer.disconnect(),
		observe: (el: Element) => observer.observe(el),
		unobserve: (el: Element) => observer.unobserve(el),
	};
}
