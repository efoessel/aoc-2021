import { readFile, run } from "./utils";


class Cell {
    constructor(
        public readonly value: number,
        public marked: boolean = false,
    ) {}
}

class Grid {
    private _isWinning = false;
    public get isWinning() { return this._isWinning }

    private score = 0;
    public getScore() { return this.score }

    private cells: Cell[][] = [];
    
    constructor(asText: string[]) {
        asText.forEach(line => {
            const cellsLine = line.split(/\s+/).map(c => new Cell(parseInt(c)));
            this.cells.push(cellsLine);
        })
    }

    public mark(value: number) {
        if(this.isWinning) return;

        this.cells.forEach((line, lineIdx) => line.forEach((cell, colIdx) => {
            if(cell.value === value && !cell.marked) {
                cell.marked = true;
                this.checkForWinningBoard(lineIdx, colIdx);
            }
        }));

        if(this.isWinning) {
            this.score = this.computeScore(value);
        }
    }

    private checkForWinningBoard(lineIdx: number, colIdx: number) {
        if(this.cells[lineIdx].every(cell => cell.marked)) {
            this._isWinning = true;
        } else if(this.cells.map(line => line[colIdx]).every(cell => cell.marked)) {
            this._isWinning = true;
        }
    }

    private computeScore(lastDrawn: number) {
        return this.cells.reduce((sum, line) => {
            return line.reduce((subSum, cell) => {
                return subSum + (cell.marked ? 0 : cell.value);
            }, sum);
        }, 0) * lastDrawn;
    }

    public toString() {
        return this.cells.map(line => line.map(cell => cell.value + (cell.marked?'*':'')).join(',')).join(';');
    }
}

function parseInput(raw: string[]) {
    const [drawStr, _, ...gridsTxt] = raw
    const drawNumbers = drawStr.split(',').map(x => parseInt(x));

    const grids: Grid[] = [];
    let buffer: string[] = [];
    gridsTxt.forEach(line => {
        if(line.trim().length === 0) {
            grids.push(new Grid(buffer));
            buffer = [];
        } else {
            buffer.push(line);
        }
    })
    // flush what's left if input doesn't end by an empty line
    if(buffer.length > 0) {
        grids.push(new Grid(buffer));
    }

    return { drawNumbers, grids };
}

const inputs = [
    parseInput(readFile('day-04-ex')),
    parseInput(readFile('day-04')),
];


function step1({ drawNumbers, grids }: { drawNumbers: number[], grids: Grid[] }) {
    for(let drawNumber of drawNumbers) {
        grids.forEach(g => g.mark(drawNumber));
        const winningGrids = grids.filter(g => g.isWinning);
        if(winningGrids.length > 0) {
            // if several grids, return best score
            const bestGrid = winningGrids.sort((g1, g2) => g1.getScore() - g2.getScore())[0];
            return {
                bestGrid: bestGrid.toString(),
                score: bestGrid.getScore(),
            }
        }
    }
}

function step2({ drawNumbers, grids }: { drawNumbers: number[], grids: Grid[] }) {
    for(let drawNumber of drawNumbers) {
        grids.forEach(g => g.mark(drawNumber));

        const winningGrids = grids.filter(g => g.isWinning);

        if(winningGrids.length < grids.length) {
            // if some grid have not won yet, drop winning grids as the one we look for is not there.
            grids = grids.filter(g => !g.isWinning);
        } else {
            // all remaining grids are finished this turn, return lowest score
            const bestGrid = winningGrids.sort((g1, g2) => g1.getScore() - g2.getScore())[winningGrids.length - 1];
            return {
                worstGrid: bestGrid.toString(),
                score: bestGrid.getScore(),
            }
        }
    }
}

run(step1, inputs);
run(step2, inputs);
