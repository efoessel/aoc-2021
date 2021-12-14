import { readFile, run } from "./utils";

function parseInput(line: string) {
    return line.split(',').map(x => parseInt(x));
}

const inputs = [
    parseInput('16,1,2,0,4,2,7,1,2,14'),
    parseInput(readFile('day-07')[0]),
];

function getMedianPos(input: number[]) {
    input.sort();
    if(input.length % 2 === 1) {
        return input[(input.length - 1)/2];
    } else {
        return input[input.length/2];
        //this is not, in general, the only solution, anything between input[input.length/2 - 1] and input[input.length/2] would be valid
    }
}

function step1(input: number[]) {
    const targetPos = getMedianPos(input);
    return {
        targetPos,
        fuelSpent: input.reduce((sum, pos) => sum + Math.abs(pos - targetPos), 0),
    }
}


function step2(input: number[]) {
    function getTotalFuelCost(from: number[], to: number) {
        function getFuelCost(from: number, to: number) {
            const dist = Math.abs(from - to);
            return dist * (dist + 1) / 2
        }
        
        return from.reduce((sum, pos) => sum + getFuelCost(pos, to), 0)
    }

    const avg = input.reduce((sum, pos) => sum+pos, 0) / input.length
    const left = getTotalFuelCost(input, Math.floor(avg));
    const right = getTotalFuelCost(input, Math.ceil(avg));
    return {
        targetPos: left < right ? Math.floor(avg) : Math.ceil(avg),
        fuelSpent: Math.min(left, right),
    }
}

run(step1, inputs);
run(step2, inputs);