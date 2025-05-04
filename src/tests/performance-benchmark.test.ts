import { test } from 'node:test'
import parseBlocks from '../parseBlocks';

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

test('지연 후 파서 성능 측정', async () => {
	await new Promise<void>((resolve) => {
		setTimeout(() => {
			for (let i = 0; i < 100; i++) {
				benchmarkParse(i)
			}
			resolve()
		}, 1000)
	})
})

/**
 * Testing started at 오후 9:42 ...
 * [Tokens: 0] → 119.084 ms
 * [Tokens: 1] → 25.331 ms
 * [Tokens: 2] → 24.019 ms
 * [Tokens: 3] → 24.326 ms
 * [Tokens: 4] → 25.560 ms
 * [Tokens: 5] → 26.557 ms
 * [Tokens: 6] → 26.825 ms
 * [Tokens: 7] → 27.532 ms
 * [Tokens: 8] → 27.859 ms
 * [Tokens: 9] → 27.696 ms
 * [Tokens: 10] → 28.429 ms
 * [Tokens: 11] → 32.410 ms
 * [Tokens: 12] → 31.031 ms
 * [Tokens: 13] → 30.750 ms
 * [Tokens: 14] → 31.150 ms
 * [Tokens: 15] → 33.832 ms
 * [Tokens: 16] → 33.972 ms
 * [Tokens: 17] → 32.899 ms
 * [Tokens: 18] → 40.487 ms
 * [Tokens: 19] → 34.695 ms
 * [Tokens: 20] → 35.122 ms
 * [Tokens: 21] → 38.012 ms
 * [Tokens: 22] → 37.883 ms
 * [Tokens: 23] → 37.683 ms
 * [Tokens: 24] → 40.720 ms
 * [Tokens: 25] → 39.196 ms
 * [Tokens: 26] → 40.111 ms
 * [Tokens: 27] → 40.278 ms
 * [Tokens: 28] → 41.071 ms
 * [Tokens: 29] → 41.714 ms
 * [Tokens: 30] → 42.094 ms
 * [Tokens: 31] → 42.699 ms
 * [Tokens: 32] → 44.128 ms
 * [Tokens: 33] → 54.127 ms
 * [Tokens: 34] → 44.787 ms
 * [Tokens: 35] → 45.579 ms
 * [Tokens: 36] → 44.964 ms
 * [Tokens: 37] → 48.666 ms
 * [Tokens: 38] → 47.761 ms
 * [Tokens: 39] → 47.416 ms
 * [Tokens: 40] → 49.914 ms
 * [Tokens: 41] → 50.572 ms
 * [Tokens: 42] → 52.948 ms
 * [Tokens: 43] → 52.675 ms
 * [Tokens: 44] → 54.552 ms
 * [Tokens: 45] → 55.625 ms
 * [Tokens: 46] → 57.392 ms
 * [Tokens: 47] → 57.965 ms
 * [Tokens: 48] → 55.018 ms
 * [Tokens: 49] → 55.300 ms
 * [Tokens: 50] → 56.604 ms
 * [Tokens: 51] → 58.744 ms
 * [Tokens: 52] → 56.541 ms
 * [Tokens: 53] → 55.812 ms
 * [Tokens: 54] → 62.563 ms
 * [Tokens: 55] → 59.360 ms
 * [Tokens: 56] → 63.155 ms
 * [Tokens: 57] → 61.067 ms
 * [Tokens: 58] → 63.929 ms
 * [Tokens: 59] → 61.144 ms
 * [Tokens: 60] → 124.086 ms
 * [Tokens: 61] → 85.227 ms
 * [Tokens: 62] → 71.426 ms
 * [Tokens: 63] → 69.631 ms
 * [Tokens: 64] → 73.990 ms
 * [Tokens: 65] → 67.444 ms
 * [Tokens: 66] → 70.553 ms
 * [Tokens: 67] → 68.022 ms
 * [Tokens: 68] → 72.044 ms
 * [Tokens: 69] → 69.062 ms
 * [Tokens: 70] → 73.560 ms
 * [Tokens: 71] → 89.088 ms
 * [Tokens: 72] → 70.831 ms
 * [Tokens: 73] → 73.376 ms
 * [Tokens: 74] → 71.535 ms
 * [Tokens: 75] → 76.494 ms
 * [Tokens: 76] → 75.649 ms
 * [Tokens: 77] → 79.534 ms
 * [Tokens: 78] → 80.286 ms
 * [Tokens: 79] → 77.434 ms
 * [Tokens: 80] → 76.156 ms
 * [Tokens: 81] → 79.607 ms
 * [Tokens: 82] → 81.545 ms
 * [Tokens: 83] → 79.288 ms
 * [Tokens: 84] → 76.424 ms
 * [Tokens: 85] → 79.833 ms
 * [Tokens: 86] → 80.263 ms
 * [Tokens: 87] → 78.321 ms
 * [Tokens: 88] → 84.756 ms
 * [Tokens: 89] → 90.052 ms
 * [Tokens: 90] → 89.452 ms
 * [Tokens: 91] → 83.718 ms
 * [Tokens: 92] → 92.760 ms
 * [Tokens: 93] → 88.588 ms
 * [Tokens: 94] → 92.357 ms
 * [Tokens: 95] → 83.865 ms
 * [Tokens: 96] → 89.534 ms
 * [Tokens: 97] → 88.627 ms
 * [Tokens: 98] → 86.235 ms
 * [Tokens: 99] → 89.520 ms
 */