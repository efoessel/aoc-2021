import { readFile, run } from "./utils";

class Population {
    private currentDay = 0;

    constructor(
        private countPerDay: number[]
    ) {
        
    }

    private nextDay() {
        const atZero = this.countPerDay[0];

        // shift days for existing pop
        for(let i = 0 ; i < 8 ; i++) {
            this.countPerDay[i] = this.countPerDay[i+1]
        }

        // handle reproducers
        this.countPerDay[8] = atZero;
        this.countPerDay[6] += atZero;
        
        this.currentDay += 1;
    }

    public gotoDay(day : number) {
        if(day < this.currentDay) {
            throw new Error('This is already in the past!');
        }
        while(this.currentDay < day) {
            this.nextDay();
        }
    }

    public getPopulation() {
        return [...this.countPerDay];
    }

    public getTotalPopulationCount() {
        return this.countPerDay.reduce((acc, x) => acc+x, 0);
    }
}

function parseInput(line: string) {
    const pop = line.split(',').map(x => parseInt(x));
    return pop.reduce((counts, jellyfish) => {
        counts[jellyfish] += 1;
        return counts;
    }, new Array(9).fill(0))
}

const inputs = [
    [parseInput('3,4,3,1,2'), 18],
    [parseInput('3,4,3,1,2'), 80],
    [parseInput(readFile('day-06')[0]), 80],
    [parseInput(readFile('day-06')[0]), 256],
];

function step1([input, targetDay]: [number[], number]) {
    const pop = new Population(input);
    console.log(input, targetDay)
    pop.gotoDay(targetDay)
    return {
        pop: pop.getPopulation(),
        result: pop.getTotalPopulationCount(),
    }
}


run(step1, inputs);
