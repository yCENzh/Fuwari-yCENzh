export type CloseStrategy =
	| "clickOutside"
	| "hover"
	| "blur"
	| "escape"
	| "manual";

export interface PanelConfig {
	id: string;
	defaultOpen?: boolean;
	closeStrategy?: CloseStrategy | CloseStrategy[];
	closeStrategyOptions?: {
		hoverDelay?: number;
		blurDelay?: number;
		escapeKey?: boolean;
	};
	onOpen?: () => void;
	onClose?: () => void;
}

export interface PanelManager {
	readonly id: string;
	readonly isOpen: boolean;
	open(): void;
	close(): void;
	toggle(): void;
	mount(params: {
		trigger: HTMLElement | HTMLElement[] | null;
		content: HTMLElement;
		getTrigger?: () => HTMLElement | HTMLElement[] | null;
	}): () => void;
	destroy(): void;
}

// --- internal ---

let topZ = 50;
const globalAny = globalThis as Record<string, unknown>;
let allPanels: Set<PanelManagerImpl>;
if (globalAny.__panelManagers) {
	allPanels = globalAny.__panelManagers as Set<PanelManagerImpl>;
} else {
	allPanels = new Set<PanelManagerImpl>();
	globalAny.__panelManagers = allPanels;
}

type StrategyCtx = {
	cfg: {
		closeStrategyOptions: Required<
			NonNullable<PanelConfig["closeStrategyOptions"]>
		>;
	};
	getTriggers: () => HTMLElement[];
	panelEl: HTMLElement;
	cleanups: (() => void)[];
	manager: PanelManagerImpl;
};

class PanelManagerImpl implements PanelManager {
	readonly id: string;
	private _open = false;
	private cfg: {
		closeStrategy: CloseStrategy[];
		closeStrategyOptions: Required<
			NonNullable<PanelConfig["closeStrategyOptions"]>
		>;
		onOpen: () => void;
		onClose: () => void;
	};
	private triggers: HTMLElement[] = [];
	private panelEl: HTMLElement | null = null;
	private cleanups: (() => void)[] = [];
	private mounted = false;
	private savedZ = "";

	constructor(config: PanelConfig) {
		this.id = config.id;
		this._open = config.defaultOpen ?? false;
		allPanels.add(this);
		this.cfg = {
			closeStrategy: Array.isArray(config.closeStrategy)
				? config.closeStrategy
				: [config.closeStrategy ?? "manual"],
			closeStrategyOptions: {
				hoverDelay: 150,
				blurDelay: 200,
				escapeKey: true,
				...config.closeStrategyOptions,
			},
			onOpen: config.onOpen ?? (() => {}),
			onClose: config.onClose ?? (() => {}),
		};
	}

	get isOpen() {
		return this._open;
	}
	open() {
		this.setOpen(true);
	}
	close() {
		this.setOpen(false);
	}
	toggle() {
		this.setOpen(!this._open);
	}

	private setOpen(v: boolean) {
		if (this._open === v) return;
		if (v)
			allPanels.forEach((p) => {
				if (p !== this && p._open) p.close();
			});
		this._open = v;
		this.panelEl?.classList.toggle("float-panel-closed", !v);
		if (v) {
			topZ++;
			this.savedZ = this.panelEl?.style.zIndex || "";
			if (this.panelEl) this.panelEl.style.zIndex = String(topZ);
			this.cfg.onOpen();
		} else {
			if (this.panelEl) this.panelEl.style.zIndex = this.savedZ;
			this.cfg.onClose();
		}
	}

	mount({
		trigger,
		content,
		getTrigger,
	}: {
		trigger: HTMLElement | HTMLElement[] | null;
		content: HTMLElement;
		getTrigger?: () => HTMLElement | HTMLElement[] | null;
	}) {
		if (this.mounted) return () => {};
		this.panelEl = content;
		const raw = trigger ?? getTrigger?.() ?? [];
		this.triggers = Array.isArray(raw) ? raw : [raw];
		this.mounted = true;
		this.panelEl.classList.toggle("float-panel-closed", !this._open);
		const ctx: StrategyCtx = {
			cfg: this.cfg,
			getTriggers: () => this.triggers,
			panelEl: content,
			cleanups: this.cleanups,
			manager: this,
		};
		for (const s of this.cfg.closeStrategy) {
			STRATEGIES[s]?.(ctx);
		}
		return () => this.destroy();
	}

	destroy() {
		for (const f of this.cleanups) {
			f();
		}
		this.cleanups = [];
		this.mounted = false;
		this.panelEl = null;
		this.triggers = [];
		allPanels.delete(this);
	}
}

function setupClickOutside(ctx: StrategyCtx) {
	const h = (e: MouseEvent) => {
		const t = e.target as Node;
		if (
			!ctx.getTriggers().some((x) => x.contains(t)) &&
			!ctx.panelEl.contains(t)
		)
			ctx.manager.close();
	};
	document.addEventListener("click", h, true);
	ctx.cleanups.push(() => document.removeEventListener("click", h, true));
}

function setupHover(ctx: StrategyCtx) {
	const delay = ctx.cfg.closeStrategyOptions.hoverDelay;
	let timer: ReturnType<typeof setTimeout>;
	let overT = false;
	let overP = false;
	const schedule = () => {
		if (timer) clearTimeout(timer);
		timer = setTimeout(() => {
			if (!overT && !overP) ctx.manager.close();
		}, delay);
	};
	const onTE = () => {
		overT = true;
		if (timer) clearTimeout(timer);
	};
	const onTL = () => {
		overT = false;
		schedule();
	};
	const onPE = () => {
		overP = true;
		if (timer) clearTimeout(timer);
	};
	const onPL = () => {
		overP = false;
		schedule();
	};
	ctx.getTriggers().forEach((el) => {
		el.addEventListener("mouseenter", onTE);
		el.addEventListener("mouseleave", onTL);
		ctx.cleanups.push(() => {
			el.removeEventListener("mouseenter", onTE);
			el.removeEventListener("mouseleave", onTL);
		});
	});
	ctx.panelEl.addEventListener("mouseenter", onPE);
	ctx.panelEl.addEventListener("mouseleave", onPL);
	ctx.cleanups.push(() => {
		ctx.panelEl.removeEventListener("mouseenter", onPE);
		ctx.panelEl.removeEventListener("mouseleave", onPL);
	});
}

function setupBlur(ctx: StrategyCtx) {
	const delay = ctx.cfg.closeStrategyOptions.blurDelay;
	let timer: ReturnType<typeof setTimeout>;
	const schedule = () => {
		if (timer) clearTimeout(timer);
		timer = setTimeout(() => ctx.manager.close(), delay);
	};
	const cancel = () => {
		if (timer) clearTimeout(timer);
	};
	[...ctx.getTriggers(), ctx.panelEl].forEach((el) => {
		el.addEventListener("focusin", cancel);
		el.addEventListener("focusout", schedule);
		ctx.cleanups.push(() => {
			el.removeEventListener("focusin", cancel);
			el.removeEventListener("focusout", schedule);
		});
	});
}

function setupEscape(ctx: StrategyCtx) {
	if (!ctx.cfg.closeStrategyOptions.escapeKey) return;
	const h = (e: KeyboardEvent) => {
		if (e.key === "Escape") ctx.manager.close();
	};
	document.addEventListener("keydown", h);
	ctx.cleanups.push(() => document.removeEventListener("keydown", h));
}

const STRATEGIES: Record<CloseStrategy, (ctx: StrategyCtx) => void> = {
	clickOutside: setupClickOutside,
	hover: setupHover,
	blur: setupBlur,
	escape: setupEscape,
	manual: () => {},
};

export function createPanelManager(config: PanelConfig): PanelManager {
	return new PanelManagerImpl(config);
}
