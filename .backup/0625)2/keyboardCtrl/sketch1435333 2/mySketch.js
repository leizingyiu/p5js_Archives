var x,y,r,d,keyFunc;
function setup() {
	createCanvas(windowWidth, windowHeight);
	background(100);
	x=width/2;
	y=height/2;
	r=width/50;
	d=height/50;
	
	keyFunc=new KeyboardCtrl(keyFuncSetup,60);
}

function draw() {
	keyFunc.runKeyFuncInDraw();
	
	background(0,5);
	// let runningList=Object.keys(keyRunning);
	// console.log(runningList);
	
	// runKeyFuncInDraw();
	stroke(200);
	noFill()

ellipse(x, y, r+d, r+d);

fill(155);
	noStroke();
textLeading(24);
text(`
wsad => hold
ujhk => runToEnd
⬆️⬇️⬅️➡️ space => once
fvcb => pressAgainToStop
9oip => pressReverseStopGoReverse
5try => runToSelfConditionEnd
`,width/2,height/2,width,height);
	
}



function keyPressed(){	
		console.log('keyPressed '+keyCode+' '+key);

	keyFunc.setKeyFuncInKeyPressed();
}

function keyReleased(){
	console.log('keyReleased '+keyCode+' '+key);

	keyFunc.setKeyFuncInKeyReleased();
}

function keyTyped(){
console.log('keyTyped '+keyCode+' '+key);
}




// const keyFunc={
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