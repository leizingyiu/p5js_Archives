if (!map) { // 假如没引用p5js,补充上map函数
    function map(value, start1, stop1, start2 = 0, stop2 = 1, withinBounds = true) {
        let v = value / (stop1 - start1);
        let result = start2 + (stop2 - start2) * v;
        let min2 = Math.min(start2, stop2),
            max2 = Math.max(start2, stop2);
        if (withinBounds) {
            result = Math.min(Math.max(min2, result), max2);
        }
        return result;
    }
}
//
let hzNum = 16/**分段数量*/,
    hzMax = 11/** 听力上限约为2的11次方*10 */;

let hzIdxArr, hzPowIdxArr, hzPowResultArr, hzIntervalArr;

hzIdxArr = [...new Array(hzNum + 1)].map((i, idx) => idx);                                       //按分段数量产生数组
hzPowIdxArr = hzIdxArr.map(i => map(i, Math.min(...hzIdxArr), Math.max(...hzIdxArr), 1, hzMax)); // 将分段序号压缩在听觉范围的指数之内
hzPowResultArr = hzPowIdxArr.map(i => Math.pow(2, i) * 10);                                      //将指数进行幂运算，变成实际的频率分段点
hzIntervalArr = hzPowResultArr.map((i, idx, arr) => idx == 0 ? null : [arr[idx - 1], i]).filter(Boolean); //将频率分段点，变成区间
//
//依照声音频段为指数，将高中低音按段分频
console.log(hzIdxArr.join(', '));
console.log(hzPowIdxArr.join(', '));
console.log(hzPowResultArr.map(i => i.toFixed(2)).join(', '));
console.log(hzIntervalArr.map(h => '[' + h.map(i => i.toFixed(2)).join(',') + ']').join(', '));
//
//————————————————————————————
//————————————————————————————
//
var exampleLength = (hzNum + 1) || 21, min = 0, max = 1, mid = 0.5, distributePowBase = 0.72, fixto = 4;
var x, a, b, c, d;
x = [...new Array(exampleLength)].map((i, idx, arr) => idx / (arr.length - 1));

a = x.map(i => (mid - Math.abs(i - mid)));
b = a.map(i => Math.sin(i * Math.PI) / 2);
c = b.map(i => Math.pow(i * 2, distributePowBase) / 2);
d = c.map((i, idx) => x[idx] < mid ? i : (max - i));

// c.l([x, a, b, c, d].map(ar => ar.map(i => i.toFixed(fixto)).join(', ')).join('\n\n'));
//依照听觉灵敏度，通过sin函数以及幂函数，将原本平均分布的分段，转换成中间频段占比更多
console.log([x, a, b, c, d].map((ar, idx) => ['x', 'a = f(x)', 'b = f(a)', 'c = f(b)', 'd = f(c)'][idx] + ' = ' + ar.map(i => i.toFixed(fixto)).join(', ')).join('\n\n'));


//
//See visualizations of the functions below at the following URLs
//
// m = 0.5, p = 1.1;
// o = x;
// a = m - Math.abs(x - m);
// b = Math.sin(a * Math.PI) / 2;
// c = Math.pow(b * 2, p) / 2;
// d = x < m ? c : 1 - c;

// ./fxVisualizer/index_2.html?draw_on_top=func&p5js_ctrler_type=slider&coordinate=fx_area&fx=m+%3D+0.5%2C+p+%3D+_p%3B%0Ao+%3D+x%3B%0Aa+%3D+m+-+Math.abs%28x+-+m%29%3B%0Ab+%3D+Math.sin%28a+*+Math.PI%29%2F2%3B%0Ac+%3D+Math.pow%28b+*+2%2C+_p%29+%2F+2%3B%0Ad+%3D+x+%3C+m+%3F+c+%3A+1+-+c%3B&upper_limit=1&lower_limit=0&variable_name=_p&new_ctrler=pc.slider%28%27_p%27%2C+0.8%2C0%2C1%2C0.001%29&p5js_Ctrler_parameter=1.1%2C1%2C1.5%2C0.001&_p=0.884&x_scale=x_precision&precision=128