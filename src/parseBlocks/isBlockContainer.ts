import {
	BlockNode,
	BlockquoteBlockNode,
	ListBlockNode,
	ListItemBlockNode,
	RootBlockNode,
} from '../createBlockNode/type';

export default function isBlockContainer(blockNode: BlockNode): blockNode is RootBlockNode | ListBlockNode | ListItemBlockNode | BlockquoteBlockNode {
	const type = blockNode.type;
	return (
		type === 'rootBlock' ||
		type === 'list' ||
		type === 'listItem' ||
		type === 'blockquote'
	);
}