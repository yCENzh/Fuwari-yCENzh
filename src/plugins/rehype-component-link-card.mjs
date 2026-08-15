/// <reference types="mdast" />
import { h } from "hastscript";

const CONSTANTS = {
	FAVICON_API: "https://www.google.com/s2/favicons",
	FAVICON_SIZE: 32,
	ID_PREFIX: "LC",
	LOADING_TITLE: "Loading...",
	LOADING_DESC: "Loading description...",
};

const ERRORS = {
	INVALID_DIRECTIVE:
		'Invalid directive. ("link-card" directive must be leaf type "::link-card{url="https://example.com"}")',
	INVALID_URL: 'Invalid URL. ("url" attribute must be a valid HTTP/HTTPS URL)',
};

function generateCardId() {
	const timestamp = Date.now().toString(36);
	const random = Math.random().toString(36).slice(2, 8);
	return `${CONSTANTS.ID_PREFIX}${timestamp}${random}`;
}

function extractDomain(url) {
	try {
		return new URL(url).hostname;
	} catch {
		return "unknown";
	}
}

function isValidUrl(url) {
	if (!url) return false;
	try {
		const urlObj = new URL(url);
		return ["http:", "https:"].includes(urlObj.protocol);
	} catch {
		return false;
	}
}

/**
 * 生成获取远程页面元数据的脚本
 */
function generateMetadataScript(cardId, url, domain) {
	return `
		fetch('${url}', { referrerPolicy: "no-referrer" })
			.then(response => response.text())
			.then(html => {
				const parser = new DOMParser();
				const doc = parser.parseFromString(html, 'text/html');
				
				// 尝试获取 Open Graph 标签
				const ogTitle = doc.querySelector('meta[property="og:title"]')?.getAttribute('content');
				const ogDesc = doc.querySelector('meta[property="og:description"]')?.getAttribute('content');
				const ogImage = doc.querySelector('meta[property="og:image"]')?.getAttribute('content');
				
				// 回退到标准 meta 标签
				const title = ogTitle || doc.querySelector('title')?.textContent || '${domain}';
				const desc = ogDesc || doc.querySelector('meta[name="description"]')?.getAttribute('content') || 'Visit ${domain}';
				const image = ogImage;
				
				// 更新标题
				const titleEl = document.getElementById('${cardId}-title');
				if (titleEl) titleEl.textContent = title;
				
				// 更新描述
				const descEl = document.getElementById('${cardId}-description');
				if (descEl) descEl.textContent = desc;
				
				// 更新图片
				if (image) {
					const imageEl = document.getElementById('${cardId}-image');
					if (imageEl) {
						imageEl.innerHTML = '<img src="' + image + '" alt="' + title + '" loading="lazy" onerror="this.style.display='none';">';
					}
				}
				
				// 移除 loading 状态
				const card = document.getElementById('${cardId}-card');
				if (card) card.classList.remove('fetch-waiting');
				
				console.log('[LINK-CARD] Loaded metadata for ${url}');
			})
			.catch(err => {
				const card = document.getElementById('${cardId}-card');
				if (card) card.classList.add('fetch-error');
				console.warn('[LINK-CARD] Failed to fetch metadata for ${url}:', err);
			});
	`;
}

/**
 * Link Card component for third-party links.
 * @param {Object} properties - {url, title?, description?, image?, icon?}
 * @param {Array} children - must be empty (leaf directive)
 * @returns {Object} HAST element
 */
export function LinkCardComponent(properties = {}, children = []) {
	if (Array.isArray(children) && children.length !== 0) {
		return h("div", { class: "hidden" }, ERRORS.INVALID_DIRECTIVE);
	}

	if (!isValidUrl(properties.url)) {
		return h("div", { class: "hidden" }, ERRORS.INVALID_URL);
	}

	const url = properties.url;
	const domain = extractDomain(url);
	const cardId = generateCardId();

	const {
		title: customTitle = null,
		description: customDescription = null,
		image: customImage = null,
		icon: customIcon = null,
	} = properties;

	const needsFetch = !customTitle || !customDescription;

	const iconUrl =
		customIcon ||
		`${CONSTANTS.FAVICON_API}?domain=${encodeURIComponent(domain)}&sz=${CONSTANTS.FAVICON_SIZE}`;

	const nFavicon = h(`div#${cardId}-favicon`, {
		class: "lc-favicon",
		style: `background-image: url(${iconUrl})`,
		onerror:
			"this.style.backgroundImage='none'; this.style.backgroundColor='#f0f0f0';",
	});

	const nTitle = h("div", { class: "lc-titlebar" }, [
		h("div", { class: "lc-titlebar-left" }, [
			h("div", { class: "lc-site" }, [
				nFavicon,
				h("div", { class: "lc-domain" }, domain),
			]),
		]),
		h("div", { class: "lc-external-icon" }),
	]);

	// 创建卡片标题
	const nCardTitle = h(
		`div#${cardId}-title`,
		{
			class: "lc-card-title",
			...(customTitle && { "data-has-custom-title": "true" }),
		},
		customTitle || CONSTANTS.LOADING_TITLE,
	);

	// 创建描述
	const nDescription = h(
		`div#${cardId}-description`,
		{
			class: "lc-description",
			...(customDescription && { "data-has-custom-desc": "true" }),
		},
		customDescription || CONSTANTS.LOADING_DESC,
	);

	const cardContent = [nTitle, nCardTitle, nDescription];

	if (customImage) {
		const nImage = h(
			`div#${cardId}-image`,
			{ class: "lc-image" },
			h("img", {
				src: customImage,
				alt: customTitle || "Link preview",
				loading: "lazy",
				onerror: "this.style.display='none';",
			}),
		);
		cardContent.push(nImage);
	}

	// 如果需要获取元数据，添加脚本
	if (needsFetch) {
		const nScript = h(
			`script#${cardId}-script`,
			{
				type: "text/javascript",
				defer: true,
			},
			generateMetadataScript(cardId, url, domain),
		);
		cardContent.push(nScript);
	}

	// 创建并返回链接卡片
	return h(
		`a#${cardId}-card`,
		{
			class: needsFetch
				? "card-link fetch-waiting no-styling"
				: "card-link no-styling",
			href: url,
			target: "_blank",
			rel: "noopener noreferrer",
			"data-url": url,
			"aria-label": `Link to ${domain}`,
			title: customTitle || `Visit ${domain}`,
		},
		cardContent,
	);
}

export default LinkCardComponent;
