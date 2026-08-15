import { visit } from "unist-util-visit";

/**
 * 将内容中的所有标题层级 +1（h1→h2, h2→h3, ...）。
 * 页面级标题（h1）由布局模板自行渲染，内容中的 h1 会被降级，
 * 从而保证每个页面只有一个 `<h1>`。
 */
export function rehypeShiftHeadings() {
	return (tree) => {
		visit(tree, "element", (node) => {
			if (node.tagName && /^h[1-6]$/.test(node.tagName)) {
				const level = Number.parseInt(node.tagName[1], 10);
				if (level < 6) {
					node.tagName = `h${level + 1}`;
				}
			}
		});
	};
}
