import {INLINE_SYNTAX} from "./syntax";

const escapeRegexChars = (str: string) =>
    str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const sortedSyntax = Object.values(INLINE_SYNTAX).sort((a, b) => b.length - a.length);

const escapePatterns = sortedSyntax
    .map(value => escapeRegexChars(value[0])) // 첫 글자만 패턴으로 사용
    .join('|');

const fullPatterns = sortedSyntax
    .map(escapeRegexChars) // 전체 패턴 유지
    .join('|');

// 이미지 전체 구문 추가
const imagePattern = `(?<!\\\\)!\\[(?<alt>(?!.*!\\[)[^\\]]*)\\]\\((?<src>[^)]+)\\)`;



// 정규식 생성 (네이밍 추가)
const defaultRegex = new RegExp(
    `\\\\(?<escaped>${escapePatterns})|(?<img>${imagePattern})|(?<plain>${fullPatterns})`,
    'g'
);


export {
    defaultRegex,
}