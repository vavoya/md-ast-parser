import {BundledLanguage, BundledTheme, createCssVariablesTheme, createHighlighter, HighlighterGeneric} from "shiki";

// Create a custom CSS variables theme, the following are the default values
const myTheme = createCssVariablesTheme({
    name: 'css-variables',
    variablePrefix: '--shiki-',
    variableDefaults: {},
    fontStyle: true
})

let highlighter: HighlighterGeneric<BundledLanguage, BundledTheme> | null = null

const shikiPromise = new Promise((resolve, reject) => {
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