import createBlockquoteBlockNode from "../../createBlockNode/createBlockquoteBlockNode";
import createParagraphBlockNode from "../../createBlockNode/createParagraphBlockNode";
import { PrefixParseResult } from './types';


export default function parseGreaterThanLineToBlock(line: string): PrefixParseResult {
    if (line.startsWith("> ")) {
        return {
            block: createBlockquoteBlockNode(),
            nextLine: line.substring(2),
        };
    } else {
        return {
            block: createParagraphBlockNode(line),
            nextLine: '',
        };
    }
}