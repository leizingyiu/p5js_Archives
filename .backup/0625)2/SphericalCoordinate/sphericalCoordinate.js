
function sphericalCoordinate(perspectiveK,W,H,midX,midY,radianX, radianY){
	
	return function(ix,iy,R){
		let x = ix;//- midX;
		let y = iy - midY;

		let whMin = Math.min(W, H);
		let whMax = Math.max(W, H);
		// x=constrain(x, -whMin/2, whMin/2);
		// y=constrain(y, -whMin/2, whMin/2);

		let radx = x / (whMin / 2) * (radianX / Math.PI);
		let rady = y / (whMin / 2) * (radianY / Math.PI);


		let dx = R * Math.sin(radx * Math.PI / 2) * Math.cos(rady * Math.PI / 2);
		let dy = R * Math.sin(rady * Math.PI / 2);// * Math.cos(radx *Math.PI/2 ) ;
		let dz = R * Math.cos(radx * Math.PI / 2) * Math.cos(rady * Math.PI / 2); // * Math.sin(rady);

		let perspect = Math.pow(perspectiveK, dz / R); //Math.pow(map(R,0,whMax/2,1,perspectiveK),dz/R*2);
		let Dx = dx / perspect;
		let Dy = dy / perspect;
	
		return [Dx,Dy,perspect];
	}
}