const language = ["zh-CN", "zh-HK", "zh-MO", "zh-TW", "zh-SG"].indexOf(navigator.language) == -1 ? 'en' : 'cn';


const pageTitle = 'make FFT look like AE -- by leizingyiu';

document.title = pageTitle;

musics = [{
  'song': './music/高级动物.mp3',
  'lrc': './music/高级动物.lrc'
},
{
  'song': './music/Breaking The Habit.m4a',
  'lrc': './music/Breaking The Habit.lrc'
},
{
  'song': './music/Faint.m4a',
  'lrc': './music/Faint.lrc'
},
{
  'song': './music/国际歌 (伴唱 现代人乐队 合唱 总政歌舞团) 马备 《红色摇滚》.m4a',
  'lrc': './music/国际歌 (伴唱 现代人乐队 合唱 总政歌舞团) 马备 《红色摇滚》.ini'
},
];
music = musics[Math.floor(musics.length * Math.random())];

// // music = { song: 'music/Damscray_DancingTiger.mp3' };
// music = {
//   song: './music/Faint.m4a'
// };

au = document.getElementById('player');
// au = document.createElement('audio');    au.controls = 'true';  au.preload = 'true';  au.loop = 'true'; document.body.appendChild(au);
au.src = `./${music.song}`;
au.style.cssText = `    
	--w:10vw;
	height: 2em;
    width:  min( max( 40vw , 30em ) , 80vw );
    position: absolute;
    left: 50%;
    bottom: min( 10vh , 10em ) ;
	transform:translate(-50%,0);`;

let cnv, fft, amplitude, level, spectrum, bands, pc, hzArr, startAudioBoo = false, defaultFont;

const pauseHint = {
  cn: `音乐已暂停，点击此处继续。
可以切换显示方式
(drawEnergy:与AE相似； drawsSpectrur: p5js FFT 直接输出的音频数据)，
查看与p5js原生FFT之间的区别`, en: `music is paused, click anywhere to continue
You can switch the drawFunc(display mode)
(drawEnergy: similar to AE; drawsSpectur: audio data directly output by p5js FFT),
to see the difference between p5js native FFT and AE `}[language];
let discriptText = {
  cn: `drawSpectrur是p5js FFT的数据，
不经过运算处理，
直接通过柱状、曲线等形式展示；

drawEnergy是将p5js FFT的数据，
按高中低音的音色区域取样，
并将响度数据进行指数函数运算，
得到与 After Effect 中的音频频谱相似的可视化图像。

在赫兹取样方式中，linear为线性，
在x轴的分布更接近FFT；
使用pow则通过运算，增加中频部分的分布，
更接近人耳能分辨的区域。`,
  en: `drawSpectur is the data of p5js FFT, 
which is directly displayed in the form of columns, curves, etc. without operation processing;

drawEnergy is to sample the data of p5js FFT according to the timbre area of high, middle and bass, 
and perform exponential function operation on the loudness data 
to obtain a visual image similar to the audio spectrum in After Effect.

In the Hertz sampling method ( hzDistributeFuncName ), 
'_linear' is linear, and the distribution on the x-axis is closer to the FFT; 
using '_pow', the distribution of the intermediate frequency part is increased through operations, 
which is closer to the area that the human ear can distinguish`}[language];

if (typeof toTitleUpperCase == 'undefined') { toTitleUpperCase = function (str) { return str } }
if (language == 'en') { discriptText = toTitleUpperCase(discriptText); }

const titleText = 'make FFT\nlook like AE';


const pcDisplayDict = {
  'cn': {
    'loadMusic': '加载媒体文件',
    "drawFunc": "显示方式",
    "fft_bins": 'fft取样数',
    "fill_color": "填充颜色",
    "stroke_color": "描边颜色",
    "stroke_weight": "描边宽度",
    "background_color": "背景颜色",
    "afterimage_alpha": '残影值',
    "hzNum": '赫兹取样数',
    "hzPowBase": '赫兹差异程度',
    "hzDistributePowBase": '赫兹取样分布',
    "hzDistributeFuncName": "赫兹取样方式"
  }, 'en': {}
}[language];
const pcPreset = [
  {
    "drawFunc": "drawEnergy",
    "fft_bins": 10,
    "fill_color": "#f4f5fb",
    "stroke_color": "#141d8f",
    "stroke_weight": 3,
    "background_color": "#10111e",
    "afterimage_alpha": 0.978,
    "hzNum": 64,
    "hzPowBase": 1.035,
    "hzDistributePowBase": 1,
    "hzDistributeFuncName": "_pow"
  },
  {
    "drawFunc": "drawEnergy",
    "fft_bins": 10,
    "fill_color": "#000000",
    "stroke_color": "#ffffff",
    "stroke_weight": 13,
    "background_color": "#000000",
    "afterimage_alpha": 0.786,
    "hzNum": 73,
    "hzPowBase": 1.018,
    "hzDistributePowBase": 0.439,
    "hzDistributeFuncName": "_pow"
  },
  {
    "drawFunc": "drawEnergy",
    "fft_bins": 10,
    "fill_color": "#07e3f2",
    "stroke_color": "#1c369b",
    "stroke_weight": 3,
    "background_color": "#f0fbff",
    "afterimage_alpha": 0.761,
    "hzNum": 268,
    "hzPowBase": 1.046,
    "hzDistributePowBase": 0.922,
    "hzDistributeFuncName": "_pow"
  }
].sort((a, b) => Math.random() - 0.5)[0];

const drawFuncs = {};

function distributeFunc() {
  switch (easeFuncName) {
    case 'linear':
      return _linear(...arguments);
      break;
    case 'powEase':
      return _pow(...arguments);
      break;
  }
}

function preload() {
  titleFont = loadFont('../font/Xhers Regular.otf');
  fontOfText = loadFont('../font/NimbusSanL-Reg.otf');
}
function setup() {
  cnv = createCanvas(windowWidth, windowHeight);

  cnv.mouseClicked(() => {
    auPlayingSwitch(au)
  }
  )

  let style = window.getComputedStyle(drawingContext.canvas);
  defaultFont = style.getPropertyValue('font-family');

  fft = new p5.FFT();
  amplitude = new p5.Amplitude();
  // amplitude.setInput(au);
  // fft.setInput(au);

  let context = getAudioContext();
  // wire all media elements up to our FFT
  for (let elem of selectAll('audio').concat(selectAll('video'))) {
    let mediaSource = context.createMediaElementSource(elem.elt);
    mediaSource.connect(p5.soundOut);
  }

  // p5js_ctrler settings 
  {
    pc = new PC({
      autoHideBoo: false,
      ctrlerWidth: 400,
      fontsize: 10,
      resize_rename: true
    });
    pc.fileinput("loadMusic", (e) => {
      console.log(e.data);
      au.src = e.data;
    });

    let drawFuncUpdate = (e) => {
      try {
        if (e.target.value == 'drawEnergy') {
          ['fft_bins'].map(n => pc.disable(n));
          ['hzNum', 'hzPowBase', 'hzDistributePowBase', 'hzDistributeFuncName'].map(n => pc.enable(n));
        } else {
          ['fft_bins'].map(n => pc.enable(n));
          ['hzNum', 'hzPowBase', 'hzDistributePowBase', 'hzDistributeFuncName'].map(n => pc.disable(n));
        }
      } catch (err) { console.log(err) }
    };

    pc.radio('drawFunc', ['drawEnergy', 'drawSpectrum'], drawFuncUpdate);


    pc.slider("fft_bins", 10, 4, 14, 1);

    pc.color("fill_color", "#369");
    pc.color("stroke_color", "#ccc");
    pc.slider('stroke_weight', 1, 0, 48, 1);
    pc.color("background_color", '#ddd');
    pc.slider('afterimage_alpha', 0.8, 0.001, 1, 0.001);

    let hzUpdate = () => { try { updateHzArr(); } catch (err) { console.log(err) } };
    pc.slider("hzNum", 64, 16, 1024, 1, hzUpdate);
    pc.slider("hzPowBase", 1.03, 1.001, 1.1, 0.001, hzUpdate);
    pc.slider("hzDistributePowBase", 0.5, 0.001, 1, 0.001, hzUpdate);
    pc.radio("hzDistributeFuncName", ['_linear', '_pow'], (e) => {
      let v = e.target.value;
      switch (v) {
        case 'linear':
          pc.disable('hzDistributePowBase');
          break;
        case 'pow':
          pc.enable('hzDistributePowBase');
          break;
      }

      hzUpdate();
    });

    pc.update('drawFunc', 'drawEnergy');
    pc.update("hzDistributeFuncName", 'pow');
    pc.title(pageTitle);
    pc.stick('top');

    pc.update('hzDistributeFuncName', '_pow');

    setTimeout(() => {
      pc.displayName(pcDisplayDict);
    }, 100);

    pc.load(pcPreset);
  }
}

function draw() {
  drawingContext.globalAlpha = 1 - afterimage_alpha;
  background(background_color);
  drawingContext.globalAlpha = 1;

  strokeWeight(stroke_weight);

  { //drawSound 
    push();
    // eval(drawFunc + '()');
    drawFuncs[drawFunc]();
    pop();
  }

  // console.log(frameRate());

  if (au.paused == true) {
    push();
    // blendMode(REMOVE);
    fill(color(background_color)._array.slice(0, 3).reduce((t, n) => t + n) > 1.5 ? 0 : 255, 48);
    textAlign(CENTER, CENTER);
    textSize(Math.min(width, height) / 48);
    textFont(defaultFont);
    textLeading(textSize() * 1.5);
    text(pauseHint, 0, 0, width, height);
    pop();
  }
  push();
  typo();
  pop();
}


function typo() {
  push();

  if (typeof globalMargin != 'number') { globalMargin = 48; }

  const padding = 20, spacing = 10,
    frameColor = color(background_color)._array.slice(0, 3).reduce((t, n) => t + n) > 1.5 ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)';
  const titleSizeK = 4, titleLeadingK = 1.25, textSizeK = 0.8;

  let rightBottomSpot = { x: width - globalMargin, y: height - globalMargin, w: 0, h: 0 };
  let rightTopSpot = { x: width - globalMargin, y: globalMargin, w: 0, h: 0 };

  // blendMode(EXCLUSION);

  textSize(Math.min(width, height) / 20);

  fill(frameColor);
  noStroke();
  textSize(Math.min(width, height) / 48);

  // right top
  textAlign(RIGHT, TOP);
  textFont(titleFont);
  push();
  textSize(textSize() * titleSizeK);
  textLeading(textSize() * titleLeadingK);
  text(titleText,
    rightTopSpot.x + rightTopSpot.w,
    rightTopSpot.y);
  pop();
  // textSize(textSize() / titleSizeK);


  //right bottom
  push();
  textFont(defaultFont);
  textSize(textSize() * textSizeK);
  textLeading(spacing + textSize());
  textAlign(RIGHT, BOTTOM);
  text(discriptText, 0, 0,
    rightBottomSpot.x + rightBottomSpot.w,
    rightBottomSpot.y + rightBottomSpot.h - padding);
  pop();
  // textSize(textSize() / textSizeK);


  strokeWeight(2);

  //right top
  push();
  textFont(titleFont);
  stroke(frameColor);
  textSize(textSize() * titleSizeK);
  textLeading(textSize() * titleLeadingK);
  line(rightTopSpot.x + rightTopSpot.w,
    rightTopSpot.y,
    rightTopSpot.x + rightTopSpot.w - textWidth(titleText.split('\n').sort((a, b) => a.length - b.length)[0]),
    rightTopSpot.y);
  line(rightTopSpot.x + rightTopSpot.w,
    rightTopSpot.y + textLeading(),
    rightTopSpot.x + rightTopSpot.w - textWidth(titleText.split('\n').sort((a, b) => b.length - a.length)[0]),
    rightTopSpot.y + textLeading());
  line(rightTopSpot.x + rightTopSpot.w,
    rightTopSpot.y + textLeading() * 2,
    rightTopSpot.x + rightTopSpot.w - textWidth(titleText.split('\n').sort((a, b) => b.length - a.length)[0]),
    rightTopSpot.y + textLeading() * 2);
  pop();
  // textSize(textSize() / titleSizeK);

  push();
  strokeWeight(1);
  //right bottom
  textFont(fontOfText);
  textSize(textSize() * textSizeK);
  line(rightBottomSpot.x + rightBottomSpot.w,
    rightBottomSpot.y + rightBottomSpot.h,
    rightBottomSpot.x + rightBottomSpot.w - Math.max(...discriptText.split('\n').map(i => textWidth(i))),
    rightBottomSpot.y + rightBottomSpot.h);
  pop();
  // textSize(textSize() / textSizeK);

  pop();
}

// function drawSound() {
//   rectMode(CORNER);



//   // [bands, spectrum] = [bands, spectrum].map(ar => ar.filter(a => a != 0));

//   noFill();

//   stroke(c1);
//   // for (var i = 0; i < bands.length; i = i + 1) {
//   //   var x = map(i, 0, bands.length - 1, 0, width);
//   //   var y = map(bands[i], 0, 255, height, 0);
//   //   var hauteur = height - y;
//   //   var largeur = width / bands.length;
//   //   rect(x, y, largeur, hauteur / 2);
//   // }



//   for (let i = 0; i < spectrum.length; i = i + 1) {
//     let x = map(i, 0, spectrum.length - 1, 0, width);
//     let y = map(spectrum[i], 0, 255, height, 0);
//     let hauteur = height - y;
//     let largeur = width / spectrum.length;
//     rect(x, y, largeur, hauteur);
//   }


//   fill(c2)
//   //let sampleCount = [1, 2, 4, 8, 10, 12, 15, 17, 20, 22, 25, 27, 30, 70, 100, 250, 500, 1000];
//   let sampleCount;
//   // let n = 16;

//   let N = [...new Array(n)]
//     .map((i, idx) => idx)
//     .map(i => Math.pow(i / n, 0.9));
//   // .map(i => Math.pow(i / n, 2));
//   console.log(N);
//   sampleCount = N.map(i => Math.ceil(i / Math.max(...N) * 1000));
//   // console.log(sampleCount);


//   let freqBands = MakeFrequencyBands(sampleCount, spectrum);

//   // let m = Math.max(...freqBands);

//   for (let i = 0; i < freqBands.length; i = i + 1) {
//     let x = map(i, 0, freqBands.length, 0, width);
//     let y = map(freqBands[i], 0, 255, height, 0);
//     let hauteur = height - y;
//     let largeur = width / freqBands.length;
//     rect(x, y, largeur, hauteur);
//   }

// }

function auPlayingSwitch(au = au) {
  if (au.paused) {
    au.play();
  } else {
    au.pause();
  }
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
function mouseClicked(e) {
  // if (e.target == cnv.elt) { auSwitch(au); }
}

function MakeFrequencyBands(sampleCount, samples) {
  let count = 0;
  let freqBand = [];
  for (let i = 0; i < sampleCount.length; i++) {
    let average = 0;
    for (let j = 0; j < sampleCount[i]; j++) {
      average += samples[count] * count;
      count++;
    }
    average = average / count;
    freqBand[i] = average / 100;
  }
  freqBand = freqBand.filter(i => !isNaN(i));
  return freqBand;
}

// sort and draw energy

// function getEachEnergy() {

//   if (!map) { // 假如没引用p5js,补充上map函数
//     var map = (value, start1, stop1, start2 = 0, stop2 = 1, withinBounds = true) => {
//       let v = value / (stop1 - start1);
//       let result = start2 + (stop2 - start2) * v;
//       let min2 = Math.min(start2, stop2),
//         max2 = Math.max(start2, stop2);
//       if (withinBounds) {
//         result = Math.min(Math.max(min2, result), max2);
//       }
//       return result;
//     }
//   }

//   // let hzNum = 16,
//   let hzMax = 11;
//   // 人类耳朵可以听到的最高音频频率阈值20kHz， 约等于 2 的 11 次方（20480

//   // let hzArr = [...new Array(hzNum)].map((i, idx) => idx);
//   // 一共分多少组， // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 ..., hzNum]

//   let hzArr = [...new Array(hzNum)].map((ii, idx, arr) => {
//     let i = idx / arr.length;
//     let arg = easeFuncName == 'powEase' ? [i, hzDistributePowBase] : [i];
//     return arr.length * easeFunc(...arg);
//   });
//   console.log(hzArr);
//   // 一共分多少组， // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 ..., hzNum]

//   hzArr = hzArr.map(i => map(i, Math.min(...hzArr), Math.max(...hzArr), 1, hzMax));
//   // 将分组序号 map 到 1 到 hzMax 之间
//   /**[1, 1.67, 2.33, 3, 3.67,
//    * 4.33, 5, 5.67, 6.33, 7,
//    * 7.67, 8.33, 9, 9.67,
//    * 10.33, 11]
//    * */

//   // hzArr = [20, 40, 80, 160, 1280, 2560, 5120, 20000]; //查询资料得到的常用的声音频率划分点
//   hzArr = hzArr.map(i => Math.pow(2, i) * 10);
//   // 将 序号，分别 pow 到 2 的多少次方， 乘以10，得到赫兹
//   /**[20, 31.75, 50.4, 80, 126.99,
//    * 201.59, 320, 507.97, 806.35,
//    * 1280, 2031.87, 3225.4, 5120,
//    * 8127.49, 12901.59, 20480]
//    */

//   hzArr = hzArr.map((i, idx, arr) => idx == 0 ? null : [arr[idx - 1], i]).filter(Boolean); //将 分段点，变成区间
//   // console.log(hzArr.map(h => h.join(',')));
//   /**[20, 31.75],
//    * [31.75, 50.4],
//    * [50.4, 80],
//    * [80, 126.99],
//    * [126.99, 201.59],
//    * [201.59, 320],
//    * [320, 507.97],
//    * [507.97, 806.35],
//    * [806.35, 1280],
//    * [1280, 2031.87],
//    * [2031.87, 3225.4],                                        
//    * [3225.4, 5120],
//    * [5120, 8127.49],
//    * [8127.49, 12901.59],
//    * [12901.59, 20480]
//    */
//   let energyArr = hzArr.map(ar => fft.getEnergy(...ar)); // 分别使用p5js sound 库的 getEnergy 。

//   let arrMax = 255;

//   //let  hzPowN = 1.02; //指数的底数
//   energyArr = energyArr.map(energy => Math.pow(hzPowN, energy) / Math.pow(hzPowN, arrMax) * arrMax);
//   // 将原来的一次函数 energy[i]
//   // 转换成 指数函数  Math.pow(hzPowN, energy[i])
//   // 最大值由原来的 255 ，变成 Math.pow(hzPowN, 255)

//   return energyArr;
// }


// if (!map) { // 假如没引用p5js,补充上map函数
//   function map(value, start1, stop1, start2 = 0, stop2 = 1, withinBounds = true) {
//     let v = value / (stop1 - start1);
//     let result = start2 + (stop2 - start2) * v;
//     let min2 = Math.min(start2, stop2),
//       max2 = Math.max(start2, stop2);
//     if (withinBounds) {
//       result = Math.min(Math.max(min2, result), max2);
//     }
//     return result;
//   }
// }

function updateHz_iFn(i, dx, ar) {
  return dx / (ar.length - 1);
}

function updateHz_easeArgFn(i, dx, ar) {
  let result = hzDistributeFuncName == '_pow' ? [updateHz_iFn(null, dx, ar), hzDistributePowBase] : [updateHz_iFn(null, dx, ar)];
  return result;
}

function updateHz_eachIdxFn(i, dx, ar) {
  let result = ar.length * distributeFunc(...updateHz_easeArgFn(null, dx, ar));
  return result;
}

function updateHz_eachSpot(i, dx, ar) {
  let hzMax = 11;
  let result = Math.pow(2, map(updateHz_eachIdxFn(null, dx, ar), 0, hzNum + 1, 1, hzMax)) * 10;
  return result;
}

function updateHz_eachInterval(i, dx, ar) {
  let result = dx == 0 ? null : [updateHz_eachSpot(null, dx - 1, ar), updateHz_eachSpot(null, dx, ar)];
  return result;
}

function updateHzArr(hzNum) {
  hzNum = hzNum ? hzNum : (this.hzNum ? this.hzNum : 16);
  hzArr = [...new Array(hzNum + 1)].map((ii, idx, arr) => updateHz_eachInterval(ii, idx, arr)).filter(Boolean);
}


function getEachEnergy(hzNum, hzHeightPowBase) {



  if (typeof hzArr == 'undefined' || hzArr.length != hzNum) {
    updateHzArr(hzNum);
  }


  // hzArr = [...new Array(hzNum + 1)].map((ii, idx, arr) => hz_eachInterval(ii, idx, arr)).filter(Boolean);

  let energyMax = 255;
  //let  hzPowBase = 1.02; //指数的底数
  let energyArr = hzArr.map(ar => {
    let energy = fft.getEnergy(...ar);
    return (Math.pow(hzHeightPowBase, energy) - Math.pow(hzHeightPowBase, 0)) / Math.pow(hzHeightPowBase, energyMax) * energyMax;
  });
  return energyArr;
}

drawFuncs.drawEnergy = () => {
  push();
  fft.analyze(1024);

  let energy = getEachEnergy(hzNum, hzPowBase);
  fill(fill_color);
  stroke(stroke_color);
  for (let i = 0; i < energy.length; i = i + 1) {
    let x = map(i, 0, energy.length, 0, width);
    let y = map(energy[i], 0, 255, height, 0);
    let hauteur = height - y;
    let largeur = width / energy.length;
    rect(x, y, largeur, hauteur);
  }

  pop();
}




drawFuncs.drawSpectrum = () => {
  // https://openprocessing.org/sketch/415932

  // let spectrum = fft.analyze();
  // let bands = fft.logAverages(fft.getOctaveBands());

  fft.analyze(Math.pow(2, fft_bins));


  let spectrum, bands;
  level = amplitude.getLevel();

  spectrum = fft.analyze(Math.pow(2, fft_bins));
  spectrum = spectrum.slice(0, Math.pow(2, fft_bins));

  bands = fft.logAverages(fft.getOctaveBands());
  bands = bands.slice(0, Math.floor(bands.length * fft_bins / 10));



  fill(255);
  noStroke();
  for (var i = 0; i < bands.length; i = i + 1) {
    var x = map(i, 0, bands.length - 1, 0, width);
    var y = map(bands[i], 0, 255, height, 0);
    var hauteur = height - y;
    var largeur = width / bands.length;
    rect(x, y, largeur, hauteur);
  }

  fill(0);
  noStroke();
  for (var i = 0; i < spectrum.length; i = i + 1) {
    var x = map(i, 0, spectrum.length - 1, 0, width);
    var y = map(spectrum[i], 0, 255, height, 0);
    var hauteur = height - y;
    var largeur = width / spectrum.length;
    rect(x, y, largeur, hauteur);
  }

  noFill();
  stroke(255, 0, 0);
  strokeWeight(4);
  beginShape();

  // one at the far corner
  curveVertex(0, height);

  for (var i = 0; i < bands.length; i++) {

    var x = map(i, 0, bands.length - 1, 0, width);
    var y = map(bands[i], 0, 255, height, 0);
    curveVertex(x, y);
  }

  // one last point at the end
  curveVertex(width, height);

  endShape();

}

// function drawFx(fx = defaultFx, min = 0, max = 1) {
//   let points = 50;
//   let txt = '';
//   for (var i = 0; i <= points; i = i + 1) {
//     var x = map(i, 0, points + 1, 0, width);
//     var y = map(fx(i / points), 0, 1, height, 0);
//     txt += fx(i / points) + '  ';

//     var hauteur = height - y;
//     var largeur = width / points;
//     rect(x, y, largeur, hauteur);
//   }
//   console.log(txt);
// }

// function defaultFx(x) {
//   let y;
//   let x2 = x * 2 - 1;
//   y = (Math.sin(x2 * Math.PI / 2) + 1) / 2;
//   y = Math.pow(0.5 - x, 2);
//   //y = x - Math.pow(Math.abs(x - y), 0.9) * ((x - y) > 0 ? 1 : -1);
//   // y = x - Math.pow(Math.abs(x - y), 1) * ((x - y) > 0 ? 1 : -1);
//   // y = 2 * x - y;
//   return y;
// }



/**x=x;
a=Math.sin((x-0.5)*Math.PI)/2+0.5;

b=x-a;
d=(0.5-Math.abs(x-0.5));
e=Math.sin(d*Math.PI)/2;
f=Math.pow(e*2,hzDistributePowBase)/2;
g=x<0.5?f:(1-f)
 */

function distributeFunc() {
  switch (hzDistributeFuncName) {
    case '_linear':
      return _linear(...arguments);
      break;
    case '_pow':
      return _pow(...arguments);
      break;
  }
}

function _pow(k, hzDistributePowBase, start = 0, end = 1) {
  // console.log(k, hzDistributePowBase);
  start = start ? start : 0, end = end ? end : 1;
  let mid = (end - start) / 2 + start,
    min = Math.min(start, end), max = Math.max(start, end);

  let x = Math.min(Math.max(k, min), max),
    a = (mid - Math.abs(x - mid)),
    b = Math.sin(a * Math.PI) / 2,
    c = Math.pow(b * 2, hzDistributePowBase) / 2,
    d = x < mid ? c : (end - c);
  return d;
}

function _linear(k, start = 0, end = 1) {
  start = start ? start : 0, end = end ? end : 1;
  let mid = (end - start) / 2 + start,
    min = Math.min(start, end), max = Math.max(start, end);
  let x = Math.min(Math.max(k, min), max);

  return (x - start) / (end - start) + start;
}

function mouseMoved() {
  if (startAudioBoo == true) {
    delete mouseMoved;
  }
  userStartAudio();
  startAudioBoo = true;
}

function touchStarted() {
  if (startAudioBoo == true) {
    delete touchStarted;
  }
  userStartAudio();
  startAudioBoo = true;
}