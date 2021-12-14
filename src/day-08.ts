import { readFile, run } from "./utils";

function parseInput(input: string[]) {
    return input.map(line => {
        const [infos, data] = line.split(' | ');
        return {
            infos: infos.split(' ').map(pattern => pattern.split('')) as Pattern[],
            data: data.split(' ') as string[],
        }
    });
}

const inputs = [
    parseInput(readFile('day-08-ex')),
    parseInput(readFile('day-08')),
];

type Segment = 'a'|'b'|'c'|'d'|'e'|'f'|'g';
type SegmentedNumber = keyof typeof SEGMENTS_TO_NUMBERS_MAPPING;
type Pattern = Segment[];
type Mapping = Record<Segment, Segment>;
const SEGMENTS = 'abcdefg'.split('') as Pattern;
const SEGMENTS_TO_NUMBERS_MAPPING = {
    'abcefg': '0',
    'cf': '1',
    'acdeg': '2',
    'acdfg': '3',
    'bcdf': '4',
    'abdfg': '5',
    'abdefg': '6',
    'acf': '7',
    'abcdefg': '8',
    'abcdfg': '9',
}

function superSmartPatternMatcher(patterns: Pattern[]) {
    function intersection(...patterns: Pattern[]) {
        return SEGMENTS.filter(char => patterns.every(pattern => pattern.includes(char)));
    }
    function not(pattern: Pattern | Segment) {
        return SEGMENTS.filter(char => !pattern.includes(char))
    }

    const res = {} as Mapping;

    const one = patterns.find(p => p.length == 2);
    const seven = patterns.find(p => p.length == 3);
    const four = patterns.find(p => p.length == 4);
    const fiveSegments = patterns.filter(p => p.length == 5); // 3, 2 or 5

    const frequencies = SEGMENTS.map(char => ({
        char,
        count: patterns.filter(p => p.includes(char)).length,
    }));

    res.b = frequencies.find(freq => freq.count === 6).char;
    res.e = frequencies.find(freq => freq.count === 4).char;
    res.f = frequencies.find(freq => freq.count === 9).char;
    res.c = intersection(one, not(res.f))[0];
    res.a = intersection(seven, not(four))[0];
    res.d = intersection(four, not(res.b), not(one))[0];
    res.g = intersection(...fiveSegments, not(four), not(seven))[0];
    
    return res;
}

function translate(input: string[], dict: Mapping) {
    const reversedDict = Object.fromEntries(Object.entries(dict).map(([k, v]) => [v, k]));
    
    return input.map(pattern => {
        const decrypted = pattern.split('').map(char => reversedDict[char]).sort().join('');
        if(decrypted in SEGMENTS_TO_NUMBERS_MAPPING) {
            return SEGMENTS_TO_NUMBERS_MAPPING[decrypted as SegmentedNumber];
        } else {
            throw new Error('Something went wrong, decrypted value doesn\'t exist '+decrypted);
        }
    });
}


function step1(input: ReturnType<typeof parseInput>) {
    let count = 0;
    input.forEach(line => {
        count += line.data.filter(el => [2, 3, 4, 7].includes(el.length)).length
    });
    return count
}

function step2(input: ReturnType<typeof parseInput>) {
    let count = 0;
    input.forEach(line => {
        const dict = superSmartPatternMatcher(line.infos);
        const translated = translate(line.data, dict).join('');
        count += parseInt(translated)
    });
    return count
}


run(step1, inputs);
run(step2, inputs);
