function Hz(settings = {
    fft: p5.prototype.soundOut.soundArray[0],// the fft from new p5.FFT()
    hzNum: 24,
    distributeFuncName: ['linear', 'pow'][0], // linear / pow / ease 
    distributePowBase: 1.01,// 1 ~ 1.1
    hzPowBase: 1.35, // 0 ~ 1
}) {
    let console = new Object();
    console.log = () => { };

    const defaultSettings = {
        fft: p5.prototype.soundOut.soundArray[0],// the fft from new p5.FFT()
        hzNum: 24,
        distributeFuncName: ['linear', 'pow'][0], // linear / pow / ease 
        distributePowBase: 1.01,// 1 ~ 1.1
        hzPowBase: 1.35, // 0 ~ 1
    }
    Object.keys(defaultSettings).map(key => {
        if (!(key in settings)) {
            settings[key] = defaultSettings[key];
        }
    });

    const that = {};
    that.hzArr = [];

    Object.keys(settings).map(key => {
        that[key] = settings[key];
    })
    let __inside__ = {};
    __inside__._pow = function (k, _hzDistributePowBase = that.distributePowBase, start = 0, end = 1) {
        start = start ? start : 0, end = end ? end : 1;
        let mid = (end - start) / 2 + start,
            min = Math.min(start, end), max = Math.max(start, end);

        let x = Math.min(Math.max(k, min), max),
            a = (mid - Math.abs(x - mid)),
            b = Math.sin(a * Math.PI) / 2,
            c = Math.pow(b * 2, _hzDistributePowBase) / 2,
            d = x < mid ? c : (end - c);
        return d;
    };

    __inside__._linear = function (k, start = 0, end = 1) {
        start = start ? start : 0, end = end ? end : 1;
        let mid = (end - start) / 2 + start,
            min = Math.min(start, end), max = Math.max(start, end);
        let x = Math.min(Math.max(k, min), max);

        return (x - start) / (end - start) + start;
    };

    __inside__.distributeFunc = function () {
        switch (that.distributeFuncName) {
            case 'linear':
                // case '_linear':
                return that._linear(...arguments);
                break;
            case 'ease':
            // case '_ease':
            case 'pow':
                // case '_pow':
                return that._pow(...arguments);
                break;
        };
    };

    __inside__.updateHz_iFn = function (i, dx, ar) {
        let result = dx / (ar.length - 1);
        // console.log(i, dx, ar, result);
        return result;
    };

    __inside__.updateHz_easeArgFn = function (i, dx, ar) {

        let result = {
            'pow': [that.updateHz_iFn(null, dx, ar), that.distributePowBase],
            // '_pow': [that.updateHz_iFn(null, dx, ar), that.distributePowBase],
            'ease': [that.updateHz_iFn(null, dx, ar), that.distributePowBase],
            // '_ease': [that.updateHz_iFn(null, dx, ar), that.distributePowBase],
            'linear': [that.updateHz_iFn(null, dx, ar)],
            // '_linear': [that.updateHz_iFn(null, dx, ar)],
        }[that.distributeFuncName];

        console.log(i, dx, ar, that.distributeFuncName, result);

        return result;
    };

    __inside__.updateHz_eachIdxFn = function (i, dx, ar) {
        let args = that.updateHz_easeArgFn(null, dx, ar);

        // let result = ar.length * that.distributeFunc(...that.updateHz_easeArgFn(null, dx, ar));
        let result = ar.length * that.distributeFunc(...args);
        console.log(dx, ar, args, result);

        return result;
    };

    __inside__.updateHz_eachSpot = function (i, dx, ar) {
        let hzMax = 11;
        let result = Math.pow(2, map(that.updateHz_eachIdxFn(null, dx, ar), 0, that.hzNum + 1, 1, hzMax)) * 10;
        console.log(result, i, dx, ar);
        return result;
    };

    __inside__.updateHz_eachInterval = function (i, dx, ar) {
        let result = dx == 0 ? null : [that.updateHz_eachSpot(null, dx - 1, ar), that.updateHz_eachSpot(null, dx, ar)];
        console.log(result, i, dx, ar);
        return result;
    };

    __inside__.updateHzArr = function (_hzNum = that.hzNum) {
        _hzNum = _hzNum ? _hzNum : (that.hzNum || 16);
        that.hzArr = [...new Array(_hzNum + 1)].map((ii, idx, arr) => {
            let result = that.updateHz_eachInterval(ii, idx, arr);
            // console.log(ii, idx, arr, result);
            return result;
        }).filter(Boolean);
    };

    __inside__.func = function (func) {
        Object.defineProperty(that, func, {
            get() {
                return __inside__[func];
            }
        });
    };

    __inside__.setter = function (prop) {
        Object.defineProperty(that, prop, {
            get() {
                return settings[prop];
            },
            set(newVal) {
                settings[prop] = newVal;
                that.updateHzArr();
            }
        });
    };

    ['_pow', '_linear', 'distributeFunc', 'updateHz_iFn', 'updateHz_easeArgFn', 'updateHz_eachIdxFn', 'updateHz_eachSpot', 'updateHz_eachInterval', 'updateHzArr', 'setter'].map(func => {
        __inside__.func(func);
    });

    that.updateHzArr();

    that.getEachEnergy = function (_hzNum = that.hzNum, _hzHeightPowBase = that.hzPowBase) {

        that.fft.analyze();

        // if (typeof that.hzArr == 'undefined' || that.hzArr.length != that.hzNum) {
        //     that.updateHzArr(that.hzNum);
        // }

        if (_hzNum != that.hzNum || that.hzArr.length != that.hzNum) {
            that.hzNum = _hzNum;
            that.updateHzArr(that.hzNum);
        }


        // hzArr = [...new Array(hzNum + 1)].map((ii, idx, arr) => hz_eachInterval(ii, idx, arr)).filter(Boolean);

        let energyMax = 255;
        //let  hzPowBase = 1.02; //指数的底数
        // console.log(that.hzArr);

        let energyArr = that.hzArr.map(ar => {
            let energy = that.fft.getEnergy(...ar);
            // return energy;
            // return (Math.pow(_hzHeightPowBase, energy) - 1);
            return ((Math.pow(_hzHeightPowBase, energy) - 1) / (Math.pow(_hzHeightPowBase, energyMax))) * energyMax;

            // return Math.abs(Math.pow(_hzHeightPowBase, energy) - Math.pow(_hzHeightPowBase, 0)) * energyMax;
            return ((Math.pow(_hzHeightPowBase, energy) - Math.pow(_hzHeightPowBase, 0)) / Math.pow(_hzHeightPowBase, energyMax)) * energyMax;
        });

        // console.log(_hzHeightPowBase, energyMax, that.hzArr, '\n', energyArr.map(i => i.toFixed(10)));

        return energyArr;
    };

    // Object.defineProperties(that, {
    //     'hzNum': {
    //         get() {
    //             return settings.hzNum;
    //         },
    //         set(newValue) {
    //             settings.hzNum = newValue;
    //             that.updateHzArr(that.hzNum);
    //         }
    //     },
    //     'distributePowBase': {
    //         get() {
    //             return settings.distributePowBase;
    //         },
    //         set(newValue) {
    //             settings.distributePowBase = newValue;
    //             that.updateHzArr(that.hzNum);
    //         }
    //     },
    //     'distributeFuncName': {
    //         get() {
    //             return settings.distributeFuncName;
    //         },
    //         set(newValue) {
    //             settings.distributeFuncName = newValue;
    //             that.updateHzArr(that.hzNum);
    //         }
    //     }
    // });


    ['hzNum', 'distributePowBase', 'distributeFuncName'].map(prop => {
        that.setter(prop);
    })
    return that;
}