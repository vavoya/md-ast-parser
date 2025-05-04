import {LRUCache} from 'lru-cache';
import {Inline} from "./types";

const inlineCache = new LRUCache<string, Inline[]>({
    max: 1000,  // 적절한 캐시 사이즈
});

// 캐시에서 값을 읽어 반환하는 함수
export function readCache(key: string) {
    return inlineCache.get(key);
}

// 캐시에 값을 저장하는 함수
export function storeCache(key: string, value: Inline[]) {
    inlineCache.set(key, value);
    return value;
}
