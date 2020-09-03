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

### window.open()，window.close()，window.stop()

#### window.open()

弹出一个新建窗口

返回新窗口的引用，若无法新建则返回`null`

```javascript
window.open(url,windowName,[windowFeatures]);
```

- `url`：字符串，表示新窗口的网址。如果省略，默认网址就是`about:blank`。

- `windowName`：字符串，表示新窗口的名字。如果该名字的窗口已经存在，则占用该窗口，不再新建窗口。如果省略，就默认使用`_blank`，表示新建一个没有名字的窗口。另外还有几个预设值，`_self`表示当前窗口，`_top`表示顶层窗口，`_parent`表示上一层窗口。

  ==*==只有在两个窗口同源或目标窗口被当前网页打开，才能指向该窗口

- `windowFeatures`：字符串，内容为逗号分隔的键值对（详见下文），表示新窗口的参数，比如有没有提示栏、工具条等等。如果省略，则默认打开一个完整 UI 的新窗口。如果新建的是一个已经存在的窗口，则该参数不起作用，浏览器沿用以前窗口的参数

```javascript
var popup = window.open(
  'somepage.html',
  'DefinitionsWindows',
  'height=200,width=200,location=no,status=yes,resizable=yes,scrollbars=yes'
);
```

第三个参数可设置的属性：

第三个参数可以设定如下属性。

- left：新窗口距离屏幕最左边的距离（单位像素）。注意，新窗口必须是可见的，不能设置在屏幕以外的位置。
- top：新窗口距离屏幕最顶部的距离（单位像素）。
- height：新窗口内容区域的高度（单位像素），不得小于100。
- width：新窗口内容区域的宽度（单位像素），不得小于100。
- outerHeight：整个浏览器窗口的高度（单位像素），不得小于100。
- outerWidth：整个浏览器窗口的宽度（单位像素），不得小于100。
- menubar：是否显示菜单栏。
- toolbar：是否显示工具栏。
- location：是否显示地址栏。
- personalbar：是否显示用户自己安装的工具栏。
- status：是否显示状态栏。
- dependent：是否依赖父窗口。如果依赖，那么父窗口最小化，该窗口也最小化；父窗口关闭，该窗口也关闭。
- minimizable：是否有最小化按钮，前提是`dialog=yes`。
- noopener：新窗口将与父窗口切断联系，即新窗口的`window.opener`属性返回`null`，父窗口的`window.open()`方法也返回`null`。
- resizable：新窗口是否可以调节大小。
- scrollbars：是否允许新窗口出现滚动条。
- dialog：新窗口标题栏是否出现最大化、最小化、恢复原始大小的控件。
- titlebar：新窗口是否显示标题栏。
- alwaysRaised：是否显示在所有窗口的顶部。
- alwaysLowered：是否显示在父窗口的底下。
- close：新窗口是否显示关闭按钮。

对于打开关闭的属性，设为`yes`或`1`或不设置属性就表示打开，设为关闭则省略属性

==*==`tltlebar`和关闭按钮默认为`yes`

#### window.close()

用于关闭当前窗口，一般只用来关闭`window.open`新建的窗口

==*==只对顶层窗口有效

#### window.stop()

停止加载图像、视频等正在或等待加载的对象

### window.moveTo()，window.moveBy()

`window.moveTo()`用于移动浏览器窗口到指定位置，接收两个参数，水平距离和垂直距离

`window.moveBy()`用于将窗口移动到一个相对位置，两个参数为窗口左上角向右移动的水平距离和向下移动的垂直距离

==*==需要窗口是`window.open()`方法新建的，且窗口只有它一个tab页，否则无效

### window.resizeTo()，window.resizeBy()

`window.resizeTo()`用于缩放窗口到指定大小，两个参数，缩放后的窗口宽度和高度（outerwidth和outerheight）

```javascript
window.resizeTo(
	window.screen.availWidth/2,
    window.screen.availHeight/2
)
```

`window.resizeBy()`接收两个参数，水平垂直缩放的量，单位为像素

### window.scrollTo()，window.scroll()，window.scrollBy()

`window.scrollTo()`将文档滚动到指定位置，两个参数为滚动后位于窗口左上角的页面坐标，或者接受一个配置对象作为参数：

```javascript
window.scrollTo(x-coord,y-coord);
window.scrollTo(options);
```

配置对象参数：

- `top`：滚动后页面左上角的垂直坐标，即 y 坐标。
- `left`：滚动后页面左上角的水平坐标，即 x 坐标。
- `behavior`：字符串，表示滚动的方式，有三个可能值（`smooth`、`instant`、`auto`），默认值为`auto`。

`window.scroll()`==`window.scrollTo()`

`window.scroilBy()`用于将网页滚动指定距离，像素为单位。两个参数为水平向右和向下滚动的像素

```javascript
window.scrollBy(0,window.innerHeight);
```

### window.print()

跳出打印对话框

### window.focus()，window.blur()

`window.focus()`激活窗口使其获得焦点出现在其他窗口前

`window.blur()`将焦点从窗口移除

### window.getSelection()

返回一个`Selection`对象，表示用户现在选中的文本，用`toString()`可以得到选中的文本

```javascript
var selectedText = window.getSelection().toString();
```

### window.getComputedStyle()，window.matchMedia()

`window.getComputedStyle()`接收一个元素节点作为参数，返回包含该元素最终样式信息的对象

`window.matchMedia()`用于检查CSS的`mediaQuery`语句

### window.requestAnimationFrame()

与`setTimeout`类似，推迟某个函数的执行，但是这个函数是推迟到浏览器下一次重流时执行，执行完才会进行下一次重绘

重流一般16ms执行一次，但网页切换到后台Tab页时会暂停执行函数

一般用于推迟某个会改变网页布局的函数

接收一个回调函数作为参数，回调函数执行的参数为系统传入的高精度时间戳(`performance.now()`的返回值，单位ms)

返回一个整数，可以用于传入`window.cancelAnimationFrame()`用于取消回调函数的执行

```javascript
var element = document.getElementById('animate');
element.style.position = 'absolute';

var start = null;

function step(timestamp) {
  if (!start) start = timestamp;
  var progress = timestamp - start;
  // 元素不断向左移，最大不超过200像素
  element.style.left = Math.min(progress / 10, 200) + 'px';
  // 如果距离第一次执行不超过 2000 毫秒，
  // 就继续执行动画
  if (progress < 2000) {
    window.requestAnimationFrame(step);
  }
}

window.requestAnimationFrame(step);
```

### window.requestIdleCallback()

与`setTimeout`类似，但是这个函数会保证将回调函数推迟到系统资源空闲时执行

可以保证网页性能

接受一个回调函数和配置对象作为参数，配置对象可以指定一个推迟执行的最长时间

超过时间无论系统资源是否空闲都会执行

```javascript
window.requestIdleCallback(callback[,options]);
```

`callback`函数执行时，系统会传入一个`IdleDeadline`对象作为参数

`IdleDeadline`对象有一个`didTimeout`属性，布尔值，表示是否超时调用，以及一个`timeRemaining()`方法，返回该空闲时段剩余的毫秒数，超时就返回0

`options`配置对象只有一个`timeout`属性，用于指定推迟执行的最大毫秒数

该方法返回一个整数，可以传入`window.cancalIdleCallback()`取消回调函数

```javascript
requestIdleCallback(myNonEssentialWork);

function myNonEssentialWork(deadline) {
  while (deadline.timeRemaining() > 0) {
    doWorkIfNeeded();
  }
}
```

## 事件

### load，onload

`load`发生在==文档在浏览器窗口加载完毕的时候==

`window.onload`属性用于指定这个事件的回调函数

### errror，onerror

==一般只有浏览器脚本发生错误时触发==

回调函数不接受错误对象作为参数，接受一下参数：

- 出错信息
- 出错脚本的网址
- 行号
- 列号
- 错误对象

```javascript
window.onerror = function (message, filename, lineno, colno, error) {
  console.log("出错了！--> %s", error.stack);
};
```

> 如果脚本网址与网页网址不在同一个域（比如使用了 CDN），浏览器根本不会提供详细的出错信息，只会提示出错，错误类型是“Script error.”，行号为0，其他信息都没有

解决办法：

在脚本所在的服务器，设置`Access-Control-Allow-Origin`的 HTTP 头信息。

```JavaScript
Access-Control-Allow-Origin: *
```

然后，在网页的`<script>`标签中设置`crossorigin`属性。

``` html
<script crossorigin="anonymous" src="//example.com/file.js"></script>
```

上面代码的`crossorigin="anonymous"`表示，读取文件不需要身份信息，即不需要 cookie 和 HTTP 认证信息。如果设为`crossorigin="use-credentials"`，就表示浏览器会上传 cookie 和 HTTP 认证信息，同时还需要服务器端打开 HTTP 头信息`Access-Control-Allow-Credentials`

### window对象的事件监听属性

- `window.onafterprint`：`afterprint`事件的监听函数。
- `window.onbeforeprint`：`beforeprint`事件的监听函数。
- `window.onbeforeunload`：`beforeunload`事件的监听函数。
- `window.onhashchange`：`hashchange`事件的监听函数。
- `window.onlanguagechange`: `languagechange`的监听函数。
- `window.onmessage`：`message`事件的监听函数。
- `window.onmessageerror`：`MessageError`事件的监听函数。
- `window.onoffline`：`offline`事件的监听函数。
- `window.ononline`：`online`事件的监听函数。
- `window.onpagehide`：`pagehide`事件的监听函数。
- `window.onpageshow`：`pageshow`事件的监听函数。
- `window.onpopstate`：`popstate`事件的监听函数。
- `window.onstorage`：`storage`事件的监听函数。
- `window.onunhandledrejection`：未处理的 Promise 对象的`reject`事件的监听函数。
- `window.onunload`：`unload`事件的监听函数。

## 多窗口操作

### 窗口引用

+ `top`：顶层窗口
+ `parent`：父窗口
+ `self`：当前窗口

特殊窗口名：

+ `_top`：顶层窗口
+ `_parent`：父窗口
+ `_blank`：新窗口

### iframe元素

可以使用`document.getElementById`获取iframe嵌入的窗口的DOM节点

使用`content.Window`属性获取iframe节点的`window`对象

```javascript
var frame = document.getElementById('frame');
var frameWindow = frame.contentWindow;
```

同源下就可以读取子窗口内部属性

```javascript
frameWindow.title;
frame.contentDocument;
//等同于
frame.contentWindow.document;
```

iframe窗口的`window`对象有一个`frameElement`属性，返回`<iframe>`在父窗口中的DOM节点

若无则返回`null`

### window.frames

返回类似数组的对象，成员为所有子窗口的`window`对象

==**==若iframe元素设置了`name`或者`id`属性，则属性会自动变为全局变量

```javascript
// HTML 代码为 <iframe id="myFrame">
window.myFrame // [HTMLIFrameElement]
```

且`name`属性会自动成为子窗口的名称





























