import {readCache, storeCache} from "./cache";
import parseInlinesWithLinks from "./parseInlinesWithLinks";

export default function parseInlines(line: string) {
    // 캐시 검사
    const cachedTokens = readCache(line)
    if (cachedTokens) {
        return cachedTokens;
    }

    const inlines = parseInlinesWithLinks(line);
    storeCache(line, inlines);
    return inlines
}
