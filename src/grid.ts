
export type Point = {
    x: number;
    y: number;
};

type Cell<T> = Point & {
    value: T;
}

export type Directions = 'up'|'down'|'left'|'right';
export type DirectionsWithDiags = Directions|'up-left'|'down-left'|'down-right'|'up-right';

export class Grid<T> {
    private cells: Cell<T>[][] = [];
    private readonly height: number
    private readonly width: number

    constructor(
        private input: T[][],
        private withDiags = false,
    ){
        this.height = input.length;
        this.width = 0; // for 0-height edge case

        for(let y = 0 ; y < input.length ; y++) {
            this.cells[y] = [];
            this.width = this.input[y].length;
            for(let x = 0 ; x < input[y].length ; x++) {
                this.cells[y][x] = {
                    x, y, 
                    value: input[y][x]
                }
            }
        }
    }

    public get({x, y}: Point) {
        return this.cells[y]?.[x]?.value;
    }

    public set({x, y}: Point, value: T) {
        this.cells[y][x].value = value;
    }

    public static getPoint(cell: Cell<unknown>) {
        return {
            x: cell.x,
            y: cell.y,
        };
    }

    public getNeighbors({x, y}: Point, ...directions: DirectionsWithDiags[]) {
        function isSelected(dir: DirectionsWithDiags) {
            return directions.includes(dir) || directions.length === 0
        }

        const result = [];
        if(isSelected('up') && y > 0) {
            result.push(this.cells[y-1][x]);
        }
        if(isSelected('down') && y < this.height - 1) {
            result.push(this.cells[y+1][x]);
        }
        if(isSelected('left') && x > 0) {
            result.push(this.cells[y][x-1]);
        }
        if(isSelected('right') && x < this.width - 1) {
            result.push(this.cells[y][x+1]);
        }

        if(this.withDiags) {
            if(isSelected('up-left') && y > 0 && x > 0) {
                result.push(this.cells[y-1][x-1]);
            }
            if(isSelected('up-right') && y > 0 && x < this.width - 1) {
                result.push(this.cells[y-1][x+1]);
            }
            if(isSelected('down-left') && y < this.height - 1 && x > 0) {
                result.push(this.cells[y+1][x-1]);
            }
            if(isSelected('down-right') && y < this.height - 1 && x < this.width - 1) {
                result.push(this.cells[y+1][x+1]);
            }
        }
        
        return result;
    }

    public forEach(callback: (value: T, point: Point, grid: Grid<T>) => void) {
        this.cells.forEach((line, y) => {
            line.forEach((cell, x) => {
                callback(cell.value, {x, y}, this);
            });
        });
    }

    public map<O>(callback: (value: T, point: Point, grid: Grid<T>) => O) {
        return new Grid(this.cells.map((line, y) => {
            return line.map((cell, x) => {
                return callback(cell.value, {x, y}, this);
            });
        }), this.withDiags);
    }

    public mapInPlace(callback: (value: T, point: Point, grid: Grid<T>) => T) {
        this.cells.forEach((line, y) => {
            line.forEach((cell, x) => {
                cell.value = callback(cell.value, {x, y}, this);
            });
        });
        return this;
    }

    public filter(filter: (value: T, point: Point, grid: Grid<T>) => boolean) {
        const res: Cell<T>[] = [];
        this.forEach((val, point) => {
            if(filter(val, point, this)) {
                res.push({
                    ...point,
                    value: val,
                });
            };
        });
        return res;
    }

    public some(test: (value: T, point: Point, grid: Grid<T>) => boolean) {
        return this.cells.some((line, y) => {
            return line.some((cell, x) => {
                return test(cell.value, {x, y}, this);
            });
        });
    }

    public every(test: (value: T, point: Point, grid: Grid<T>) => boolean) {
        return !this.some((v, p, g) => !test(v, p, g));
    }

    public toString(cellToString: (v: T, p: Point) => string = (x) => ''+x, joiner = '') {
        return this.cells.map((line, y) => {
            return line.map((cell, x) => {
                return cellToString(cell.value, {x, y});
            }).join(joiner);
        }).join('\n');
    }
}