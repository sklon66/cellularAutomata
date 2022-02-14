class Cell {
    constructor(top, left) {
        this.top = top;
        this.left = left;
    }

    fill(cellWidth, cellHeight, context, solid) {
        context.fillStyle = solid ? '#000' : '#fff';
        context.fillRect(this.top, this.left, cellWidth, cellHeight);
    }
}

class Life {
    static randomInteger(min, max) {
        let rand = min + Math.random() * (max + 1 - min);
        return Math.floor(rand);
    }

    constructor({ size = 900, randomize = false, lifeChance = 40 }) {
        this.height = size;
        this.width = size;
        this.cellWidth = 4;
        this.cellHeight = 4;
        this.main = [];
        this.side = [];
        this.cells = [];
        this.canvas = document.querySelector('canvas');
        this.context = this.canvas.getContext('2d')
        this.timer = null;
        this.lifeChance = lifeChance;
        this.init(randomize);
    }

    init(randomize) {
        this.canvas.width = this.width
        this.canvas.height = this.height
        for (let top = 0; top < this.width; top += this.cellWidth) {
            for (let left = 0; left < this.height; left += this.cellHeight) {
                this.cells.push(new Cell(top, left))
            }
        }
        for (let i = 0; i < this.cells.length; i++) {
            this.main.push(randomize ? this.randomCell() : false);
        }
    }

    render() {
        this.main.forEach((_, i) => {
            if (_) this.cells[i].fill(this.cellWidth, this.cellHeight, this.context, true)
            else this.cells[i].fill(this.cellWidth, this.cellHeight, this.context, false)
        });
    }

    randomCell() {
        return Life.randomInteger(0, 100) > this.lifeChance ? true : false
    }

    isAlive(cell) {
        if (cell) return true;
        return false;
    }

    lifeCycle() {
        this.main.forEach((_, i) => {
            const matrix = [ // матрица соседей вогруг текущей точки
                i - ((this.width / this.cellWidth) + 1),
                i - (this.width / this.cellWidth),
                i - ((this.width / this.cellWidth) - 1),
                i - 1,
                i + 1,
                i + ((this.width / this.cellWidth) - 1),
                i + (this.width / this.cellWidth),
                i + ((this.width / this.cellWidth) + 1)
            ]
            
            if (this.isAlive(_)) {
                const isDead = [];
                matrix.forEach(__ => {
                    if (this.isAlive(this.main[__])) isDead.push(true);
                });
                if (isDead.length > 3 || isDead.length < 2) this.side.push(false);
                else this.side.push(true)
            } else {
                const isBirth = [];
                matrix.forEach(__ => {
                    if (this.isAlive(this.main[__])) isBirth.push(true);
                });
                if (isBirth.length > 2 && isBirth.length < 4) this.side.push(true);
                else this.side.push(false)
            }
        });
        this.main = this.side;
        this.side = [];
        this.render();
    }

    start () {
        this.timer = setInterval(() => {
            this.lifeCycle();
        }, 100);
    }

    stop () {
        clearInterval(this.timer);
    }

    step () {
        this.lifeCycle();
    }
}

class LifeInterface {
    constructor () {
        this.life = null;
    }

    chanchangeInfo (val, name) {
        this[name] = val;
    }

    newLife () {
        if (this.life) return alert('жизнь уже здесь')
        this.life = new Life({
            size: this.size,
            randomize: this.randomize || true,
            lifeChance: this.randomize
        });
    }

    menu (name) {
        if (!this.life) return alert('нет жизни(');
        this.life[name]();
    }

    update () {
        if (!this.life) return alert('нет жизни(');
        this.life = null;
        // this.newLife();
    }
}

let life = null;

document.addEventListener("DOMContentLoaded", () => {
    life = new LifeInterface ();
});