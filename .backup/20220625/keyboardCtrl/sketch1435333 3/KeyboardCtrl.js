/*  TODO 
CONSOLE OR DISPLAY ON OFF
*/

keyFuncSetup = {
	/*return false to stop*/

	"hold": {
		87: (w) => { y = (y - 1 + height) % height; },/* w */
		83: (s) => { y = (y + 1 + height) % height; },/* s */
		65: (a) => { x = (x - 1 + width) % width; },/* a */
		68: (d) => { x = (x + 1 + width) % width; },/* d */
		"shift_87": (w) => { y = (y - 1 + height) % height; },/* shift left */
		"shift_83": (s) => { y = (y + 1 + height) % height; },/* up */
		"shift_65": (a) => { x = (x - 1 + width) % width; },/* right */
		"shift_68": (d) => { x = (x + 1 + width) % width; },/* down */
	},/* release to stop */

	"once": {
		37: (left) => { x = (x - 100 + width) % width; return false; },/* left */
		38: (up) => { y = (y - 100 + height) % height; return false; },/* up */
		39: (right) => { x = (x + 100 + width) % width; return false; },/* right */
		40: (down) => { y = (y + 100 + height) % height; return false; },/* down */
		32: (space) => { x = width / 2; y = height / 2; return false; },/* space */
	},/* hit to play once */

	"runToEnd": {
		85: (u) => { if (y > 0) { y = y - 1; } else { return false; } },
		74: (j) => { if (y < height) { y = y + 1 } else { return false; } },
		72: (h) => { if (x > 0) { x = x - 1; } else { return false; } },
		75: (k) => { if (x < width) { x = x + 1; } else { return false; } },
	},/* return false to stop  */

	"pressAgainToStop": {
		70: (f) => { y = y - 1; },
		86: (v) => { y = y + 1; },
		67: (c) => { x = x - 1; },
		66: (b) => { x = x + 1; },
	},/*press same key to stop */

	"pressReverseStopGoReverse": {
		57: (nine) => {
			if (y > 0) {
				y = y - 1;
				return 79;
			} else {
				return false;
			}
		},
		/*return keyCode =>target stop; return false => self stop */
		79: (o) => { console.trace(); if (y < height) { y = y + 1; return 57; } else { return false; } },
		73: (i) => { if (x > 0) { x = x - 1; return 80; } else { return false; } },
		80: (p) => { if (x < width) { x = x + 1; return 73; } else { return false; } },
	},/* return false to stop ,return num to stop the other keycode func */

	"runToSelfConditionEnd": {
		53: (five) => {
			let f = frameCount;
			return function () {
				if (y > 0) {
					y = y - 1;
				} else {
					return false;
				}
				if (frameCount >= f + 30) {
					return false;
				} else {
					return 84;
				}
			}
		},
		84: (t) => {
			let f = frameCount;
			return function () {
				if (y < height) { y = y + 1; } else { return false; } if (frameCount >= f + 30) { return false; } else { return 53; }
			}
		},
		82: (r) => {
			let f = frameCount;
			return function () {
				if (x > 0) { x = x - 1; } else { return false; } if (frameCount >= f + 30) { return false; } else { return 89; }
			}
		},
		89: (y) => {
			let f = frameCount;
			return function () {
				if (x < width) { x = x + 1; } else { return false; } if (frameCount >= f + 30) { return false; } else { return 82; }
			}
		},
	},/* return false to stop ,return num to stop the other keycode func */

	"pressAgainToAccelerateHoldToStop": {
		49: (t = 2) => { /*key 1 */
			let tempT = t;
			return (T = tempT) => {
				r = (r + T + 400) % 400;
				return 2 + T;/* press same key accelerate */
			}
		},

		50: (t = 1) => {/*key 2*/
			let tempT = t;
			return (T = tempT) => {
				r = (r - T + 400) % 400;
				return 2 + T;/* press same key accelerate */
			}
		},
	},/*return para to accelerate the next pressing */

	"pressAgainToLoopHoldToStop": {
		"shift_51"/*key 3*/: {
			fnOnce: () => {
				r = (r + 233 + 600) % 600;
				// console.log('51,fnOnce');
			},
			fnContinue: (f) => {
				let s = Math.sin(f / 300 * Math.PI);
				r = (r + s);
				// console.log('51,fnContinue,f='+f);
			},
			endBooByFalseNum: 1
		},
		"opt_52"/*key ` */: {
			fnOnce: () => {
				r = (r + 33 + 600) % 600;
				// console.log('52,fnOnce');
			},
			fnContinue: (f) => {
				r = r - 2;
			},
			endBooByFalseNum: 1
		},


	}
}

class KeyboardCtrl {
	constructor(obj, holdFrame, keySeparator = '_') {
		this.funcName = ['hold', 'once', 'runToEnd', 'pressAgainToStop', 'pressReverseStopGoReverse', 'runToSelfConditionEnd'];
		this.obj = obj;
		this.func = obj;
		// this.keyList={};
		this.keyRunning = {};
		console.log(this.keyRunning);
		this.runningList = {};
		this.holdFrame = holdFrame;
		this.holdList = {};
		this.pressedList = {};
		this.loopList = {};
		{// let agent = navigator.userAgent.toLowerCase();
			// let isWin = agent.indexOf("win") >= 0 || agent.indexOf("wow") >= 0;
			// let isMac = /macintosh|mac os x/i.test(navigator.userAgent);
			// let isAndroid = agent.indexOf('Android') > -1 || agent.indexOf('Adr') > -1; //android终端
			// let isiOS = !!agent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
			// let os = isWin || isAndroid ? 'win' : (isMac || isiOS ? 'mac' : 'else');
			// this.modifierKeysList={win:{win:91,windows:91,meta:91,contextmenu:93,menu:93,alt:18,control:17,ctrl:17,shift:16},mac:{meta:[91,93],cmd:[91,93],commamd:[91,93],alt:18,opt:18,option:18,control:17,ctrl:17,shift:16},else:{}};
			// this.modifierKey = this.modifierKeysList[os];
		}
		this.modifierKey = {
			"win": 91,
			"windows": 91,
			'meta': 91,
			"contextmenu": 93,
			'menu': 93,
			"alt": 18,
			"control": 17,
			"ctrl": 17,
			"shift": 16,
			"meta": [91, 93],
			"cmd": [91, 93],
			"commamd": [91, 93],
			"opt": 18,
			"option": 18,
		};
		this.keySeparator = keySeparator;






		this.runnerFuncList = {
			// 'shift_52': 原来 if (condition) {  这里的东西  }
		};

		this.runnerNameList = {
			// 'shift_52':[16,52];
		}

		this.keycodeRunnerList = {
			// 16:'shift_52',
			// 52:'shift_52',
		};



		// console.log(['this.runnerFuncList\n', JSON.stringify(this.runnerFuncList), '\n\nthis.runnerNameList\n', JSON.stringify(this.runnerNameList), '\n\nthis.keycodeRunnerList\n', JSON.stringify(this.keycodeRunnerList)].join('\n'));

	}

	init() {
		let funcGenerators = {
			"hold": (deKey, deValue) => {
				let K = deKey, V = deValue;
				return function (k = K, v = V) {
					console.log(k, v, this.keyRunning);

					this.keyRunning[k] = v;

				};
			},/* release to stop */

			"once": (key, value) => {
				let k = key, v = value;
				return function () {
					v();
				}
			}/* hit to play once */

		};

		let obj = this.obj;
		Object.keys(obj).map(type => {

			console.log(this.keyRunning, type, Object.keys(funcGenerators), type in funcGenerators);

			if (type in funcGenerators) {
				Object.keys(obj[type]).map(key => {
					this.runnerFuncList[key] = funcGenerators[type](key, obj[type][key]);

					// this.runnerFuncList[key] = '1';

					console.log(key, ' | ', obj[type][key], ' | ', this.runnerFuncList[key]);
					console.log(funcGenerators);
					console.log(this.runnerFuncList);
					this.runnerFuncList[key]();
					debugger;

					let arr = key.split(this.keySeparator).map(i => i.toLowerCase());
					let keyCodeArr = arr.map(i => {
						let code = i.match(/^\d+$/) == null ? this.modifierKey[i] : i;
						code = typeof code == "undefined" ? false : code;
						return code;
					});
					if (keyCodeArr.some((i) => i == false)) {
						console.error(` ${type} : ${key} contains key(s) not in modifierKeys list `);
						return false;
					}

					keyCodeArr.map(i => {
						if (typeof this.keycodeRunnerList[i] == 'undefined') {
							this.keycodeRunnerList[i] = [];
						}
						this.keycodeRunnerList[i].push(key);
					});

					this.runnerNameList[key] = keyCodeArr;
				})
			}
		});
	}

	runFuncInPressed() {
		this.pressedList[keyCode] = true;

		let containList = {};
		let allFuncs = [];
		Object.keys(this.pressedList).map(key => {
			if (key in this.keycodeRunnerList) {
				containList[key] = this.keycodeRunnerList[key];
				allFuncs = allFuncs.concat(containList[key]);
			}
		});
		allFuncs = [...new Set(allFuncs)];
		console.log([allFuncs, containList, this.pressedList]);

		Object.keys(containList).map(key => {
			allFuncs = allFuncs.filter(v => containList[key].includes(v));
		});

		allFuncs.map(key => {
			if (key in this.runnerNameList && this.runnerNameList[key].every(v => v in this.pressedList)) {
				if (key in this.runnerFuncList) {
					//  this.runnerFuncList[key]();
					console.log(key);
				}
			}
		});
		debugger;

		// console.log(allFuncs)
	}

	keyDetector(str, separator = this.keySeparator) {
		let arr = str.split(separator).map(i => i.toLowerCase());

		let keyCodeArr = arr.map(i => {
			let code = i.match(/^\d+$/) == null ? this.modifierKey[i] : i;
			code = typeof code == "undefined" ? false : code;
			return code;
		});
		// console.trace();
		//console.log('keyDetector  ',str,arr);

		if (keyCodeArr.some((i) => i == false)) {
			console.error(` ${str} contains key(s) not in modifierKeys list `);
			return false;
		}
		return (keyCodeArr.every(i => this.pressedList.hasOwnProperty(i)));

	}

	loopFuncGenerator(frameCountArr, fnOnce, fnContinue, endBooByFalseNum = 2) {
		let dura_ = Math.max(...frameCountArr) - Math.min(...frameCountArr);
		let start_ = Math.min(...frameCountArr);
		let ar_ = frameCountArr.map(i => i - start_);
		// console.log('loopFuncGenerator '+frameCountArr,dura_,start_,ar_);

		return (dura = dura_, start = start_, ar = ar_) => {
			let f = frameCount;
			let result = dura == 0 ? fnContinue(f - start) : true;
			if (result === false) { return false; }

			let t = (f - start) % dura;
			let beforeAr = ar.map(i => i > t ? false : i).filter(i => typeof i == 'number');
			let justBefore = Math.max(...beforeAr);

			if (dura == 0) { return }

			let result1 = 0, result2 = 0, falseNum = 0;

			// console.log(typeof f, typeof start,typeof dura);
			// console.log( f,  start, dura);
			// console.log(((f-start) % dura));
			// console.log('loopFunc1 ',' f',f,',dura',dura,',start',start,
			// 						',ar',ar,',t',t,((f-start) % dura),
			// 						',justBefore',justBefore,',beforeAr',beforeAr);
			// debugger;


			if (ar.indexOf(t) != -1) {
				result1 = fnOnce();
				result1 = result1 === false ? 1 : 0;
			}
			result2 = fnContinue(justBefore == 0 ? t : t % justBefore);
			result2 = result2 === false ? 1 : 0;

			falseNum = result1 + result2;

			// console.log('loopFunc2 ',f,dura,start,ar,t,justBefore,t%justBefore,' | ',
			// 						falseNum,result1,result2);

			if (falseNum >= endBooByFalseNum) {
				return false;
			}
			// debugger;
		}
	}
	setKeyFuncInKeyPressed() {
		// console.log('setKeyFuncInKeyPressed');

		this.pressedList[keyCode] = true;

		Object.keys(this.func.hold).map(i => {/* hold 的，按着才运行， 松手在 released 那 delete掉 */
			if (this.keyDetector(i)) {
				this.keyRunning[i] = this.func.hold[i];
			}
		});

		Object.keys(this.func.once).map(i => { /* once 的， 按下直接运行，不添加到running*/
			if (this.keyDetector(i)) {
				this.func.once[i]();
			}
		});

		Object.keys(this.func.runToEnd).map(i => { /* runToEnd 的，按下添加到 running，内部返回 false 时 在 draw 里面删除自身*/
			if (this.keyDetector(i)) {
				this.keyRunning[i] = this.func.runToEnd[i];
			}
		});

		Object.keys(this.func.pressAgainToStop).map(i => { /* pressAgainToStop 的，检测running里面是否包含，如果有，按下删除；如果冇，按下添加  */
			if (this.keyDetector(i)) {
				if (Object.keys(this.keyRunning).indexOf(i) == -1) {
					this.keyRunning[i] = this.func.pressAgainToStop[i];
				} else {
					delete (this.keyRunning[i])
				}
			}
		});

		Object.keys(this.func.pressReverseStopGoReverse).map(i => { /* 
		press again to stop self ; for stop by reverse key, setting in draw()_keyIsPressed 
		pressReverseStopGoReverse 的，先检测running里面是否包含，如果有，按下删除；如果冇，按下添加，并且继续检测按下程序返回值，如果running包含返回值，删除返回值的func
		*/
			if (this.keyDetector(i)) {
				if (Object.keys(this.keyRunning).indexOf(i) == -1) {
					this.keyRunning[i] = this.func.pressReverseStopGoReverse[i];
					let closeTarget = this.func.pressReverseStopGoReverse[i]();
					if (Object.keys(this.keyRunning).indexOf(closeTarget + '') != -1) {
						delete (this.keyRunning[closeTarget]);
					}
				} else {
					delete (this.keyRunning[i])
				}
			}
		});

		Object.keys(this.func.runToSelfConditionEnd).map(i => { /* 
		press again to stop self ; for stop by reverse key, setting in draw()_keyIsPressed 
		runToSelfConditionEnd 的，先检测running里面是否包含，如果有，按下删除；如果冇，按下运行程序，获得内部返回值作为程序添加到running，
			并且继续检测添加的内部返回程序的运行返回值，如果running包含运行返回值，删除返回值的func；
			在running程序中，触发停止条件，则返回false，删除自身；
		*/
			if (this.keyDetector(i)) {
				if (Object.keys(this.keyRunning).indexOf(i) == -1) {
					this.keyRunning[i] = this.func.runToSelfConditionEnd[i]();
					let closeTarget = this.keyRunning[i]();
					if (Object.keys(this.keyRunning).indexOf(closeTarget + '') != -1) {
						delete (this.keyRunning[closeTarget]);
					}
				} else {
					delete (this.keyRunning[i])
				}
			}
		});

		Object.keys(this.func.pressAgainToAccelerateHoldToStop).map(i => {
			/*
			pressAgainToAccelerateHoldToStop ,先检测running里面是否包含，如果冇，按下运行程序，获得内部返回值作为程序添加到running；
			如果有，按下时候不进行动作，释放时候，运行现有程序获得返回值，将返回值作为参数运行来源函数，得到新的返回函数添加到running；
			按下时检测holdList中是否有keyCode，如果冇则添加；在release中移除；
			在draw中，给 holdList[keyCode]计数，数字大于this.holdFrame，删除 running以及 holdList[keyCode]
				在running程序中，触发停止条件，则返回false，删除自身；
			*/
			if (this.keyDetector(i)) {
				if (Object.keys(this.keyRunning).indexOf(i) == -1) {
					this.keyRunning[i] = this.func.pressAgainToAccelerateHoldToStop[i]();
				}
				if (Object.keys(this.holdList).indexOf(i) == -1) {
					this.holdList[i] = 0;
				}
			}
		});

		/* TODO */
		Object.keys(this.func.pressAgainToLoopHoldToStop).map(i => {
			/*		pressAgainToLoopHoldToStop ,先检测running里面是否包含，如果冇，按下添加到running；
						如果有，按下时候不进行动作，释放时候，运行现有程序获得返回值，将返回值作为参数运行来源函数，得到新的返回函数添加到running；
						按下时检测holdList中是否有keyCode，如果冇则添加；在release中移除；
						在draw中，给 holdList[keyCode]计数，数字大于this.holdFrame，删除 running以及 holdList[keyCode]
							在running程序中，触发停止条件，则返回false，删除自身；
						*/

			if (this.keyDetector(i)) {
				if (Object.keys(this.loopList).indexOf(i) == -1) {
					this.loopList[i] = [];
				}
				this.loopList[i].push(frameCount);
				if (Object.keys(this.holdList).indexOf(i) == -1) {
					this.holdList[i] = 0;
				}

				this.keyRunning[i] = this.loopFuncGenerator(
					this.loopList[i],
					this.func.pressAgainToLoopHoldToStop[i].fnOnce,
					this.func.pressAgainToLoopHoldToStop[i].fnContinue,
					this.func.pressAgainToLoopHoldToStop[i].endBooByFalseNum
				);

			}
		});



	}


	setKeyFuncInKeyReleased() {
		// delete(this.keyList[keyCode]);

		delete (this.pressedList[keyCode]);

		Object.keys(this.func.hold).map(i => {
			if (i == keyCode) {
				delete (this.keyRunning[i])
			}
		});

		delete (this.holdList[keyCode]);

		Object.keys(this.holdList).map(i => {
			if (i == keyCode) {

				if (this.holdList[i] < this.holdFrame &&
					Object.keys(this.func.pressAgainToAccelerateHoldToStop).indexOf(i) != -1) {
					let arg = this.keyRunning[i]();
					arg = typeof arg == "object" ? arg : [arg];
					this.keyRunning[i] = this.func.pressAgainToAccelerateHoldToStop[i](...arg);
				}
				if (this.holdList[i] >= this.holdFrame) {
					delete (this.keyRunning[i]);
				}

				// delete(this.holdList[keyCode]);

			}
		});

	}
	consoleRunningList() {
		let nowRunningList = Object.keys(this.keyRunning).toString();
		let justRunningList = Object.keys(this.runningList).toString();
		if (justRunningList != nowRunningList && nowRunningList.length != 0) {
			console.log("now running: " + nowRunningList);
		} else if (justRunningList != nowRunningList) {
			console.log("now running: nothing");
		}
	}
	updateRunningList() {
		Object.keys(this.runningList).map(i => {
			if (Object.keys(this.keyRunning).indexOf(i) == -1) {
				delete (this.runningList[i]);
			}
		});
		Object.keys(this.keyRunning).map(i => {
			if (Object.keys(this.runningList).indexOf(i) == -1) {
				this.runningList[i] = true;
			}
		});
	}
	runKeyFuncInDraw() {
		this.consoleRunningList();

		if (keyIsPressed === true) {
			// console.log(this.holdList);
			Object.keys(this.holdList).map(i => {
				if (this.keyDetector(i)) {
					this.holdList[i] = Number(this.holdList[i]) + 1;
				}
				// this.holdList[i]=Number(this.holdList[i])+1;
				if (this.holdList[i] >= this.holdFrame) {

					delete (this.keyRunning[i]);
					delete (this.holdList[i]);
					delete (this.loopList[i]);

					// debugger;
				}
			});
		}

		Object.keys(this.keyRunning).map(i => {
			let result = this.keyRunning[i]();
			if (Object.keys(this.keyRunning).indexOf(result + '') != -1) {
				delete (this.keyRunning[result]);
			}
			if (result === false) {
				delete (this.keyRunning[i])
			}
		});

		this.updateRunningList();

	}


}

/* TODO 
组合键 holding 关闭

*/

