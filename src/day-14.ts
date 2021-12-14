import { readByBlocks, run } from "./utils";

type InsertionRulesMap = Record<string, string>;
type Polymer = {
    first: string,
    last: string,
    pairsCount: Record<string, number>
};

function parseInput(file: string) {
    const [[polymerAsString], insertionRules] = readByBlocks(file);

    const insertionRulesMap: InsertionRulesMap = {};
    insertionRules.forEach(line => {
        const [_, pair, insert] = /(\w\w) -> (\w)/.exec(line);

        insertionRulesMap[pair] = insert;
    });

    const polymer: Polymer = {
        first: polymerAsString.charAt(0),
        last: polymerAsString.charAt(polymerAsString.length - 1),
        pairsCount: {},
    };
    for(let i = 0 ; i < polymerAsString.length - 1 ; i++) {
        const pair = polymerAsString.substr(i, 2);
        polymer.pairsCount[pair] = (polymer.pairsCount[pair]||0) + 1;
    }

    return {
        polymer,
        insertionRules: insertionRulesMap,
    };
}

const inputs = [
    parseInput('day-14-ex'),
    parseInput('day-14'),
];


function polymerize(input: Polymer, rules: InsertionRulesMap) {
    const output: Polymer = {
        first: input.first,
        last: input.last,
        pairsCount: {},
    };

    function add(pair: string, count: number) {
        output.pairsCount[pair] = (output.pairsCount[pair] || 0) + count;
    }

    Object.entries(input.pairsCount).forEach(([pair, count]) => {
        if(rules[pair] === undefined){
            add(pair, count);
        } else {
            add(pair.charAt(0)+rules[pair], count);
            add(rules[pair]+pair.charAt(1), count);
            
        }
    });

    return output;
}

function multiPolymerize(input: Polymer, rules: InsertionRulesMap, steps: number) {
    for(let i = 0 ; i < steps ; i++) {
        input = polymerize(input, rules);
    }
    return input;
}

function getScore(polymer: Polymer) {
    const charCountsDoubled = Object.entries(polymer.pairsCount).reduce((counts, [pair, count]) => {
        counts[pair.charAt(0)] = (counts[pair.charAt(0)] || 0) + count;
        counts[pair.charAt(1)] = (counts[pair.charAt(1)] || 0) + count;
        return counts;
    }, {
        [polymer.first]: 1,
        [polymer.last]: 1,
    });
    const sortedCharCounts = Object.entries(charCountsDoubled).sort((a, b) => b[1] - a[1]);
    return (sortedCharCounts[0][1] - sortedCharCounts[sortedCharCounts.length - 1][1]) / 2;
}

function getSize(polymer: Polymer) {
    return 1 + Object.entries(polymer.pairsCount).reduce((counts, [_, count]) => counts + count, 0) / 2;
}


function step1({polymer, insertionRules}: ReturnType<typeof parseInput>) {
    const polymerAtTheEnd = multiPolymerize(polymer, insertionRules, 10);
    return {
        polymer,
        //insertionRules,
        result: getScore(polymerAtTheEnd),
    }
}

function step2({polymer, insertionRules}: ReturnType<typeof parseInput>) {
    const polymerAtTheEnd = multiPolymerize(polymer, insertionRules, 40);
    return {
        //polymer,
        'final length': getSize(polymerAtTheEnd),
        result: getScore(polymerAtTheEnd),
    }
}

run(step1, inputs);
run(step2, inputs);
