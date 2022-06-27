// userAgent
const ua = navigator.userAgent,
    isWindowsPhone = /(?:Windows Phone)/.test(ua),
    isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone,
    isAndroid = /(?:Android)/.test(ua),
    isFireFox = /(?:Firefox)/.test(ua),
    isChrome = /(?:Chrome|CriOS)/.test(ua),
    isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tablet)/.test(ua)),
    isPhone = /(?:iPhone)/.test(ua) && !isTablet,
    // isIOS = /(iOS|iPad|iPhone)/.test(ua) || ua.indexOf('Macintosh') > -1,
    isIOS = false,
    isPc = !isPhone && !isAndroid && !isSymbian;

let canvas, bgColor = "#000";
let font, str = `some p5js pratice`;
let globalMargin = 24,
    globalSpace = 8;
let gridRowMin = 11,
    gridRowMax = 24,
    gridColMin = 15,
    gridColMax = 32;
if (!isPc) {
    let temp = gridRowMin;
    gridRowMin = Math.ceil(gridColMin / 2), gridColMin = Math.ceil(temp / 2);
    temp = gridRowMax;
    gridRowMax = Math.ceil(gridColMax / 4), gridColMax = Math.ceil(temp / 4);


    globalMargin = 8, globalSpace = 2;
}

const workNames = ['grid', 'LRC', 'p5js ctrler', 'fx Visualizer', 'keyboard Ctrl', 'Canyon', 'Perspective Grid'];
let works = {};
let worksOptions = {};
const workRefreshNoiseBaseX = 6400 / 2,
    workRefreshNoiseBaseY = 12800 / 2;
const noisePowK = 0.2;

let engine, gravity;
const {
    Engine,
    Bodies,
    Bounds,
    Events,
    World,
    Vertices,
    Mouse,
    MouseConstraint,
    Common,
    Runner
} = Matter;
let cnt = [],
    boundaries = [],
    posArr = [];

var gravityX = 0,
    gravityY = 0;

const boundariesThickness = 60;
const boundariesOption = {
    friction: 0,
    restitution: 0.95,
    isStatic: true,
    fillColor: 'rgba(0,0,0,0)',
    strokeColor: 'rgba(255,255,255,0.04)',
    strokeweight: 1
};
const matterLetterOption = {
    ooption: {
        restitution: 0.95,
        render: {
            fillStyle: '#999',
            strokeStyle: "#aaa",
            lineWidth: 0
        }
    },
    flagInternal: true,
    removeCollinear: 0.01,
    minimumArea: 1
}


var layouts, layoutType = 'splitWordGrid' //"gridFillCeil"
let OPC;
let grid;

// updateLayout = () => {
//     console.log('update layout')
//     layout.init(str = str, font = font,
//         layoutMargin, layoutPadding, layoutSpacing,
//         ...grid.cellArgs( layoutGridRow, layoutGridCol, layoutGridW, layoutGridH,CORNER));
//     layout[layoutType]();
// };
updateGrid = _ => {
    grid.init(0, 0, width, height, gridRow, gridCol, gridMargin, gridSpacing);
};
updateContent = _ => {
    updateGrid();
    updateLayout();
}






class Boundary {
    constructor(x, y, w, h, a, friction = 0, restitution = 0.95, isStatic = true, fillColor = 0, strokeColor = 0, strokeweight = 1) {
        let options = {
            friction: friction,
            restitution: restitution,
            angle: a,
            isStatic: isStatic
        };
        this.body = Bodies.rectangle(x, y, w, h, options);
        this.w = w;
        this.h = h;
        World.add(world, this.body);

        this.fillColor = fillColor, this.strokeColor = strokeColor,
            this.strokeweight = strokeweight;
        //console.log(this.body);

        this.showRect = false, this.showVert = false;

        this.show = this.show.bind(this);
    }

    show() {
        let pos = this.body.position;
        let angle = this.body.angle;
        push();
        translate(pos.x, pos.y);
        rotate(angle);
        rectMode(CENTER);
        if (this.strokeweight == 0) {
            noStroke();
        } else {
            strokeWeight(this.strokeweight);
            stroke(this.strokeColor);
        }
        fill(this.fillColor);
        rect(0, 0, this.w, this.h);
        pop();
    };
}

class Letter {
    constructor(str, x, y,
        font, fontsize,
        sampleFector = 0.5, simplifyThreshold = 0.1, strokeweight = 1, strokecolor = 255, fillcolor = 255,
        matterOption = {
            ooption: {
                render: {
                    fillStyle: '#999',
                    strokeStyle: "#aaa",
                    lineWidth: 0
                }
            },
            flagInternal: true,
            removeCollinear: 0.01,
            minimumArea: 1
        }) {
        this.str = str, this._x = x, this._y = y,
            this.x = x, this.y = y,
            this.font = font, this.fontsize = fontsize,
            this.strokeweight = strokeweight, this.strokecolor = strokecolor, this.fillcolor = fillcolor;
        textSize(this.fontsize);
        this.bound = this.font.textBounds(this.str, 0, 0);
        let letterPoints = font.textToPoints(this.str, 0, 0, this.fontsize, {
            sampleFactor: sampleFector,
            simplifyThreshold: simplifyThreshold
        });

        let letterPointsVert = letterPoints.map(v => [v.x, v.y].map(i => Math.round(i)).join(',')).join(',').replace(/,/g, ' ');
        let vert = Vertices.fromPath(letterPointsVert);

        this.body = Bodies.fromVertices(this._x, this._y,
            vert,
            ...Object.values(matterOption));

        // if (this.body == null) { return }

        // console.log('str ', str, '\nvert', vert, '\nWorld', World, '\nworld', world, '\nthis.body', this.body, '\nBodies.fromVertices', Bodies.fromVertices);
        // debugger;
        World.add(world, this.body);
        this.showRect = false, this.showVert = false;

        this.show = this.show.bind(this);
    }
    show() {

        let pos = this.body.position;
        let angle = this.body.angle;
        if (this.showVert == true) {
            push();
            fill(0);
            beginShape()
            for (let vert of this.body.vertices) {
                vertex(vert.x, vert.y);
            }
            endShape()
            pop();
        }

        push();
        translate(pos.x, pos.y);
        rotate(angle);
        translate(-this.bound.w / 2, this.bound.h / 2);


        if (this.strokeweight == 0) {
            noStroke();
        } else {
            strokeWeight(this.strokeweight);
            stroke(this.strokecolor);
        }

        if (this.showRect == true) {
            push()
            fill(0);
            rectMode(CORNER);
            rect(0, -this.bound.h, this.bound.w, this.bound.h);
            pop();
        }
        rectMode(CENTER);

        fill(this.fillcolor);

        textAlign(LEFT, BASELINE);
        textFont(this.font);
        textSize(this.fontsize);
        text(this.str, 0, 0);

        pop();
    }
}

class LetterTextPoints {
    constructor(points, str, x, y,
        font, fontsize,
        sampleFector = 0.5, simplifyThreshold = 0.1, strokeweight = 1, strokecolor = 255, fillcolor = 255,
        matterOption = {
            ooption: {
                render: {
                    fillStyle: '#999',
                    strokeStyle: "#aaa",
                    lineWidth: 0
                }
            },
            flagInternal: true,
            removeCollinear: 0.01,
            minimumArea: 1
        }) {
        this.points = points, this.str = str, this._x = x, this._y = y,
            this.x = x, this.y = y,
            this.font = font, this.fontsize = fontsize,
            this.strokeweight = strokeweight, this.strokecolor = strokecolor, this.fillcolor = fillcolor;
        textSize(this.fontsize);

        this.bound = this.font.textBounds(this.str, 0, 0);
        let letterPoints = font.textToPoints(this.str, 0, 0, this.fontsize, {
            sampleFactor: sampleFector,
            simplifyThreshold: simplifyThreshold
        });

        // let letterPointsVert = letterPoints.map(v => [v.x, v.y].map(i => Math.round(i)).join(',')).join(',').replace(/,/g, ' ');
        let letterPointsVert = this.points.map(v => [v.x, v.y].map(i => Math.round(i)).join(',')).join(',').replace(/,/g, ' ');
        let vert = Vertices.fromPath(letterPointsVert);

        this._body = Bodies.fromVertices(Math.floor(this._x), Math.floor(this._y),
            vert,
            ...Object.values(matterOption));
        // console.log(str, Bodies.fromVertices, Math.floor(this._x), Math.floor(this._y),
        //     vert,
        //     ...Object.values(matterOption), this._body);
        this.scale = (this._body.bounds.max.x - this._body.bounds.min.x) / this.bound.w;
        this.offset = [this.bound.x, -this.bound.y].map(i => i * this.scale / 2);
        // if (this.body == null) { return }

        // console.log('str ', str, '\nvert', vert, '\nWorld', World, '\nworld', world, '\nthis.body', this.body, '\nBodies.fromVertices', Bodies.fromVertices);
        // debugger;
        World.add(world, this._body);
        this.showRect = false, this.showVert = false;

        this.show = this.show.bind(this);
    }
    show() {

        let pos = this._body.position;
        let angle = this._body.angle;
        if (this.showVert == true) {
            push();
            fill(0);
            beginShape()
            for (let vert of this._body.vertices) {
                vertex(vert.x, vert.y);
            }
            endShape()
            pop();
        }

        push();
        translate(pos.x, pos.y);
        rotate(angle);
        translate(-this.bound.w / 2, this.bound.h / 2);


        if (this.strokeweight == 0) {
            noStroke();
        } else {
            strokeWeight(this.strokeweight);
            stroke(this.strokecolor);
        }

        if (this.showRect == true) {
            push()
            fill(0);
            rectMode(CORNER);
            rect(0, -this.bound.h, this.bound.w, this.bound.h);
            pop();
        }
        rectMode(CENTER);

        fill(this.fillcolor);

        textAlign(LEFT, BASELINE);
        textFont(this.font);
        translate(...this.offset);
        textSize(this.fontsize * this.scale);
        text(this.str, 0, 0);

        pop();
    }
}

function preload() {
    font = loadFont('../font/Xhers Regular.otf');
    titleFont = loadFont('../font/Xhers Regular.otf');
    fontOfText = loadFont('../font/NimbusSanL-Reg.otf');
}

function setup() {
    if (isIOS == true) {
        canvas = createCanvas(windowWidth, windowHeight);
    } else {
        canvas = createCanvas(windowWidth, windowHeight, WEBGL);
    }
    // canvas.mousePressed = function () { return false }
    background(0);

    { //PC setting
        pc = new PC({
            autoHideBoo: true,
            latency_for_loading_local_data: 0,
            displayBoo: false
        });

        let gS; { //pc.group('gridSettings');
            gS = pc.group('gridSettings');
            gS.slider('gridRow', 24, 1, 32, 1, () => {
                console.log(Layouts_h, gridRow, Math.max(Layouts_h, gridRow - 1));

                pc.range('Layouts_col', 0, Math.max(Layouts_col, gridRow - 1));
                pc.range('Layouts_h', 0, Math.max(Layouts_h, gridRow));
                updateContent();
            });
            gS.slider('gridCol', 17, 1, 18, 1, () => {
                pc.range('Layouts_row', 0, Math.max(Layouts_row, gridCol - 1));
                pc.range('Layouts_w', 0, Math.max(Layouts_w, gridCol));
                updateContent();
            });
            gS.slider('gridMargin', 24, 1, 200, 1, updateContent);
            gS.slider('gridSpacing', 6, 1, 100, 1, updateContent);
            gS.checkbox('gridDisplay', true, ['visiable', 'hide']);
            gS.color('gridStrokeColor');
        }

        gridRow = Math.floor(Math.random() * Math.abs(gridRowMax - gridRowMin)) + Math.min(gridRowMin, gridRowMax),
            gridCol = Math.floor(Math.random() * Math.abs(gridColMax - gridColMin)) + Math.min(gridColMin, gridColMax),
            gridMargin = globalMargin,
            gridSpacing = globalSpace;
        pc.stick('bottom');
        pc.mainContainer.elt.classList.add('fold');

    }

    // grid and layout setting 
    push();
    grid = new Grid(0, 0, width, height, gridRow, gridCol, gridMargin, gridSpacing);

    const layoutGroup = pc.group('Layout_settings');

    rectMode(CORNER);
    // layout = new Layout(
    //     str = str, font = font,
    //     layoutMargin, layoutPadding, layoutSpacing,
    //     ...grid.cellArgs( layoutGridRow, layoutGridCol, layoutGridW, layoutGridH,CORNER));
    // layout[layoutType]();

    L = new Layouts(grid, layoutGroup);
    title = L.add('title', 'things i made with p5js', {
        font: titleFont,
        margin: 10,
        padding: 2,
        spacing: 30,
        blendMode: 'exclusion',
        strokeWeight: 8,
        stroke: 'rgb(29,31,32)',
        fillCell: 'none'
    }).griding(0, 0, Math.min(Math.max(Math.floor(gridCol / 2), 5), gridCol), gridRow);
    span = L.add('span', `some tools, some testing, some visualizations`, {
        font: titleFont,
        margin: 10,
        padding: 2,
        spacing: 30,
        blendMode: 'exclusion',
        strokeWeight: 0,
        stroke: 'rgb(29,31,32)',
        fillCell: 'none'
    }).griding(
        Math.floor(gridRow / 2), Math.min(Math.max(Math.floor(gridCol / 2))),
        gridCol - Math.min(Math.max(Math.floor(gridCol / 2), 5), Math.floor(gridRow / 2)),
        Math.floor(gridRow / 2));


    let fpsStr = frameRate().toFixed(2) + ua;
    fps = new Layout(fpsStr, {
        font: titleFont,
        margin: globalMargin, padding: 0, spacing: Math.min(width, height) / 80,
        left: 0, top: 0, w: width, h: height
    });


    // let poGrid = grid.grid[1][1];
    // let pos = [poGrid.x, poGrid.y, poGrid.w, poGrid.h];

    // works = new Layout(workNames[0], titleFont,
    //     margin = globalMargin, padding = 0, spacing = width / 20,
    //     ...pos
    // );
    workNames.map((n, idx) => {
        worksOptions[n] = {
            'id': idx,
            'text': n,
            'd': Math.round(Math.max(...n.split(' ').map(i => i.length)) / (grid.cellW / grid.cellH) / 2),
            'l': n.split(' ').length
        };
    });

    workNames.map(n => {
        let r, c,
            nr = noise(frameCount / workRefreshNoiseBaseX, worksOptions[n].id),
            nc = noise(-frameCount / workRefreshNoiseBaseY, worksOptions[n].d);
        nr = (Math.sin(nr * Math.PI * 2) + 1) / 2;
        nc = (Math.sin(nc * Math.PI * 2) + 1) / 2;
        r = Math.floor(nr * grid.row);
        c = Math.floor(nc * grid.col);
        worksOptions[n].r = r, worksOptions[n].c = c;

        let poGrid = grid.grid[worksOptions[n].r][worksOptions[n].c];

        worksOptions[n].x = Math.floor(poGrid.x - worksOptions[n].d / 2);
        worksOptions[n].y = poGrid.y;
        worksOptions[n].w = poGrid.w * worksOptions[n].d;
        worksOptions[n].h = poGrid.h * worksOptions[n].l;

        let pos = [worksOptions[n].x, worksOptions[n].y,
        worksOptions[n].w, worksOptions[n].h
        ];
        pos = pos.map(i => Math.floor(Math.abs(i) * 100) / 100);
        works[n] = new Layout(n, {
            font: titleFont,
            margin: 0, padding: 0, spacing: Math.min(width, height) / 80,
            left: pos[0], top: pos[1], width: pos[2], height: pos[3],
            l: pos[0], t: pos[1], w: pos[2], h: pos[3],
        }
        );
    });
    console.log(worksOptions, works);

    pop();

    { // matterjs settings
        engine = Engine.create({
            enableSleeping: true
        });
        world = engine.world;
        runner = Runner.create();
        Runner.run(runner, engine);

        boundaries.push(new Boundary(width / 2, height, width, boundariesThickness, 0,
            ...Object.values(boundariesOption)
        ));
        boundaries.push(new Boundary(width / 2, 0, width, boundariesThickness, 0,
            ...Object.values(boundariesOption)
        ));
        boundaries.push(new Boundary(0, height / 2, boundariesThickness, height, 0,
            ...Object.values(boundariesOption)
        ));
        boundaries.push(new Boundary(width, height / 2, boundariesThickness, height, 0,
            ...Object.values(boundariesOption)
        ));


        Object.keys(L.layouts).map(k => {
            let points = L.layouts[k].layout.textToPoints({
                sampleFactor: 0.2,
                simplifyThreshold: 0.1
            });
            for (let i = 0, ii = L.layouts[k].layout.letterPosArr.length; i < ii; i++) {
                if (L.layouts[k].layout.letterPosArr[i].letter == ' ') {
                    continue
                };
                let x = L.layouts[k].layout.letterPosArr[i].x,
                    y = L.layouts[k].layout.letterPosArr[i].y;
                cnt.push(new LetterTextPoints(points[i], L.layouts[k].layout.letterPosArr[i].letter, x, y, titleFont, L.layouts[k].layout.fontsize));
            }
        })
        // let points = layout.textToPoints({
        //     sampleFactor: 0.2,
        //     simplifyThreshold: 0.1
        // });
        // for (let i = 0, ii = layout.letterPosArr.length; i < ii; i++) {
        //     if (layout.letterPosArr[i].letter == ' ') { continue };
        //     let x = layout.letterPosArr[i].x,
        //         y = layout.letterPosArr[i].y;
        //     cnt.push(new LetterTextPoints(points[i], layout.letterPosArr[i].letter, x, y, font, layout.fontsize));
        // }

        //add mouse ctrl
        mouse = Mouse.create(document.body),
            mouseConstraint = MouseConstraint.create(engine, {
                mouse: mouse,
                constraint: {
                    stiffness: 0.36
                }
            });

        World.add(engine.world, [mouseConstraint]);

        // add gyro control
        if (typeof window.orientation !== 'undefined') {
            // if (typeof window !== 'undefined') {
            var updateGravity = function (event) {
                var orientation = typeof window.orientation !== 'undefined' ? window.orientation : 0;

                gravity = engine.gravity;
                gravity.x = 0;
                gravity.y = 0;

                if (orientation === 0) {
                    gravity.x = Common.clamp(event.gamma, -90, 90) / 90;
                    gravity.y = Common.clamp(event.beta, -90, 90) / 90;
                } else if (orientation === 180) {
                    gravity.x = Common.clamp(event.gamma, -90, 90) / 90;
                    gravity.y = Common.clamp(-event.beta, -90, 90) / 90;
                } else if (orientation === 90) {
                    gravity.x = Common.clamp(event.beta, -90, 90) / 90;
                    gravity.y = Common.clamp(-event.gamma, -90, 90) / 90;
                } else if (orientation === -90) {
                    gravity.x = Common.clamp(-event.beta, -90, 90) / 90;
                    gravity.y = Common.clamp(event.gamma, -90, 90) / 90;
                }
            };
            window.addEventListener('deviceorientation', updateGravity);
            // }
        } else {
            gravity = engine.gravity;
            gravity.x = 0;
            gravity.y = 0.16;

            mouseWheel = (e) => {
                gravity = engine.gravity;
                gravityY -= e.deltaY / 1000;
                gravityY = Math.min(Math.max(-1, gravityY), 1);
                gravity = engine.gravity;
                gravity.x = gravityX;
                gravity.y = gravityY;
            }

        }
    }

}

function draw() {

    if (isPc == true) {
        gravity = engine.gravity;
        gravityY += (noise(frameCount / 40) - 0.5) / 48 * (Math.abs(gravityY) > 0.24 ? -1 : 1);
        gravityX += (noise(-frameCount / 36) - 0.5) / 64 * (Math.abs(gravityX) > 0.24 ? -1 : 1);
        gravityY = Math.min(Math.max(-1, gravityY), 1);
        gravity = engine.gravity;
        gravity.x = gravityX;
        gravity.y = gravityY;
    }



    // workNames.map(n => {
    //     workNames.map(m => {
    //         if (n == m) { return }
    //         let a = worksOptions[n], b = worksOptions[m];
    //         let ac = a.c, bx = b.c, ar = a.r, br = b.r;
    //         if (a.c + a.d > grid.col) {
    //             a.c -= 1;
    //         }
    //         a.c = Math.max(0, a.c);
    //         if (a.c > b.c && a.c < b.c + b.d) {
    //             a.c += a.id % 2 == 1 ? 1 : -1;
    //             b.c += a.id % 2 == 0 ? 1 : -1;
    //         }

    //         if (a.r + a.h > grid.row) {
    //             a.r -= 1;
    //         }
    //         a.r = Math.max(0, a.r);
    //         if (a.r > b.r && a.r < b.r + b.h) {
    //             a.r += a.id % 2 == 1 ? 1 : -1;
    //             b.r += a.id % 2 == 0 ? 1 : -1;
    //         }

    //         a.c = Math.max(Math.min(a.c, grid.col), 0);
    //         b.c = Math.max(Math.min(b.c, grid.col), 0);
    //         a.r = Math.max(Math.min(a.r, grid.row), 0);
    //         b.r = Math.max(Math.min(b.r, grid.row), 0);

    //         if (a.c == ac && a.r == ar && b.c == bx && b.r == br) {
    //             return
    //         } else {
    //             moveList.push(n, m);
    //         }
    //     });
    // });

    let moveList = [];
    workNames.map(n => {
        let r, c, br = worksOptions[n].r,
            bc = worksOptions[n].c,
            nr = noise(frameCount / workRefreshNoiseBaseX, worksOptions[n].id),
            nc = noise(-frameCount / workRefreshNoiseBaseY, worksOptions[n].d);
        nr = (Math.sin(nr * Math.PI * 64) + 1) / 2;
        nc = (Math.sin(nc * Math.PI * 64) + 1) / 2;
        r = Math.floor(nr * grid.row);
        c = Math.floor(nc * grid.col);
        worksOptions[n].r = r, worksOptions[n].c = c;
        if (worksOptions[n].r != br && worksOptions[n].c != bc) {
            moveList.push(n);
        }
    });
    moveList.map(n => {

        let poGrid = grid.grid[worksOptions[n].r][worksOptions[n].c];

        // worksOptions[n].x = Math.floor(poGrid.x - worksOptions[n].d / 2);
        worksOptions[n].x = poGrid.x;
        worksOptions[n].y = poGrid.y - (worksOptions[n].l - 1);
        worksOptions[n].w = poGrid.w * worksOptions[n].d;
        worksOptions[n].h = poGrid.h * worksOptions[n].l;


        let pos = [worksOptions[n].x, worksOptions[n].y,
        worksOptions[n].w, worksOptions[n].h
        ];
        pos = pos.map(i => Math.floor(Math.abs(i) * 100) / 100);

        works[n] = new Layout(str = n, settings = {
            font: titleFont,
            margin: 0, padding: 0, spacing: width / 40,
            ...((a, b) => Object.assign(...a.map((i, idx) => ({ [i]: b[idx] }))))(['l', 't', 'w', 'h'], pos),
            ...((a, b) => Object.assign(...a.map((i, idx) => ({ [i]: b[idx] }))))(['left', 'top', 'width', 'height'], pos),
            fillCell: "none"
        }
        );
    });


    background(22, 23, 25);
    if (isIOS == false) {
        translate(-width / 2, -height / 2);
    }

    {
        push();
        fill('rgba(255,255,255,0.06)');
        let fpsStr = 'fps ' + frameRate().toFixed(2) + ' ua ' + ua;
        fps.str = fpsStr.replace(/[^a-zA-Z0-9]/g, ' ');
        fps.gridFillFloor();
        fps.text();
        pop();
    }

    {
        push();
        // fill('rgba(255,255,255,0.6)');
        fill(128);
        // works.splitWordGrid();
        // works.text();
        blendMode(DIFFERENCE);
        Object.values(works).map(v => {
            // v.splitWordGrid();
            v.text();
        })
        pop();
    }

    {
        push();
        stroke('rgba(255,255,255,0.08)');
        blendMode(ADD);
        grid.drawRefLine();
        blendMode(BLEND);

        pop();
    }

    // {
    //     push();
    //     // noFill();
    //     // stroke('rgba(255,255,255,0.06)');
    //     // strokeWeight(1);
    //     boundaries.map(b => {
    //         b.show();
    //     });
    //     pop();
    // }
    { //show layout 
        // push();
        // textFont(font);
        // textSize(layout.fontsize);
        // textAlign(LEFT, TOP);
        // rectMode(CORNER);

        // translate(0, 0, 100);
        // fill(64);
        // stroke(255);
        // layout.rect();

        // translate(0, 0, 50);
        // fill(128);
        // noStroke();
        // layout.text();
        // pop();
    }
    push();
    // blendMode(SUBTRACT);
    cnt.map(c => {
        c.show();
    });
    blendMode(BLEND);

    pop();
    // showFps();

    // noLoop();
    typoLayout();
}

function typoLayout() {
    const padding = 10,
        frameColor = 'rgba(255,255,255,0.64)',
        rightTopText = `by Leizingyiu`.split('').join(' '),
        leftTopText = `Creative\nCoding\nand\nMotion\nDesign`.split('').join(' ').replace(/\n /g, '\n');

    push();

    fill(frameColor);
    noStroke();
    textAlign(RIGHT, TOP);
    textFont(fontOfText);
    textSize(Math.min(width, height) / 48);
    textLeading(Math.min(width, height) / 32);
    text(rightTopText, width - globalMargin, globalMargin + padding);
    textAlign(LEFT, TOP);
    text(leftTopText, globalMargin, globalMargin + padding);

    stroke(frameColor);
    strokeWeight(1);
    line(width - globalMargin, globalMargin,
        width - globalMargin - textWidth(rightTopText), globalMargin);
    line(globalMargin, globalMargin,
        globalMargin + Math.max(...leftTopText.split('\n').map(i => textWidth(i))), globalMargin);

    pop();

}

// function showFps(fontsize = width / 20) {
//     {
//         textFont(font);
//         textSize(width / 10);
//         fill(255);
//         textAlign(LEFT, TOP);
//         stroke(0);
//         textSize(fontsize)
//         strokeWeight(2)
//         // text(
//         //     frameRate().toFixed(2) + ', ' + cnt.map(c => c.body.pos).join('| '),
//         //     boundariesThickness, height - boundariesThickness - fontsize,
//         //     width, height);
//         text(
//             frameRate().toFixed(2) + ua,
//             width / 2, height / 2, width, height);
//     }
//     let txt = frameRate().toFixed(2) + ua;

// }

function windowResized() {
    location.reload();
}