import { readFile, run } from "./utils";

const inputs = [
    [199, 200, 208, 210, 200, 207, 240, 269, 260, 263],
    readFile('day-01').map(line => parseInt(line)),
];

function step1(depths: number[]) {
    let lastDepth = +Infinity;
    let increasedCount = 0;
    depths.forEach(depth => {
        if(depth > lastDepth) {
            increasedCount += 1;
        }
        lastDepth = depth;
    });
    return increasedCount;
}

function step2(depths: number[]) {
    let windows = [];
    for(let i = 2 ; i < depths.length ; i++) {
        windows.push(depths[i-2] + depths[i-1] + depths[i] )
    }
    return step1(windows);
}

run(step1, inputs);
run(step2, inputs);
