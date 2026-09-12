import type { TableState } from './consumeTableLine';
import { CodeBlockNode } from '../createBlockNode/type';

type CodeBlockState = Map<CodeBlockNode, { isOpen: boolean }>;

type BlockStates = {
	codeBlockStates: CodeBlockState;
	tableState: TableState;
}

export {
	BlockStates,
}

export default function createBlockStates(): BlockStates {
	const codeBlockStates: CodeBlockState = new Map()

	return {
		codeBlockStates,
		tableState: { flag: 0 },
	}
}