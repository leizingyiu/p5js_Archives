# Grid.js -- 简单方便地生成并使用网格

方便在p5js中进行栅格化设计，生成网格，返回网格点信息，并且在网格上绘制矩形、椭圆及文本。


## 查看范例
<a href="https://leizingyiu.github.io/p5js_Grid/">https://leizingyiu.github.io/p5js_Grid/</a>


## 引入
可以通过CDN引用，也可以下载到本地引用
```html
<script src="https://jsdelivr.../Grid.js //TODO "></script>
<!-- 或者 -->
<script src="./Grid.js"></script>
```

## 初始化
首先，用 位置、宽高、行列数量、边距、间距，绘制对象，对 Grid 进行初始化：  
  
```javascript
let grid = new Grid ({ l : 0 , t : 0 , w : 1600 , h : 900 , row : 3, col : 4 , margin : 40 , spacing : 10 , drawing : window });
```   
<br>     
初始化成功后，得到以下对象：  

```js
console.log(grid);
▸ Grid { "l" : 0 , "t" : 0 , "w" : 1600 , "h" : 900 , 
		//左上角坐标以及网格整体宽高，包含边距尺寸
		"row" : 2 , "col" : 2 , "margin" : 40 , "spacing" : 10 , 
		// 行列数量、以及网格边距、单元格间距
		"cellW" : 755 , "cellH" : 405 ,
		//单元格宽度、高度
		
		"grid" : {
			"0" : {
				"0" : {
					"row" : 0 , "col" : 0 , "l" : 40 , "t" : 40 , 
					"w" : 755 , "h" : 405 , "x" : 40 , "y" : 40 
				},
				"1" : {
					"row" : 0 , "col" : 1 , "l" : 805 , "t" : 40 , 
					"w" : 755 , "h" : 405 , "x" : 805 , "y" : 40 
				}
			},
			"1" : {
				"0" : {
					"row" : 1 , "col" : 0 , "l" : 40 , "t" : 455 , 
					"w" : 755 , "h" : 405 , "x" : 40 , "y" : 455 
				},
				"1" : {
					"row" : 1 , "col" : 1 , "l" : 805 , "t" : 455 , 
					"w" : 755 , "h" : 405 , "x" : 805 , "y" : 455
				}
			}
		},
		"rectmode" : "corner", 
		"drawing" : Window [window: Window(0), self: Window(0), document: document, name: '', location: Location, …], 
		"version" : "0.0.1"}

```

## 绘制内容

### 绘制参考线
你可以通过 drawCell 或者 drawRefLine 绘制参考线；<br>
drawCell 为绘制单元格<br>
drawRefLine 为绘制所有参考线  

```js
grid.drawCell();
//或者
grid.drawRefLine();
```

### 绘制矩形、椭圆、文本
与p5js中绘制 矩形、椭圆、文本 的方法几乎一致，用行列的序号替换位置坐标的 x 、y 即可：
（rectMode默认为CONCER）
```js
grid.text(str, rowIdx, colIdx, cols = 1, rows = 1)
grid.rect(rowIdx, colIdx, cols = 1, rows = 1)
grid.ellipse(rowIdx, colIdx, cols = 1, rows = 1) 
```   
   
```js
grid.rect(0,0,2,2);//第1列 第1行 的左上角，到，第2列 第2行 的右下角
grid.text('some text',1,2,2,3);//第2列 第3行 的左上角，到，第3列 第4行 的右下角
```

## 设置

### 设置绘制目标
与p5js中，图形可以绘制到 p5.Renderer 物件上，此设置项可指定 Grid 绘制参考线或矩形、文本时的p5.renderer对象:
```js
//初始化时，默认为window
grid=new Grid({drawing=window});

//可使用 drawOn 方法修改
pg = createGraphics(100, 100);
grid.drawOn(pg);
```

### 设置矩形模式
与 p5js 一样，Grid存在 rectMode 的概念，且参数与 p5js 一样，为 CORNER \ CORNERS \ RADIUS \ CENTER 。
此设置影响Grid中图形的绘制，以及cellArgs的返回内容。  
```js
grid.rectMode(CORNER);
```
 
## 获取数据
### 获取单元格参数
某些时候需要将单元格数据通过参数传递给其他函数，可使用 cellArgs 或者 cellArgsObj 方法获取：  
  
```js
grid.cellArgs(rowIdx, colIdx, cols = 1, rows = 1, mode = rectMode)
grid.cellArgsObj(rowIdx, colIdx, cols = 1, rows = 1, mode = rectMode)
```

```js
grid.cellArgs(0,0);
▸ [40, 40, 372.5, 266.6666666666667]

grid.cellArgsObj(0,0);
▸ {"l":40, "t":40, "w":452.5, "h":279.67, 
   "left":40, "top":40, "width":452.5, "height":279.67
   }

grid.cellArgsObj(0,1,2,2);
▸ {"l":40, "t":316.67, "w":755, "h":543.33, 
   "left":40, "top":316.67, "width":755, "height":543.33
   }

grid.cellArgsObj(1,0,1,1,CENTER);
▸ {"x":608.75, "y":173.33, "w":372.5, "h":266.67, 
   "centerX":608.75, "centerY":173.33, "width":372.5, "height":266.67
   }
```

 
   
    
	 
	  
	   
	    
		 
		  
		   
		    
