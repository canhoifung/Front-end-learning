# Iterator

作为一个接口，为各种不同的数据结构提供统一的访问机制

任何数据结构只要部署了Iterator接口，就可以实现遍历操作

作用为：

1. 为各种数据结构，提供一个统一的访问接口
2. 使数据结构的成员能按某种次序排列
3. 供`for...of`消费

遍历过程：

1. 创建一个指针对象，指向当前数据结构的起始位置。也就是说，遍历器对象本质上，就是一个指针对象。
2. 第一次调用指针对象的`next`方法，可以将指针指向数据结构的第一个成员。
3. 第二次调用指针对象的`next`方法，指针就指向数据结构的第二个成员。
4. 不断调用指针对象的`next`方法，直到它指向数据结构的结束位置。

每一次调用`next`，都会返回一个包含`value`和`done`两个属性的对象

`value`表示当前成员的值，`done`是一个布尔值，表示遍历是否结束

`next`实现：

```javascript
var it = makeIterator(['a', 'b']);
it.next() // { value: "a", done: false }
it.next() // { value: "b", done: false }
it.next() // { value: undefined, done: true }

function makeIterator(array) {
  var nextIndex = 0;
  return {
    next: function() {
      return nextIndex < array.length ?
        {value: array[nextIndex++], done: false} :
        {value: undefined, done: true};
    }
  };
}

//简化
function makeIterator(array) {
  var nextIndex = 0;
  return {
    next: function() {
      return nextIndex < array.length ?
        {value: array[nextIndex++]} :
        {done: true};
    }
  };
}
```

## 默认Iterator接口

ES6 规定，默认的 Iterator 接口部署在数据结构的`Symbol.iterator`属性，或者说，一个数据结构只要具有`Symbol.iterator`属性，就可以认为是“可遍历的”

`Symbol.iterator`属性本身是一个函数，就是当前数据结构默认的遍历器生成函数。执行这个函数，就会返回一个遍历器。至于属性名`Symbol.iterator`，它是一个表达式，返回`Symbol`对象的`iterator`属性，这是一个预定义好的、类型为 Symbol 的特殊值，所以要放在方括号内

```javascript
const obj = {
  [Symbol.iterator] : function () {
    return {
      next: function () {
        return {
          value: 1,
          done: true
        };
      }
    };
  }
};
```

==原生部署Iterator接口的数据结构有：==

- Array
- Map
- Set
- String
- TypedArray
- 函数的 arguments 对象
- NodeList 对象

对象原型链部署Iterator接口例子：

```javascript
function Obj(value) {
  this.value = value;
  this.next = null;
}

Obj.prototype[Symbol.iterator] = function() {
  var iterator = { next: next };

  var current = this;

  function next() {
    if (current) {
      var value = current.value;
      current = current.next;
      return { done: false, value: value };
    } else {
      return { done: true };
    }
  }
  return iterator;
}

var one = new Obj(1);
var two = new Obj(2);
var three = new Obj(3);

one.next = two;
two.next = three;

for (var i of one){
  console.log(i); // 1, 2, 3
}
```

类似数组的对象部署Iterator接口例子：

```javascript
let iterable = {
  0: 'a',
  1: 'b',
  2: 'c',
  length: 3,
  [Symbol.iterator]: Array.prototype[Symbol.iterator]
};
for (let item of iterable) {
  console.log(item); // 'a', 'b', 'c'
}
```

## 默认调用Iterator接口的场合

### 解构赋值

对数组和Set结构进行解构赋值时会默认调用

```javascript
let set = new Set().add('a').add('b').add('c');

let [x,y] = set;
// x='a'; y='b'

let [first, ...rest] = set;
// first='a'; rest=['b','c'];
```

### 扩展运算符

```javascript
// 例一
var str = 'hello';
[...str] //  ['h','e','l','l','o']

// 例二
let arr = ['b', 'c'];
['a', ...arr, 'd']
// ['a', 'b', 'c', 'd']
```

即只要某个数据结构部署了 Iterator 接口，就可以对它使用扩展运算符，将其转为数组

### yield*

`yield*`后面跟的是一个可遍历结构，会调用结构的遍历器接口

```javascript
let generator = function* () {
  yield 1;
  yield* [2,3,4];
  yield 5;
};

var iterator = generator();

iterator.next() // { value: 1, done: false }
iterator.next() // { value: 2, done: false }
iterator.next() // { value: 3, done: false }
iterator.next() // { value: 4, done: false }
iterator.next() // { value: 5, done: false }
iterator.next() // { value: undefined, done: true }
```

### 任何接受数组作为参数的场合

比如：

- for...of
- Array.from()
- Map(), Set(), WeakMap(), WeakSet()（比如`new Map([['a',1],['b',2]])`）
- Promise.all()
- Promise.race()

## 遍历器对象的return()和throw()

如果自己编写遍历器对象生成函数，`next`是必须的，`return()`和`throw()`是可选的

`return`：如果`for...of`循环提前退出（break或者抛出错误）就会调用`return`方法

​						若一个对象在完成遍历前需要清理或释放资源，也可以部署`return`

`throw`：主要是配合Generator函数使用



# for...of循环

内部调用的是数据结构的`Symbol.iterator`方法

适用范围是所有具有遍历器属性的对象

读取对象键值

## 数组

只返回具有数字索引的属性

```javascript
let arr = [3, 5, 7];
arr.foo = 'hello';

for (let i in arr) {
  console.log(i); // "0", "1", "2", "foo"
}

for (let i of arr) {
  console.log(i); //  "3", "5", "7"
}
```

## Set和Map结构

1. 遍历的顺序是按照各个成员被添加进数据结构的顺序
2. Set 结构遍历时，返回的是一个值
3. Map 结构遍历时，返回的是一个数组，该数组的两个成员分别为当前 Map 成员的键名和键值（Iterator接口默认调用`entries()`方法）

## 计算生成的数据结构

指`entries()`、`keys()`、`values()`

调用后都返回遍历器对象

ES6的数组，Set和Map都部署了这三个方法

## 类似数组的对象

比如字符串、NodeList对象、`arguments`对象

```javascript
// 字符串
let str = "hello";

for (let s of str) {
  console.log(s); // h e l l o
}

// DOM NodeList对象
let paras = document.querySelectorAll("p");

for (let p of paras) {
  p.classList.add("test");
}

// arguments对象
function printArgs() {
  for (let x of arguments) {
    console.log(x);
  }
}
printArgs('a', 'b');
// 'a'
// 'b'
```

类似数组的对象可以使用`Array.from()`将其转为数组从而获得Iterator接口

```javascript
let arrayLike = { length: 2, 0: 'a', 1: 'b' };

// 报错
for (let x of arrayLike) {
  console.log(x);
}

// 正确
for (let x of Array.from(arrayLike)) {
  console.log(x);
}
```

## 对象

必须部署了Iterator接口才能用，直接使用会报错

## 与其他遍历语法的比较

1. `for`循环

   写法比较麻烦

2. 数组的`forEach`

   无法中途跳出循环

3. `for...in`

   1. 以字符串作为键名
   2. 会遍历手动添加的其他键，包括原型链上的键
   3. 以任意顺序遍历键名
   4. 主要为遍历对象而设计

4. `for...of`

   1. 语法简洁
   2. 可以与`break`、`continue`、`return`配合使用
   3. 提供了遍历所有数据结构的统一操作接口











