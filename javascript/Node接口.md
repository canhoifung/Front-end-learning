# Node接口

[TOC]

## 属性

### `Node.prototype.nodeType`

不同节点的`nodeType`属性值和对应的常量如下。

- 文档节点（document）：9，对应常量`Node.DOCUMENT_NODE`
- 元素节点（element）：1，对应常量`Node.ELEMENT_NODE`
- 属性节点（attr）：2，对应常量`Node.ATTRIBUTE_NODE`
- 文本节点（text）：3，对应常量`Node.TEXT_NODE`
- 文档片断节点（DocumentFragment）：11，对应常量`Node.DOCUMENT_FRAGMENT_NODE`
- 文档类型节点（DocumentType）：10，对应常量`Node.DOCUMENT_TYPE_NODE`
- 注释节点（Comment）：8，对应常量`Node.COMMENT_NODE`

确定节点类型时，使用`nodeType`属性是常用方法。

```javascript
var node = document.documentElement.firstChild;
if (node.nodeType === Node.ELEMENT_NODE) {
  console.log('该节点是元素节点');
}
```

### `Node.prototype.nodeName`

返回节点的名称

```javascript
// HTML 代码如下
// <div id="d1">hello world</div>
var div = document.getElementById('d1');
div.nodeName // "DIV"
```

不同节点的`nodeName`属性值：

- 文档节点（document）：`#document`
- 元素节点（element）：大写的标签名
- 属性节点（attr）：属性的名称
- 文本节点（text）：`#text`
- 文档片断节点（DocumentFragment）：`#document-fragment`
- 文档类型节点（DocumentType）：文档的类型
- 注释节点（Comment）：`#comment`

### `Node.prototype.nodeValue`

返回一个字符串，表示当前节点本身的文本值

可读写

只有：

+ 文本节点（text）
+ 注释节点（comment）
+ 属性节点（attr）

有文本值，其余均返回`null`

同样只有这三个可以设置`nodeValue`的值，其余节点设置无效

```javascript
// HTML 代码如下
// <div id="d1">hello world</div>
var div = document.getElementById('d1');
div.nodeValue // null
div.firstChild.nodeValue // "hello world"
```

### `Node.prototype.textContent`

返回当前节点和它的所有后代节点的文本内容

```javascript
// HTML 代码为
// <div id="divA">This is <span>some</span> text</div>

document.getElementById('divA').textContent
// This is some text
```

会自动忽略当前节点内部的HTML标签，只返回文本内容

对于：

+ 文本节点
+ 注释节点
+ 属性节点

`textContent`值与`nodeValue`属性相同

对于其它类型的节点，会将其每个子节点（不含注释节点）的内容连接在一起返回

若没有子节点，则返回空字符串

+ 文档节点（document）
+ 文档类型节点（doctype）

这两个的`textContent`属性为`null`

### `Node.prototype.baseURI`

返回一个字符串，表示当前页面的绝对路径

浏览器会根据这个属性计算网页上的绝对路径的URL，只读

无法读取网页URL则返回`null`

若设置了HTML的`<base>`标签，则`baseURI`返回`<base>`标签内的值

```html
<base href = 'http://www.example.com/page.html'>
```

### `Node.prototype.ownerDocument`

返回当前节点所在的顶层文档对象，即`document`对象

`document`对象本身的`ownerDocument`属性返回`null`

```javascript
var d = p.ownerDocument;
d === document // true
```

### `Node.prototype.nextSibling`

返回紧跟在当前节点后面的第一个同级节点，若无则返回`null`

```javascript
// HTML 代码如下
// <div id="d1">hello</div><div id="d2">world</div>
var d1 = document.getElementById('d1');
var d2 = document.getElementById('d2');

d1.nextSibling === d2 // true
```

==**==属性还会包括文本节点和注释节点（`<!-- comment -->`）。因此若当前节点后面后空格，会返回一个文本节点，内容为空格

遍历所有子节点：

```javascript
var el = document.getElementById('div1').firstChild;

while (el !== null) {
  console.log(el.nodeName);
  el = el.nextSibling;
}
```

### `Node.prototype.previousSibling`

返回当前节点前面的、距离最近的一个同级节点，若无则返回`null`

```javascript
// HTML 代码如下
// <div id="d1">hello</div><div id="d2">world</div>
var d1 = document.getElementById('d1');
var d2 = document.getElementById('d2');

d2.previousSibling === d1 // true
```

==**==属性还会包括文本节点和注释节点（`<!-- comment -->`）。因此若当前节点后面后空格，会返回一个文本节点，内容为空格

### `Node.prototype.parentNode`

返回当前节点的父节点

三种类型之一：

+ 元素节点
+ 文档节点
+ 文档片段节点

文档节点与文档片段节点的父节点都是`null`

生成后还未插入DOM树的节点，其父节点也是`null`

### `Node.prototype.parentElement`

返回当前节点的父元素节点，若无或父节点不是元素节点则返回`null`

父节点为三种类型之一：

- 元素节点
- 文档节点
- 文档片段节点

`parentElement`只判断元素节点

### `Node.prototype.firstChild`、`Node.prototype.lastChild`

`firstChild`返回当前节点的第一个子节点，若无则返回`null`

`lastChild`返回当前节点的最后一个子节点，若无则返回`null`

> 会返回元素节点、文本节点或注释节点

```javascript
// HTML 代码如下
// <p id="p1"><span>First span</span></p>
var p1 = document.getElementById('p1');
p1.firstChild.nodeName // "SPAN"
```

```javascript
// HTML 代码如下
// <p id="p1">
//   <span>First span</span>
//  </p>
var p1 = document.getElementById('p1');
p1.firstChild.nodeName // "#text"
```

上面由于`p`和`span`之间有空白字符，所以返回了文本节点

### `Node.prototype.childNodes`

返回一个类似数组的对象（`NodeList`集合），包括当前节点的所有子节点

```javascript
var div = document.getElementById('div1');
var children = div.childNodes;

for (var i = 0; i < children.length; i++) {
  // ...
}
```

==*==文档节点只有两个子节点：文档类型节点和HTML根元素节点

```javascript
var children = document.childNodes;
for (var i = 0; i < children.length; i++) {
  console.log(children[i].nodeType);
}
// 10
// 1
```

同样会返回文本节点和注释节点

==*==`NodeList`对象是一个动态集合，若子节点发生变化，会立刻反映在返回结果中

### `Node.prototype.isConnected`

返回一个布尔值，表示当前节点是否在文档中

```javascript
var test = document.createElement('p');
test.isConnected // false

document.body.appendChild(test);
test.isConnected // true
```

## 方法

### `Node.prototype.appendChild()`

接收一个节点对象作为参数，将其作为最后一个子节点，插入当前节点

返回值为插入文档的子节点

```javascript
var p = document.createElement('p');
document.body.appendChild(p);
```

若参数节点是已经存在的节点，会将其从原来的位置移动到新位置

> 如果`appendChild()`方法的参数是`DocumentFragment`节点，那么插入的是`DocumentFragment`的所有子节点，而不是`DocumentFragment`节点本身。返回值是一个空的`DocumentFragment`节点。

### `Node.prototype.hasChildNodes()`

返回一个布尔值，表示当前节点是否有子节点（包含所有类型的节点）

```javascript
var foo = document.getElementById('foo');

if (foo.hasChildNodes()) {
  foo.removeChild(foo.childNodes[0]);
}
```

判断子节点的方法：

+ `node.hasChildNodes()`
+ `node.firstChild !== null`
+ `node.childNodes && node.childNodes.length > 0`

### `Node.prototype.cloneNode()`

用于克隆一个几点，接收一个布尔值作为参数，表示是否同时克隆子节点

返回一个克隆出来的新节点

```javascript
var cloneUL = document.querySelector('ul').cloneNode(true);
```

注意点：

1. 克隆一个节点，会拷贝该节点的所有属性，但是会丧失`addEventListener`方法和`on-`属性（即`node.onclick = fn`），添加在这个节点上的事件回调函数。
2. 该方法返回的节点不在文档之中，即没有任何父节点，必须使用诸如`Node.appendChild`这样的方法添加到文档之中。
3. 克隆一个节点之后，DOM 有可能出现两个有相同`id`属性（即`id="xxx"`）的网页元素，这时应该修改其中一个元素的`id`属性。如果原节点有`name`属性，可能也需要修改。

### `Node.prototype.insertBefore()`

将某个节点插入父节点内部的指定位置

```javascript
var insertedNode = parentNode.insertBefore(newNode, referenceNode);
```

+ `newNode`：要插入的节点
+ `referenceNode`：父节点`parentNode`内部的一个子节点，若为`null`，则将新节点插入到当前节点内部的最后位置，变为最后一个子节点

返回插入的新节点`newNode`

```javascript
var p = document.createElement('p');
document.body.insertBefore(p, document.body.firstChild);
```

==*==不存在`insertAfter`方法，可以用这个实现：

```javascript
parent.insertBefore(s1, s2.nextSibling);
```

### `Node.prototype.removeChild()`





































































