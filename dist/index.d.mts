declare const shikiPromise: Promise<unknown>;

declare const INLINE_SYNTAX: {
    readonly BOLD: "**";
    readonly ESCAPE: "\\";
    readonly HIGHLIGHT: "==";
    readonly ITALIC: "*";
    readonly STRIKE_THROUGH: "~~";
};

type SpanInline = {
    type: 'span';
    className: string;
    text: string;
};
type ImgInline = {
    type: 'img';
    alt: string;
    src: string;
};
type LinkInline = {
    type: 'link';
    href: string;
    children: (SpanInline | ImgInline)[];
};
type Inline = SpanInline | ImgInline | LinkInline;
type InlineSyntax = typeof INLINE_SYNTAX[keyof typeof INLINE_SYNTAX];
type InlineSyntaxSet = Set<InlineSyntax>;

type CodeInline = {
    text: string;
    color: string;
};

type HeadingBlockNode = {
    type: 'heading';
    level: number;
    children: Inline[];
};
type ParagraphBlockNode = {
    type: 'paragraph';
    children: Inline[];
};
type BlockquoteBlockNode = {
    type: 'blockquote';
    children: BlockNode[];
};
type ListBlockNode = {
    type: 'list';
    isOrdered: boolean;
    children: ListItemBlockNode[];
};
type ListItemBlockNode = {
    type: 'listItem';
    marker: string;
    children: BlockNode[];
};
type CodeBlockNode = {
    type: 'codeBlock';
    lang: string;
    children: CodeInline[][];
};
type ThematicBreakBlockNode = {
    type: 'thematicBreakBlock';
};
type RootBlockNode = {
    type: 'rootBlock';
    children: BlockNode[];
};
type BlockNode = ParagraphBlockNode | HeadingBlockNode | BlockquoteBlockNode | ListBlockNode | ListItemBlockNode | CodeBlockNode | ThematicBreakBlockNode | RootBlockNode;
/**
 * @description 최상위 블럭. 해당 블럭을 만들어낸 원문을 함께 가진다.
 */
type TopLevelBlockNode = BlockNode & {
    rawText: string;
};
/**
 * @description parseBlocks 의 반환 타입.
 * 최상위 자식은 rawText 를 보장한다.
 */
type ParsedRootBlockNode = {
    type: 'rootBlock';
    children: TopLevelBlockNode[];
};

/**
 * @description 여러 줄의 마크다운을 블럭 AST 로 변환한다.
 *
 * 최상위 블럭에는 그 블럭을 만들어낸 원문(rawText)이 함께 담긴다.
 * 파싱 도중에는 불변성 유지를 위해 노드가 교체되므로, 원문을 노드에 직접 쌓지 않고
 * 별도 배열에 모았다가 파싱이 끝난 뒤에 한 번에 주입한다.
 *
 * @param lines 줄 단위로 나뉜 마크다운
 * @returns 최상위 자식이 rawText 를 가지는 루트 블럭
 */
declare function parseBlocks(lines: string[]): ParsedRootBlockNode;

export { type BlockNode, type BlockquoteBlockNode, type CodeBlockNode, type CodeInline, type HeadingBlockNode, type ImgInline, type Inline, type InlineSyntax, type InlineSyntaxSet, type LinkInline, type ListBlockNode, type ListItemBlockNode, type ParagraphBlockNode, type ParsedRootBlockNode, type RootBlockNode, type SpanInline, type ThematicBreakBlockNode, type TopLevelBlockNode, parseBlocks as default, parseBlocks, shikiPromise };
