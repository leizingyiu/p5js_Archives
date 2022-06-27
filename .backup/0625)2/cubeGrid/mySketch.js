
var m = 3, n = 3, o = 3;
var xd, yd, zd;

var xd_ = 32, yd_ = 32, zd_ = 32;
var xD = 56, yD = 56, zD = 56;
var boxR = 12;
var noiseD = 0.5;
var mousePressedBoo = false;
var clickBoo = false;
var px = 0, py = 0;
var cBoo = false, aBoo = false, sBoo = false, frBoo = true;
var rX = 0, rY = 0;
var pg, cam, fr, rr;
var camZ = 500;

fr = 60;//framerate
rr = 2;//rotate speed  pre frame

function setup() {

	createCanvas(windowWidth, windowHeight);
	pg = createGraphics(width, height, WEBGL);
	cam = pg.createCamera();
	cam.setPosition(0, 0, camZ);
	cam.lookAt(0, 0, 0);

	vmin = Math.min(width, height);
	dmax = Math.max(m, n, o);
	d = 4;

	xd = vmin / dmax / d;
	yd = vmin / dmax / d;
	zd = vmin / dmax / d;
	pg.background(0);
	// blendMode(LIGHTEST);

}

function mousePressed() {
	mousePressedBoo = true;
	px = mouseX; py = mouseY;
}
function mouseReleased() {
	mousePressedBoo = false;
	if (Math.abs(px - mouseX) + Math.abs(py - mouseY) < 10) {
		clickBoo = !clickBoo;
	}
}
function touchEnded() {
	mousePressedBoo = false;
}
function touchMoved() {
	mousePressedBoo = true;
}

function draw() {

	frameRate(fr);
	background(0);
	pg.clear();

	if (clickBoo == false) {
		xd = xd_ + (mouseX - width / 2) / vmin * xD;
		yd = yd_ + (mouseY - height / 2) / vmin * yD;
		zd = zd_ + (Math.min(mouseX, mouseY) - vmin / 2) / vmin * zD;
		if (aBoo == false) {
			rY = noise(pg.frameCount / (fr / rr)) / 24;
			rX = noise(pg.frameCount / (fr / rr)) / 36;
			rY += (pmouseX - mouseX) / 1000;
			rX += -(pmouseY - mouseY) / 1000;

			pg.rotateY(rY);
			pg.rotateX(rX);
		}
	}

	if (mousePressedBoo == true) {
		rY = (mouseX - pmouseX) / 100;
		rX = -(mouseY - pmouseY) / 100;
		pg.rotateY(rY);
		pg.rotateX(rX);
	}

	pg.fill(0, 20);
	pg.stroke(255);
	pg.strokeWeight(1);
	for (let i = -m; i <= m; i++) {
		for (let j = -n; j <= n; j++) {
			for (let k = -o; k <= o; k++) {
				let translateArr = [(i) * xd,
				(j) * yd,
				(k) * zd];

				// 				let translateArr=[(i+Math.cos((Math.cos(k/o*Math.PI)+Math.cos(j/n*Math.PI))/(o+n)*Math.PI))*xd,
				// 													(j+Math.cos((Math.cos(i/m*Math.PI)+Math.cos(k/o*Math.PI))/(m+o)*Math.PI))*yd,
				// 													(k+Math.cos((Math.cos(i/m*Math.PI)+Math.cos(j/n*Math.PI))/(m+n)*Math.PI))*zd];

				pg.translate(...translateArr);

				let f = frameCount / 100 + 1;
				let noiseK = noise(i * noiseD + f, j * noiseD + f, k * noiseD + f);
				pg.strokeWeight(noiseK * 2);
				pg.stroke(255, (noiseK + 1) / 2 * 255);

				if (Math.abs(i) < m * 0.6 &&
					Math.abs(j) < n * 0.6 &&
					Math.abs(k) < o * 0.6
				) {
					let rotateAxisArr = [5, 6, 7];
					rotateAxisArr = rotateAxisArr.map(i => i * noiseK * Math.PI);
					let rotateRad = Math.sin(frameCount / 50) * noiseK * Math.PI;
					pg.rotate(rotateRad, rotateAxisArr);

					if (sBoo == false) {
						pg.box(noiseK * boxR * 2);
					}

					if (cBoo == false) {
						pg.sphere(noiseK * 1.2);
					}

					rotateAxisArr = rotateAxisArr.map(i => -i);
					pg.rotate(rotateRad, rotateAxisArr);
				} else {
					if (cBoo == false) { pg.sphere(noiseK * 1.2); }
				}

				translateArr = translateArr.map(i => -i);
				pg.translate(...translateArr);
			}
		}
	}
	image(pg, 0, 0);
	if (frBoo == true) {
		push();
		fill(255, 100);
		text(`${m * 2 + 1} x ${n * 2 + 1} x ${o * 2 + 1} = ${(m * 2 + 1) * (n * 2 + 1) * (o * 2 + 1)} | ` + frameRate().toFixed(2), 10, height - 10);
		pop();
		typoShow();
	}
}

function keyTyped() {
	if (key == 's') {
		save(pg, 'cubeGrid.png');
	}
}

function keyPressed() {
	switch (keyCode) {
		case 17://control
		case 91://command
			cBoo = !cBoo;
			break;
		case 18://alt
			aBoo = !aBoo;
			break;
		case 16://shift
			sBoo = !sBoo;
			break;
		case 187://+
			m++; n++; o++;
			break;
		case 189://-
			m--; n--; o--;
			break;
		case 219://[
			rr++;
			break;
		case 221://]
			rr--;
			break;

		case 38: //key up arror
			camZ += 10;
			cam.setPosition(0, 0, camZ);
			pg.rotateY(rY);
			pg.rotateX(rX);
			break;
		case 40: //key down arror
			camZ -= 10;
			cam.setPosition(0, 0, camZ);
			pg.rotateY(rY);
			pg.rotateX(rX);
			break;


		case 70: // key f to fullscreen;
			fullscreen(!fullscreen());
			break;
		case 84: // key t to hide/show typo;
			frBoo = !frBoo;
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


function windowResized() {
	setup();
	redraw();
}
/* TODO */
class Cube {
	constructor(posx, posy, posz) {
	}
}



let titleText = 'cube\ngrid', typoShadowAlpha = 0.32;
let discriptText = `
A js tool that converts plane coordinates 
to a sphere and maps back to a plane.
Get points on spherical space
without webgl or 3d library

Left click to use mouse coordinates

Press the F key to go full screen
Press the S key to save the screen
Press the T key to open/close the text`;
typoShow = typo;
function typo(target = window) {
	drawTarget = target;

	if (typeof titleFont == 'undefined' || typeof fontOfText == 'undefined') {
		titleFont = loadFont('../font/Xhers Regular.otf', redraw);
		fontOfText = loadFont('../font/NimbusSanL-Reg.otf', redraw);
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