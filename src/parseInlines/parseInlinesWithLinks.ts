import {Inline} from "./types";
import {parseInline} from "./parseInline";
import createLinkInline from "./createLinkInline";

export default function parseInlinesWithLinks(text: string) {
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
                const prevInline = parseInline(prevText);

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
                const prevInline = parseInline(prevText);

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
        const prevInline = parseInline(prevText);
        array.push(...prevInline);
    }

    return array;
}