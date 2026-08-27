export const INLINE_SYNTAX = {
	BOLD: '**',
	ESCAPE: '\\',
	HIGHLIGHT: '==',
	ITALIC: '*',
	STRIKE_THROUGH: '~~',
} as const

/**
 * @description 인라인 코드 구분자.
 * 토글 방식으로 처리하면 코드 내부의 문법까지 해석되므로
 * INLINE_SYNTAX 에 포함하지 않고 별도 레이어에서 처리한다.
 */
export const CODE_SYNTAX = '`'

/**
 * @description 인라인 코드에 부여되는 클래스명
 */
export const CODE_CLASS_NAME = 'code'

/**
 * @description 구분자 자체에 부여되는 클래스명
 */
export const SYNTAX_CLASS_NAME = 'syntax'
