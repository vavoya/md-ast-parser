// raw-text.test.ts
import { test, describe, before } from 'node:test'
import parseBlocks from '../parseBlocks';
import { shikiPromise } from '../parseCodeInlines/createHighlighter';

before(async () => {
	await shikiPromise;
});

/**
 * 최상위 블럭의 rawText 를 순서대로 이어 붙이면 원문과 같아야 한다.
 * 파싱 도중 노드가 교체되어도 원문이 유실되지 않는지 검증한다.
 */
function assertRoundTrip(lines: string[]) {
	const ast = parseBlocks(lines);

	const missing = ast.children.find(child => typeof child.rawText !== 'string');
	if (missing) {
		throw new Error(`rawText 가 없는 최상위 블럭이 있습니다.\n${JSON.stringify(missing, null, 2)}`)
	}

	const joined = ast.children.map(child => child.rawText).join('\n');
	const original = lines.join('\n');
	if (joined !== original) {
		throw new Error(`원문 복원 실패.\nExpected:\n${JSON.stringify(original)}\nActual:\n${JSON.stringify(joined)}`)
	}
}

describe('rawText 원문 복원', () => {
	test('단일 문단', () => assertRoundTrip(['abc']))
	test('빈 입력', () => assertRoundTrip([]))
	test('빈 줄만', () => assertRoundTrip(['']))
	test('빈 줄로 시작', () => assertRoundTrip(['', 'a']))
	test('빈 줄 섞임', () => assertRoundTrip(['a', '', 'b', '', '']))
	test('헤딩과 구분선', () => assertRoundTrip(['# h', '---', 'p']))

	test('리스트 여러 줄', () => assertRoundTrip(['- 리스트1', '- 리스트2', '- 리스트3']))
	test('리스트 중첩', () => assertRoundTrip(['- 리스트1', '  - 리스트2', '    - 리스트3', '- 리스트4']))
	test('순서 리스트', () => assertRoundTrip(['1. 리스트1', '2. 리스트2']))
	test('리스트 종류 전환', () => assertRoundTrip(['- 리스트1', '1. 리스트2']))

	test('코드블럭', () => assertRoundTrip(['```js', 'const a = 1', '```']))
	test('코드블럭 내 빈 줄', () => assertRoundTrip(['```js', '', 'const a = 1', '```']))
	test('닫히지 않은 코드블럭', () => assertRoundTrip(['```js', 'const a = 1']))

	test('인용문', () => assertRoundTrip(['> 인용문1', '> 인용문2']))
	test('인용문 중첩', () => assertRoundTrip(['> 인용문1', '>   > 인용문2']))

	test('인용문 리스트 코드블럭 복합', () => assertRoundTrip([
		'> 인용문1',
		'  1. 리스트1',
		'     리스트11',
		'     > 인용문2',
		'       ```js',
		'       const a = 2',
		'       ```',
		'  인용문11',
	]))

	test('인라인 코드 포함', () => assertRoundTrip(['a `code` b', '- `x`']))
	test('들여쓰기와 탭', () => assertRoundTrip(['  a', '\tb']))
})
