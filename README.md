
# md-ast-parser

A Markdown-to-AST parser for building Obsidian-style WYSIWYG editors.  
It parses Markdown blocks and inline syntax into structured ASTs with optional syntax highlighting using `shiki`.

---

## README Versions
- [🇰🇷 한국어](#목차-한국어)
- [🇺🇸 English](#table-of-contents-english)

---

## 목차 (한국어)

1. [개발 목적](#1-개발-목적)
2. [설치 방법](#2-설치-방법)
3. [사용 방법](#3-사용-방법)
4. [입출력 예시](#4-입출력-예시)
5. [라이브러리 특징](#5-라이브러리-특징)
6. [주의 사항](#6-주의-사항)
7. [성능](#7-성능)
8. [깃허브 / NPM](#8-깃허브--npm)

---

### 1. 개발 목적

React 기반 마크다운 WYSIWYG 에디터 구현을 위해 Obsidian 스타일의 맞춤 AST 파서를 직접 개발함.  
CommonMark와는 다른 문법 해석이 존재함.

---

### 2. 설치 방법

```bash
npm i md-ast-parser
````

---

### 3. 사용 방법

```ts
import { parseBlocks, shikiPromise } from 'md-ast-parser'

await shikiPromise // 코드 하이라이팅 적용을 원한다면 이걸 먼저 기다려야 함
const ast = parseBlocks([
  '```js',
  'const a = 1',
  '```'
])
```

`shikiPromise`를 기다리지 않아도 동작은 하지만, 이 경우 코드블럭은 기본 스타일로 처리됨.

---

### 4. 입출력 예시

```ts
const lines = [
  '1. 리스트1',
  '   22. 리스트2',
  '       리스트22',
  '   리스트11',
]
const ast = parseBlocks(lines)
```

AST 출력 예시는 [예제 테스트 코드](https://github.com/vavoya/md-ast-parser/tree/master/src/tests) 참고.

---

### 5. 라이브러리 특징

- 실용적인 함수형(FP) 구조로 추구하며 작성됨

- `shiki`를 통한 코드 하이라이팅 지원

- 반복 인라인 파싱을 줄이기 위한 LRU 캐시 도입

- Obsidian 스타일 문법 기반 파싱

- 코드블럭 내 언어 하이라이팅은 비동기로 로딩되며, 초기화 전에는 기본 스타일로 파싱됨 (에러 없음)


#### 5.1. 지원 문법 (테스트 기반)

- `**굵게**`, `*기울임*`, `~~취소선~~`, `==하이라이트==`

- 이스케이프: `\\*`, `\\==` 등 무효화 처리

- 이미지: `![alt](url)` 및 `\\![alt](url)` 구분 처리

- 링크: `[inline](url)` 및 `\\[inline](url)` 구분 처리

- 헤딩: `#`, `##`, `###`

- 리스트: 순서형, 비순서형, 중첩 포함

- 인용문: `>` 중첩 포함

- 코드블럭: 언어 지정 가능, `shiki` 스타일 적용

- 빈 문단, 블록 중첩 등 유연한 구조 지원


---

### 6. 주의 사항

- `shiki`는 비동기 로드됨

- `parseBlocks()`는 항상 동기 함수지만, `shiki`가 로딩되지 않은 상태면 코드블럭은 하이라이팅 없이 기본 스타일로만 렌더링됨

- 에러는 발생하지 않음


**하이라이팅을 원하면 반드시 `await shikiPromise` 후 호출해야 함**

---

### 7. 성능

테스트 기준:

- MacBook Pro M1 (16GB)

```ts
import {before, test} from 'node:test'  
import parseBlocks from '../parseBlocks';  
import {shikiPromise} from "../parseCodeInlines/createHighlighter";  
  
function generateIncrementalText(length: number): string {  
    const alphabet = 'abcdefghijklmnopqrstuvwxyz'  
    let result = ''  
    for (let i = 0; i < length; i++) {  
       result += alphabet[i % alphabet.length]  
    }  
    return result  
}  
  
function generateTestLines(iteration: number) {  
    const lines = []  
    for (let i = 0; i < 500; i++) {  
       const suffix = generateIncrementalText(0)  
       lines.push(`# He**ad**in*g ${suffix}`)  
       lines.push(`Some p**arag*raph** text number ${suffix}`)  
       lines.push(`- Item ${suffix}`)  
       lines.push(`  - Subitem ${suffix}`)  
       lines.push(`    - SubSubitem ${suffix}`)
        lines.push(`> Quote level 1 ${suffix}`)
        lines.push(`  > Quote level 2 ${suffix}`)
        lines.push(`    > Quote level 3 ${suffix}`)
        lines.push('```js')  
       lines.push(`const index = ${'00000'.repeat(iteration)};`)  
       for (let j = 0; j < iteration; j++) {  
          lines.push(`console.log(index);`)  
       }  
       lines.push(`console.log(index);`)  
       lines.push('```')  
       lines.push(`Paragraph after code block ${suffix}`)  
       lines.push('---')  
    }  
    lines.push('2'.repeat(iteration))  
    return lines  
}  
  
function benchmarkParse(iteration: number) {  
    const lines = generateTestLines(iteration)  
  
    const start = performance.now()  
  
    parseBlocks(lines)  
  
    const end = performance.now()  
    console.log(`[Tokens: ${iteration}] → ${(end - start).toFixed(3)} ms`)  
}  
  
// 전역 비동기 초기화  
before(async () => {  
    await shikiPromise;  
});  
  
test('지연 후 파서 성능 측정', () => {  
    for (let i = 0; i < 100; i++) {  
       benchmarkParse(i)  
    }  
})
```

출력 예시 (일부 발췌):

```  
[Tokens: 0] → 119.084 ms  
[Tokens: 1] → 25.331 ms  
[Tokens: 50] → 56.604 ms  
[Tokens: 99] → 89.520 ms  
```

---

### 8. 깃허브 / NPM

- GitHub: [https://github.com/vavoya/md-ast-parser](https://github.com/vavoya/md-ast-parser)

- NPM: [https://www.npmjs.com/package/md-ast-parser](https://www.npmjs.com/package/md-ast-parser)


---

## Table of Contents (English)

1. [Purpose](#1-purpose)

2. [Installation](#2-installation)

3. [Usage](#3-usage)

4. [Example](#4-example)

5. [Features](#5-features)

6. [Caveats](#6-caveats)

7. [Performance](#7-performance)

8. [GitHub / NPM](#8-github--npm)


---

### 1. Purpose

This parser was developed to support a VDOM-based Markdown WYSIWYG editor inspired by Obsidian.  
It intentionally diverges from CommonMark.

---

### 2. Installation

```bash
npm i md-ast-parser
```

---

### 3. Usage

```ts
import { parseBlocks, shikiPromise } from 'md-ast-parser'

await shikiPromise // Needed for syntax highlighting
const ast = parseBlocks([
  '```ts',
  'const a = 1',
  '```'
])
```

You can call `parseBlocks` without waiting for `shikiPromise`, but code blocks will be rendered with fallback styles (no error is thrown).

---

### 4. Example

```ts
const lines = [
  '1. list1',
  '   22. list2',
  '       list22',
  '   list11',
]
const ast = parseBlocks(lines)
```

See [example tests](https://github.com/vavoya/md-ast-parser/tree/master/src/tests) for full output.

---

### 5. Features

- Pure FP-oriented parser

- `shiki`-based syntax highlighting for fenced code blocks

- LRU caching for inline parsing optimization

- Obsidian-style Markdown grammar

- Fallback rendering for code blocks when `shiki` is not ready (no error thrown)


#### 5.1. Supported Markdown Features (from tests)

- Styling: `**bold**`, `*italic*`, `~~strike~~`, `==highlight==`

- Escape: `\\*`, `\\==` → treated as literal

- Inline images: `![alt](url)` supported; `\\![...]` ignored

- Inline Link: `[text or image](url)` supported; `\\[...]` ignored

- Headings: `#`, `##`, `###`

- Lists: ordered/unordered, nested

- Quotes: `>`, nested

- Code blocks: fenced triple backtick blocks, optional language

- Mixed nesting: quote inside list, code inside quote, etc.


---

### 6. Caveats

- The parser is always synchronous

- `shiki` must be awaited via `shikiPromise` for syntax highlighting to work

- If not awaited, fallback styles will be applied to code blocks (no runtime errors)


---

### 7. Performance

- Benchmarked on M1 Pro 16GB

```ts
import {before, test} from 'node:test'  
import parseBlocks from '../parseBlocks';  
import {shikiPromise} from "../parseCodeInlines/createHighlighter";  
  
function generateIncrementalText(length: number): string {  
    const alphabet = 'abcdefghijklmnopqrstuvwxyz'  
    let result = ''  
    for (let i = 0; i < length; i++) {  
       result += alphabet[i % alphabet.length]  
    }  
    return result  
}  
  
function generateTestLines(iteration: number) {  
    const lines = []  
    for (let i = 0; i < 500; i++) {  
       const suffix = generateIncrementalText(0)  
       lines.push(`# He**ad**in*g ${suffix}`)  
       lines.push(`Some p**arag*raph** text number ${suffix}`)  
       lines.push(`- Item ${suffix}`)  
       lines.push(`  - Subitem ${suffix}`)  
       lines.push(`    - SubSubitem ${suffix}`)  
       lines.push(`> Quote level 1 ${suffix}`)  
       lines.push(`  > Quote level 2 ${suffix}`)  
       lines.push(`    > Quote level 3 ${suffix}`)  
       lines.push('```js')  
       lines.push(`const index = ${'00000'.repeat(iteration)};`)  
       for (let j = 0; j < iteration; j++) {  
          lines.push(`console.log(index);`)  
       }  
       lines.push(`console.log(index);`)  
       lines.push('```')  
       lines.push(`Paragraph after code block ${suffix}`)  
       lines.push('---')  
    }  
    lines.push('2'.repeat(iteration))  
    return lines  
}  
  
function benchmarkParse(iteration: number) {  
    const lines = generateTestLines(iteration)  
  
    const start = performance.now()  
  
    parseBlocks(lines)  
  
    const end = performance.now()  
    console.log(`[Tokens: ${iteration}] → ${(end - start).toFixed(3)} ms`)  
}  
  
// 전역 비동기 초기화  
before(async () => {  
    await shikiPromise;  
});  
  
test('지연 후 파서 성능 측정', () => {  
    for (let i = 0; i < 100; i++) {  
       benchmarkParse(i)  
    }  
})
```

Example Output (excerpt):

```  
[Tokens: 0] → 119.084 ms  
[Tokens: 1] → 25.331 ms  
[Tokens: 50] → 56.604 ms  
[Tokens: 99] → 89.520 ms  
```

---

### 8. GitHub / NPM

- GitHub: [https://github.com/vavoya/md-ast-parser](https://github.com/vavoya/md-ast-parser)

- NPM: [https://www.npmjs.com/package/md-ast-parser](https://www.npmjs.com/package/md-ast-parser)
    

