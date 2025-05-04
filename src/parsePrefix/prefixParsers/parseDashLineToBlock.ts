import createListBlockNode from "../../createBlockNode/createListBlockNode";
import createThematicBreakBlockNode from "../../createBlockNode/createThematicBreakBlockNode";
import createParagraphBlockNode from "../../createBlockNode/createParagraphBlockNode";
import { PrefixParseResult } from './types';


export default function parseDashLineToBlock(line: string): PrefixParseResult {
    if (line.startsWith("- ")) {
        return {
            block: createListBlockNode(false, '-'),
            nextLine: line.substring(2),
        };
    }
    else if (line.trim() === "---") {
        return {
            block: createThematicBreakBlockNode(),
            nextLine: '',
        };
    }
    else {
        return {
            block: createParagraphBlockNode(line),
            nextLine: '',
        };
    }
}