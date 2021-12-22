import { Grid, Point } from "./grid";
import { readByBlocks, run } from "./utils";

function parseInput(file: string) {
    const [lines] = readByBlocks(file);
    return lines.map(line => line.split('').map(x => parseInt(x)));
}

const inputs = [
    parseInput('day-15-ex'),
    parseInput('day-15'),
];

class MyStupidSet<T extends Point> {
    elements: Record<string, T> = {};
    length = 0;

    constructor(
        private keepBest: (a:T, b:T) => T,
    ) {

    }

    add(el: T) {
        const key = `${el.x},${el.y}`;
        if(this.elements[key] === undefined) {
            this.elements[key] = el;
            this.length++;
        } else {
            this.elements[key] = this.keepBest(el, this.elements[key]);
        }
    }

    popSmallest() {
        const [key, best] = Object.entries(this.elements)
            .reduce((best, curr) => {
                return best === undefined
                    ? curr : (
                        this.keepBest(best[1], curr[1]) === best[1]
                            ? best
                            : curr
                    );
            }, undefined);
        delete this.elements[key];
        this.length--;
        return best;
    }
}

function findLowestPathScore(input: Grid<number>) {
    const firstElem = {
        x: 0, y: 0, 
        cost: 0,
    };
    let alive = new MyStupidSet<typeof firstElem>((a, b) => a.cost < b.cost ? a : b);
    alive.add(firstElem);
    const visited = input.map(() => false);

    function isEnd(p: Point) {
        return p.x === input.width-1 && p.y === input.height-1;
    }
let step = 0;
    while(true) {
        step++;
        const current = alive.popSmallest();
        if(isEnd(current)) {
            return current.cost;
        }
        visited.set(current, true);
        
        input.getNeighbors(current)
            .filter(n => visited.get(n) === false)
            .map(n => ({...n, cost: current.cost + input.get(n)}))
            .forEach(n => alive.add(n));
        
        if(step % 10000 === 0) {
            console.log(step, alive.length, input.width*input.height);
        }
    }
}


function step1(input: ReturnType<typeof parseInput>) {
    const riskGrid = new Grid(input, false);
    return {
        riskGrid: riskGrid.toString(),
        //insertionRules,
        result: findLowestPathScore(riskGrid),
    }
}

function step2(input: ReturnType<typeof parseInput>) {
    const multMachine = [0, 1, 2, 3, 4]
    const biggerInput = multMachine.flatMap((addY) => {
        return input.map(line => {
            return multMachine.flatMap((addX)=> {
                return line.map(val => (val + addX + addY - 1) % 9 + 1);
            });
        });        
    });

    const riskGrid = new Grid(biggerInput, false);
    return {
        riskGrid: riskGrid.toString(),
        //insertionRules,
        result: findLowestPathScore(riskGrid),
    }
}


run(step1, inputs);
run(step2, inputs);
