import type { Data, Node } from "hast";
import { h } from "hastscript";
import type { Root } from "mdast";
import { visit } from "unist-util-visit";

interface DirectiveNode extends Node {
	type: "containerDirective" | "leafDirective" | "textDirective";
	name: string;
	attributes?: Record<string, string | boolean | number>;
	children: (Node & { data?: Data & { directiveLabel?: boolean } })[];
	data?: Data & {
		hName?: string;
		hProperties?: Record<string, unknown>;
	};
}

export function parseDirectiveNode(): (tree: Root) => void {
	return (tree: Root) => {
		visit(tree, (node: Node) => {
			const directiveNode = node as DirectiveNode;
			if (
				directiveNode.type === "containerDirective" ||
				directiveNode.type === "leafDirective" ||
				directiveNode.type === "textDirective"
			) {
				if (!directiveNode.data) {
					directiveNode.data = {};
				}
				const data = directiveNode.data;
				if (!directiveNode.attributes) {
					directiveNode.attributes = {};
				}
				if (
					directiveNode.children.length > 0 &&
					directiveNode.children[0].data &&
					directiveNode.children[0].data.directiveLabel
				) {
					directiveNode.attributes["has-directive-label"] = true;
				}
				const hast = h(directiveNode.name, directiveNode.attributes);

				data.hName = hast.tagName as string;
				data.hProperties = hast.properties as Record<string, unknown>;
			}
		});
	};
}
