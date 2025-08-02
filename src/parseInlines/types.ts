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

type LinkInline = {
    type: 'link',
    href: string;
    children: (SpanInline | ImgInline)[]
}

type Inline =
    | SpanInline
    | ImgInline
    | LinkInline

type InlineSyntax = typeof INLINE_SYNTAX[keyof typeof INLINE_SYNTAX];
type InlineSyntaxSet = Set<InlineSyntax>;

export {
    SpanInline,
    ImgInline,
    LinkInline,
    Inline,
    InlineSyntax,
    InlineSyntaxSet,
}