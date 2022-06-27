function sphericalCoordinate(perspectiveK, W, H, midX, midY, radianX, radianY) {

    return function (ix, iy, R) {
        let x = ix; //- midX;
        let y = iy; // - midY;

        let whMin = Math.min(W, H);
        let whMax = Math.max(W, H);
        // x=constrain(x, -whMin/2, whMin/2);
        // y=constrain(y, -whMin/2, whMin/2);

        let radx = x / (whMin / 2) * (radianX / Math.PI);
        let rady = y / (whMin / 2) * (radianY / Math.PI);


        let dx = R * Math.sin(radx * Math.PI / 2) * Math.cos(rady * Math.PI / 2);
        let dy = R * Math.sin(rady * Math.PI / 2); // * Math.cos(radx *Math.PI/2 ) ;
        let dz = R * Math.cos(radx * Math.PI / 2) * Math.cos(rady * Math.PI / 2); // * Math.sin(rady);

        let perspect = Math.pow(perspectiveK, dz / R); //Math.pow(map(R,0,whMax/2,1,perspectiveK),dz/R*2);
        let Dx = dx / perspect;
        let Dy = dy / perspect;

        // 	console.log([/*radx,rady*/ dx,dy,dz].join(' , '));
        return [Dx, Dy, perspect];
    }
}

function rectOnSphere(x, y, w, h, r) {
    let xArr = [1, -1, -1, 1].map(i => i * w / 2 + x);
    let yArr = [1, 1, -1, -1].map(i => i * h / 2 + y);
    let pArr = [];
    for (let i = 0; i < 4; i++) {
        pArr.push(...sphereFun(xArr[i], yArr[i], r));
        pArr.pop();
    }
    let p = [].concat.apply([], pArr);
    quad(...p);
}

function graPointsOnSphere(x, y, w, h, r) {
    let xd = Math.cos(Math.atan2(y, x));
    let yd = Math.sin(Math.atan2(y, x));
    // let xd = x / Math.abs(x) != 1 ? -1 : 1;
    // let yd = y / Math.abs(y) != 1 ? -1 : 1;
    let xArr = [-xd, xd].map(i => i * w * 1 + x);
    let yArr = [-yd, yd].map(i => i * h * 1 + y);
    let pArr = [];
    for (let i = 0; i < 2; i++) {
        pArr.push(...sphereFun(xArr[i], yArr[i], r));
        pArr.pop();
    }
    let p = [].concat.apply([], pArr);
    return p;

}


function guiHsvToP5Hsv(hsvArray) {
    let result = Object.values(hsvArray);
    // console.log(JSON.stringify(hsvArray) + ' , ' + result);
    result[1] = result[1] * 100;
    result[2] = result[2] * 100;

    return result;
}
/* by leizingyiu  https://openprocessing.org/sketch/1431493  */



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


// s,v,l in [0,1]
/** https://stackoverflow.com/questions/3423214/convert-hsb-hsv-color-to-hsl  */
function hsl2hsv(h, s, l, v = s * Math.min(l, 1 - l) + l) {
    return [h, v ? 2 - 2 * l / v : 0, v]
}
function hsv2hsl(h, s, v, l = v - v * s / 2, m = Math.min(l, 1 - l)) {
    return [h, m ? (v - l) / m : 0, l]
}
// s,v,l in [0,1]
/** https://stackoverflow.com/questions/3423214/convert-hsb-hsv-color-to-hsl  */


class Cell {
    constructor(w, h, x, y, rowIdx, colIdx, rowN, colN, R) {
        this.h = h;
        this.w = w;
        this.x = x;
        this.y = y;

        this.dx = x;
        this.dy = y;
        this.dh = h;
        this.dw = w;

        this.R = R;
        this.dR = R;
        this.rowIdx = rowIdx;
        this.colIdx = colIdx;
        this.rowN = rowN;
        this.colN = colN;

        this.level = 0;

        this.target = cnv;
        this.fillColor = guiHsvToP5Hsv(settings.fillColor);
        this.strokeColor = guiHsvToP5Hsv(settings.strokeColor);
        this.hslF = '';
        this.hslS = '';

        this.graX1 = 0;
        this.graX2 = 0;
        this.graY1 = 0;
        this.graY2 = 0;

    }
    update(level) {
        this.level = level;
        // console.log(this.level);

        let m = 1, n = 1.05;
        let l = map(1 - this.level, 0, 1, m, n);
        // l = Math.max(Math.min(l, n), m);

        this.dx = this.x * l;
        this.dy = this.y * l;
        this.dh = this.h * l;
        this.dw = this.w * l;

        this.dR = this.R / Math.pow(l, 2);

        this.fillColor = guiHsvToP5Hsv(settings.fillColor);
        // console.log([this.fillColor[0], settings.fillColorHueOffset, settings.fillColorHueOffsetK, this.colIdx, this.colN, level].join(' , '));
        this.fillColor[0] = (this.fillColor[0] + settings.fillColorHueOffset * settings.fillColorHueOffsetK * ((this.colIdx - this.colN / 2) / (this.colN + 1)) * (1 + level)) % 360;

        this.strokeColor = guiHsvToP5Hsv(settings.strokeColor);
        this.strokeColor[0] = (this.strokeColor[0] + settings.strokeColorHueOffset * settings.strokeColorHueOffsetK * ((this.colIdx - this.colN / 2) / this.colN) * (1 + level)) % 360;

        //for create gradient 
        let f = hsv2hsl(...this.fillColor.map((i, idx) => idx == 0 ? i : i / 100));
        this.hslF = f.map((i, idx) => idx == 0 ? i : i * 100 + "%").join(',');
        let s = hsv2hsl(...this.strokeColor.map((i, idx) => idx == 0 ? i : i / 100));
        this.hslS = s.map((i, idx) => idx == 0 ? i : i * 100 + "%").join(',');

        //this.hslS = `${this.strokeColor[0]},${this.strokeColor[1]}%,${this.strokeColor[2]}%`;

        let pv = new p5.Vector(this.dx, this.dy);
        let pvn = pv.normalize();
        let pvr = [1, -1].map((i, idx) => [pvn.x * this.dw, pvn.y * this.dh].map((j, jdx) => j * i));
        [this.graX1, this.graY1, this.graX2, this.graY2] = [...[].concat.apply([], pvr)];
    }


    animate() {

    }

    show() {
        // target.prototype.rectOnSphere = this.rectOnSphere;
        this.showDeep();
        this.showTop();
    }
    showDeep() {
        let [x, y, w, h] = [
            this.dx, this.dy,
            this.dw, this.dh];
        let graX1, graY1, graX2, graY2;
        // let before = this.rectPoint(x, y, w, h);

        push();
        translate(width / 2, height / 2);

        for (let i = settings.repeatorNum; i >= 0; i--) {
            // let K = 1 - Math.pow(1 - i / settings.repeatorNum, settings.powK) * this.level;
            // let k = (K * (1 - settings.minK) + settings.minK);
            // let k = ((K) * settings.minK) + settings.minK;
            //let k = Math.max(K, 1 - settings.minK);

            let deep = Math.pow(1 - i / settings.repeatorNum, settings.powK);
            let k = map(1 - deep * this.level, 0, 1, settings.minK, 1);

            [x, y, w, h] = [
                this.dx, this.dy,
                this.dw, this.dh].map(j => j * k);
            let r = this.dR * k;



            if (w - inBorder > 0 || h - inBorder > 0) {
                push();
                // fill(...this.fillColor, settings.strokeAlpha + settings.strokeAlpha_add * i * k * this.level);
                if (settings.useGradient == true) {
                    let fA = (settings.fillA + ((100 - settings.fillA) / 100) * settings.fillA_add * i * k * this.level) / 100;
                    let graF1 = `hsla(${this.hslF},${fA * settings.graMaxA})`;
                    let graF2 = `hsla(${this.hslF},${fA * settings.graMinA})`;

                    [graX1, graY1, graX2, graY2] = graPointsOnSphere(x, y, w - inBorder, h - inBorder, r);
                    // [graX1, graY1, graX2, graY2] = [graX1, graY1, graX2, graY2].map(i => Math.round(i));

                    // fill(this.fillColor);
                    drawingContext.fillStyle = setLinearGradient(graX1, graY1, graX2, graY2, graF1, graF2);
                    noStroke();
                } else {
                    noStroke();
                    fill(...this.fillColor, settings.strokeAlpha + settings.strokeAlpha_add * i * k * this.level);
                }
                rectOnSphere(x, y, w - inBorder, h - inBorder, r);
                pop()
            }


            push();

            //stroke(...this.strokeColor, settings.strokeAlpha + settings.strokeAlpha_add * i * k * this.level);
            if (settings.useGradient == true) {
                let sA = (settings.strokeAlpha + ((100 - settings.strokeAlpha) / 100) * settings.strokeAlpha_add * i * k * this.level) / 100;

                let graS1 = `hsla(${this.hslS},${sA * settings.graMaxA})`;
                let graS2 = `hsla(${this.hslS},${sA * settings.graMinA})`;

                [graX1, graY1, graX2, graY2] = graPointsOnSphere(x, y, w, h, r);
                [graX1, graY1, graX2, graY2] = [graX1, graY1, graX2, graY2].map(i => Math.round(i));

                noFill();
                // stroke(this.strokeColor);
                drawingContext.strokeStyle = setLinearGradient(graX1, graY1, graX2, graY2, graS1, graS2);
                drawingContext.lineWidth = settings.strokeWeight_deep + settings.strokeWeight_deep_add * k;

                //strokeWeight(settings.strokeWeight_deep + settings.strokeWeight_deep_add * k);
            } else {
                noFill();
                strokeWeight(settings.strokeWeight_deep + settings.strokeWeight_deep_add * k);
                stroke(...this.strokeColor, settings.strokeAlpha + settings.strokeAlpha_add * i * k * this.level);
            }
            rectOnSphere(x, y, w, h, r);
            // quad(...points);

            pop();
        }
        pop();

        // let after = this.rectPoint(x, y, w, h);

        // strokeWeight(4);
        // for (let i = 0; i < 4; i++) {
        // 	line(before[i][0], before[i][1], after[i][0], after[i][1]);
        // }
    }

    rectPoint(x, y, w, h) {
        return [[x - w / 2, y - h / 2], [x + w / 2, y - h / 2], [x + w / 2, y + h / 2], [x - w / 2, y + h / 2]]
    }

    showTop() {
        let K = this.level;
        let [x, y, w, h] = [
            this.dx, this.dy,
            this.dw, this.dh].map(j => j);
        let graX1, graY1, graX2, graY2;

        let r = this.dR;

        push();
        translate(width / 2, height / 2);
        // blendMode(BLEND);
        //fill(...this.fillColor, settings.fillA * (K));

        if (w - inBorder > 0 || h - inBorder > 0) {
            push();
            // let fA = settings.fillA * (K);
            if (settings.useGradient == true) {
                let fA = (settings.fillA + ((100 - settings.fillA) / 100) * settings.fillA_add * K) / 100;
                let graF1 = `hsla(${this.hslF},${fA * settings.graMaxA})`;
                let graF2 = `hsla(${this.hslF},${fA * settings.graMinA})`;

                [graX1, graY1, graX2, graY2] = graPointsOnSphere(x, y, w - inBorder, h - inBorder, r);
                [graX1, graY1, graX2, graY2] = [graX1, graY1, graX2, graY2].map(i => Math.round(i));

                drawingContext.fillStyle = setLinearGradient(graX1, graY1, graX2, graY2, graF1, graF2);
                noStroke();
            } else {
                noStroke();
                fill(...this.fillColor, settings.fillA * (K));
            }
            rectOnSphere(x, y, w - inBorder, h - inBorder, r);
            pop();
        }

        push();
        //stroke(...this.strokeColor, settings.strokeAlpha + settings.strokeAlpha_add * settings.repeatorNum * this.level);
        if (settings.useGradient == true) {
            let sA = (settings.strokeAlpha + ((100 - settings.strokeAlpha) / 100) * settings.strokeAlpha_add * settings.repeatorNum * this.level) / 100;
            let graS1 = `hsla(${this.hslS},${sA * settings.graMaxA})`;
            let graS2 = `hsla(${this.hslS},${sA * settings.graMinA})`;

            [graX1, graY1, graX2, graY2] = graPointsOnSphere(x, y, w, h, r);
            [graX1, graY1, graX2, graY2] = [graX1, graY1, graX2, graY2].map(i => Math.round(i));

            drawingContext.strokeStyle = setLinearGradient(graX1, graY1, graX2, graY2, graS1, graS2);
            drawingContext.lineWidth = settings.strokeWeight_main + settings.strokeWeight_main_add * (K);
            // strokeWeight(settings.strokeWeight_main + settings.strokeWeight_main_add * (K));
            noFill();
        } else {
            noFill();
            stroke(...this.strokeColor, settings.strokeAlpha + settings.strokeAlpha_add * settings.repeatorNum * this.level);
            strokeWeight(settings.strokeWeight_main + settings.strokeWeight_main_add * (K));
        }
        rectOnSphere(x, y, w, h, r);
        pop();

        translate(-width / 2, -height / 2);
        pop();
    }
}

function setLinearGradient(x1, y1, x2, y2, c1, c2) {
    let grd = drawingContext.createLinearGradient(x1, y1, x2, y2)
    grd.addColorStop(0, c1);
    grd.addColorStop(1, c2);
    return grd;
}
class Column {
    constructor(w, h, x, colIdx, rowN, colN, R) {
        this.h = h;
        this.w = w;
        this.x = x;
        this.colIdx = colIdx;
        this.rowN = rowN;
        this.colN = colN;

        this.R = R;
        // let vmin = Math.min(width, height);
        this.level = 0;
        this.cells = [];
        let y, rowIdx;
        for (let j = 0; j < this.colN; j++) {
            //let y = ((j + 0.5 - this.colN / 2) / this.colN) * (vmin - margin * 2);
            let y = -((j + 0.5 - this.colN / 2) * (celSize + padding));
            this.cells[j] = new Cell(
                w = this.w,
                h = this.h,
                x = this.x, y,
                rowIdx = j,
                colIdx = this.colIdx,
                rowN = this.rowN,
                colN = this.colN,
                R = this.R
            );
        }
    }
    // update(spectrumPart) {
    // 	if (spectrumPart == undefined) {
    // 		return;
    // 	};
    // 	let spectrumSum = spectrumPart.sum();
    // 	let levelCapacity = spectrumPart.length * 255 + 1;
    // 	for (let j = 0; j < this.colN; j++) {
    // 		let levelBase = (levelCapacity * (j) / this.colN);
    // 		let level = spectrumSum > levelBase ? (spectrumSum - levelBase) / (levelCapacity - levelBase) : 0;

    // 		level = 1 - (Math.cos(level * Math.PI) + 1) / 2

    // 		this.cells[j].update(level);

    // 		// console.log('this.colIdx', this.colIdx,
    // 		// 	'j', j,
    // 		// 	'spectrumSum', spectrumSum,
    // 		// 	'levelBase', levelBase,
    // 		// 	'levelCapacity', levelCapacity, '\n', 'level', level, '\n\n')
    // 	}
    // }
    update(level) {
        // console.log(level, '_');
        level = map(level, 0, 255, 0, 1);
        // console.log(level, '=====');

        this.level = level;

        for (let j = 0; j < this.colN; j++) {

            // let l = level > j / this.colN ? map(level, j / this.colN, 1, 0, 1) : 0;
            let l = level > j / this.colN ? this.level : 0;
            // l = l > 1 ? l : l * level;
            // l = l > 1 ? 1 : l;

            // console.log('Math.abs(j - Math.floor(settings.colHighest * this.colN))/this.colN,settings.colHighest,this.colN,j'.split(',').map(i => i + ': ' + eval(i)).join(', '))

            l = map(settings.colHiEffect, 0, 1,
                l,
                l + map(Math.abs(j - Math.floor(settings.colHighest * this.colN)) / this.colN, 0, 0.6, l, 0));
            this.cells[j].update(l);

        }
    }
    show() {
        for (let j = 0; j < this.colN; j++) {
            this.cells[j].show();
        }
    }
    animate() {

    }
}

class Grid {
    constructor(row, col, R) {
        this.row = row;
        this.col = col;

        this.columns = [];
        let Vmin = Math.min(width, height);
        let Cmin = Vmin == height ? this.col : this.row;
        let sizeOfCell = (Vmin - margin * 2) / Cmin - padding;
        let w = celSize;
        let h = celSize;

        this.R = R;
        let x, colIdx, rowN, colN;
        for (let i = 0; i < this.row; i++) {

            //x = ((i + 0.5 - this.row / 2) / (this.row)) * (Vmin - margin * 2 + padding * (this.row - 1));
            x = ((i + 0.5 - this.row / 2) * (celSize + padding));

            this.columns[i] = new Column(
                w,
                h,
                x,
                colIdx = i,
                rowN = this.row,
                colN = this.col,
                R = this.R)
        }
    }

    // update(spectrum) {
    // 	let spectrumParts = spectrum.to2d(this.row);
    // 	for (let i = 0; i < row ; i++) {
    // 		this.columns[i].update(spectrumParts[i]);
    // 	}
    // }

    update(levels) {
        for (let i = 0; i < row; i++) {
            this.columns[i].update(levels[i]);
        }
    }


    show() {
        for (let i = 0; i < row; i++) {
            this.columns[i].show(...arguments);
        }
    }
    animate() {

    }
}

let inputSound = ['music', 'mic'][0];
let fileInputId = 'musicFileInput';
let useLocalStorageSearchName = "localStorage";
let showFrameRateSearchName = 'frameRate';
//base default settings 
let settings = {
	inputSound: inputSound,

	'loadFile': function () {
		if (document.getElementById(fileInputId)) {
			document.getElementById(fileInputId).click();
		} else {
			guiLoadFileInit()
		}
	},

	levelBase: 0.64,
	levelMulti: 1.6,

	powK: 0.8,
	minK: 0.9,

	repeatorNum: 3,

	strokeWeight_main: 1,
	strokeWeight_main_add: 2,
	strokeWeight_deep: 1,
	strokeWeight_deep_add: 2,

	strokeColor: {
		h: 233,
		s: Math.random() * 0.5 + 0.5,
		v: Math.random()
	},
	strokeColorHueOffset: 30,
	strokeColorHueOffsetK: 1,

	strokeAlpha: 2,
	strokeAlpha_add: 40,


	fillColor: {
		h: 333,
		s: Math.random() * 0.5 + 0.5,
		v: Math.random()
	},
	fillColorHueOffset: 30,
	fillColorHueOffsetK: 1,

	fillA: 48,
	fillA_add: 90,


	useGradient: true,
	graMaxA: 1,
	graMinA: 0,

	bgAlpha: 80,

	fftBins: 4,
	fftSmoothing: 0.1,


	in_padding: 24,
	grid_margin: 60,
	cell_padding: 8,
	cell_size: 144,
	colHighest: 0.5,
	colHiEffect: 0.5,
	R: 640,
	sphereDenominator: 3,


};
let settingsRange = {
	levelBase: [0, 8],
	levelMulti: [0, 48],
	fftBins: [6, 15],
	fftSmoothing: [0, 1],

	powK: [0, 1],
	minK: [0, 1],

	repeatorNum: [1, 10],

	strokeWeight_main: [0, 10],
	strokeWeight_main_add: [0, 10],
	strokeWeight_deep: [0, 10],
	strokeWeight_deep_add: [0, 10],

	strokeColorHueOffset: [0, 360],
	strokeColorHueOffsetK: [0, 1],

	strokeAlpha: [0, 100],
	strokeAlpha_add: [0, 100],

	fillColorHueOffset: [0, 360],
	fillColorHueOffsetK: [0, 1],

	fillA: [0, 100],
	fillA_add: [0, 100],

	graMaxA: [0, 1],
	graMinA: [0, 1],

	bgAlpha: [0, 100],



	in_padding: [0, 256],
	grid_margin: [-Math.min(document.body.clientWidth, document.body.clientHeight) / 2, Math.min(document.body.clientWidth, document.body.clientHeight) / 2],
	cell_padding: [0, 256],
	cell_size: [24, 512],
	colHighest: [0, 1],
	colHiEffect: [0, 1],
	R: [100, 2000],
	sphereDenominator: [1, 8]

};

function guiLoadFileInit() {
	let input, maxFileMb = 10,
		fileTooBigAlert, fileTypeAlert;
	switch (navigator.language) {
		case "zh-CN":
			fileTooBigAlert = `文件不要超过 ${maxFileMb}Mb 哦～`;
			fileTypeAlert = '请加载音频或视频文件';
			break;
		default:
			fileTooBigAlert = `The file is too large, no more than ${maxFileMb}Mb `;
			fileTypeAlert = 'Please load an audio or video file';
	}

	if (document.getElementById(fileInputId)) {
		input = document.getElementById(fileInputId);
	} else {
		input = document.createElement('input');
		input.id = fileInputId;
		input.type = 'file';
		input.style = "opacity:1;position:fixed;z-index:-999;top:-100%;left:-100%;";
		document.body.appendChild(input);
	}

	input.addEventListener("click", function () { });
	input.addEventListener('change', function () {
		let file = input.files[0];


		if (file.size / 1024 / 1024 > maxFileMb) {
			alert(fileTooBigAlert);
			return;
		}
		if (!file.type.match(/(audio)|(video)/)) {
			alert(fileTypeAlert);
			return;
		}

		r = new FileReader();

		r.onprogress = () => {

			m.stop();
		};

		r.onload = function () {
			guiLoadMusicFile(r.result);
			m.soundName = file.name;
		}
		r.readAsDataURL(file);
	});
}

function guiLoadMusicFile(r) {
	if (inputSound == 'music') {
		m.switchMusic(r);
		setInputSound();
	} else {
		m.switchMusic(r);
		inputSoundG.setValue('music');
		setInputSound();
	}
}

let guiPreset = {
	"preset": "cyber",
	"closed": false,
	"remembered": {

		"cyber": {
			"0": {
				"inputSound": "mic",
				"levelBase": 3.80,
				"levelMulti": 14.3,
				"fftBins": 7,
				"fftSmoothing": 0.09,
				"powK": 0.690,
				"minK": 0.950,
				"repeatorNum": 5,
				"strokeWeight_main": 1,
				"strokeWeight_main_add": 2,
				"strokeWeight_deep": 1,
				"strokeWeight_deep_add": 1,
				"strokeColor": {
					"h": 257.6470588235294,
					"s": 1,
					"v": 0.9313725490196079
				},
				"strokeColorHueOffset": 9,
				"strokeColorHueOffsetK": 0.14,
				"strokeAlpha": 5,
				"strokeAlpha_add": 100,
				"fillColor": {
					"h": 250.58823529411762,
					"s": 1,
					"v": 0.5588235294117647
				},
				"fillColorHueOffset": 16,
				"fillColorHueOffsetK": 0.28,
				"fillA": 0,
				"fillA_add": 2,
				"bgAlpha": 72,
				"graMaxA": 0.02,
				"graMinA": 1,
				"in_padding": 22,
				"grid_margin": 0,
				"cell_padding": 54,
				"cell_size": 184,
				"colHighest": 0.51,
				"colHiEffect": 1,
				"R": 340,
				"sphereDenominator": 2
			}
		},
		"acid": {
			"0": {
				"inputSound": "music",
				"levelBase": 0.600,
				"levelMulti": 6,
				"fftBins": 6,
				"fftSmoothing": 0.09,
				"powK": 0.532,
				"minK": 0.94,
				"repeatorNum": 6,
				"strokeWeight_main": 1,
				"strokeWeight_main_add": 12,
				"strokeWeight_deep": 0,
				"strokeWeight_deep_add": 1,
				"strokeColor": {
					"h": 98.82352941176471,
					"s": 0.8511029411764706,
					"v": 0.9313725490196079
				},
				"strokeColorHueOffset": 155,
				"strokeColorHueOffsetK": 0.12,
				"strokeAlpha": 10,
				"strokeAlpha_add": 70,
				"fillColor": {
					"h": 218.82352941176472,
					"s": 1,
					"v": 0.28431372549019607
				},
				"fillColorHueOffset": 34,
				"fillColorHueOffsetK": 0.87,
				"fillA": 1,
				"fillA_add": 4,
				"bgAlpha": 29,
				"graMaxA": 0.14,
				"graMinA": 1,
				"in_padding": 16,
				"grid_margin": 0,
				"cell_padding": 100,
				"cell_size": 256,
				"colHighest": 0.49,
				"colHiEffect": 1,
				"R": 530,
				"sphereDenominator": 4
			}
		},
		"Default": {
			"0": {
				"inputSound": "mic",
				"levelBase": 1.20,
				"levelMulti": 5.7,
				"fftBins": 6,
				"fftSmoothing": 0.09,
				"powK": 0.532,
				"minK": 0.940,
				"repeatorNum": 6,
				"strokeWeight_main": 0,
				"strokeWeight_main_add": 2,
				"strokeWeight_deep": 1,
				"strokeWeight_deep_add": 2,
				"strokeColor": {
					"h": 268.2352941176471,
					"s": 0.26286764705882354,
					"v": 0.166
				},
				"strokeColorHueOffset": 0,
				"strokeColorHueOffsetK": 0,
				"strokeAlpha": 3,
				"strokeAlpha_add": 70,
				"fillColor": {
					"h": 257.6470588235294,
					"s": 0.5863970588235294,
					"v": 0.6274509803921569
				},
				"fillColorHueOffset": 20,
				"fillColorHueOffsetK": 0.19,
				"fillA": 1,
				"fillA_add": 16,
				"bgAlpha": 64,
				"graMaxA": 0.95,
				"graMinA": 0,
				"in_padding": 16,
				"grid_margin": 0,
				"cell_padding": 88,
				"cell_size": 162,
				"colHighest": 0.48,
				"colHiEffect": 0,
				"R": 540,
				"sphereDenominator": 3
			}
		},
	},
	"folders": {
		"sound level": {
			"preset": "Default",
			"closed": true,
			"folders": {}
		},
		"deep calc para": {
			"preset": "Default",
			"closed": true,
			"folders": {}
		},
		"stroke settings": {
			"preset": "Default",
			"closed": true,
			"folders": {}
		},
		"fill settings": {
			"preset": "Default",
			"closed": true,
			"folders": {}
		},
		"gradient settings": {
			"preset": "Default",
			"closed": true,
			"folders": {}
		},
		"grid and Cell settings": {
			"preset": "Default",
			"closed": true,
			"folders": {}
		}
	}
};

let levelBaseMax = 16,
	levelMultiMax = 48,
	fft, amplitude;
let inBorder, margin, padding, celSize, row, col;
let startBoo = false,
	onCtrlerBoo = false,
	hintBoo = false,
	onUploadBoo = false,
	holdGuiBoo = false;

let pageMargin = 24,
	describeFont, titleFont;

let sphereFun;

let m, mStatus; //for music

let pauseText = '',
	loadingBoo = true,
	errorBoo = false;

// const gui = new dat.GUI();
let gui, soundFolder, deepCalcFolder, strokeFolder, fillFolder, gradientFolder, gridCellFolder

let scale;

function preload() {

	describeFont = loadFont('https://fonts.cdnfonts.com/s/13928/Nimbus-Sans-D-OT-Light_32752.woff');
	titleFont = loadFont('https://fonts.cdnfonts.com/s/74329/Xhers Regular.woff');

	m = new Musics(loopBoo = true, showTextBoo = false, disableConsoleErrBoo = true, autoPlayBoo = false);
	m.setCallBack(successFn = () => {
		loadingBoo = false;
		errorBoo = false;
		setInputSound();
		redraw();
		// init();
	}, errorFn = () => {
		loadingBoo = false;
		errorBoo = true;
	}, loadingFn = () => {
		loadingBoo = true;
	});
	mStatus = function () {
		return m.musicStatus(failText = "error",
			loadingText = "loading",
			playingText = "playing",
			pausedText = "paused");
	}
	m.loadMusicFromJson("https://www.openprocessing.org/sketch/1454055/files/0__.json");

	// music = loadSound("Circuit_freepd_com.mp3");
	// music.stop();
}

function init() {

	scale = displayDensity();
	// let sUserAgent = navigator.userAgent;
	// if (sUserAgent.indexOf('Android') > -1 || sUserAgent.indexOf('iPhone') > -1 || sUserAgent.indexOf('iPad') > -1 || sUserAgent.indexOf('iPod') > -1 || sUserAgent.indexOf('Symbian') > -1) {
	// 	scale = scale;
	// } else {
	// 	scale = window.devicePixelRatio;
	// }
	// let cW = (document.body.scrollWidth || windowWidth);
	// let cH = (document.body.scrollHeight || windowHeight);
	let cW = (windowWidth);
	let cH = (windowHeight);
	// scale = Math.pow(scale, 2);

	scale = 1 / scale;
	inBorder = settings.in_padding * scale;
	margin = settings.grid_margin * scale;
	padding = settings.cell_padding * scale;
	celSize = settings.cell_size * scale;

	if (startBoo == true) {
		resizeCanvas(cW, cH);
	} else {
		cnv = createCanvas(cW, cH, P2D);
		cnv.mouseClicked(Clicked);
	}
	// cnv.mousePressed(() => {
	// 	// if (startBoo == false) {
	// 	// 	setInputSound();
	// 	// 	startBoo = true;
	// 	// }
	// 	// if (inputSound == 'music') {
	// 	// 	m.playPauseMusic();
	// 	// } else {
	// 	// 	if (isLooping() == true) { noLoop(); } else { loop(); }
	// 	// }
	// });


	// drawingContext.shadowOffsetX = 0;
	// drawingContext.shadowOffsetY = 0;
	// drawingContext.shadowBlur = 4;
	// drawingContext.shadowColor = "#FFFFFFff"


	let rowW = width - margin * 2 + padding;
	let colH = height - margin * 2 + padding;
	let k = rowW / colH;
	let vmin = Math.min(width, height);
	let minLi = 3;
	col = Math.max(Math.floor(minLi * width / vmin), Math.floor(colH / (celSize + padding)));
	row = Math.max(Math.floor(minLi * height / vmin), Math.floor(k * col));

	// TODO min max of row col  width height ;

	// col = Math.floor(colH / (celSize + padding));
	// row = Math.floor(rowW / (celSize + padding));

	// console.log("width,height,scale,margin,padding,rowW,colH,k,col, row".split(',').map(i => i + ':' + eval(i)).join(', '));

	g = new Grid(row, col, settings.R);
	sphereFun = sphericalCoordinate(perspectiveK = 0.9,
		W = width, H = height,
		midX = width / 2, midY = height / 2,
		Math.PI / settings.sphereDenominator, Math.PI / (settings.sphereDenominator * (width / height)));


	rectMode(CENTER);
	strokeJoin(ROUND);
	colorMode(HSB, 360, 100, 100, 100);

	background(0);
	redraw();
}

function guiInit() {

	let preset;

	let presetsArr = Object.keys(guiPreset.remembered);
	preset = presetsArr[Math.floor(Math.random() * presetsArr.length)];
	Object.keys(guiPreset.remembered).map(k => {
		Object.keys(guiPreset.remembered[k]).map(n => {
			delete (guiPreset.remembered[k][n].inputSound)
		})
	});
	// preset = JSON.parse(JSON.stringify(guiPreset));
	guiPreset.preset = String(preset);




	gui = new dat.GUI({
		"load": guiPreset,
		"preset": String(preset),
		"hideable": false,
	});



	gui.useLocalStorage = Boolean(eval(new URLSearchParams(location.search).get(useLocalStorageSearchName)));
	gui.width = 420;
	gui.autoPlace = true;
	gui.remember(settings);

	soundFolder = gui.addFolder('sound level');
	deepCalcFolder = gui.addFolder('deep calc para');
	strokeFolder = gui.addFolder('stroke settings');
	fillFolder = gui.addFolder('fill settings')
	gradientFolder = gui.addFolder('gradient settings')
	gridCellFolder = gui.addFolder('grid and Cell settings')



	inputSoundG = soundFolder.add(settings, 'inputSound', ['mic', 'music']);


	loadFileG = soundFolder.add(settings, 'loadFile'); //.name('Load music file');

	levelBaseG = soundFolder.add(settings, "levelBase", ...settingsRange["levelBase"], 0.1);
	levelMultiG = soundFolder.add(settings, "levelMulti", ...settingsRange["levelMulti"], 0.1);
	fftBinsG = soundFolder.add(settings, "fftBins", ...settingsRange["fftBins"], 1);
	fftSmoothingG = soundFolder.add(settings, "fftSmoothing", ...settingsRange["fftSmoothing"], 0.01);

	powKG = deepCalcFolder.add(settings, "powK", ...settingsRange["powK"], 0.001);
	minKG = deepCalcFolder.add(settings, "minK", ...settingsRange["minK"], 0.01);
	repeatorNumG = deepCalcFolder.add(settings, "repeatorNum", ...settingsRange["repeatorNum"], 1);


	strokeWeight_mainG = strokeFolder.add(settings, "strokeWeight_main", ...settingsRange["strokeWeight_main"], 1);
	strokeWeight_main_addG = strokeFolder.add(settings, "strokeWeight_main_add", ...settingsRange["strokeWeight_main_add"], 1);

	strokeWeight_deepG = strokeFolder.add(settings, "strokeWeight_deep", ...settingsRange["strokeWeight_deep"], 1);
	strokeWeight_deep_addG = strokeFolder.add(settings, "strokeWeight_deep_add", ...settingsRange["strokeWeight_deep_add"], 1);

	strokeColorG = strokeFolder.addColor(settings, "strokeColor");
	strokeColorHueOffsetG = strokeFolder.add(settings, "strokeColorHueOffset", ...settingsRange["strokeColorHueOffset"], 1);
	strokeColorHueOffsetKG = strokeFolder.add(settings, "strokeColorHueOffsetK", ...settingsRange["strokeColorHueOffsetK"], 0.01);

	strokeAlphaG = strokeFolder.add(settings, "strokeAlpha", ...settingsRange["strokeAlpha"], 1);
	strokeAlpha_addG = strokeFolder.add(settings, "strokeAlpha_add", ...settingsRange["strokeAlpha_add"], 1);


	fillColorG = fillFolder.addColor(settings, "fillColor");
	fillColorHueOffsetG = fillFolder.add(settings, "fillColorHueOffset", ...settingsRange["fillColorHueOffset"], 1);
	fillColorHueOffsetKG = fillFolder.add(settings, "fillColorHueOffsetK", ...settingsRange["fillColorHueOffsetK"], 0.01);

	fillAG = fillFolder.add(settings, "fillA", ...settingsRange["fillA"], 1);
	fillA_addG = fillFolder.add(settings, "fillA_add", ...settingsRange["fillA_add"], 1);

	bgAlphaG = gui.add(settings, 'bgAlpha', ...settingsRange["bgAlpha"], 1);


	graMaxAG = gradientFolder.add(settings, 'graMaxA', ...settingsRange["graMaxA"], 0.01);
	graMinAG = gradientFolder.add(settings, 'graMinA', ...settingsRange["graMinA"], 0.01);
	useGradientG = gradientFolder.add(settings, 'useGradient');


	inBorder_0G = gridCellFolder.add(settings, "in_padding", ...settingsRange["in_padding"], 1);
	margin_0G = gridCellFolder.add(settings, "grid_margin", ...settingsRange["grid_margin"], 2);
	padding_0G = gridCellFolder.add(settings, "cell_padding", ...settingsRange["cell_padding"], 2);
	celSize_0G = gridCellFolder.add(settings, "cell_size", ...settingsRange["cell_size"], 2);
	colHighestG = gridCellFolder.add(settings, "colHighest", ...settingsRange["colHighest"], 0.01);
	colHiEffectG = gridCellFolder.add(settings, "colHiEffect", ...settingsRange["colHiEffect"], 0.01);

	rG = gridCellFolder.add(settings, "R", ...settingsRange["R"], 10);
	sphereDenominatorG = gridCellFolder.add(settings, "sphereDenominator", ...settingsRange["sphereDenominator"], 1);

	// gui.load = settingsGroups[Math.floor(Math.random() * settingsGroups.length)];

	inputSoundG.setValue(inputSound);

	inputSoundG.onChange(() => {
		inputSound = inputSoundG.getValue();
		setInputSound();
		draw();
	});

	[powKG, minKG, repeatorNumG, graMaxAG, graMinAG, margin_0G, padding_0G, celSize_0G, rG, sphereDenominatorG].map(
		i => {
			i.onChange(function () {
				init();
			})

		}
	);

	inBorder_0G.onChange(function () {
		inBorder = settings.in_padding * scale;
	});

	let useCapture = false;

	loadFileG.domElement.addEventListener('mouseover', function () {
		onUploadBoo = true;

	}, useCapture);
	loadFileG.domElement.addEventListener('mouseout', function () {
		onUploadBoo = false;

	}, useCapture);

	// [inputSoundG, levelBaseG, levelMultiG, fftBinsG, fftSmoothingG, deepCalcFolder, strokeFolder, fillFolder, gradientFolder, gridCellFolder].map(g => {
	[gui].map(g => {
		g.domElement.addEventListener('mouseover', guiMouseOver, useCapture);
		g.domElement.addEventListener('mouseout', guiMouseOut, useCapture);
	});

	document.querySelector('.save-row').addEventListener('mouseover', guiMouseOver, useCapture);
	document.querySelector('.save-row').addEventListener('mouseout', guiMouseOut, useCapture);
}

function guiMouseOver() {
	onCtrlerBoo = true;
	// return false;
}

function guiMouseOut() {
	onCtrlerBoo = false;
	// return false;
}

function setup() {
	fft = new p5.FFT(settings.fftSmoothing, Math.pow(2, settings.fftBins));
	amplitude = new p5.Amplitude();

	init();
	guiLoadFileInit();
	guiInit();


	// setInputSound();
	// set dat.gui 


}

function draw() {

	if (keyIsPressed === true) {

		Object.keys(keyDownList).map(k => {
			if (keyIsDown(k)) {
				keyCtrl(k);
			} else {
				delete (keyDownList[k]);
			}
		});

	}

	let level = amplitude.getLevel();

	blendMode(BLEND);
	background(0, settings.bgAlpha);


	fft.analyze();
	let levels = fft.linAverages(Math.min(g.row, 16));

	if (startBoo == false) {
		levels = levels.map(i => Math.random() * 255);
	}

	if (levels.length < g.row) {
		levels = concat(levels, [...new Array(g.row - 16)].map(i => 0));
	}


	levels = arrCleanAndExtend(levels, 0.005, (p, start, end) => {
		if ([...arguments].some(i => typeof (i) == 'undefined')) {
			return end;
		}
		return map(Math.pow(p, 2) + (Math.random() - 0.5) / 2, 0, 1, start, end)
	});

	// console.log(levels);
	if (levels.every(i => i < 0.1) && startBoo == true && inputSound == 'mic') {
		push();
		translate(width / 2, height / 2);
		textAlign(CENTER, CENTER);
		textSize(Math.max(width, height) / 64);
		fill(255);
		text('Using micphone, say sth 😉 ', 0, 0);
		pop();
	}

	g.update(levels.map(l => l * (level * settings.levelMulti + settings.levelBase)));

	// blendMode(ADD);
	blendMode(SCREEN);
	g.show();

	layout();

	if (startBoo == false) {// 刚加载
		hint();
		noLoop();
	}
	if (hintBoo == true) {// 手动显示提示
		hint();
	}
	if (['paused', 'loading'].indexOf(mStatus()) != -1 && inputSound == 'music' && startBoo == true) {// 手动暂停
		musicStatusText();
	}


}

function layout() {
	let dpDensity = 1; // displayDensity();


	//title describeFont or titleFont
	push();
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
	// textAlign(LEFT, TOP);
	textSize(dpDensity * 36);
	text('< RECT >', 0, 0);

	pop();

	//name
	push();
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
	pop();



	//hint text

	push();
	fill(233);
	let hintStr = pauseText + '\n';
	if (inputSound == 'music') {
		// console.log(m.musicStatus);
		let mStr = m.musicStatus(failText = "load error,please reload",
			loadingText = "loading, please wait",
			playingText = "music playing, click to pause",
			pausedText = "music paused, click to play");
		if (mStr == false) {
			switch (true) {
				case loadingBoo:
					mStr = 'loading , please wait';
					break;
				case errorBoo:
					mStr = 'load error , please refresh page';
					break;
				default:
					mStr = "sth went wrong, please contact me https://github.com/leizingyiu to report bug"
			}

		}
		hintStr += mStr;
		hintStr += '; type r to switch song; type t to switch to microphone ; ';
	} else {
		hintStr += 'Using microphone ; type t to switch to music ; click to pause and continue ;';
	}
	hintStr += '\rtype s to save img ; [esc] for hint text ; [ ` ] for control panel';
	textSize(dpDensity * 12);
	textFont(describeFont);
	if (textWidth(hintStr) > width - nameWidth - pageMargin * 3) {
		hintStr = hintStr.replace(/; /g, ';\n');
	}
	textAlign(LEFT, BOTTOM);
	text(hintStr, pageMargin, height - pageMargin);

	if (Boolean(eval(new URLSearchParams(location.search).get(showFrameRateSearchName))) == true) {
		text(frameRate(), pageMargin, height - pageMargin - dpDensity * 12 * 1.5); // frameRate;
	}
	pop();
}

function Clicked() {

	if (onUploadBoo == true) {
		document.getElementById('musicFileInput').click();
		return true;
	};

	let pauseTextBoo = false;
	if (onCtrlerBoo == true) {
		return false;
	}
	if (startBoo == false) {
		setInputSound();
		startBoo = true;
	}

	if (holdGuiBoo == false) { gui.close(); }
	if (hintBoo == true) {
		hintBoo = false;
		if (mStatus() == 'playing') {
			return;
		}
	}

	if (inputSound == 'music' && m) {
		if (isLooping() == true && m.isPlaying() == false) {
			m.play();

		} else if (isLooping() == true || m.isPlaying() == true) {
			m.pause();
			noLoop();
			pauseTextBoo = true;

		} else if (isLooping() == false || m.isPlaying() == false) {
			m.play();
			loop();

		}
	} else {
		m && m.stop();
		if (isLooping()) {
			noLoop();
			pauseTextBoo = true;
		} else {
			loop();
		}
	}

	// console.log('inputSound,isLooping(),m.isPlaying(),pauseTextBoo'.split(',').map(i => i + ":" + eval(i) + ', ').join(''));

	if (pauseTextBoo == true) {
		pauseText = 'paused, click to continue';
	} else {
		pauseText = ''
	};

	draw();

	//init();
	//	return false;
}


function windowResized() {
	init();
}





function setInputSound() {
	// console.trace();
	// console.log(inputSound);


	// let inputSound = musicBoo == true ? 'music' : "mic";
	if (inputSound == 'mic') {

		if (typeof m != 'undefined') {
			try {
				m.stop();
			} catch (err) { }
		}


		if (typeof mic == 'undefined') {
			userStartAudio();
			mic = new p5.AudioIn();
		}
		if (typeof fft == 'undefined') {
			fft = new p5.FFT(settings.fftSmoothing, Math.pow(2, settings.fftBins));
		}
		if (startBoo == false) {
			userStartAudio();
		}
		mic.start();

		fft.setInput(mic);
		//amplitude = new p5.Amplitude();
		// debugger;
		// amplitude.setInput(mic);
		amplitude = mic;
		// debugger;
	} else {
		if (isLooping()) {
			m.loop();
		}
		if (startBoo == false) {
			m.stop();
		}
		fft.setInput(m.music);

		amplitude = new p5.Amplitude();

		amplitude.setInput(m.music);
	}

	levelBaseG.setValue(inputSound == 'music' ? Math.max(0.64, levelBaseG.getValue()) : Math.max(1.5, levelBaseG.getValue()));
	levelMultiG.setValue(inputSound == 'music' ? Math.max(9, levelMultiG.getValue()) : Math.max(6, levelMultiG.getValue()));

}

function hint(hintCenter = true) {
	push();
	// colorMode(RGB, 255);
	let d = 32;



	let title = inputSound == 'mic' ?
		`T a p _ h e r e _ t o _ a c t i v a t e _ m i c , o r _ p a u s e` :
		(loadingBoo == true ? "M u s i c  i s  l o a d i n g  ,  P l e a s e  w a i t \n" : `T a b _ h e r e _ t o _ p l a y , o r _ p a u s e`);

	let hintText1 = "HOLD KEY  \n" +
		"AND MOVE MOUSE  \n" +
		"[1] + mouse = level base and multi" + "\n" +
		"[2] + mouse = fft" + "\n" +
		"[3] + mouse = powK and minK " + "\n" +
		"[4] + mouse = repeatorNum " + "\n" +
		"[a] + mouse = strokeWeight main & add" + "\n" +
		"[s] + mouse = strokeWeight deep & add" + "\n" +
		"[z] + mouse = stroke hue offset " + "\n" +
		"[x] + mouse = fill hue offset " + "\n" +
		"[q] + mouse = stroke alpha " + "\n" +
		"[w] + mouse = fill alpha " + "\n"


	let hintText2 = "[b] + mouse = fill color h s " + "\n" +
		"[g] + mouse = stroke color h s " + "\n" +
		"[m] + mouse = fill color s v " + "\n" +
		"[n] + mouse = stroke color s v " + "\n" +
		"[j] + mouse = fill and stroke s v " + "\n" +
		"[h] + mouse = fill and stroke hue " + "\n" +
		"[e] + mouse = gradient " + "\n" +
		"[y] + mouse = in_padding and cellsize " + "\n" +
		"[u] + mouse = grid_margin and cell_padding " + "\n" +
		"[i] + mouse = colHighest " + "\n" +
		"[o] + mouse = r and sphereDenominator " + "\n" +
		"[p] + mouse = background alpha " + "\n";

	let hintText3 = "PRESS \n [ \` ] for switch pannal open and close ,\n" +
		"[ t ] for switch music  and mic , [ r ] fot switch song ,\n" +
		"[esc] for hint ; hold [shift] for hint below";

	if (hintCenter == false) {
		push();
		let hintText = [hintText1, hintText2, hintText3].map(i => i.replace(/\n/g, '; ')).join('\n');
		fill(255);
		textSize(height / d / 3);

		let hintRect = describeFont.textBounds(hintText, width / 2, height / 2, height / d / 3);

		translate(0, height - hintRect.h - pageMargin);
		rectMode(CENTER);
		textAlign(CENTER, BOTTOM);
		text(hintText, width / 2, -hintRect.h - pageMargin, width - pageMargin * 4)
		pop();
		return;
	}

	translate(0, height / 2);
	fill(100);
	stroke(0);
	strokeWeight(0);

	rectMode(CENTER);
	textLeading(0);
	let ttlRect = titleFont.textBounds(title, width / 2, height / 2, height / d);
	rectMode(CENTER);
	textLeading(32);
	let hintRect1 = describeFont.textBounds(hintText1, 0, height / 2, height / d / 2);
	let hintRect2 = describeFont.textBounds(hintText2, 0, height / 2, height / d / 2);
	let hintRect3 = describeFont.textBounds(hintText3, 0, height / 2, height / d / 2);


	let txtpadding = 20;

	rectMode(CENTER);

	push();
	blendMode(BLEND);
	fill(0, 80);
	rect(width / 2, 0,
		Math.max(ttlRect.w, (hintRect1.w + hintRect2.w), hintRect3.w) + txtpadding * 4,
		(ttlRect.h + Math.max(hintRect1.h, hintRect2.h) + hintRect3.h + txtpadding * 2) + txtpadding * 8
	);
	pop();

	textFont(titleFont);
	textSize(height / d);
	textLeading(height / d * 1.2)
	textAlign(CENTER, BOTTOM);
	let startPosition = -(ttlRect.h + txtpadding * 2 + Math.max(hintRect1.h, hintRect2.h) + hintRect3.h) / 2;
	text(title,
		width / 2, startPosition,
		width - settings.grid_margin * 2);

	push();
	textFont(describeFont)
	rectMode(CORNER);
	textSize(height / d / 2);
	textLeading(32);
	textAlign(LEFT, TOP);

	text(hintText1,
		Math.max(width / 2 - hintRect1.w - txtpadding, 0), startPosition + ttlRect.h + txtpadding,
		Math.min((width), hintRect1.w + txtpadding));

	text(hintText2,
		Math.max(width / 2 + txtpadding, width / 2), startPosition + ttlRect.h + txtpadding,
		Math.min((width), hintRect2.w + txtpadding));

	rectMode(CENTER);
	textAlign(CENTER, TOP);

	text(hintText3,
		width / 2, startPosition + ttlRect.h + 3 * txtpadding + Math.max(hintRect1.h, hintRect2.h),
		Math.min((width), hintRect3.w + txtpadding));
	pop();
	pop();
}
function musicStatusText() {
	let txt;
	switch (mStatus()) {
		case "paused":
			txt = 'Music paused or finished,\nClick to play , or load music in the control panel ';
			break;
		case "loading":
			txt = 'Music is loading ,pls wait'
			break;
	}
	let d = 24;
	push()
	stroke(0);
	strokeWeight(0);
	rectMode(CENTER);
	textSize(height / d);
	textLeading(height / d * 1.25);
	let ttlRect = titleFont.textBounds(txt, 0, 0, height / d);
	textAlign(CENTER, BOTTOM);
	textFont(titleFont);
	blendMode(BLEND);
	fill(0, 36);
	rect(width / 2, height / 2, ttlRect.w + pageMargin * 3, ttlRect.h + pageMargin * 2);
	// rect(width / 2, height / 2, 100, 100);
	fill(100);
	translate(width / 2, height / 2);
	text(txt, 0, 0, width);

	pop();
}


function keyCtrl(keycode) {
	keycode = Number(keycode);

	if ((typeof keycode) === 'number' && isNaN(keycode)) {

		return;
	}

	let mx = mouseX / width;
	let my = mouseY / height;
	let mdx = (0.5 - Math.abs(mx - 0.5)) / 0.5;
	let mdy = (0.5 - Math.abs(my - 0.5)) / 0.5;
	let px = (mouseX - pmouseX) / width;
	let py = (mouseY - pmouseY) / height;

	switch (keycode) {
		//key  = and -  strokeWeight deep 
		case 187:
			strokeWeight_deepG.setValue(strokeWeight_deepG.getValue() + 1);
			break;
		case 189:
			strokeWeight_deepG.setValue(strokeWeight_deepG.getValue() - 1);
			break;

		//key  [ and ]  strokeWeight main 
		case 221:
			strokeWeight_mainG.setValue(strokeWeight_mainG.getValue() + 1);
			break;
		case 219:
			strokeWeight_mainG.setValue(strokeWeight_mainG.getValue() - 1);
			break;

		//key  , .  fillColor
		case 188:
			fillColorG.setValue({
				h: (settings.fillColor.h + 5 + 360) % 360,
				s: settings.fillColor.s,
				v: settings.fillColor.v
			});
			break;
		case 190:
			fillColorG.setValue({
				h: (settings.fillColor.h - 5 + 360) % 360,
				s: settings.fillColor.s,
				v: settings.fillColor.v
			});
			break;

		//key ; ' strokeColor
		case 186:
			strokeColorG.setValue({
				h: (settings.strokeColor.h + 5 + 360) % 360,
				s: settings.strokeColor.s,
				v: settings.strokeColor.v
			});
			break;
		case 222:
			strokeColorG.setValue({
				h: (settings.strokeColor.h - 5 + 360) % 360,
				s: settings.strokeColor.s,
				v: settings.strokeColor.v
			});
			break;

		//key 9 0 in_padding
		case 57:
			inBorder_0G.setValue(inBorder_0G.getValue() + 5);
			break;
		case 48:
			inBorder_0G.setValue(inBorder_0G.getValue() - 5);
			break;

		//key  up down arrow  minK
		case 38:
			minKG.setValue(settings.minK + 0.05);
			break;
		case 40:
			minKG.setValue(settings.minK - 0.05);
			break;

		// with mouse 
		case 49: // key 1 for level base and multi
			levelBaseG.setValue(
				map(mdx, 0, 1, ...settingsRange.levelBase)
			);
			levelMultiG.setValue(
				map(mdy, 0, 1, ...settingsRange.levelMulti)
			);
			break;
		case 50: // key 2 for fft
			fftBinsG.setValue(
				map(mdx, 0, 1, ...settingsRange.fftBins)
			);
			fftSmoothingG.setValue(
				map(mdy, 0, 1, ...settingsRange.fftSmoothing)
			);
			break;
		case 51: // key 3 for powK and minK 
			powKG.setValue(
				map(mdx, 0, 1, ...settingsRange.powK)
			);
			minKG.setValue(
				map(mdy, 0, 1, ...settingsRange.minK)
			);
			break;
		case 52: // key 4 for repeatorNum 
			repeatorNumG.setValue(
				map(mdx, 0, 1, ...settingsRange.repeatorNum)
			);
			break;

		case 65: // key a for strokeWeight main and add
			strokeWeight_mainG.setValue(
				map(mx, 0, 1, ...settingsRange.strokeWeight_main)
			);
			strokeWeight_main_addG.setValue(
				map(my, 0, 1, ...settingsRange.strokeWeight_main_add)
			);
			break;

		case 83: // key s for strokeWeight deep and add 
			strokeWeight_deepG.setValue(
				map(mx, 0, 1, ...settingsRange.strokeWeight_deep)
			);
			strokeWeight_deep_addG.setValue(
				map(my, 0, 1, ...settingsRange.strokeWeight_deep_add)
			);
			break;

		case 90: // key z for stroke hue offset   
			strokeColorHueOffsetG.setValue(
				map(mx, 0, 1, ...settingsRange.strokeColorHueOffset)
			);
			strokeColorHueOffsetKG.setValue(
				map(my, 0, 1, ...settingsRange.strokeColorHueOffsetK)
			);
			break;
		case 88: // key x for fill hue offset  
			fillColorHueOffsetG.setValue(
				map(mx, 0, 1, ...settingsRange.fillColorHueOffset)
			);
			fillColorHueOffsetKG.setValue(
				map(my, 0, 1, ...settingsRange.fillColorHueOffsetK)
			);
			break;

		case 81: // key q for stroke alpha  
			strokeAlphaG.setValue(
				map(mx, 0, 1, ...settingsRange.strokeAlpha)
			);
			strokeAlpha_addG.setValue(
				map(my, 0, 1, ...settingsRange.strokeAlpha_add)
			);
			break;

		case 87: // key w for fill alpha  
			fillAG.setValue(
				map(mx, 0, 1, ...settingsRange.fillA)
			);
			fillA_addG.setValue(
				map(my, 0, 1, ...settingsRange.fillA_add)
			);
			break;

		case 66: // key b for  fill color  h s 
			fillColorG.setValue({
				h: mx * 360,
				s: 1 - my,
				v: settings.fillColor.v
			});
			break;
		case 71: // key g for  stroke color h s  
			strokeColorG.setValue({
				h: mx * 360,
				s: 1 - my,
				v: settings.strokeColor.v
			});
			break;

		case 78: // key m for fill   color s v 
			fillColorG.setValue({
				h: settings.fillColor.h,
				s: mouseX / width,
				v: 1 - mouseY / height
			});
			break;
		case 77: // key n for stroke color s v 
			strokeColorG.setValue({
				h: settings.strokeColor.h,
				s: mouseX / width,
				v: 1 - mouseY / height
			});
			break;

		case 74: // key j for fill and stroke s v 
			strokeColorG.setValue({
				h: settings.strokeColor.h,
				s: mouseX / width,
				v: 1 - mouseY / height
			});
			fillColorG.setValue({
				h: settings.fillColor.h,
				s: mouseX / width,
				v: 1 - mouseY / height
			});
			break;
		case 72: // key h for fill and stroke hue 
			strokeColorG.setValue({
				h: (mouseX / width) * 360,
				s: settings.strokeColor.s,
				v: settings.strokeColor.v
			});
			fillColorG.setValue({
				h: (1 - mouseY / height) * 360,
				s: settings.fillColor.s,
				v: settings.fillColor.v
			});
			break;

		case 69: // key e  for gradient   
			graMaxAG.setValue(
				map(mx, 0, 1, ...settingsRange.graMaxA)
			);
			graMinAG.setValue(
				map(my, 0, 1, ...settingsRange.graMinA)
			);
			break;

		case 89: // key y for in_padding and cellsize  
			celSize_0G.setValue(
				map(mx, 0, 1, ...settingsRange.cell_size)
			);
			inBorder_0G.setValue(
				map(my, 0, 1, ...settingsRange.in_padding)
			);

			break;

		case 85: // key u for grid_margin and cell_padding  
			margin_0G.setValue(
				map(mx, 0, 1, ...settingsRange.grid_margin)
			);
			padding_0G.setValue(
				map(my, 0, 1, ...settingsRange.cell_padding)
			);
			break;

		case 73: // key i for colHighest   
			colHighestG.setValue(
				map(my, 0, 1, ...settingsRange.colHighest)
			);
			colHiEffectG.setValue(
				map(mx, 0, 1, ...settingsRange.colHiEffect)
			);
			break;

		case 79: // key o for r and sphereDenominator  
			rG.setValue(
				map(my, 0, 1, ...settingsRange.R)
			);
			sphereDenominatorG.setValue(
				map(mx, 0, 1, ...settingsRange.sphereDenominator)
			);
		case 80: // key p for background alpha  
			bgAlphaG.setValue(
				map(mdx + mdy, 0, 2, ...settingsRange.bgAlpha)
			);


			break;


			break;

		case 16://key shift to  hint
			hint(false);
			holdGuiBoo = true;
			break;
		default:
			return false;
	}
}
let keyDownList = {};

function keyPressed() {

	switch (keyCode) {
		case 192: //key ` to close or open gui
			if (gui.closed == true) {
				gui.open();
			} else {
				gui.close();
			}
			break;

		case 84: // key t to switch to mic or music
			inputSoundG.setValue((inputSound == 'music' ? 'mic' : 'music'));

			// setInputSound();
			return false;
			break;

		case 67: // key c to random color;
			strokeColorG.setValue({
				h: Math.random() * 360,
				s: Math.random() * 0.5 + 0.5,
				v: Math.random()
			});


			fillColorG.setValue({
				h: Math.random() * 360,
				s: Math.random() * 0.5 + 0.5,
				v: Math.random()
			});
			break;

		case 82: // key r to switch music;
			if (inputSound == 'music') {
				m.switchMusic();
				setInputSound();
			}
			break;

		case 27: //key esc to show and hide hint text
			hintBoo = !hintBoo;
			break;

		default:
			break;
	}

	keyDownList[keyCode] = true;
	init();
	draw();

	return false;
}

function keyReleased() {
	delete (keyDownList[keyCode]);
	switch (keyCode) {
		case 16: // key shift 
			holdGuiBoo = false;
			break;
	}

}