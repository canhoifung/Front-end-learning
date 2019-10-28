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

若页面已经解析完成，再调用`write`方法，会先调用`open`方法，再写入











































































