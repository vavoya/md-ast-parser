import createCodeBlockNode from "../../createBlockNode/createCodeBlockNode";
import createParagraphBlockNode from "../../createBlockNode/createParagraphBlockNode";
import { PrefixParseResult } from './types';


export default function parseBacktickLineToBlock(line: string): PrefixParseResult {
    if (line.startsWith("```")) {
        return {
            block: createCodeBlockNode(line.substring(3).trim()),
            nextLine: '',
        };
    } else {
        return {
            block: createParagraphBlockNode(line),
            nextLine: '',
        };
    }
}