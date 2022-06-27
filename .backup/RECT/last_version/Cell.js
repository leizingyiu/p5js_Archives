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