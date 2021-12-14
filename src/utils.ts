import path from 'path';
import fs from 'fs';

export function run<T, O>(algo: (input:T) => O, inputs: T[]) {
    inputs.forEach((input, index) => {
        let inputStr = `input = ${input}`;
        if(inputStr.length > 200) {
            inputStr = inputStr.substr(0, 195) + ' ....';
        }
        console.log(`\n## Run ${index + 1}`);
        console.log(inputStr);
        console.log(`result =`,  algo(input));
    });
    console.log('done.')

    // keep running for ts-node-dev auto-restart
    setTimeout(() => console.log('auto-shutdown'), 1000000000);
}

export function readFile(fileName: string) {
    const fullName = path.join(__dirname, '../data', fileName);
    const fileStr = fs.readFileSync(fullName, {
        encoding: 'utf-8',
    });
    return fileStr.split('\n').map(line => line.trim());
}

export function readByBlocks(fileName: string) {
    const lines = readFile(fileName);
    const output: string[][] = [];
    let block: string[] = [];

    lines.forEach((line) => {
        if(line.trim() === '') {
            output.push(block);
            block = [];
        } else {
            block.push(line);
        }
    });

    if(block.length > 0) {
        output.push(block);
    }
    return output;
}