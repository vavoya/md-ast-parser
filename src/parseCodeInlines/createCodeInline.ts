import {CodeInline} from "./types";


export default function createCodeInline(text: string, color: string): CodeInline {
    return {
        text,
        color
    }
}