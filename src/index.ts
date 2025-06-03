import { shikiPromise } from './parseCodeInlines/createHighlighter';
import parseBlocks from './parseBlocks';
export type {
    ParagraphBlockNode,
    HeadingBlockNode,
    BlockquoteBlockNode,
    ListBlockNode,
    ListItemBlockNode,
    CodeBlockNode,
    ThematicBreakBlockNode,
    RootBlockNode,
    BlockNode,
} from './createBlockNode/type';
export type {
    SpanInline,
    ImgInline,
    LinkInline,
    Inline,
    InlineSyntax,
    InlineSyntaxSet,
} from './parseInlines/types'

export type {
    CodeInline
} from './parseCodeInlines/types'

/**
 * 코드 하이라이터 초기화 Promise.
 * 라이브러리 사용자는 parseBlocks를 호출하기 전에
 * `await shikiPromise`를 반드시 실행해야 함.
 */
export { shikiPromise };

/**
 * 마크다운 블록 파서
 */
export { parseBlocks };

/**
 * 기본 export는 블록 파서 (선택)
 */
export default parseBlocks;
