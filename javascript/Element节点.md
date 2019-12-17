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

> 若所有上层节点的`position:static`，则指向`<body>`元素

### `Element.offsetHeight`、`Element.offsetWidth`

返回一个整数，表示元素的CSS垂直高度/水平宽度

包括了元素本身的高度、`padding`、`border`，以及滚动条的宽高

只读

与`Element.clientHetight`、`Element.clientWidth`多了`border`的宽高

若元素设为`display:none`，则返回0

### `Element.offsetLeft`、`Element.offsetTop`

返回当前元素左上角相对于`Element.offsetParent`节点的水平/垂直位移

通常指相对于父节点的位移

```javascript
//计算元素左上角相对于整张网页的坐标
function getElementPosition(e) {
  var x = 0;
  var y = 0;
  while (e !== null)  {
    x += e.offsetLeft;
    y += e.offsetTop;
    e = e.offsetParent;
  }
  return {x: x, y: y};
}
```

### `Element.style`

用于读写该元素的行内样式信息

### `Element.children`、`Element.childElementCount`

`Element.children`返回一个类似数组的对象（`HTMLCollection`实例），包含当前元素节点的所有子元素

若无则返回对象包含0个成员

==*==与`Node.childNodes`区别为只包括了元素类型的子节点



`Element.childElementCount`则返回当前元素节点包含的子元素节点的个数，相当于`Element.children.length`

### `Element.firstElementChild`、`Element.lastElementChild`

字面意思

### `Element.nexeElementSibling`、`Element.previousElementSibling`

返回当前元素节点的后一个/前一个  同级元素节点，若无则返回`null`

## 实例方法

### 属性相关方法

用于操作属性的方法：

- `getAttribute()`：读取某个属性的值
- `getAttributeNames()`：返回当前元素的所有属性名
- `setAttribute()`：写入属性值
- `hasAttribute()`：某个属性是否存在
- `hasAttributes()`：当前元素是否有属性
- `removeAttribute()`：删除属性

### `Element.quertSelector()`

接收CSS选择器作为参数，返回父元素第一个匹配的子元素

若无则返回`null`

==*==无法选中伪类元素

可接收多个选择器，用逗号分割

可接收任何复杂的CSS选择器

> 执行该方法时，会先在全局范围内搜索给定的CSS选择器，然后过滤出当前元素的子元素

```html
<div>
<blockquote id="outer">
  <p>Hello</p>
  <div id="inner">
    <p>World</p>
  </div>
</blockquote>
</div>
```

但是返回的是第一个`p`元素

```javascript
var outer = document.getElementById('outer');
outer.querySelector('div p')
// <p>Hello</p>
```

> 此处是因为全局搜索  过滤全局范围内的div下的p元素  而第一个p元素刚好符合条件且在outer下 

### `Element.querySelectorAll()`

返回一个`NodeList`实例，包含所有匹配的子元素

若有伪元素的选择器，则总是返回一个空的`NodeList`实例

其余操作与`Element.querySelector()`一样

### `Element.getElementsByClassName()`

返回一个`HTMLCollection`实例，成员为当前元素节点的所有具有指定class的子元素节点

活集合，对象变化会反应到实例中

```javascript
// HTML 代码如下
// <div id="example">
//   <p class="foo"></p>
//   <p class="foo"></p>
// </div>
var element = document.getElementById('example');
var matches = element.getElementsByClassName('foo');

for (var i = 0; i< matches.length; i++) {
  matches[i].classList.remove('foo');
  matches.item(i).classList.add('bar');
}
// 执行后，HTML 代码如下
// <div id="example">
//   <p></p>
//   <p class="foo bar"></p>
// </div>
```

### `Element.getElementsByTagName()`

返回一个`HTMLCollection`实例，成员为当前节点的所有匹配指定标签名的子元素节点

==**==参数大小写不敏感

### `Element.closest()`

接收一个CSS选择器作为参数，返回

+ 匹配该选择器的
+ 最接近当前节点的
+ 祖先节点（包括当前节点）

若无则返回`null`

```javascript
// HTML 代码如下
// <article>
//   <div id="div-01">Here is div-01
//     <div id="div-02">Here is div-02
//       <div id="div-03">Here is div-03</div>
//     </div>
//   </div>
// </article>

var div03 = document.getElementById('div-03');

// div-03 最近的祖先节点
div03.closest("#div-02") // div-02
div03.closest("div div") // div-03
div03.closest("article > div") //div-01
div03.closest(":not(div)") // article
```

### `Element.matches()`

返回一个布尔值，表示当前元素是否匹配给定的CSS选择器

```javascript
if (el.matches('.someClass')){
    console.log('Mathch!');
}
```

### 事件相关方法

方法继承`EventTarget`接口

#### `Element.addEventListener()`

添加事件的回调函数

#### `Element.removeEventListener()`

移除事件监听函数

#### `Element.dispatchEvent()`

触发事件



```javascript
element.addEventListener('click', listener, false);
element.removeEventListener('click', listener, false);

var event = new Event('click');
element.dispatchEvent(event);
```

### `Element.scrollIntoView()`

滚动当前元素，进入浏览器的可见区域

类似`window.location.hash`的效果

```javascript
el.scrollIntoView(); // 等同于el.scrollIntoView(true)
el.scrollIntoView(false);
```

接收布尔值作为参数：

+ `true`，表示元素的顶部与当前区域的可见部分的顶部对齐
+ `false`，表示元素的底部与当前区域的可见部分的尾部对齐
+ 不设置则默认为`true`

> 前提为当前区域可滚动

### `Element.getBoundingClientRect()`

返回一个对象，提供当前元素节点的大小、位置等信息，基本上为CSS盒状模型的所有信息

`getBoundingClientRect`方法返回的`rect`对象，具有以下属性（全部为只读）。

- `x`：元素左上角相对于视口的横坐标
- `y`：元素左上角相对于视口的纵坐标
- `height`：元素高度（包含了padding+border）
- `width`：元素宽度（包含了padding+border）
- `left`：元素左上角相对于视口的横坐标，与`x`属性相等
- `right`：元素右边界相对于视口的横坐标（等于`x + width`）
- `top`：元素顶部相对于视口的纵坐标，与`y`属性相等
- `bottom`：元素底部相对于视口的纵坐标（等于`y + height`）

> 表示位置的四个属性值会随位置变化，若要绝对位置
>
> `left`加上`window.scrollX`
>
> `top`加上`window.scrollY`

以上属性都为继承自原型的属性

因此`Object.keys`会返回空数组

### `Element.getClientRects()`

返回一个类似数组的对象，成员为当前元素在页面上形成的==所有==矩形

每个矩形都有`bottom`、`height`、`left`、`right`、`top`和`width`六个属性，表示它们相对于视口的四个坐标，以及本身的高度和宽度

对于块状元素，如`div`、`p`，返回的对象中只有该元素一个成员

对于行内元素，如`span`、`a`，返回的对象的成员数取决于该元素在页面上占据了多少行

```html
<span id="inline">Hello World Hello World Hello World</span>
```

该行内元素，若占据了三行，则返回三个成员，若占据一行，则返回一个成员

```javascript
var el = document.getElementById('inline');
el.getClientRects().length // 3
el.getClientRects()[0].left // 8
el.getClientRects()[0].right // 113.908203125
el.getClientRects()[0].bottom // 31.200000762939453
el.getClientRects()[0].height // 23.200000762939453
el.getClientRects()[0].width // 105.908203125
```

> 判断行内元素是否换行

==*==若行内元素包括了换行符，会计算换行符

```html
<span id="inline">
  Hello World
  Hello World
  Hello World
</span>
```

上面会返回三个成员



















































































