let wn = 23;
let n = 36;
let margin = 8;

var inputSound = ['music', 'mic'][0];
let deep = 100;
let deepOffset = 1000;
let levelArr = [...new Array(n)].map(i => [...new Array(wn + 1)].map((j, idx, arr) => 96 * (1 - Math.random() - Math.sin(idx / arr.length * Math.PI / 2))));
let barH = 2000;
let startBoo = false;
let mx, my, pmx, pmy;

let varying = `varying highp vec3 color;`;
let vs = varying + 'attribute vec3 aPosition;' + 'void main() {  false; }';
let fs = varying + `void main() {gl_FragColor = vec4(color, 0.5);}`;
let mandel;
var ex, ey, ez, cx, cy, cz;
var w, h;
var au;//add audio dom

function load() {
	musics = ['https://freepd.com/music/3%20am%20West%20End.mp3', 'https://freepd.com/music/Arpent.mp3', 'https://freepd.com/music/Backbeat.mp3', 'https://freepd.com/music/Beat%20One.mp3', 'https://freepd.com/music/Beat%20Thee.mp3', 'https://freepd.com/music/Bit%20Bit%20Loop.mp3', 'https://freepd.com/music/Chronos.mp3', 'https://freepd.com/music/Favorite.mp3', 'https://freepd.com/music/Fireworks.mp3', 'https://freepd.com/music/Goodnightmare.mp3', 'https://freepd.com/music/Hear%20What%20They%20Say.mp3', 'https://freepd.com/music/Hippety%20Hop.mp3', 'https://freepd.com/music/Meditating%20Beat.mp3', 'https://freepd.com/music/Space%20Ambience.mp3'];
	let m = musics[Math.floor(Math.random() * musics.length)];
	au = document.createElement('audio');
	au.src = m.replace(/https/, 'http');

	au.type = "audio/mpeg"; au.crossorigin = "anonymous"; au.controls = 'true';
	document.querySelector('body').appendChild(au);

	let context = getAudioContext();
	// // wire all media elements up to our FFT
	for (let elem of selectAll('audio').concat(selectAll('video'))) {
		let mediaSource = context.createMediaElementSource(elem.elt);
		mediaSource.connect(p5.soundOut);
	}
}

function preload() {
	music = loadSound('Faint.m4a');
}

function setup() {
	load();

	cnv = createCanvas(windowWidth, windowHeight, WEBGL);
	cnv.mousePressed(() => { pmx = mouseX; pmy = mouseY; })
	cnv.mouseReleased(function () {
		userStartAudio();
		mx = mouseX; my = mouseY;
		console.log(music.isPlaying());
		if (Math.abs(pmx - mx) < 10 && Math.abs(pmy - my) < 10) {
			if (music.isPlaying()) {
				music.pause();
			} else {
				// start the loop
				music.loop();
			}
		}
	});
	cam = createCamera();
	[ex, ey, ez] = [0, barH / 2 * 0.2, 0 - deep * n / 2];
	[cx, cy, cz] = [0, -barH * 0.5, deep * ((n - 4) / 2)];
	cam.lookAt(ex, ey, ez);
	cam.setPosition(cx, cy, cz);
	//	cam.frustum(2.5, -2.5, 0.6,  -0.6, 1.25, 12000);
	cam.frustum(width / 2000, -width / 2000, height / 2000, -height / 2000, 1.25, 12000);


	var smoothing = 0.1;
	var bins = 64;
	fft = new p5.FFT(smoothing, bins);
	amplitude = new p5.Amplitude();

	// blendMode(LIGHTEST);

	// translate(0,0,-deep*n-deepOffset);
	// noLoop();



	mandel = createShader(vs, fs);
	shader(mandel);



	activeSound();
	noStroke();

	w = width * 1.5 - margin * 2;

}
function activeSound() {
	console.log(music);
	if (inputSound == 'mic') {
		if (music.isPlaying() == true) {
			music.pause();
		}
		mic = new p5.AudioIn();
		mic.start();
		fft.setInput(mic);
		amplitude.setInput(mic);
		sound = mic;
	} else {
		if (music.isPlaying() == false) {
			music.loop();
		}
		fft.setInput(music);
		amplitude.setInput(music);
		sound = music;
	}
}
function draw() {
	orbitControl();

	let locX = mouseX - height / 2;
	let locY = mouseY - width / 2;
	ambientLight(60, 60, 60);
	// lights();
	pointLight(255, 255, 255, locX, locY + height * 2, -500);
	let dirX = (mouseX / width - 0.5) * 2;
	let dirY = (mouseY / height - 0.5) * 2;
	directionalLight(250, 250, 250, -dirX, -dirY, deep * n / 2);

	var spectrum = fft.analyze();
	let a = fft.linAverages(wn);
	levelArr.push(a);
	levelArr.shift();

	background(8);

	for (let j = 0; j < n; j++) {
		push();
		let vz = createVector(0, 0, -j * deep * 2);
		translate(vz);
		fill(200, j / n * 255);
		for (let i = -wn; i <= wn; i++) {
			h = (levelArr[j][wn - Math.abs(i)] / 255 + 0.1) * (1 - Math.pow((n - j) / n, 0.5) * Math.pow((wn - Math.abs(i)) / wn, 0.5) + 0.2) * barH;
			//let v=createVector(w*(i-wn/2 + 0.5)/((wn+1)/2),-h/2);
			let v = createVector(w * (i) / ((wn - 2)), -h / 2);
			push();
			translate(v);

			box(w / wn, h, 2)
			pop();
		}
		pop();
	}



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
};
function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}