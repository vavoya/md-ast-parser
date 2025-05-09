import {before, test} from 'node:test'
import parseBlocks from '../parseBlocks';
import {shikiPromise} from "../parseCodeInlines/createHighlighter";

function generateIncrementalText(length: number): string {
	const alphabet = 'abcdefghijklmnopqrstuvwxyz'
	let result = ''
	for (let i = 0; i < length; i++) {
		result += alphabet[i % alphabet.length]
	}
	return result
}

function generateTestLines(iteration: number) {
	const lines = []
	for (let i = 0; i < 500; i++) {
		const suffix = generateIncrementalText(0)
		lines.push(`# He**ad**in*g ${suffix}`)
		lines.push(`Some p**arag*raph** text number ${suffix}`)
		lines.push(`- Item ${suffix}`)
		lines.push(`  - Subitem ${suffix}`)
		lines.push(`    - SubSubitem ${suffix}`)
		lines.push(`> Quote level 1 ${suffix}`)
		lines.push(`    Quote level 2 ${suffix}`)
		lines.push(`      Quote level 3 ${suffix}`)
		lines.push('```js')
		lines.push(`const index = ${'00000'.repeat(iteration)};`)
		for (let j = 0; j < iteration; j++) {
			lines.push(`console.log(index);`)
		}
		lines.push(`console.log(index);`)
		lines.push('```')
		lines.push(`Paragraph after code block ${suffix}`)
		lines.push('---')
	}
	lines.push('2'.repeat(iteration))
	return lines
}

function benchmarkParse(iteration: number) {
	const lines = generateTestLines(iteration)

	const start = performance.now()

	parseBlocks(lines)

	const end = performance.now()
	console.log(`[Tokens: ${iteration}] → ${(end - start).toFixed(3)} ms`)
}

// 전역 비동기 초기화
before(async () => {
	await shikiPromise;
});

test('지연 후 파서 성능 측정', () => {
	for (let i = 0; i < 100; i++) {
		benchmarkParse(i)
	}
})

/**
 * Testing started at 오전 1:19 ...
 * [Tokens: 0] → 92.107 ms
 * [Tokens: 1] → 23.410 ms
 * [Tokens: 2] → 25.272 ms
 * [Tokens: 3] → 24.239 ms
 * [Tokens: 4] → 23.729 ms
 * [Tokens: 5] → 24.394 ms
 * [Tokens: 6] → 23.195 ms
 * [Tokens: 7] → 25.962 ms
 * [Tokens: 8] → 26.446 ms
 * [Tokens: 9] → 27.200 ms
 * [Tokens: 10] → 26.928 ms
 * [Tokens: 11] → 26.384 ms
 * [Tokens: 12] → 32.150 ms
 * [Tokens: 13] → 33.411 ms
 * [Tokens: 14] → 32.109 ms
 * [Tokens: 15] → 30.893 ms
 * [Tokens: 16] → 31.243 ms
 * [Tokens: 17] → 33.797 ms
 * [Tokens: 18] → 34.867 ms
 * [Tokens: 19] → 33.829 ms
 * [Tokens: 20] → 34.153 ms
 * [Tokens: 21] → 35.905 ms
 * [Tokens: 22] → 36.423 ms
 * [Tokens: 23] → 37.748 ms
 * [Tokens: 24] → 37.674 ms
 * [Tokens: 25] → 37.849 ms
 * [Tokens: 26] → 36.770 ms
 * [Tokens: 27] → 35.775 ms
 * [Tokens: 28] → 39.072 ms
 * [Tokens: 29] → 42.603 ms
 * [Tokens: 30] → 39.367 ms
 * [Tokens: 31] → 39.067 ms
 * [Tokens: 32] → 39.382 ms
 * [Tokens: 33] → 40.934 ms
 * [Tokens: 34] → 45.088 ms
 * [Tokens: 35] → 41.771 ms
 * [Tokens: 36] → 40.880 ms
 * [Tokens: 37] → 43.073 ms
 * [Tokens: 38] → 44.804 ms
 * [Tokens: 39] → 47.545 ms
 * [Tokens: 40] → 45.979 ms
 * [Tokens: 41] → 45.058 ms
 * [Tokens: 42] → 47.488 ms
 * [Tokens: 43] → 51.223 ms
 * [Tokens: 44] → 49.036 ms
 * [Tokens: 45] → 45.840 ms
 * [Tokens: 46] → 48.862 ms
 * [Tokens: 47] → 59.540 ms
 * [Tokens: 48] → 93.012 ms
 * [Tokens: 49] → 59.881 ms
 * [Tokens: 50] → 90.256 ms
 * [Tokens: 51] → 64.470 ms
 * [Tokens: 52] → 63.539 ms
 * [Tokens: 53] → 61.407 ms
 * [Tokens: 54] → 59.656 ms
 * [Tokens: 55] → 66.774 ms
 * [Tokens: 56] → 57.262 ms
 * [Tokens: 57] → 57.666 ms
 * [Tokens: 58] → 60.751 ms
 * [Tokens: 59] → 58.456 ms
 * [Tokens: 60] → 59.929 ms
 * [Tokens: 61] → 59.388 ms
 * [Tokens: 62] → 64.206 ms
 * [Tokens: 63] → 60.253 ms
 * [Tokens: 64] → 60.757 ms
 * [Tokens: 65] → 60.014 ms
 * [Tokens: 66] → 66.121 ms
 * [Tokens: 67] → 62.438 ms
 * [Tokens: 68] → 66.518 ms
 * [Tokens: 69] → 62.602 ms
 * [Tokens: 70] → 67.659 ms
 * [Tokens: 71] → 65.094 ms
 * [Tokens: 72] → 66.724 ms
 * [Tokens: 73] → 65.052 ms
 * [Tokens: 74] → 70.959 ms
 * [Tokens: 75] → 68.535 ms
 * [Tokens: 76] → 66.857 ms
 * [Tokens: 77] → 68.236 ms
 * [Tokens: 78] → 72.848 ms
 * [Tokens: 79] → 73.754 ms
 * [Tokens: 80] → 70.265 ms
 * [Tokens: 81] → 72.698 ms
 * [Tokens: 82] → 75.879 ms
 * [Tokens: 83] → 72.644 ms
 * [Tokens: 84] → 76.073 ms
 * [Tokens: 85] → 74.932 ms
 * [Tokens: 86] → 75.579 ms
 * [Tokens: 87] → 76.830 ms
 * [Tokens: 88] → 75.818 ms
 * [Tokens: 89] → 82.406 ms
 * [Tokens: 90] → 78.981 ms
 * [Tokens: 91] → 98.935 ms
 * [Tokens: 92] → 95.392 ms
 * [Tokens: 93] → 99.224 ms
 * [Tokens: 94] → 88.735 ms
 * [Tokens: 95] → 80.441 ms
 * [Tokens: 96] → 82.343 ms
 * [Tokens: 97] → 77.912 ms
 * [Tokens: 98] → 79.886 ms
 * [Tokens: 99] → 82.419 ms
 */