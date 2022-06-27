function extendArr(array,l,fn=(p,start,end)=>start*(1-p)+end*(p)){
    let bArr=[...new Array(l)];
    bArr=bArr.map((i,idx,arr)=>{
        let l=arr.length,
            D=(idx)/(l-1),d=D*(array.length-1),
            Idx=Math.floor(d),
            proportion=Math.abs(d-Idx),
						start=array[Idx],end=array[Idx+1],
            result=d==Idx?array[d]:fn(proportion,start,end);
        return result;
    });
    return bArr;
}

function cleanArr(arr,threshold){
	let a=[...arr];
	for(let i=a.length-1;i>0;i--){
	if(a[i]<threshold){a.pop()}else{break;}
	}
	for(let i=0;i<a.length;i++){
	if(a[i]<threshold){a.shift()}else{break;}
	}
	return a;
}
function arrCleanAndExtend(arr,threshold,interpolationFn){
	let a=[...arr];
	let l=a.length;
	a=cleanArr(a,threshold);
	a=extendArr(a,l,interpolationFn);
	return a;
}