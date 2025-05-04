import {HeadingBlockNode} from "./type";
import parseInlines from "../parseInlines";

export default function createHeadingBlockNode(level: number, line: string): HeadingBlockNode {
    return {
        type: 'heading',
        level: level,
        children: parseInlines(line.substring(level + 1)),
    };
}