exampleText = 'some words. Or some sentences. Or some natural segments, and longer natural segments.';



let url = new URL(document.location.href);
let varNameArray = ['exampleText'];
varNameArray.map(v => {
    if (url && url.searchParams.has(v) && url.searchParams.get(v) != 'undefined') {
        window[v] = url.searchParams.get(v);
    }
});

history.pushState('', '', url.origin + url.pathname + '?' + ['exampleText'].map(t => `${t}=${eval(t)}`).join('&'));//前两个参数可省略




function preload() {
    titleFont = loadFont('https://fonts.cdnfonts.com/s/74329/Xhers Regular.woff');
}

function setup() {
    createCanvas(windowWidth, windowHeight);

    layout = new Layout(str = exampleText, {
        font: titleFont,
        margin: 12, padding: 2, spacing: 4,
        left: 0, top: 0, width: width, height: height,
        fillCell: 'none'
    });

    layout.splitSentenceGrid();
}


function draw() {
    background(48);
    push();
    textAlign(CENTER, CENTER);

    layout.settings.textFillColor = '#0033ff';
    layout.settings.textStrokeWeight = 0;
    layout.settings.rectStrokeColor = '#ff6600';
    layout.settings.rectStrokeWeight = 2;
    layout.show();

    //or
    // fill(0);
    // stroke(255);
    // layout.text();

    // noFill();
    // stroke(0);
    // layout.rect();


    pop();
    noLoop();
}


let clickIdx = 0;
let funcs = ['gridFillCeil', 'gridFillFloor', 'splitWordGrid', 'splitSentenceGrid'];

function mouseClicked() {
    console.clear();
    layout[funcs[clickIdx]]();
    let hintText = `The current layout function() is layout.` + funcs[clickIdx] + '()';
    console.log(hintText);
    clickIdx = (clickIdx + 1) % funcs.length;
    redraw();

    // hint text
    push();
    textSize(24);
    textAlign(CENTER, CENTER);
    noStroke();
    fill(255, 100)
    rectMode(CENTER);
    rect(width / 2, height / 2, textWidth(hintText) + textSize() / 2, 1.5 * textSize())

    fill(32);
    text(hintText, width / 2, height / 2, width, height)
    pop();
    // hint text

    setTimeout(redraw, 3000);
}



function windowResized() {
    resizeCanvas(windowWidth, windowHeight);

    layout.init(str = exampleText, {
        font: titleFont,
        margin: 12, padding: 2, spacing: 4,
        left: 0, top: 0, width: width, height: height,
        fillCell: 'none'
    });
    // layout[layout.layoutType]();
    layout[funcs[clickIdx]]();
    layout.show();
    redraw();
}