import {InlineSyntax, InlineSyntaxSet} from "./types";
import { INLINE_SYNTAX } from './syntax';

const syntaxClassNameMap: Record<InlineSyntax, string> = {
    [INLINE_SYNTAX.BOLD]: `bold`,
    [INLINE_SYNTAX.ITALIC]: 'italic',
    [INLINE_SYNTAX.STRIKE_THROUGH]: 'strikethrough',
    [INLINE_SYNTAX.HIGHLIGHT]: 'highlight',
    [INLINE_SYNTAX.ESCAPE]: ''
}

export default function getClassName(syntaxSet: InlineSyntaxSet) {
    const classNames: string[] = []

    syntaxSet.forEach((syntax) => {
        const className = syntaxClassNameMap[syntax]

        if (className) {
            classNames.push(className)
        }
    })

    return classNames.join(' ')
}