import { readByBlocks, run } from "./utils";

class Range {
    private readonly from: number;
    private readonly to: number;

    // always from <= to
    constructor(
        from: number,
        to: number,
    ) {
        this.from = Math.min(from, to);
        this.to = Math.max(from, to);
    }

    intersection(range: Range) {
        const newFrom = Math.max(this.from, range.from);
        const newTo = Math.min(this.to, range.to);
        if(newFrom > newTo) return undefined;
        else return new Range(newFrom, newTo);
    }

    get length() {
        return this.to - this.from + 1;
    }

    toString() {
        return this.from + '..' + this.to;
    }
}

class Cube {
    constructor(
        private readonly x: Range,
        private readonly y: Range,
        private readonly z: Range
    ) {

    }

    intersection(cube: Cube) {
        const interX = this.x.intersection(cube.x);
        const interY = this.y.intersection(cube.y);
        const interZ = this.z.intersection(cube.z);

        if(interX && interY && interZ) {
            return new Cube(interX, interY, interZ);
        }
    }

    get volume() {
        return this.x.length * this.y.length * this.z.length;
    }

    toString() {
        return '[' + this.x.toString() + ', ' + this.x.toString() + ', ' +this.x.toString() + ']';
    }
}


class CubeWithHoles {
    holes: CubeWithHoles[] = [];

    constructor(
        // the bounding shape
        private readonly cube: Cube,
    ) {

    }

    remove(cube: Cube) {
        const interCube = this.cube.intersection(cube);

        if(interCube) {
            // we restore the potentially missing parts from the missing parts.
            this.holes.forEach(m => m.add(interCube));
            // create a new hole
            this.holes.push(new CubeWithHoles(interCube));
        }
    }

    add(cube: Cube) {
        this.holes.forEach(m => m.remove(cube));
    }

    clone() {
        const clone = new CubeWithHoles(this.cube);
        clone.holes = this.holes.map(hole => hole.clone())
        return clone;
    }

    getVolume() {
        return this.clone()._getVolume();
    }

    getHolesVolume() {
        return this.clone()._getHolesVolume();
    }

    private _getVolume() {
        return this.cube.volume - this._getHolesVolume();
    }

    // this is a destructive operation !
    private _getHolesVolume() {
        let volume = 0;

        this.holes.forEach((hole, index) => {
            const vol = hole._getVolume();
            volume += vol;
            // in order to not count intersection multiple times, remove the hole from all other holes!
            // this is the destructive part
            this.holes.slice(index + 1).forEach(futureHole => futureHole.remove(hole.cube));
        });
        return volume;
    }

    toString(): string {
        return '< ' + this.cube.toString() + ' -- [' + this.holes.map(h => h.toString()).join(',') + ']>';
    }
}

function parseInput(file: string) {
    const [lines] = readByBlocks(file);
    return lines.map(line => {
        const [_, onOff, x1, x2, y1, y2, z1, z2] = 
            /(on|off) x=(-?\d+)\.\.(-?\d+),y=(-?\d+)\.\.(-?\d+),z=(-?\d+)\.\.(-?\d+)/
            .exec(line);
        return {
            on: onOff === 'on',
            cube: new Cube(
                new Range(parseInt(x1), parseInt(x2)),
                new Range(parseInt(y1), parseInt(y2)),
                new Range(parseInt(z1), parseInt(z2))
            ),
        }
    });
}

const inputs = [
    parseInput('day-22-ex'),
    parseInput('day-22-ex-2'),
    parseInput('day-22-ex-3'),
    parseInput('day-22'),
];

function runRebootSteps(size: number, input: ReturnType<typeof parseInput>) {
    const boundingCube = new CubeWithHoles(new Cube(
        new Range(-size, size),
        new Range(-size, size),
        new Range(-size, size),
    ));

    input.forEach((line, i) => {
        if(line.on) {
            boundingCube.remove(line.cube);
        } else {
            boundingCube.add(line.cube)
        }
    })

    return boundingCube;
}


function step1(input: ReturnType<typeof parseInput>) {
    const boundingCube = runRebootSteps(50, input);

    return {
        input: input.map(i => ({...i, cube: i.cube.toString()})).slice(0, 5),
        result: boundingCube.getHolesVolume()
    }
}

function step2(input: ReturnType<typeof parseInput>) {
    const boundingCube = runRebootSteps(Infinity, input);

    return {
        input: input.map(i => ({...i, cube: i.cube.toString()})).slice(0, 5),
        result: boundingCube.getHolesVolume()
    }
}


run(step1, inputs);
run(step2, inputs);
