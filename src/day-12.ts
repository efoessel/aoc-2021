import { readFile, run } from "./utils";

type LinksMap = Record<string, string[]>;

function parseInput(input: string[]) {
    const pathsMap: LinksMap = {};
    input.forEach(line => {
        const[a, b] = line.split('-');
        if(!pathsMap[a]) pathsMap[a] = [];
        if(!pathsMap[b]) pathsMap[b] = [];
        pathsMap[a].push(b);
        pathsMap[b].push(a);
    });
    return pathsMap;
}

const inputs = [
    parseInput(readFile('day-12-ex')),
    parseInput(readFile('day-12-ex-2')),
    parseInput(readFile('day-12')),
];

function isBig(room: string) {
    return room.toUpperCase() === room;
}



function findPaths(start: string, end: string, pathBehind: string[], linksMap: LinksMap): string[][] {
    if(start === end) return [pathBehind];

    function canVisitThisCave(cave: string, pathBehind: string[]) {
        return isBig(cave) || !pathBehind.includes(cave);
    }

    const connected = linksMap[start];
    const nextPossible = connected.filter(x => canVisitThisCave(x, pathBehind));
    return nextPossible.reduce((allPaths, next) => {
        const pathsForThisNext = findPaths(next, end, [...pathBehind, next], linksMap);
        return allPaths.concat(pathsForThisNext);
    }, []);
}


function step1(linksMap: ReturnType<typeof parseInput>) {
    
    const paths = findPaths('start', 'end', ['start'], linksMap);
    return {
        linksMap,
        paths: paths.slice(0, 20).map(p => p.join(',')),
        result: paths.length,
    }
}



function findPaths2(start: string, end: string, pathBehind: string[], hasVisitedASmallCaveTwiceAlready: boolean, linksMap: LinksMap): string[][] {
    if(start === end) return [pathBehind];

    function canVisitThisCave(cave: string, pathBehind: string[]) {
        return isBig(cave) || !pathBehind.includes(cave) || (
            !['start', 'end'].includes(cave) && !hasVisitedASmallCaveTwiceAlready
        );
    }

    const connected = linksMap[start];
    const nextPossible = connected.filter(x => canVisitThisCave(x, pathBehind));
    return nextPossible.reduce((allPaths, next) => {
        const isSecondSmallCaveVisit = pathBehind.includes(next) && !isBig(next);
        const pathsForThisNext = findPaths2(next, end, [...pathBehind, next], isSecondSmallCaveVisit || hasVisitedASmallCaveTwiceAlready,linksMap);
        return allPaths.concat(pathsForThisNext);
    }, []);
}

function step2(linksMap: ReturnType<typeof parseInput>) {
    const paths = findPaths2('start', 'end', ['start'], false, linksMap);
    return {
        linksMap,
        paths: paths.slice(0, 20).map(p => p.join(',')),
        result: paths.length,
    }
}


run(step1, inputs);
run(step2, inputs);
