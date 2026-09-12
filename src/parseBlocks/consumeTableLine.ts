import {
	BlockquoteBlockNode,
	ListItemBlockNode,
	ParagraphBlockNode,
	RootBlockNode,
	TableAlignment,
	TableBlockNode,
	TableCell,
} from '../createBlockNode/type';
import parseInlines from '../parseInlines';
import type { BlockStates } from './createBlockStates';

type Parent = RootBlockNode | BlockquoteBlockNode | ListItemBlockNode;
type Candidate = {
	node: ParagraphBlockNode;
	source: string;
};

export type TableState =
	| {
		flag: 0;
	}
	| {
		flag: 1;
		parent: Parent;
		index: number;
		header: Candidate;
		cells: string[];
	}
	| {
		flag: 2;
		parent: Parent;
		index: number;
		header: Candidate;
		cells: string[];
		delimiter: Candidate;
		align: TableAlignment[];
	}
	| {
		flag: 3;
		parent: Parent;
		table: TableBlockNode;
	};

/** 양끝 파이프는 필수이며, 앞선 백슬래시 개수의 홀짝을 구분해 이스케이프된 파이프는 셀 내용으로 처리한다. */
export function splitTableRow(line: string): string[] | null {
	if (!/^[ \t]*\|/.test(line)) {
		return null;
	}

	const boundaries: number[] = [];
	const delimiters = /\\[\s\S]|\|/g;
	let match: RegExpExecArray | null;

	while ((match = delimiters.exec(line)) !== null) {
		if (match[0] === '|') {
			boundaries.push(match.index);
		}
	}
	if (boundaries.length < 2) {
		return null;
	}

	const last = boundaries[boundaries.length - 1];

	if (!/^[ \t]*$/.test(line.slice(last + 1))) {
		return null;
	}

	const cells: string[] = [];

	for (let index = 1; index < boundaries.length; index++) {
		cells.push(line.slice(boundaries[index - 1] + 1, boundaries[index]).trim());
	}
	return cells;
}

function parseAlignment(cells: string[]): TableAlignment[] | null {
	const align: TableAlignment[] = [];

	for (const cell of cells) {
		if (!/^:?-{3,}:?$/.test(cell)) {
			return null;
		}

		if (cell.startsWith(':') && cell.endsWith(':')) {
			align.push('center');
		} else if (cell.startsWith(':')) {
			align.push('left');
		} else if (cell.endsWith(':')) {
			align.push('right');
		} else {
			align.push(null);
		}
	}
	return align;
}

function parseCells(cells: string[]): TableCell[] {
	return cells.map(cell => ({
		children: parseInlines(cell),
	}));
}

export function flushTableCandidate(states: BlockStates): void {
	const state = states.tableState;

	if (state.flag === 1 || state.flag === 2) {
		state.header.node.children = parseInlines(state.header.source);
		if (state.flag === 2) {
			state.delimiter.node.children = parseInlines(state.delimiter.source);
		}
	}
	states.tableState = {
		flag: 0,
	};
}

/** 현재 파싱 중인 내부 상태와 노드에 줄을 반영한다. false를 반환하면 기존 블록 파싱을 이어간다. */
export default function consumeTableLine(parent: Parent, line: string, states: BlockStates): boolean {
	let state = states.tableState;

	if (state.flag !== 0 && state.parent !== parent) {
		flushTableCandidate(states);
		state = states.tableState;
	}

	const cells = splitTableRow(line);

	if (state.flag === 3) {
		if (cells !== null && cells.length === state.table.header.length) {
			state.table.rows.push(parseCells(cells));
			return true;
		}

		flushTableCandidate(states);
	} else if (state.flag === 2) {
		if (cells !== null && cells.length === state.cells.length) {
			const table: TableBlockNode = {
				type: 'table',
				header: parseCells(state.cells),
				align: state.align,
				rows: [parseCells(cells)],
			};
			parent.children.splice(state.index, 2, table);
			states.tableState = {
				flag: 3,
				parent,
				table,
			};
			return true;
		}
		flushTableCandidate(states);
	} else if (state.flag === 1) {
		const align = cells !== null && cells.length === state.cells.length ? parseAlignment(cells) : null;
		if (align !== null) {
			const node: ParagraphBlockNode = {
				type: 'paragraph',
				children: [],
			};
			parent.children.push(node);
			states.tableState = {
				...state,
				flag: 2,
				delimiter: {
					node,
					source: line,
				},
				align,
			};
			return true;
		}
		flushTableCandidate(states);
	}
	// 후보나 표를 끝낸 현재 줄이 새로운 헤더 후보가 될 수도 있다.
	if (cells !== null) {
		const node: ParagraphBlockNode = {
			type: 'paragraph',
			children: [],
		};
		const index = parent.children.length;
		parent.children.push(node);
		states.tableState = {
			flag: 1,
			parent,
			index,
			header: {
				node,
				source: line,
			},
			cells,
		};
		return true;
	}
	return false;
}
