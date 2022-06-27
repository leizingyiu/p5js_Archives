function preload() {

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
    autoHideBoo: false,
    ctrler_width: 400,
    updateWithCookieBoo: false,
    updateWithUrlBoo: true,
  });
  pc.a('anotherVersion', './index_2.html?load_demo=true', 'Browse updated versions');
  pc.hr();
  pc.color('rect_fill', '#cde', redraw);
  pc.checkbox('rect_fill_boo', defaultVal = true, labelText = ['fill', 'noFill'], redraw);
  pc.color('rect_stroke', '#222', redraw);
  pc.slider('rect_stroke_weight', 2, 1, 100, 0.2, redraw);
  pc.checkbox('rect_stroke_boo', defaultVal = true, labelText = ['stroke', 'noStroke'], redraw);
  pc.hr();

  pc.color('func_curve_stroke', '#234', redraw);
  pc.slider('func_curve_stroke_weight', 2, 1, 100, 0.2, redraw);
  pc.checkbox('func_curve_stroke_boo', defaultVal = true, labelText = ['stroke', 'noStroke'], redraw);
  pc.hr();

  pc.radio('draw_on_top', ['rect', 'func'], redraw);
  pc.update('draw_on_top', 'func');
  pc.select('blendmode', ['source-over', 'lighter', 'darken', 'lighten', 'difference', 'exclusion', 'multiply', 'screen', 'copy', 'overlay', 'hard-light', 'soft-light', 'color-dodge', 'color-burn'], redraw);
  pc.hr();

  pc.textarea('fx',
    `y=x;
y=(x+1)*y;`,
    redraw);
  pc.slider('precision', 10, 4, 512, 1, redraw);
  pc.checkbox('draw_zero_horizon', defaultVal = true, labelText = ['', ''], redraw);

  pc.hr();
  pc.input('variable_name');
  pc.radio('p5js_ctrler_type', ['slider', 'checkbox', 'radio'], (e) => {
    let v = e.path[0].value;
    pc.update('parameterHint', hintText[v]);
    pc.update('p5js_Ctrler_parameter', paraText[v]);
  });


  pc.textarea('parameterHint');
  pc.disable('parameterHint');

  pc.textarea('p5js_Ctrler_parameter');
  pc.button('new_p5jsCtrler', 'make it!', () => {
    try {
      let varName = variable_name;

      let newFuncText = `pc.${p5js_ctrler_type}('${varName}', ${p5js_Ctrler_parameter})`;
      console.log(newFuncText);
      (new Function(newFuncText))();

      pc.ctrlers[varName].input(() => {
        redraw();
      });

      const url = new URL(window.location.href);
      const name = 'new_ctrler';

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


  const url = new URL(window.location.href);
  const name = 'new_ctrler';
  if (url && url.searchParams.has(name)) {
    newFuncTexts = url.searchParams.get(name);
    try {
      newFuncTexts.split(';').map(newFuncText => {
        (new Function(newFuncText))();
      });
    } catch (err) { throw ('cant read ctrler settings from url') }
  }

}
function setup() {

  createCanvas(windowWidth, windowHeight);

  pc.stick('bottom');
  setTimeout(() => {
    try { document.querySelector('.markdown-body[id*=readme]').classList.add('hide'); } catch (err) { console.log(err) }
  }, 2000);
}

function draw() {
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
      if (rect_fill_boo) { fill(rect_fill); }
      if (rect_stroke_boo) { stroke(rect_stroke); }
      if (rect_stroke_boo) { strokeWeight(rect_stroke_weight); }
      drawRect(arr, max, min);
    }, (arr) => {
      noFill();
      if (func_curve_stroke_boo) { stroke(func_curve_stroke); }
      if (func_curve_stroke_boo) { strokeWeight(func_curve_stroke_weight); }
      drawLine(arr, max, min);
      if (draw_zero_horizon) { drawZeroHorizon(arr, max, min); }
    }];
    Object.keys(resultObj).map(k => {
      let arr = resultObj[k];
      drawFnAr.map((a, idx, ar) => {
        push();
        noStroke(); noFill();
        switch (draw_on_top) {
          case 'func': a(arr); break;
          case 'rect': ar[ar.length - idx - 1](arr); break;
        }
        pop();
      }
      )
    });
    pop();
  }
  noLoop();
  // console.log(txt);
}
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

  let fxTxt = 'let y=x;' + fx + ';return {' + varsArr.map(i => `"${i}":${i}`).join(',') + '}';

  if (typeof pfx == "undefined" || pfx != fx) {
    console.log(fxTxt);
  };
  let f = new Function('x', fxTxt);
  pfx = fx;
  return f(x);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}