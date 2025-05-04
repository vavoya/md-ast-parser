import {CodeBlockNode} from "./type";

export default function createCodeBlockNode(lang: string): CodeBlockNode {
    return {
        type: 'codeBlock',
        lang,
        children: [],
    };
}