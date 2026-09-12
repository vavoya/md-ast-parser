"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  default: () => index_default,
  parseBlocks: () => parseBlocks,
  shikiPromise: () => shikiPromise
});
module.exports = __toCommonJS(index_exports);

// src/parseCodeInlines/createHighlighter.ts
var import_shiki = require("shiki");
var myTheme = (0, import_shiki.createCssVariablesTheme)({
  name: "css-variables",
  variablePrefix: "--shiki-",
  variableDefaults: {},
  fontStyle: true
});
var highlighter = null;
var langs = [
  "javascript",
  "typescript",
  "python",
  "java",
  "csharp",
  "cpp",
  "c",
  "ruby",
  "php",
  "go",
  "swift",
  "kotlin",
  "rust",
  "sql",
  "bash",
  "html",
  "css"
];
var langAlias = {
  // javascript
  "js": "javascript",
  "mjs": "javascript",
  "cjs": "javascript",
  // typescript
  "ts": "typescript",
  // python
  "py": "python",
  // java
  // csharp
  "cs": "csharp",
  // cpp
  "c++": "cpp",
  "hpp": "cpp",
  "cc": "cpp",
  "cxx": "cpp",
  // c
  "h": "c",
  // ruby
  "rb": "ruby",
  // php
  "php3": "php",
  "php4": "php",
  "php5": "php",
  "phps": "php",
  // go
  "gopher": "go",
  // swift
  // kotlin
  "kt": "kotlin",
  // rust
  // sql
  "sqls": "sql",
  // bash
  "sh": "bash",
  "shell": "bash",
  "ps1": "bash",
  // html
  "html5": "html",
  "xhtml": "html",
  // css
  "scss": "css",
  "less": "css",
  "styl": "css"
};
var fullLangMap = {
  ...Object.fromEntries(langs.map((lang) => [lang, lang])),
  ...langAlias
};
var shikiPromise = new Promise((resolve, reject) => {
  (0, import_shiki.createHighlighter)({
    langs,
    langAlias,
    themes: [myTheme]
    // register the theme
  }).then((result) => {
    highlighter = result;
    resolve(true);
  }).catch(() => {
    reject(false);
  });
});

// src/parseInlines/cache.ts
var import_lru_cache = require("lru-cache");
var inlineCache = new import_lru_cache.LRUCache({
  max: 1e3
  // 적절한 캐시 사이즈
});
function readCache(key) {
  return inlineCache.get(key);
}
function storeCache(key, value) {
  inlineCache.set(key, value);
  return value;
}

// src/parseInlines/syntax.ts
var INLINE_SYNTAX = {
  BOLD: "**",
  ESCAPE: "\\",
  HIGHLIGHT: "==",
  ITALIC: "*",
  STRIKE_THROUGH: "~~"
};
var CODE_SYNTAX = "`";
var CODE_CLASS_NAME = "code";
var SYNTAX_CLASS_NAME = "syntax";

// src/parseInlines/scanCodeSpans.ts
function readRunLength(line, index) {
  let length = 0;
  while (index + length < line.length && line[index + length] === CODE_SYNTAX) {
    length += 1;
  }
  return length;
}
function isEscaped(line, index) {
  let count = 0;
  let i = index - 1;
  while (i >= 0 && line[i] === "\\") {
    count += 1;
    i -= 1;
  }
  return count % 2 === 1;
}
function findClosingRun(line, from, length) {
  let i = from;
  while (i < line.length) {
    if (line[i] !== CODE_SYNTAX) {
      i += 1;
      continue;
    }
    const runLength = readRunLength(line, i);
    if (runLength === length) {
      return i;
    }
    i += runLength;
  }
  return -1;
}
function scanCodeSpans(line) {
  const segments = [];
  let textStart = 0;
  let index = 0;
  while (index < line.length) {
    if (line[index] !== CODE_SYNTAX || isEscaped(line, index)) {
      index += 1;
      continue;
    }
    const openLength = readRunLength(line, index);
    const closeIndex = findClosingRun(line, index + openLength, openLength);
    if (closeIndex === -1) {
      index += openLength;
      continue;
    }
    if (textStart !== index) {
      segments.push({
        type: "text",
        text: line.substring(textStart, index)
      });
    }
    segments.push({
      type: "code",
      open: line.substring(index, index + openLength),
      content: line.substring(index + openLength, closeIndex),
      close: line.substring(closeIndex, closeIndex + openLength)
    });
    index = closeIndex + openLength;
    textStart = index;
  }
  if (textStart !== line.length) {
    segments.push({
      type: "text",
      text: line.substring(textStart)
    });
  }
  return segments;
}

// src/parseInlines/getClassName.ts
var syntaxClassNameMap = {
  [INLINE_SYNTAX.BOLD]: `bold`,
  [INLINE_SYNTAX.ITALIC]: "italic",
  [INLINE_SYNTAX.STRIKE_THROUGH]: "strikethrough",
  [INLINE_SYNTAX.HIGHLIGHT]: "highlight",
  [INLINE_SYNTAX.ESCAPE]: ""
};
function getClassName(syntaxSet) {
  const classNames = [];
  syntaxSet.forEach((syntax) => {
    const className = syntaxClassNameMap[syntax];
    if (className) {
      classNames.push(className);
    }
  });
  return classNames.join(" ");
}

// src/parseInlines/createSpanInline.ts
function createSpanInline(className, text) {
  return {
    type: "span",
    className,
    text
  };
}

// src/parseInlines/createImgInline.ts
function createImgInline(alt, src) {
  return {
    type: "img",
    alt,
    src
  };
}

// src/parseInlines/regex.ts
var escapeRegexChars = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
var sortedSyntax = Object.values(INLINE_SYNTAX).sort((a, b) => b.length - a.length);
var escapePatterns = sortedSyntax.map((value) => escapeRegexChars(value[0])).join("|");
var fullPatterns = sortedSyntax.map(escapeRegexChars).join("|");
var imagePattern = `(?<!\\\\)!\\[(?<alt>(?!.*!\\[)[^\\]]*)\\]\\((?<src>[^)]+)\\)`;
var defaultRegex = new RegExp(
  `\\\\(?<escaped>${escapePatterns})|(?<img>${imagePattern})|(?<plain>${fullPatterns})`,
  "g"
);

// src/parseInlines/parseInline.ts
function parseInline(line, syntaxSet = /* @__PURE__ */ new Set([])) {
  const matches = [...line.matchAll(defaultRegex)];
  let prevIndex = 0;
  const tokens = matches.reduce((inlines, match) => {
    if (prevIndex !== match.index) {
      inlines.push(createSpanInline(getClassName(syntaxSet), line.substring(prevIndex, match.index)));
    }
    const isEscaped2 = !!match.groups?.escaped;
    if (isEscaped2) {
      inlines.push(createSpanInline(`${SYNTAX_CLASS_NAME} ${getClassName(syntaxSet)}`, line.substring(match.index, match.index + 1)));
      prevIndex = match.index + 1;
    } else if (match.groups?.plain) {
      const delimiter = match.groups.plain;
      if (syntaxSet.has(delimiter)) {
        inlines.push(createSpanInline(`${SYNTAX_CLASS_NAME} ${getClassName(syntaxSet)}`, line.substring(match.index, match.index + delimiter.length)));
        syntaxSet.delete(delimiter);
      } else {
        syntaxSet.add(delimiter);
        inlines.push(createSpanInline(`${SYNTAX_CLASS_NAME} ${getClassName(syntaxSet)}`, line.substring(match.index, match.index + delimiter.length)));
      }
      prevIndex = match.index + delimiter.length;
    } else if (match.groups?.img) {
      const alt = match.groups.alt;
      const src = match.groups.src;
      inlines.push(createSpanInline(`${SYNTAX_CLASS_NAME} img`, match.groups.img));
      inlines.push(createImgInline(alt, src));
      prevIndex = match.index + match.groups.img.length;
    }
    return inlines;
  }, []);
  if (prevIndex !== line.length) {
    tokens.push(createSpanInline(getClassName(syntaxSet), line.substring(prevIndex)));
  }
  return tokens;
}

// src/parseInlines/createLinkInline.ts
function createLinkInline(href, children) {
  return {
    type: "link",
    href,
    children
  };
}

// src/parseInlines/parseInlinesWithLinks.ts
function createLinkSyntax(text) {
  return createSpanInline(`${SYNTAX_CLASS_NAME} link`, text);
}
function parseInlinesWithLinks(text, syntaxSet = /* @__PURE__ */ new Set([])) {
  const regex = new RegExp(
    `(?<!\\\\)(?<imgOpen>!\\[)|(?<!\\\\)(?<linkOpen>\\[)|(?<close>\\]\\([^)]*\\))`,
    "g"
  );
  const array = [];
  let imageIndex = 0;
  let imageOpen = false;
  let linkIndex = 0;
  let linkOpen = false;
  let prevIndex = 0;
  for (const match of text.matchAll(regex)) {
    if (match.groups?.close) {
      if (imageOpen && linkOpen && linkIndex < imageIndex) {
        imageOpen = false;
        continue;
      }
      if (imageOpen && linkOpen && imageIndex < linkIndex) {
        const prevText = text.substring(prevIndex, linkIndex);
        const prevInline = parseInline(prevText, syntaxSet);
        const linkText = text.substring(linkIndex + 1, match.index);
        const href = text.substring(match.index + 2, match.index + match.groups.close.length - 1);
        const linkInline = createLinkInline(href, parseInline(linkText));
        array.push(
          ...prevInline,
          createLinkSyntax("["),
          linkInline,
          createLinkSyntax(match.groups.close)
        );
        linkOpen = false;
        imageOpen = false;
        prevIndex = match.index + match.groups.close.length;
        continue;
      }
      if (linkOpen) {
        const prevText = text.substring(prevIndex, linkIndex);
        const prevInline = parseInline(prevText, syntaxSet);
        const linkText = text.substring(linkIndex + 1, match.index);
        const href = text.substring(match.index + 2, match.index + match.groups.close.length - 1);
        const linkInline = createLinkInline(href, parseInline(linkText));
        array.push(
          ...prevInline,
          createLinkSyntax("["),
          linkInline,
          createLinkSyntax(match.groups.close)
        );
        linkOpen = false;
        prevIndex = match.index + match.groups.close.length;
        continue;
      }
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

// src/parseInlines/parseInlinesWithCode.ts
function parseInlinesWithCode(text) {
  const segments = scanCodeSpans(text);
  if (segments.length === 0) {
    return parseInlinesWithLinks(text);
  }
  if (segments.length === 1 && segments[0].type === "text") {
    return parseInlinesWithLinks(text);
  }
  const syntaxSet = /* @__PURE__ */ new Set([]);
  const inlines = [];
  for (const segment of segments) {
    if (segment.type === "text") {
      inlines.push(...parseInlinesWithLinks(segment.text, syntaxSet));
      continue;
    }
    const openedClassName = getClassName(syntaxSet);
    const codeClassName = openedClassName ? `${openedClassName} ${CODE_CLASS_NAME}` : CODE_CLASS_NAME;
    const syntaxClassName = `${SYNTAX_CLASS_NAME} ${codeClassName}`;
    inlines.push(createSpanInline(syntaxClassName, segment.open));
    if (segment.content !== "") {
      inlines.push(createSpanInline(codeClassName, segment.content));
    }
    inlines.push(createSpanInline(syntaxClassName, segment.close));
  }
  return inlines;
}

// src/parseInlines/index.ts
function parseInlines(line) {
  const cachedTokens = readCache(line);
  if (cachedTokens) {
    return cachedTokens;
  }
  const inlines = parseInlinesWithCode(line);
  storeCache(line, inlines);
  return inlines;
}

// src/parseBlocks/consumeTableLine.ts
function splitTableRow(line) {
  if (!/^[ \t]*\|/.test(line)) {
    return null;
  }
  const boundaries = [];
  const delimiters = /\\[\s\S]|\|/g;
  let match;
  while ((match = delimiters.exec(line)) !== null) {
    if (match[0] === "|") {
      boundaries.push(match.index);
    }
  }
  if (boundaries.length < 2) {
    return null;
  }
  const last = boundaries[boundaries.length - 1];
  if (!/^[ \t]*$/.test(line.slice(last + 1))) {
    return null;
  }
  const cells = [];
  for (let index = 1; index < boundaries.length; index++) {
    cells.push(line.slice(boundaries[index - 1] + 1, boundaries[index]).trim());
  }
  return cells;
}
function parseAlignment(cells) {
  const align = [];
  for (const cell of cells) {
    if (!/^:?-{3,}:?$/.test(cell)) {
      return null;
    }
    if (cell.startsWith(":") && cell.endsWith(":")) {
      align.push("center");
    } else if (cell.startsWith(":")) {
      align.push("left");
    } else if (cell.endsWith(":")) {
      align.push("right");
    } else {
      align.push(null);
    }
  }
  return align;
}
function parseCells(cells) {
  return cells.map((cell) => ({
    children: parseInlines(cell)
  }));
}
function flushTableCandidate(states) {
  const state = states.tableState;
  if (state.flag === 1 || state.flag === 2) {
    state.header.node.children = parseInlines(state.header.source);
    if (state.flag === 2) {
      state.delimiter.node.children = parseInlines(state.delimiter.source);
    }
  }
  states.tableState = {
    flag: 0
  };
}
function consumeTableLine(parent, line, states) {
  let state = states.tableState;
  if (state.flag !== 0 && state.parent !== parent) {
    flushTableCandidate(states);
    state = states.tableState;
  }
  const cells = splitTableRow(line);
  if (state.flag === 3) {
    if (cells !== null && cells.length === state.table.header.length) {
      state.table.rows.push(parseCells(cells));
      return true;
    }
    flushTableCandidate(states);
  } else if (state.flag === 2) {
    if (cells !== null && cells.length === state.cells.length) {
      const table = {
        type: "table",
        header: parseCells(state.cells),
        align: state.align,
        rows: [parseCells(cells)]
      };
      parent.children.splice(state.index, 2, table);
      states.tableState = {
        flag: 3,
        parent,
        table
      };
      return true;
    }
    flushTableCandidate(states);
  } else if (state.flag === 1) {
    const align = cells !== null && cells.length === state.cells.length ? parseAlignment(cells) : null;
    if (align !== null) {
      const node = {
        type: "paragraph",
        children: []
      };
      parent.children.push(node);
      states.tableState = {
        ...state,
        flag: 2,
        delimiter: {
          node,
          source: line
        },
        align
      };
      return true;
    }
    flushTableCandidate(states);
  }
  if (cells !== null) {
    const node = {
      type: "paragraph",
      children: []
    };
    const index = parent.children.length;
    parent.children.push(node);
    states.tableState = {
      flag: 1,
      parent,
      index,
      header: {
        node,
        source: line
      },
      cells
    };
    return true;
  }
  return false;
}

// src/createBlockNode/createRootBlockNode.ts
function createRootBlockNode() {
  return {
    type: "rootBlock",
    children: []
  };
}

// src/parseBlocks/createBlockStates.ts
function createBlockStates() {
  const codeBlockStates = /* @__PURE__ */ new Map();
  return {
    codeBlockStates,
    tableState: { flag: 0 }
  };
}

// src/createBlockNode/createCodeBlockNode.ts
function createCodeBlockNode(lang) {
  return {
    type: "codeBlock",
    lang,
    children: []
  };
}

// src/parseCodeInlines/cache.ts
var import_lru_cache2 = require("lru-cache");
var codeCache = new import_lru_cache2.LRUCache({
  max: 1e3,
  // 적절한 캐시 사이즈
  updateAgeOnGet: true
});
function readCache2(key) {
  return codeCache.get(key);
}
function storeCache2(key, value) {
  codeCache.set(key, value);
  return value;
}

// src/parseCodeInlines/createCodeInline.ts
function createCodeInline(text, color) {
  return {
    text,
    color
  };
}

// src/parseCodeInlines/index.ts
function parseCodeInlines(lang, code) {
  if (code === "") {
    return [];
  }
  if (!highlighter) {
    createCodeInline(code, "var(--shiki-token-constant)");
    return [createCodeInline(code, "var(--shiki-token-constant)")];
  }
  const key = `${lang}-${code}`;
  const cachedTokens = readCache2(key);
  if (cachedTokens) {
    return cachedTokens;
  }
  const lowerCaseLang = lang.toLowerCase();
  const rawTokens = highlighter.codeToTokens(
    code,
    { lang: fullLangMap[lowerCaseLang] ? fullLangMap[lowerCaseLang] : "plaintext", theme: "css-variables" }
  );
  const tokens = rawTokens.tokens[0].map((token) => createCodeInline(token.content, token.color ?? "var(--shiki-token-constant)"));
  storeCache2(key, tokens);
  return tokens;
}

// src/createBlockNode/createHeadingBlockNode.ts
function createHeadingBlockNode(level, line) {
  return {
    type: "heading",
    level,
    children: parseInlines(line.substring(level + 1))
  };
}

// src/createBlockNode/createParagraphBlockNode.ts
function createParagraphBlockNode(line) {
  return {
    type: "paragraph",
    children: parseInlines(line)
  };
}

// src/parsePrefix/prefixParsers/parseHashLineToBlock.ts
function parseHashLineToBlock(line) {
  if (line.startsWith("### ")) {
    return {
      block: createHeadingBlockNode(3, line),
      nextLine: ""
    };
  } else if (line.startsWith("## ")) {
    return {
      block: createHeadingBlockNode(2, line),
      nextLine: ""
    };
  } else if (line.startsWith("# ")) {
    return {
      block: createHeadingBlockNode(1, line),
      nextLine: ""
    };
  } else {
    return {
      block: createParagraphBlockNode(line),
      nextLine: ""
    };
  }
}

// src/createBlockNode/createListItemBlockNode.ts
function createListItemBlockNode(marker) {
  return {
    type: "listItem",
    marker,
    children: []
  };
}

// src/createBlockNode/createListBlockNode.ts
function createListBlockNode(isOrdered, marker) {
  return {
    type: "list",
    isOrdered,
    children: [
      createListItemBlockNode(marker)
    ]
  };
}

// src/createBlockNode/createThematicBreakBlockNode.ts
function createThematicBreakBlockNode() {
  return {
    type: "thematicBreakBlock"
  };
}

// src/parsePrefix/prefixParsers/parseDashLineToBlock.ts
function parseDashLineToBlock(line) {
  if (line.startsWith("- ")) {
    return {
      block: createListBlockNode(false, "-"),
      nextLine: line.substring(2)
    };
  } else if (line.trim() === "---") {
    return {
      block: createThematicBreakBlockNode(),
      nextLine: ""
    };
  } else {
    return {
      block: createParagraphBlockNode(line),
      nextLine: ""
    };
  }
}

// src/parsePrefix/prefixParsers/parseBacktickLineToBlock.ts
function parseBacktickLineToBlock(line) {
  if (line.startsWith("```")) {
    return {
      block: createCodeBlockNode(line.substring(3).trim()),
      nextLine: ""
    };
  } else {
    return {
      block: createParagraphBlockNode(line),
      nextLine: ""
    };
  }
}

// src/parsePrefix/prefixParsers/parseNumberLineToBlock.ts
function parseNumberLineToBlock(line) {
  const match = line.match(/^\d{1,3}\.\s/);
  if (match) {
    const marker = match[0].slice(0, -1);
    return {
      block: createListBlockNode(true, marker),
      nextLine: line.substring(match[0].length)
    };
  } else {
    return {
      block: createParagraphBlockNode(line),
      nextLine: ""
    };
  }
}

// src/createBlockNode/createBlockquoteBlockNode.ts
function createBlockquoteBlockNode() {
  return {
    type: "blockquote",
    children: []
  };
}

// src/parsePrefix/prefixParsers/parseGreaterThanLineToBlock.ts
function parseGreaterThanLineToBlock(line) {
  if (line.startsWith("> ")) {
    return {
      block: createBlockquoteBlockNode(),
      nextLine: line.substring(2)
    };
  } else {
    return {
      block: createParagraphBlockNode(line),
      nextLine: ""
    };
  }
}

// src/parsePrefix/prefixParsers/index.ts
var prefixparsers = {
  "#": parseHashLineToBlock,
  "-": parseDashLineToBlock,
  ">": parseGreaterThanLineToBlock,
  "`": parseBacktickLineToBlock,
  "0": parseNumberLineToBlock,
  "1": parseNumberLineToBlock,
  "2": parseNumberLineToBlock,
  "3": parseNumberLineToBlock,
  "4": parseNumberLineToBlock,
  "5": parseNumberLineToBlock,
  "6": parseNumberLineToBlock,
  "7": parseNumberLineToBlock,
  "8": parseNumberLineToBlock,
  "9": parseNumberLineToBlock
};
var prefixParsers_default = prefixparsers;

// src/parsePrefix/index.ts
function parsePrefix(line) {
  const prefix = line[0];
  let prefixParseResult;
  if (prefix in prefixParsers_default) {
    const prefixKey = prefix;
    const parsePrefix2 = prefixParsers_default[prefixKey];
    prefixParseResult = parsePrefix2(line);
  } else {
    prefixParseResult = {
      block: createParagraphBlockNode(line),
      nextLine: ""
    };
  }
  return prefixParseResult;
}

// src/parseBlocks/isBlockContainer.ts
function isBlockContainer(blockNode) {
  const type = blockNode.type;
  return type === "rootBlock" || type === "list" || type === "listItem" || type === "blockquote";
}

// src/parseBlocks/parseLineToChildren.ts
var emptyObj = createRootBlockNode();
function parseLineToChildren(targetBlockNode, line, blockStates) {
  const prevSiblingNode = targetBlockNode.children[targetBlockNode.children.length - 1] ?? emptyObj;
  if (prevSiblingNode.type === "codeBlock") {
    const codeBlockState = blockStates.codeBlockStates.get(prevSiblingNode);
    if (line.trim() === "```") {
      blockStates.codeBlockStates.delete(prevSiblingNode);
      return [...targetBlockNode.children];
    } else if (codeBlockState?.isOpen) {
      const newCodeBlockNode = createCodeBlockNode(prevSiblingNode.lang);
      newCodeBlockNode.children = [...prevSiblingNode.children, parseCodeInlines(prevSiblingNode.lang, line)];
      blockStates.codeBlockStates.delete(prevSiblingNode);
      blockStates.codeBlockStates.set(newCodeBlockNode, { isOpen: true });
      const newChildren = [...targetBlockNode.children];
      newChildren[newChildren.length - 1] = newCodeBlockNode;
      return newChildren;
    } else {
    }
  }
  if (consumeTableLine(targetBlockNode, line, blockStates)) {
    return targetBlockNode.children;
  }
  let nextLine = line;
  const startNode = createRootBlockNode();
  let currentNode = startNode;
  do {
    if (currentNode !== startNode && consumeTableLine(currentNode, nextLine, blockStates)) {
      break;
    }
    const prefixParseResult = parsePrefix(nextLine);
    nextLine = prefixParseResult.nextLine;
    const prefixBlockNode = prefixParseResult.block;
    currentNode.children.push(prefixBlockNode);
    if (prefixBlockNode.type === "codeBlock") {
      blockStates.codeBlockStates.set(prefixBlockNode, { isOpen: true });
    }
    if (!isBlockContainer(prefixBlockNode)) {
      break;
    }
    if (prefixBlockNode.type === "list") {
      currentNode = prefixBlockNode.children[0];
    } else {
      currentNode = prefixBlockNode;
    }
  } while (nextLine);
  const node = startNode.children[0];
  if (prevSiblingNode.type === "list" && node.type === "list" && prevSiblingNode.isOrdered === node.isOrdered) {
    node.children = [...prevSiblingNode.children, ...node.children];
    const newChildren = [...targetBlockNode.children];
    newChildren[newChildren.length - 1] = node;
    return newChildren;
  } else {
    return [...targetBlockNode.children, node];
  }
}

// src/parseBlocks/matchesIndent.ts
function matchesIndent(line, indent) {
  if (line.length < indent) return false;
  for (let i = 0; i < indent; i++) {
    if (line[i] !== " ") return false;
  }
  return true;
}

// src/parseBlocks/resolveIndentContextForLine.ts
var emptyObj2 = createRootBlockNode();
function resolveIndentContextForLine(rootBlockNode, line) {
  let targetBlockNode = rootBlockNode;
  let indentOffset = 0;
  while (isBlockContainer(targetBlockNode)) {
    const t = targetBlockNode.children[targetBlockNode.children.length - 1];
    const nextBlockNode = targetBlockNode.children[targetBlockNode.children.length - 1] ?? emptyObj2;
    if (nextBlockNode.type === "blockquote") {
      if (matchesIndent(line, indentOffset + 2)) {
        targetBlockNode = nextBlockNode;
        indentOffset += 2;
      } else {
        break;
      }
    } else if (nextBlockNode.type === "list") {
      const lastListItem = nextBlockNode.children[nextBlockNode.children.length - 1];
      if (matchesIndent(line, indentOffset + lastListItem.marker.length + 1)) {
        indentOffset += lastListItem.marker.length + 1;
        targetBlockNode = lastListItem;
      } else {
        break;
      }
    } else {
      break;
    }
  }
  if (line[indentOffset] === " ") {
    targetBlockNode = rootBlockNode;
  }
  return {
    targetBlockNode,
    indentOffset
  };
}

// src/parseBlocks/index.ts
function parseBlocks(lines) {
  const rootBlockNode = createRootBlockNode();
  const blockStates = createBlockStates();
  const rawTexts = [];
  const appendRaw = (line) => {
    const index = rawTexts.length - 1;
    const previous = rawTexts[index];
    if (typeof previous === "string") {
      rawTexts[index] = [previous, line];
    } else {
      previous.push(line);
    }
  };
  lines.forEach((line) => {
    const prevChildCount = rootBlockNode.children.length;
    const { targetBlockNode, indentOffset } = resolveIndentContextForLine(rootBlockNode, line);
    const newChildren = parseLineToChildren(targetBlockNode, line.substring(indentOffset), blockStates);
    targetBlockNode.children = newChildren;
    if (rootBlockNode.children.length > prevChildCount) {
      rawTexts.push(line);
    } else if (rootBlockNode.children.length < prevChildCount) {
      const delimiter = rawTexts.pop();
      if (typeof delimiter === "string") {
        appendRaw(delimiter);
      } else {
        delimiter.forEach(appendRaw);
      }
      appendRaw(line);
    } else if (rawTexts.length > 0) {
      appendRaw(line);
    }
  });
  flushTableCandidate(blockStates);
  const children = rootBlockNode.children.map((child, index) => ({
    ...child,
    rawText: typeof rawTexts[index] === "string" ? rawTexts[index] : rawTexts[index].join("\n")
  }));
  return {
    type: "rootBlock",
    children
  };
}

// src/index.ts
var index_default = parseBlocks;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  parseBlocks,
  shikiPromise
});
