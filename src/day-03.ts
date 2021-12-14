import { readFile, run } from "./utils";


const inputs = [
    readFile('day-03-ex'),
    readFile('day-03'),
];

function findMostCommonBitAtRank(input: string[], rank: number) {
    let countOfOnes: number = 0;

    input.forEach(line => {
        countOfOnes += line.charAt(rank) === '1' ? 1 : 0;
    });

    return countOfOnes >= input.length / 2 ? '1' : '0';
}

function findMostCommonBit(input: string[]) {
    let mostCommonBit = '';
    for(let rank = 0 ; rank < input[0].length ; rank ++) {
        mostCommonBit += findMostCommonBitAtRank(input, rank);
    }
    return mostCommonBit;
}

function reverseBits(input: string) {
    return input.split('').map(x => x === '1' ? '0' : '1').join('');
}

function step1(input: string[]) {
    const gammaRateStr = findMostCommonBit(input);
    const epsilonRateStr = reverseBits(gammaRateStr);

    const gammaRate = parseInt(gammaRateStr, 2);
    const epsilonRate = parseInt(epsilonRateStr, 2);

    return {
        gammaRateStr,
        epsilonRateStr,
        gammaRate,
        epsilonRate,
        result: gammaRate * epsilonRate,
    }
}

function extractRating(input: string[], keepMostCommon: boolean) {
    for(let rank = 0; rank < input[0].length ; rank++) {
        let mostCommonBit = findMostCommonBitAtRank(input, rank);
        if(! keepMostCommon) mostCommonBit = reverseBits(mostCommonBit);
        input = input.filter((line) => line.charAt(rank) === mostCommonBit);
        if(input.length === 1) return input[0];
    }
}

function step2(input: string[]) {
    const oxyRating = extractRating(input, true);
    const co2Rating = extractRating(input, false);
    
    return {
        oxyRating,
        co2Rating,
        result: parseInt(oxyRating, 2) * parseInt(co2Rating, 2),
    };
}

run(step1, inputs);
run(step2, inputs);
