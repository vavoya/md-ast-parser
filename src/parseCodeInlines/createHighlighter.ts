import {BundledLanguage, BundledTheme, createCssVariablesTheme, createHighlighter, HighlighterGeneric} from "shiki";

// Create a custom CSS variables theme, the following are the default values
const myTheme = createCssVariablesTheme({
    name: 'css-variables',
    variablePrefix: '--shiki-',
    variableDefaults: {},
    fontStyle: true
})

let highlighter: HighlighterGeneric<BundledLanguage, BundledTheme> | null = null

const langs: BundledLanguage[] = [
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
    'css',
]
const langAlias: Record<string, BundledLanguage> = {
    // javascript
    'js': 'javascript',
    'mjs': 'javascript',
    'cjs': 'javascript',

    // typescript
    'ts': 'typescript',

    // python
    'py': 'python',

    // java

    // csharp
    'cs': 'csharp',

    // cpp
    'c++': 'cpp',
    'hpp': 'cpp',
    'cc': 'cpp',
    'cxx': 'cpp',

    // c
    'h': 'c',

    // ruby
    'rb': 'ruby',

    // php
    'php3': 'php',
    'php4': 'php',
    'php5': 'php',
    'phps': 'php',

    // go
    'gopher': 'go',

    // swift

    // kotlin
    'kt': 'kotlin',

    // rust

    // sql
    'sqls': 'sql',

    // bash
    'sh': 'bash',
    'shell': 'bash',
    'ps1': 'bash',

    // html
    'html5': 'html',
    'xhtml': 'html',

    // css
    'scss': 'css',
    'less': 'css',
    'styl': 'css',
}


// 병합
const fullLangMap: Record<string, BundledLanguage> = {
    ...Object.fromEntries(langs.map(lang => [lang, lang])),
    ...langAlias
}



const shikiPromise = new Promise((resolve, reject) => {
    createHighlighter({
        langs,
        langAlias,
        themes: [myTheme] // register the theme
    }).then(result => {
        highlighter = result;
        resolve(true)
    }).catch(() => {
        reject(false)
    });
})

export {
    highlighter,
    shikiPromise,
    fullLangMap
}