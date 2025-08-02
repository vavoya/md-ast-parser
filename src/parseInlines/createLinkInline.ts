import {LinkInline} from "./types";


export default function createLinkInline(href: string, children: LinkInline['children'] ): LinkInline {
    return {
        type: 'link',
        href,
        children,
    }
}