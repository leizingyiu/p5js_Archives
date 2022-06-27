let theStr = `Some
P5JS Pratice
by Leizingyiu`;
// theStr = theStr.replace(/ /g, '_');

let titleFont, describeFont;
let fillC = 255;

var titleLayout;
let titleLayoutType = 'splitWordGrid' //"gridFillCeil"
let pc;
let grid;




{
    var a = new Number(0), b = 0, selector;
    var L;
}


updateLayout = () => {
    titleLayout.init(str = theStr, font = titleFont,
        layoutMargin, layoutPadding, layoutSpacing,
        ...grid.cellArgs(layoutGridRow, layoutGridCol, layoutGridW, layoutGridH, CORNER));
    titleLayout[titleLayoutType]();
};
updateGrid = _ => {
    grid.init(0, 0, width, height, gridRow, gridCol, gridMargin, gridSpacing);
};

updateContent = _ => {
    updateGrid();
    title.griding(0, 0, Math.ceil(gridCol / 2), gridRow);
    bgTexts.measureing(0, 0, window.innerWidth, window.innerHeight);
    L.update();
    //  updateLayout();
    redraw();
}

function preload() {
    titleFont = loadFont('../font/Xhers Regular.otf');
    fontOfText = loadFont('../font/NimbusSanL-Reg.otf');
}
function setup() {
    createCanvas(windowWidth, windowHeight);

    pc = new PC({
        autoHideBoo: true,
        latency_for_loading_local_data: 0,
        updateWithCookieBoo: false,
        updateWithUrlBoo: false,
        displayBoo: true
    }).title('Layouts settings');

    let gS;
    {//pc.group('gridSettings');
        gS = pc.group('gridSettings');
        gS.slider('gridRow', 5, 1, 32, 1, () => {
            console.log(Layouts_h, gridRow, Math.max(Layouts_h, gridRow - 1));

            pc.range('Layouts_col', 0, Math.max(Layouts_col, gridRow - 1));
            pc.range('Layouts_h', 0, Math.max(Layouts_h, gridRow));
            updateContent();
            redraw();
        });
        gS.slider('gridCol', 4, 1, 18, 1, () => {
            pc.range('Layouts_row', 0, Math.max(Layouts_row, gridCol - 1));
            pc.range('Layouts_w', 0, Math.max(Layouts_w, gridCol));
            updateContent();
            redraw();
        });
        gS.slider('gridMargin', 40, 1, 200, 1, updateContent);
        gS.slider('gridSpacing', 10, 1, 100, 1, updateContent);
        gS.checkbox('gridDisplay', true, ['visiable', 'hide'], redraw);
        gS.color('gridStrokeColor', '#233445', redraw);
    }

    grid = new Grid(0, 0, width, height, gridRow, gridCol, gridMargin, gridSpacing);

    rectMode(CORNER);

    pc.hr('-');
    const layoutGroup = pc.group('Layout_settings');
    // L = new Layouts(grid, pc);
    L = new Layouts(grid, layoutGroup);


    bgTexts = L.add('bgTexts', 'some creative coding projects',
        {
            font: titleFont,
            margin: 0, padding: 0, spacing: 20,
            left: 0, top: 0, w: width, h: height,
            rectMode: CORNER,
            layoutFunc: 'splitWordGrid',
            fill: 'rgb(48,49,50)', stroke: '#000000',
            fillBoo: true,
            strokeBoo: false,
            strokeWeight: 1,
            blendMode: 'source-over',
            fillStyle: false,
            strokeStyle: false,
            strokeJoin: MITER
        });

    {/*    // bgTexts.layout.letterFillFn = () => {
    //     return (s = {}) => {
    //         bgColor = typeof bgColor == 'undefined' ? "#000" : bgColor;
    //         let defaultS = {
    //             x: 0, y: 0, w: 1000, h: 1000, fontsize: 20, c1: '#369', c2: bgColor
    //         };
    //         Object.keys(defaultS).map(k => {
    //             if (typeof s[k] == 'undefined') {
    //                 s[k] = defaultS[k];
    //             }
    //         })

    //         return setLinearGradient(s.x, s.y, s.x + s.w, s.y + s.h, s.c1, s.c2);
    //     };
    // };
    */}

    title = L.add('title', 'things i made with p5js',
        {
            font: titleFont,
            margin: 2, padding: 2, spacing: 40,
            blendMode: 'exclusion', strokeWeight: 8, stroke: 'rgb(29,31,32)'
        }).griding(0, 0, Math.floor(gridCol / 2), 5);

    // title2 = L.add('title2', 'the 2nd title obj', titleFont, [4, 4, 20, 60, 80, width / 2, height / 2]);


    pc.color('bgColor', 'rgb(29,31,32)');

    pc.foldGroup('gridSettings');

    pc.stick('bottom');
    setTimeout(() => {
        L.updateCtrler();
    }, 500);

    pc.mainContainer.elt.classList.add('fold');
}

function draw() {
    // background(220);
    // clear();
    background(bgColor);
    //  thePoster();

    if (gridDisplay == true) {
        push();
        stroke(gridStrokeColor);
        grid.drawRefLine();
        pop();
    }

    fill(0);
    // layout.show();

    // textSize(titleLayout.fontsize);
    // titleLayout.text();

    // console.table((layout));
    // noLoop();
    // textFont(titleFont);

    fill(0);
    // L.rect();
    fill(255);
    L.text();

    typoLayout();

    noLoop();
}

clickBoo = false;
function mouseClicked() {
    redraw();
    noLoop();
}
// function mouseClicked() {
//     if (clickBoo) {
//         layout.gridFillCeil();
//     } else {
//         layout.gridFillFloor();
//     }
//     clickBoo = !clickBoo;
//     redraw();
// }

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    // thePoster();
    // layout.init(...layoutArguments);
    // layout.reInit();
    // layout.gridFill();
    // layout.splitWordGrid();
    updateContent();
    // titleLayout.show();


    redraw();
}

function leftTopPositionArr(a, b) {
    let result = [];
    for (let i = 0; i < a * b; i++) {
        let A = (i % a - (a - 1) / 2);
        let B = Math.floor(i / a) - (b - 1) / 2;
        result[i] = [A, B];
    }
    return result;
}

function setLinearGradient(x1, y1, x2, y2, c1, c2) {
    let grd = drawingContext.createLinearGradient(x1, y1, x2, y2)
    grd.addColorStop(0, c1);
    grd.addColorStop(1, c2);
    return grd;
}


function typoLayout() {
    const globalMargin = gridMargin;
    const padding = 10,
        frameColor = 'rgba(255,255,255,0.64)',
        rightTopText = `This default page is made with\n my Grid.js, layout.js\nand p5js_ctrler scripts`.split('').join(' '),
        rightBottomText = `Creative Coding\nand\nMotion Design\nby leizingyiu`.split('').join(' ').replace(/ *\n/g, '\n');

    push();

    fill(frameColor);
    noStroke();
    textAlign(RIGHT, TOP);
    textFont(fontOfText);
    textSize(Math.min(width, height) / 48);
    textLeading(Math.min(width, height) / 32);
    text(rightTopText, width - globalMargin, globalMargin + padding);
    textAlign(RIGHT, BOTTOM);
    text(rightBottomText, width - globalMargin, height - globalMargin - padding);

    stroke(frameColor);
    strokeWeight(1);
    line(width - globalMargin, globalMargin,
        width - globalMargin - Math.max(...rightTopText.split('\n').map(i => textWidth(i))), globalMargin);

    line(width - globalMargin, height - globalMargin,
        width - globalMargin - Math.max(...rightBottomText.split('\n').map(i => textWidth(i))), height - globalMargin);

    pop();

}