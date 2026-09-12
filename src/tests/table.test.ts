import {before, describe, test} from 'node:test';
import assert from 'node:assert/strict';
import parseBlocks from '../parseBlocks';
import {shikiPromise} from '../parseCodeInlines/createHighlighter';
import parseInlines from '../parseInlines';

before(async () => {await shikiPromise;});
const header = '| 이름 | 값 |';
const delimiter = '| --- | ---: |';
const body = '| 항목 | 1 |';
function parse(lines: string[]) {
 const ast = parseBlocks(lines);
 assert.equal(ast.children.map(node => node.rawText).join('\n'), lines.join('\n'));
 return ast;
}
function table(lines: string[]) {
 const node = parse(lines).children[0];
 assert.equal(node.type, 'table');
 if (node.type !== 'table') throw Error('expected table');
 return node;
}

describe('본문 필수 표 상태 0 → 1 → 2 → 3', () => {
 test('첫 본문에서 확정하고 원문과 셀을 보존한다', () => {
  const node = table([header, delimiter, body]);
  assert.deepEqual(node.align, [null, 'right']);
  assert.deepEqual(node.header.map(cell => cell.children), [parseInlines('이름'), parseInlines('값')]);
  assert.deepEqual(node.rows[0].map(cell => cell.children), [parseInlines('항목'), parseInlines('1')]);
 });
 for (const [name, lines] of [
  ['헤더만', [header]], ['헤더·구분선만', [header, delimiter]],
  ['첫 본문 열 부족', [header, delimiter, '| 하나 |']],
  ['첫 본문 열 초과', [header, delimiter, '| 하나 | 둘 | 셋 |']],
  ['구분선 열 불일치', [header, '| --- |', body]],
  ['짧은 구분선', [header, '| -- | --- |', body]],
  ['외곽 앞 문자', ['x ' + header, delimiter, body]],
  ['외곽 뒤 문자', [header + ' x', delimiter, body]],
  ['외곽 파이프 누락', ['이름 | 값', delimiter, body]],
 ] as const) test(name, () => {
  const ast = parse([...lines]);
  assert.ok(ast.children.every(node => node.type === 'paragraph'));
  assert.deepEqual(ast.children.map(node => node.type === 'paragraph' ? node.children : []), lines.map(line => parseInlines(line)));
 });
 test('외곽 공백·탭과 정렬·빈 셀을 허용한다', () => {
  const node = table([' \t| a | b | c | d |\t ', '| :--- | :---: | ---: | --- |', '| | **b** | [c](https://example.com) | `d` |']);
  assert.deepEqual(node.align, ['left', 'center', 'right', null]);
  assert.deepEqual(node.rows[0][0].children, parseInlines(''));
  assert.deepEqual(node.rows[0][1].children, parseInlines('**b**'));
  assert.deepEqual(node.rows[0][2].children, parseInlines('[c](https://example.com)'));
 });
 test('3열 표에 4열 행이 오면 종료하고 그 행을 보존한다', () => {
  const lines = ['| a | b | c |', '| --- | --- | --- |', '| 1 | 2 | 3 |', '| 4 | 5 | 6 | 7 |'];
  const ast = parse(lines);
  assert.deepEqual(ast.children.map(n => n.type), ['table', 'paragraph']);
  assert.equal(ast.children[1].rawText, lines[3]);
 });
 test('실패한 현재 줄을 새 헤더 후보로 재처리한다', () => {
  const ast = parse([header, delimiter, body, '| next |', '| --- |', '| yes |']);
  assert.deepEqual(ast.children.map(n => n.type), ['table', 'table']);
 });
 test('후보 실패 뒤 새 표를 인식한다', () => {
  const ast = parse(['| old |', header, delimiter, body]);
  assert.deepEqual(ast.children.map(n => n.type), ['paragraph', 'table']);
 });
 test('빈 줄과 제목에서 끝나고 뒤 블록을 정상 처리한다', () => {
  const ast = parse([header, delimiter, body, '', '# 제목']);
  assert.deepEqual(ast.children.map(n => n.type), ['table', 'paragraph', 'heading']);
 });
 test('홀수 백슬래시는 파이프를 이스케이프하고 짝수는 경계로 쓴다', () => {
  const escaped = String.raw`| a\|b | c |`;
  assert.equal(table([escaped, delimiter, body]).header.length, 2);
  const even = String.raw`| a\\| b |`;
  assert.equal(table([even, delimiter, body]).header.length, 2);
  assert.equal(table([header, delimiter, String.raw`| \| | x |`]).rows[0].length, 2);
 });
 test('코드 블록 내부에서는 표를 인식하지 않는다', () => {
  const ast = parse(['```', header, delimiter, body, '```']);
  assert.deepEqual(ast.children.map(n => n.type), ['codeBlock']);
 });
 for (const prefix of ['- ', '> ']) test(`${prefix} 내부는 기존 들여쓰기 문맥에 따라 표를 만든다`, () => {
  const ast = parse([prefix + header, '  ' + delimiter, '  ' + body]);
  const container = ast.children[0];
  if (container.type === 'list') assert.equal(container.children[0].children[0].type, 'table');
  else if (container.type === 'blockquote') assert.equal(container.children[0].type, 'table');
  else assert.fail('container missing');
 });
 test('부모 문맥이 달라진 구분선과 헤더를 합치지 않는다', () => {
  const ast = parse(['- ' + header, delimiter, body]);
  assert.equal(ast.children[0].type, 'list');
  assert.ok(ast.children.every(n => n.type !== 'table'));
 });
 test('확정되지 않은 들여쓴 후보는 기존 부모 판정을 유지한다', () => {
  const ast = parse(['- item', '    | x |']);
  assert.deepEqual(ast.children.map(n => n.type), ['list', 'paragraph']);
 });
 test('긴 표도 행 수·순서·원문을 보존한다', () => {
  const rows = Array.from({length: 10000}, (_, i) => `| 항목 | ${i} |`);
  const node = table([header, delimiter, ...rows]);
  assert.equal(node.rows.length, rows.length);
  assert.deepEqual(node.rows[9999][1].children, parseInlines('9999'));
 });
});
