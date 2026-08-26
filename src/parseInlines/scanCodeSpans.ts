import {CODE_SYNTAX} from "./syntax";

/**
 * @description 인라인 코드 구간
 */
export type CodeSegment = {
    type: 'code';
    open: string;
    content: string;
    close: string;
}

/**
 * @description 인라인 코드가 아닌 구간
 */
export type TextSegment = {
    type: 'text';
    text: string;
}

export type Segment = CodeSegment | TextSegment

/**
 * @description index 위치부터 이어지는 백틱의 개수를 센다
 */
function readRunLength(line: string, index: number) {
    let length = 0;
    while (index + length < line.length && line[index + length] === CODE_SYNTAX) {
        length += 1;
    }
    return length;
}

/**
 * @description index 위치의 문자가 백슬래시로 이스케이프 되었는지 판단한다.
 * 백슬래시가 홀수 개면 이스케이프된 것으로 본다.
 */
function isEscaped(line: string, index: number) {
    let count = 0;
    let i = index - 1;
    while (i >= 0 && line[i] === '\\') {
        count += 1;
        i -= 1;
    }
    return count % 2 === 1;
}

/**
 * @description from 위치부터 길이가 정확히 일치하는 백틱 런을 찾는다.
 * 코드 구간 내부에서는 이스케이프가 동작하지 않으므로 백슬래시를 검사하지 않는다.
 * @returns 찾으면 시작 인덱스, 없으면 -1
 */
function findClosingRun(line: string, from: number, length: number) {
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

/**
 * @description 한 줄을 인라인 코드 구간과 그 외 구간으로 분리한다.
 *
 * 여는 백틱 런과 길이가 같은 런을 닫는 구분자로 본다.
 * 닫는 런이 없으면 코드로 인정하지 않고 일반 텍스트로 남긴다.
 * (작성 도중에 화면이 코드 스타일로 뒤집히는 것을 막기 위함)
 *
 * @param line 파싱할 한 줄
 * @returns 코드 구간과 텍스트 구간이 원문 순서대로 담긴 배열
 */
export default function scanCodeSpans(line: string): Segment[] {
    const segments: Segment[] = [];
    let textStart = 0;
    let index = 0;

    while (index < line.length) {
        if (line[index] !== CODE_SYNTAX || isEscaped(line, index)) {
            index += 1;
            continue;
        }

        const openLength = readRunLength(line, index);
        const closeIndex = findClosingRun(line, index + openLength, openLength);

        // 닫는 런이 없으면 코드가 아니다. 이 런은 리터럴로 두고 다음 런부터 다시 찾는다
        if (closeIndex === -1) {
            index += openLength;
            continue;
        }

        if (textStart !== index) {
            segments.push({
                type: 'text',
                text: line.substring(textStart, index)
            });
        }

        segments.push({
            type: 'code',
            open: line.substring(index, index + openLength),
            content: line.substring(index + openLength, closeIndex),
            close: line.substring(closeIndex, closeIndex + openLength),
        });

        index = closeIndex + openLength;
        textStart = index;
    }

    if (textStart !== line.length) {
        segments.push({
            type: 'text',
            text: line.substring(textStart)
        });
    }

    return segments;
}
