const WORDS_PER_MINUTE = 300; // ~300 chars/min

const stringifyNode = (node) =>
	node.type === "text"
		? node.value || ""
		: node.children
			? node.children.map(stringifyNode).join("")
			: "";

const getReadingTime = (text) => {
	const chars = text.replace(/\s+/g, "").length;
	return { words: chars, minutes: chars / WORDS_PER_MINUTE };
};

export function remarkPostMetadata() {
	return (tree, { data }) => {
		const textOnPage = stringifyNode(tree);
		const { words, minutes } = getReadingTime(textOnPage);

		data.astro.frontmatter.minutes = Math.max(1, Math.round(minutes));
		data.astro.frontmatter.words = words;

		for (const node of tree.children) {
			if (node.type === "paragraph") {
				data.astro.frontmatter.excerpt = stringifyNode(node);
				break;
			}
		}
	};
}
