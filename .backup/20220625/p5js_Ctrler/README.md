english : <a href='./README_en.md'>README_en.md</a>
  
# PC - p5js Ctrler - Variable controller for p5js
一个可以在 p5js 运行时，实时操控代码变量的插件。  
    
<div class='links-table'>
    <p><span>查看最新版本：</span><span>
        <a href='./index.html'>/index.html<small> ｜ 使用ES6 import sketch 模塊</small></a> 
        <a href='./sketch.js'>/sketch.js<small> ｜ 使用 exprot 的 p5js 脚本</small></a><br>
        <a href='./index_none_module.html'>/index_none_module.html<small> ｜ 未使用import</small></a> 
        <a href='./sketch_none_module.js'>/sketch_none_module.js<small> ｜ 普通的 p5js 脚本</small></a><br>
        <a style='display:block;width:100%;height:0px;border-top:solid 0.5px #ccc;margin: 0.5em 0em !important;'></a>  
        <a href='./util/diff.html?leftFile=./index.html&rightFile=./index_none_module.html'>/diff.html?file=index...<small> ｜ 查看html对比</small></a> 
        <a href='./util/diff.html?leftFile=./sketch.js&rightFile=./sketch_none_module.js'>/diff.html?file=script...<small> ｜ 查看sketch 脚本对比</small></a>
    </span>
    </p>
    <p><span>查看较旧版本：</span><span><a href='./versions/index.html'>/versions/index.html</a></span></p>
    <p><span>查看范例：</span><span><a href='./examples/examples.html'>/examples.html</a></span></p>
    <p><span>查看wip版本：</span><span><a href='./.wip/index_wip.html'>/index_wip.html</a></span></p>
    <p><span>查看wip范例：</span><span><a href='./.wip/examples_wip.html'>/examples_wip.html</a></span></p>
    <p><span>马上试试：</span><span><a
                href='https://openprocessing.org/sketch/1537105'>https://openprocessing.org/sketch/1537105</a><span></p>
</div>
<style>
    div.links-table {
        font-size: 0.8em;
    }
    div.links-table,
    div.links-table * {
        transition: opacity 0.5s ease;
    }
    div.links-table>p {
        display: flex;
        margin: 1em 0 !important;
    }
    div.links-table>p a {
        display: inline-block;
        margin: 0 1em 0 0 !important;
    }
    div.links-table>p>span:first-child {
        width: 8em;
        display: inline-block;
        padding-right: 1em;
        word-break: normal;
        line-height: 1.35em;
    }
    div.links-table a:hover>small {
        opacity: 1 !important;
    }
</style>

## 目录  
- [示例](#示例)  
- [初始化](#初始化)  
- [不同的使用风格](#不同的使用风格)
- [控制器功能](#控制器功能)  
  - 滑块  [slider](#slider)
  - 按钮  [button](#button)
  - 多选器  [checkbox](#checkbox)
  - 下拉菜单  [select](#select)
  - 单选器  [radio](#radio)
  - 拾色器  [color](#color)
  - 输入框  [input](#input)
  - 文本框  [textarea](#textarea)
  - 文件选择器  [fileinput](#fileinput)
  - 水平线  [hr](#hr)
- [编组功能](#编组功能)  
- [操作功能](#操作功能) 
  - 更新 [update](#update)
  - 启用与禁用 [enable](#enable) [disable](#disable)
  - 调整<small>(滑块控制器)</small>范围 [range](#range)
  - 调整<small>(滑块控制器)</small>精度 [precision](#precision)
  - 获取控制器的值 [getCtrlerVal](#getCtrlerVal)
  - 更改显示名称 [displayName](#displayName)
  - 声明变量，指向控制器 [var](#var)
  - 添加说明文本 [alt](#alt)
  - 更改控制器标题 [title](#title)
- [工具按钮](#工具按钮)  
- [引用及感谢](#引用及感谢)  
  
  

## 示例
返回[目录](#目录)  

以下是一些最基础的功能，你可以复制下面的代码到你的 sketch 中试试  

```javascript

let pc, btnN = 0, txt = '', preset;

function preload() {
    pc = new PC({
        displayBoo: true, updateWithUrlBoo: true,
        updateWithCookieBoo: true, autoHideBoo: true
    });

    preset = {
        'rect_p': 48, 'rect_stroke_weight': '10',
        'rect_stroke_color': '#000', '_color': '#ffaa00'
    };

    pc.slider('rect_p', 20, 0, 400, 1);

    pc.slider('rect_w', 40, 0, 400, 1,
        (e) => { console.log(e); });

    pc.button('random_rect_p', 'random it !',
        () => {
            rect_p = Math.random() * Math.min(width, height);
        });

    pc.checkbox('rect_stroke_boo', false, ['stroke', 'noStroke'],
        () => { console.log('box clicked'); });

    pc.select('rect_stroke_weight', ['10', '20', '40'],);

    pc.radio('rect_stroke_color', ['#000', '#369', '#fff'], () => {
        rect_stroke_boo = true;
    });

    pc.color('_color', '#fff');

    pc.input('txtInput', 'this is a p5js_ctrler demo');

    pc.fileinput('loadTxt', (e) => {
        console.log(e.data);
        let l = loadStrings(e.data, (arr) => {
            txt = arr.join('\n');
            console.log(txt);
        });
    });

    pc.load(preset);
}

function setup() {
    createCanvas(400, 400);
}

function draw() {
    background(_color);

    if (rect_stroke_boo == false) {
        noStroke();
    } else {
        strokeWeight(rect_stroke_weight);
        stroke(rect_stroke_color);
    }
    rectMode(CORNER);
    rect(rect_p, rect_p, rect_w, rect_w);

    noStroke();
    textAlign(LEFT, TOP);
    text(txtInput, 0, 0);
    text(txt, width / 2, height / 2, width / 2, height * 2);
}

```


## 初始化
返回[目录](#目录)  

初始化时，可设置具体参数，也可留空，程序将自动使用以下默认参数。
``` javascript
  pc = new PC({
    displayBoo: true,                     //是否显示设置框，如设置 false 则不显示   

    updateWithUrlBoo: true,               //是否同步更新网址search参数，并且初始化时读取网址search，如设置 false 则不写入、不读取   

    updateWithCookieBoo: true,            //是否同步更新cookie，并且初始化时读取cookie，如设置 false 则不写入、不读取

    autoHideBoo: true,                    //是否自动隐藏，如设置false，则不会自动隐藏

    showToolsBoo: true,                   //是否显示工具按钮，如设置false，则不现实顶部工具按钮

    text_color: '#000',                   //文字颜色

    main_color: '#0075ffcc',              //高亮颜色

    bg_color: 'hsla(0deg,100%,100%,0.8)', //背景颜色
    
    ctrler_width: 100,                    //控制器宽度，单位为 px
    
    font_size: 12,                        //字体大小，单位为 px
    
    line_height: '1.5em',                 //行高，与 css 中设置一样

    checkbox_true_display: '✔'            //复选框为true时的显示字符
  });
```

p5js_ctrler 依赖于 p5js，请在 preload 或者 setup 中初始化。 

## 不同的使用风格
返回[目录](#目录)   
  
本插件可以以下几种风格使用：  

### 命令式
```javascript
pc=new PC();
pc.slider('_slider', 20, 0, 100, 1);
pc.update('_slider',50);
pc.displayName('_slider','a slider for _slider');
```

### 声明式

```javascript
pc=new PC();
const sld=pc.slider('_slider', 20, 0, 100, 1);
sld.update(50);
sld.displayName('a slider for _slider');
```

### 链式
```javascript
pc=new PC();
pc.slider('_slider', 20, 0, 100, 1)
  .update(50)
  .displayName('a slider for _slider');
```

其中可被 [控制器](#控制器功能) 声明式或链式调用的方法有:
- 赋值: [update](#更新) 
- 启用 与 禁用: [enable](#enable) [disable](#disable)
- 修改滑块范围: [range](#调整(滑块控制器)范围) 
- 修改滑块精度: [precision](#获取控制器的值) 
- 修改名称: [displayName](#更改显示名称) 
- 获取控制器的值: [getCtrlerVal](#获取控制器的值) 
- 声明一个变量，引用控制器的值: [var](#声明变量)
- 添加说明文本: [alt](#添加说明文本)  

可被 [编组](#编组功能) 声明方或链式调用的方法有: 
- 新建控制器，及水平线:  [slider](#slider), [button](#button), [checkbox](#checkbox), [select](#select), [radio](#radio), [color](#color), [input](#input), [textarea](#textarea), [fileinput](#fileinput), [hr](#hr)
- 修改控制器名称: [displayName](#更改显示名称) 
- 启用 与 禁用: [enable](#enable) [disable](#disable)

## 控制器功能
返回[目录](#目录)    
  
以下控制器使用时，可参照罗列出来的参数使用；  
也可直接不写任何参数，在后续过程中定义显示名称（[displayName](#displayName)），以及定义指向控制器的值的变量，并用变量操控控制器（[var](#var)）。  
不写任何参数时，默认定义一个名称为 “p5js_ctrler”加一串随机数 的变量。  
当需要空缺名称而填写后续参数时，可以 null 或 false 替代 name 参数。     

### 滑块
#### slider 
当使用滑块时，不填写最小值、最大值、精度（minVal、maxVal、precision）时，可在后续过程中用 [range](#range) [precision](#precision) 进行设置。
```javascript
pc.slider(name, defaultVal, minVal = 0, maxVal = 2 * defaultVal, precision = defaultVal / 10, fxn = () => { })
```

#### 示例
```javascript
pc = new PC();
pc.slider('_slider', 20);
pc.slider('_slider2', 0, -20, 20, 1, (e) => { console.log(e)});
```



### 按钮
#### button
```javascript
pc.button(name, btnText, fxn = () => { })
```
#### 示例
```javascript
pc = new PC();
pc.button('_button', 'btnText', () => { console.log('button clicked'); });
```


### 多选器
#### checkbox
```javascript
pc.pc.checkbox(name, defaultVal = false, labelText = ['yes', 'no'], fxn = () => { })
```

#### 示例
```javascript
pc = new PC();
pc.checkbox('_check_box', false, ['yeees', 'nooo'], () => {console.log('box clicked'); });
```


### 下拉菜单
#### select
```javascript
select(name, options = [], fxn = () => { })
```
#### 示例
```javascript
pc = new PC();
pc.select('_sel', ['sel a', 'sel b', 'sel c'], () => { });
```


### 单选器
#### radio
```javascript
pc.radio(name, options = [], fxn = () => { }) 
```
#### 示例
```javascript
pc = new PC();
pc.radio('_radio', ['radio a', 'radio b', 'radio c'], () => { });
```


### 拾色器
#### color
```javascript
pc.color(name, defaultVal = '#369') 
```
#### 示例
```javascript
pc = new PC();
pc.color('_color', '#fff');
```


### 输入框
#### input
```javascript
pc.input(name, defaultVal = '', fxn = () => { }) 
```
#### 示例
```javascript
pc = new PC();
pc.input('txtInput', 'sth wanner say');
```


### 文本框
#### textarea
```javascript
pc.textarea(name, defaultVal = '', fxn = () => { })
```
#### 示例
```javascript
pc = new PC();
pc.textarea('textArea', 'a long long long long sentence');
```


### 文件选择器
#### fileinput
```javascript
pc.fileinput(name, fxn = () => { }) 
```
#### 示例
```javascript
pc = new PC();
pc.fileinput('loadTxt', (e) => {
    console.log(e.data);
    let l = loadStrings(e.data, (arr) => {
        txt = arr.join('\n');
        console.log(txt);
    });
});
```


### 水平线
#### hr
```javascript
pc.hr(borderStyle, borderWidth)
```

其中borderStyle为水平线的样式，参数对应线条参考下列表格
| 参数 | 样式     | 参数 | 样式      |
| --- | :-----   | :-- | :----    |
| ''  | 'none'   | ' ' | 'none'   | 
| '.' | 'dotted' | '-' | 'dashed' | 
| '_' | 'solid'  | '=' | 'double' | 
| 'v' | 'groove' | 'V' | 'groove' | 
| 'A' | 'ridge'  | '^' | 'ridge'  | 
| '<' | 'inset'  | '[' | 'inset'  |
| '>' | 'outset' | ']' | 'outset' | 

borderWidth 为水平线的粗细，可填入css的长度数量，如‘0.1em’、‘1px’、‘0.2vh’……
#### 示例
```javascript
pc = new PC();
pc.hr(borderStyle='-',borderWidth='1px');
```

## 编组功能
返回[目录](#目录)  
### group
```javascript
 pc.group('groupName');
```

#### 示例
```javascript
pc = new PC();
grp = pc.group();
grp.displayName('编组名称');
grp.slider('grpSlider', 1);
grp.select('grpSelect', ['grpSel_A', 'grpSel_B', 'grpSel_C']);
grp.radio('grpRadio', ['grpRadio_D', 'grpRadio_E']);

/*——或者——*/
 pc.group()
    .displayName('编组名称');
    .slider('grpSlider', 1)
    .select('grpSelect', ['grpSel_A', 'grpSel_B', 'grpSel_C'])
    .radio('grpRadio', ['grpRadio_D', 'grpRadio_E']);
```



## 操作功能
返回[目录](#目录)  

控制器功能返回的是控制器自身，以下操作功能可在控制器后做链式函数操作
```javascript
pc = new PC();
pc.slider('_slider', 0, -20, 20, 1);
pc.update('_slider', 10);
pc.range('_slider',-100,100);
pc.precision('_slider',0.01);
pc.displayName('_slider','滑块');
pc.alt('_slider','这是一个滑块');

/*链式函数形式*/
pc.slider('_slider', 0, -20, 20, 1)
  .update(10)
  .range(-100,100)
  .precision(0.01)
  .displayName('滑块')
  .alt('这是一个滑块');

/* 或者写成一行 */
pc.slider('_slider', 0, -20, 20, 1).update(10).range(-100,100).precision(0.01).displayName('滑块').alt('这是一个滑块');

```

### 更新
#### update
```javascript
pc.update('variable', value);

/*___或者___*/
variable=value;
```

#### 示例
```javascript
pc = new PC();
pc.slider('_slider', 0, -20, 20, 1);
pc.update('_slider', 10);

/*——或者——*/
_slider = 10;
```


### 启用与禁用
#### enable
#### disable
```javascript
pc.enable(name);
pc.disable(name);
```

#### 示例
```javascript
pc = new PC();
pc.slider('_slider', 0, -20, 20, 1);
pc.disable('_slider');
pc.enable('_slider');
```

可在控制器中的回调函数中，控制其他控制器是否可用，譬如：
```javascript
pc=new PC();

pc.slider('_slider');
pc.radio('_radio',['yes','no'],(e)=>{
  let v = e.target.value;
  switch (v) {
    case 'no':
      pc.disable('_slider');
      break;
    case 'yes':
      pc.enable('_slider');
      break;
  }
})
```
这两个方法对组同样有效，当disable一个组的时候，这个组里面的控制器会全部disable，并且这个组会折叠；  
当enable这个组的时候，组里面的控制器会全部enable，并且这个组会展开。譬如：  
```javascript
pc=new PC();

pc.group('the_group')
  .slider('_slider')
  .input('_input');

pc.radio('_radio',['en_group','dis_group'],(e)=>{
  let v = e.target.value;
  switch (v) {
    case 'no':
      pc.disable('the_group');
      break;
    case 'yes':
      pc.enable('the_group');
      break;
  }
});

```



### 调整(滑块控制器)范围
#### range
```javascript
pc.range(name, min, max);
```

#### 示例
```javascript
pc = new PC();
pc.slider('_slider', 0, -20, 20, 1);
pc.range('_slider', -100, 100);
```

### 调整(滑块控制器)精度
#### precision
```javascript
pc.precision(name, precisionNum);
```

#### 示例
```javascript
pc = new PC();
pc.slider('_slider', 0, -20, 20, 1);
pc.precision('_slider', 0.1);
```

### 获取控制器的值
#### getCtrlerVal
```javascript
pc.getCtrlerVal(name);
```

#### 示例
```javascript
pc = new PC();
pc.slider('_slider', 0, -20, 20, 1);
let val=pc.getCtrlerVal('_slider');

/*__或__*/
let val=_slider;
```

### 更改显示名称
#### displayName
```javascript
pc.displayName(name,displayname);
```

#### 示例
```javascript
pc = new PC();
pc.slider('_slider', 0, -20, 20, 1);
pc.displayName('_slider','滑块');
```

### 声明变量，指向控制器
#### var
```javascript
pc.var(name, variableName);
```

#### 示例
```javascript
pc = new PC();
pc.slider('_slider', 0, -20, 20, 1);
pc.var('_slider', 'sld');
sld=10;
console.log(sld);
```
此功能可搭配“匿名”控制器使用，譬如
```javascript
pc=new PC();
theSlider=pc.slider().displayName('滑块的显示名称');

...

theSlider.var('variableOfSlider');
```

### 添加说明文本
#### alt
```javascript
pc.alt(name, altText);
```

#### 示例
```javascript
pc = new PC();
pc.slider('_slider', 0, -20, 20, 1);
pc.alt('_slider', 'this is a slider');
```

### 更改控制器标题
#### title
```javascript
pc.title(titlename);
```

#### 示例
```javascript
pc = new PC();
pc.slider('_slider', 0, -20, 20, 1);
pc.title('theCtrlerName');
```


## 工具按钮
返回[目录](#目录)  

### [ var ]
生成 var 语句，方便参数脱离此插件使用。

### [ toJson ]
生成 json 。 可生成多套 json 参数，并通过 load() 加载。

#### 示例
```javascript
preset=[{'slider':1,'boo':true},{'slider':2,'boo':false}][Math.random()>0.5?0:1];
pc = new PC();
pc.slider('slider',0);
pc.checkbox('boo',false);
pc.load(preset);
```

### [ renew ]
根据当前参数，重新生成 new PC 以及后续设置语句

###  [ reset ]
重置所有参数，将参数回归到代码中的设置，并且清理地址栏中的参数

###  [ generaUrl ]
将当前参数更新到网址中，以便分享带参数的网址

 

## 引用及感谢
返回[目录](#目录)   

这个项目最初只是为了把自己在 <a href='https://openprocessing.org/user/150269/'>openprocessing</a> 的东西，下载回来在本地也能用 <a href='https://github.com/msawired/OPC/'>OPC</a> 的滑块。    
  
可以说，这个项目当时是基于 OPC 的参考，并进行延伸。感谢 OPC 作者 <a href='https://github.com/msawired'>Sinan Ascioglu</a>。    
  
当 sketch 从 openprocessing 下载下来后，只需在开头声明变量 OPC 、 在 preload 中先初始化自己的 p5js_Ctrler ，就可以继续使用滑块。如下面的注释部分: 
```javascript
// https://openprocessing.org/sketch/1414246
// let OPC;
function preload() {
	// OPC = new PC();
	OPC.slider('c1', 10, 0, 255);
	OPC.slider('c2', 100, 0, 255);
	// OPC.hr();
	OPC.slider('sizeMin', 1, 0, 200, 0.1);
	OPC.slider('sizeStep', 2, 0, 100, 1);
	OPC.slider('sizeMax', 10, 0, 600, 0.1);
	// OPC.hr();
	OPC.slider('posSteps', 10, 0, 100, 1);
}
```
  
其中拖拽功能参考 runoob.com 的案例: <https://c.runoob.com/codedemo/5370/>    
  
其中将 name 转换成变量名称的部分，参考 OPC 源码: <https://github.com/msawired/OPC/blob/61287403522196ea6c0354a3e3850bc4c853d0b9/opc.js>  
    
感谢优设的小伙伴为文案提供帮助    
  
感谢 processing.love 的群主及群友，在技术上提供的帮助  
  
如发现问题，请及时提出指正，感谢！