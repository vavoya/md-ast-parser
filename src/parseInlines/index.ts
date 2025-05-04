import {readCache, storeCache} from "./cache";
import {tokenizeLine} from "./tokenizeLine";

export default function parseInlines(line: string) {
    // 캐시 검사
    const cachedTokens = readCache(line)
    if (cachedTokens) {
        return cachedTokens;
    }

    const tokens = tokenizeLine(line);
    storeCache(line, tokens);
    return tokens
}
