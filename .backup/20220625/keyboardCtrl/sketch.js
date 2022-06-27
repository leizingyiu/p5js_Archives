// <script src="https://cdn.jsdelivr.net/gh/leizingyiu/utils@master/js/toTitleUpperCase.js"></script> 
const toTitleUpperCase = str => str.replace(/\S+/g, (word, idx, sentence) => ['the', 'a', 'an'].indexOf(word) != -1 ? word : word.toLowerCase().replace(/^[a-zA-Z]/, letter => letter.toUpperCase()));

var x, y, r, d, keyFunc,
	stroke_weight = 2, showingHintText = '', demoObj, demoText,
	demoDetailX_0 = 0, demoDetailX_1 = 0, demoDetailY_0 = 0, demoDetailY_1 = 0,
	demoDetailBigBoo = false, demoDetailBigDeltaY = 0;
const globalMargin = 20, hintText = `wsad => hold to run
ujhk => run To Edge
⬆️⬇️⬅️➡️ space => Once
fvcb => Press Again To Stop
9oip => Press Again To Stop or Press Reverse to Go Reverse
5try => Run To Self ConditionEnd
1 2 => Press Again To Speed Up , Hold to Stop
shift_3 opt_4 alt_4 => Set Repeat Tempo , Hold to Stop`.replace(/([^(=>)])/g, '$1 ').replace(/\n /g, '\n').replace(/(?<==>).*/g, function (word) {
	return toTitleUpperCase(word.replace(/  /g, '_').split(' ').join('').split('_').join(' ')).split('').join(' ');
}),
	stroke_weight_max = 4, stroke_weight_min = 1, stroke_weight_speed = 0.1,
	keyblockFillC = 0,
	keyblockStrokeC = 96,
	keyblockStrokeWeight = 2,
	keyblockGlowAlpha = 0.2,
	keyblockGlowFrame = 30;

// const keyFuncDemo={
// 	"hold":{
// 		87:(w)=>{y-=1},
// 		83:(s)=>{y+=1},
// 		65:(a)=>{x-=1},
// 		68:(d)=>{x+=1},
// 	},
// 	"once":{
// 		37:(left)=>{x=(x-100+width)%width},
// 		38:(up)=>{y=(y-100+height)%height},
// 		39:(right)=>{x=(x+100+width)%width},
// 		40:(down)=>{y=(y+100+height)%height},
// 		32:(space)=>{x=width/2;y=height/2;},
// 	},
// 	"runToEnd":{
// 		85:(u)=>{  if(y>0){y=y-1;}else{return false;}     			},
// 		74:(j)=>{  if(y<height){y=y+1}else{return false;}      	},
// 		72:(h)=>{  if(x>0){x=x-1;}else{return false;}      			},
// 		75:(k)=>{  if(x<width){x=x+1;}else{return false;}      	},
// 	},
// 	"pressAgainToStop":{
// 		70:(f)=>{ y=y-1; },
// 		86:(v)=>{ y=y+1; },
// 		67:(c)=>{ x=x-1; },
// 		66:(b)=>{ x=x+1; },
// 	},
// 	"pressReverseStopGoReverse":{
// 		57:(nine)=>{console.trace();		if(y>0){  y=y-1; 			return 79; }else{  return false;  } 	  }, /*return code =>target stop; return false => self stop */ 
// 		79:(o)=>{console.trace();				if(y<height){ y=y+1;	return 57; }else{  return false;  }  	  },
// 		73:(i)=>{				if(x>0){  x=x-1;  		return 80; }else{  return false;  }  	  },
// 		80:(p)=>{				if(x<width){  x=x+1;  return 73; }else{  return false;  } 	  },
// 	},
// 	"runToSelfConditionEnd":{
// 		53:(five)=>{
// 			let f=frameCount;
// 			return function(){
// 				if(y>0){  y=y-1; }else{   return false; } if(frameCount>=f+30){ return false; }else{ return 84 ;  }
// 			}
// 		},
// 		84:(t)=>{
// 		let f=frameCount;
// 			return function(){
// 				if(y<height){  y=y+1; }else{   return false; } if(frameCount>=f+30){ return false; }else{ return 53 ;  }
// 			}
// 		},
// 		82:(r)=>{
// 		let f=frameCount;
// 			return function(){
// 				if(x>0){  x=x-1; }else{   return false; } if(frameCount>=f+30){ return false; }else{ return 89 ;  }
// 			}
// 		},
// 		89:(y)=>{
// 		let f=frameCount;
// 			return function(){
// 				if(x<width){  x=x+1; }else{   return false; } if(frameCount>=f+30){ return false; }else{ return 82 ;  }
// 			}
// 		},
// 	}
// }
// function setKeyFuncInKeyPressed(){	
// 	if(typeof keyList == 'undefined'){
// 		keyList={};
// 	}
// 	if(typeof keyRunning == 'undefined'){
// 		keyRunning={};
// 	}

// 	keyList[keyCode]=true;

// 	Object.keys(keyFunc.once).map(i=>{
// 		if(i==keyCode){
// 			keyFunc.once[i]();
// 		}
// 	});

// 	Object.keys(keyFunc.runToEnd).map(i=>{
// 		if(i==keyCode){
// 			keyRunning[i]=keyFunc.runToEnd[i];
// 		}
// 	});

// 	Object.keys(keyFunc.pressAgainToStop).map(i=>{ /* press again to stop self */
// 		if(i==keyCode){
// 			if(Object.keys(keyRunning).indexOf(i)==-1 ){
// 				keyRunning[i]=keyFunc.pressAgainToStop[i];
// 			}else{
// 				delete(keyRunning[i])
// 			}			
// 		}
// 	});


// 	Object.keys(keyFunc.pressReverseStopGoReverse).map(i=>{ /* press again to stop self ; for stop by reverse key, setting in draw()_keyIsPressed */
// 		if(i==keyCode){
// 			if(Object.keys(keyRunning).indexOf(i)==-1 ){
// 				keyRunning[i]=keyFunc.pressReverseStopGoReverse[i];
// 				let closeTarget=keyFunc.pressReverseStopGoReverse[i]();
// 				if(Object.keys(keyRunning).indexOf(closeTarget+'')!=-1){
// 					delete(keyRunning[closeTarget]);
// 				} 
// 			}else{
// 				delete(keyRunning[i])
// 			}		
// 		}
// 	});


// 	Object.keys(keyFunc.runToSelfConditionEnd).map(i=>{ /* press again to stop self ; for stop by reverse key, setting in draw()_keyIsPressed */
// 		if(i==keyCode){
// 			if(Object.keys(keyRunning).indexOf(i)==-1 ){
// 				keyRunning[i]=keyFunc.runToSelfConditionEnd[i]();
// 				let closeTarget=keyRunning[i]();

// 				if(Object.keys(keyRunning).indexOf(closeTarget+'')!=-1){
// 					delete(keyRunning[closeTarget]);
// 				} 
// 			}else{
// 				delete(keyRunning[i])
// 			}		
// 		}
// 	});
// 	}
// function setKeyFuncInKeyReleased(){delete(keyList[keyCode]);}
// function runKeyFuncInDraw(){
// 	if(typeof keyList == 'undefined'){
// 		keyList={};
// 	}
// 	if(typeof keyRunning == 'undefined'){
// 		keyRunning={};
// 	}
// 	if (keyIsPressed === true) {
// 	  // console.log('keyIsPressed'+keyCode);
// 	  // console.log(JSON.stringify(keyList));
// 		// console.log(keyCode);
// 		// console.log(Object.keys(keyList));

// 		Object.keys(keyFunc.hold).map(i=>{
// 			if(Object.keys(keyList).indexOf(i)!=-1){
// 				keyFunc.hold[i]();
// 			}
// 		});		
// 	}
// 	Object.keys(keyRunning).map(i=>{
// 		let result=keyRunning[i]();	
// 		let runningList=Object.keys(keyRunning);

// 		if(Object.keys(keyRunning).indexOf(result+'')!=-1){
// 			delete(keyRunning[result]);
// 		}
// 		if(result === false){
// 			delete(keyRunning[i])
// 		}


// 	});

// }

function preload() {
	titleFont = loadFont('../font/Xhers Regular.otf');
	fontOfText = loadFont('../font/NimbusSanL-Reg.otf');
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	background(0);
	x = width / 2;
	y = height / 2;
	r = width / 50;
	d = height / 50;

	//keyFuncDemo is a demo settings of keys to events \ functions
	keyFunc = new KeyboardCtrl(keyFuncDemo, 60);
	demoObj = obj_copy_fn2txt(keyFuncDemo);
	demoText = 'keyFuncDemo = \n' + JSON.stringify(demoObj, ' ', 2).replace(/\s*([\{\}])\s*/g, '$1').replace(/(\},\n)/g, '$1\n') +
		'\n\nkeyFunc = new KeyboardCtrl( settingObj = keyFuncDemo, holdFrame = 60 );';
}

function draw() {

	keyFunc.main();

	background(0, 125);
	//update the running line of  left bottom hint text 
	showingHintText = hintText;
	if (Object.keys(keyFunc.running).length > 0) {
		showingHintText = hintText.split('\n').map(line => {
			if (line.indexOf('=>') == -1) {
				return line;
			}
			let l = line.replace(/([^ ]) /g, '$1').split('=>')[0].replace(/ *$/, '');
			let spliter = l.indexOf(' ') == -1 ? '' : ' ';
			if (l.split(spliter).filter(i => i.length > 0).every(k => keyFunc.runningText.split(', ').indexOf(k) == -1)) {
				return line;
			} else {
				let freqFC = 30;
				let addText = frameCount % freqFC > freqFC / 2 ? '>' : '_'
				return addText + ' ' + line;
			}
		}).join('\n');
	}

	// update the strokeWeight of the circle
	if (Object.keys(keyFunc.running).length > 0 && stroke_weight < stroke_weight_max) {
		stroke_weight = stroke_weight < stroke_weight_max ? stroke_weight + stroke_weight_speed : stroke_weight;
	} else if (Object.keys(keyFunc.running).length == 0 && stroke_weight > stroke_weight_min) {
		stroke_weight = stroke_weight > stroke_weight_min ? stroke_weight - stroke_weight_speed : stroke_weight;
	}

	//draw the circle
	push();
	stroke(255);
	strokeWeight(stroke_weight);
	noFill()
	let ctx = drawingContext;
	ctx.shadowBlur = 4;
	ctx.shadowColor = "rgba(255,255,255,0.6)";
	ellipse(x, y, r + d, r + d);
	pop();
	//draw the circle end

	//hintText start
	fill(155);
	noStroke();
	textAlign(LEFT, BOTTOM);
	textSize(textSize() * 1.5);
	textLeading(textSize() * 2);

	//block for hintText start
	push();
	strokeJoin(ROUND);
	ctx = drawingContext;
	ctx.shadowBlur = textWidth(' ') / 3;
	ctx.shadowColor = `rgba(255,255,255,${keyblockGlowAlpha})`;
	showingHintText.split('\n').map((sentence, idx, arr) => {

		let blockSpacing = textWidth(' ') / 6;
		const startX = globalMargin, startY = height - globalMargin,
			lineH = textLeading(), y1 = startY - (arr.length - idx - 1) * lineH,
			y2 = y1 - textAscent();

		if (sentence.indexOf('=>') == -1) { return }
		let leftpart = sentence.split('=>')[0].replace(/\s*$/g, '');
		let spliter = leftpart.match(/[\s\ufe00-\ufe0f]{2,}/) ? /[\s\ufe00-\ufe0f]{2,}/ : /[\s\ufe00-\ufe0f]/;

		let leftStart = 0;
		if (leftpart.match(/^[>_] /) &&

			leftpart.replace(/^[>_] /, '').split(spliter).some(k => keyFunc.runningText.split(', ').indexOf(k))) {
			leftStart = textWidth(leftpart.split(' ')[0] + ' ');
			leftpart = leftpart.replace(/^[>_] /, '');
		}

		leftpart.split(spliter).map((word) => {
			let spacing = blockSpacing, strokeweight = keyblockStrokeWeight;
			if (leftpart.match(/^[>_] /) &&
				leftpart.replace(/^[>_] /, '').split(spliter).some(k => keyFunc.runningText.match(k)) &&
				word.match(/^[>_]/)
			) {
				return
			}

			let start = leftpart.indexOf(word), end = start + leftpart.indexOf(leftpart.split(word)[0]) + word.length;

			// console.log(Boolean(leftpart.match(/  /)), spliter, spliter.length, start, end, word, leftpart, leftpart, leftpart.slice(0, start), leftpart.slice(0, end));
			let x1 = leftStart + startX + textWidth(leftpart.slice(0, start)), x2 = leftStart + startX + textWidth(leftpart.slice(0, end));
			// console.log(spliter, '|', word, '|', leftpart, '|', start, '|', end, '|', leftpart.slice(0, start), x1, leftpart.slice(0, end), x2, y1, y2);

			noFill();
			const offsetIn = blockSpacing - keyblockStrokeWeight / 2, offsetOut = blockSpacing + keyblockStrokeWeight / 2;

			let strokeC = keyblockStrokeC, fillC = keyblockFillC;


			if (Object.keys(keyFunc.running).length > 0 && keyFunc.runningText.split(', ').indexOf(word) != -1) {
				strokeC = lerpColor(color(255),
					color(keyblockStrokeC),
					(Math.sin((frameCount % keyblockGlowFrame) / keyblockGlowFrame * Math.PI * 2) + 1) / 2);
				spacing = blockSpacing * 2
			} else if (Object.keys(keyFunc.running).length > 0) {
				strokeC = keyblockStrokeC;
				spacing = blockSpacing * 0.25, strokeweight = keyblockStrokeWeight * 0.25;
			}
			strokeWeight(spacing + strokeweight);
			stroke(strokeC);
			rect(x1 - offsetOut, y1 + offsetOut,
				x2 - x1 + 2 * offsetOut, y2 - y1 - 2 * offsetOut);


			strokeWeight(spacing);
			stroke(keyblockFillC);
			rect(x1 - offsetIn, y1 + offsetIn,
				x2 - x1 + 2 * offsetIn, y2 - y1 - 2 * offsetIn);

			fill(keyblockFillC);
			rect(x1 - spacing, y1 + spacing,
				x2 - x1 + 2 * spacing, y2 - y1 - 2 * spacing);

		});
		// debugger;
	})
	pop();
	//block for hintText end

	text(showingHintText,
		globalMargin, globalMargin, width * 2, height - globalMargin * 2);

	textSize(textSize() / 1.5);
	textLeading(textSize() * 2);
	//hintText end

	//bg hintText start
	push();
	let textW = textWidth(hintText.split('\n').sort((a, b) => a.length - b.length)[0]),
		textH = textLeading() * hintText.split('\n').length;
	textSize(Math.max((width - globalMargin * 2) / textW, (height - globalMargin * 2) / textH) * textSize());
	textLeading(textSize() * 1.5);
	fill(255, 10);
	text(hintText, globalMargin, height - globalMargin);
	pop();
	// bg hintText end

	//left top running text
	textAlign(LEFT, TOP);
	text(keyFunc.text().replace(/(.)/g, '$1 '), globalMargin, globalMargin, width - globalMargin, height / 2);
	//left top running text end

	// right side text
	// title \ demo detail text \ description and author
	typo();
	// right side text end
}




function typo() {
	if (typeof toTitleUpperCase == 'undefined') { toTitleUpperCase = function () { return arguments } }
	if (typeof globalMargin != 'number') { globalMargin = 48; }

	const padding = 10, frameColor = 'rgba(255,255,255,0.64)', lineHeight = 1.5;
	const titleSizeK = 4, textSizeK = 0.8, demoSizeK = 0.5;
	let titleText = 'keyboardCtrl';
	let discriptText = 'a js tool for multi ctrl from keyboard to p5js\ncoding by leizingyiu';
	discriptText = toTitleUpperCase(discriptText);


	push();
	textSize(Math.min(width, height) / 20);

	fill(frameColor);
	noStroke();
	textSize(Math.min(width, height) / 48);

	// right top
	textAlign(RIGHT, TOP);
	textFont(titleFont);
	textSize(textSize() * titleSizeK);
	textLeading(textSize() * lineHeight);
	text(titleText, width - globalMargin - textWidth(titleText[0]) / 4, globalMargin + padding);
	textSize(textSize() / titleSizeK);


	//right mid demo text
	let titleH = textAscent() + textSize() * titleSizeK;
	textSize(textSize() * demoSizeK);
	textFont(fontOfText);
	textLeading(textSize() * lineHeight);

	let detailW = textWidth(demoText.split('\n').sort((a, b) => b.length - a.length)[0]),
		detailH = demoText.length * textLeading();
	demoDetailX_1 = width - globalMargin,
		demoDetailX_0 = demoDetailX_1 - detailW,
		demoDetailY_0 = globalMargin + padding + titleH,
		demoDetailY_1 = demoDetailY_0 + detailH;

	if (demoDetailBigBoo == false) {
		push();
		fill(168);
		text(demoText, width - globalMargin, globalMargin + padding + titleH);
		pop();
	} else {
		push();
		zoomK = 2;
		let offsetY = map(mouseY, demoDetailY_0, demoDetailY_1, 0, -detailH * zoomK + detailH);
		textSize(textSize() * zoomK);
		textLeading(textLeading() * zoomK);
		fill(222);
		let ctx = drawingContext;
		ctx.shadowBlur = 4;
		ctx.shadowColor = "rgba(0,0,0,0.8)";
		text(demoText, globalMargin, globalMargin + padding + titleH + offsetY, width - globalMargin * 2, height * zoomK);
		pop();
	}
	textSize(textSize() / demoSizeK);


	//right bottom
	textFont(fontOfText);
	textSize(textSize() * textSizeK);
	textLeading(textSize() * lineHeight);
	textAlign(RIGHT, BOTTOM);
	text(discriptText, width - globalMargin, height - globalMargin - padding);
	textSize(textSize() / textSizeK);




	//right top
	textFont(titleFont);
	stroke(frameColor);
	textSize(textSize() * titleSizeK);
	strokeWeight(1);
	line(width - globalMargin, globalMargin,
		width - globalMargin - textWidth(titleText) - textWidth(titleText[0]) / 4, globalMargin);
	textSize(textSize() / titleSizeK);


	//right bottom
	textFont(fontOfText);
	textSize(textSize() * textSizeK);
	line(width - globalMargin, height - globalMargin,
		width - globalMargin - Math.max(...discriptText.split('\n').map(i => textWidth(i))), height - globalMargin);
	textSize(textSize() / textSizeK);

	pop();


}
function windowResized() {
	let bw = width, bh = height;
	resizeCanvas(windowWidth, windowHeight);
	x = x / bw * width, y = y / bh * height;
}


function obj_copy_fn2txt(obj) {
	let o = {};
	Object.keys(obj).map(k => {
		if (typeof k == 'number') {
			k = String(k);
		}
		if (typeof obj[k] == 'object') {
			o[k] = obj_copy_fn2txt(obj[k]);
		} else if (typeof obj[k] == 'function') {
			o[k] = String(obj[k]).replace(/\s+/g, ' ');
		} else {
			o[k] = obj[k];
		}
	});
	return o;
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

function mouseMoved() {
	if (mouseX > demoDetailX_0 && mouseX < demoDetailX_1) {
		demoDetailBigBoo = true;
		cursor('zoom-in');
	} else {
		demoDetailBigBoo = false;
		cursor(ARROW);
	}
}