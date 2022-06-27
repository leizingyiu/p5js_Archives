p5.disableFriendlyErrors = true;


let inputSound = ['music', 'mic'][0];

// let _wn = 23, _n=36,_barH=2000;
// let _margin = 8, _deep = 100, _deepOffset = 1000;
// let frustumW = 1.5, frustumH = 0.8, frustumZ = 1, frustumMaxDeep = 40000;





pwn = 0, pn = 0, pbarH = 0, pmargin = 0, pdeep = 0, pdeepOffset = 0, pageMargin = 24;


function easeToTarget(ee, eeTarget, delta = 2, speed = 5) { return ee - eeTarget < delta ? ee : ee + (eeTarget - ee) / speed; }
function moveToTarget(ee, eeTarget, delta = 2, speed = 5) { return ee - eeTarget < delta ? ee : ee + (eeTarget - ee) / Math.abs(eeTarget - ee) * speed; }
var loopRefreshBoo = true;


let makeLevelArr = (n, wn) => [...new Array(n)].map(i => [...new Array(wn + 1)].map((j, idx, arr) => 96 * (1 - Math.random() - Math.sin(idx / arr.length * Math.PI / 2))));
// let levelArr = [...new Array(n)].map(i => [...new Array(wn+1)].map((j,idx,arr)=>96*(1-Math.random()-Math.sin(idx/arr.length*Math.PI/2))));


let mx, my, pmx, pmy;

let varying = `varying highp vec3 color;`;
let vs = varying + 'attribute vec3 aPosition;' + 'void main() {  false; }';
let fs = varying + 'void main() {gl_FragColor = vec4(color, 0.5);}';
let mandel;
let w, h;

let m;//for music
let describeFont, titleFont;

let wPerH;
function preload() {
	var pc = new PC();
	pc.slider('_wn', 23, 5, 33, 1);
	pc.slider('_n', 36, 5, 48, 1);
	pc.slider('_barH', 2000, 0, 3000, 50);
	pc.slider('_margin', 8, 0, 480, 2);
	pc.slider('_deep', 100, 0, 300, 10);
	pc.slider('_deepOffset', 1000, 0, 2000, 100);

	pc.slider('frustumW', 1.25, 0, 3, 0.05);
	pc.slider('frustumH', 0.8, 0, 3, 0.05);
	pc.slider('frustumZ', 0.5, 0, 3, 0.05);
	pc.slider('frustumMaxDeep', 40000, 0, 80000, 100);

	wn = _wn, n = _n, barH = _barH;
	margin = _margin, deep = _deep, deepOffset = _deepOffset;


	exTarget = 0, eyTarget = barH / 2 * 0.2, ezTarget = 0 - deep * n / 2;
	cxTarget = 0, cyTarget = -barH * 0.8, czTarget = deep * ((n - 4) / 2);
	ex = exTarget, ey = eyTarget, ez = ezTarget, cx = cxTarget, cy = cyTarget, cz = czTarget;

	levelArr = makeLevelArr(n, wn);
	startBoo = false;


	// musics=["https://openprocessing.org/sketch/1428414/files/Faint.m4a"]
	// music = loadSound(random(musics));
	m = new Musics(loopBoo = true, showTextBoo = false, disableConsoleErrBoo = false);


	let basepath = '';
	window.location.href.replace(/CANYON(.*)/, function () {
		let path = arguments[1];
		console.log(path);
		let nums = path.match(/\//g); console.log(nums);
		basepath = [...new Array(nums.length + 1)].join('../');
	});
	console.log(basepath);
	m.loadMusicFromJson(basepath + 'music/songs.json');

	if (location.hostname.indexOf('openprocessing') != -1) {
		describeFont = loadFont('https://www.openprocessing.org/sketch/1489373/files/Nimbus-Sans-D-OT-Light_32752.woff');
		titleFont = loadFont('https://www.openprocessing.org/sketch/1489373/files/Xhers Regular.woff');
	} else {
		describeFont = loadFont('../font/Nimbus-Sans-D-OT-Light_32752.ttf');
		titleFont = loadFont('../font/Xhers Regular.otf');
	}

	// Xhers_normal_400 = loadFont('https%3A%2F%2Ffonts.cdnfonts.com%2Fs%2F74329%2FXhers%20Regular.woff');
	// Xhers_italic_400 = loadFont('https%3A%2F%2Ffonts.cdnfonts.com%2Fs%2F74329%2FXhers%20Regular-Italic.woff');

}

function setup() {
	cnv = createCanvas(windowWidth, windowHeight);
	pg = createGraphics(Math.max(width, height), Math.max(width, height), WEBGL);


	// 	gl=pg.drawingContext;
	// gl.enable(gl.BLEND);
	// gl.disable(gl.DEPTH_TEST);

	wPerH = width / height;

	cnv.mousePressed(() => { pmx = mouseX; pmy = mouseY; })
	cnv.mouseReleased(function () {
		userStartAudio();
		mx = mouseX; my = mouseY;
		if (Math.abs(pmx - mx) < 10 && Math.abs(pmy - my) < 10) {
			if (inputSound == 'music') {
				m.playPauseMusic();
			} else {
				if (isLooping() == true) { noLoop(); } else { loop(); }
			}
		}
	});


	cam = pg.createCamera();
	[ex, ey, ez] = [0, barH / 2 * 0.2, 0 - deep * n / 2];
	[cx, cy, cz] = [0, -barH * 0.8, deep * ((n - 4) / 2)];
	cam.lookAt(ex, ey, ez);
	cam.setPosition(cx, cy, cz);
	// console.log(ex,ey,ez,cx,cy,cz);

	//	cam.frustum(2.5, -2.5, 0.6,  -0.6, 1.25, 12000);
	// cam.frustum(pg.width/2000, -pg.width/2000, pg.height/2000,  -pg.height/2000, 1.25, Math.max(20000,deep*n+deepOffset));
	//cam.frustum(frustumW/pg.width, -frustumW/pg.width, frustumH/pg.height,  -frustumH/pg.height, frustumZ, Math.max(frustumMaxDeep,deep*n+deepOffset));

	frustumZ = height / width;
	cam.frustum(frustumW, -frustumW, frustumH, -frustumH, frustumZ, frustumMaxDeep);

	var smoothing = 0.1;
	var bins = 64;
	fft = new p5.FFT(smoothing, bins);
	amplitude = new p5.Amplitude();
	activeSound(m);

	mandel = pg.createShader(vs, fs);
	pg.shader(mandel);
	pg.noStroke();
	//rect width
	w = width * 1.5 - margin * 2;
	// lights:
	pg.ambientLight(60, 60, 60);
	pg.pointLight(255, 255, 255, 0, height * 2, -500);

	wn = _wn; n = _n; barH = _barH;
	margin = _margin; deep = _deep; deepOffset = _deepOffset;
	w = width * 1.5 - margin * 2;
}

function activeSound(musicObj = m) {
	if (inputSound == 'mic') {
		if (musicObj.isPlaying() == true) {
			musicObj.pause();
		}
		mic = new p5.AudioIn();
		mic.start();
		fft.setInput(mic);
		amplitude.setInput(mic);
		sound = mic;
	} else {
		if (musicObj.isPlaying() == false) {
			musicObj.loop();
		}
		fft.setInput(musicObj.music);
		amplitude.setInput(musicObj.music);
		sound = musicObj.music;
	}
}

function draw() {



	// 	if(frameCount%150==0){

	// 		if(pwn != wn|| pn!=n||pbarH!=barH||pmargin != margin|| pdeep != deep||pdeepOffset != deepOffset){
	// 			console.log('refresh');
	// 			windowResized();
	// 			pwn = wn; pn=n,pbarH=barH; pmargin = margin; pdeep = deep; pdeepOffset = deepOffset;
	// 		}
	// 	}

	// loopRefreshBoo=loopRefresh();
	// pg.orbitControl();


	//fft:
	let spectrum = fft.analyze();
	let a = fft.linAverages(wn);
	levelArr = levelArr.length < n ? levelArr.concat(makeLevelArr(n - levelArr.length, wn)) : levelArr;
	levelArr = levelArr.length > n ? levelArr.slice(levelArr.length - n, levelArr.length) : levelArr;
	a = arrCleanAndExtend(a, 0.01, (p, start, end) => {
		if ([...arguments].some(i => typeof (i) == 'undefined')) { return end; }
		return map(Math.pow(p, 2) + (Math.random() - 0.5) / 2, 0, 1, start, end)
	});

	a = a.some(i => Number.isNaN(i) || typeof (i) == "undefined") ? [...new Array(wn + 1)].map((i, idx, arr) => Math.random() * 96 * (1 - idx / arr.length)) : a;
	levelArr.push(a);
	levelArr.shift();

	//draw rects
	pg.clear();
	for (let j = 0; j < n; j++) {
		pg.push();
		let vz = pg.createVector(0, 0, -j * deep * 2);
		pg.translate(vz);
		let fillC = Math.pow(j / n, 0.36) * 255;
		pg.fill(255, fillC);
		pg.ambientLight(fillC * 1.44);

		for (let i = -wn; i <= wn; i++) {
			h = (levelArr[j][wn - Math.abs(i)] / 255 + 0.1) * (1 - Math.pow((n - j) / n, 0.5) * Math.pow((wn - Math.abs(i)) / wn, 0.5) + 0.2) * barH;
			//let v=createVector(w*(i-wn/2 + 0.5)/((wn+1)/2),-h/2);
			let v = pg.createVector(w * (i) / ((wn - 2)), -h / 2);
			pg.push();
			pg.translate(v);
			pg.box(w / wn, h, deep / 4)
			pg.pop();
		}
		pg.pop();
	}

	background(8);

	push();
	imageMode(CENTER);
	image(pg, width / 2, height / 2, pg.width, pg.height);
	pop();

	//hint text
	let dpDensity = displayDensity();
	push();
	fill(233);
	let hintStr;
	if (inputSound == 'music') {
		hintStr = m.musicStatus(failText = "load error,please reload",
			loadingText = "loading, please wait",
			playingText = "music playing, click to pause",
			pausedText = "music paused, click to play");
		hintStr += '; type r to switch song; type ` to switch to microphone ;';
	} else {
		hintStr = 'Using microphone ; type ` to switch to music ; click to pause and continue ;';
	}
	hintStr += ' type s to save img .';
	textSize(dpDensity * 12); textFont(describeFont);
	if (textWidth(hintStr) > width / 2) {
		hintStr = hintStr.replace(/;/g, ';\n');
	}
	textAlign(LEFT, BOTTOM);
	text(hintStr.replace(/\n /g, '\n'), pageMargin, height - pageMargin);
	pop()


	//title describeFont or titleFont
	push()
	fill(200);
	translate(pageMargin, 0);
	translate(0, pageMargin);

	textFont(describeFont);
	textAlign(LEFT, TOP);
	textSize(dpDensity * 12);
	text('music visualization', 0, 0);

	fill(255);
	translate(0, dpDensity * 12);
	textFont(titleFont);
	textAlign(LEFT, TOP);
	textSize(dpDensity * 36);
	text('Canyon', 0, 0);

	pop();

	//name
	push()
	fill(200);
	translate(-pageMargin, 0);
	translate(0, -pageMargin);

	textFont(describeFont);
	textAlign(RIGHT, BASELINE);
	textSize(dpDensity * 18);
	text('Design and Coding by leizingyiu', width, height);
	let nameWidth = textWidth('Design and Coding by leizingyiu');

	push();
	translate(0, dpDensity * -18);
	textSize(dpDensity * 12);
	text(`music is ${m.soundName}`, width, height);
	pop();

	translate(0, pageMargin * 2);
	strokeWeight(2);
	stroke(200);
	line(width - nameWidth, 0, width, 0);
	pop()

}


keyTyped = () => {
	switch (key) {
		case 'r':
			if (inputSound == 'music') {
				m.switchMusic();
			}
			break;
		case 's':
			save('Canyon_music visualization_by leizingyiu.jpg');
			break;
	}
	return false;
}

keyPressed = () => {
	switch (keyCode) {
		case 38:
			cam.move(0, 100, 0);
			ey += 100;
			// camPosH-=1;
			cam.lookAt(0, -900, -deep * 2);
			break;
		case 40:
			cam.move(0, -100, 0);
			ey -= 100;
			cam.lookAt(0, -900, -deep * 2);
			// camPosH+=1;
			break;
		case 192:
			inputSound = inputSound == 'music' ? 'mic' : 'music';
			activeSound();
			break;

		case 70: // key f to fullscreen;
			fullscreen(!fullscreen());
			break;
	}
	// translate(w,-barH/2,deep*2);

	// cam.setPosition(cx,cy,cz);
	// cam.lookAt(0, barH/2*0.8+camLookH, 0-deep*n/2);
	// cam.setPosition(0, -barH*0.8+camPosH, deep*((n-4)/2));

	return false;

};

// function loopRefresh(maxLoopTimes){
// 	exTarget=0,eyTarget=barH/2*0.2,	ezTarget= 0-deep*n/2;
//   cxTarget=0,	cyTarget=-barH*0.8,		czTarget= deep*((n-4)/2);

// 	if(loopRefreshBoo==false){ return }
// 	let pey=ey,pez=ez,pcy=cy,pcz=cz;

// 	ey=easeToTarget(ey,eyTarget);
// 	ez=easeToTarget(ez,ezTarget);
// 	cy=moveToTarget(cy,cyTarget);
// 	cz=moveToTarget(cz,czTarget);

// 	cam.lookAt(ex,ey,ez);
// 	cam.setPosition(cx,cy,cz);

// 	if(pey==ey && pez==ez && pcy==cy && pcz==cz){
// 	// loopRefreshBoo=false;
// 		return false;
// 	}else{
// 		//loopRefreshBoo=false;
// 	return true;}
// }

refresh = () => {
	// loopRefreshBoo=true;

	cam.frustum(frustumW / pg.width, -frustumW / pg.width, frustumH / pg.height, -frustumH / pg.height, frustumZ, Math.max(frustumMaxDeep, deep * n + deepOffset));

	pg.noStroke();
	//rect width
	w = width * 1.5 - margin * 2;
	// lights:
	pg.ambientLight(60, 60, 60);
	pg.pointLight(255, 255, 255, 0, height * 2, -500);
}

windowResized = () => {
	cnv = resizeCanvas(windowWidth, windowHeight);

	frustumZ = height / width;
	cam.frustum(frustumW * wPerH / (width / height), -frustumW * wPerH / (width / height),
		frustumH * wPerH / (width / height), -frustumH * wPerH / (width / height),
		frustumZ * wPerH / (width / height), frustumMaxDeep);

	wn = _wn; n = _n; barH = _barH;
	margin = _margin; deep = _deep; deepOffset = _deepOffset;
	w = width * 1.5 - margin * 2;

	// cam.frustum(2.5*wPerH/(width/height), -2.5*wPerH/(width/height), 0.6*wPerH/(width/height),  -0.6*wPerH/(width/height), 1.25*wPerH/(width/height), 30000);

	// setup();
	// 	pg=createGraphics(windowWidth,windowHeight,WEBGL);

	// 	// [ex,ey,ez]=[0, barH/2*0.2, 0-deep*n/2];
	// 	// [cx,cy,cz]=[0, -barH*0.8, deep*((n-4)/2)];
	// 	// cam.lookAt(ex,ey,ez);
	// 	// cam.setPosition(cx,cy,cz);
	// // 	console.log('cam: ',cam.eyeX,cam.eyeY,cam.eyeZ,cam.centerX,cam.centerY,cam.centerZ);


	//frustumW=width,	frustumH=height,	frustumZ=1.25;

	//cam.frustum(frustumW/pg.width, -frustumW/pg.width, frustumH/pg.height,  -frustumH/pg.height, frustumZ, Math.max(frustumMaxDeep,deep*n+deepOffset));

	// 	w=width*1.5-margin*2;	

	// refresh();
}