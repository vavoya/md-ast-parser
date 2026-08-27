import {Inline, InlineSyntax, InlineSyntaxSet} from "./types";
import {CODE_CLASS_NAME, SYNTAX_CLASS_NAME} from "./syntax";
import scanCodeSpans from "./scanCodeSpans";
import parseInlinesWithLinks from "./parseInlinesWithLinks";
import createSpanInline from "./createSpanInline";
import getClassName from "./getClassName";

/**
 * @description 인라인 코드를 가장 먼저 분리한 뒤, 나머지 구간만 링크/구분자 파서에 넘긴다.
 *
 * 코드 구간은 내부를 파싱하지 않으므로 `**bold**` 같은 문법이 그대로 남는다.
 * 백틱 자체는 지우지 않고 syntax 클래스를 가진 토큰으로 보존해,
 * 편집기에서 커서 위치에 따라 원문을 드러낼 수 있게 한다.
 *
 * @param text 파싱할 한 줄
 * @returns 인라인 토큰 배열
 */
export default function parseInlinesWithCode(text: string): Inline[] {
    const segments = scanCodeSpans(text);

    // 코드 구간이 없으면 기존 경로를 그대로 사용한다
    if (segments.length === 0) {
        return parseInlinesWithLinks(text);
    }
    if (segments.length === 1 && segments[0].type === 'text') {
        return parseInlinesWithLinks(text);
    }

    // 코드로 잘린 구간 사이에서도 강조 상태가 이어지도록 집합을 공유한다
    const syntaxSet: InlineSyntaxSet = new Set<InlineSyntax>([]);
    const inlines: Inline[] = [];

    for (const segment of segments) {
        if (segment.type === 'text') {
            inlines.push(...parseInlinesWithLinks(segment.text, syntaxSet));
            continue;
        }

        const openedClassName = getClassName(syntaxSet);
        const codeClassName = openedClassName
            ? `${openedClassName} ${CODE_CLASS_NAME}`
            : CODE_CLASS_NAME;
        const syntaxClassName = `${SYNTAX_CLASS_NAME} ${codeClassName}`;

        inlines.push(createSpanInline(syntaxClassName, segment.open));
        if (segment.content !== '') {
            inlines.push(createSpanInline(codeClassName, segment.content));
        }
        inlines.push(createSpanInline(syntaxClassName, segment.close));
    }

    return inlines;
}
