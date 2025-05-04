import { RootBlockNode } from './type';


export default function createRootBlockNode(): RootBlockNode {
	return {
		type: 'rootBlock',
		children: [],
	}
}