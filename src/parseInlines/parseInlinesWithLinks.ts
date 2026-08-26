import {Inline, InlineSyntax, InlineSyntaxSet} from "./types";
import {parseInline} from "./parseInline";
import createLinkInline from "./createLinkInline";

/**
 * @description 링크와 이미지를 먼저 분리한 뒤, 나머지 구간을 parseInline 에 넘긴다
 * @param text 파싱할 문자열
 * @param syntaxSet 열려 있는 구분자 집합. 링크로 잘린 구간 사이에서 강조 상태를 잇는다.
 *                  링크 텍스트 내부는 바깥으로 새면 안 되므로 별도 집합으로 파싱한다.
 */
export default function parseInlinesWithLinks(text: string, syntaxSet: InlineSyntaxSet = new Set<InlineSyntax>([])) {
    const regex = new RegExp(
        `(?<!\\\\)(?<imgOpen>!\\[)|(?<!\\\\)(?<linkOpen>\\[)|(?<close>\\]\\([^)]*\\))`,
        'g'
    );

    const array: Inline[] = []


    let imageIndex = 0;
    let imageOpen = false;
    let linkIndex = 0;
    let linkOpen = false;

    let prevIndex = 0;

    for (const match of text.matchAll(regex)) {
        if (match.groups?.close) {
            // 링크 < 이미지
            if (imageOpen && linkOpen && (linkIndex < imageIndex)) {
                imageOpen = false;
                continue;
            }

            // 이미지 < 링크
            if (imageOpen && linkOpen && (imageIndex < linkIndex)) {
                const prevText = text.substring(prevIndex, linkIndex);
                const prevInline = parseInline(prevText, syntaxSet);

                const linkText = text.substring(linkIndex + 1, match.index);
                const href = text.substring(match.index + 2, match.index + match.groups.close.length - 1);
                const linkInline = createLinkInline(href, parseInline(linkText));

                array.push(...prevInline, linkInline);

                // 어차피 이미지는 죽은 놈이다. 링크를 자식으로 못가진다.
                linkOpen = false;
                imageOpen = false;
                prevIndex = match.index + match.groups.close.length
                continue;
            }

            // 링크
            if (linkOpen) {
                const prevText = text.substring(prevIndex, linkIndex);
                const prevInline = parseInline(prevText, syntaxSet);

                const linkText = text.substring(linkIndex + 1, match.index);
                const href = text.substring(match.index + 2, match.index + match.groups.close.length - 1);
                const linkInline = createLinkInline(href, parseInline(linkText));

                array.push(...prevInline, linkInline);

                linkOpen = false;
                prevIndex = match.index + match.groups.close.length
                continue;
            }

            // 이미지
            if (imageOpen) {
                imageOpen = false;
                continue;
            }
        }
        if (match.groups?.imgOpen) {
            imageIndex = match.index;
            imageOpen = true;
            continue;
        }
        if (match.groups?.linkOpen) {
            linkIndex = match.index;
            linkOpen = true;
            continue;
        }

    }

    if (prevIndex < text.length) {
        const prevText = text.substring(prevIndex);
        const prevInline = parseInline(prevText, syntaxSet);
        array.push(...prevInline);
    }

    return array;
}