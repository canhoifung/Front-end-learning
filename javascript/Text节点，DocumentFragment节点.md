# Text节点和DocumentFragment节点

[TOC]

## 文本节点

仅包含文本内容

通常使用父节点的`firstChild`、`nextSibling`等属性获取文本节点，或者使用`Document`节点的`createTextNode`方法创造一个文本节点。

``` javascript
// 获取文本节点
var textNode = document.querySelector('p').firstChild;

// 创造文本节点
var textNode = document.createTextNode('Hi');
document.querySelector('div').appendChild(textNode);
```

浏览器原生提供一个`Text`构造函数，返回一个文本节点实例

```javascript
// 空字符串
var text1 = new Text();

// 非空字符串
var text2 = new Text('This is a text node');
```

文本节点继承了`Node`接口和`CharacterData`接口

## Text节点属性

### `data`

等同于`nodeValue`属性，用于设置或读取文本节点的内容

```JavaScript
// 读取文本内容
document.querySelector('p').firstChild.data
// 等同于
document.querySelector('p').firstChild.nodeValue

// 设置文本内容
document.querySelector('p').firstChild.data = 'Hello World';
```

### `wholeText`

将当前文本节点与毗邻的文本节点作为一个整体返回（中间没有其他节点）

大多数情况下，`wholeText`的返回值与`data`属性与`textContent`属性相同

```html
<p id='para'>
    A <em>B</em> C
</p>
```

```javascript
var el = document.getElementById('para');
el.firstChild.wholeText // "A "
el.firstChild.data // "A "
```

但若

```javascript
el.removeChild(para.childNodes[1]);//去除<em>节点
el.firstChild.wholeText // "A C"
el.firstChild.data // "A "
```

### `length`

返回当前文本节点的文本长度

### `nextElementSibling`，`previousElementSibling`

`nextElementSibling`返回紧跟在当前文本节点后面的同级元素节点

若取不到则返回`null`

`previousElementSibling`返回当前文本节点前面最近的同级元素节点

## Text节点的方法

### `appendData()`，``deleteData()``，``insertData()``，`replaceData()`，`subStringData()`

- `appendData()`：在`Text`节点尾部追加字符串。
- `deleteData()`：删除`Text`节点内部的子字符串，第一个参数为子字符串开始位置，第二个参数为子字符串长度。
- `insertData()`：在`Text`节点插入字符串，第一个参数为插入位置，第二个参数为插入的子字符串。
- `replaceData()`：用于替换文本，第一个参数为替换开始位置，第二个参数为需要被替换掉的长度，第三个参数为新加入的字符串。
- `subStringData()`：用于获取子字符串，第一个参数为子字符串在`Text`节点中的开始位置，第二个参数为子字符串长度。

```javascript
// HTML 代码为
// <p>Hello World</p>
var pElementText = document.querySelector('p').firstChild;

pElementText.appendData('!');
// 页面显示 Hello World!
pElementText.deleteData(7, 5);
// 页面显示 Hello W
pElementText.insertData(7, 'Hello ');
// 页面显示 Hello WHello
pElementText.replaceData(7, 5, 'World');
// 页面显示 Hello WWorld
pElementText.substringData(7, 10);
// 页面显示不变，返回"World "
```

### `remove()`

移除当前的Text节点

### `splitText()`

将Text节点一分为二，变成两个毗邻的Text节点

参数为分割位置，分割到该位置的字符前结束

若分割位置不存在，则报错

返回分割位置后方的字符串

原字符串变为分割位置前方的字符串

```javascript
// html 代码为 <p id="p">foobar</p>
var p = document.getElementById('p');
var textnode = p.firstChild;

var newText = textnode.splitText(3);
newText // "bar"
textnode // "foo"
```

父元素节点可以使用`normalize`方法将毗邻的两个Text节点合并

```javascript
p.childNodes.length // 2

// 将毗邻的两个 Text 节点合并
p.normalize();
p.childNodes.length // 1
```

## DocumentFragment节点

代表一个文档的片段，本身就是一个完整的DOM树形结构

没有父节点，`parentNode`返回`null`

可插入任意数量的节点

不属于当前文档

```javascript
var docFrag = document.createDocumentFragment();
// 等同于
var docFrag = new DocumentFragment();

var li = document.createElement('li');
li.textContent = 'Hello World';
docFrag.appendChild(li);

document.querySelector('ul').appendChild(docFrag);
```

> `DocumentFragment`节点本身不能被插入当前文档。当它作为`appendChild()`、`insertBefore()`、`replaceChild()`等方法的参数时，是它的所有子节点插入当前文档，而不是它自身。
>
> 一旦`DocumentFragment`节点被添加进当前文档，它自身就变成了空节点（`textContent`属性为空字符串），可以被再次使用。如果想要保存`DocumentFragment`节点的内容，可以使用`cloneNode`方法。

```javascript
document
	.querySelector('ul')
	.appendChild(docFrag.cloneNode(true));
```



`DocumentFragment`节点对象的属性和方法继承自`Node`节点和`ParentNode`接口，即比`Node`节点多出以下四个属性：

- `children`：返回一个动态的`HTMLCollection`集合对象，包括当前`DocumentFragment`对象的所有子元素节点。
- `firstElementChild`：返回当前`DocumentFragment`对象的第一个子元素节点，如果没有则返回`null`。
- `lastElementChild`：返回当前`DocumentFragment`对象的最后一个子元素节点，如果没有则返回`null`。
- `childElementCount`：返回当前`DocumentFragment`对象的所有子元素数量。

 





















