# Document节点

[TOC]



`document`节点对象代表了整个文档

不同的获取`document`节点方法：

- 正常的网页，直接使用`document`或`window.document`。
- `iframe`框架里面的网页，使用`iframe`节点的`contentDocument`属性。
- Ajax 操作返回的文档，使用`XMLHttpRequest`对象的`responseXML`属性。
- 内部节点的`ownerDocument`属性。

`document`对象继承了`EventTarget`接口、`Node`接口、`ParentNode`接口

## 属性

### 快捷方式属性

指向文档内部的某个节点的快捷方式

#### `document.defaultView`

返回`document`对象所属的`window`对象

若当前文档不属于`window`对象，则返回`null`

#### `document.doctype`

指向`<DOCTYPE>`节点，即文档类型节点

同时为`document`对象的第一个子节点

若无则返回`null`

```javascript
var doctype = document.doctype;
doctype // "<!DOCTYPE html>"
doctype.name // "html"
```

#### `document.documentElement`

返回当前文档的根元素节点

通常是`document`节点的第二个子节点

对HTML一般是`<html>`

#### `document.body`、`document.head`

分别指向`<body>`、`<head>`节点

且可写  如果改写它们的值相当于移除所有子节点

#### `document.scrollingElement`

返回文档的滚动元素，即当文档整体滚动时，到底是哪个元素在滚动

标准模式下，返回`document.documentElement`，即`<html>`

兼容模式下，返回`<body>`

若不存在，则返回`null`

#### `document.activeElement`

返回获得当前焦点的DOM元素

通常返回`<input>`、`<textarea>`、`<select>`等表单元素

若没有焦点元素，返回`<body>`或`null`

#### `document.fullscreenElement`

返回当前以全屏状态展示的DOM元素

若不是全凭状态，则返回`null`

```javascript
//判断是否全屏
if (document.fullscreenElement.nodeName == 'VIDEO') {
  console.log('全屏播放视频');
}
```

### 节点集合属性

会返回一个`HTMLColection`实例

动态的集合

#### `document.links`

返回当前文档所有设定了`href`属性的`<a>`和`<area>`节点

```javascript
// 打印文档所有的链接
var links = document.links;
for(var i = 0; i < links.length; i++) {
  console.log(links[i]);
}
```

#### `document.forms`

返回所有`<form>`表单节点

#### `document.images`

返回所有`<img>`图片节点

#### `document.embeds`，`document.plugins`

都返回所有`<embed>`节点

#### `document.scripts`

返回所有`<script>`节点

#### `document.styleSheets`

返回文档内嵌或引入的样式表的集合

#### 小结

除`document.styleSheets`外其余集合都是`HTMLCollection`实例

```javascript
document.links instanceof HTMLCollection // true
document.images instanceof HTMLCollection // true
document.forms instanceof HTMLCollection // true
document.embeds instanceof HTMLCollection // true
document.scripts instanceof HTMLCollection // true
```

### 文档静态信息属性

#### `document.documentURI`,`document.URL`

都返回一个字符串，表示当前文档的网址

但`documentURI`继承自`Document`的接口，可用于所有文档

`URL`继承自`HTMLDocument`接口，只能用于HTML文档

#### `document.domain`

返回当前文档的域名，不包含协议和端口

若无法获取域名则返回`null`

比如，网页的网址是`http://www.example.com:80/hello.html`，那么`document.domain`属性就等于`www.example.com`

`document.domain`基本上是一个只读属性，只有一种情况除外:

次级域名的网页，可以把`document.domain`设为对应的上级域名。比如，当前域名是`a.sub.example.com`，则`document.domain`属性可以设置为`sub.example.com`，也可以设为`example.com`。修改后，`document.domain`相同的两个网页，可以读取对方的资源，比如设置的 Cookie。

另外，设置`document.domain`会导致端口被改成`null`。因此，如果通过设置`document.domain`来进行通信，双方网页都必须设置这个值，才能保证端口相同。`

#### `document.location`

`Location`对象是浏览器提供的原生对象，提供URL相关的信息和操作方法

#### `document.lastModified`

返回一个字符串，表示当前文档最后修改的时间

不同浏览器的返回值不一样

> 由于是字符串，因此不能直接用于比较，可以使用`Date.parse`方法转为`Date`实例再比较

#### `document.title`

返回当前文档的标题

默认返回`<title>`节点的值

属性可写

```javascript
document.title = '新标题';
document.title // "新标题"
```

#### `document.characterSet`

返回当前文档的编码

如`UTF-8`，`ISO-8850-1`等

#### `document.referrer`

返回一个字符串，表示当前文档的访问者来自哪里

```javascript
document.referrer
// "https://example.com/path"
```

若无法获取来源或用户直接输入网址的，则会返回一个空字符串

#### `document.dir`

返回一个字符串，表示文字方向

`rtl`表示从右到左，阿拉伯文的顺序

`ltr`表示从左到右，大多数文字的顺序

#### `document.compatMode`

返回浏览器处理文档的模式：

+ `BackCompat`（向后兼容模式）
+ `CSS1Compat`（严格模式）

### 文档状态属性

#### `document.hidden`

返回一个布尔值，表示当前页面是否可见

若窗口最小化、浏览器切换了Tab，都会导致页面不可见，返回`true`

#### `document.visibilityState`

返回文档的可见状态：

- `visible`：页面可见。注意，页面可能是部分可见，即不是焦点窗口，前面被其他窗口部分挡住了。
- `hidden`：页面不可见，有可能窗口最小化，或者浏览器切换到了另一个 Tab。
- `prerender`：页面处于正在渲染状态，对于用户来说，该页面不可见。
- `unloaded`：页面从内存里面卸载了。

可以用于在页面加载时防止加载某些资源

或页面不可见时停掉一些页面功能

#### `document.readyState`

返回当前文档的状态：

+ `loading`：加载HTML代码阶段（尚未完成解析）
+ `interactive`：加载外部资源阶段
+ `complete`：加载完成

这个属性变化的过程如下：

1. 浏览器开始解析 HTML 文档，`document.readyState`属性等于`loading`。
2. 浏览器遇到 HTML 文档中的`<script>`元素，并且没有`async`或`defer`属性，就暂停解析，开始执行脚本，这时`document.readyState`属性还是等于`loading`。
3. HTML 文档解析完成，`document.readyState`属性变成`interactive`。
4. 浏览器等待图片、样式表、字体文件等外部资源加载完成，一旦全部加载完成，`document.readyState`属性变成`complete`。

```javascript
//检查页面是否加载成功

// 基本检查
if (document.readyState === 'complete') {
  // ...
}

// 轮询检查
var interval = setInterval(function() {
  if (document.readyState === 'complete') {
    clearInterval(interval);
    // ...
  }
}, 100);
```

每次状态变化都会触发一个`readystatechange`事件

#### `document.cookie`

用于操作浏览器Cookie

#### `document.designMode`

控制当前文档是否可编辑

只有两个值`on`、`off`，默认为`off`，若为`on`则用户可以编辑整个文档的内容

#### `document.implementation`

返回一个`DOMImplementation`对象，有三个方法，主要用于创建独立于当前文档的新Document对象：

- `DOMImplementation.createDocument()`：创建一个 XML 文档。
- `DOMImplementation.createHTMLDocument()`：创建一个 HTML 文档。
- `DOMImplementation.createDocumentType()`：创建一个 DocumentType 对象。

```javascript
var doc = document.implementation.createHTMLDocument('Title');
var p = doc.createElement('p');
p.innerHTML = 'hello world';
doc.body.appendChild(p);

document.replaceChild(
  doc.documentElement,
  document.documentElement
);
```

## 方法

### `document.open()`、`document.close()`

`document.open`方法清除当前文档所有内容，使文档处于可写状态，供`document.write`方法写入内容

`document.close`方法用于关闭`document.open()`打开的文档（停止`document.write`的输出流）

```javascript
document.open();
document.write('hello world');
document.close();
```

### `document.write()`，`document.writeIn()`

`document.write`用于向当前文档写入内容

只要页面没有执行`document.close()`，写入的内容就会追加在已有内容的后面

其中内容会被当作HTML代码解析，不会转义

若页面已经解析完成，再调用`write`方法，会先调用`open`方法，擦除当前文档所有内容，再写入

```javascript
document.addEventListener('DOMContentLoaded', function (event) {
  document.write('<p>Hello World!</p>');
});

// 等同于
document.addEventListener('DOMContentLoaded', function (event) {
  document.open();
  document.write('<p>Hello World!</p>');
  document.close();
});
```

若页面还在渲染过程中调用`write`方法，并不会自动调用`open`方法

```html
<html>
<body>
hello
<script type="text/javascript">
  document.write("world")
</script>
</body>
</html>
<!--会显示hello world-->
```

> 尽量避免使用这个方法

`document.writeln`与`write`方法一致，但会在输出内容的尾部添加换行符

```javascript
document.write(1);
document.write(2);
// 12

document.writeln(1);
document.writeln(2);
// 1
// 2
//
```

### `document.querySelector()`、`document.querySelectorAll()`

`document.querySelector`接收一个CSS选择器作为参数，返回匹配该选择器的元素节点

若有多个匹配结果则返回第一个匹配的节点，若无则返回`null`

`document.querySelectorAll`返回一个`NodeList`对象，包含所有匹配的节点

> 不支持CSS伪元素的选择器和伪类的选择器

不是动态集合

```javascript
var el1 = document.querySelector('.myclass');
var el2 = document.querySelector('#myParent > [ng-click]');
elementList = document.querySelectorAll('.myclass');
```

==*==可以用于元素节点上

### `document.getElementsByTagName()`

搜索HTML标签名，返回符合条件的元素

返回值为HTMLCollection实例，可以实时反应HTML文档的变化

若没有匹配的元素则返回一个空集

```javascript
var paras = document.getElementsByTagName('p');
paras instanceof HTMLCollection // true
```

传入`*`可以返回文档中所有HTML元素

==*==可以用于元素节点上

```javascript
var firstPara = document.getElementsByTagName('p')[0];
var spans = firstPara.getElementsByTagName('span');
```

### `document.getElementsByClassName()`

返回HTMLCollection实例，包含所有`class`名字符合制定条件的元素

实时反映

可以使用空格分隔，表示匹配具有多个`class`的元素

```javascript
var elements = document.getElementsByClassName('foo bar');
```

==*==可以用于元素节点上

### `document.getElementsByName()`

用于选择拥有`name`属性的 HTML 元素

比如`<form>`、`<radio>`、`<img>`、`<frame>`、`<embed>`和`<object>`等

返回一个``NodeList`实例，因为`name`属性相同的元素可能不止一个

### `document.getElementById()`

返回匹配指定`id`属性的元素节点

若无则返回`null`

==**==只能在`document`对象上使用

### `document.elementFromPoint()`、`document.elementsFromPoint()`

`document.elementsFromPoint()`返回位于页面指定位置最上层的元素节点

```javascript
var element = document.elementFromPoint(50, 50);
```

上面代码选中在`(50, 50)`这个坐标位置的最上层的那个 HTML 元素。

`elementFromPoint`方法的两个参数，依次是相对于当前视口左上角的横坐标和纵坐标，单位是像素。如果位于该位置的 HTML 元素不可返回（比如文本框的滚动条），则返回它的父元素（比如文本框）。如果坐标值无意义（比如负值或超过视口大小），则返回`null`。

`document.elementsFromPoint()`返回一个数组，成员是位于指定坐标（相对于视口）的所有元素。

```javascript
var elements = document.elementsFromPoint(x, y);
```

### `document.createElement()`

用于生成元素节点，并返回该节点

参数为元素的标签名

==*==不能包含尖括号，会报错

```javascript
document.createElement('<div>');
// DOMException: The tag name provided ('<div>') is not a valid name
```

可以是自定义的标签名

```javascript
document.createElement('foo');
```

### `document.createTextNode()`

用于生成文本节点（`Text`实例），并返回该节点

参数为文本节点的内容

```javascript
var newDiv = document.createElement('div');
var newContent = document.createTextNode('Hello');
newDiv.appendChild(newContent);
```

> 可以确保返回的节点被浏览器当作文本渲染，而不是当作HTML代码渲染
>
> 可以用于展示用户的输入内容，即使其包含恶意代码也会被转义

```javascript
var div = document.createElement('div');
div.appendChild(document.createTextNode('<span>Foo & bar</span>'));
console.log(div.innerHTML)
// &lt;span&gt;Foo &amp; bar&lt;/span&gt;
```

### `document.createAttribute()`

生成一个新的属性节点（`Attr`实例），并返回它

参数为属性的名称

```javascript
var node = document.getElementById('div1');

var a = document.createAttribute('my_attrib');
a.value = 'newVal';

node.setAttributeNode(a);
// 或者
node.setAttribute('my_attrib', 'newVal');
```

### `document.createComment()`

生成一个新的注释节点，并返回该节点

参数为一个字符串，会称为注释节点的内容

### `document.createDocumentFragment()`

生成一个空的文档片段对象（`DocumentFragment`实例）

为一个存在于内存的DOM片段，不属于当前文档，用于生成一段较复杂的DOM结构，然后再插入当前文档

```javascript
var docfrag = document.createDocumentFragment();

[1, 2, 3, 4].forEach(function (e) {
  var li = document.createElement('li');
  li.textContent = e;
  docfrag.appendChild(li);
});

var element  = document.getElementById('ul');
element.appendChild(docfrag);
```

### `document.createEvent()`

生成一个事件对象（`Event`实例），可以被`element.dispatchEvent`方法使用，触发指定事件

```javascript
var event = document.createEvent(type);
```

参数为事件类型，比如：

+ `UIEvents`
+ `MouseEvents`
+ `MutationEvents`
+ `HTMLEvents`

```javascript
var event = document.createEvent('Event');
event.initEvent('build', true, true);
document.addEventListener('build', function (e) {
  console.log(e.type); // "build"
}, false);
document.dispatchEvent(event);
```

### `document.addEventListener()`、`document.removeEventListener()`、`document.dispatchEvent()`

用于处理`document`节点的事件

继承自`EventTarget`接口

```javascript
// 添加事件监听函数
document.addEventListener('click', listener, false);

// 移除事件监听函数
document.removeEventListener('click', listener, false);

// 触发事件
var event = new Event('click');
document.dispatchEvent(event);
```

### `document.hasFocus()`

返回一个布尔值，表示当前文档是否有元素被激活或获得焦点

> 有焦点的文档必定被激活
>
> 激活的文档不一定有焦点

### `document.adoptNode()`、`document.importNode()`

`document.adoptNode`将某个节点及其子节点，从原来所在的文档或`DocumentFragment`里移除，归属到当前的`document`对象

返回插入后的新节点

插入的节点对象的`ownerDocument`属性，会变成当前的`document`对象，而`parentNode`属性是`null`

```javascript
var node = document.adoptNode(externalNode);
document.appendChild(node);
```

> 只是归属，而没有插入当前文档树

`document.importNode`从原来所在的文档或`DocumentFragment`里面，拷贝某个节点及其子节点，让它们归属当前`document`对象

拷贝的节点对象的`ownerDocument`属性，会变成当前的`document`对象，而`parentNode`属性是`null`。

```javascript
var node = document.importNode(externalNode, deep);
```

第一个参数为外部节点

第二个参数为布尔值，表示对外部节点是深拷贝还是浅拷贝，默认浅拷贝（false）

> 只是拷贝，没有插入当前文档树

```javascript
var iframe = document.getElementsByTagName('iframe')[0];
var oldNode = iframe.contentWindow.document.getElementById('myNode');
var newNode = document.importNode(oldNode, true);
document.getElementById("container").appendChild(newNode);
```

### `document.createNodeIterator()`

返回一个子节点遍历器对象（`NodeFilter`实例）

```javascript
var nodeIterator = document.createNodeIterator(
  document.body,
  NodeFilter.SHOW_ELEMENT
);
```

第一个参数为所要遍历的根节点

第二个参数为所要遍历的节点类型

节点类型写法：

- 所有节点：NodeFilter.SHOW_ALL
- 元素节点：NodeFilter.SHOW_ELEMENT
- 文本节点：NodeFilter.SHOW_TEXT
- 评论节点：NodeFilter.SHOW_COMMENT

由于为`NodeFilter`实例，拥有`nextNode()`和`previousNode()`方法，用于遍历子节点

```javascript
var nodeIterator = document.createNodeIterator(document.body);
var pars = [];
var currentNode;

while (currentNode = nodeIterator.nextNode()) {
  pars.push(currentNode);
}
```

`nextNode`方法先返回遍历器的内部指针所在的节点，然后会将指针移向下一个节点。所有成员遍历完成后，返回`null`

`previousNode`方法则是先将指针移向上一个节点，然后返回该节点。

```javascript
var nodeIterator = document.createNodeIterator(
  document.body,
  NodeFilter.SHOW_ELEMENT
);

var currentNode = nodeIterator.nextNode();//返回body然后指向下一个节点
var previousNode = nodeIterator.previousNode();//从 ‘下一个节点’往上移动，到body，然后返回body

currentNode === previousNode // true
```

==*==遍历器返回的第一个节点，总是根节点

```javascript
pars[0] === document.body // true
```

### `document.createTreeWalker()`

返回一个DOM的子树遍历器（`TreeWalker`实例)

与`document.createNodeIterator`方法类似

第一个节点不是根节点

第一个参数为要遍历的根节点

第二个参数指定所要遍历的节点类型

```javascript
var treeWalker = document.createTreeWalker(
  document.body,
  NodeFilter.SHOW_ELEMENT
);

var nodeList = [];

while(treeWalker.nextNode()) {
  nodeList.push(treeWalker.currentNode);
}
```

### `document.execCommand()`、`document.queryCommandSupported`、`document.queryCommandEnabled()`

#### `document.execCommand()`

如果`document.designMode`属性设为`on`，那么整个文档用户可编辑；

如果元素的`contenteditable`属性设为`true`，那么该元素可编辑。

这两种情况下，可以使用`document.execCommand()`方法，改变内容的样式，比如`document.execCommand('bold')`会使得字体加粗。

```javascript
document.execCommand(command, showDefaultUI, input)
```

三个参数：

- `command`：字符串，表示所要实施的样式。
- `showDefaultUI`：布尔值，表示是否要使用默认的用户界面，建议总是设为`false`。
- `input`：字符串，表示该样式的辅助内容，比如生成超级链接时，这个参数就是所要链接的网址。如果第二个参数设为`true`，那么浏览器会弹出提示框，要求用户在提示框输入该参数。但是，不是所有浏览器都支持这样做，为了兼容性，还是需要自己部署获取这个参数的方式。

```javascript
var url = window.prompt('请输入网址');

if (url) {
  document.execCommand('createlink', false, url);
}
```

返回一个布尔值，若为`false`，表示方法无法生效

大部分情况只对选中的元素生效

可执行的样式改变：

bold、insertLineBreak、selectAll、createLink、insertOrderedList、subscript、delete、insertUnorderedList、superscript、formatBlock、insertParagraph、undo、forwardDelete、insertText、unlink、insertImage、italic、unselect、insertHTML、redo

#### `document.queryCommandSupported()`

返回一个布尔值，表示浏览器是否支持`document.execCommand()`的某个命令

```javascript
if (document.queryCommandSupported('SelectAll')) {
  console.log('浏览器支持选中可编辑区域的所有内容');
}
```

#### `document.queryCommandEnabled()`

返回一个布尔值，表示当前是否可用`document.execCommand()`的某个命令

```javascript
// HTML 代码为
// <input type="button" value="Copy" onclick="doCopy()">

function doCopy(){
  // 浏览器是否支持 copy 命令（选中内容复制到剪贴板）
  if (document.queryCommandSupported('copy')) {
    copyText('你好');
  }else{
    console.log('浏览器不支持');
  }
}

function copyText(text) {
  var input = document.createElement('textarea');
  document.body.appendChild(input);
  input.value = text;
  input.focus();
  input.select();

  // 当前是否有选中文字
  if (document.queryCommandEnabled('copy')) {
    var success = document.execCommand('copy');
    input.remove();
    console.log('Copy Ok');
  } else {
    console.log('queryCommandEnabled is false');
  }
}
```

### `document.getSelection()`

指向`window.getSelection()`



















































