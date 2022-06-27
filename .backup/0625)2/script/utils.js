// <script src="https://cdn.jsdelivr.net/gh/leizingyiu/utils@master/js/toTitleUpperCase.js"></script> 
const toTitleUpperCase = str => str.replace(/\S+/g, (word, idx, sentence) => ['the', 'a', 'an'].indexOf(word) != -1 ? word : word.toLowerCase().replace(/^[a-zA-Z]/, letter => letter.toUpperCase()));



const language = ["zh-CN", "zh-HK", "zh-MO", "zh-TW", "zh-SG"].indexOf(navigator.language) == -1 ? 'en' : 'cn';

function getDefaultFont() {
    let style = window.getComputedStyle(drawingContext.canvas);
    var defaultFont = style.getPropertyValue('font-family');
    return defaultFont;
}


function objToString(obj, tofixed = 2) {
    let str = '';
    if (obj instanceof Array) {
        return `[ ${obj.map(item => {
            if (item instanceof Object && !(item instanceof Function)) {
                return objToString(item);
            } else {
                let i = item;
                i = typeof i == 'number' && window.isNaN(i) == false ?
                    (String(i).indexOf('.') != -1 && String(i).split('.')[1].length > 2 ? i.toFixed(tofixed) : i) :
                    `"${i}"`;
                return i;
            }
        }).join(', ')} ]`
    } else if (obj instanceof Function) {
        return String(obj);
    } else if (obj instanceof Object) {
        Object.keys(obj).map(key => {
            let strk = '';
            if (obj[key] instanceof Array) {
                // strk = `[ ${obj[key].map(ak => {
                // }).join(', ')
                //     } ]`

                strk = objToString(obj[key]);

            } else if (obj[key] instanceof Object) {
                if (Object.keys(obj[key]).some(_key =>
                    Object.keys(obj[key]).join() == Object.keys(obj[key][_key]).join() &&
                    Object.keys(obj[key][_key]).join() == Object.keys(obj[key][_key][_key]).join()
                )) {
                    strk = '"error: Contains circular references"';
                } else {
                    strk = objToString(obj[key]);
                }
            } else {
                strk = obj[key];
                strk = typeof strk == 'number' && window.isNaN(strk) == false ?
                    (String(strk).indexOf('.') != -1 && String(strk).split('.')[1].length > 2 ? strk.toFixed(tofixed) : strk) :
                    `"${strk}"`;
            }
            str += '"' + key + '"' + ':' + strk + ', \n';
        });
        return `{${str.replace(/\n,\n/g, '\n').replace(/,\n}/g, '\n}').replace(/,[\s]*$/g, '')}}`;
    }
    return obj;
}

function ObjStrIndent(str, n = 1) {
    return str.replace(/[\}\{]/g, function (k, idx, sentence) {
        let beforeStr = sentence.slice(0, idx),
            beforeLeft = beforeStr.match(/\{/g),
            beforeRight = beforeStr.match(/\}/g);
        beforeLeft = beforeLeft ? beforeLeft.length : 0,
            beforeRight = beforeRight ? beforeRight.length : 0;
        let spaceNum = beforeLeft - beforeRight - 1;

        switch (k) {
            case '{':
                return '\n' + [...new Array((spaceNum + 1) * n)].join(' ') + '{';
                break;
            case '}':
                return '\n' + [...new Array((spaceNum) * n)].join(' ') + '}';
                break;
        }
    }).replace(/^\s*\n\s*/, '');
}

// console.log(ObjStrIndent(objToString(grid).replace(/\n/g,''),4))

function isWebGL(drawingTarget = window) {
    return String(drawingTarget.drawingContext.constructor).toLowerCase().indexOf('webgl') != -1;
}

function isMobile() {
    if (window.navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)) {
        return true;
    } else {
        return false;
    }
}


function arrMappingNewLength(arr, newLength) {
    let result = [...new Array(newLength)].map((i, idx) => idx);

    result = result.map(i => {
        let idx = i / (newLength - 1) * (arr.length - 1),
            before = Math.floor(idx),
            after = Math.ceil(idx),
            precent = (idx - before);
        return arr[before] + (arr[after] - arr[before]) * precent;
    });
    return result;
}