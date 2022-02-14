class RandomRulesGen {
    constructor() {
        this.rules = {};
    }
    addRule(direction, color) {
        if (Object.keys(this.rules).length === 0) {
            this.rules['#fff'] = {
                direction: direction || this.randomdirection(),
                track: undefined
            };
        } else if (Object.keys(this.rules).length === 1) {
            const prevName = Object.keys(this.rules)[0];
            const curentColor = color || this.randomUnicColor();
            this.rules[curentColor] = {
                direction: direction || this.randomdirection(),
                track: prevName
            }
            this.rules[prevName].track = curentColor;
        } else {
            const prevName = Object.keys(this.rules)[Object.keys(this.rules).length - 1];
            const firstName = Object.keys(this.rules)[0];
            const curentColor = color || this.randomUnicColor();
            this.rules[prevName].track = curentColor;
            this.rules[curentColor] = {
                direction: direction || this.randomdirection(),
                track: firstName
            }
        }
    }
    randomColor() {
        const
            r = Math.floor(Math.random() * (256)),
            g = Math.floor(Math.random() * (256)),
            b = Math.floor(Math.random() * (256));
        return `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
    }
    randomUnicColor() {
        const color = this.randomColor();
        if (this.rules.hasOwnProperty(color)) return this.randomUnicColor();
        return color;
    }
    randomdirection() {
        return Math.random() < 0.5 ? "right" : "left";
    }
}

const directionMap = {
    up: {
        left: 'left',
        right: 'right'
    },
    down: {
        left: 'right',
        right: 'left'
    },
    left: {
        left: 'down',
        right: 'up'
    },
    right: {
        left: 'up',
        right: 'down'
    }
};

class Cell {
    constructor(top, left) {
        this.top = top;
        this.left = left;
        this.color = '#fff';
    }

    thisColor() {
        return this.color;
    }

    fill(cellWidth, cellHeight, context, color, name) {
        context.fillStyle = color;
        context.fillRect(this.top, this.left, cellWidth, cellHeight);
        this.color = name;
    }
}

class rule {
    constructor (options) {
        this.color = options.color;
        this.direction = options.direction;
        this.trackColor = options.trackColor;
    }
}

class Ant {
    static randomInteger(min, max) {
        let rand = min + Math.random() * (max + 1 - min);
        return Math.floor(rand);
    }

    constructor(size, rules, format, spead) {
        this.height = size;
        this.width = size;
        if (format === 'makro') {
            this.cellWidth = 1;
            this.cellHeight = 1;
        } else {
            this.cellWidth = 4;
            this.cellHeight = 4;
        }
        this.cells = [];
        this.rules = rules;
        this.canvas = document.querySelector('canvas');
        this.context = this.canvas.getContext('2d');
        this.timer = null;
        this.ant = {};
        this.format = format;
        this.spead =spead;
        this.init();
    }

    init() {
        if (!this.rules) {
            const rulesGen = new RandomRulesGen();
            for (let i = 0; i < Ant.randomInteger(1,20); i++) {
                rulesGen.addRule();
            }
            this.rules = rulesGen.rules;
        }
        for (let top = 0; top < this.width; top += this.cellWidth) {
            for (let left = 0; left < this.height; left += this.cellHeight) {
                this.cells.push(new Cell(top, left));
            }
        }
        if (this.format === 'makro') {
            this.ant = {
                position: Math.floor(this.cells.length / 2) + 40000,
                curentColor: '#fff',
                direction: 'up'
            }
        } else {
            this.ant = {
                position: Math.floor(this.cells.length / 2),
                curentColor: '#fff',
                direction: 'up'
            }
        }
    }

    lifeCycle() {
        this.ant.direction = directionMap[this.ant.direction][this.rules[this.ant.curentColor].direction];
        switch (this.ant.direction) {
            case 'up':
                this.ant.position = this.ant.position + Math.floor(this.width / this.cellWidth);
                break;
            case 'down':
                    this.ant.position = this.ant.position - Math.floor(this.width / this.cellWidth);
                    break;
            case 'left':
                    this.ant.position = this.ant.position - 1;
                    break;
            case 'right':
                    this.ant.position = this.ant.position + 1;
                    break;
        }
        let temp = this.ant.position;
        if (temp > this.cells.length - 1) this.ant.position = 0;
        if (temp < 0) this.ant.position = this.cells.length - 1;
        this.ant.curentColor = this.cells[this.ant.position].thisColor();
        this.cells[this.ant.position].fill(this.cellWidth, this.cellHeight, this.context, this.rules[this.ant.curentColor].track, this.rules[this.ant.curentColor].track);
    }

    start () {
        this.timer = setInterval(() => {
            this.lifeCycle();
        }, this.spead);
    }

    stop () {
        clearInterval(this.timer);
    }

    step () {
        this.lifeCycle();
    }

    sheetPants () {
        this.cells[this.ant.position].fill(this.cellWidth, this.cellHeight, this.context, true);
    }
    unSheetPants () {
        this.cells[this.ant.position].fill(this.cellWidth, this.cellHeight, this.context, false);
    }
}

let ant = null;
let format = 'makro';
let spead = 1;
let mode = "WEB";
ant = new Ant (900, false, format, spead);
// ant = new Ant (900, {
//     '#000': {
//         direction: 'right',
//         track: '#fff',
//     },
//     '#fff': {
//         direction: 'right',
//         track: '#fff600',
//     },
//     '#fff600': {
//         direction: 'left',
//         track: '#800000',
//     },
//     '#800000': {
//         direction: 'left',
//         track: '#0000FF',
//     },
//     '#0000FF': {
//         direction: 'left',
//         track: '#808080',
//     },
//     '#808080': {
//         direction: 'right',
//         track: '#00FF00',
//     },
//     '#00FF00': {
//         direction: 'left',
//         track: '#964B00',
//     },
//     '#964B00': {
//         direction: 'right',
//         track: '#800080',
//     },
//     '#800080': {
//         direction: 'left',
//         track: '#000',
//     },
// }, format, spead);

ant.start();

// function start () {
//     if (mode === "WEB") {
//         ant = new Ant (
//             900,
            // {
            //     '#000': {
            //         direction: 'right',
            //         track: '#fff',
            //     },
            //     '#fff': {
            //         direction: 'left',
            //         track: '#fff600',
            //     },
            //     '#fff600': {
            //         direction: 'right',
            //         track: '#800000',
            //     },
            //     '#800000': {
            //         direction: 'right',
            //         track: '#0000FF',
            //     },
            //     '#0000FF': {
            //         direction: 'right',
            //         track: '#808080',
            //     },
            //     '#808080': {
            //         direction: 'right',
            //         track: '#00FF00',
            //     },
            //     '#00FF00': {
            //         direction: 'left',
            //         track: '#964B00',
            //     },
            //     '#964B00': {
            //         direction: 'left',
            //         track: '#800080',
            //     },
            //     '#800080': {
            //         direction: 'left',
            //         track: '#ffc0cb',
            //     },
            //     '#ffc0cb': {
            //         direction: 'right',
            //         track: '#808000',
            //     },
            //     '#808000': {
            //         direction: 'right',
            //         track: '#000',
            //     },
            // },
//             format, spead
//         );
//     } else {
//         ant = new Ant (900, false, format, spead);
//     }
// }