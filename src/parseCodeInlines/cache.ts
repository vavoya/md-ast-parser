import {LRUCache} from "lru-cache";
import {CodeInline} from "./types";

const codeCache = new LRUCache<string, CodeInline[]>({
    max: 1000,  // 적절한 캐시 사이즈
    updateAgeOnGet: true
});

// 캐시에서 값을 읽어 반환하는 함수
export function readCache(key: string) {
    return codeCache.get(key);
}

// 캐시에 값을 저장하는 함수
export function storeCache(key: string, value: CodeInline[]) {
    codeCache.set(key, value);
    return value;
}
