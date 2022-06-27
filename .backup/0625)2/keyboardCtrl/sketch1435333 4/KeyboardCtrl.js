/*  TODO 
CONSOLE OR DISPLAY ON OFF
*/



keyFuncSetup = {
	/*return false to stop*/

	"hold": {
		87: (w) => {
			y = (y - 1 + height) % height;
		},
		/* w */
		83: (s) => {
			y = (y + 1 + height) % height;
		},
		/* s */
		65: (a) => {
			x = (x - 1 + width) % width;
		},
		/* a */
		68: (d) => {
			x = (x + 1 + width) % width;
		},
		/* d */
		"shift_87": (w) => {
			y = (y - 1 + height) % height;
		},
		/* shift left */
		"shift_83": (s) => {
			y = (y + 1 + height) % height;
		},
		/* up */
		"shift_65": (a) => {
			x = (x - 1 + width) % width;
		},
		/* right */
		"shift_68": (d) => {
			x = (x + 1 + width) % width;
		},
		/* down */
	},
	/* release to stop */

	"once": {
		37: (left) => {
			x = (x - 100 + width) % width;
			return false;
		},
		/* left */
		38: (up) => {
			y = (y - 100 + height) % height;
			return false;
		},
		/* up */
		39: (right) => {
			x = (x + 100 + width) % width;
			return false;
		},
		/* right */
		40: (down) => {
			y = (y + 100 + height) % height;
			return false;
		},
		/* down */
		32: (space) => {
			x = width / 2;
			y = height / 2;
			return false;
		},
		/* space */
	},
	/* hit to play once */

	"runToEnd": {
		85: (u) => {
			if (y > 0) {
				y = y - 1;
			} else {
				return false;
			}
		},
		74: (j) => {
			if (y < height) {
				y = y + 1
			} else {
				return false;
			}
		},
		72: (h) => {
			if (x > 0) {
				x = x - 1;
			} else {
				return false;
			}
		},
		75: (k) => {
			if (x < width) {
				x = x + 1;
			} else {
				return false;
			}
		},
	},
	/* return false to stop  */

	"pressAgainToStop": {
		70: (f) => {
			y = y - 1;
		},
		86: (v) => {
			y = y + 1;
		},
		67: (c) => {
			x = x - 1;
		},
		66: (b) => {
			x = x + 1;
		},
	},
	/*press same key to stop */

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
		79: (o) => {
			if (y < height) {
				y = y + 1;
				return 57;
			} else {
				return false;
			}
		},
		73: (i) => {
			if (x > 0) {
				x = x - 1;
				return 80;
			} else {
				return false;
			}
		},
		80: (p) => {
			if (x < width) {
				x = x + 1;
				return 73;
			} else {
				return false;
			}
		},
	},
	/* return false to stop ,return num to stop the other keycode func */

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
				if (y < height) {
					y = y + 1;
				} else {
					return false;
				}
				if (frameCount >= f + 30) {
					return false;
				} else {
					return 53;
				}
			}
		},
		82: (r) => {
			let f = frameCount;
			return function () {
				if (x > 0) {
					x = x - 1;
				} else {
					return false;
				}
				if (frameCount >= f + 30) {
					return false;
				} else {
					return 89;
				}
			}
		},
		89: (y) => {
			let f = frameCount;
			return function () {
				if (x < width) {
					x = x + 1;
				} else {
					return false;
				}
				if (frameCount >= f + 30) {
					return false;
				} else {
					return 82;
				}
			}
		},
	},
	/* return false to stop ,return num to stop the other keycode func */

	"pressAgainToAccelerateHoldToStop": {
		49: (t = 2) => {
			/*key 1 */
			let tempT = t;
			return (T = tempT) => {
				r = (r + T + 400) % 400;
				return 2 + T; /* press same key accelerate */
			}
		},

		50: (t = 1) => {
			/*key 2*/
			let tempT = t;
			return (T = tempT) => {
				r = (r - T + 400) % 400;
				return 2 + T; /* press same key accelerate */
			}
		},
	},
	/*return para to accelerate the next pressing */

	"pressAgainToLoopHoldToStop": {
		"shift_51" /*key 3*/: {
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
		"opt_52" /*key ` */: {
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

		this.input = obj;
		this.func = obj;
		// this.keyList={};
		this.holdFrame = holdFrame; /** num of frames while  holding for a reaction    */
		this.keySeparator = keySeparator;
		/**
		 * a string to split between modified key and keycode 
		 */

		this.running = new Object();
		/** 
		all func add to here then run; */

		this.runningConsoleList = {};
		/* 
				run a func to add; end a func to delete; for console 
				{ running.key : Boolean }   */

		this.keyHoldingList = {};
		/** pressed to add; draw to count; release to delete;
		 *  {keyCode: frames} */

		this.keyPressedList = {};
		/** press to add;
		 * active func or release to delete
		{keycode: boolean }*/

		this.keyReleasedList = {};

		this.loopKeyframeList = {};
		/**
				 * recode keyFrames while press key of loopFunc 
				{'shift_1':[12 16 32]}
				mean 12-16 and  16-32 ,two dura of keyframeMotion
				 */

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

		var that = this;

		/** 
 * fxFunc => gendrator(fxFunc) => key(fxFunc) 
 * 
 * obj={type:{keyName:fx}} 
 * => this.runnerFuncList = {
 * 	keyName:addToRunning(fx)}
 * => keyPressed(keyName) => running={keyName:fx} 
 * => running.map(i=>i())*/
		this.funcGenerators = {
			"hold": {
				"pressed": (deKey, deValue) => {
					let K = deKey,
						V = deValue;
					// console.log(deKey, deValue);
					return function (k = K, v = V) {
						console.log('hold pressed', k, v, this.running);
						that.running[k] = v;
					};
				}, "released": (deKey, deValue) => {
					let K = deKey,
						V = deValue;
					// console.log(deKey, deValue);
					return function (k = K, v = V) {
						console.log('hold released ', k, v, this.running);
						delete (that.running[k]);
					};

				}
			},
			/* release to stop */

			"once": {
				"pressed": (deKey, deValue) => {
					let K = deKey,
						V = deValue;
					return function (k = K, v = V) {
						v();
					}
				}
			},
			/* hit to play once */

			"runToEnd": {
				"pressed": (deKey, deValue) => {
					let K = deKey,
						V = deValue;
					return function (k = K, v = V) {
						that.running[k] = v;
					};
				}
			},

			"pressAgainToStop": {
				"pressed": (deKey, deValue) => {
					let K = deKey,
						V = deValue;
					return function (k = K, v = V) {
						console.log(k, that.running);
						if (Object.keys(that.running).indexOf(k) == -1) {
							that.running[k] = v;
						} else {
							delete (that.running[k]);
						}
					};
				}
			},

			"pressReverseStopGoReverse": {
				"pressed": (deKey, deValue) => {
					let K = deKey,
						V = deValue;
					// console.log(deKey, deValue);
					return function (k = K, v = V) {
						if (Object.keys(that.running).indexOf(k) == -1) {
							that.running[k] = v;
							let closeTarget = v();

							if (Object.keys(that.runnerNameList).indexOf(closeTarget + '') != -1) {
								console.log(that.running[closeTarget]);

								delete (that.running[closeTarget]);
							}
						} else {
							console.log(that.running[k])
							delete (that.running[k]);
						}
					};
				}
			},


			"runToSelfConditionEnd": {
				"pressed": (deKey, deValue) => {
					let K = deKey,
						V = deValue;
					// console.log(deKey, deValue);
					return function (k = K, v = V) {
						// console.log(k, v, this.running);
						if (Object.keys(that.running).indexOf(k) == -1) {
							that.running[k] = v();
							let closeTarget = that.running[k]();
							if (Object.keys(that.running).indexOf(closeTarget + '') != -1) {
								delete (that.running[closeTarget]);
							}
						} else {
							delete (that.running[k])
						}
					};
				}
			},


			"pressAgainToAccelerateHoldToStop": {
				"pressed": (deKey, deValue) => {
					let K = deKey,
						V = deValue;
					// console.log(deKey, deValue);
					return function (k = K, v = V) {
						// console.log(k, v, this.running);

						if (Object.keys(that.running).indexOf(k) == -1) {
							that.running[k] = v();
						}
						if (Object.keys(that.keyHoldingList).indexOf(k) == -1) {
							that.keyHoldingList[k] = 0;
						}
					};
				},
				"released": (deKey, deValue) => {
					let K = deKey,
						V = deValue;
					// console.log(deKey, deValue);
					return function (k = K, v = V) {
						if (that.keyHoldingList[k] < that.holdFrame &&
							k in that.running
						) {
							let arg = that.running[k]();
							arg = typeof arg == "object" ? arg : [arg];
							that.running[k] = v(...arg);
						}
						if (that.keyHoldingList[k] >= that.holdFrame) {
							delete (that.running[k]);
						}
					}
				}
			},

			"pressAgainToLoopHoldToStop": {
				"pressed": (deKey, deValue) => {
					let K = deKey,
						V = deValue;
					// console.log(deKey, deValue);
					return function (k = K, v = V) {
						if (Object.keys(that.loopKeyframeList).indexOf(k) == -1) {
							that.loopKeyframeList[k] = [];
						}
						that.loopKeyframeList[k].push(frameCount);
						if (Object.keys(that.keyHoldingList).indexOf(k) == -1) {
							that.keyHoldingList[k] = 0;
						}

						that.running[k] = that.loopFuncGenerator(
							that.loopKeyframeList[k],
							v.fnOnce,
							v.fnContinue,
							v.endBooByFalseNum
						);

					};
				},
			}

		};

		this.modifierKeys = {
			"win": 91,
			"windows": 91,
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






		Object.keys(this.input).map(_type => {

			if (_type in this.funcGenerators) {

				Object.keys(this.input[_type]).map(_key => {

					// console.log(this.input[type], 'obj[type]| ', key, "key ");

					/** 'shift_52': 原来 if (condition) {  这里的东西  } */


					// console.log(key, ' | ', obj[type][key], ' | ', this.runnerFuncList[key]);
					// console.log(this.funcGenerators);
					// console.log(this.runnerFuncList);
					// this.runnerFuncList[key]();
					// debugger;

					let arr = _key.split(this.keySeparator).map(i => i.toLowerCase());
					let keyCodeArr = arr.map(i => {
						let code = i.match(/^\d+$/) == null ? this.modifierKeys[i] : i;
						code = typeof code == "undefined" ? false : Number(code);
						if (code == false) {
							console.error(`${_type} : ${_key} : contains key(s) not in modifierKeys list
	the modifierKeys: 'name': keyCode \n ${JSON.stringify(this.modifierKeys, ' ', 2)}`);
						}
						return code;
					});
					/** keyNames translate to keycode array ; 
					 * if name not in modified list return false;
					 */

					if (keyCodeArr.some(i => i == false)) {
						console.error(`${_type} : ${_key} : 
						cause to modifierKey error, this key-func hasn't loaded to key-running list `)
						return false;
					}
					keyCodeArr.map(i => {
						if (typeof this.keycodeRunnerList[i] == "undefined") {
							this.keycodeRunnerList[i] = [];
						}
						this.keycodeRunnerList[i].push(_key);
					});
					/** *	// 16:'shift_52',
							// 52:'shift_52', */


					this.runnerNameList[_key] = keyCodeArr.map(i => i);
					/** // 'shift_52':[16,52]; */

					// console.log(this.runnerFuncList[_key]);
					if (typeof this.runnerFuncList[_key] == "undefined") {
						this.runnerFuncList[_key] = {};
					}
					// console.log(this.runnerFuncList[_key]);

					['pressed', 'released'].map(act => {
						if (typeof this.funcGenerators[_type][act] != "undefined") {

							// console.log(this.funcGenerators[_type][act]);

							this.runnerFuncList[_key][act] =
								this.funcGenerators[_type][act](_key, this.input[_type][_key]);
						}
					});
					// console.log(this.runnerFuncList[_key]);

					// 	if('pressed' in this.runnerFuncList[key]){
					// 	this.runnerFuncList[key]["pressed"] = this.funcGenerators[type]["pressed"](key, obj[type][key]);
					// }

					// console.log(this.funcGenerators[type](key, this.input[type][key]))
					// console.log(this.runnerFuncList[key]);

				});

			}
		});

		// Object.keys(this.runnerFuncList).map(i => this.runnerFuncList[i]());
		// console.log(JSON.stringify(this, ' ', 4));


	}



	pressed() {
		this.keyPressedList[keyCode] = true;

		let funcsContainKeyList = {};
		let runFuncs = [];
		// console.log(this.keyPressedList);


		Object.keys(this.keyPressedList).map(_key => {
			if (_key in this.keycodeRunnerList) {
				funcsContainKeyList[_key] = this.keycodeRunnerList[_key];
				runFuncs = runFuncs.concat(funcsContainKeyList[_key]);
			}
		});
		runFuncs = [...new Set(runFuncs)];

		// console.log(this.keyPressedList);

		runFuncs.map(_key => {
			if (_key in this.runnerNameList &&
				this.runnerNameList[_key].every(v => v in this.keyPressedList) &&
				_key in this.runnerFuncList &&
				"pressed" in this.runnerFuncList[_key]) {

				// console.log(_key);
				// console.log(this.runnerFuncList[_key])
				this.runnerFuncList[_key]["pressed"]();
				delete (this.keyPressedList[_key]);
				// console.log(this.running);
			} else {
				return false;
			}
		});


		// console.log(runFuncs, funcsContainKeyList, this.keyPressedList, this.running);

		// console.log(this);
		// console.log('pressed!');

		// console.log(this.keyPressedList);

		// debugger;


	}
	released() {
		/** TODO replace func to  name list */

		this.keyReleasedList[keyCode] = true;

		let funcsContainKeyList = {};
		let runFuncs = [];

		Object.keys(this.keyReleasedList).map(_key => {
			if (_key in this.keycodeRunnerList) {
				funcsContainKeyList[_key] = this.keycodeRunnerList[_key];
				runFuncs = runFuncs.concat(funcsContainKeyList[_key]);
			}
		});
		runFuncs = [...new Set(runFuncs)];

		// console.log(this.keyReleasedList);





		runFuncs.map(_key => {

			// console.log(_key)
			// console.log(_key in this.runnerNameList)
			// console.log(this.runnerNameList[_key].every(v => v in this.keyReleasedList))
			// console.log(_key in this.runnerFuncList)
			// console.log("released" in this.runnerFuncList[_key])
			// console.log(typeof this.runnerFuncList[_key]["released"] != "undefined")

			if (_key in this.runnerNameList &&
				this.runnerNameList[_key].every(v => v in this.keyReleasedList) &&
				_key in this.runnerFuncList &&
				"released" in this.runnerFuncList[_key] &&
				typeof this.runnerFuncList[_key]["released"] != "undefined") {

				console.log(_key);
				console.log(this.runnerFuncList[_key])
				this.runnerFuncList[_key]["released"]();
				delete (this.keyReleasedList[_key]);
				console.log(this.running);
			} else {
				return false;
			}
		});

		// console.log(runFuncs, funcsContainKeyList, this.keyReleasedList, this.running);





		// Object.keys(this.func.hold).map(i => {
		// 	if (i == keyCode) {
		// 		delete (this.running[i])
		// 	}
		// });



		// Object.keys(this.keyHoldingList).map(i => {
		// 	if (i == keyCode) {

		// 		/** TODO  */
		// 		if (this.keyHoldingList[i] < this.holdFrame &&
		// 			Object.keys(this.func.pressAgainToAccelerateHoldToStop).indexOf(i) != -1) {
		// 			let arg = this.running[i]();
		// 			arg = typeof arg == "object" ? arg : [arg];
		// 			this.running[i] = this.func.pressAgainToAccelerateHoldToStop[i](...arg);
		// 		}
		// 		if (this.keyHoldingList[i] >= this.holdFrame) {
		// 			delete (this.running[i]);
		// 		}

		// 		// delete(this.holdList[keyCode]);

		// 	}
		// });

		delete (this.keyPressedList[keyCode]);
		delete (this.keyHoldingList[keyCode]);
		if (keyIsPressed === false) {
			// Object.keys(this.keyReleasedList).map(i => { delete (this.keyReleasedList[i]) });
			this.keyReleasedList = {};
		}
	}
	keyDetector(str, separator = this.keySeparator) {
		let arr = str.split(separator).map(i => i.toLowerCase());

		let keyCodeArr = arr.map(i => {
			let code = i.match(/^\d+$/) == null ? this.modifierKeys[i] : i;
			code = typeof code == "undefined" ? false : code;
			return code;
		});
		// console.trace();
		//console.log('keyDetector  ',str,arr);

		if (keyCodeArr.some((i) => i == false)) {
			console.error(` ${str} contains key(s) not in modifierKeys list `);
			return false;
		}
		return (keyCodeArr.every(i => this.keyPressedList.hasOwnProperty(i)));

	}

	loopFuncGenerator(frameCountArr, fnOnce, fnContinue, endBooByFalseNum = 2) {
		let dura_ = Math.max(...frameCountArr) - Math.min(...frameCountArr);
		let start_ = Math.min(...frameCountArr);
		let ar_ = frameCountArr.map(i => i - start_);
		// console.log('loopFuncGenerator '+frameCountArr,dura_,start_,ar_);

		return (dura = dura_, start = start_, ar = ar_) => {
			let f = frameCount;
			let result = dura == 0 ? fnContinue(f - start) : true;
			if (result === false) {
				return false;
			}

			let t = (f - start) % dura;
			let beforeAr = ar.map(i => i > t ? false : i).filter(i => typeof i == 'number');
			let justBefore = Math.max(...beforeAr);

			if (dura == 0) {
				return
			}

			let result1 = 0,
				result2 = 0,
				falseNum = 0;

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

		this.keyPressedList[keyCode] = true;

		Object.keys(this.func.hold).map(i => {
			/* hold 的，按着才运行， 松手在 released 那 delete掉 */
			if (this.keyDetector(i)) {
				this.running[i] = this.func.hold[i];
			}
		});

		Object.keys(this.func.once).map(i => {
			/* once 的， 按下直接运行，不添加到running*/
			if (this.keyDetector(i)) {
				this.func.once[i]();
			}
		});

		Object.keys(this.func.runToEnd).map(i => {
			/* runToEnd 的，按下添加到 running，内部返回 false 时 在 draw 里面删除自身*/
			if (this.keyDetector(i)) {
				this.running[i] = this.func.runToEnd[i];
			}
		});

		Object.keys(this.func.pressAgainToStop).map(i => {
			/* pressAgainToStop 的，检测running里面是否包含，如果有，按下删除；如果冇，按下添加  */
			if (this.keyDetector(i)) {
				if (Object.keys(this.running).indexOf(i) == -1) {
					this.running[i] = this.func.pressAgainToStop[i];
				} else {
					delete (this.running[i])
				}
			}
		});

		Object.keys(this.func.pressReverseStopGoReverse).map(i => {
			/* 
		press again to stop self ; for stop by reverse key, setting in draw()_keyIsPressed 
		pressReverseStopGoReverse 的，先检测running里面是否包含，如果有，按下删除；如果冇，按下添加，并且继续检测按下程序返回值，如果running包含返回值，删除返回值的func
		*/
			if (this.keyDetector(i)) {
				if (Object.keys(this.running).indexOf(i) == -1) {
					this.running[i] = this.func.pressReverseStopGoReverse[i];
					let closeTarget = this.func.pressReverseStopGoReverse[i]();
					if (Object.keys(this.running).indexOf(closeTarget + '') != -1) {
						delete (this.running[closeTarget]);
					}
				} else {
					delete (this.running[i])
				}
			}
		});

		Object.keys(this.func.runToSelfConditionEnd).map(i => {
			/* 
		press again to stop self ; for stop by reverse key, setting in draw()_keyIsPressed 
		runToSelfConditionEnd 的，先检测running里面是否包含，如果有，按下删除；如果冇，按下运行程序，获得内部返回值作为程序添加到running，
			并且继续检测添加的内部返回程序的运行返回值，如果running包含运行返回值，删除返回值的func；
			在running程序中，触发停止条件，则返回false，删除自身；
		*/
			if (this.keyDetector(i)) {
				if (Object.keys(this.running).indexOf(i) == -1) {
					this.running[i] = this.func.runToSelfConditionEnd[i]();
					let closeTarget = this.running[i]();
					if (Object.keys(this.running).indexOf(closeTarget + '') != -1) {
						delete (this.running[closeTarget]);
					}
				} else {
					delete (this.running[i])
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
				if (Object.keys(this.running).indexOf(i) == -1) {
					this.running[i] = this.func.pressAgainToAccelerateHoldToStop[i]();
				}
				if (Object.keys(this.keyHoldingList).indexOf(i) == -1) {
					this.keyHoldingList[i] = 0;
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
				if (Object.keys(this.loopKeyframeList).indexOf(i) == -1) {
					this.loopKeyframeList[i] = [];
				}
				this.loopKeyframeList[i].push(frameCount);
				if (Object.keys(this.keyHoldingList).indexOf(i) == -1) {
					this.keyHoldingList[i] = 0;
				}

				this.running[i] = this.loopFuncGenerator(
					this.loopKeyframeList[i],
					this.func.pressAgainToLoopHoldToStop[i].fnOnce,
					this.func.pressAgainToLoopHoldToStop[i].fnContinue,
					this.func.pressAgainToLoopHoldToStop[i].endBooByFalseNum
				);

			}
		});



	}


	setKeyFuncInKeyReleased() {
		// delete(this.keyList[keyCode]);


		Object.keys(this.func.hold).map(i => {
			if (i == keyCode) {
				delete (this.running[i])
			}
		});



		Object.keys(this.keyHoldingList).map(i => {
			if (i == keyCode) {

				if (this.keyHoldingList[i] < this.holdFrame &&
					Object.keys(this.func.pressAgainToAccelerateHoldToStop).indexOf(i) != -1) {
					let arg = this.running[i]();
					arg = typeof arg == "object" ? arg : [arg];
					this.running[i] = this.func.pressAgainToAccelerateHoldToStop[i](...arg);
				}
				if (this.keyHoldingList[i] >= this.holdFrame) {
					delete (this.running[i]);
				}

				// delete(this.holdList[keyCode]);

			}
		});

		delete (this.keyPressedList[keyCode]);

		delete (this.keyHoldingList[keyCode]);

		console.log(this);
	}

	consoleRunningList() {
		let nowRunningList = Object.keys(this.running).toString();
		let justRunningList = Object.keys(this.runningConsoleList).toString();
		if (justRunningList != nowRunningList && nowRunningList.length != 0) {
			console.log("now running: " + nowRunningList);
		} else if (justRunningList != nowRunningList) {
			console.log("now running: nothing");
		}
	}

	updateRunningList() {
		Object.keys(this.runningConsoleList).map(i => {
			if (Object.keys(this.running).indexOf(i) == -1) {
				delete (this.runningConsoleList[i]);
			}
		});
		Object.keys(this.running).map(i => {
			if (Object.keys(this.runningConsoleList).indexOf(i) == -1) {
				this.runningConsoleList[i] = true;
			}
		});
	}

	runKeyFuncInDraw() {
		this.consoleRunningList();

		if (keyIsPressed === true) {
			Object.keys(this.keyPressedList).map(i => {

				this.keyHoldingList[i] = Number(this.keyHoldingList[i]) + 1;

				console.log('holding ', this.keyHoldingList);

				if (this.keyHoldingList[i] >= this.holdFrame) {

					console.log(`draw holding : delete ${i}`);
					delete (this.running[i]);
					delete (this.keyHoldingList[i]);
					delete (this.loopKeyframeList[i]);
				}
			});
		}


		Object.keys(this.running).map(i => {
			let result = this.running[i]();
			if (Object.keys(this.running).indexOf(result + '') != -1) {
				delete (this.running[result]);
				console.log(`drawing key result : delete ${result}`);
			}
			if (result === false) {
				delete (this.running[i]);
				console.log(`drawing return result : delete ${i}`);
			}
		});

		this.updateRunningList();

	}

}


/* TODO 
组合键 holding 关闭
*/