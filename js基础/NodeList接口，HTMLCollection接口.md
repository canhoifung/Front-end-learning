# NodeList接口，HTMLCollection接口

[TOC]

DOM提供的用于容纳多个节点的节点集合：

+ `NodeList` 可包含各种类型的节点
+ `HTMLCollection` 只能包含HTML元素节点

## `NodeList`接口

`NodeList`实例是一个类似数组的对象，成员为节点对象

以下方法可以获得`NodeList`实例：

+ `Node.childNodes` （只有这个会返回动态集合）
+ `document.querySelectorAll()`等节点搜索方法

```javascript
document.body.childNodes instanceof NodeList //true
```

由于类似数组，可以使用`length`属性和`forEach`方法。

但不能使用数组特有的如`push`、`pop`等方法

若想使用数组特有的方法可将其转为真正的数组：

```javascript
var children = document.body.childNodes;
var nodeArr = Array.prototype.slice.call(children);
```

动态集合：

```javascript
var children = document.body.childNodes;
children.length // 18
document.body.appendChild(document.createElement('p'));
children.length // 19
```

### `NodeList.prototype.length`

返回NodeList实例包含的节点数量

### `NodeList.prototype.forEach()`

用于遍历NodeList的所有成员。用法与数组实例的 `forEach`一致

```javascript
var children = document.body.childNodes;
children.forEach(function f(item, i, list) {
  // ...
}, this);
```

回调函数三个参数依次为当前成员、位置和当前NodeList实例

### `NodeList.prototype.item()`

接收一个整数值作为参数，表示成员的位置

返回该位置上的成员

```javascript
document.body.childNodes.item(0);
```

若不合法如负数或超出实际长度，会返回`null`

若省略参数，会报错

> 可以直接使用方括号运算符取出成员
>
> ```javascript
> document.body.childNodes[0];
> ```

### `NodeList.prototpye.keys()`、`NodeList.prototype.values()`、`NodeList.prototype.entries()`

均返回一个ES6的遍历器对象，可以通过`for..of`循环获取其中每一个成员的信息

`keys()`返回键名的遍历器

`values()`返回键值的遍历器

`entries()`返回键名和键值的遍历器

```javascript
var children = document.body.childNodes;

for (var key of children.keys()) {
  console.log(key);
}
// 0
// 1
// 2
// ...

for (var value of children.values()) {
  console.log(value);
}
// #text
// <script>
// ...

for (var entry of children.entries()) {
  console.log(entry);
}
// Array [ 0, #text ]
// Array [ 1, <script> ]
// ...
```

## HTMLCollection接口

为一个节点对象的集合，只能包含元素节点

类似数组的对象，但没有`forEach()`，只能使用`for`循环遍历

```javascript
document.links instanceof HTMLCollection // true
```

### `HTMLCollection.prototype.length`

返回实例包含的成员数量

### `HTMLCollection.prototype.item()`

接收一个整数值作为参数，表示成员的位置

返回该位置上的成员

若不合法如负数或超出实际长度，会返回`null`

若省略参数，会报错

同样可以使用方括号运算符  优先使用方括号运算符

### `HTMLCollection.prototype.namedItem()`

参数为一个字符串，表示`id`或`name`属性的值，返回对应的元素节点

若无则返回`null`

```javascript
// HTML 代码如下
// <img id="pic" src="http://example.com/foo.jpg">

var pic = document.getElementById('pic');
document.images.namedItem('pic') === pic // true
```



























