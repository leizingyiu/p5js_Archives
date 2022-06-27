
import {
    language,
    _pc,
    _preload,
    _setup,
    _windowResized
} from './Example.js';

var pc, fxTxt, pfx;
window.preload = () => {
    _preload();
    __preload();
};
window.setup = () => {
    _setup();
    __setup();
};

window.draw = () => {
    __draw();
};
window.windowResized = () => {
    _windowResized();
};

window.__preload = () => {
    document.title = 'f(x)[0,1]_v2 -- fx_name = Math.sin(x*x*x) -- p5js_ctrler example by leizingyiu';

    /** p5js_ctrler settings: */
    const hintText = {
        'slider': 'defaultVal = 0.5, minVal = 0 , maxVal = 1 , precision = 0.01',
        'checkbox': "defaultVal = false, labelText = ['yes', 'no']",
        'radio': 'options = []'
    };
    const paraText = {
        'slider': '0.5 , 0.0001 , 1 , 0.001',
        'checkbox': "true,['yes', 'no']",
        'radio': '[0,1,2]'
    }

    const preset = {
        "rect_fill": "#0080ff",
        "rect_fill_boo": true,
        "rect_stroke": "#ffffff",
        "rect_stroke_weight": 1,
        "func_curve_stroke": "#223344",
        "func_curve_stroke_weight": 4.4,
        "func_curve_stroke_boo": true,
        "draw_on_top": "func",
        "blendmode": "difference",
        "fx": "y=Math.pow(x**2,x);\nz=Math.sin(Math.pow(x,n)*Math.PI*n*2)\na=Math.pow(x,n)*Math.sin(x*Math.PI*n*2)",
        "precision": (isMobile()?48:512),
        "draw_zero_horizon": true,
        "upper_limit": "1.5",
        "lower_limit": "-1.5",
        "x_scale": "x_precision",
        "coordinate": "fx_area",
        "variable_name": "n",
        "p5js_ctrler_type": "slider",
        "parameterHint": "defaultVal = 0.5, minVal = 0 , maxVal = 1 , precision = 0.01",
        "p5js_Ctrler_parameter": "4, 1, 48 , 1",
    };

    const pcDisplayDict = {
        'cn': {
            "rect_fill": "填充颜色",
            "rect_fill_boo": '是否填充',
            "rect_stroke": "描边颜色",
            "rect_stroke_weight": '描边粗细',
            "rect_stroke_boo": '是否描边',
            "func_curve_stroke": "曲线颜色",
            "func_curve_stroke_weight": '曲线粗细',
            "func_curve_stroke_boo": '是否曲线',
            "draw_on_top": "置顶图层",
            "blendmode": "混合模式",
            "fx": "函数：\nx为变量，\n取值范围为0到1",
            "precision": '精度',
            "draw_zero_horizon": '绘制y=0',
            "p5js_ctrler_type": "控制器类型",
            "parameterHint": "参数提示",
            "p5js_Ctrler_parameter": "控制器参数",
        }, 'en': {}
    }[language];
    pc = (typeof pc != 'undefined' && pc instanceof PC) ? pc : new PC({
        autoHideBoo: false,
        ctrler_width: 800,
        updateWithCookieBoo: false,
        updateWithUrlBoo: true,
        name_space: 'p5js_ctrler_example_fx',
        latency_for_loading_local_data: 10
    });
    let group1 = pc.group('styleing');

    group1.color('rect_fill', '#cde', redraw);
    group1.checkbox('rect_fill_boo', true, ['fill', 'noFill'], redraw);
    group1.color('rect_stroke', '#222', redraw);
    group1.slider('rect_stroke_weight', 2, 1, 100, 0.2, redraw);
    group1.checkbox('rect_stroke_boo', true, ['stroke', 'noStroke'], redraw);
    group1.hr();

    group1.color('func_curve_stroke', '#234', redraw);
    group1.slider('func_curve_stroke_weight', 2, 1, 100, 0.2, redraw);
    group1.checkbox('func_curve_stroke_boo', true, ['stroke', 'noStroke'], redraw);

    group1.hr();

    group1.radio('draw_on_top', ['rect', 'func'], redraw);
    pc.update('draw_on_top', 'func');
    group1.select('blendmode', ['source-over', 'lighter', 'darken', 'lighten', 'difference', 'exclusion', 'multiply', 'screen', 'copy', 'overlay', 'hard-light', 'soft-light', 'color-dodge', 'color-burn'], redraw);

    pc.hr();


    pc.textarea('fx',
`y=Math.pow(x**2,x);
z=Math.sin(Math.pow(x,n)*Math.PI*n*2)
a=Math.pow(x,n)*Math.sin(x*Math.PI*n*2)`,
        redraw);
    pc.slider('precision', 10, 4, 2048, 1, redraw);
    pc.checkbox('draw_zero_horizon', true, ['', ''], redraw);

    let setInputToNumber = (e) => {
        redraw();

        console.log(e);
        let v = e.data,
            inputter = e.target,
            ctrler = e.path.parentElement;
        if (isFinite(Number(inputter.value))) {
            return inputter.value;
        } else {
            errorTxt = `\n${ctrler.querySelector('.ctrlerName').innerText} : require a number value , typed in '${inputter.value}'`
            console.error(errorTxt);
            push();
            textAlign(CENTER, CENTER);
            textSize(2 * textSize());
            text(errorTxt, width / 2, height / 2);
            pop();
        }
    }
    pc.input('upper_limit', 0, setInputToNumber);
    pc.input('lower_limit', -5, setInputToNumber);
    pc.radio('x_scale', ['x_precision', 'y_value'], redraw);
    pc.radio('coordinate', ['canvas', 'fx_area'], redraw);
    pc.update('x_scale', 'x_precision');

    pc.hr();
    let group2 = pc.group('new_variable_ctrler')
    group2.input('variable_name');
    group2.radio('p5js_ctrler_type', ['slider', 'checkbox', 'radio'], (e) => {
        console.log(e);
        let v = e.target.value;
        pc.update('parameterHint', hintText[v]);
        pc.update('p5js_Ctrler_parameter', paraText[v]);
    });


    group2.textarea('parameterHint');
    pc.disable('parameterHint');

    group2.textarea('p5js_Ctrler_parameter');
    group2.button('new_p5jsCtrler', 'make it!', (ctrler_type = p5js_ctrler_type, ctrler_name = variable_name, ctrler_para = p5js_Ctrler_parameter) => {
        try {
            let newFuncText = `pc.${ctrler_type}('${ctrler_name}', ${ctrler_para})`;
            console.log(newFuncText);
            (new Function(newFuncText))();
            pc.ctrlers[ctrler_name].input(() => {
                redraw();
            });

            const url = new URL(window.location.href),
                name = 'new_ctrler';

            if (url && url.searchParams.has(name)) {
                url.searchParams.set(name, url.searchParams.get(name) + ' ; ' + newFuncText);
            } else {
                url.searchParams.append(name, newFuncText);
            }
            history.pushState('', '', url.toString());

        } catch (err) {
            pc.update('parameterHint', err);
            console.log(err);
        }
    });
    pc.hr();
    pc.slider('n', 4, 1, 48, 1, redraw);

    pc.update('parameterHint', hintText[pc.getCtrlerVal('p5js_ctrler_type')]);
    pc.update('p5js_ctrler_type', 'slider');

    pc.foldGroup();

    pc.displayName(pcDisplayDict);

    pc.load(preset);

    const url = new URL(window.location.href);
    const name = 'new_ctrler';
    if (url && url.searchParams.has(name)) {
        newFuncTexts = url.searchParams.get(name);
        try {
            newFuncTexts.split(';').map(newFuncText => {
                let ctrler = (new Function('return ' + newFuncText))();
                ctrler.input(() => {
                    redraw();
                });
            });
        } catch (err) {
            throw ('cant read custom ctrler settings from url')
        }
    }

};

window.__setup = () => {

    createCanvas(windowWidth, windowHeight);

    pc.stick('bottom');

    setTimeout(() => {
        document.querySelector('.markdown-body[id*=readme]').classList.add('hide');
    }, 2000);
};
window.__draw = () => {

    background(220);

    //  runFxReturnMultResult(0);


    let resultArr = [];
    for (let i = 0; i <= precision; i++) {
        // resultArr.push(runFx(i / precision));
        resultArr.push(runFxReturnMultResult(i / precision));
    };

    // let _max = Math.max(...yArr);
    // yArr.map((_y, _x, arr) => {
    //   let _X = map(_x, 0, arr.length, 0, width);
    //   let _Y = map(_y, 0, _max, 0, height);
    //   drawRect(_X, _Y, precision);
    // });

    // fill(rect_fill); noStroke();
    // drawRect(resultArr);
    // noFill(); stroke(func_curve_stroke);
    // drawLine(resultArr);
    // drawZeroHorizon(resultArr);

    let resultObj = {};
    resultArr.map(r => {
        Object.keys(r).map(k => {
            if (!resultObj.hasOwnProperty(k)) {
                resultObj[k] = [];
            }
            resultObj[k].push(r[k]);
        })
    });

    {
        push();
        blendMode(blendmode);
        let _all = [].concat(...Object.values(resultObj));

        let min = Math.min(..._all, upper_limit, lower_limit);
        let max = Math.max(..._all, upper_limit, lower_limit);

        let rObject = {};

        Object.keys(resultObj).filter(key => {
            return [...new Set(resultObj[key])].length > 1
        }).map(key => {
            rObject[key] = resultObj[key];
        })

        let drawCurve = x_scale == 'x_precision' ? drawLine_x_precision : drawLine_y_value;
        let drawArea = x_scale == 'x_precision' ? drawRect_x_precision : drawRect_y_value;
        let drawFnAr = [(len, idx, arr) => {
            if (rect_fill_boo) {
                fill(rect_fill);
            }
            if (rect_stroke_boo) {
                stroke(rect_stroke);
            }
            if (rect_stroke_boo) {
                strokeWeight(rect_stroke_weight);
            }
            drawArea(len, idx, arr, max, min);
        }, (len, idx, arr) => {
            noFill();
            if (func_curve_stroke_boo) {
                stroke(func_curve_stroke);
            }
            if (func_curve_stroke_boo) {
                strokeWeight(func_curve_stroke_weight);
            }
            drawCurve(len, idx, arr, max, min);
            // if (draw_zero_horizon) { drawZeroHorizon(arr, max, min); }
        }];
        // Object.keys(resultObj).map((fx,fxIdx,fxResultArr) => {
        //     let arr = resultObj[fx];
        //     let fxsLen=fxResultArr.length;
        //     drawFnAr.map((a, drawIdx, drawAr) => {
        //         push();
        //         noStroke(); noFill();
        //         switch (draw_on_top) {
        //             case 'func': a(fxsLen,fxIdx,arr); break;
        //             case 'rect': drawAr[drawAr.length - drawIdx - 1](fxsLen,fxIdx,arr); break;
        //         }
        //         pop();
        //     }
        //     );
        // });


        drawFnAr.map((a, drawIdx, drawAr) => {

            push();
            noStroke();
            noFill();
            switch (draw_on_top) {
                case 'func':
                    Object.keys(rObject).map((fx, fxIdx, fxResultArr) => {
                        let arr = rObject[fx];
                        let fxsLen = fxResultArr.length;
                        a(fxsLen, fxIdx, arr);
                    });
                    break;
                case 'rect':
                    Object.keys(rObject).map((fx, fxIdx, fxResultArr) => {
                        let arr = rObject[fx];
                        let fxsLen = fxResultArr.length;
                        drawAr[drawAr.length - drawIdx - 1](fxsLen, fxIdx, arr);
                    });
                    break;
            }
            pop();
        })

        pop();
    }
    noLoop();
    // console.log(txt);


};


function drawRect_x_precision(fnsLen, fnsIdx, fnResultArr, max, min) {
    fnResultArr = constsArrReduce(fnResultArr);
    let _max = Math.max(...fnResultArr);
    let _min = Math.min(...fnResultArr);

    let fnLenSum = eval(fnResultArr.map(i => Math.abs(i)).join('+'));
    let x = 0;

    let y1 = 0,
        y2 = height;//canvas
    if (coordinate == 'fx_area') {
        y1 = map(fnsIdx, 0, fnsLen, 0, height);
        y2 = map(fnsIdx + 1, 0, fnsLen, 0, height);
    }

    fnResultArr.map((_y, _x, arr) => {
        let _X = map(_x, 0, arr.length, 0, width);
        if (_x == 0) {
            x = 0;
        } else {
            x += map(Math.abs(arr[_x - 1]) / fnLenSum, 0, 1, 0, width);
        }
        let _Y = map(_y, min, max, y2, y1);
        let y = map(fnsIdx, 0, fnsLen, 0, height);
        // let w=map(Math.abs(_y)/fnLenSum,0,1,0,width);
        //            rect(_X, height - _Y, width / (arr.length), height + _Y);
        push();
        drawingContext.globalAlpha = map(_y, _min, _max, 0, 1);
        let w = width / arr.length;

        if (coordinate == 'fx_area') {
            rect(_X, y, width / fnResultArr.length, height / fnsLen);
        } else {
            rect(_X, _Y, w, height);
        }

        pop();
    });

}

function drawRect_y_value(fnsLen, fnsIdx, fnResultArr, max, min) {
    fnResultArr = constsArrReduce(fnResultArr);
    let _max = Math.max(...fnResultArr);
    let _min = Math.min(...fnResultArr);

    let fnLenSum = eval(fnResultArr.map(i => Math.abs(i)).join('+'));
    let x = 0;
    let y1 = 0,
        y2 = height;
    if (coordinate == 'fx_area') {
        y1 = map(fnsIdx, 0, fnsLen, 0, height);
        y2 = map(fnsIdx + 1, 0, fnsLen, 0, height);
    }

    fnResultArr.map((_y, _x, arr) => {
        let _X = map(_x, 0, arr.length, 0, width);
        if (_x == 0) {
            x = 0;
        } else {
            x += map(Math.abs(arr[_x - 1]) / fnLenSum, 0, 1, 0, width);
        }
        let _Y = map(_y, min, max, y1, y2);
        let y = map(fnsIdx, 0, fnsLen, 0, height);
        let w = map(Math.abs(_y) / fnLenSum, 0, 1, 0, width);
        //            rect(_X, height - _Y, width / (arr.length), height + _Y);
        push();
        drawingContext.globalAlpha = map(_y, _min, _max, 0, 1);

        if (coordinate == 'fx_area') {
            rect(x, y, w, height / fnsLen);
        } else { //canvas
            console.log(y, _y, _y)
            rect(x, height - _Y, w, _Y);
        }
        pop();
    });

}

function drawLine_x_precision(fnsLen, fnsIdx, fnResultArr, max, min) {
    fnResultArr = constsArrReduce(fnResultArr);
    let _max = max ? max : Math.max(...fnResultArr);
    let _min = min ? min : Math.min(...fnResultArr);
    let y1 = 0,
        y2 = height;//canvas
    if (coordinate == 'fx_area') {
        y1 = map(fnsIdx, 0, fnsLen, 0, height);
        y2 = map(fnsIdx + 1, 0, fnsLen, 0, height);
    }

    beginShape();
    fnResultArr.map((_y, _x, arr) => {
        let _X = map(_x, 0, arr.length, 0, width);
        let _Y = map(_y, _min, _max, y2, y1);
        vertex(_X + width / arr.length * 0.5, _Y);
    });
    endShape();

    if (draw_zero_horizon == true) {
        let y0 = map(0, _min, _max, y2, y1)
        line(0, y0, width, y0);
    }
}

function drawLine_y_value(fnsLen, fnsIdx, fnResultArr, max, min) {
    fnResultArr = constsArrReduce(fnResultArr);
    let _max = Math.max(...fnResultArr);
    let _min = Math.min(...fnResultArr);

    let fnLenSum = eval(fnResultArr.map(i => Math.abs(i)).join('+'));

    let x = 0;
    beginShape();
    let y1 = 0,
        y2 = height;//canvas
    if (coordinate == 'fx_area') {
        y1 = map(fnsIdx, 0, fnsLen, 0, height);
        y2 = map(fnsIdx + 1, 0, fnsLen, 0, height);
    }

    fnResultArr.map((_y, _x, arr) => {
        let _X = map(_x, 0, arr.length, 0, width);
        let _Y = map(_y, min, max, y2, y1);
        if (_x == 0) {
            x = 0;
        } else {
            x += map(Math.abs(arr[_x - 1]) / fnLenSum, 0, 1, 0, width);
        }
        vertex(x, _Y);
    });
    endShape();

    if (draw_zero_horizon == true) {
        let y0 = map(0, min, max, y2, y1)
        line(0, y0, width, y0);
    }
}

function drawZeroHorizon(resultArr, max, min) {
    let _max = max ? max : Math.max(...resultArr);
    let _min = min ? min : Math.min(...resultArr);
    let zeroY = map(0, _min, _max, height, 0);
    rect(0, zeroY, width, 0);
}



function runFx(x) {
    let fxTxt = 'let y=x;' + fx + ';return y;';
    if (typeof pfx == "undefined" || pfx != fx) {
        console.log(fxTxt);
    };
    let f = new Function('x', fxTxt);
    pfx = fx;
    return f(x);
}

function runFxReturnMultResult(x) {
    let varsArr = fx.match(/\S{1,}\s*(?==)/g);
    varsArr = [...new Set(varsArr)];

    fxTxt = 'let y=x;' + fx + ';return {' + varsArr.map(i => `"${i}":${i}`).join(',') + '}';

    if (typeof pfx == "undefined" || pfx != fx) {
        console.log(fxTxt);
    };
    let f = new Function('x', fxTxt);
    pfx = fx;
    return f(x);
}

function constsArrReduce(a) {
    a = [...new Set(a)];
    a = a.length == 1 ? [a[0], a[0]] : a;
    return a;
}
