import { SKIP, visit } from "unist-util-visit";

export default function rehypeTableWrapper() {
	return (tree) => {
		visit(tree, "element", (node, index, parent) => {
			if (node.tagName !== "table" || !parent || typeof index !== "number")
				return;
			const parentClass = parent.properties?.className;
			if (Array.isArray(parentClass) && parentClass.includes("table-wrapper"))
				return SKIP;

			const wrapper = {
				type: "element",
				tagName: "div",
				properties: { className: ["table-wrapper"] },
				children: [node],
			};
			parent.children[index] = wrapper;
		});
	};
}
