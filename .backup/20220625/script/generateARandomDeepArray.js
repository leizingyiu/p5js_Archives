//https://jsbin.com/refojok/edit?js,console

function pickSome(N, n) {
    let arr = [...new Array(N)].map((i, idx) => idx);
    let r = [];
    for (let i = 0; i < n; i++) {
        let o = Math.floor(Math.random() * arr.length);
        r.push(arr[o]);
        delete arr[o];
        arr = arr.filter(i => i !== undefined);
    }
    return r.sort();
}
// console.log(pickSome(10,5),'在一列10个中，点第几几几个，总共5个');

function ranRound(N, n) {
    if (n == 1) { return [N]; }
    let arr = pickSome(N, n - 1);
    let rarr = arr.map((i, idx, arr) => idx == 0 ? i : (i - arr[idx - 1]));
    rarr.push(N - arr[arr.length - 1]);
    return rarr;
}
// console.log(ranRound(10,5),'在一列10个中，点第几几几个，总共5个；在这几个中拆分队列，分别数每个队列的数量');

function makeArr(n) {
    let a = [];
    for (let i = 0; i < n; i++) {
        a[i] = 1;
    }
    return a;
}

function zipArr(arr) {
    if (typeof arr == 'object' && arr.length == 1 && typeof arr[0] == 'object') {
        return zipArr(arr[0]);
    }
    if (typeof arr == 'object' && arr.length == 1) {
        return arr[0];
    }
    arr = arr.map(i => {
        // console.log("i,typeof i=='object', i.length==1 , typeof i[0]== 'object'".split(',').map(j=>j+':'+eval(j)+''));
        if (typeof i == 'object' && i.length == 1 && typeof i[0] == 'object') {
            // console.log(JSON.stringify(i,' ',4));
            i = zipArr(i[0]);
        } else if (typeof i == 'object' && i.length == 1) {
            return i[0];
        }
        return i;
    });
    return arr;
}
// let runtime=0;

function makeArrDeep(N, blockMax) {
    // runtime += 1;
    var n, a;

    n = Math.ceil(Math.random() * N);//先抽取第一层数量
    a = makeArr(n);
    // console.log('1: ' + 'N,n,a'.split(',').map(i => i + ':' + eval(i) + ''));

    N -= n;//剩余个数
    if (N > 0) {
        let m = Math.min(Math.ceil(Math.random() * N), n);//抽取第一层中m个来填充第二层

        let idxArr = pickSome(n, m);
        let NArr = ranRound(N, m);
        // console.log("2: " + 'N,n,m,idxArr,NArr'.split(',').map(i => i + ':' + eval(i) + ''));
        for (let i = 0; i < m; i++) {
            if (NArr[i] + 1 > blockMax) {//如果一次给一个格子添加的小鸽子太多
                let j = Math.ceil((NArr[i] + 1) / blockMax);//那就强行拆开成若干份
                let Nnew = NArr[i] + 1;
                let NnewArr = [...new Array(j)].map((l, idx) => Nnew % blockMax == 0 ? blockMax : (idx === 0 ? Nnew % blockMax : blockMax))
                a[idxArr[i]] = [];
                // console.log("5: " + 'Nnew,j,NnewArr'.split(',').map(i => i + ':' + eval(i) + ''));
                for (let k = 0; k < j; k++) {
                    a[idxArr[i]][k] = makeArrDeep(NnewArr[k], blockMax);//如果是若干份里面的第一份，就用余数，如果不是，就用最大的份数
                }
                // console.log("4: " + 'N,n,a'.split(',').map(i => i + ':' + eval(i) + ''));
            } else {
                a[idxArr[i]] = makeArrDeep(NArr[i] + 1, blockMax);//如果这次给的格子不多，就把格子给到抽取的格子中间
            }
        }
        // console.log("3: " + 'N,n,a'.split(',').map(i => i + ':' + eval(i) + ''));
        // console.log('_____' + runtime + '_____')

    }
    a = zipArr(a);

    return a;
}

    // for(let i=0;i<5;i++){
    // console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
    // var N=5,m=2;
    // var a=makeArrDeep(N,m);
    // console.log(JSON.stringify(a,' ',4));
    //   let M=eval( a.toString().replace(/,/g,'+').replace(/\+\+/g,'+').replace(/\+$/,'') );
    // if(M!=N  ){
    //   console.error(`M ! = ${N}`);
    //   console.error('++++++++++++++++++++++++++++++++\n\nn\n\n\n\n\n\n\n\n\n\n\n\n\n')
    //   break;}
    // } 