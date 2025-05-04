import {ListItemBlockNode} from "./type";

export default function createListItemBlockNode(marker: string): ListItemBlockNode {
    return {
        type: 'listItem',
        marker,
        children: [],
    };
}