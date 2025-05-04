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