import getClassName from "./getClassName";
import {ImgInline, InlineSyntax, SpanInline} from "./types";
import createSpanInline from "./createSpanInline";
import createImgInline from "./createImgInline";
import {defaultRegex} from "./regex";

const SYNTAX = 'syntax'

export function parseInline(line: string) {
    const matches = [...line.matchAll(defaultRegex)];
    const syntaxSet = new Set<InlineSyntax>([]);
    let prevIndex = 0;

    const tokens = matches.reduce<(SpanInline | ImgInline)[]>((inlines, match) => {

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
            const alt = match.groups.alt as string;
            const src = match.groups.src as string;
            inlines.push(createImgInline(alt, src));
            prevIndex = match.index + match.groups.img.length

        }

        return inlines;
    }, [])

    // 마지막 토큰 이후의 문자열 처리
    if (prevIndex !== line.length) {
        tokens.push(createSpanInline(getClassName(syntaxSet), line.substring(prevIndex)));
    }

    return tokens;
}