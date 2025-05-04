import {ParagraphBlockNode} from "./type";
import parseInlines from "../parseInlines";

export default function createParagraphBlockNode(line: string): ParagraphBlockNode {
    return {
        type: 'paragraph',
        children: parseInlines(line),
    };
}