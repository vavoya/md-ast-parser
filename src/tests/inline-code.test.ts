// inline-code.test.ts
import { test, describe } from 'node:test'
import parseBlocks from '../parseBlocks';

// JSON 비교 함수
function assertEqualJSON(actual: any, expected: any) {
	const a = JSON.stringify(actual, null, 2)
	const b = JSON.stringify(expected, null, 2)
	if (a !== b) {
		throw new Error(`Test failed.\nExpected:\n${b}\nActual:\n${a}`)
	}
}

// 한 줄을 파싱해 인라인 토큰만 꺼낸다
function parseLine(line: string) {
	const block = parseBlocks([line]).children[0] as { children: unknown[] };
	return block.children;
}

// span 토큰 생성 헬퍼
function span(className: string, text: string) {
	return { type: 'span', className, text };
}

describe('인라인 코드', () => {
	test('백틱 한 쌍을 코드로 파싱한다', () => {
		assertEqualJSON(parseLine('a `code` b'), [
			span('', 'a '),
			span('syntax code', '`'),
			span('code', 'code'),
			span('syntax code', '`'),
			span('', ' b'),
		])
	})

	test('코드 내부의 문법은 해석하지 않는다', () => {
		assertEqualJSON(parseLine('`**a**`'), [
			span('syntax code', '`'),
			span('code', '**a**'),
			span('syntax code', '`'),
		])
	})

	test('코드 내부의 링크는 해석하지 않는다', () => {
		assertEqualJSON(parseLine('`[a](b)`'), [
			span('syntax code', '`'),
			span('code', '[a](b)'),
			span('syntax code', '`'),
		])
	})

	test('여는 런과 길이가 같은 런으로만 닫힌다', () => {
		assertEqualJSON(parseLine('``a`b``'), [
			span('syntax code', '``'),
			span('code', 'a`b'),
			span('syntax code', '``'),
		])
	})

	test('닫는 런이 없으면 코드로 보지 않는다', () => {
		assertEqualJSON(parseLine('a `b'), [
			span('', 'a `b'),
		])
	})

	test('길이가 다른 런으로는 닫히지 않는다', () => {
		assertEqualJSON(parseLine('`a``'), [
			span('', '`a``'),
		])
	})

	test('이스케이프된 백틱은 코드를 열지 않는다', () => {
		const actual = parseLine('a \\`b\\` c') as { text: string }[];
		const hasCode = (parseLine('a \\`b\\` c') as { className: string }[])
			.some(token => token.className.includes('code'));
		if (hasCode) {
			throw new Error(`Test failed.\n이스케이프된 백틱이 코드로 파싱됨:\n${JSON.stringify(actual, null, 2)}`)
		}
	})

	test('코드 앞뒤 공백을 지우지 않는다', () => {
		assertEqualJSON(parseLine('` a `'), [
			span('syntax code', '`'),
			span('code', ' a '),
			span('syntax code', '`'),
		])
	})

	test('한 줄에 여러 코드를 파싱한다', () => {
		assertEqualJSON(parseLine('`a` and `b`'), [
			span('syntax code', '`'),
			span('code', 'a'),
			span('syntax code', '`'),
			span('', ' and '),
			span('syntax code', '`'),
			span('code', 'b'),
			span('syntax code', '`'),
		])
	})
})

describe('코드 구간을 사이에 둔 강조 상태', () => {
	test('코드 앞뒤로 강조가 이어진다', () => {
		assertEqualJSON(parseLine('**a `b` c**'), [
			span('syntax bold', '**'),
			span('bold', 'a '),
			span('syntax bold code', '`'),
			span('bold code', 'b'),
			span('syntax bold code', '`'),
			span('bold', ' c'),
			span('syntax bold', '**'),
		])
	})

	test('링크 앞뒤로 강조가 이어진다', () => {
		const tokens = parseLine('**a [link](u) b**') as { className?: string; text?: string }[];
		const last = tokens[tokens.length - 2];
		if (last.className !== 'bold') {
			throw new Error(`Test failed.\n링크 뒤에서 강조가 끊김. className=${last.className}\n${JSON.stringify(tokens, null, 2)}`)
		}
	})

	test('링크 텍스트 내부의 강조는 바깥으로 새지 않는다', () => {
		const tokens = parseLine('[**a**] b') as { className?: string }[];
		const last = tokens[tokens.length - 1];
		if (last.className === 'bold') {
			throw new Error(`Test failed.\n링크 내부 강조가 바깥으로 샘\n${JSON.stringify(tokens, null, 2)}`)
		}
	})
})
