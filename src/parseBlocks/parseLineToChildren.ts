import { BlockquoteBlockNode, ListItemBlockNode, RootBlockNode } from '../createBlockNode/type';
import { BlockStates } from './createBlockStates';
import createCodeBlockNode from '../createBlockNode/createCodeBlockNode';
import parseCodeInlines from '../parseCodeInlines';
import createRootBlockNode from '../createBlockNode/createRootBlockNode';
import parsePrefix from '../parsePrefix';
import isBlockContainer from './isBlockContainer';

const emptyObj = createRootBlockNode();
export default function parseLineToChildren(targetBlockNode: RootBlockNode | BlockquoteBlockNode | ListItemBlockNode, line: string, blockStates: BlockStates) {
	const prevSiblingNode = targetBlockNode.children[targetBlockNode.children.length - 1] ?? emptyObj;

	// 코드 블럭은 하위 블럭이 존재하지 않기 때문에
	if (prevSiblingNode.type === 'codeBlock') {
		// 여기서 블럭을 닫아버리는지 확인
		const codeBlockState = blockStates.codeBlockStates.get(prevSiblingNode);

		if (line.trim() === '```') {
			// 코드 블럭 닫힘 처리
			blockStates.codeBlockStates.delete(prevSiblingNode);
			return [ ...targetBlockNode.children ];
		} else if (codeBlockState?.isOpen) {
			// 코드 라인 추가
			// 코드 블럭 복사
			const newCodeBlockNode = createCodeBlockNode(prevSiblingNode.lang)
			newCodeBlockNode.children = [...prevSiblingNode.children, parseCodeInlines(prevSiblingNode.lang, line)]

			// 코드 블럭 상태 유지하기. 참조가 바뀌어버림. FP의 불변성 유지할려고 하다 보니 ㅡㅡ
			blockStates.codeBlockStates.delete(prevSiblingNode);
			blockStates.codeBlockStates.set(newCodeBlockNode, { isOpen: true });


			// 타겟노드 자식 복사하고 이전 형제 교체
			const newChildren = [...targetBlockNode.children];
			newChildren[newChildren.length - 1] = newCodeBlockNode
			return newChildren
		} else {
			// 포함 코드블럭 밖이면 그냥 다음 동작 진행
		}
	}

	// 나머지는 하위 블럭이 전부 존재하지
	// 테이블이 추가된다면 어떻게 해야할지 머리 아프지만 흠
	let nextLine = line;
	const startNode = createRootBlockNode()
	let currentNode = startNode as RootBlockNode | BlockquoteBlockNode | ListItemBlockNode;

	// 첫 nextLine은 '' 이더라도 p로 처리를 해줘야하기에 do를 사용
	do {
		const prefixParseResult = parsePrefix(nextLine);

		nextLine = prefixParseResult.nextLine

		const prefixBlockNode = prefixParseResult.block
		currentNode.children.push(prefixBlockNode);

		// 코드 블럭이면 상태 기록
		if (prefixBlockNode.type === 'codeBlock') {
			blockStates.codeBlockStates.set(prefixBlockNode, { isOpen: true });
		}

		// 이걸 하는 이유는, 블럭을 가지는 요소가 아니면 이 반복문을 진행할 이유가 없으니
		// 예를 들어 p 블럭이라면, 이미 파싱이 끝남. h 도 마찬가지. 인라인 파싱도 블럭 파싱 내에서 호출해서 처리하기에
		if (!isBlockContainer(prefixBlockNode)) {
			break;
		}

		// 이거는 list일 경우 listItem으로 가게 하는거고, 아니면 그냥 바로 하위
		if (prefixBlockNode.type === 'list') {
			currentNode = prefixBlockNode.children[0];
		} else {
			currentNode = prefixBlockNode
		}
	} while(nextLine);

	// 이제 타겟 블럭과, 라인으로 나온 블럭을 기반으로 자식 배열을 반환할꺼임
	const node = startNode.children[0]
	// 이전 형제 블럭이 같은 속성의 리스트이면, 리스트 블럭 내부로 넣어줘야지
	if (
		(prevSiblingNode.type === 'list' && node.type === 'list') &&
		(prevSiblingNode.isOrdered === node.isOrdered)
	) {
		// 리스트 블럭 복사
		node.children = [ ...prevSiblingNode.children, ...node.children ];

		// 타겟노드 자식 복사하고 이전 형제 교체
		const newChildren = [...targetBlockNode.children];
		newChildren[newChildren.length - 1] = node
		return newChildren
	} else {
		return [ ...targetBlockNode.children, node]
	}

}