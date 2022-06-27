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

function consoleStr(str) {
	console.log(str.split(',').map(i => i + ": " + eval(i)).join(' , '));
}