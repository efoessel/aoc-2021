import { Grid } from "./grid";
import { readFile, run } from "./utils";

function parseInput(input: string[]) {
    return input.map(line => {
        return line.split('').map(x => parseInt(x));
    });
}

const inputs = [
    parseInput(readFile('day-09-ex')),
    parseInput(readFile('day-09')),
];

type Point = {
    x: number;
    y: number;
}

class TopographyMap extends Grid<number> {
    constructor(input: number[][]) {
        super(input, false);
    }

    public isLowPoint(p: Point) {
        const height = this.get(p);
        const neighbors = this.getNeighbors(p);
        return height < Math.min(...neighbors.map(p => this.get(p)))
    }

    public getBasinSize(lowPoint: Point) {
        const markers = this.map(() => true);
        const alive = [lowPoint];
        let counter = 0;
        markers.set(lowPoint, false);

        while(alive.length > 0) {
            const current = alive.shift();
            counter += 1;
            const notVisitedNeighbors = this.getNeighbors(current)
                .filter(p => this.get(p) < 9)
                .filter((p) => markers.get(p));
            notVisitedNeighbors.forEach(n => {
                alive.push(n);
                markers.set(n, false);
            });
        }
        return counter;
    }

}

function step1(input: ReturnType<typeof parseInput>) {
    const grid = new TopographyMap(input);
    const lowPoints = grid
        .filter((_, point) => grid.isLowPoint(point))
        .map(Grid.getPoint);

    return {
        lowPoints,
        result: lowPoints.reduce((sum, val) => sum + grid.get(val) + 1, 0),
    }
}


function step2(input: ReturnType<typeof parseInput>) {
    const grid = new TopographyMap(input);
    let { lowPoints } = step1(input);

    // for each low point find it's bassin
    const basinsSize = lowPoints
        .map(lowPoint => grid.getBasinSize(lowPoint))
        .sort((a, b) => b-a);
    
    return {
        lowPoints,
        basinsSize: basinsSize,
        result: basinsSize.slice(0, 3).reduce((prod, val) => prod * val, 1),
    }
}


run(step1, inputs);
run(step2, inputs);
