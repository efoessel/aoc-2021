import { Grid } from "./grid";
import { readFile, run } from "./utils";

function parseInput(input: string[], steps: number) {
    return {
        octopuses: input.map(line => line.split('').map(x => parseInt(x))),
        steps
    };
}

const inputs = [
    parseInput(readFile('day-11-ex'), 10),
    parseInput(readFile('day-11-ex'), 100),
    parseInput(readFile('day-11'), 100),
];


class OctopusSchool extends Grid<number> {
    public update() {
        let flashCounter = 0;
        const hasAlreadyFlashedGrid = this.map(() => false);

        this.mapInPlace(energy => energy + 1);
        
        let hasAnyOctopusFlashed = false;
        let stepCnt = 0;
        do {
            hasAnyOctopusFlashed = false
            this.filter((energyLevel, pos) => energyLevel > 9 && !hasAlreadyFlashedGrid.get(pos))
                .forEach((octopus) => {
                    flashCounter += 1
                    hasAnyOctopusFlashed = true;
                    hasAlreadyFlashedGrid.set(octopus, true);
                    this.set(octopus, 0);
                    this.getNeighbors(octopus).forEach(neighbor => {
                        if(!hasAlreadyFlashedGrid.get(neighbor)) {
                            this.set(neighbor, neighbor.value + 1);
                        }
                    })
                });

        } while(hasAnyOctopusFlashed);

        return flashCounter;
    }

    flashCountsAfterStep(step: number) {
        let count = 0;
        for(let i = 0 ; i < step ; i++) {
            count += this.update();
        }
        return count;
    }

    getSynchronizationStep(step: number) {
        let count = 0;
        do {
            count++;
            this.update();
        } while(this.some(v => v != 0));
        return count;
    }

    public toString() {
        return super.toString((v) => v < 10 ? ''+v : '@')
    }
}




function step1({octopuses, steps}: ReturnType<typeof parseInput>) {
    const octopusSchool = new OctopusSchool(octopuses, true);
    const res = octopusSchool.flashCountsAfterStep(steps);

    return {
        finalState: octopusSchool.toString(),
        result: res
    }
}

function step2({octopuses, steps}: ReturnType<typeof parseInput>) {
    const octopusSchool = new OctopusSchool(octopuses, true);
    const res = octopusSchool.getSynchronizationStep(steps);

    return {
        finalState: octopusSchool.toString(),
        result: res
    }
}


run(step1, inputs);
run(step2, inputs);
