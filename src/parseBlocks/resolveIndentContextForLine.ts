import { BlockNode, BlockquoteBlockNode, ListItemBlockNode, RootBlockNode } from '../createBlockNode/type';
import createRootBlockNode from '../createBlockNode/createRootBlockNode';
import matchesIndent from './matchesIndent';
import isBlockContainer from './isBlockContainer';

const emptyObj = createRootBlockNode();
export default function resolveIndentContextForLine(rootBlockNode: RootBlockNode, line: string) {
	let targetBlockNode: RootBlockNode | BlockquoteBlockNode | ListItemBlockNode = rootBlockNode;
	let indentOffset = 0;



	while (isBlockContainer(targetBlockNode)) {
		const t = targetBlockNode.children[targetBlockNode.children.length - 1];
		const nextBlockNode: BlockNode = targetBlockNode.children[targetBlockNode.children.length - 1] ?? emptyObj;

		if (nextBlockNode.type === 'blockquote') {
			if (matchesIndent(line, indentOffset + 2)) {
				targetBlockNode = nextBlockNode;
				indentOffset += 2;
			} else {
				break
			}
		} else if (nextBlockNode.type === 'list') {
			// list의 마지막 자식의 그 길이랑 맞게 공백인지 확인
			const lastListItem: ListItemBlockNode = nextBlockNode.children[nextBlockNode.children.length - 1]
			if (matchesIndent(line, indentOffset + lastListItem.marker.length + 1)) {
				indentOffset += lastListItem.marker.length + 1
				targetBlockNode = lastListItem;
			}
			else {
				break;
			}

		} else {
			// 'paragraph' | 'heading' | 'thematicBreak | 'codeblock'
			// 이 녀석들만 여기에 도달할 것
			// 그 외의 것은 애초에 저 nextBlockNode에 할당이 안될 것 (root, listItem 은 로직 상 도달 못하는 타입)
			// 아 root는 다음 블럭없으면 루트블럭으로 인식하게 해서 여기 도달하게 한 다음에 탈출하게 만들꺼임
			break;
		}
	}

	// 모든 들여쓰기 처리했지만, 마지막에 불필요한 공백이 필요하면 불일치로 보고 루트로 판단
	if (line[indentOffset] === ' ') {
		targetBlockNode = rootBlockNode;
	}

	return {
		targetBlockNode,
		indentOffset,
	}
}