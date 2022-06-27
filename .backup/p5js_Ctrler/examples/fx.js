// var Examples = Examples || {};
// var __preload, __setup, __draw, pc;


// export { __preload, __setup, __draw, Examples };

import { language, _pc, _preload, _setup, _windowResized } from './Example.js';

var fxTxt, pfxTxt;

window.preload = () => {
    _preload();
    __preload();
}
window.setup = () => {
    _setup();
    __setup();
}

window.draw = () => {
    __draw();
}
window.windowResized = () => {
    _windowResized();
}

let pc;

window.__preload = function () {
    document.title = 'f(x)[0,1] -- fx_name = Math.sin(x*x*x) -- p5js_ctrler example by leizingyiu';

    /** p5js_ctrler settings: */
    let hintText = {
        'slider': 'defaultVal = 0.5, minVal = 0 , maxVal = 1 , precision = 0.01',
        'checkbox': "defaultVal = false, labelText = ['yes', 'no']",
        'radio': 'options = []'
    };
    let paraText = {
        'slider': '0.5 , 0.0001 , 1 , 0.001',
        'checkbox': "true,['yes', 'no']",
        'radio': '[0,1,2]'
    }

    pc = (typeof pc != 'undefined' && pc instanceof PC) ? pc : new PC({
        autoHide: false,
        ctrler_width: 400,
        updateWithCookieBoo: false,
        updateWithUrlBoo: true,
        name_space: 'p5js_ctrler_example_fx',
        latency_for_loading_local_data: 10
    });
    pc.color('rect_fill', '#cde', redraw);
    pc.checkbox('rect_fill_boo', true, ['fill', 'noFill'], redraw);
    pc.color('rect_stroke', '#222', redraw);
    pc.slider('rect_stroke_weight', 2, 1, 100, 0.2, redraw);
    pc.checkbox('rect_stroke_boo', true, ['stroke', 'noStroke'], redraw);
    pc.hr();

    pc.color('func_curve_stroke', '#234', redraw);
    pc.slider('func_curve_stroke_weight', 2, 1, 100, 0.2, redraw);
    pc.checkbox('func_curve_stroke_boo', true, ['stroke', 'noStroke'], redraw);
    pc.hr();

    pc.radio('draw_on_top', ['rect', 'func'], redraw);
    pc.update('draw_on_top', 'func');
    pc.select('blendmode', ['source-over', 'lighter', 'darken', 'lighten', 'difference', 'exclusion', 'multiply', 'screen', 'copy', 'overlay', 'hard-light', 'soft-light', 'color-dodge', 'color-burn'], redraw);
    pc.hr();

    pc.textarea('fx',
        `y=Math.pow((x+1)*x,x*2);
z=Math.sin(x*x*x*Math.PI*4);
u=-2;`,
        redraw);
    pc.slider('precision', 10, 4, 512, 1, redraw);
    pc.checkbox('draw_zero_horizon', true, ['', ''], redraw);

    pc.hr();
    pc.input('variable_name');
    pc.radio('p5js_ctrler_type', ['slider', 'checkbox', 'radio'], (e) => {
        let v = e.target.value;
        pc.update('parameterHint', hintText[v]);
        pc.update('p5js_Ctrler_parameter', paraText[v]);
    });


    pc.textarea('parameterHint');
    pc.disable('parameterHint');

    pc.textarea('p5js_Ctrler_parameter');
    pc.button('new_p5jsCtrler', 'make it!', (ctrler_type = p5js_ctrler_type, ctrler_name = variable_name, ctrler_para = p5js_Ctrler_parameter) => {
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

    pc.update('parameterHint', hintText[pc.getCtrlerVal('p5js_ctrler_type')]);
    pc.update('p5js_ctrler_type', 'slider');

    pc.update('blendmode', 'multiply');

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
    pc.stick('bottom');

};

window.__setup = function () {

    createCanvas(windowWidth, windowHeight);


    setTimeout(() => {
        document.querySelector('.markdown-body[id*=readme]').classList.add('hide');
    }, 2000);
};
window.__draw = function () {

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
        let all = [].concat(...Object.values(resultObj));
        let min = Math.min(...all);
        let max = Math.max(...all);

        let drawFnAr = [(arr) => {
            if (rect_fill_boo) {
                fill(rect_fill);
            }
            if (rect_stroke_boo) {
                stroke(rect_stroke);
            }
            if (rect_stroke_boo) {
                strokeWeight(rect_stroke_weight);
            }
            drawRect(arr, max, min);
        }, (arr) => {
            noFill();
            if (func_curve_stroke_boo) {
                stroke(func_curve_stroke);
            }
            if (func_curve_stroke_boo) {
                strokeWeight(func_curve_stroke_weight);
            }
            drawLine(arr, max, min);
            if (draw_zero_horizon) {
                drawZeroHorizon(arr, max, min);
            }
        }];
        Object.keys(resultObj).map(k => {
            let arr = resultObj[k];
            drawFnAr.map((a, idx, ar) => {
                push();
                noStroke();
                noFill();
                switch (draw_on_top) {
                    case 'func':
                        a(arr);
                        break;
                    case 'rect':
                        ar[ar.length - idx - 1](arr);
                        break;
                }
                pop();
            })
        });
        pop();
    }
    noLoop();
    // console.log(txt);


};


function drawRect(resultArr, max, min) {
    let _max = max ? max : Math.max(...resultArr);
    let _min = min ? min : Math.min(...resultArr);

    resultArr.map((_y, _x, arr) => {
        let _X = map(_x, 0, arr.length, 0, width);
        let _Y = map(_y, _min, _max, 0, height);
        rect(_X, height - _Y, width / (arr.length), height + _Y);
    });

}

function drawLine(resultArr, max, min) {
    let _max = max ? max : Math.max(...resultArr);
    let _min = min ? min : Math.min(...resultArr);

    beginShape();
    resultArr.map((_y, _x, arr) => {
        let _X = map(_x, 0, arr.length, 0, width);
        let _Y = map(_y, _min, _max, 0, height);
        vertex(_X + width / arr.length * 0.5, height - _Y);
    });
    endShape();
}

function drawZeroHorizon(resultArr, max, min) {
    let _max = max ? max : Math.max(...resultArr);
    let _min = min ? min : Math.min(...resultArr);
    let zeroY = map(0, _min, _max, height, 0);
    rect(0, zeroY, width, 0);
}



function runFx(x) {
    let fxTxt = 'let y=x;' + fxTxt + ';return y;';
    if (typeof pfxTxt == "undefined" || pfxTxt != fxTxt) {
        console.log(fxTxt);
    };
    let f = new Function('x', fxTxt);
    pfxTxt = fxTxt;
    return f(x);
}

function runFxReturnMultResult(x) {
    let varsArr = fx.match(/\S{1,}\s*(?==)/g);
    varsArr = [...new Set(varsArr)];

    fxTxt = 'let y=x;' + fx + ';return {' + varsArr.map(i => `"${i}":${i}`).join(',') + '}';

    if (typeof pfxTxt == "undefined" || pfxTxt != fxTxt) {
        console.log(fxTxt);
    };
    let f = new Function('x', fxTxt);
    pfxTxt = fxTxt;
    return f(x);
}

