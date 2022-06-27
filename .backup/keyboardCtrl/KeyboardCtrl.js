// By Leizingyiu
// https://www.leizingyiu.net/?lang=en
// https://twitter.com/leizingyiu
// https://openprocessing.org/sketch/1435333

// Last modified: "2022/05/29 12:35:28"

// This work is licensed under a Creative Commons Attribution NonCommercial ShareAlike 4.0 International License.
// http://creativecommons.org/licenses/by-nc-sa/4.0/

/**

	function setup(){
		keyFunc = new KeyboardCtrl(keyFuncSetup, 60);
	}

	function draw(){
		keyFunc.main();
		text(keyFunc.text(), 24, 24, width - 48, height - 48);
	}

	function keyPressed() {
		keyFunc.pressed();
	}

	function keyReleased() {
		keyFunc.released();
	}

 */

const keyFuncDemo = {
	/*return false to stop*/

	"hold": {
		87: (w) => {
			y = (y - 1 + height) % height; return true;
		},
		/* w */
		83: (s) => {
			y = (y + 1 + height) % height; return true;
		},
		/* s */
		65: (a) => {
			x = (x - 1 + width) % width; return true;
		},
		/* a */
		68: (d) => {
			x = (x + 1 + width) % width; return true;
		},
		/* d */

		"shift_87": (w) => {
			y = (y - 1 + height) % height; return true;
		},
		/* shift left */
		"shift_83": (s) => {
			y = (y + 1 + height) % height; return true;
		},
		/* up */
		"shift_65": (a) => {
			x = (x - 1 + width) % width; return true;
		},
		/* right */
		"shift_68": (d) => {
			x = (x + 1 + width) % width; return true;
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

};
const keycodeText = `keycode 0 =
keycode 1 =
keycode 2 =
keycode 3 =
keycode 4 =
keycode 5 =
keycode 6 =
keycode 7 =
keycode 8 = BackSpace
keycode 9 = Tab
keycode 10 =
keycode 11 =
keycode 12 = Clear
keycode 13 = Enter
keycode 14 =
keycode 15 =
keycode 16 = Shift_L
keycode 17 = Control_L
keycode 18 = Alt_L
keycode 19 = Pause
keycode 20 = Caps_Lock
keycode 21 =
keycode 22 =
keycode 23 =
keycode 24 =
keycode 25 =
keycode 26 =
keycode 27 = Esc Escape
keycode 28 =
keycode 29 =
keycode 30 =
keycode 31 =
keycode 32 = Space
keycode 33 = Page_Up
keycode 34 = Page_Down
keycode 35 = End
keycode 36 = Home
keycode 37 = Left_Arrow
keycode 38 = Up_Arrow
keycode 39 = Right_Arrow
keycode 40 = Down_Arrow
keycode 41 = Select
keycode 42 = Print
keycode 43 = Execute
keycode 44 =
keycode 45 = Insert
keycode 46 = Delete
keycode 47 = Help
keycode 48 = 0 )
keycode 49 = 1 !
keycode 50 = 2 @
keycode 51 = 3 #
keycode 52 = 4 $
keycode 53 = 5 %
keycode 54 = 6 ^
keycode 55 = 7 &
keycode 56 = 8 *
keycode 57 = 9 (
keycode 58 =
keycode 59 =
keycode 60 =
keycode 61 =
keycode 62 =
keycode 63 =
keycode 64 =
keycode 65 = a A
keycode 66 = b B
keycode 67 = c C
keycode 68 = d D
keycode 69 = e E
keycode 70 = f F
keycode 71 = g G
keycode 72 = h H
keycode 73 = i I
keycode 74 = j J
keycode 75 = k K
keycode 76 = l L
keycode 77 = m M
keycode 78 = n N
keycode 79 = o O
keycode 80 = p P
keycode 81 = q Q
keycode 82 = r R
keycode 83 = s S
keycode 84 = t T
keycode 85 = u U
keycode 86 = v V
keycode 87 = w W
keycode 88 = x X
keycode 89 = y Y
keycode 90 = z Z
keycode 91 =
keycode 92 =
keycode 93 =
keycode 94 =
keycode 95 =
keycode 96 = KP_0
keycode 97 = KP_1
keycode 98 = KP_2
keycode 99 = KP_3
keycode 100 = KP_4
keycode 101 = KP_5
keycode 102 = KP_6
keycode 103 = KP_7
keycode 104 = KP_8
keycode 105 = KP_9
keycode 106 = KP_* KP_Multiply
keycode 107 = KP_+ KP_Add
keycode 108 = KP_Enter KP_Separator
keycode 109 = KP_- KP_Subtract
keycode 110 = KP_. KP_Decimal
keycode 111 = KP_/ KP_Divide
keycode 112 = F1
keycode 113 = F2
keycode 114 = F3
keycode 115 = F4
keycode 116 = F5
keycode 117 = F6
keycode 118 = F7
keycode 119 = F8
keycode 120 = F9
keycode 121 = F10
keycode 122 = F11
keycode 123 = F12
keycode 124 = F13
keycode 125 = F14
keycode 126 = F15
keycode 127 = F16
keycode 128 = F17
keycode 129 = F18
keycode 130 = F19
keycode 131 = F20
keycode 132 = F21
keycode 133 = F22
keycode 134 = F23
keycode 135 = F24
keycode 136 = Num_Lock
keycode 137 = Scroll_Lock
keycode 138 =
keycode 139 =
keycode 140 =
keycode 141 =
keycode 142 =
keycode 143 =
keycode 144 =
keycode 145 =
keycode 146 =
keycode 147 =
keycode 148 =
keycode 149 =
keycode 150 =
keycode 151 =
keycode 152 =
keycode 153 =
keycode 154 =
keycode 155 =
keycode 156 =
keycode 157 =
keycode 158 =
keycode 159 =
keycode 160 =
keycode 161 =
keycode 162 =
keycode 163 =
keycode 164 =
keycode 165 =
keycode 166 =
keycode 167 =
keycode 168 =
keycode 169 =
keycode 170 =
keycode 171 =
keycode 172 =
keycode 173 =
keycode 174 =
keycode 175 =
keycode 176 =
keycode 177 =
keycode 178 =
keycode 179 =
keycode 180 =
keycode 181 =
keycode 182 =
keycode 183 =
keycode 184 =
keycode 185 =
keycode 186 =
keycode 187 = = +
keycode 188 = , <
keycode 189 = - _
keycode 190 = . >
keycode 191 = / ?
keycode 192 = \` ~
keycode 193 =
keycode 194 =
keycode 195 =
keycode 196 =
keycode 197 =
keycode 198 =
keycode 199 =
keycode 200 =
keycode 201 =
keycode 202 =
keycode 203 =
keycode 204 =
keycode 205 =
keycode 206 =
keycode 207 =
keycode 208 =
keycode 209 =
keycode 210 = plusminus hyphen macron
keycode 211 =
keycode 212 = copyright registered
keycode 213 = guillemotleft guillemotright
keycode 214 = masculine ordfeminine
keycode 215 = ae AE
keycode 216 = cent yen
keycode 217 = questiondown exclamdown
keycode 218 = onequarter onehalf threequarters
keycode 219 = [ {
keycode 220 = \ |
keycode 221 = ] }
keycode 222 = ' "

keycode 223 =
keycode 224 =
keycode 225 =
keycode 226 =
keycode 227 = multiply division
keycode 228 = acircumflex Acircumflex
keycode 229 = ecircumflex Ecircumflex
keycode 230 = icircumflex Icircumflex
keycode 231 = ocircumflex Ocircumflex
keycode 232 = ucircumflex Ucircumflex
keycode 233 = ntilde Ntilde
keycode 234 = yacute Yacute
keycode 235 = oslash Ooblique
keycode 236 = aring Aring
keycode 237 = ccedilla Ccedilla
keycode 238 = thorn THORN
keycode 239 = eth ETH
keycode 240 = diaeresis cedilla currency
keycode 241 = agrave Agrave atilde Atilde
keycode 242 = egrave Egrave
keycode 243 = igrave Igrave
keycode 244 = ograve Ograve otilde Otilde
keycode 245 = ugrave Ugrave
keycode 246 = adiaeresis Adiaeresis
keycode 247 = ediaeresis Ediaeresis
keycode 248 = idiaeresis Idiaeresis
keycode 249 = odiaeresis Odiaeresis
keycode 250 = udiaeresis Udiaeresis
keycode 251 = ssharp question backslash
keycode 252 = asciicircum degree
keycode 253 = 3 sterling
keycode 254 = Mode_switch`;
const keycodeList = keycodeText.split('\n').map(i => i.replace(/keycode /, '')).filter(i => i.match(/=.+/)).map(i => i.split(' = '));
const keycodeDict = Object.fromEntries(keycodeList);
const dictReg = new RegExp(Object.keys(keycodeDict).sort((a, b) => b.length - a.length).map(_k => `(${_k})`).join('|'));

class KeyboardCtrl {
	constructor(obj, holdFrame, keySeparator = '_') {

		this.input = obj;
		this.holdFrame = holdFrame;
		/** 
		 * num of frames while  holding for a reaction    
		 * */

		this.keySeparator = keySeparator;
		/**
		 * a string to split between modified key and keycode 
		 */

		this.running = new Object();
		/** 
		 * all func add to here then run; 
		 * */

		this.runningConsoleList = {};
		/**  
		 * run a func to add; end a func to delete; for console 
		 * { running.key : Boolean }   */

		this.keyHoldingList = {};
		/** pressed to add; draw to count; 
		 * ACTIVE func or release to delete;
		 * {keyCode: frames} */

		this.keyPressedList_runTime = {};
		/** press to add;
		 * 	ACTIVE func or release to delete
		 * {keycode: boolean }*/

		this.keyPressedList_realTime = {};
		/** press to add;
		 *  release to delete
		{keycode: boolean }*/

		this.keyReleasedList = {};

		this.loopKeyframeList = {};
		/**
		 * recode keyFrames while press key of loopFunc 
		 * {'shift_1':[12 16 32]}
		 * mean 12-16 and  16-32 ,two dura of keyframeMotion
		 *  */


		this.runnerFuncList = {
			/** 'shift_52': 原来 if (condition) {  这里的东西  } */
		};

		this.runnerNameList = {
			/* 'shift_52':[16,52]; */
		}

		this.keycodeRunnerList = {
			/**
			 *  16:'shift_52',
			 * 52:'shift_52', */
		};

		this.consoleText = '';
		this.runningText = '';

		var that = this;

		/** this.funcGenerators
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
						// console.log('hold pressed', k, v, that.running);
						that.running[k] = v;
					};
				}, "released": (deKey, deValue) => {
					let K = deKey,
						V = deValue;
					// console.log(deKey, deValue);
					return function (k = K, v = V) {
						// console.log('hold released ', k, v, that.running);
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


	}



	pressed() {
		this.keyPressedList_runTime[keyCode] = true;
		this.keyPressedList_realTime[keyCode] = true;
		// console.log('keyPressedList  ', this.keyPressedList_runTime);


		let funcsContainKeyList = {};
		let runFuncs = [];
		// console.log(this.keyPressedList);


		Object.keys(this.keyPressedList_runTime).map(_key => {
			if (_key in this.keycodeRunnerList) {
				funcsContainKeyList[_key] = this.keycodeRunnerList[_key];
				runFuncs = runFuncs.concat(funcsContainKeyList[_key]);
			}
		});
		runFuncs = [...new Set(runFuncs)];

		// console.log(this.keyPressedList);

		runFuncs.map(_key => {
			if (_key in this.runnerNameList &&
				this.runnerNameList[_key].every(v => v in this.keyPressedList_runTime) &&
				_key in this.runnerFuncList &&
				"pressed" in this.runnerFuncList[_key]) {

				// console.log(_key);
				// console.log(this.runnerFuncList[_key])
				this.runnerFuncList[_key]["pressed"]();

				if ((_key in this.keyHoldingList) == false) {
					this.keyHoldingList[_key] = 1;
				}


				delete (this.keyPressedList_runTime[_key]);
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

				// console.log(_key);
				// console.log(this.runnerFuncList[_key])
				this.runnerFuncList[_key]["released"]();
				delete (this.keyReleasedList[_key]);
				// console.log(this.running);
			} else {
				return false;
			}
		});


		delete (this.keyPressedList_runTime[keyCode]);
		delete (this.keyPressedList_realTime[keyCode]);
		delete (this.keyHoldingList[keyCode]);
		if (keyIsPressed === false) {
			// Object.keys(this.keyReleasedList).map(i => { delete (this.keyReleasedList[i]) });
			this.keyReleasedList = {};
			this.keyPressedList_runTime = {};
			this.keyPressedList_realTime = {};
			this.keyHoldingList = {};
		} else {


			Object.keys(this.keyHoldingList).map(i => {
				if (this.keyPressedDetector(i) != true) {
					delete (this.keyHoldingList[i]);
				}
			})
		}
	}

	keyPressedDetector(str, separator = this.keySeparator) {

		if (str in this.keyPressedList_realTime) {
			return true;
		}

		let arr = str.split(separator).map(i => i.toLowerCase());

		let keyCodeArr = arr.map(i => {
			let code = i.match(/^\d+$/) == null ? this.modifierKeys[i] : i;

			code = typeof code == "undefined" ? false : code;

			return code;
		});


		if (keyCodeArr.some((i) => i == false)) {
			console.error(` ${str} contains key(s) not in modifierKeys list `);
			return false;
		}

		return (keyCodeArr.every(i => i in this.keyPressedList_realTime));

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

	textRunningList() {
		let nowRunningList = Object.keys(this.running).toString();
		let justRunningList = Object.keys(this.runningConsoleList).toString();

		if (justRunningList != nowRunningList && nowRunningList.length != 0) {
			this.runningText = Object.keys(this.running).map(k => k in keycodeDict ?
				keycodeDict[k] :
				(k.match(dictReg) ?
					k.replace(dictReg, function (_k) {
						return keycodeDict[_k]
					}) :
					k))
				.map(i => i.indexOf(' ') != -1 ? i.split(' ')[0] : i).join(', ');
			// const backupRunnings = nowRunningList.split(',').map(code => code + `${code in keycodeDict ? '(' + (keycodeDict[code].indexOf(' ') == -1 ? keycodeDict[code] : keycodeDict[code].split(' ')[0]) + ')' : ''}`).join(' ');
			this.consoleText += '\n' + ("now running: " + this.runningText);
		} else if (justRunningList != nowRunningList) {
			this.consoleText += '\n' + ("now running: nothing");
		}
	}

	updateRunningList() {
		this.runningConsoleList = {};
		Object.keys(this.running).map(i => {
			this.runningConsoleList[i] = true;
		});
	}

	text() {
		this.textRunningList();
		this.updateRunningList();
		if (frameCount % 10 == 0) {
			let arr = this.consoleText.split('\n');
			if (arr.length > 2) {
				arr.shift();
			}
			this.consoleText = arr.join('\n');
		}
		return this.consoleText;
	}

	main() {

		// if (
		// 	Object.keys(this.running).length > 0 ||
		// 	Object.keys(this.keyHoldingList).length > 0 ||
		// 	Object.keys(this.keyPressedList_realTime).length > 0 ||
		// 	Object.keys(this.keyPressedList_runTime).length > 0
		// ) {
		// 	console.log(this.running,
		// 		this.keyHoldingList,
		// 		this.keyPressedList_realTime,
		// 		this.keyPressedList_runTime);
		// }


		Object.keys(this.running).map(i => { /** runing */
			let result = this.running[i]();

			if (this.keyHoldingList[i] >= this.holdFrame && result !== true) {
				delete (this.keyHoldingList[i]);
				delete (this.running[i]);
			}

			/**
			 * overtime => close 
			 * 长按超时 => 关闭 */

			if (Object.keys(this.running).indexOf(result + '') != -1) {
				delete (this.running[result]);
				console.log(`drawing key result : delete ${result}`);
			}
			/** 
			 * close "reverse" 
			 * 关闭 “反方向” */

			if (result === false) {
				delete (this.running[i]);
				console.log(`drawing return result : delete ${i}`);
			}
			/**
			 * close self 
			 * 关闭 自身 */
		});

		if (keyIsPressed === true) {

			Object.keys(this.keyPressedList_realTime).map(i => {
				if ((i in this.keyHoldingList) == false) {
					this.keyHoldingList[i] = 1;
				}
			});

			Object.keys(this.keyHoldingList).map(i => {
				if (this.keyPressedDetector(i)) {

					this.keyHoldingList[i] = Number(this.keyHoldingList[i]) + 1;
				} else {
					delete (this.keyHoldingList[i]);
				}

				if (this.keyHoldingList[i] >= this.holdFrame) {
					delete (this.loopKeyframeList[i]);
				}
			})
		}

	}

}