import createListBlockNode from "../../createBlockNode/createListBlockNode";
import createParagraphBlockNode from "../../createBlockNode/createParagraphBlockNode";
import { PrefixParseResult } from './types';


export default function parseNumberLineToBlock(line: string): PrefixParseResult {
    const match = line.match(/^\d{1,3}\.\s/)
    if (match) {
        const marker = match[0].slice(0, -1)

        return {
            block: createListBlockNode(true, marker),
            nextLine: line.substring(match[0].length),
        };
    } else {
        return {
            block: createParagraphBlockNode(line),
            nextLine: '',
        };
    }
}