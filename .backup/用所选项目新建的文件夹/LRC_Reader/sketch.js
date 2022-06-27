// Created: "2022/03/29 13:00:00"
// Last modified: "2022/06/25 18:55:12"

if (typeof toTitleUpperCase == 'undefined') { toTitleUpperCase = function () { return arguments[0] } }

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

// music and lrc data

let m = {
	"Heifervescent_-_Cellophane_Mask": {
		"lrc": "../music/Heifervescent_-_Cellophane_Mask.lrc",
		"song": "../music/Heifervescent_-_Cellophane_Mask.mp3"
	},
	"Rude_-_Cold_Inside": {
		"lrc": "../music/Rude_-_Cold_Inside.txt",
		"song": "../music/Rude_-_Cold_Inside.mp3"
	},
	"Tantalizing_Youth_-_Social_Square": {
		"lrc": "../music/Tantalizing_Youth_-_Social_Square.lrc",
		"song": "../music/Tantalizing_Youth_-_Social_Square.mp3"
	},
	"Tom_Orlando_-_Ghost_Ride_[Radio_Edit]": {
		"lrc": "../music/Tom_Orlando_-_Ghost_Ride_[Radio_Edit].lrc",
		"song": "../music/Tom_Orlando_-_Ghost_Ride_[Radio_Edit].mp3"
	}
};
// musics = [
// 	{
// 		'song': '../music/Rude_-_Cold_Inside.mp3',
// 		'lrc': '../music/Rude_-_Cold_Inside.lrc'
// 	},
// ];

musics = Object.values(m);
music = musics[Math.floor(musics.length * Math.random())];
console.log(musics, music);

// music and lrc data

// audio dom element
au = document.createElement('audio');
au.src = `${music.song}`;
au.controls = 'true';
au.preload = 'true';
au.loop = 'true';
au.style.cssText = `    
--w:10vw;
height: 2em;
width:  min( max( 40vw , 30em ) , 80vw );
position: absolute;
left: 50%;
bottom: min( 12vh , 24em ) ;
transform:translate(-50%,0);
mix-blend-mode: exclusion;
opacity: 0.5;
transition:opacity 0.5s ease;`;
document.body.appendChild(au);
// audio dom element

let enHiliFont, lrc, tw, pc;
let t, l; // audio time  and  sound level 
let fft, amplitude, level, spectrum, bands,
	pg,
	mainTranslateX = 0, mainTLX = 0;

//demo 
const lrcDemoText = `[ti:LRC Reader Testing] 
[ar:Leizingyiu] 
[al:p5js_practice]

[00:01.43]Read LRC,and output the corresponding lyric line according to the specified time.
[00:04.98]And output fade-in and fade-out progress according to the in-out point
[00:06.54] 
[00:07.32]design and coding by leizingyiu`;
const lrcDemoSettings = { 'inoutType': ['time', 'percentage'][0], 'in': 0.5, 'out': 0.5 };

const demo = new LRC(lrcDemoText, lrcDemoSettings);

const demoText = (`const lrc = new LRC(
\`${lrcDemoText}\`,
${JSON.stringify(lrcDemoSettings, ' ', 1).replace(/\n/g, ' ').replace(/ {2,}/g, ' ')});

----------

> LRC `+
	objToString(demo)
		.replace(/\n/g, '')
		.replace(/,\s*([^\{,]+\{)/g, ',\n$1')
	// .replace(/([\}\]])\s*,/g, '$1,\n')
	+ `

----------

lrc.update(time);
// This method will update : lrc.before, lrc.after, this.index .

let [i, o] = lrc.inout(time);
// This method will update and output the progress of the fading in and out .
// You can make other visualizations based on fading data

let str = lrc.at(time);
// This method will update and output the lyrics of the current time .

text(str,0,0);
//Finally you can draw lyric text with text in p5js or sth else
`);
// demo 

//typo
const titleText = 'LRC READER\nAnd music visualization', typoShadowAlpha = 0.12;
let discriptText = {
	en: 'Read LRC,\nand output the corresponding lyric line\naccording to the specified time.\nAnd output fade-in and fade-out progress\naccording to the in-out point\n\ndesign and coding by leizingyiu',
	cn: '读取LRC\n按照指定时间输出对应的歌词行\n并根据入出点输出淡入淡出进度\n\ndesign and coding by leizingyiu'
}[language];
discriptText = toTitleUpperCase(discriptText);

//typo

function preload() {
	lrcStrings = loadStrings(`./${music.lrc}`);
	// enHiliFont = random(['Sherika', 'Lost in South']);
	enHiliFont = random(['Sherika']);
}
function setup() {
	cnv = createCanvas(windowWidth, windowHeight);
	cnv.mouseClicked(_ => {
		pc.stick('top');
	});

	if (isIOS == true) {
		pg = createGraphics(windowWidth, windowHeight);
	} else {
		pg = createGraphics(windowWidth, windowHeight, WEBGL);
	}

	background(100);

	// p5js_ctrler settings 
	pc = new PC({
		updateWithCookieBoo: false,
		updateWithUrlBoo: false,
		autoHideBoo: true,
		ctrler_width: 200,
	});

	{
		let audioAndFFT = pc.group('audio_input_settings');
		audioAndFFT.fileinput("loadMusic", (e) => {
			console.log(e.data);
			au.src = e.data;
		});
		audioAndFFT.fileinput("loadLrc", (e) => {
			console.log(e.data);
			let l = loadStrings(e.data, (arr) => {
				console.log(arr);
				lrc.init(arr.join('\n'));
				console.log(lrc);
			});
		});
		audioAndFFT.checkbox("audioTime", true, ['ctrl lrc by html<audio>', 'ctrl lrc by slider[auTime]'], (e) => {
			if (e.path[0].checked == true) {
				pc.disable('auTime');
			} else {
				pc.enable('auTime');
			}
		});
		audioAndFFT.slider("auTime", 3, 0, 240, 0.1);
		audioAndFFT.slider("fft_bins", 6, 4, 8, 1);

		let inAndOut = pc.group('Fade_in_and_out');
		inAndOut.select("interpolate_time", ['time', 'percentage'], () => {
			lrc.inoutType = interpolate_time;
		});
		inAndOut.slider("lrc_in", 0.391, 0.001, 2, 0.01);
		inAndOut.slider("lrc_out", 0.391, 0.001, 2, 0.01);

		let animation = pc.group('animation_settings');
		animation.slider("level_min", 0.23, 0, 1, 0.01);
		animation.slider("level_max", 1, 0, 1, 0.01);
		animation.slider("textWiggleAmp", 1, 0, 233, 1);
		animation.slider("offsetY", -0.565, -4, 4, 0.001);

		let displaySettings = pc.group('display_settings');
		displaySettings.slider("bgColor", 10);
		displaySettings.color("darkColor", '#ffffff');
		displaySettings.color("lightColor", '#ffffff');
		displaySettings.color("outlineColor", '#000000');
		displaySettings.slider("mainOutlineWeight", 9, 0, 16, 1);
		displaySettings.slider("subOutlineWeight", 9, 0, 16, 1);

		let textSettings = pc.group('text_settings');

		textSettings.slider("mainTxtSize", 33, 0, 100, 1);
		textSettings.slider("subTxtSize", 22, 0, 100, 1);
		textSettings.slider("txtLetterspace", 2.5, 0, 100, 0.1);
		textSettings.select("mainTextAlign", ['left', 'center', 'right']);
		textSettings.slider("beforeAfterNum", 15, 0, 50, 1);
		textSettings.slider("linehightK", 0.55, -2, 2, 0.01);
		textSettings.checkbox("show_beforeText", false, ['show', 'hide']);
		textSettings.checkbox("show_afterText", true, ['show', 'hide']);
		pc.update('show_afterText', 'show');
		pc.update('show_beforeText', 'hide');

		// let shadowSettings = pc.group('shadow_settings');
		// shadowSettings.color("shadowColor", '#6600ff');
		// shadowSettings.slider("shadowBlurK", 3.1, 0, 4, 0.1);
		// shadowSettings.slider("shadowOpacity", 53, 0, 255, 1);



		let transformSettings = pc.group('transform_settings');

		transformSettings.slider("r", 45, -180, 180, 1);
		transformSettings.slider("sX", -30, -180, 180, 1);
		transformSettings.slider("sY", -24, -180, 180, 1);
		transformSettings.slider("r2", -10, -180, 180, 1);
		transformSettings.slider("scX", 100, 0, 200, 1);
		transformSettings.slider("scY", 110, 0, 200, 1);
	}

	lrc = new LRC(lrcStrings.join('\n'), {
		'inoutType': interpolate_time,
		'in': 1,
		'out': 1
	});
	console.log(lrc);

	tw = new textWiggle(20, 10, settings = {
		letterSpace: txtLetterspace,
		scaleAmp: 2,
		rotateAmp: 2,
		translateAmp: 2
	});

	fft = new p5.FFT();
	amplitude = new p5.Amplitude();
	// amplitude.setInput(au);
	// fft.setInput(au);
	let context = getAudioContext();
	// wire all media elements up to our FFT
	for (let elem of selectAll('audio').concat(selectAll('video'))) {
		let mediaSource = context.createMediaElementSource(elem.elt);
		mediaSource.connect(p5.soundOut);
	}

	pc.foldGroup();
	pc.stick('top');

}

function draw() {
	// clear();
	this.background(bgColor);

	level = amplitude.getLevel();

	spectrum = fft.analyze(Math.pow(2, fft_bins));
	spectrum = spectrum.slice(0, Math.pow(2, fft_bins));

	bands = fft.logAverages(fft.getOctaveBands());
	bands = bands.slice(0, Math.floor(bands.length * fft_bins / 10));


	{ //drawSound 
		push();
		drawSound();
		pop();
	}


	lrc.in = lrc_in, lrc.out = lrc_out, lrc.inoutType = interpolate_time,
		tw.letterSpace = txtLetterspace;


	{ // middle center line
		push();
		rectMode(CENTER);
		stroke(bgColor * 3);
		rect(width / 2, height / 2, 0, height);
		rect(width / 2, height / 2, width, 0);
		pop();
	}

	t = audioTime == true ? Number(au.currentTime) : auTime;
	l = map(level, level_min, level_max, 0, 1, true);
	l = Math.pow(l, 2);
	tw.amp = l * textWiggleAmp;
	drawLrc();


	// showFps();
	typo();
}

function isometricFx() {
	rotate(r / 360 * 2 * PI);
	shearX(PI * 2 * sX / 360);
	shearY(PI * 2 * sY / 360);
	rotate(r2 / 360 * 2 * PI);
	scale(scX / 100, scY / 100);
}

function drawLrc() {

	push();
	textAlign(mainTextAlign, CENTER);
	rectMode(CENTER);
	{
		push();
		if (t == 0) {
			{
				push();
				fill(darkColor);
				stroke(outlineColor);
				strokeWeight(mainOutlineWeight);
				tw.textSize(mainTxtSize);
				translate(width / 2, height / 2);
				isometricFx();
				tw.text(`${lrc.ti}`, 0, 0);
				pop();
			}

			{
				push();
				fill(lightColor);
				tw.textSize(subTxtSize);
				translate(width / 2, height / 2 + mainTxtSize);
				isometricFx();
				tw.text(`${lrc.ar}`, 0, 0);
				pop();
			}
		} else {
			let offset = 0.05;


			lrc.update(t);
			let str = lrc.at(t);


			// // let bds = extendArr(spectrum, Math.min(beforeAfterNum, lrc.index) + Math.min(beforeAfterNum, lrc.ms.length - lrc.index) + 1);
			// let bds = cleanArr(spectrum, 0.005);
			// // bds = extendArr(bds,
			// // 	Math.min(beforeAfterNum, lrc.ms.length - lrc.index),
			// // 	fn = (p, start, end) => { return start * (1 - p) + end * (p) });
			// bds = extendArr(bds,
			// 	beforeAfterNum,
			// 	fn = (p, start, end) => { return start * (1 - p) + end * (p) });
			let bds = arrMappingNewLength(spectrum, beforeAfterNum);
			bds = bds.map(b => b * level);


			let [i, o] = lrc.inout(t);
			let sl = str.length;
			let [il, ol] = [i, o].map(l => Math.floor(l * sl));

			// switch (textAlign().horizontal) {
			// 	case 'left':
			// 		mainTranslateX = -textWidth(lrc.ms[lrc.index].c);
			// 		break;
			// 	case 'right':
			// 		mainTranslateX = textWidth(lrc.ms[lrc.index].c);
			// 		break;
			// }
			// let d = 12;
			// if (Math.abs(mainTLX - mainTranslateX) > d) {
			// 	mainTLX += d * (mainTLX > mainTranslateX ? -1 : 1);
			// }
			// translate(mainTLX, 0);


			if (show_afterText == true) { subText(0); }
			mainText();
			if (t > 0 && show_beforeText == true) {
				subText(1);
			}

			function mainText() { //main text
				// let beforeTxt = '' + randomText(ol) + '',
				// 	midTxt = str
				// 		.slice(0, il)
				// 		.slice(ol, sl),
				// 	afterTxt = '' + randomText(sl - il) + '';

				let beforeTxt = '' + randomAllLetter(str.slice(0, ol)) + '',
					midTxt = str
						.slice(0, il)
						.slice(ol, sl),
					afterTxt = '' + randomAllLetter(str.slice(il, sl)) + '';



				textSize(mainTxtSize);
				let totalWidth = textWidth(beforeTxt + midTxt + afterTxt) * (1 + txtLetterspace / textSize()),
					beforeWidth = textWidth(beforeTxt) * (1 + txtLetterspace / textSize()),
					midWidth = textWidth(midTxt) * (1 + txtLetterspace / textSize()),
					afterWidth = textWidth(afterTxt) * (1 + txtLetterspace / textSize());

				{
					push();

					translate(width / 2, height / 2);
					isometricFx();

					// translate(0, bds[Math.floor(bds.length / 2)] * bY);
					translate(0, bds.shift() * offsetY);

					stroke(outlineColor);
					strokeWeight(mainOutlineWeight);

					if ((!/.*[\u4e00-\u9fa5]+.*$/.test(str))) {
						textFont(enHiliFont)
					}

					if (totalWidth > width) {
						let nowSize = textSize();
						textSize(nowSize * width / totalWidth);
					}

					switch (textAlign().horizontal) {
						case 'center':
							translate(-totalWidth / 2 + beforeWidth / 2, 0);
							break;
						case 'left':
							translate(0, 0);
							break;
						case 'right':
							translate(-totalWidth + beforeWidth, 0);
							break;
					}
					fill(lightColor);
					push();
					tw.text(beforeTxt, 0, 0);
					pop();

					switch (textAlign().horizontal) {
						case 'center':
							translate(beforeWidth / 2 + midWidth / 2, 0);
							break;
						case 'left':
							translate(beforeWidth, 0);
							break;
						case 'right':
							translate(midWidth, 0);
							break;
					}

					{
						push();
						fill(darkColor);
						push();
						tw.text(midTxt, 0, 0);

						push();
						blendMode(SCREEN);
						fill(0);
						// noStroke();
						// verticalBlur(0, 0, shadowBlurK, shadowColor,
						// 	shadowOpacity, 4,
						// 	_ => tw.text(midTxt, 0, 0));
						pop();



						pop();
						pop();
					}


					switch (textAlign().horizontal) {
						case 'center':
							translate(midWidth / 2 + afterWidth / 2, 0);
							break;
						case 'left':
							translate(midWidth, 0);
							break;
						case 'right':
							translate(afterWidth, 0);
							break;
					}
					fill(lightColor);
					push();
					tw.text(afterTxt, 0, 0);
					pop()
					pop();
				}
			}


			function subText(k = [0, 1][0]) { //sub text, 1for before 0 for after
				textSize(subTxtSize);
				fill(lightColor);
				// let lineNum = k == 0 ? Math.min(lrc.ms.length - lrc.index, beforeAfterNum) :
				// 	Math.min(lrc.index, beforeAfterNum);
				let lineNum = beforeAfterNum;

				// console.log(lineNum, lrc.index, lrc.ms.length - lrc.index);

				let yMove = k == 0 ? mainTxtSize / 2 - subTxtSize / 2 : -mainTxtSize / 2 + subTxtSize / 2,
					direct = k == 0 ? 1 : -1;
				yMove = yMove * linehightK;
				{
					push();
					translate(0, yMove);
					for (let j2 = lineNum; j2 >= 1; j2--) {

						let j = k == 0 ? j2 : lineNum - j2 + 1;

						[i, o] = lrc.inout(t + offset * j * direct);

						// if (lrc.index + j * direct >= lrc.ms.length || lrc.index + j * direct < 0) {
						// 	continue;
						// }

						let str = lrc.ms[(lrc.index + j * direct + lrc.ms.length) % lrc.ms.length].c;

						let sl = str.length;
						let [il, ol] = [i, o].map(l => Math.floor(l * sl));

						push();
						translate(width / 2,
							height / 2 + subTxtSize * 2 * j * direct * linehightK)
						isometricFx();

						// let bdsId = k == 0 ?
						// 	bds.length - (lineNum - j) - 1 :
						// 	lineNum - j;
						// translate(0, bds[bdsId] * bY);
						translate(0, bds.shift() * offsetY);

						drawingContext.globalAlpha = 1 - j / lineNum;

						stroke(outlineColor);
						strokeWeight(subOutlineWeight);
						// text(str
						// 	.slice(0, il)
						// 	.slice(ol, str.length),
						// 	0, 0);
						text(str,
							0, 0);

						push();
						blendMode(SCREEN);
						fill(0);
						noStroke();
						// verticalBlur(0, 0, shadowBlurK, shadowColor,
						// 	shadowOpacity, 1,
						// 	_ => text(str,
						// 		0, 0));
						pop();


						pop();
					}
					pop();
				}
			}
		}
		pop();
	}
	pop();
}


function showFps() {
	push();
	let p = 20,
		m = 10;
	rectMode(CORNER);
	textAlign(RIGHT, BOTTOM);
	let fps = frameRate().toFixed(0);
	noStroke();
	rect(width - p + m, height - p + m, -textWidth(fps) - m * 2, -textSize() - m * 2);
	text(fps, width - p, height - p)
	pop();
}

function drawSound() {
	rectMode(CORNER);



	// [bands, spectrum] = [bands, spectrum].map(ar => ar.filter(a => a != 0));

	// fill(255);
	// noStroke();
	// for (var i = 0; i < bands.length; i = i + 1) {
	// 	var x = map(i, 0, bands.length - 1, 0, width);
	// 	var y = map(bands[i], 0, 255, height, 0);
	// 	var hauteur = height - y;
	// 	var largeur = width / bands.length;
	// 	rect(x, y, largeur, hauteur / 2);
	// }


	fill(0);
	noStroke();
	// for (var i = 0; i < spectrum.length; i = i + 1) {
	// 	var x = map(i, 0, spectrum.length - 1, 0, width);
	// 	var y = map(spectrum[i], 0, 255, height, 0);
	// 	var hauteur = height - y;
	// 	var largeur = width / spectrum.length;
	// 	rect(x, y, largeur, hauteur);
	// }

	for (let i = 0; i < spectrum.length; i++) {
		let x = map(log(i), 0, log(spectrum.length), 0, width);
		let h = map(spectrum[i], 0, 255, 0, height);
		let rectangle_width = (log(i + 1) - log(i)) * (width / log(spectrum.length));
		rect(x, height, rectangle_width, -h)
	}

	// fill(255);
	noFill();
	stroke(bgColor * 2);
	strokeWeight(1);
	for (var i = 0; i < spectrum.length; i = i + 1) {
		var x = map(i, 0, spectrum.length - 1, 0, width);
		var y = map(spectrum[i], 0, 255, height, 0);
		var hauteur = height - y;
		var largeur = width / spectrum.length;
		rect(x, y, largeur, hauteur);
	}

	noFill();
	stroke(255, 0, 0);
	strokeWeight(4);
	beginShape();

	// // one at the far corner
	// curveVertex(0, height);

	// for (var i = 0; i < bands.length; i++) {

	// 	var x = map(i, 0, bands.length - 1, 0, width);
	// 	var y = map(bands[i], 0, 255, height, 0);
	// 	curveVertex(x, y);
	// }

	// // one last point at the end
	// curveVertex(width, height);

	// endShape();

}

// class soundCube {
// 	constructor() {
// 		this.rotate = [0, 0, 0];
// 		this.boxSize = 100;
// 	}
// 	update(pg) {

// 		this.rotate = this.rotate.map(r => r + random() / 360);

// 		pg.rotateX(this.rotate[0]);
// 		pg.rotateY(this.rotate[1]);
// 		pg.rotateZ(this.rotate[2]);
// 	}
// 	show(pg) {
// 		pg.box(this.boxSize);
// 	}
// }


// function drawSound3d() {
// 	this.clear();
// 	this.rotateX(Math.random() / 360);
// 	this.rotateY(Math.random() / 360);
// 	this.rotateZ(Math.random() / 360);

// 	this.noFill();
// 	this.stroke(darkColor)
// 	this.strokeWeight(2);
// 	this.box(100 + l * 1000);

// 	let deepZ = 10;
// 	let deepY = 10;

// 	this.translate(0, -deepY, -deepZ);

// 	this.stroke(lightColor);
// 	this.strokeWeight(4);
// 	this.box(100 + l * 1000);

// 	this.translate(0, deepY, deepZ);

// 	image(pg, 0, 0, width, height);
// }

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	pg = createGraphics(windowWidth, windowHeight, WEBGL);
}

// function backupSth() {
// 	function a() {
// 		console.log(this);
// 	}

// 	b = {};

// 	a.call(b, '');
// }


/* https://openprocessing.org/sketch/1457617 */
function extendArr(array, l, fn = (p, start, end) => start * (1 - p) + end * (p)) {
	let bArr = [...new Array(l)];
	bArr = bArr.map((i, idx, arr) => {
		let l = arr.length,
			D = (idx) / (l - 1),
			d = D * (array.length - 1),
			Idx = Math.floor(d),
			proportion = Math.abs(d - Idx),
			start = array[Idx],
			end = array[Idx + 1],
			result = d == Idx ? array[d] : fn(proportion, start, end);
		return result;
	});
	return bArr;
}

function cleanArr(arr, threshold) {
	let a = [...arr];
	if (Math.abs(a.filter(i => i < threshold).length - a.length) < 2) {
		return a;
	}
	for (let i = a.length - 1; i > 0; i--) {
		if (a[i] < threshold) {
			a.pop()
		} else {
			break;
		}
	}
	for (let i = 0; i < a.length; i++) {
		if (a[i] < threshold) {
			a.shift()
		} else {
			break;
		}
	}
	return a;
}

function arrCleanAndExtend(arr, threshold, interpolationFn) {
	let a = [...arr];
	let l = a.length;
	a = cleanArr(a, threshold);
	a = extendArr(a, l, interpolationFn);
	return a;
}
/* https://openprocessing.org/sketch/1457617 */



function verticalBlurTest() {
	push();
	blendMode(SCREEN);
	fill(0);
	//stroke(255);
	//strokeWeight(1);
	verticalBlur(0, 0, 2, '#ffffff',
		100, 10,
		_ => ellipse(0, 0, 50, 50));
	pop();
}
function verticalBlur(x, y, blurK, blurColor,
	opacity, step, fx) {
	return;
	for (let i = step; i >= 0; i--) {
		push();
		setShadow(x, y, i * blurK,
			blurColor + Math.floor(opacity * (1 - i / step)).toString(16));
		scale(1, 1 + i / step);
		fx();
		pop();
	}
}
function setShadow(x, y, b, c) {
	drawingContext.shadowOffsetX = x;
	drawingContext.shadowOffsetY = y;
	drawingContext.shadowBlur = b;
	drawingContext.shadowColor = c;
}

function typo(target = window) {

	drawTarget = target;

	if (typeof titleFont == 'undefined' || typeof fontOfText == 'undefined') {
		titleFont = loadFont('../font/Xhers Regular.otf', redraw);
		// fontOfText = loadFont('../font/NimbusSanL-Reg.otf', redraw);
		fontOfText = getDefaultFont();
		redraw();
		return;
	}

	if (typeof globalMargin != 'number') { globalMargin = 48; }

	const padding = 10, frameColor = 'rgba(255,255,255,0.92)', lineHeight = 1.5;
	const titleSizeK = 4, textSizeK = 0.8, demoSizeK = 0.5;

	let ctx = drawTarget.drawingContext;
	ctx.shadowBlur = textWidth(' ') * 3;
	ctx.shadowColor = `rgba(0,0,0,${typoShadowAlpha})`;
	// ctx.globalCompositeOperation = '';
	drawTarget.blendMode(HARD_LIGHT);

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
	drawTarget.text(titleText, width - globalMargin - drawTarget.textWidth(titleText[0]) / 3, globalMargin + padding);
	drawTarget.textSize(drawTarget.textSize() / titleSizeK);


	//lef top demo text
	{
		drawTarget.push();
		drawTarget.textAlign(LEFT, TOP);
		drawTarget.textFont(fontOfText);
		drawTarget.textWrap(WORD);
		drawTarget.textSize(drawTarget.textSize() * textSizeK * 0.8);
		drawTarget.textLeading(drawTarget.textSize() * lineHeight);
		drawTarget.text(demoText,
			globalMargin, globalMargin, width * 0.75 - globalMargin, height - globalMargin);
		drawTarget.pop();
	}


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