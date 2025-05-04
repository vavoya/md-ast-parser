import {Inline} from "./types";


export default function createInline(className: string, text: string): Inline {
    return {
        className,
        text: text,
    }
}