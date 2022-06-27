var x, y, r, d, keyFunc;

function setup() {
	createCanvas(windowWidth, windowHeight);
	background(0);
	x = width / 2;
	y = height / 2;
	r = width / 50;
	d = height / 50;

	keyFunc = new KeyboardCtrl(keyFuncSetup, 60);
	// keyFunc.init();
}

function draw() {
	keyFunc.main();

	background(0, 5);
	// let runningList=Object.keys(keyRunning);
	// console.log(runningList);

	// runKeyFuncInDraw();
	stroke(200);
	noFill()

	ellipse(x, y, r + d, r + d);

	fill(155);
	noStroke();
	textLeading(24);
	text(`
wsad => hold   to run 
ujhk => runToEnd   holdToStop 
⬆️⬇️⬅️➡️ space => once
fvcb => pressAgainToStop
9oip => pressReverseStopGoReverse
5try => runToSelfConditionEnd
1，2 => pressAgainToAccelerateHoldToStop
shift3,opt4 => pressAgainToLoopHoldToStop
`, width / 2, height / 2, width, height);

	text(keyFunc.text(), 24, 24, width - 48, height - 48);

}



function keyPressed() {
	// console.log('keyPressed '+keyCode+' '+key);

	// keyFunc.setKeyFuncInKeyPressed();
	keyFunc.pressed();
	// console.log(keyFunc.keyPressedList);
}

function keyReleased() {
	// console.log('keyReleased ' + keyCode + ' ' + key);

	keyFunc.released();
	// keyFunc.setKeyFuncInKeyReleased();
}

function keyTyped() {
	// console.log('keyTyped '+keyCode+' '+key);
}
