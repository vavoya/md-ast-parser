import createHeadingBlockNode from "../../createBlockNode/createHeadingBlockNode";
import createParagraphBlockNode from "../../createBlockNode/createParagraphBlockNode";
import { PrefixParseResult } from './types';

export default function parseHashLineToBlock(line: string): PrefixParseResult {
    if (line.startsWith("### ")) {
        return {
            block: createHeadingBlockNode(3, line),
            nextLine: '',
        };
    } else if (line.startsWith("## ")) {
        return {
            block: createHeadingBlockNode(2, line),
            nextLine: '',
        };
    } else if (line.startsWith("# ")) {
        return {
            block: createHeadingBlockNode(1, line),
            nextLine: '',
        };
    } else {
        return {
            block: createParagraphBlockNode(line),
            nextLine: '',
        };
    }
}