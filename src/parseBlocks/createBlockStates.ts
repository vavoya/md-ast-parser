import { CodeBlockNode } from '../createBlockNode/type';

type CodeBlockState = Map<CodeBlockNode, { isOpen: boolean }>;

type BlockStates = {
	codeBlockStates: CodeBlockState;
}

export {
	BlockStates,
}

export default function createBlockStates(): BlockStates {
	const codeBlockStates: CodeBlockState = new Map()
	// 테이블도 나중에

	return {
		codeBlockStates
	}
}