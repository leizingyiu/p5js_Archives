## 引用及感谢

这个项目最初只是为了把自己在 <a href='https://openprocessing.org/user/150269/'>openprocessing</a> 的东西，下载回来在本地也能用 <a href='https://github.com/msawired/OPC/'>OPC</a> 的滑块。  
可以说，这个项目当时是基于 OPC 的参考，并进行延伸。感谢 OPC 作者 <a href='https://github.com/msawired'>Sinan Ascioglu</a>。    
当 sketch 从 openprocessing 下载下来后，只需在开头声明变量 OPC 、 在 preload 中先初始化自己的 p5js_Ctrler ，就可以继续使用滑块。如下面的注释部分：
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

其中拖拽功能参考 runoob.com 的案例：<https://c.runoob.com/codedemo/5370/>  

其中将 name 转换成变量名称的部分，参考 OPC 源码：<https://github.com/msawired/OPC/blob/61287403522196ea6c0354a3e3850bc4c853d0b9/opc.js>
  
感谢优设的小伙伴为文案提供帮助  
感谢 processing.love 的群主及群友，在技术上提供的帮助
  
如发现问题，请及时提出指正，感谢！