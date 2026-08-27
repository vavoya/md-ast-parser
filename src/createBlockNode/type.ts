import {Inline} from "../parseInlines/types";
import {CodeInline} from "../parseCodeInlines/types";

type HeadingBlockNode = {
    type: 'heading';
    level: number;
    children: Inline[];
}

type ParagraphBlockNode = {
    type: 'paragraph';
    children: Inline[];
}

type BlockquoteBlockNode = {
    type: 'blockquote';
    children: BlockNode[];
}

type ListBlockNode = {
    type: 'list';
    isOrdered: boolean;
    children: ListItemBlockNode[];
}

type ListItemBlockNode = {
    type: 'listItem';
    marker: string;
    children: BlockNode[];
}

type CodeBlockNode = {
    type: 'codeBlock';
    lang: string;
    children: CodeInline[][];
}

type ThematicBreakBlockNode = {
    type: 'thematicBreakBlock';
}

type RootBlockNode = {
    type: 'rootBlock';
    children: BlockNode[];
}

type BlockNode =
    | ParagraphBlockNode
    | HeadingBlockNode
    | BlockquoteBlockNode
    | ListBlockNode
    | ListItemBlockNode
    | CodeBlockNode
    | ThematicBreakBlockNode
    | RootBlockNode;

/**
 * @description 최상위 블럭. 해당 블럭을 만들어낸 원문을 함께 가진다.
 */
export type TopLevelBlockNode = BlockNode & { rawText: string };

/**
 * @description parseBlocks 의 반환 타입.
 * 최상위 자식은 rawText 를 보장한다.
 */
export type ParsedRootBlockNode = {
    type: 'rootBlock';
    children: TopLevelBlockNode[];
}



export {
    ParagraphBlockNode,
    HeadingBlockNode,
    BlockquoteBlockNode,
    ListBlockNode,
    ListItemBlockNode,
    CodeBlockNode,
    ThematicBreakBlockNode,
    RootBlockNode,
    BlockNode,
}
