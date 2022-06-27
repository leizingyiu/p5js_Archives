let settings = {
	n: 1,
	deepNum: 20,
	rowNum: 4,
	colNum: 4,
	perspective_factor: 0.8,
	rectStroke: true,
	deepStroke: true,
	strokeWeightAdding: true,
}

utility = function () {
	this.refresh = function () {
		redraw();
	};
	this.save = function () {
		// img.save('perspectiveGrid','png');

		//saveCanvas('savedCanvas');

		save(pg, 'perspectiveGrid.png');
	};
	this.saveSvg = function () {
		canvasType = 'svg';
		pg = createGraphics(w, h, SVG);
		draw(canvasType);
		pg.save("perspectiveGrid.svg");

		canvasType = 'normal';
		pg = createGraphics(w, h);
		draw(canvasType);
		redraw();

	}
};

utilities = new utility();
gui = new dat.GUI();
nG = gui.add(settings, 'n', 1, 20, 1);
numG = gui.add(settings, 'deepNum', 1, 100);
rG = gui.add(settings, 'rowNum', 1, 100, 1);
cG = gui.add(settings, 'colNum', 1, 100, 1);
lG = gui.add(settings, 'perspective_factor', 0, 1, 1 / 100000);

rsG = gui.add(settings, 'rectStroke');
dsG = gui.add(settings, 'deepStroke');

gui.add(settings, 'strokeWeightAdding');

gui.add(utilities, 'refresh');
gui.add(utilities, 'save');
gui.add(utilities, 'saveSvg');

gui.domElement.addEventListener('mouseover', function () {
	onCtrlerBoo = true;
	return false;
});
gui.domElement.addEventListener('mouseout', function () {
	onCtrlerBoo = false;
	return false;
});

var cBoo, xBoo, zBoo, mBoo, rBoo, sBoo, pauseBoo = false,
	ranBoo = false,
	onCtrlerBoo = false,
	touchBoo, inputX = 0,
	inputY = 0,
	x = 0,
	y = 0,
	px = x,
	py = y;

var canvasType = ['svg', 'normal'][1];

function setup(canvasType = 'normal') {

	w = windowWidth;
	h = windowHeight;

	// createCanvas(w, h, SVG);
	createCanvas(w, h);

	pg = createGraphics(w, h);

}

function main(type) {
	w = windowWidth;
	h = windowHeight;

	if (type == 'normal') {
	}
	pg.noFill();
	pg.rectMode(RADIUS);
	pg.clear();

	if (touchBoo == true) {
		inputX = touches[0][0];
		inputY = touches[0][1];
	} else {
		inputX = mouseX;
		inputY = mouseY;
	}
	if (pauseBoo == false) {
		x = inRanges(0, Math.abs(inputX - w / 2), w / 2);
		y = inRanges(0, Math.abs(inputY - h / 2), h / 2);
		px = x;
		py = y;
	} else {
		x = px;
		y = py;
	}

	if (pauseBoo == true && ranBoo == true) {
		x = px * noise(px, frameCount / 100)
		y = py * noise(py, frameCount / 100)
	}

	let oriX = x, oriY = y;
	if (rBoo == true) {
		oriX = oriY = Math.max(x, y);
	} else if (sBoo == true) {
		let m = Math.max(x, y);
		oriY = m;
		oriX = width / height * m;
	}

	for (let k = 0; k < settings.n; k++) {
		let stepx, stepy, step;

		if (settings.strokeWeightAdding == true) {
			pg.strokeWeight((k + 1) * settings.rectStroke);
		} else {
			pg.strokeWeight(settings.rectStroke);
		}

		x = oriX * (settings.rowNum / 2 - k) / (settings.rowNum / 2);
		y = oriY * (settings.colNum / 2 - k) / (settings.colNum / 2);

		for (step = 0; step < settings.deepNum; step++) {
			stepx = x * Math.pow(settings.perspective_factor, step);
			stepy = y * Math.pow(settings.perspective_factor, step);
			if (stepx < 1 || stepy < 1) {
				break;
			}
			pg.rect(w / 2, h / 2, stepx, stepy);
		}
		pg.translate(w / 2, h / 2);

		if (settings.strokeWeightAdding == true) {
			pg.strokeWeight((k + 1) * settings.deepStroke);
		} else {
			pg.strokeWeight(settings.deepStroke);
		}

		for (let i = 0; i <= settings.rowNum - k * 2; i++) {
			let linex = map(i, 0, settings.rowNum - k * 2, x, -x);
			let lineStepx = map(i, 0, settings.rowNum - k * 2, stepx, -stepx);
			pg.line(linex, y, lineStepx, stepy);
			pg.line(linex, -y, lineStepx, -stepy);
		}
		for (let j = 0; j <= settings.colNum - k * 2; j++) {
			let liney = map(j, 0, settings.colNum - k * 2, y, -y);
			let lineStepy = map(j, 0, settings.colNum - k * 2, stepy, -stepy);
			pg.line(x, liney, stepx, lineStepy);
			pg.line(-x, liney, -stepx, lineStepy);
		}
		pg.translate(-w / 2, -h / 2);
	}

	if (type == 'normal') {
		pg.push();
		typo(pg);
		pg.pop();
	}
}

function draw(type = 'normal') {


	main(type);

	background(220);




	image(pg, 0, 0)

	return false;
}
function inRanges() {
	let args = [...arguments].map(i => Number(i));
	let min = args.shift();
	let max = args.pop();
	return Math.max(min, Math.min(...args, max));
}

function mouseWheel(event) {

	let evDelta = event.delta / 100;
	if (mBoo == true) {
		evDelta = evDelta * 10;
	}
	if (cBoo == true) {
		settings.deepNum += evDelta;
		settings.deepNum = Math.max(1, settings.deepNum);
		if (Math.pow(settings.perspective_factor, settings.deepNum) * Math.max(w / 2, h / 2) < 1) {
			settings.deepNum += -event.delta / 100;
		}
		numG.setValue(settings.deepNum);
	}
	else if (xBoo == true) {
		settings.rowNum += evDelta;
		settings.rowNum = Math.max(1, settings.rowNum);
		rG.setValue(settings.rowNum);
	}
	else if (zBoo == true) {
		settings.colNum += evDelta;
		settings.colNum = Math.max(1, settings.colNum);
		cG.setValue(settings.colNum);
	} else {
		console.log('scroll', evDelta);
		settings.perspective_factor += -  evDelta / 1000;
		lG.setValue(settings.perspective_factor);
	}
	return false;
}

function keyPressed() {

	switch (keyCode) {

		case 67://c
			cBoo = true;
			break;
		case 88://x
			xBoo = true;
			break;
		case 90://z
			zBoo = true;
			break;
		case 16:
		case 17:
		case 18:
		case 93:
		case 91:
			mBoo = true;
			break;

		case 82://key r
			rBoo = true;
			break;

		case 83://key s
			sBoo = true;
			break;

		case 70: // key f to fullscreen;
			fullscreen(!fullscreen());
			break;
	}
	return false;
}

function keyReleased() {
	switch (keyCode) {

		case 67:
			cBoo = false;
			break;
		case 88:
			xBoo = false;
			break;
		case 90:
			zBoo = false;
			break;
		case 16:
		case 17:
		case 18:
		case 93:
		case 91:
			mBoo = false;
			break;

		case 82://key r
			rBoo = false;
			break;
		case 83://key s
			sBoo = false;
			break;
	}
}


function mousePressed() {
	if (onCtrlerBoo == true) {
		return false;
	}
	if (mouseButton === LEFT) {
		pauseBoo = !pauseBoo;
		ranBoo = false;
	}
	if (mouseButton === RIGHT) {
		pauseBoo = !pauseBoo;
		ranBoo = pauseBoo;
	}
	gui.close();
	return false;
}

function mouseClicked(e) {

	return false;
}

function touchStarted() {
	touchBoo = true
}

function touchEnded() {
	touchBoo = false
}

function windowResized() {
	setup();
}


let titleText = 'PerspectiveGrid', typoShadowAlpha = 0.12;
let discriptText = {
	cn: `这是一个透视网格生成器，可以保存成svg，保存给其他地方使用

点击左键以启动/停止鼠标捕捉

按 s 和鼠标移动，可以将变换锁定到屏幕比例
按 r 和鼠标移动，可以将变换锁定到正方形比例

按 z 和鼠标滚轮，增减两侧线条数量
按 x 和鼠标滚轮，增减顶底线条数量
按 c 和鼠标滚轮，增减深度线条数量
直接滚动鼠标滚轮，更改透视程度

按任意修饰键可让滚轮加速10倍
(系统原因，mac的shift和win的alt可能会失效`,
	en: `This is a perspective grid generator that can be saved as svg for use elsewhere

Left click to start/stop mouse capture

Press s and move the mouse to lock the transform to the screen ratio
Press r and move the mouse to lock the transform to a square scale

Press z and mouse wheel to increase or decrease the number of lines on both sides
Press x and mouse wheel to increase or decrease the number of top and bottom lines
Press c and mouse wheel to increase or decrease the number of depth lines
Scroll the mouse wheel directly to change the perspective

Press any modifier key to speed up the scroll wheel 10 times
(System reasons, mac's shift and win's alt may fail`}[language];

function typo(target = pg) {
	drawTarget = target;

	if (typeof titleFont == 'undefined' || typeof fontOfText == 'undefined') {
		titleFont = loadFont('../font/Xhers Regular.otf', redraw);
		// fontOfText = loadFont('../font/NimbusSanL-Reg.otf', redraw);
		fontOfText = getDefaultFont();
		redraw();
		return;
	}
	if (typeof toTitleUpperCase == 'undefined') { toTitleUpperCase = function () { return arguments[0] } }
	if (typeof globalMargin != 'number') { globalMargin = 48; }

	const padding = 10, frameColor = 'rgba(0,0,0,0.64)', lineHeight = 1.5;
	const titleSizeK = 4, textSizeK = 0.8;

	// let ctx = drawTarget.drawingContext;
	// ctx.shadowBlur = textWidth(' ') * 3;
	// ctx.shadowColor = `rgba(0,0,0,${typoShadowAlpha})`;
	// // ctx.globalCompositeOperation = '';
	drawTarget.blendMode(HARD_LIGHT);


	discriptText = toTitleUpperCase(discriptText);

	drawTarget.blendMode('source-over');
	drawTarget.push();
	drawTarget.textSize(Math.min(width, height) / 20);

	drawTarget.fill(frameColor);
	drawTarget.noStroke();
	drawTarget.textSize(Math.min(width, height) / 48);

	// right top
	drawTarget.textAlign(LEFT, TOP);
	drawTarget.textFont(titleFont);
	drawTarget.textSize(drawTarget.textSize() * titleSizeK);
	drawTarget.textLeading(drawTarget.textSize() * lineHeight);
	drawTarget.text(titleText,
		globalMargin - drawTarget.textWidth(titleText[0]) / 4,
		globalMargin + padding);
	drawTarget.textSize(drawTarget.textSize() / titleSizeK);


	//right bottom
	drawTarget.textFont(fontOfText);
	drawTarget.textSize(drawTarget.textSize() * textSizeK);
	drawTarget.textLeading(drawTarget.textSize() * lineHeight);
	drawTarget.textAlign(LEFT, BOTTOM);
	drawTarget.text(discriptText,
		globalMargin,
		height - globalMargin - padding);
	drawTarget.textSize(drawTarget.textSize() / textSizeK);




	//right top
	drawTarget.textFont(titleFont);
	drawTarget.stroke(frameColor);
	drawTarget.textSize(drawTarget.textSize() * titleSizeK);
	drawTarget.strokeWeight(1);
	drawTarget.line(globalMargin,
		globalMargin,
		globalMargin + drawTarget.textWidth(titleText) + drawTarget.textWidth(titleText[0]) / 4,
		globalMargin);
	drawTarget.textSize(drawTarget.textSize() / titleSizeK);


	//right bottom
	drawTarget.textFont(fontOfText);
	drawTarget.textSize(drawTarget.textSize() * textSizeK);
	// drawTarget.line(width - globalMargin,
	// 	height - globalMargin,
	// 	width - globalMargin - Math.max(...discriptText.split('\n').map(i => drawTarget.textWidth(i))),
	// 	height - globalMargin);
	drawTarget.line(globalMargin,
		height - globalMargin,
		globalMargin + Math.max(...discriptText.split('\n').map(i => drawTarget.textWidth(i))),
		height - globalMargin);
	drawTarget.textSize(drawTarget.textSize() / textSizeK);

	drawTarget.pop();


}