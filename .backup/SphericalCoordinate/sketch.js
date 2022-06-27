var R = 200;
var perspectiveK = 0.7;

//var sphere,
var rectR = 10;
var generMode = true;
function setup() {
	createCanvas(windowWidth, windowHeight);
	R = Math.min(width, height) / 3;
	background(0);

	sphereFun = sphericalCoordinate(perspectiveK = perspectiveK, W = width, H = height, midX = width / 2, midY = height / 2, Math.PI, Math.PI);

	vMaxToRadian = Math.PI;
	vMax = Math.max(width, height);
	vRad = vMax / vMaxToRadian;


	rectMode(RADIUS);

	drawingContext.shadowOffsetX = 0;
	drawingContext.shadowOffsetY = 0;
	drawingContext.shadowBlur = 4;
	drawingContext.shadowColor = "#FFFFFFff"

	frameRate(120);
}

function draw() {

	drawingContext.shadowBlur = 0;
	drawingContext.shadowColor = "#00000066"

	background(0, 8);

	noFill();
	stroke(255);

	if (generMode == true) {
		dx = random() * width;
		dy = random() * height;
		dR = R;
		dR2 = random() * R;
	} else {


		dx = -width / 2 + mouseX;
		dy = mouseY;
		dR = R;
		dR2 = noise(mouseX / 10 + mouseY / 10) * R;
	}


	let d = 10;
	for (let i = 0, ii = 10; i < ii; i++) {

		let k = 1 - i / ii;
		stroke(168, k * 255);

		strokeWeight(k * 2);
		point(Math.floor(width * noise(frameCount * k) / d) * (d + 1), Math.floor(height * noise(frameCount * k * k) / d) * (d + 1));
		point(Math.floor(width * Math.random() / d) * (d + 1), Math.floor(height * Math.random() / d) * (d + 1));



		strokeWeight(k * 2);
		[x1, y1] = sphereFun(dx + rectR, dy + rectR, dR - dR2 * i / ii);
		[x2, y2] = sphereFun(dx - rectR, dy + rectR, dR - dR2 * i / ii);
		[x3, y3] = sphereFun(dx - rectR, dy - rectR, dR - dR2 * i / ii);
		[x4, y4] = sphereFun(dx + rectR, dy - rectR, dR - dR2 * i / ii);

		push();
		translate(width / 2, height / 2)
		// rect(Dx,Dy,rectR/perspect,rectR/perspect);
		fill(0, k);
		noStroke();
		drawingContext.shadowBlur = dR2 * k;
		drawingContext.shadowColor = "#00000099"
		circle(0, 0, R * k * (noise(frameCount * k) * 1 + 1));

		drawingContext.shadowBlur = dR2 * k;
		drawingContext.shadowColor = "#FFFFFFff"

		stroke(255, k * 255);
		noFill();
		quad(x1, y1, x2, y2, x3, y3, x4, y4);
		pop();
	}

	typoShow();
}


function mouseClicked() {
	generMode = !generMode;
}

function windowResized() {
	setup();
}


function keyPressed() {
	switch (keyCode) {
		case 70: // key f to fullscreen;
			fullscreen(!fullscreen());
			break;
		case 84: // key t to hide/show typo;
			typoShow = typoShow() == false ? typo : () => { return false };
			break;
		case 83: // key s to save screenshot;
			let temp = Boolean(typoShow);
			typoShow = () => { return false; };
			redraw();
			save('SphericalCoordiante_by_leizingyiu.jpg');
			typoShow = temp ? typo : () => { return false };
			break;
	}
}

let titleText = 'Spherical\nCoordiant', typoShadowAlpha = 0.32;
if (typeof language == 'undefined') { language = 'en'; }
let discriptText = {
	cn: `一个模拟球面坐标js工具
将到平面坐标，映射到球面上，再投影到屏幕平面
而无需使用 webgl 或 3d 库

左键单击以使用鼠标坐标

按 F 键进入全屏
按 S 键保存屏幕
按 T 键打开/关闭文本`, en: `
A js tool that converts plane coordinates 
to a sphere and maps back to a plane.
Get points on spherical space
without webgl or 3d library

Left click to use mouse coordinates

Press the F key to go full screen
Press the S key to save the screen
Press the T key to open/close the text`}[language];
typoShow = typo;
function typo(target = window) {
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

	const padding = 10, frameColor = 'rgba(255,255,255,0.92)', lineHeight = 1.5;
	const titleSizeK = 4, textSizeK = 0.8, demoSizeK = 0.5;

	let ctx = drawTarget.drawingContext;
	ctx.shadowBlur = textWidth(' ') * 3;
	ctx.shadowColor = `rgba(0,0,0,${typoShadowAlpha})`;
	// ctx.globalCompositeOperation = '';
	drawTarget.blendMode(HARD_LIGHT);


	discriptText = toTitleUpperCase(discriptText);

	drawTarget.blendMode('source-over');
	drawTarget.push();
	drawTarget.textSize(Math.min(width, height) / 20);

	drawTarget.fill(frameColor);
	drawTarget.noStroke();
	drawTarget.textSize(Math.min(width, height) / 48);

	// right top
	drawTarget.textAlign(RIGHT, TOP);
	drawTarget.textFont(titleFont);
	drawTarget.textSize(drawTarget.textSize() * titleSizeK);
	drawTarget.textLeading(drawTarget.textSize() * lineHeight);
	drawTarget.text(titleText, width - globalMargin, globalMargin + padding);
	drawTarget.textSize(drawTarget.textSize() / titleSizeK);


	//right mid demo text
	// let titleH = drawTarget.textAscent() + drawTarget.textSize() * titleSizeK;
	// drawTarget.textSize(drawTarget.textSize() * demoSizeK);
	// drawTarget.textFont(fontOfText);
	// drawTarget.textLeading(drawTarget.textSize() * lineHeight);

	// let detailW = drawTarget.textWidth(demoText.split('\n').sort((a, b) => b.length - a.length)[0]),
	//   detailH = demoText.length * drawTarget.textLeading();
	// demoDetailX_1 = width - globalMargin,
	//   demoDetailX_0 = demoDetailX_1 - detailW,
	//   demoDetailY_0 = globalMargin + padding + titleH,
	//   demoDetailY_1 = demoDetailY_0 + detailH;


	// drawTarget.push();
	// drawTarget.fill(168);
	// drawTarget.text(demoText, width - globalMargin, globalMargin + padding + titleH);
	// drawTarget.pop();

	// drawTarget.textSize(drawTarget.textSize() / demoSizeK);


	//right bottom
	drawTarget.textFont(fontOfText);
	drawTarget.textSize(drawTarget.textSize() * textSizeK);
	drawTarget.textLeading(drawTarget.textSize() * lineHeight);
	drawTarget.textAlign(RIGHT, BOTTOM);
	drawTarget.text(discriptText, width - globalMargin, height - globalMargin - padding);
	drawTarget.textSize(drawTarget.textSize() / textSizeK);




	//right top
	drawTarget.textFont(titleFont);
	drawTarget.stroke(frameColor);
	drawTarget.textSize(drawTarget.textSize() * titleSizeK);
	drawTarget.textLeading(drawTarget.textSize() * lineHeight);
	drawTarget.strokeWeight(1);

	drawTarget.line(width - globalMargin,
		globalMargin,
		width - globalMargin - Math.min(...titleText.split('\n').map(i => drawTarget.textWidth(i))),
		globalMargin);

	drawTarget.line(width - globalMargin,
		globalMargin + drawTarget.textLeading(),
		width - globalMargin - Math.max(...titleText.split('\n').map(i => drawTarget.textWidth(i))),
		globalMargin + drawTarget.textLeading());
	drawTarget.textSize(drawTarget.textSize() / titleSizeK);


	//right bottom
	drawTarget.textFont(fontOfText);
	drawTarget.textSize(drawTarget.textSize() * textSizeK);
	drawTarget.line(width - globalMargin, height - globalMargin,
		width - globalMargin - Math.max(...discriptText.split('\n').map(i => drawTarget.textWidth(i))), height - globalMargin);
	drawTarget.textSize(drawTarget.textSize() / textSizeK);

	drawTarget.pop();


}