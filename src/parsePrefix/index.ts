import prefixparsers from "./prefixParsers";
import createParagraphBlockNode from "../createBlockNode/createParagraphBlockNode";
import { PrefixParseResult } from './prefixParsers/types';


export default function parsePrefix(line: string) {
    const prefix = line[0];

    let prefixParseResult: PrefixParseResult;

    if (prefix in prefixparsers) {
        const prefixKey = prefix as keyof typeof prefixparsers;
        const parsePrefix = prefixparsers[prefixKey];

        prefixParseResult = parsePrefix(line);
    }
    else {
        prefixParseResult = {
            block: createParagraphBlockNode(line),
            nextLine: '',
        };
    }

    return prefixParseResult;
}