import { INLINE_SYNTAX } from './syntax';

type Inline = {
    className: string;
    text: string;
};
type InlineSyntax = typeof INLINE_SYNTAX[keyof typeof INLINE_SYNTAX];
type InlineSyntaxSet = Set<InlineSyntax>;

export {
    Inline,
    InlineSyntax,
    InlineSyntaxSet,
}