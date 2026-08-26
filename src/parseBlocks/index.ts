import { RootBlockNode, ParsedRootBlockNode, TopLevelBlockNode } from '../createBlockNode/type';
import createRootBlockNode from '../createBlockNode/createRootBlockNode';
import createBlockStates from './createBlockStates';
import parseLineToChildren from './parseLineToChildren';
import resolveIndentContextForLine from './resolveIndentContextForLine';

/**
 * @description 여러 줄의 마크다운을 블럭 AST 로 변환한다.
 *
 * 최상위 블럭에는 그 블럭을 만들어낸 원문(rawText)이 함께 담긴다.
 * 파싱 도중에는 불변성 유지를 위해 노드가 교체되므로, 원문을 노드에 직접 쌓지 않고
 * 별도 배열에 모았다가 파싱이 끝난 뒤에 한 번에 주입한다.
 *
 * @param lines 줄 단위로 나뉜 마크다운
 * @returns 최상위 자식이 rawText 를 가지는 루트 블럭
 */
export default function parseBlocks(lines: string[]): ParsedRootBlockNode {
	const rootBlockNode: RootBlockNode = createRootBlockNode();

	const blockStates = createBlockStates();

	// 최상위 블럭별 원문. 인덱스가 rootBlockNode.children 과 일치한다
	const rawTexts: string[] = [];

	lines.forEach(line => {
		const prevChildCount = rootBlockNode.children.length;

		// 여기는 rootBlockNode 와 line 을 통해서 어느 블럭의 하위에 속하는지 BlockNode 를 받고.
		// 그래서 FP 구색은 맞춰야하니 얕은 복사를 해볼까? 근데 파서는 성능이 중요한데, 흠..
		const {targetBlockNode, indentOffset} = resolveIndentContextForLine(rootBlockNode, line)

		// 타겟 노드에 맞춰서 문법을 파싱해서 블럭을 만드는것
		const newChildren = parseLineToChildren(targetBlockNode, line.substring(indentOffset), blockStates);

		// 여기는 그 line 의 Block 을 추가하는? 음
		targetBlockNode.children = newChildren;

		// 최상위 블럭이 늘었으면 새 원문, 아니면 직전 최상위 블럭에 이어 붙인다.
		// 하위 블럭에 줄이 들어간 경우에도 최상위 개수는 그대로이므로 이어 붙는다
		if (rootBlockNode.children.length > prevChildCount) {
			rawTexts.push(line);
		} else if (rawTexts.length > 0) {
			rawTexts[rawTexts.length - 1] += '\n' + line;
		}
	})

	// 노드가 몇 번 교체되었든 영향받지 않도록, 끝난 뒤에 원문을 주입한다
	const children = rootBlockNode.children.map((child, index): TopLevelBlockNode => ({
		...child,
		rawText: rawTexts[index] ?? '',
	}));

	return {
		type: 'rootBlock',
		children,
	};
};
