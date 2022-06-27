

// var language = ["zh-CN", "zh-HK", "zh-MO", "zh-TW", "zh-SG"].indexOf(navigator.language) == -1 ? 'en' : 'cn';

var pc, fxTxt, pfx, cnv, pg, pgSvg, drawTarget, rect_fillC, rect_strokeC, func_curve_strokeC;
window.preload = () => {
  __preload();
};
window.setup = () => {
  __setup();
};

window.draw = () => {
  background(bgColor);
  __draw();
  image(drawTarget, 0, 0);
  noLoop();
};
window.windowResized = () => {
  resizeCanvas(windowWidth, windowHeight);
  pg = createGraphics(width, height);
  redraw();
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
    "precision": (isMobile() ? 48 : 256),
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
      'save_png': '保存png',
      'save_svg': '保存svg',
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
      'upper_limit': '图表y值上限',
      'lower_limit': '图表y值下限',
      'x_scale': 'x轴单位宽度：x精度 / y值',
      'coordinate': '图表分布',
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
  pc.a('anotherVersion', './index.html', 'Browse older versions');
  pc.button('save_png', 'save png', () => {
    save(pg, 'fxVisualizer.png');
  });
  pc.button('save_svg', 'save svg', () => {
    pgSvg = createGraphics(width, height, SVG);
    pgSvg.strokeJoin(ROUND);

    // pgSvg.push();
    // pgSvg.background(bgColor);
    // pgSvg.fill(bgColor);
    // pgSvg.textAlign(CENTER, CENTER);
    // pgSvg.text('fxVisualizer by leizingyiu', width / 2, height / 2, width, height);
    // pgSvg.pop();
    __draw(pgSvg);
    save(pgSvg, 'fxVisualizer.svg');
    redraw();
  });
  pc.hr();
  let group1 = pc.group('styleing').displayName({ cn: '样式设置', en: 'style settings' }[language]);

  group1.color('rect_fill', '#cde', redraw);
  group1.checkbox('rect_fill_boo', true, ['fill', 'noFill'], redraw);
  group1.color('rect_stroke', '#222', redraw);
  group1.slider('rect_stroke_weight', 2, 1, 100, 0.2, redraw);
  group1.checkbox('rect_stroke_boo', true, ['stroke', 'noStroke'], redraw);
  group1.hr('.');

  group1.color('func_curve_stroke', '#234', redraw);
  group1.slider('func_curve_stroke_weight', 2, 1, 100, 0.2, redraw);
  group1.checkbox('func_curve_stroke_boo', true, ['stroke', 'noStroke'], redraw);

  group1.hr('.');
  group1.color('bgColor', '#ddeeff', redraw);
  group1.hr('.');

  group1.radio('draw_on_top', ['rect', 'func'], redraw);
  pc.update('draw_on_top', 'func');
  group1.select('blendmode', ['source-over', 'lighter', 'darken', 'lighten', 'difference', 'exclusion', 'multiply', 'screen', 'copy', 'overlay', 'hard-light', 'soft-light', 'color-dodge', 'color-burn'], redraw);

  pc.hr();

  let fxSettings = pc.group('fx_settings').displayName({ cn: '函数设置', en: 'fx settings' }[language]);
  fxSettings.textarea('fx',
    '',
    redraw);
  fxSettings.slider('precision', 10, 4, 2048, 1, redraw);
  fxSettings.checkbox('draw_zero_horizon', true, ['', ''], redraw);

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
      drawTarget.push();
      textAlign(CENTER, CENTER);
      textSize(2 * textSize());
      text(errorTxt, width / 2, height / 2);
      drawTarget.pop();
    }
  }
  fxSettings.input('upper_limit', 0, setInputToNumber);
  fxSettings.input('lower_limit', -5, setInputToNumber);
  fxSettings.radio('x_scale', ['x_precision', 'y_value'], redraw);
  fxSettings.radio('coordinate', ['canvas', 'fx_area'], redraw);
  pc.update('x_scale', 'x_precision');

  pc.hr();
  let group2 = pc.group('new_variable_ctrler').displayName({ cn: '新建函数用控制器', en: 'new variable ctrler' }[language]);
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

  pc.update('parameterHint', hintText[pc.getCtrlerVal('p5js_ctrler_type')]);
  pc.update('p5js_ctrler_type', 'slider');

  pc.foldGroup();

  pc.displayName(pcDisplayDict);

  pc.load(preset);

  const url = new URL(window.location.href);
  const new_ctrler_search_name = 'new_ctrler';
  if (url && url.searchParams.has(new_ctrler_search_name)) {
    newFuncTexts = url.searchParams.get(new_ctrler_search_name);
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
  const load_demo_search_name = 'load_demo';
  if (url && url.searchParams.has(load_demo_search_name)) {
    pc.update('fx', `y=Math.pow(x**2,x);
    z=Math.sin(Math.pow(x,n)*Math.PI*n*2)
    a=Math.pow(x,n)*Math.sin(x*Math.PI*n*2)`);
    pc.slider('n', 4, 1, 48, 1, redraw);
  } else {
    pc.update('fx', `n=2;
    y=Math.pow(x**2,x);
    z=Math.sin(Math.pow(x,n)*Math.PI*n*2)
    a=Math.pow(x,n)*Math.sin(x*Math.PI*n*2)`);
  }

};

window.__setup = () => {

  cnv = createCanvas(windowWidth, windowHeight);
  pg = createGraphics(width, height);

  pc.stick('bottom');

  setTimeout(() => {
    try { document.querySelector('.markdown-body[id*=readme]').classList.add('hide'); } catch (err) { console.log(err) }
  }, 2000);

  cnv.strokeJoin(ROUND);
  pg.strokeJoin(ROUND);
};

window.__draw = (target = pg) => {

  drawTarget = target;

  drawTarget.clear();

  //  runFxReturnMultResult(0);



  let resultArr = [];
  for (let i = 0; i <= precision; i++) {
    // resultArr.push(runFx(i / precision));
    let x = i / precision;
    let y = runFxReturnMultResult(x);
    resultArr.push(y);
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
    drawTarget.push();
    drawTarget.blendMode(blendmode);

    let rObject = {};

    Object.keys(resultObj).filter(key => {
      return [...new Set(resultObj[key])].length > 1
    }).map(key => {
      rObject[key] = resultObj[key];
    })

    let _all = [].concat(...Object.values(rObject));

    let min = Math.min(..._all, upper_limit, lower_limit);
    let max = Math.max(..._all, upper_limit, lower_limit);



    console.log(resultArr, resultObj, rObject);

    let drawCurve = x_scale == 'x_precision' ? drawLine_x_precision : drawLine_y_value;
    let drawArea = x_scale == 'x_precision' ? drawRect_x_precision : drawRect_y_value;
    drawArea = rect_fill_boo == false && rect_stroke_boo == false ? () => { } : drawArea;

    rect_fillC = color(rect_fill);
    rect_strokeC = color(rect_stroke);

    let drawFnAr = [(len, idx, arr) => {
      // if (rect_fill_boo) {
      //   drawTarget.fill(rect_fill);
      // }
      // if (rect_stroke_boo) {
      //   drawTarget.stroke(rect_stroke);
      // }
      if (rect_stroke_boo) {
        drawTarget.strokeWeight(rect_stroke_weight);
      }
      drawArea(len, idx, arr, max, min);
    }, (len, idx, arr) => {
      noFill();
      if (func_curve_stroke_boo) {
        drawTarget.stroke(func_curve_stroke);
      }
      if (func_curve_stroke_boo) {
        drawTarget.strokeWeight(func_curve_stroke_weight);
      }
      drawCurve(len, idx, arr, max, min);
      // if (draw_zero_horizon) { drawZeroHorizon(arr, max, min); }
    }];



    drawFnAr.map((a, drawIdx, drawAr) => {


      drawTarget.push();
      drawTarget.noStroke();
      drawTarget.noFill();
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
      drawTarget.pop();
    })

    drawTarget.pop();
  }


  typo();

};


function drawRect_x_precision(fnsLen, fnsIdx, fnResultArr, max, min) {
  if (typeof drawTarget == 'undefined') {
    drawTarget = window;
  }
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
    drawTarget.push();
    let aMax = drawTarget.colorMode()._colorMaxes.rgb[3];
    let p = 0.001;
    let fc = color(...rect_fillC.levels.map((i, idx) => idx == 3 ? Math.floor(map(_y, _min, _max, 0, aMax) / p) * p : i));
    let sc = color(...rect_strokeC.levels.map((i, idx) => idx == 3 ? Math.floor(map(_y, _min, _max, 0, aMax) / p) * p : i));

    drawTarget.noStroke();
    drawTarget.noFill();

    if (rect_fill_boo) {
      drawTarget.fill(fc);
    }
    if (rect_stroke_boo) {
      drawTarget.stroke(sc);
    }

    drawTarget.drawingContext.globalAlpha = map(_y, _min, _max, 0, 1);

    let w = width / arr.length;
    if (coordinate == 'fx_area') {
      drawTarget.rect(_X, y, width / fnResultArr.length, height / fnsLen);
    } else {
      drawTarget.rect(_X, _Y, w, height);
    }


    drawTarget.pop();
  });

}

function drawRect_y_value(fnsLen, fnsIdx, fnResultArr, max, min) {
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
    drawTarget.push();
    let aMax = drawTarget.colorMode()._colorMaxes.rgb[3];
    let p = 0.001;
    let fc = color(...rect_fillC.levels.map((i, idx) => idx == 3 ? Math.floor(map(_y, _min, _max, 0, aMax) / p) * p : i));
    let sc = color(...rect_strokeC.levels.map((i, idx) => idx == 3 ? Math.floor(map(_y, _min, _max, 0, aMax) / p) * p : i));
    drawTarget.noStroke();
    drawTarget.noFill();
    if (rect_fill_boo) {
      drawTarget.fill(fc);
    }
    if (rect_stroke_boo) {
      drawTarget.stroke(sc);
    }

    drawTarget.drawingContext.globalAlpha = map(_y, _min, _max, 0, 1);

    if (coordinate == 'fx_area') {
      drawTarget.rect(x, y, w, height / fnsLen);
    } else { //canvas
      drawTarget.rect(x, height - _Y, w, _Y);
    }
    drawTarget.pop();
  });

}

function drawLine_x_precision(fnsLen, fnsIdx, fnResultArr, max, min) {
  let _max = max ? max : Math.max(...fnResultArr);
  let _min = min ? min : Math.min(...fnResultArr);
  let y1 = 0,
    y2 = height;//canvas
  if (coordinate == 'fx_area') {
    y1 = map(fnsIdx, 0, fnsLen, 0, height);
    y2 = map(fnsIdx + 1, 0, fnsLen, 0, height);
  }

  drawTarget.beginShape();
  // console.log('\nstart_____')
  fnResultArr.map((_y, _x, arr) => {
    let _X = map(_x, 0, arr.length, 0, width);
    let _Y = map(_y, _min, _max, y2, y1);

    // console.log(_y, _min, _max, y2, y1, _Y);

    drawTarget.vertex(_X + width / arr.length * 0.5, _Y);
  });
  // console.log('end_____\n')
  drawTarget.endShape();

  if (draw_zero_horizon == true) {
    let y0 = map(0, _min, _max, y2, y1)
    drawTarget.line(0, y0, width, y0);
  }
}

function drawLine_y_value(fnsLen, fnsIdx, fnResultArr, max, min) {
  let _max = Math.max(...fnResultArr);
  let _min = Math.min(...fnResultArr);

  let fnLenSum = eval(fnResultArr.map(i => Math.abs(i)).join('+'));

  let x = 0;
  drawTarget.beginShape();
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
    drawTarget.vertex(x, _Y);
  });
  drawTarget.endShape();

  if (draw_zero_horizon == true) {
    let y0 = map(0, min, max, y2, y1)
    drawTarget.line(0, y0, width, y0);
  }
}

function drawZeroHorizon(resultArr, max, min) {
  let _max = max ? max : Math.max(...resultArr);
  let _min = min ? min : Math.min(...resultArr);
  let zeroY = map(0, _min, _max, height, 0);
  drawTarget.rect(0, zeroY, width, 0);
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
  let varsArr = fx.split(/[\n;]/g).map(l => l.match(/[a-zA-Z_#$][a-zA-Z_#$0-9]*\s*(?==[^=])/g));
  varsArr = [...new Set(varsArr.flat(Infinity).filter(Boolean))];

  fxTxt = 'let y=x;' + fx + ';return {' + varsArr.map(i => `"${i}":${i}`).join(',') + '}';

  if (typeof pfx == "undefined" || pfx != fx) {
    console.log(fxTxt);
  };
  let f = new Function('x', fxTxt);
  pfx = fx;
  return f(x);
}
function constsArrReduce(a) {
  return a;
  a = [...new Set(a)];
  a = a.length == 1 ? [a[0], a[0]] : a;
  return a;

  //上面的办法会导致非连续重复数据丢失，下面方法更好，但数据类型会发生变化
  arr = [0, 0, 1, 2, 3, 4, 4, 5, 6, 4, 2, 1, 0];
  obj = {};
  arr.map((i, idx, arr) => {
    if (idx > 0) { i = i == arr[idx - 1] ? false : i; }
    if (i || typeof i == 'number') {
      obj[idx] = i;
    }
  });
  obj;
}



let titleText = 'fxVisualizer', typoShadowAlpha = 0.12;
let discriptText = 'A visualization \nshowing the variation \nof a function between 0 and 1\n\nAt the same time\n this sketch is a case of p5js_ctrler\nyou can check the related introduction\n in p5js_ctrler\n\ndesign and coding by leizingyiu';

function typo(target = pg) {
  drawTarget = target;

  if (typeof titleFont == 'undefined' || typeof fontOfText == 'undefined') {
    titleFont = loadFont('../font/Xhers Regular.otf', redraw);
    fontOfText = loadFont('../font/NimbusSanL-Reg.otf', redraw);
    redraw();
    return;
  }
  if (typeof toTitleUpperCase == 'undefined') { toTitleUpperCase = function () { return arguments } }
  if (typeof globalMargin != 'number') { globalMargin = 48; }

  const padding = 10, frameColor = 'rgba(255,255,255,0.92)', lineHeight = 1.5;
  const titleSizeK = 4, textSizeK = 0.8, demoSizeK = 0.5;

  let ctx = drawTarget.drawingContext;
  ctx.shadowBlur = textWidth(' ') * 3;
  ctx.shadowColor = `rgba(0,0,0,${typoShadowAlpha})`;
  // ctx.globalCompositeOperation = '';
  drawTarget.blendMode(HARD_LIGHT);


  discriptText = toTitleUpperCase(discriptText);

  drawTarget.blendMode('source-over');
  drawTarget.push();
  drawTarget.textSize(Math.min(width, height) / 20);

  drawTarget.fill(frameColor);
  drawTarget.noStroke();
  drawTarget.textSize(Math.min(width, height) / 48);

  // right top
  drawTarget.textAlign(RIGHT, TOP);
  drawTarget.textFont(titleFont);
  drawTarget.textSize(drawTarget.textSize() * titleSizeK);
  drawTarget.textLeading(drawTarget.textSize() * lineHeight);
  drawTarget.text(titleText, width - globalMargin - drawTarget.textWidth(titleText[0]) / 4, globalMargin + padding);
  drawTarget.textSize(drawTarget.textSize() / titleSizeK);


  //right mid demo text
  // let titleH = drawTarget.textAscent() + drawTarget.textSize() * titleSizeK;
  // drawTarget.textSize(drawTarget.textSize() * demoSizeK);
  // drawTarget.textFont(fontOfText);
  // drawTarget.textLeading(drawTarget.textSize() * lineHeight);

  // let detailW = drawTarget.textWidth(demoText.split('\n').sort((a, b) => b.length - a.length)[0]),
  //   detailH = demoText.length * drawTarget.textLeading();
  // demoDetailX_1 = width - globalMargin,
  //   demoDetailX_0 = demoDetailX_1 - detailW,
  //   demoDetailY_0 = globalMargin + padding + titleH,
  //   demoDetailY_1 = demoDetailY_0 + detailH;


  // drawTarget.push();
  // drawTarget.fill(168);
  // drawTarget.text(demoText, width - globalMargin, globalMargin + padding + titleH);
  // drawTarget.pop();

  // drawTarget.textSize(drawTarget.textSize() / demoSizeK);


  //right bottom
  drawTarget.textFont(fontOfText);
  drawTarget.textSize(drawTarget.textSize() * textSizeK);
  drawTarget.textLeading(drawTarget.textSize() * lineHeight);
  drawTarget.textAlign(RIGHT, BOTTOM);
  drawTarget.text(discriptText, width - globalMargin, height - globalMargin - padding);
  drawTarget.textSize(drawTarget.textSize() / textSizeK);




  //right top
  drawTarget.textFont(titleFont);
  drawTarget.stroke(frameColor);
  drawTarget.textSize(drawTarget.textSize() * titleSizeK);
  drawTarget.strokeWeight(1);
  drawTarget.line(width - globalMargin, globalMargin,
    width - globalMargin - drawTarget.textWidth(titleText) - drawTarget.textWidth(titleText[0]) / 4, globalMargin);
  drawTarget.textSize(drawTarget.textSize() / titleSizeK);


  //right bottom
  drawTarget.textFont(fontOfText);
  drawTarget.textSize(drawTarget.textSize() * textSizeK);
  drawTarget.line(width - globalMargin, height - globalMargin,
    width - globalMargin - Math.max(...discriptText.split('\n').map(i => drawTarget.textWidth(i))), height - globalMargin);
  drawTarget.textSize(drawTarget.textSize() / textSizeK);

  drawTarget.pop();


}


// function _map(value, start1, stop1, start2 = 0, stop2 = 1, withinBounds = true) {
//   let v = value / (stop1 - start1);
//   let result = start2 + (stop2 - start2) * v;
//   let min2 = Math.min(start2, stop2),
//     max2 = Math.max(start2, stop2);
//   if (withinBounds) {
//     result = Math.min(Math.max(min2, result), max2);
//   }
//   return result;
// }