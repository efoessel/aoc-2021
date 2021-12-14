import { readFile, run } from "./utils";

type Command = {
    direction: 'forward' | 'down' | 'up',
    value: number,
};

function parseLine(line: string) {
    const chunks = line.split(' ');
    return {
        direction: chunks[0],
        value: parseInt(chunks[1]),
    } as Command;
}

const inputs = [
    readFile('day-02-ex').map(parseLine),
    readFile('day-02').map(parseLine),
];



function step1(commands: Command[]) {
    let hrzPosition = 0;
    let depth = 0;

    commands.forEach(({direction, value}) => {
        switch(direction) {
            case 'forward': hrzPosition += value; break;
            case 'up': depth -= value; break;
            case 'down': depth += value; break;
        }
    });

    return hrzPosition * depth;
}

function step2(commands: Command[]) {
    let hrzPosition = 0;
    let depth = 0;
    let aim = 0;

    commands.forEach(({direction, value}) => {
        switch(direction) {
            case 'forward': 
                hrzPosition += value;
                depth += aim * value;
                break;
            case 'up': aim -= value; break;
            case 'down': aim += value; break;
        }
    });

    return hrzPosition * depth;
}

run(step1, inputs);
run(step2, inputs);
