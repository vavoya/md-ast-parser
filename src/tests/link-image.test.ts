// link-image.test.ts
import { test, describe } from 'node:test'
import parseBlocks from '../parseBlocks';

function parseLine(line: string) {
	const block = parseBlocks([line]).children[0] as { children: unknown[] };
	return block.children;
}

/** 인라인을 순서대로 이어 붙인다 */
function join(inlines: any[]): string {
	return inlines.map(i =>
		i.type === 'span' ? i.text : i.type === 'link' ? join(i.children) : ''
	).join('');
}

function assertRestores(line: string) {
	const restored = join(parseLine(line) as any[]);
	if (restored !== line) {
		throw new Error(`원문 복원 실패.\nExpected:\n${JSON.stringify(line)}\nActual:\n${JSON.stringify(restored)}`)
	}
}

describe('링크와 이미지도 원문을 남긴다', () => {
	test('링크', () => assertRestores('[텍스트](https://example.com)'))
	test('링크 앞뒤에 글이 있는 경우', () => assertRestores('앞 [텍스트](https://example.com) 뒤'))
	test('이미지', () => assertRestores('![대체](https://example.com/a.png)'))
	test('이미지 앞뒤에 글이 있는 경우', () => assertRestores('앞 ![대체](a.png) 뒤'))
	test('링크 안의 이미지', () => assertRestores('[![그림](i.png)](https://example.com)'))
	test('링크과 강조가 섞인 경우', () => assertRestores('**굵게** [링크](u) *기울임*'))
	test('링크 텍스트 안의 강조', () => assertRestores('[**굵은 링크**](u)'))
	test('링크 여럿', () => assertRestores('[하나](a) 와 [둘](b)'))
	test('코드 안의 링크는 코드로 남는다', () => assertRestores('`[링크](u)`'))
})

describe('링크의 짜임', () => {
	test('여는 대괄호와 닫는 부분이 조각으로 남는다', () => {
		const inlines = parseLine('[텍스트](https://a.com)') as any[];

		const syntaxTexts = inlines.filter(i => i.type === 'span' && i.className.includes('syntax')).map(i => i.text);
		if (syntaxTexts.length !== 2 || syntaxTexts[0] !== '[' || syntaxTexts[1] !== '](https://a.com)') {
			throw new Error(`문법 조각이 기대와 다름: ${JSON.stringify(syntaxTexts)}`)
		}
	})

	test('링크 노드는 그대로 남는다', () => {
		const inlines = parseLine('[텍스트](https://a.com)') as any[];
		const link = inlines.find(i => i.type === 'link');

		if (!link || link.href !== 'https://a.com') {
			throw new Error(`링크 노드가 없거나 주소가 다름: ${JSON.stringify(link)}`)
		}
	})

	test('이미지는 원문 조각과 그림이 함께 나온다', () => {
		const inlines = parseLine('![대체](a.png)') as any[];

		const syntax = inlines.find(i => i.type === 'span' && i.className.includes('syntax'));
		const img = inlines.find(i => i.type === 'img');

		if (!syntax || syntax.text !== '![대체](a.png)') {
			throw new Error(`이미지 원문 조각이 기대와 다름: ${JSON.stringify(syntax)}`)
		}
		if (!img || img.src !== 'a.png' || img.alt !== '대체') {
			throw new Error(`그림 노드가 기대와 다름: ${JSON.stringify(img)}`)
		}
	})
})
