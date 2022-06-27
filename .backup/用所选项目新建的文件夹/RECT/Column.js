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