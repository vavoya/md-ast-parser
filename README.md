# md-ast-parser

## README Versions
- [🇰🇷 Korean](#목차-한국어)
- [🇺🇸 English](#table-of-contents-english)

## 목차 (한국어)
1. [개발 목적](#1-개발-목적)
2. [라이브러리 설치 방법](#2-라이브러리-설치-방법)
3. [사용 방법](#3-사용-방법)
4. [입출력 예시](#4-입출력-예시)
5. [해당 라이브러리 특징](#5-해당-라이브러리-특징)
6. [사용시 주의할 점](#6-사용시-주의할-점)
7. [성능](#7-성능)
8. [깃헙, npm 주소](#8-깃헙-npm-주소)

---

### 1. 개발 목적

React의 VDOM 기반 마크다운 위지윅 에디터를 제작하기에 앞서 직접 MD 파서를 제작해야 했음.  
Obsidian 에디터 방식의 위지윅을 추구하기에, 기존 CommonMark와 같은 문법과는 차별점이 존재함을 알림.

---

### 2. 라이브러리 설치 방법

설치를 위해서는 아래와 같은 커맨드를 입력하면 됨.

```bash
npm i md-ast-parser
````

---

### 3. 사용 방법

아래와 같이 라이브러리를 불러오면 됨.

```ts
import {parseBlocks} from 'md-ast-parser'
```

문자열 배열을 넘겨주면 AST 트리를 반환함.

```ts
const lines = [
    '1. list1',
    '   22. list2',
    '       list22',
    '   list11',
]
const ast = parseBlocks(lines)
```

---

### 4. 입출력 예시

#### 입력

```ts
const lines = [
    '1. list1',
    '   22. list2',
    '       list22',
    '   list11',
]
const ast = parseBlocks(lines)
```

#### 출력

```json
{
  "type": "rootBlock",
  "children": [
    {
      "type": "list",
      "isOrdered": true,
      "children": [
        {
          "type": "listItem",
          "marker": "1.",
          "children": [
            {
              "type": "paragraph",
              "children": [
                {
                  "className": "",
                  "text": "list1"
                }
              ]
            },
            {
              "type": "list",
              "isOrdered": true,
              "children": [
                {
                  "type": "listItem",
                  "marker": "22.",
                  "children": [
                    {
                      "type": "paragraph",
                      "children": [
                        {
                          "className": "",
                          "text": "list2"
                        }
                      ]
                    },
                    {
                      "type": "paragraph",
                      "children": [
                        {
                          "className": "",
                          "text": "list22"
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              "type": "paragraph",
              "children": [
                {
                  "className": "",
                  "text": "list11"
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}

```

세부적인 입출력 예시는 아래 깃허브 링크에서 확인 가능  
[https://github.com/vavoya/md-ast-parser/tree/master/src/tests](https://github.com/vavoya/md-ast-parser/tree/master/src/tests)

---

### 5. 해당 라이브러리 특징

1. 실용적인 FP 방식으로 프로젝트를 진행하려 했음

2. `shiki` 라이브러리를 사용하여 코드블럭에도 스타일 제공

3. `LRU cache`를 사용하여 반복적인 인라인 파싱을 줄이도록 설계함 (최대 개수 제한)

4. 일반적인 markdown 문법보다는 Obsidian 방식에 가깝게 구현함


---

### 6. 사용시 주의할 점

#### 6.1. shiki 라이브러리 비동기 로드

shiki 라이브러리는 비동기 초기화가 필요함.  
따라서 본 라이브러리를 import한 직후 바로 `parseBlocks`를 실행하면, 코드블럭에 기본 스타일만 적용된 상태로 결과가 나올 수 있음.  
이건 오류가 아니라 초기화가 완료되지 않았기 때문에 의도된 동작임.

코드 블럭 스타일을 정확히 파싱하려면:

- shiki 초기화를 먼저 완료하고 실행하든지

- 마이크로태스크 큐 흐름을 제어해서 순서를 맞추든지

- 아니면 계속 임의의 코드 블럭을 넣고 응답을 검사하든지


적절한 방식은 사용자가 판단해서 선택하면 됨.  
향후에는 Promise 형태로 초기화 완료 상태를 외부에서 인지할 수 있게 할 여지도 고려 중.

#### 6.2. CommonMark와 다른 문법

여러 번 말했듯이 이 파서는 Obsidian 스타일에 맞춰 개발함.  
따라서 CommonMark나 기타 표준 마크다운 파서와 문법 해석이 다를 수 있음.

자세한 차이는 [입출력 예시](https://github.com/vavoya/md-ast-parser/tree/master/src/tests) 참고.

---

### 7. 성능

세부적인 벤치마킹 환경은 다음과 같음:

- 맥북 M1 Pro 14인치 (16GB)

- 부하 테스트는 setTimeout을 사용하여 `shiki`의 비동기 처리 우선순위를 보장한 후 실행

- 아래는 테스트 코드와 출력 결과


```ts
import { test } from 'node:test'
import parseBlocks from '../parseBlocks';

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
    lines.push(`    Quote level 2 ${suffix}`)
    lines.push(`      Quote level 3 ${suffix}`)
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

test('지연 후 파서 성능 측정', async () => {
  await new Promise<void>((resolve) => {
    setTimeout(() => {
      for (let i = 0; i < 100; i++) {
        benchmarkParse(i)
      }
      resolve()
    }, 1000)
  })
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

### 8. 깃헙, npm 주소

관심 있다면 한번쯤 방문해보는 것도 나쁘지 않을 듯함.

- GitHub: [https://github.com/vavoya/md-ast-parser](https://github.com/vavoya/md-ast-parser)

- NPM: [https://www.npmjs.com/package/md-ast-parser](https://www.npmjs.com/package/md-ast-parser)
    
---

## Table of Contents (English)

1. [Purpose](#1-purpose)
2. [Installation](#2-installation)
3. [How to Use](#3-how-to-use)
4. [Input/Output Example](#4-inputoutput-example)
5. [Features](#5-features)
6. [Things to Watch Out For](#6-things-to-watch-out-for)
7. [Performance](#7-performance)
8. [GitHub / NPM](#8-github--npm)

---

### 1. Purpose

Before building a VDOM-based Markdown WYSIWYG editor in React, I had to write my own MD parser from scratch.  
This project targets an Obsidian-style editing experience, so there are intentional differences from CommonMark or other standardized markdown grammars.

---

### 2. Installation

Run this command:

```bash
npm i md-ast-parser
````

---

### 3. How to Use

Just import the parser like this:

```ts
import { parseBlocks } from 'md-ast-parser'
```

Pass in a string array and get back an AST tree.

```ts
const lines = [
    '1. list1',
    '   22. list2',
    '       list22',
    '   list11',
]
const ast = parseBlocks(lines)
```

---

### 4. Input/Output Example

#### Input

```ts
const lines = [
    '1. list1',
    '   22. list2',
    '       list22',
    '   list11',
]
const ast = parseBlocks(lines)
```

#### Output

```json
{
  "type": "rootBlock",
  "children": [
    {
      "type": "list",
      "isOrdered": true,
      "children": [
        {
          "type": "listItem",
          "marker": "1.",
          "children": [
            {
              "type": "paragraph",
              "children": [
                {
                  "className": "",
                  "text": "리스트1"
                }
              ]
            },
            {
              "type": "list",
              "isOrdered": true,
              "children": [
                {
                  "type": "listItem",
                  "marker": "22.",
                  "children": [
                    {
                      "type": "paragraph",
                      "children": [
                        {
                          "className": "",
                          "text": "리스트2"
                        }
                      ]
                    },
                    {
                      "type": "paragraph",
                      "children": [
                        {
                          "className": "",
                          "text": "리스트22"
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              "type": "paragraph",
              "children": [
                {
                  "className": "",
                  "text": "리스트11"
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

More examples are available here:  
[https://github.com/vavoya/md-ast-parser/tree/master/src/tests](https://github.com/vavoya/md-ast-parser/tree/master/src/tests)

---

### 5. Features

1. Tried to stick to a practical functional programming (FP) style

2. Uses `shiki` to style code blocks

3. LRU cache to avoid repeated inline parsing (with max size limit)

4. Syntax logic is based more on Obsidian than CommonMark


---

### 6. Things to Watch Out For

#### 6.1. `shiki` is async

The `shiki` library has to be initialized asynchronously.  
If you call `parseBlocks` right after importing this lib, code blocks will just use fallback styles. That’s not a bug—just default behavior before `shiki` is ready.

So if you want correct syntax highlighting:

- Init `shiki` first, **then** run the parser

- Or control the microtask/macrotask timing properly

- Or just keep feeding dummy code blocks until highlighting appears, up to you


Eventually I might expose a Promise or some way to tell when it’s fully ready. No promises (yet).

#### 6.2. Different from CommonMark

Like I said, this isn’t a CommonMark parser.  
This is designed to follow Obsidian-style parsing.  
You’ll see some differences.

Check [input/output](https://github.com/vavoya/md-ast-parser/tree/master/src/tests) for details.

---

### 7. Performance

No official benchmarking yet.  
I just ran load tests on my dev machine: MacBook M1 Pro 14 (16GB)".

Used `setTimeout()` to let shiki init first, then parsed a bunch of blocks.  
See test script and log below.

```ts
import { test } from 'node:test'
import parseBlocks from '../parseBlocks'

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
    lines.push(`    Quote level 2 ${suffix}`)
    lines.push(`      Quote level 3 ${suffix}`)
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

test('Benchmark after delay', async () => {
  await new Promise<void>((resolve) => {
    setTimeout(() => {
      for (let i = 0; i < 100; i++) {
        benchmarkParse(i)
      }
      resolve()
    }, 1000)
  })
})
```

Example log:

```
[Tokens: 0] → 119.084 ms
[Tokens: 1] → 25.331 ms
...
[Tokens: 99] → 89.520 ms
```

Overall seems stable enough.

---

### 8. GitHub / NPM

Take a look if you're interested.

- GitHub: [https://github.com/vavoya/md-ast-parser](https://github.com/vavoya/md-ast-parser)

- NPM: [https://www.npmjs.com/package/md-ast-parser](https://www.npmjs.com/package/md-ast-parser)
    