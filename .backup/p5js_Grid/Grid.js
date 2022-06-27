// By Leizingyiu
// https://github.com/leizingyiu/p5js_Grid
// https://www.leizingyiu.net/?lang=en
// https://twitter.com/leizingyiu
// https://openprocessing.org/sketch/1435333

// Last modified: "2022/06/09 17:15:05"

class Grid {
    constructor(l = 0, t = 0,
        w = window.innerWidth, h = window.innerHeight,
        row = Math.floor(window.innerHeight / 80),
        col = Math.floor(window.innerWidth / 80),
        margin = 0, spacing = 0,
        drawing = window) {

        if (arguments.length == 1 && arguments[0] instanceof Object) {
            let settings = arguments[0];
            ['left', 'top', 'width', 'height'].map((key, idx) => {
                let shortKeys = ['l', 't', 'w', 'h'];
                if (key in settings) {
                    settings[shortKeys[idx]] = settings[key];
                }
            });
            const defaultSettings = {
                l: 0, t: 0, w: window.innerWidth, h: window.innerHeight,
                row: Math.floor(window.innerHeight / 80), col: Math.floor(window.innerWidth / 80),
                margin: 0, spacing: 0, drawing: window
            };
            Object.keys(defaultSettings).map(key => {
                if (!(key in settings)) {
                    settings[key] = defaultSettings[key];
                }
            });

            this.init(...['l', 't', 'w', 'h', 'row', 'col', 'margin', 'spacing'].map(k => settings[k]));
            this.drawing = settings.drawing;
        } else {
            this.init(l, t, w, h, row, col, margin, spacing);
            this.drawing = drawing;
        }
        this.version = '0.0.1';

    }

    init(l = this.l, t = this.t, w = this.w, h = this.h,
        row = this.row, col = this.col,
        margin = this.margin, spacing = this.spacing) {

        this.l = l, this.t = t, this.w = w, this.h = h;
        this.row = row, this.col = col;
        this.margin = margin, this.spacing = spacing;

        this.cellW = ((w - margin * 2) - (col - 1) * spacing) / col;
        this.cellH = ((h - margin * 2) - (row - 1) * spacing) / row;
        this.grid = {};

        this.#initGrid();
    }

    #initGrid() {
        try {
            this.rectmode = this.drawing.rectMode()._curElement._rectMode;
        } catch (err) {
            try {
                this.rectmode = rectMode()._curElement._rectMode;
            } catch (err) {
                this.rectmode = undefined;
            }
        }
        for (let i = 0; i < this.row; i++) {
            this.grid[i] = {};
            for (let j = 0; j < this.col; j++) {
                this.grid[i][j] = {
                    "row": i,
                    "col": j,
                    "l": this.l + this.margin + j * this.cellW + (j == 0 ? 0 : (j) * this.spacing),
                    "t": this.t + this.margin + i * this.cellH + (i == 0 ? 0 : (i) * this.spacing),
                    "w": this.cellW,
                    "h": this.cellH
                };
                switch (this.rectmode) {
                    case CENTER:
                    case RADIUS:
                        this.grid[i][j].x = this.grid[i][j].l + this.grid[i][j].w / 2,
                            this.grid[i][j].y = this.grid[i][j].t + this.grid[i][j].h / 2;
                        break;
                    default:
                        this.grid[i][j].x = this.grid[i][j].l,
                            this.grid[i][j].y = this.grid[i][j].t;
                }

            }
        }
    }


    drawCell() {
        this.drawing.push();
        this.drawing.rectMode(CORNER);
        for (let r in this.grid) {
            for (let c in this.grid[r]) {
                let g = this.grid[r][c];
                this.drawing.rect(g.l, g.t, g.w, g.h);
            }
        }
        this.drawing.pop();
    }
    drawRefLine() {
        this.drawing.push();
        // rect(this.l, this.t, this.w, this.h);

        for (let r in this.grid) {
            let g = this.grid[r][0];
            this.drawing.line(g.l, g.t, this.l + this.w - this.margin, g.t);
            this.drawing.line(g.l, g.t + g.h, this.l + this.w - this.margin, g.t + g.h);

        }
        for (let c in this.grid[0]) {
            let g = this.grid[0][c];
            this.drawing.line(g.l, g.t, g.l, this.t + this.h - this.margin);
            this.drawing.line(g.l + g.w, g.t, g.l + g.w, this.t + this.h - this.margin);

        }
        this.drawing.pop();
    }
    cellArgs(rowIdx, colIdx, cols = 1, rows = 1, mode = this.rectMode) {

        let g = this.grid[colIdx][rowIdx];
        let l = g.l,
            t = g.t,
            x = g.x,
            y = g.y,
            w = cols * this.cellW + (cols - 1) * this.spacing,
            h = rows * this.cellH + (rows - 1) * this.spacing;
        switch (mode) {
            case "corners":
                return [l, t, l + w, t + h];
                break;

            case "center":
                return [l + w / 2, t + h / 2, w, h];
                break;

            case "radius":
                return [l + w / 2, t + h / 2, w / 2, h / 2];
                break;
            case "corner":
            default:
                return [l, t, w, h];
                break;
        }
    }

    cellArgsObj(rowIdx, colIdx, cols = 1, rows = 1, mode = this.rectMode) {
        let args = [...arguments];
        let cellArgsResult = this.cellArgs(...args);
        let x1, x2, y1, y2,
            x, y, w, h, rw, rh, width, height,
            l, t, r, b,
            left, top, right, bottom,
            centerX, centerY, halfWidth, halfHeight;
        switch (mode) {
            case "corners":
                [x1, y1, x2, y2] = cellArgsResult,
                    [l, t, r, b] = cellArgsResult,
                    [left, top, right, bottom] = cellArgsResult;
                return {
                    x1: x1, y1: y1, x2: x2, y2: y2,
                    l: l, t: t, r: r, b: b,
                    left: left, top: top, right: right, bottom: bottom
                };
                break;

            case "center":
                [x, y, w, h] = cellArgsResult,
                    [centerX, centerY, width, height] = cellArgsResult;
                return {
                    x: x, y: y, w: w, h: h,
                    centerX: centerX, centerY: centerY,
                    width: width, height: height
                };
                break;

            case "radius":
                [x, y, rw, rh] = cellArgsResult,
                    [centerX, centerY, halfWidth, halfHeight] = cellArgsResult;
                return {
                    x: x, y: y, rw: rw, rh: rh,
                    centerX: centerX, centerY: centerY,
                    halfWidth: halfWidth, halfHeight: halfHeight
                };
                break;
            case "corner":
            default:
                [l, t, w, h] = cellArgsResult,
                    [left, top, width, height] = cellArgsResult;
                return {
                    l: l, t: t, w: w, h: h,
                    left: left, top: top, width: width, height: height
                };
                break;
        }
    }

    text(str, rowIdx, colIdx, cols = 1, rows = 1) {
        let rectmode = typeof this.rectmode != 'undefined' ? this.rectmode : this.drawing.rectMode()._curElement._rectMode;
        this.drawing.text(str, ...this.cellArgs(rowIdx, colIdx, cols, rows, rectmode));
    }
    rect(rowIdx, colIdx, cols = 1, rows = 1) {
        let rectmode = typeof this.rectmode != 'undefined' ? this.rectmode : this.drawing.rectMode()._curElement._rectMode;
        this.drawing.rect(...this.cellArgs(rowIdx, colIdx, cols, rows, rectmode));
    }
    ellipse(rowIdx, colIdx, cols = 1, rows = 1) {
        let mode = typeof this.rectmode != 'undefined' ? this.rectmode : this.drawing.ellipseMode()._curElement._ellipseMode;
        this.drawing.ellipse(...this.cellArgs(rowIdx, colIdx, cols, rows, mode));
    }
    line(rowIdx, colIdx, rowIdx2, colIdx2,) {
        let mode = typeof this.rectmode != 'undefined' ? this.rectmode : this.drawing.ellipseMode()._curElement._ellipseMode;
        let [x1, y1, w1, h1] = [...grid.cellArgs(rowIdx, colIdx, 1, 1)];
        let [x2, y2, w2, h2] = [...grid.cellArgs(rowIdx2, colIdx2, 1, 1)];
        this.drawing.line(x1, y1, x2, y2);
    }
    rectMode(recemode) {
        push();
        this.drawing.receMode(recemode);
        this.initGrid();
        pop();
    }
    drawOn(target = window) {
        try {
            target.push();
            target.fill(0);
            target.stroke(0);
            target.pop();
            this.drawing = target;
        } catch (err) {
            console.error('drawOn() need a canvas or graphic from p5js');
            throw (err);
        }
    }
}