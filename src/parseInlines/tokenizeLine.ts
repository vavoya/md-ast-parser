import getClassName from "./getClassName";
import {Inline, InlineSyntax} from "./types";
import createSpanInline from "./createSpanInline";
import createImgInline from "./createImgInline";
import {regex} from "./regex";

const SYNTAX = 'syntax'

export function tokenizeLine(line: string) {
    const matches = [...line.matchAll(regex)];
    const syntaxSet = new Set<InlineSyntax>([]);
    let prevIndex = 0;

    const tokens = matches.reduce<Inline[]>((inlines, match) => {
        // 구분자 이전 문자열
        if (prevIndex !== match.index) {
            inlines.push(createSpanInline(getClassName(syntaxSet), line.substring(prevIndex, match.index)));
        }

        // 구분자 처리
        const isEscaped = !!match.groups?.escaped;
        if (isEscaped) {
            inlines.push(createSpanInline(`${SYNTAX} ${getClassName(syntaxSet)}`, line.substring(match.index, match.index + 1)));

            prevIndex = match.index + 1
        } else if (match.groups?.plain) {
            const delimiter = match.groups.plain as InlineSyntax;

            if (syntaxSet.has(delimiter)) {
                inlines.push(createSpanInline(`${SYNTAX} ${getClassName(syntaxSet)}`, line.substring(match.index, match.index + delimiter.length)));
                syntaxSet.delete(delimiter);
            } else {
                syntaxSet.add(delimiter);
                inlines.push(createSpanInline(`${SYNTAX} ${getClassName(syntaxSet)}`, line.substring(match.index, match.index + delimiter.length)));
            }

            prevIndex = match.index + delimiter.length;
        } else if (match.groups?.img) {
            const alt = match.groups?.alt ?? '';
            const src = match.groups?.src ?? '';

            inlines.push(createImgInline(alt, src));

            prevIndex = match.index + alt.length + src.length + 5;
        }

        return inlines;
    }, [])

    // 마지막 토큰 이후의 문자열 처리
    if (prevIndex !== line.length) {
        tokens.push(createSpanInline(getClassName(syntaxSet), line.substring(prevIndex)));
    }

    return tokens;
}