import {readCache, storeCache} from "./cache";
import {CodeInline} from "./types";
import createCodeInline from "./createCodeInline";
import {highlighter, langAlias} from "./createHighlighter";

export default function parseCodeInlines(lang: any, code: string): CodeInline[] {
    if (code === "") {
        return []
    }

    // 아직 코드 파서가 준비 안되었으면
    if (!highlighter) {
        createCodeInline(code, "var(--shiki-token-constant)")
        return [createCodeInline(code, "var(--shiki-token-constant)")]
    }

    const key = `${lang}-${code}`
    const cachedTokens = readCache(key)

    if (cachedTokens) {
        return cachedTokens
    }

    // 캐시 없을 때
    const rawTokens = highlighter.codeToTokens(
        code,
        { lang: langAlias[lang.toLowerCase()] ? langAlias[lang.toLowerCase()] : 'plaintext', theme: 'css-variables' }
    );
    const tokens = rawTokens.tokens[0].map(token => createCodeInline(token.content, token.color ?? "var(--shiki-token-constant)"));
    storeCache(key, tokens)
    return tokens
}
