import getClassName from "./getClassName";
import {Inline, InlineSyntax} from "./types";
import createInline from "./createInline";
import { INLINE_SYNTAX } from './syntax';

const escapePatterns = Object.values(INLINE_SYNTAX)
    .sort((a, b) => b.length - a.length)
    .map(value => value[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) // 첫 글자만 패턴으로 사용
    .join('|');

const fullPatterns = Object.values(INLINE_SYNTAX)
    .sort((a, b) => b.length - a.length)
    .map(value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) // 전체 패턴 유지
    .join('|');

// 정규식 생성 (네이밍 추가)
const regex = new RegExp(
    `\\\\(?<escaped>${escapePatterns})|(?<plain>${fullPatterns})`,
    'g'
);

const SYNTAX = 'syntax'

export function tokenizeLine(line: string) {
    const matches = [...line.matchAll(regex)];
    const syntaxSet = new Set<InlineSyntax>([]);
    let prevIndex = 0;

    const tokens = matches.reduce<Inline[]>((inlines, match) => {
        // 구분자 이전 문자열
        if (prevIndex !== match.index) {
            inlines.push(createInline(getClassName(syntaxSet), line.substring(prevIndex, match.index)));
        }

        // 구분자 처리
        const isEscaped = !!match.groups?.escaped;
        if (isEscaped) {
            inlines.push(createInline(`${SYNTAX} ${getClassName(syntaxSet)}`, line.substring(match.index, match.index + 1)));

            prevIndex = match.index + 1
        } else {
            const delimiter = match.groups?.plain as InlineSyntax;

            if (syntaxSet.has(delimiter)) {
                inlines.push(createInline(`${SYNTAX} ${getClassName(syntaxSet)}`, line.substring(match.index, match.index + delimiter.length)));
                syntaxSet.delete(delimiter);
            } else {
                syntaxSet.add(delimiter);
                inlines.push(createInline(`${SYNTAX} ${getClassName(syntaxSet)}`, line.substring(match.index, match.index + delimiter.length)));
            }

            prevIndex = match.index + delimiter.length;
        }

        return inlines;
    }, [])

    // 마지막 토큰 이후의 문자열 처리
    if (prevIndex !== line.length) {
        tokens.push(createInline(getClassName(syntaxSet), line.substring(prevIndex)));
    }

    return tokens;
}