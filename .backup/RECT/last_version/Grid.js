
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