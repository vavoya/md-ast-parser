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
export const langAlias: Record<string, BundledLanguage> = {
    'js': 'javascript',
    'mjs': 'javascript',
    'cjs': 'javascript',

    'ts': 'typescript',

    'py': 'python',

    'cs': 'csharp',

    'c++': 'cpp',
    'hpp': 'cpp',
    'cc': 'cpp',

    'rb': 'ruby',

    'ps1': 'bash',
    'sh': 'bash',
    'shell': 'bash',

    'kt': 'kotlin',

    'sqls': 'sql',

    'html5': 'html',
    'xhtml': 'html',

    'scss': 'css',
    'less': 'css',
    'styl': 'css',

    'gopher': 'go',

    'cxx': 'cpp',
    'h': 'c',
    'php3': 'php',
    'php4': 'php',
    'php5': 'php',
    'phps': 'php'
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
}