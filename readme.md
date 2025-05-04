# md-ast-parser

## 용도
마크다운을 AST 트리로 변환

## npm 주소
https://www.npmjs.com/package/md-ast-parser

## 테스트 코드
### 블럭 생성  테스트
```js
// block-generation.test.ts
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



describe('테스트', () => {
	test('빈문단 블럭 파싱 동작', () => {
		const lines = [
			''
		]
		const actual = parseBlocks(lines)
		const expected = {
			"type": "rootBlock",
			"children": [
				{
					"type": "paragraph",
					"children": []
				}
			]
		}
		assertEqualJSON(actual, expected)
	})

	test('문단 블럭 파싱 동작', () => {
		const lines = [
			'**강조*기울기~~취소선==하이라이트**강조삭제*기울기삭제~~취소선삭제==하이라이트삭제'
		]
		const actual = parseBlocks(lines)
		const expected = {
			"type": "rootBlock",
			"children": [
				{
					"type": "paragraph",
					"children": [
						{
							"className": "syntax bold",
							"text": "**"
						},
						{
							"className": "bold",
							"text": "강조"
						},
						{
							"className": "syntax bold italic",
							"text": "*"
						},
						{
							"className": "bold italic",
							"text": "기울기"
						},
						{
							"className": "syntax bold italic strikethrough",
							"text": "~~"
						},
						{
							"className": "bold italic strikethrough",
							"text": "취소선"
						},
						{
							"className": "syntax bold italic strikethrough highlight",
							"text": "=="
						},
						{
							"className": "bold italic strikethrough highlight",
							"text": "하이라이트"
						},
						{
							"className": "syntax bold italic strikethrough highlight",
							"text": "**"
						},
						{
							"className": "italic strikethrough highlight",
							"text": "강조삭제"
						},
						{
							"className": "syntax italic strikethrough highlight",
							"text": "*"
						},
						{
							"className": "strikethrough highlight",
							"text": "기울기삭제"
						},
						{
							"className": "syntax strikethrough highlight",
							"text": "~~"
						},
						{
							"className": "highlight",
							"text": "취소선삭제"
						},
						{
							"className": "syntax highlight",
							"text": "=="
						},
						{
							"className": "",
							"text": "하이라이트삭제"
						}
					]
				}
			]
		}
		assertEqualJSON(actual, expected)
	})

	test('인라인 이스케이프 동작', () => {
		const lines = [
			'**강조\\*기울기 안하고~~취소선==하이라이트**강조삭제*기울기~~취소선삭제==하이라이트삭제'
		]
		const actual = parseBlocks(lines)
		const expected = {
			"type": "rootBlock",
			"children": [
				{
					"type": "paragraph",
					"children": [
						{
							"className": "syntax bold",
							"text": "**"
						},
						{
							"className": "bold",
							"text": "강조"
						},
						{
							"className": "syntax bold",
							"text": "\\"
						},
						{
							"className": "bold",
							"text": "*기울기 안하고"
						},
						{
							"className": "syntax bold strikethrough",
							"text": "~~"
						},
						{
							"className": "bold strikethrough",
							"text": "취소선"
						},
						{
							"className": "syntax bold strikethrough highlight",
							"text": "=="
						},
						{
							"className": "bold strikethrough highlight",
							"text": "하이라이트"
						},
						{
							"className": "syntax bold strikethrough highlight",
							"text": "**"
						},
						{
							"className": "strikethrough highlight",
							"text": "강조삭제"
						},
						{
							"className": "syntax strikethrough highlight italic",
							"text": "*"
						},
						{
							"className": "strikethrough highlight italic",
							"text": "기울기"
						},
						{
							"className": "syntax strikethrough highlight italic",
							"text": "~~"
						},
						{
							"className": "highlight italic",
							"text": "취소선삭제"
						},
						{
							"className": "syntax highlight italic",
							"text": "=="
						},
						{
							"className": "italic",
							"text": "하이라이트삭제"
						}
					]
				}
			]
		}
		assertEqualJSON(actual, expected)
	})

	test('헤딩 블럭 파싱 동작', () => {
		const lines = [
			'# **헤더1**',
			'## *헤더2*',
			'### 헤더3',
			'### ',
			'#이건헤더?'
		]
		const actual = parseBlocks(lines)
		const expected = {
			"type": "rootBlock",
			"children": [
				{
					"type": "heading",
					"level": 1,
					"children": [
						{
							"className": "syntax bold",
							"text": "**"
						},
						{
							"className": "bold",
							"text": "헤더1"
						},
						{
							"className": "syntax bold",
							"text": "**"
						}
					]
				},
				{
					"type": "heading",
					"level": 2,
					"children": [
						{
							"className": "syntax italic",
							"text": "*"
						},
						{
							"className": "italic",
							"text": "헤더2"
						},
						{
							"className": "syntax italic",
							"text": "*"
						}
					]
				},
				{
					"type": "heading",
					"level": 3,
					"children": [
						{
							"className": "",
							"text": "헤더3"
						}
					]
				},
				{
					"type": "heading",
					"level": 3,
					"children": []
				},
				{
					"type": "paragraph",
					"children": [
						{
							"className": "",
							"text": "#이건헤더?"
						}
					]
				}
			]
		}
		assertEqualJSON(actual, expected)
	})

	test('인용문 테스트', () => {
		const lines = [
			'> 인용문**강조'
		]
		const actual = parseBlocks(lines)
		const expected = {
			"type": "rootBlock",
			"children": [
				{
					"type": "blockquote",
					"children": [
						{
							"type": "paragraph",
							"children": [
								{
									"className": "",
									"text": "인용문"
								},
								{
									"className": "syntax bold",
									"text": "**"
								},
								{
									"className": "bold",
									"text": "강조"
								}
							]
						}
					]
				}
			]
		}
		assertEqualJSON(actual, expected)
	})

	test('리스트 테스트', () => {
		const lines = [
			'- ul',
			'1. ol'
		]
		const actual = parseBlocks(lines)
		const expected = {
			"type": "rootBlock",
			"children": [
				{
					"type": "list",
					"isOrdered": false,
					"children": [
						{
							"type": "listItem",
							"marker": "-",
							"children": [
								{
									"type": "paragraph",
									"children": [
										{
											"className": "",
											"text": "ul"
										}
									]
								}
							]
						}
					]
				},
				{
					"type": "list",
					"isOrdered": true,
					"children": [
						{
							"type": "listItem",
							"marker": "1.",
							"children": [
								{
									"type": "paragraph",
									"children": [
										{
											"className": "",
											"text": "ol"
										}
									]
								}
							]
						}
					]
				}
			]
		}
		assertEqualJSON(actual, expected)
	})

	test('코드블럭 테스트', () => {
		const lines = [
			'```js',
			'const a = 2',
			'```',
			'여긴 코드블럭이 아니다.'
		]
		const actual = parseBlocks(lines)
		const expected = {
			"type": "rootBlock",
			"children": [
				{
					"type": "codeBlock",
					"lang": "js",
					"children": [
						[
							{
								"text": "const a = 2",
								"color": "var(--shiki-token-constant)"
							}
						]
					]
				},
				{
					"type": "paragraph",
					"children": [
						{
							"className": "",
							"text": "여긴 코드블럭이 아니다."
						}
					]
				}
			]
		}
		assertEqualJSON(actual, expected)
	})
})
```

### 중첩 블럭 생성 테스트
```js
// block-generation.test.ts
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



describe('중첩 테스트', () => {
	test('UL리스트 중첩', () => {
		const lines = [
			'- 리스트1',
			'  - 리스트2',
			'    리스트22',
			'  리스트11',
		]
		const actual = parseBlocks(lines)
		const expected = {
			"type": "rootBlock",
			"children": [
				{
					"type": "list",
					"isOrdered": false,
					"children": [
						{
							"type": "listItem",
							"marker": "-",
							"children": [
								{
									"type": "paragraph",
									"children": [
										{
											"className": "",
											"text": "리스트1"
										}
									]
								},
								{
									"type": "list",
									"isOrdered": false,
									"children": [
										{
											"type": "listItem",
											"marker": "-",
											"children": [
												{
													"type": "paragraph",
													"children": [
														{
															"className": "",
															"text": "리스트2"
														}
													]
												},
												{
													"type": "paragraph",
													"children": [
														{
															"className": "",
															"text": "리스트22"
														}
													]
												}
											]
										}
									]
								},
								{
									"type": "paragraph",
									"children": [
										{
											"className": "",
											"text": "리스트11"
										}
									]
								}
							]
						}
					]
				}
			]
		}
		assertEqualJSON(actual, expected)
	})

	test('OL리스트 중첩', () => {
		const lines = [
			'1. 리스트1',
			'   22. 리스트2',
			'       리스트22',
			'   리스트11',
		]
		const actual = parseBlocks(lines)
		const expected = {
			"type": "rootBlock",
			"children": [
				{
					"type": "list",
					"isOrdered": true,
					"children": [
						{
							"type": "listItem",
							"marker": "1.",
							"children": [
								{
									"type": "paragraph",
									"children": [
										{
											"className": "",
											"text": "리스트1"
										}
									]
								},
								{
									"type": "list",
									"isOrdered": true,
									"children": [
										{
											"type": "listItem",
											"marker": "22.",
											"children": [
												{
													"type": "paragraph",
													"children": [
														{
															"className": "",
															"text": "리스트2"
														}
													]
												},
												{
													"type": "paragraph",
													"children": [
														{
															"className": "",
															"text": "리스트22"
														}
													]
												}
											]
										}
									]
								},
								{
									"type": "paragraph",
									"children": [
										{
											"className": "",
											"text": "리스트11"
										}
									]
								}
							]
						}
					]
				}
			]
		}
		assertEqualJSON(actual, expected)
	})

	test('OL리스트 중첩 붕괴', () => {
		const lines = [
			'1. 리스트1',
			'   22. 리스트2',
			'      리스트22',
			'   리스트11',
		]
		const actual = parseBlocks(lines)
		const expected = {
			"type": "rootBlock",
			"children": [
				{
					"type": "list",
					"isOrdered": true,
					"children": [
						{
							"type": "listItem",
							"marker": "1.",
							"children": [
								{
									"type": "paragraph",
									"children": [
										{
											"className": "",
											"text": "리스트1"
										}
									]
								},
								{
									"type": "list",
									"isOrdered": true,
									"children": [
										{
											"type": "listItem",
											"marker": "22.",
											"children": [
												{
													"type": "paragraph",
													"children": [
														{
															"className": "",
															"text": "리스트2"
														}
													]
												}
											]
										}
									]
								}
							]
						}
					]
				},
				{
					"type": "paragraph",
					"children": [
						{
							"className": "",
							"text": "   리스트22"
						}
					]
				},
				{
					"type": "paragraph",
					"children": [
						{
							"className": "",
							"text": "   리스트11"
						}
					]
				}
			]
		}
		assertEqualJSON(actual, expected)
	})

	test('인용문 중첩', () => {
		const lines = [
			'> 인용문1',
			'  > 인용문2',
			'    인용문22',
			'  인용문11',
		]
		const actual = parseBlocks(lines)
		const expected = {
			"type": "rootBlock",
			"children": [
				{
					"type": "blockquote",
					"children": [
						{
							"type": "paragraph",
							"children": [
								{
									"className": "",
									"text": "인용문1"
								}
							]
						},
						{
							"type": "blockquote",
							"children": [
								{
									"type": "paragraph",
									"children": [
										{
											"className": "",
											"text": "인용문2"
										}
									]
								},
								{
									"type": "paragraph",
									"children": [
										{
											"className": "",
											"text": "인용문22"
										}
									]
								}
							]
						},
						{
							"type": "paragraph",
							"children": [
								{
									"className": "",
									"text": "인용문11"
								}
							]
						}
					]
				}
			]
		}
		assertEqualJSON(actual, expected)
	})

	test('인용문 리스트 중첩', () => {
		const lines = [
			'> 인용문1',
			'  1. 리스트1',
			'     리스트11',
			'     > 인용문2',
			'  인용문11',
		]
		const actual = parseBlocks(lines)
		const expected = {
			"type": "rootBlock",
			"children": [
				{
					"type": "blockquote",
					"children": [
						{
							"type": "paragraph",
							"children": [
								{
									"className": "",
									"text": "인용문1"
								}
							]
						},
						{
							"type": "list",
							"isOrdered": true,
							"children": [
								{
									"type": "listItem",
									"marker": "1.",
									"children": [
										{
											"type": "paragraph",
											"children": [
												{
													"className": "",
													"text": "리스트1"
												}
											]
										},
										{
											"type": "paragraph",
											"children": [
												{
													"className": "",
													"text": "리스트11"
												}
											]
										},
										{
											"type": "blockquote",
											"children": [
												{
													"type": "paragraph",
													"children": [
														{
															"className": "",
															"text": "인용문2"
														}
													]
												}
											]
										}
									]
								}
							]
						},
						{
							"type": "paragraph",
							"children": [
								{
									"className": "",
									"text": "인용문11"
								}
							]
						}
					]
				}
			]
		}
		assertEqualJSON(actual, expected)
	})

	test('인용문 리스트 코드블럭(open) 중첩', () => {
		const lines = [
			'> 인용문1',
			'  1. 리스트1',
			'     리스트11',
			'     > 인용문2',
			'       ```js',
			'       const a = 2',
			'  인용문11',
		]
		const actual = parseBlocks(lines)
		const expected = {
			"type": "rootBlock",
			"children": [
				{
					"type": "blockquote",
					"children": [
						{
							"type": "paragraph",
							"children": [
								{
									"className": "",
									"text": "인용문1"
								}
							]
						},
						{
							"type": "list",
							"isOrdered": true,
							"children": [
								{
									"type": "listItem",
									"marker": "1.",
									"children": [
										{
											"type": "paragraph",
											"children": [
												{
													"className": "",
													"text": "리스트1"
												}
											]
										},
										{
											"type": "paragraph",
											"children": [
												{
													"className": "",
													"text": "리스트11"
												}
											]
										},
										{
											"type": "blockquote",
											"children": [
												{
													"type": "paragraph",
													"children": [
														{
															"className": "",
															"text": "인용문2"
														}
													]
												},
												{
													"type": "codeBlock",
													"lang": "js",
													"children": [
														[
															{
																"text": "const a = 2",
																"color": "var(--shiki-token-constant)"
															}
														]
													]
												}
											]
										}
									]
								}
							]
						},
						{
							"type": "paragraph",
							"children": [
								{
									"className": "",
									"text": "인용문11"
								}
							]
						}
					]
				}
			]
		}
		assertEqualJSON(actual, expected)
	})

	test('인용문 리스트 코드블럭(close) 중첩', () => {
		const lines = [
			'> 인용문1',
			'  1. 리스트1',
			'     리스트11',
			'     > 인용문2',
			'       ```js',
			'       const a = 2',
			'       ```',
			'       const a = 2',
			'  인용문11',
		]
		const actual = parseBlocks(lines)
		const expected = {
			"type": "rootBlock",
			"children": [
				{
					"type": "blockquote",
					"children": [
						{
							"type": "paragraph",
							"children": [
								{
									"className": "",
									"text": "인용문1"
								}
							]
						},
						{
							"type": "list",
							"isOrdered": true,
							"children": [
								{
									"type": "listItem",
									"marker": "1.",
									"children": [
										{
											"type": "paragraph",
											"children": [
												{
													"className": "",
													"text": "리스트1"
												}
											]
										},
										{
											"type": "paragraph",
											"children": [
												{
													"className": "",
													"text": "리스트11"
												}
											]
										},
										{
											"type": "blockquote",
											"children": [
												{
													"type": "paragraph",
													"children": [
														{
															"className": "",
															"text": "인용문2"
														}
													]
												},
												{
													"type": "codeBlock",
													"lang": "js",
													"children": [
														[
															{
																"text": "const a = 2",
																"color": "var(--shiki-token-constant)"
															}
														]
													]
												},
												{
													"type": "paragraph",
													"children": [
														{
															"className": "",
															"text": "const a = 2"
														}
													]
												}
											]
										}
									]
								}
							]
						},
						{
							"type": "paragraph",
							"children": [
								{
									"className": "",
									"text": "인용문11"
								}
							]
						}
					]
				}
			]
		}
		assertEqualJSON(actual, expected)
	})
})
```

### 성능 테스트
```js
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
```