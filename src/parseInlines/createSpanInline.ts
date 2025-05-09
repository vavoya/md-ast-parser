import {SpanInline} from "./types";


export default function createSpanInline(className: string, text: string): SpanInline {
    return {
        type: 'span',
        className,
        text: text,
    }
}