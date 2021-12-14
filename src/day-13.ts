import { Point } from "./grid";
import { readFile, run } from "./utils";

type FoldInstruction = {
    direction: 'x'|'y';
    position: number;
};

function parseInput(input: string[]) {
    const dots: Point[] = [];
    const folds: FoldInstruction[] = [];
    
    let parsingDots = true;
    input.forEach(line => {
        if(line === '') {
            parsingDots = false;
        } else if(parsingDots) {
            const [x, y] = line.split(',');
            dots.push({
                x: parseInt(x),
                y: parseInt(y),
            });
        } else {
            const [_, direction, position] = /fold along ([xy])=(\d+)/.exec(line);
            folds.push({
                direction: direction as 'x'|'y',
                position: parseInt(position),
            });
        }
    });
    return {
        dots, folds
    };

}

const inputs = [
    parseInput(readFile('day-13-ex')),
    parseInput(readFile('day-13')),
];


function transform(dot: Point, fold: FoldInstruction) {
    const trans = (x: number) => x <= fold.position ? x : 2*fold.position-x;

    if(fold.direction === 'x') {
        if(dot.x === fold.position) return undefined;
        return {
            x: trans(dot.x),
            y: dot.y,
        };
    } else {
        if(dot.y === fold.position) return undefined;
        return {
            x: dot.x,
            y: trans(dot.y),
        };
    }
}

function fold(dots: Point[], fold: FoldInstruction) {
    return dots.map(dot => transform(dot, fold))
        .filter(x => x) // remove any that was on the line
        .filter((x, i, array) => array.findIndex((y) => y.x === x.x && y.y === x.y) >= i) // deduplicate
}

function step1({dots, folds}: ReturnType<typeof parseInput>) {
    const afterFirstFold = fold(dots, folds[0])
    return {
        dots,
        folds,
        result: afterFirstFold.length,
    }
}


function toString(dots: Point[]) {
    const dims = dots.reduce((dim, dot) => {
        return {
            height: Math.max(dim.height, dot.y+1),
            width: Math.max(dim.width, dot.x+1),
        }
    }, {height: 0, width: 0});

    let str = (' '.repeat(dims.width)+'\n').repeat(dims.height);
    dots.forEach(dot => {
        const index = dot.y * (dims.width + 1) + dot.x;
        str = str.substring(0, index) + '#' + str.substring(index + 1);
    });

    return str;
}

function step2({dots, folds}: ReturnType<typeof parseInput>) {
    const afterFold = folds.reduce(fold, dots)
    console.log(toString(afterFold))
    return {
        result: afterFold.length,
    }
}

run(step1, inputs);
run(step2, inputs);
