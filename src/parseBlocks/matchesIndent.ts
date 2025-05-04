export default function matchesIndent(line: string, indent: number) {
	// 길이가 들여쓰기 범위보다 작으면 false
	if (line.length < indent) return false;

	// 들여쓰기 범위내에서 들여쓰기가 문자열 존재하면 false
	for (let i = 0; i < indent; i++) {
		if (line[i] !== ' ') return false;
	}

	// 들여쓰기 이후 공백이 없으면 true
	// 정확하게 들여쓰기 만큼만 공백 허용
	return true;
}