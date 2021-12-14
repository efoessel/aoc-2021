import { readFile, run } from "./utils";

type Point = {
    x: number;
    y: number;
}

type Segment = {
    from: Point;
    to: Point;
}

class Grid {
    private xMax = 0;
    private yMax = 0;
    private points: number[][] = [];
    
    constructor() {
    }

    private extendGridTo(...points: Point[]) {
        points.forEach(point => {
            while(this.xMax <= point.x) {
                this.points.forEach(line => line.push(0))
                this.xMax += 1;
            }
            while(this.yMax <= point.y) {
                this.points.push(new Array(this.xMax).fill(0))
                this.yMax += 1;
            }
        })
    }

    public mark(from: Point, to: Point, allowDiags: boolean) {
        const dirX = Math.sign(to.x - from.x);
        const dirY = Math.sign(to.y - from.y);
        const steps = Math.max(Math.abs(to.x - from.x), Math.abs(to.y - from.y)) + 1;

        if(dirX * dirY != 0 && !allowDiags) return;
        
        this.extendGridTo(from, to);
        for(let i = 0 ; i < steps ; i++) {
            this.points[from.y + i*dirY][from.x + i*dirX] += 1;
        }
    }

    public countPointsWhere(condition: (point: Point, value: number) => boolean) {
        return this.points.reduce((sum, line, y) => {
            return line.reduce((subSum, value, x) => {
                return subSum + (condition({x, y}, value) ? 1 : 0);
            }, sum);
        }, 0);
    }

    public toString() {
        return this.points.map(line => line.map(value => ''+value).join('')).join('\n');
    }
}

function parseInput(raw: string[]): Segment[] {
    return raw.map(line => {
        const [fromStr, toStr] = line.split(/\s->\s/);
        const fromArr = fromStr.split(',').map(x => parseInt(x));
        const toArr = toStr.split(',').map(x => parseInt(x));
        return {
            from: {
                x: fromArr[0],
                y: fromArr[1],
            },
            to: {
                x: toArr[0],
                y: toArr[1],
            },
        };
    });
}

const inputs = [
    parseInput(readFile('day-05-ex')),
    parseInput(readFile('day-05')),
];

function stepCommon(input: Segment[], allowDiags: boolean) {
    const grid = new Grid();
    input.forEach(segment => {
        grid.mark(segment.from, segment.to, allowDiags);
    });
    const result = grid.countPointsWhere((_, val) => val >= 2);
    return {
        //grid: grid.toString(),
        result,
    }
}

function step1(input: Segment[]) {
    return stepCommon(input, false);
}

function step2(input: Segment[]) {
    return stepCommon(input, true);
}

run(step1, inputs);
run(step2, inputs);
