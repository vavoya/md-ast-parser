import { INLINE_SYNTAX } from './syntax';

type SpanInline = {
    type: 'span'
    className: string;
    text: string;
}

type ImgInline = {
    type: 'img',
    alt: string;
    src: string;
}

type Inline =
    | SpanInline
    | ImgInline

type InlineSyntax = typeof INLINE_SYNTAX[keyof typeof INLINE_SYNTAX];
type InlineSyntaxSet = Set<InlineSyntax>;

export {
    SpanInline,
    ImgInline,
    Inline,
    InlineSyntax,
    InlineSyntaxSet,
}