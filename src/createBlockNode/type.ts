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
