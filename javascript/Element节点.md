# Element 节点

[TOC]

每一个HTML元素，在DOM树上都会转化为一个Element节点对象

`Element`对象继承了`Node`接口，因此可以使用`Node`的属性和方法

由于不同的元素节点是由不同的构造函数生成，因此元素节点是一组对象，其继承了`Element`的属性和方法以及构造函数的属性和方法

> 如`<a>`节点由`HTMLAnchorElement`构造函数生成，
>
> `<button>`由`HTMLButtonElement`构造函数生成

## 实例属性

### 元素特性的相关属性

#### `Element.id`

返回指定元素的`id`属性，可读写

==大小写敏感==

#### `Element.tagName`

返回指定元素的大写标签名，与`nodeName`属性值相等

#### `Element.dir`

用于读写当前元素的文字方向

`"ltr"`：从左到右

`"rtl"`：从右到左

#### `Element.accessKey`

用于读写分配给当前元素的快捷键

```javascript
// HTML 代码如下
// <button accesskey="h" id="btn">点击</button>
var btn = document.getElementById('btn');
btn.accessKey // "h"
```

对于`btn`元素  可以按下 `Alt+h`聚焦

#### `Element.draggable`

返回一个布尔值，表示当前元素是否可拖动

可读写

#### `Element.lang`

返回当前元素的语言设置

可读写

```javascript
// HTML 代码如下
// <html lang="en">
document.documentElement.lang // "en"
```

#### `Element.taIndex`

返回一个整数，表示当前元素在Tab键遍历时的顺序

可读写

若为负值，则表示Tab键不会遍历到该元素

若为正整数，且相同，则按照出现的顺序遍历

遍历顺序：

1. 从小到大遍历`tabIndex`为正整数的元素
2. 按出现顺序遍历所有`tabIndex`为0、非法值、没有设置`tabIndex`属性的元素

#### `Element.title`

用于读写当前元素的HTML属性`title`

用于指定鼠标悬浮时弹出的文字提示框

```html
<abbr title="People's Republic of China">PRC</abbr> was founded in 1949.
<p title="Free Web tutorials">W3School.com.cn</p>
```

### 元素状态的相关属性

#### `Element.hidden`

返回一个布尔值，表示当前元素的`hidden`属性，用于控制当前元素是否可见

可读写

==*==与CSS设置互相独立，且CSS设置高于`Element.hidden`

即CSS指定了该元素的`display`属性，则`Element.hidden`就不能改变该元素实际的可见性

#### `Element.contentEditable`，`Element.isContentEditable`

若具有`contentEditable`属性，则元素内容可编辑（可在页面上编辑）

`Element.contentEditable`返回一个字符串，表示是否设置了`contentEditable`属性：

1. `true`：元素内容可编辑
2. `false`：元素内容不可编辑
3. `inherit`：元素是否可编辑，继承父元素的设置

==*==可写

`Element.isContentEditable`返回一个布尔值，同样表示是否设置了`contentEditable`属性，但==*==只读

### `Element.attributes`

返回一个类似数组的对象，成员为当前元素节点的所有属性节点

### `Element.className`,`Element.classList`

`className`用于读写当前元素节点的`class`属性

每个`class`之间用空格分割

`classList`返回一个类似数组的对象，成员为当前元素节点的`class`

```javascript
// HTML 代码 <div class="one two three" id="myDiv"></div>
var div = document.getElementById('myDiv');

div.className
// "one two three"

div.classList
// {
//   0: "one"
//   1: "two"
//   2: "three"
//   length: 3
// }
```

`classList`对象具有的方法：

- `add()`：增加一个 class。
- `remove()`：移除一个 class。
- `contains()`：检查当前元素是否包含某个 class。
- `toggle()`：将某个 class 移入或移出当前元素。
- `item()`：返回指定索引位置的 class。
- `toString()`：将 class 的列表转为字符串。

```javascript
var div = document.getElementById('myDiv');

div.classList.add('myCssClass');
div.classList.add('foo', 'bar');
div.classList.remove('myCssClass');
div.classList.toggle('myCssClass'); // 如果 myCssClass 不存在就加入，否则移除
div.classList.contains('myCssClass'); // 返回 true 或者 false
div.classList.item(0); // 返回第一个 Class
div.classList.toString();
```

两者在添加或删除某个class时：

```javascript
var foo = document.getElementById('foo');

// 添加class
foo.className += 'bold';
foo.classList.add('bold');

// 删除class
foo.classList.remove('bold');
foo.className = foo.className.replace(/^bold$/, '');
```

### `Element.dataset`

返回一个对象，可从这个对象读写`data-`属性

> 网页元素可以自定义`data-`属性，用于添加数据
>
> ```html
> <div data-timestamp = '11'></div>
> ```

```javascript
// <article
//   id="foo"
//   data-columns="3"
//   data-index-number="12314"
//   data-parent="cars">
//   ...
// </article>
var article = document.getElementById('foo');
article.dataset.columns // "3"
article.dataset.indexNumber // "12314"
article.dataset.parent // "cars"
```

`data-`的属性名，只能是包含：

+ 英文
+ 数字
+ 连词线 `-`
+ 点 `.`
+ 冒号 `:`
+ 下划线 `_`

在JS中转化为对应的`dataset`属性名的规则：

- 开头的`data-`会省略。
- 如果连词线后面跟了一个英文字母，那么连词线会取消，该字母变成大写。
- 其他字符不变。

例如：

`data-abc-def`对应`dataset.abcDef`，`data-abc-1`对应`dataset["abc-1"]`。



>也可以使用`Element.getAttribute()`和`Element.setAttribute()`，通过完整的属性名读写这些属性。
>
>```javascript
>var mydiv = document.getElementById('mydiv');
>
>mydiv.dataset.foo = 'bar';
>mydiv.getAttribute('data-foo') // "bar"
>```

### `Element.innerHTML`、`Element.innerText`、`Element.textContent`

`Element.innerHTML`：返回一个字符串，等同于该元素包含的所有HTML代码

可读写

能改写所有元素节点的内容 包括`<HTML>`和`<body>`

但是遇到符号等会将其转为实体形式：

```javascript
// HTML代码如下 <p id="para"> 5 > 3 </p>
document.getElementById('para').innerHTML
// 5 &gt; 3
```

其余两个返回纯文本的字符串，不包含标签等内容

### `Element.outerHTML`

返回一个字符串，表示当前元素节点的所有HTML代码，包括该元素本身和所有子元素

可读写

```javascript
// HTML 代码如下
// <div id="d"><p>Hello</p></div>
var d = document.getElementById('d');
d.outerHTML
// '<div id="d"><p>Hello</p></div>'
```

 ==*==如果节点没有父节点，设置`outerHTML`属性会报错

例如刚创建的元素：

```javascript
var div = document.createElement('div');
div.outerHTML = '<p>test</p>';
// DOMException: This element has no parent node.
```

### `Element.clientHeight`、`Element.clientWidth`

返回一个整数值，表示元素节点的CSS宽高（单位像素）

只对块级元素生效，对于行内元素都返回0

宽高包括了`padding`，但不包括`border`和`margin`，若有滚动条，还会减去滚动条宽高

始终为整数，小数会四舍五入



`document.documentElement.clientHeight`：返回当前浏览器窗口的高度，等同于`window.innerHeight`减去水平滚动条的高度

`document.body.clientHeight`：网页的实际高度（即整个页面的高度）

一般`document.body.clientHeight`>`document.documentElement.clientHeight`

### `Element.scrollHeight`、`Element.scrollWidth`

返回一个整数值（小数四舍五入），表示当前元素的总宽高

包括了溢出容器、当前不可见的部分

包括了`padding`，不包括`border`和`margin`，若有滚动条，还会减去滚动条宽高

```javascript
// 返回网页的总高度
document.documentElement.scrollHeight
document.body.scrollHeight
document.documentElemnt.scrollHeight == document.body.scrollHeight //true
```

### `Element.scrollLeft`、`Element.scrollTop`

`scrollLeft`：表示当前元素的水平滚动条向右侧滚动的像素数量

`scrollTop`：表示当前元素的垂直滚动条向下滚动的像素数量

可读写

若元素没有滚动条，则为0

```javascript
//查看整张网页的水平的和垂直的滚动距离
document.documentElement.scrollLeft
document.documentElement.scrollTop
```

### `Element.offsetParent`

返回

+ 最靠近当前元素的
+ CSS的`position`属性不等于`static`的上层元素

```html
<div style="position: absolute;">
  <p>
    <span>Hello</span>
  </p>
</div>
```

`span`元素的`offsetParent`属性为`div`元素

主要用于确定子元素位置偏移的计算准则，为`Element.offsetTop`和`Element.offsetLeft`提供标准值

若元素为`display:none`或`position:fixed`，则返回`null`





























































































