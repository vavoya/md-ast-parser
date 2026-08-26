import {readCache, storeCache} from "./cache";
import parseInlinesWithCode from "./parseInlinesWithCode";

export default function parseInlines(line: string) {
    // 캐시 검사
    const cachedTokens = readCache(line)
    if (cachedTokens) {
        return cachedTokens;
    }

    const inlines = parseInlinesWithCode(line);
    storeCache(line, inlines);
    return inlines
}
