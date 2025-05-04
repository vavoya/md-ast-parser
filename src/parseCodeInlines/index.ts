import {createHighlighter, createCssVariablesTheme, HighlighterGeneric, BundledLanguage, BundledTheme} from 'shiki'
import {readCache, storeCache} from "./cache";
import {CodeInline} from "./types";
import createCodeInline from "./createCodeInline";

// Create a custom CSS variables theme, the following are the default values
const myTheme = createCssVariablesTheme({
    name: 'css-variables',
    variablePrefix: '--shiki-',
    variableDefaults: {},
    fontStyle: true
})

let highlighter: HighlighterGeneric<BundledLanguage, BundledTheme> | null = null

createHighlighter({
    langs: [
        'javascript',
        'typescript',
        'python',
        'java',
        'csharp',
        'cpp',
        'c',
        'ruby',
        'php',
        'go',
        'swift',
        'kotlin',
        'rust',
        'sql',
        'bash',
        'html',
        'css'
    ],
    themes: [myTheme] // register the theme
}).then(result => {
    highlighter = result
});

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
        { lang: lang, theme: 'css-variables' }
    );
    const tokens = rawTokens.tokens[0].map(token => createCodeInline(token.content, token.color ?? "var(--shiki-token-constant)"));
    storeCache(key, tokens)
    return tokens
}
