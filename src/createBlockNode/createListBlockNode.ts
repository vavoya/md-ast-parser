import {ListBlockNode} from "./type";
import createListItemBlockNode from './createListItemBlockNode';

export default function createListBlockNode(isOrdered: boolean, marker: string): ListBlockNode {
    return {
        type: 'list',
        isOrdered,
        children: [
            createListItemBlockNode(marker),
        ]
    };
}