# `iterable`类型

>遍历`Array`可以采用下标循环，遍历`Map`和`Set`就无法使用下标。为了统一集合类型，==ES6==标准引入了新的`iterable`类型，`Array`、`Map`和`Set`都属于`iterable`类型。

具有`iterable`类型的集合可以通过新的`for ... of`循环来遍历。

## Map与Set

>JavaScript的对象有个小问题，就是键必须是字符串。但实际上Number或者其他数据类型作为键也是非常合理的。为了解决这个问题，最新的==ES6==规范引入了新的数据类型`Map`。

### Map

`Map`是一组键值对的结构，具有极快的查找速度

> 相比`Array`，相同的数据查找需要用到两个`Array`数组

一个`key`对应一个`value`

```javascript
var m = new Map(); // 空Map
m.set('Adam', 67); // 添加新的key-value
m.set('Bob', 59);
m.has('Adam'); // 是否存在key 'Adam': true
m.get('Adam'); // 67
m.delete('Adam'); // 删除key 'Adam'
m.get('Adam'); // undefined
```

### Set

`Set`和`Map`类似，也是一组key的集合，但不存储value。由于key不能重复，所以，在`Set`中，没有重复的key

创建`Set`有两个方法，直接创建一个空的，或者提供一个`Array`作为输入

```javascript
var s1 = new Set(); // 空Set
var s2 = new Set([1, 2, 3]); // 含1, 2, 3

//重复的元素会自动过滤
var s = new Set([1, 2, 3, 3, '3']);
s; // Set {1, 2, 3, "3"}
```

添加元素使用`add(key)`，删除元素使用`delete(key)`：

```JavaScript
var s = new Set([1,2,3])
s.add(4);
s; // Set {1, 2, 3, 4}
s.add(4);
s; // 仍然是 Set {1, 2, 3, 4}

var s = new Set([1, 2, 3]);
s; // Set {1, 2, 3}
s.delete(3);
s; // Set {1, 2}
```

获取`Set`中的元素

```javascript
const set = new Set([1, 2, 3, 4, 4]);
const result = [...set][1];  //2
console.log(result);
```

## `for ... of`循环

```javascript
var a = ['A', 'B', 'C'];
var s = new Set(['A', 'B', 'C']);
var m = new Map([[1, 'x'], [2, 'y'], [3, 'z']]);
for (var x of a) { // 遍历Array
    console.log(x);
}
for (var x of s) { // 遍历Set
    console.log(x);
}
for (var x of m) { // 遍历Map
    console.log(x[0] + '=' + x[1]);
}
```

### `for ... of`与`for ... in`的区别

`for ... in`遍历的是对象的属性名称，而`Array`实际也是一个对象，因此若

```javascript
var a = ['A', 'B', 'C'];
a.name = 'Hello';
for (var x in a) {
    console.log(x); // '0', '1', '2', 'name'
};
//循环将属性name包含在内，但length属性却不
a.length = 3;
a;  // ['A','B','C',name:"Hello"]
```

## `iterable`内置的`forEach`方法

```javascript
var a = ['A','B','C'];
a.forEach(function (element, index, array) {
    // element: 指向当前元素的值
    // index: 指向当前索引
    // array: 指向Array对象本身
    console.log(element + ', index = ' + index);
});
/*
A, index = 0
B, index = 1
C, index = 2
*/
-----
//Set没有索引，因而函数前两个参数都是元素本身
var s = new Set(['A', 'B', 'C']);
s.forEach(function (element, sameElement, set) {
    console.log(element);
});
-----
var m = new Map([[1, 'x'], [2, 'y'], [3, 'z']]);
m.forEach(function (value, key, map) {
    console.log(value);
});
```

> 可以忽略某些不需要的参数
>
> 比如只想获得元素可以如下，但是==位置必须一一对应==
>
> ```javascript
> var a = ['A', 'B', 'C'];
> a.forEach(function (element) {
>     console.log(element);
> });
> ```

