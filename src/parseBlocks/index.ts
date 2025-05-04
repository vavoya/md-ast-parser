import { RootBlockNode } from '../createBlockNode/type';
import createRootBlockNode from '../createBlockNode/createRootBlockNode';
import createBlockStates from './createBlockStates';
import parseLineToChildren from './parseLineToChildren';
import resolveIndentContextForLine from './resolveIndentContextForLine';

export default function parseBlocks(lines: string[]) {
	const rootBlockNode: RootBlockNode = createRootBlockNode();

	const blockStates = createBlockStates();

	lines.forEach(line => {
		// 여기는 rootBlockNode 와 line 을 통해서 어느 블럭의 하위에 속하는지 BlockNode 를 받고.
		// 그래서 FP 구색은 맞춰야하니 얕은 복사를 해볼까? 근데 파서는 성능이 중요한데, 흠..
		const {targetBlockNode, indentOffset} = resolveIndentContextForLine(rootBlockNode, line)

		// 타겟 노드에 맞춰서 문법을 파싱해서 블럭을 만드는것
		const newChildren = parseLineToChildren(targetBlockNode, line.substring(indentOffset), blockStates);

		// 여기는 그 line 의 Block 을 추가하는? 음
		targetBlockNode.children = newChildren;
	})

	return rootBlockNode;
};
