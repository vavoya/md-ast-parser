import {BlockquoteBlockNode} from "./type";

export default function createBlockquoteBlockNode(): BlockquoteBlockNode {
    return {
        type: 'blockquote',
        children: [],
    };
}