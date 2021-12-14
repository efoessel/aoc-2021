import { readFile, run } from "./utils";

function parseInput(input: string[]) {
    return input;
}

const inputs = [
    parseInput(readFile('day-10-ex')),
    parseInput(readFile('day-10')),
];

const OPENING_DELIMITERS = '([{<';
const CLOSING: Record<string, string> = {
    '(': ')',
    '[':  ']',
    '{': '}',
    '<': '>',
};
const SYNTAX_ERROR_SCORE: Record<string, number> = {
    ')': 3,
    ']': 57,
    '}': 1197,
    '>': 25137,
};


function parser(line: string) {
    const openedDelimiters: string[] = [];

    for(let char of line.split('')) {
        if(OPENING_DELIMITERS.includes(char)) {
            openedDelimiters.push(char);
        } else {
            const expected = openedDelimiters.pop();
            if(CLOSING[expected] !== char) {
                return {
                    status: 'error',
                    score: SYNTAX_ERROR_SCORE[char],
                };
            }
        }
    }

    if(openedDelimiters.length) {
        return {
            status: 'incomplete',
            opened: openedDelimiters,
        };
    }

    return {
        status: 'success',
    };
}


function step1(input: ReturnType<typeof parseInput>) {
    const parsed = input.map(parser);
    return {
        parsed,
        result: parsed
            .filter(r => r.status === 'error')
            .reduce((sum, {score}) => sum + score, 0),
    }
}


const AUTO_CLOSE_SCORE: Record<string, number> = {
    '(': 1,
    '[': 2,
    '{': 3,
    '<': 4,
};
function calcScore(opened: string[]) {
    return opened.reverse().reduce((acc, delimiter) => acc * 5 + AUTO_CLOSE_SCORE[delimiter], 0);
}

function step2(input: ReturnType<typeof parseInput>) {
    const parsed = input.map(parser).filter(r => r.status === 'incomplete');
    const autoCompleteScores = parsed.map(({opened}) => calcScore(opened));
    return {
        autoCompleteScores,
        result: [...autoCompleteScores].sort((a, b) => (a-b))[autoCompleteScores.length/2 - 0.5]
    }
}


run(step1, inputs);
run(step2, inputs);
