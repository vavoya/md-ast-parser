// block-generation.test.ts
import {test, describe, before} from 'node:test'
import parseBlocks from '../parseBlocks';
import {shikiPromise} from "../parseCodeInlines/createHighlighter";

// JSON 비교 함수
function assertEqualJSON(actual: any, expected: any) {
	const a = JSON.stringify(actual, null, 2)
	const b = JSON.stringify(expected, null, 2)
	if (a !== b) {
		throw new Error(`Test failed.\nExpected:\n${b}\nActual:\n${a}`)
	}
}


// 전역 비동기 초기화
before(async () => {
	await shikiPromise;
});

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
											"type": "span",
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
															"type": "span",
															"className": "",
															"text": "리스트2"
														}
													]
												},
												{
													"type": "paragraph",
													"children": [
														{
															"type": "span",
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
											"type": "span",
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
											"type": "span",
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
															"type": "span",
															"className": "",
															"text": "리스트2"
														}
													]
												},
												{
													"type": "paragraph",
													"children": [
														{
															"type": "span",
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
											"type": "span",
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
											"type": "span",
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
															"type": "span",
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
							"type": "span",
							"className": "",
							"text": "   리스트22"
						}
					]
				},
				{
					"type": "paragraph",
					"children": [
						{
							"type": "span",
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
									"type": "span",
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
											"type": "span",
											"className": "",
											"text": "인용문2"
										}
									]
								},
								{
									"type": "paragraph",
									"children": [
										{
											"type": "span",
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
									"type": "span",
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
									"type": "span",
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
													"type": "span",
													"className": "",
													"text": "리스트1"
												}
											]
										},
										{
											"type": "paragraph",
											"children": [
												{
													"type": "span",
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
															"type": "span",
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
									"type": "span",
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
									"type": "span",
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
													"type": "span",
													"className": "",
													"text": "리스트1"
												}
											]
										},
										{
											"type": "paragraph",
											"children": [
												{
													"type": "span",
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
															"type": "span",
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
																"text": "const",
																"color": "var(--shiki-token-keyword)"
															},
															{
																"text": " ",
																"color": "var(--shiki-foreground)"
															},
															{
																"text": "a",
																"color": "var(--shiki-token-constant)"
															},
															{
																"text": " ",
																"color": "var(--shiki-foreground)"
															},
															{
																"text": "=",
																"color": "var(--shiki-token-keyword)"
															},
															{
																"text": " ",
																"color": "var(--shiki-foreground)"
															},
															{
																"text": "2",
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
									"type": "span",
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
									"type": "span",
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
													"type": "span",
													"className": "",
													"text": "리스트1"
												}
											]
										},
										{
											"type": "paragraph",
											"children": [
												{
													"type": "span",
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
															"type": "span",
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
																"text": "const",
																"color": "var(--shiki-token-keyword)"
															},
															{
																"text": " ",
																"color": "var(--shiki-foreground)"
															},
															{
																"text": "a",
																"color": "var(--shiki-token-constant)"
															},
															{
																"text": " ",
																"color": "var(--shiki-foreground)"
															},
															{
																"text": "=",
																"color": "var(--shiki-token-keyword)"
															},
															{
																"text": " ",
																"color": "var(--shiki-foreground)"
															},
															{
																"text": "2",
																"color": "var(--shiki-token-constant)"
															}
														]
													]
												},
												{
													"type": "paragraph",
													"children": [
														{
															"type": "span",
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
									"type": "span",
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