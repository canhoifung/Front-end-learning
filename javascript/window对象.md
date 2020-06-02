# window对象

最顶层的对象

若变量未声明，就默认为顶层对象的属性

## 属性

### window.name

表示当前浏览器窗口的名字

只能保存字符串，非字符串的会转为字符串保存

只要浏览器窗口不关闭，属性就不会消失，即若同一窗口载入了新网页，新网页也可以获取到设置的内容

### window.closed，window.opener

`window.closed`返回布尔值，表示窗口是否关闭

一般用于检查使用脚本打开的新窗口是否关闭

```javascript
var popup = window.open();
if ((popup !==null)&& !popup.closed){
    //窗口打开着
}
```

`window.opener`表示打开当前窗口的父窗口，若没有则返回`null`

若两个窗口之间不需要通信，可以将子窗口的`opener`属性显式设置为`null`，更安全

```javascript
var newWin = window.open('example.html', 'newWindow', 'height=400,width=400');
newWin.opener = null;
```

若两个窗口同源，且其中一个由另一个打开，可以通过`opener`属性获取父窗口的全局属性和方法

`<a>`元素添加`rel="noopener"`属性，可以防止新打开的窗口获取父窗口，减轻被恶意网站修改父窗口 URL 的风险。

```html
<a href="https://an.evil.site" target="_blank" rel="noopener">
恶意网站
</a>
```

### window.self，window.window

都指向窗口本身，只读

```javascript
window.self === window.window === window  //true
```

### window.frames，window.length

`window.frames`返回一个类似数组的对象，成员为页面内所有的框架窗口，包括了`frame`元素和`iframe`元素

​	若`iframe`设置了`id`或``name`属性，则可以通过如：

```html
<iframe name="myIFrame">
    
</iframe>
//javascript:
//  frames['myIFrame']   或者  frames.myIFrame
```

`frames`属性实际是`window`对象的别名

```javascript
frames === window //true;
```

因此`frames[0]`也等于`window[0]`



`window.length`返回当前网页包含的框架总数，若无则返回0；

```javascript
window.frames.length === window.length; //true
```

### window.frameElement

主要用于当前窗口嵌在另一个网页的情况，返回当前窗口所在的那个元素节点

若当前窗口为顶层窗口，或嵌入的网页非同源，则返回`null`

```javascript
// HTML 代码如下
// <iframe src="about.html"></iframe>

// 下面的脚本在 about.html 里面
var frameEl = window.frameElement;
if (frameEl) {
  frameEl.src = 'other.html';
}
```

### window.top，window.parent

分别指向最顶层窗口和父窗口

若没有父窗口，则指向自身

若网页不包含框架，则指向`window`对象

### window.status

用于读写浏览器状态栏的文本

> 不一定管用

### window.devicePixelRatio

返回一个数值，表示一个CSS像素的大小与一个物理像素的大小之间的比率

用于判断用户显示环境，切换图片清晰度

### 位置大小属性

#### window.screenX，window.screenY

浏览器窗口左上角相对于当前屏幕左上角的水平和垂直距离，只读

#### window.innerHeight，window.innerWidth

返回网页在当前窗口中可见部分的高度和宽度，即`viewport`的单位像素大小，只读

==*==包括了滚动条的宽高

==*==若网页比例放大，属性会变小，因为显示的单位像素减少

#### window.outerHeight，window.outerWidth

返回浏览器窗口的宽高，包括了浏览器菜单和边框的单位像素大小，只读

#### window.scrollX，window.scrollY

返回页面的水平/垂直滚动距离，单位为像素，只读

==*==返回双精度浮点数

#### window.pageXOffset，window.pageYOffset

上面两个的别名

### 组件属性

- `window.locationbar`：地址栏对象
- `window.menubar`：菜单栏对象
- `window.scrollbars`：窗口的滚动条对象
- `window.toolbar`：工具栏对象
- `window.statusbar`：状态栏对象
- `window.personalbar`：用户安装的个人工具栏对象

都有一个`visible`属性，表示组件是否可见，只读不可修改

### 全局对象属性

- `window.document`：指向`document`对象，详见《document 对象》一章。注意，这个属性有同源限制。只有来自同源的脚本才能读取这个属性。
- `window.location`：指向`Location`对象，用于获取当前窗口的 URL 信息。它等同于`document.location`属性，详见《Location 对象》一章。
- `window.navigator`：指向`Navigator`对象，用于获取环境信息，详见《Navigator 对象》一章。
- `window.history`：指向`History`对象，表示浏览器的浏览历史，详见《History 对象》一章。
- `window.localStorage`：指向本地储存的 localStorage 数据，详见《Storage 接口》一章。
- `window.sessionStorage`：指向本地储存的 sessionStorage 数据，详见《Storage 接口》一章。
- `window.console`：指向`console`对象，用于操作控制台，详见《console 对象》一章。
- `window.screen`：指向`Screen`对象，表示屏幕信息，详见《Screen 对象》一章

### window.isSecureContext

返回布尔值，表示当前窗口是否处在加密环境

若是HTTPS协议则为`true`，否则为`false`

## window对象的方法

### window.alert()，window.prompt()，window.confirm()

三种交互的对话框，样式又浏览器规定，无法定制

弹出对话框期间页面暂停执行

#### window.alert()

对话框只有一个确定按钮，用于通知

参数只能是字符串，无法使用CSS样式

对话框弹出期间窗口冻结

#### window.prompt()

对话框有提示文字，下方有一个输入框，并有确定取消两个按钮

```javascript
var result = prompt('你的年龄',25);
```

填入的值会作为返回值存入`result`

若用户点击取消，则返回值为`null`

第二个参数作为默认值可选

#### window.conform()

对话框除提示信息外还有确定取消两个按钮，用户征询用户意见

```javascript
var result = confirm('hello');
```

返回布尔值，确定就true取消就false





























