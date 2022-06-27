// Created: "2022/03/29 16:10:00"
// Last modified: "2022/05/30 01:44:08"

class LRC {
    #map = typeof map == 'undefined' ? (value, start1, stop1, start2 = 0, stop2 = 1, withinBounds = true) => {
        let v = value / (stop1 - start1);
        let result = start2 + (stop2 - start2) * v;
        let min2 = Math.min(start2, stop2),
            max2 = Math.max(start2, stop2);
        if (withinBounds) {
            result = Math.min(Math.max(min2, result), max2);
        }
        return result;
    } : map;
    constructor(lrcStr, settings = {
        'in': 0.3,
        'out': 0.3,
        'inoutType': ['time', 'percentage'][0]
    }) {


        let defaultSettings = {
            'in': 0.3,
            'out': 0.3,
            'inoutType': ['time', 'percentage'][0]
        };
        Object.keys(defaultSettings).map(k => {
            if (k in settings) {
                return
            } else {
                settings[k] = defaultSettings[k];
            }
        });
        this.settings = settings;
        this.init(lrcStr, this.settings);
    }
    init(lrcStr, settings = this.settings) {
        this.ti = '', this.ar = '', this.al = '', this.by = '', this.offset = 0, this.ms = [];
        if (lrcStr.length == 0) {
            throw ('lrc str length is 0');
        }
        let lrcs = lrcStr.split('\n');
        for (var i in lrcs) { //遍历歌词数组
            lrcs[i] = lrcs[i].replace(/(^\s*)|(\s*$)/g, ""); //去除前后空格
            let t = lrcs[i].substring(lrcs[i].indexOf("[") + 1, lrcs[i].indexOf("]")); //取[]间的内容
            let s = t.split(":"); //分离:前后文字

            if (isNaN(parseInt(s[0]))) { //不是数值
                for (let i in this) {
                    if (i != "ms" && i == s[0].toLowerCase()) {
                        this[i] = s[1];
                    }
                }
            } else { //是数值
                let arr = lrcs[i].match(/\[(\d+:.+?)\]/g); //提取时间字段，可能有多个
                let start = 0;
                for (let k in arr) {
                    start += arr[k].length; //计算歌词位置
                }
                let content = lrcs[i].substring(start); //获取歌词内容
                for (let k in arr) {
                    let t = arr[k].substring(1, arr[k].length - 1); //取[]间的内容
                    let s = t.split(":"); //分离:前后文字
                    this.ms.push({ //对象{t:时间,c:歌词}加入ms数组
                        t: (parseFloat(s[0]) * 60 + parseFloat(s[1])).toFixed(3),
                        c: content
                    });
                }
            }
        }
        if (this.ms.length == 0) {
            throw ('can not find any time spot from input lrc text');
        }
        this.ms.sort(function (a, b) { //按时间顺序排序
            return a.t - b.t;
        });

        this.idx = {};
        this.ms.map((ms, idx) => {
            this.idx[ms.t] = idx;
        });
        this.before = this.ms[0].t;
        this.after = this.ms[this.ms.length - 1].t;

        this.lastUpdate = '';

        this.inoutType = settings.inoutType;
        this.in = settings.in, this.out = settings.out;
        this.index = 0;
    }
    update(t) {
        let T = t.toString();
        if (T == this.lastUpdate) {
            return
        } else {
            this.lastUpdate = T;
        }
        t = Number(t);

        Object.keys(this.idx).sort((a, b) => a - b).map(k => {
            let K = Number(k), B = Number(this.before), A = Number(this.after);
            this.before = (t > K) ? k : this.before;
        });

        Object.keys(this.idx).sort((a, b) => b - a).map(k => {
            let K = Number(k), B = Number(this.before), A = Number(this.after);
            this.after = (t < K) ? k : this.after;
        });

        this.index = this.idx[this.before];
    }

    at(t) { // return one of lrc at time of t ;  
        this.update(t);
        return this.ms[this.idx[this.before]].c;
    }
    inout(t, it = this.in, ot = this.out, type = this.inoutType) { // ease in and ease out 
        this.update(t);
        let i = 0,
            o = 0;
        let b = Number(this.before),
            a = Number(this.after);
        switch (type) {
            case 'time':
                i = this.#map(Math.abs(t - b), 0, it, 0, 1, true);
                o = this.#map(Math.abs(t - a), ot, 0, 0, 1, true);
                break;
            case 'percentage':
                i = this.#map(Math.abs(t - b) / (it * Math.abs(a - b)), 0, 1, 0, 1, true);
                o = this.#map(Math.abs(t - a) / (ot * Math.abs(a - b)), 1, 0, 0, 1, true);
                break;
            default:
                console.log(type, typeof type, ';', t, typeof t, ';', it, typeof it, ';', ot, typeof ot);
                throw ('inoutType error,pls check');
                return
        }
        // console.log(i, o, a, b, it, ot);
        if (Math.abs(it + ot) < (1 / frameRate())) {
            return [1, 0];
        }
        return [i, o];
    }
}