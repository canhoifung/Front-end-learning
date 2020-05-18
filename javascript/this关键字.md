# this关键字

[TOC]

## 涵义

`this`总是返回一个对象

`this`就是属性或方法==当前==所在的对象

```javascript
var person = {
  name: '张三',
  describe: function () {
    return '姓名：'+ this.name;
  }
};

person.describe()
// "姓名：张三"
```

此处由于`this`在`describe`方法中被调用，而`describe`方法所在的当前对象为`person`，因此此处`this`指向`person`

属性所在的对象要看当前环境：

```javascript
var A = {
  name: '张三',
  describe: function () {
    return '姓名：'+ this.name;
  }
};

var B = {
  name: '李四'
};

B.describe = A.describe;
B.describe(); // "姓名：李四"
```

```javascript
var A = {
  name: '张三',
  describe: function () {
    return '姓名：'+ this.name;
  }
};

var name = '李四';
var f = A.describe;
f() // "姓名：李四"
```

## 实质

```javascript
var obj = { foo:  5 };
```

上面的代码将一个对象赋值给变量`obj`。

+ JavaScript 引擎会先在内存里面，生成一个对象`{ foo: 5 }`
+ 然后把这个对象的内存地址赋值给变量`obj`。

也就是说，变量`obj`是一个地址（reference）。后面如果要读取`obj.foo`，引擎先从`obj`拿到内存地址，然后再从该地址读出原始的对象，返回它的`foo`属性。



原始对象以字典结构保存，每一个属性名对应一个属性描述对象：

```javascript
//foo属性保存形式
{
  foo: {
    [[value]]: 5
    [[writable]]: true
    [[enumerable]]: true
    [[configurable]]: true
  }
}
```

但若属性值为函数

```javascript
var obj = { foo: function () {} };
```

此时引擎会将函数保存在内存中，将函数的地址赋值给`foo`属性的`value`属性

```javascript
{
  foo: {
    [[value]]: 函数的地址
    [[writable]]: true
    [[enumerable]]: true
    [[configurable]]: true
  }
}
```

由于函数是一个单独的值，因此可以在不同的环境中执行

```javascript
var f = function () {};
var obj = { f: f };

// 单独执行
f()

// obj 环境执行
obj.f()
```



由于函数可以在不同环境下执行，因而需要使用`this`获取当前运行环境

==**==`this`指代的函数当前运行环境也可以理解为函数运行时所在的对象

## 使用场合

### 全局环境

此时`this`指向顶层对象`window`

```javascript
this === window // true

function f() {
  console.log(this === window);
}
f() // true  此时f在全局环境下运行，即在顶层对象window下运行
```

### 构造函数

此时`this`指向实例对象

因为是在实例对象中调用的

```javascript
var Obj = function (p) {
  this.p = p;
};
var o = new Obj('Hello World!');
o.p // "Hello World!"
```

### 对象的方法

此时`this`指向方法运行时所在的对象

因此若方法赋值给另一个对象就会改变`this`的指向

```javascript
var obj ={
  foo: function () {
    console.log(this);
  }
};

obj.foo() // obj
```

改变`this`指向的用法：

```javascript
// 情况一
(obj.foo = obj.foo)() // window
// 情况二
(false || obj.foo)() // window
// 情况三
(1, obj.foo)() // window
```

相当于：

```javascript
// 情况一
(obj.foo = function () {
  console.log(this);
})()
// 等同于
(function () {
  console.log(this);
})()

// 情况二
(false || function () {
  console.log(this);
})()

// 情况三
(1, function () {
  console.log(this);
})()
```

此时`obj.foo`等于一个值，而且此时调用的环境不是在`obj`中而是在全局环境下调用运行，因此`this`指向`window`

> 理解为：`obj`和`obj.foo`分别储存在地址1和地址2,。
>
> 当为`obj.foo()`时，为从地址1调用地址2
>
> 但上述情况为直接从全局环境调用地址2



由于`this`指向调用其的对象，因此：

若`this`所在的方法不在对象的第一层，则指向当前一层的对象

```javascript
var a = {
  p: 'Hello',
  b: {
    m: function() {
      console.log(this.p);
    }
  }
};

a.b.m() // undefined

//相当于
var b = {
  m: function() {
   console.log(this.p);
  }
};

var a = {
  p: 'Hello',
  b: b
};

(a.b).m() // 等同于 b.m()
```

此时若将嵌套对象内部的方法赋值给一个变量，`this`仍然会改为指向`window`

```javascript
var a = {
  b: {
    m: function() {
      console.log(this.p);
    },
    p: 'Hello'
  }
};

var hello = a.b.m;
hello() // undefined
```

## 使用注意点

### 避免多层`this`

避免函数中包含多层的`this`

```javascript
var o = {
  f1: function () {
    console.log(this);
    var f2 = function () {
      console.log(this);
    }();
  }
}

o.f1()
// Object
// Window
```

上面相当于：

```javascript
var temp = function () {
  console.log(this);
};

var o = {
  f1: function () {
    console.log(this);
    var f2 = temp();
  }
}
```

解决方法：

```javascript
var o = {
  f1: function() {
    console.log(this);
    var that = this;
    var f2 = function() {
      console.log(that);
    }();
  }
}

o.f1()
// Object
// Object
```

==*==若函数内部使用了严格模式，当`this`指向顶层对象时会报错

```javascript
var counter = {
  count: 0
};
counter.inc = function () {
  'use strict';
  this.count++
};
var f = counter.inc;
f()
// TypeError: Cannot read property 'count' of undefined
```

### 避免数组处理方法中的`this`

针对数组的`map`和`foreach`方法，允许提供一个函数作为参数

这个函数内部不应该使用`this`

```javascript
var o = {
  v: 'hello',
  p: [ 'a1', 'a2' ],
  f: function f() {
    this.p.forEach(function (item) {
      console.log(this.v + ' ' + item);
    });
  }
}

o.f()
// undefined a1
// undefined a2
```

此处`foreach`中的`this`指向`window`

相当于函数内部的方法，与多层使用类似

+ 可以使用中间变量固定`this`
+ 将`this`作为方法的第二个参数固定其运行环境

```javascript
var o = {
  v: 'hello',
  p: [ 'a1', 'a2' ],
  f: function f() {
    this.p.forEach(function (item) {
      console.log(this.v + ' ' + item);
    }, this);
  }
}

o.f()
// hello a1
// hello a2
```

### 避免回调函数中的`this`

回调函数中的`this`指向通常会改变

```javascript
var o = new Object();
o.f = function () {
  console.log(this === o);
}

// jQuery 的写法
$('#button').on('click', o.f);
```

此处点击`button`后会返回`false`，因为此时`f`方法是在按钮对象的环境中被调用，因此此时`this`指向按钮的DOM对象



## 绑定`this`的方法

### `Function.prototype.call()`

用于指定函数内部`this`的指向（即函数执行时所在的作用域），然后在所指定的作用域中，调用该函数

```javascript
var obj = {};

var f = function () {
  return this;
};

f() === window // true
f.call(obj) === obj // true
```

`call`方法的参数应该为一个对象。

若为空、`null`和`undefined`，则默认传入全局对象

```javascript
var n = 123;
var obj = { n: 456 };

function a() {
  console.log(this.n);
}

a.call() // 123
a.call(null) // 123
a.call(undefined) // 123
a.call(window) // 123
a.call(obj) // 456
```

`call`方法的参数若为原始值，则该原始值会自动转成对应的包装对象

```javascript
var f = function () {
  return this;
};

f.call(5)
// Number {[[PrimitiveValue]]: 5}
```

`call`方法标准：

```javascript
func.call(thisValue, arg1, arg2, ...)
```

`thisValue`为指定`this`指向的对象

`arg1`等参数为函数调用时所需要的参数

```javascript
function add(a, b) {
  return a + b;
}

add.call(this, 1, 2) // 3
//这样写也可以
add.call(null,1,2) //3
```

还可用于调用对象的原生方法：（若原生方法被自定义覆盖）

```javascript
var obj = {};
obj.hasOwnProperty('toString') // false

// 覆盖掉继承的 hasOwnProperty 方法
obj.hasOwnProperty = function () {
  return true;
};
obj.hasOwnProperty('toString') // true

Object.prototype.hasOwnProperty.call(obj, 'toString') // false
```

### `Function.prototype.apply()`

与`call`类似，改变`this`指向

但是其接收一个数组作为函数执行时的函数

```javascript
func.apply(thisValue,[arg1,arg2,...])
```

```javascript
function f(x, y){
  console.log(x + y);
}

f.call(null, 1, 1) // 2
f.apply(null, [1, 1]) // 2
```

#### 找出数组最大元素

```javascript
var a = [10, 2, 4, 15, 9];
Math.max.apply(null, a) // 15
```

#### 将数组的空元素变为`undefined`

```javascript
Array.apply(null, ['a', ,'b'])
// [ 'a', undefined, 'b' ]

//与Array(3)的区别
Array(3);  // [empty,empty,empty]
//使用该方法可以将空变为undefined
```

```javascript
var a = ['a', , 'b'];

function print(i) {
  console.log(i);
}

a.forEach(print)
// a
// b

Array.apply(null, a).forEach(print)
// a
// undefined
// b
```

#### 转换类似数组的对象

```javascript
Array.prototype.slice.apply({0: 1, length: 1}) // [1]
Array.prototype.slice.apply({0: 1}) // []
Array.prototype.slice.apply({0: 1, length: 2}) // [1, undefined]
Array.prototype.slice.apply({length: 1}) // [undefined]
```

==*==被处理的对象必须拥有`length`属性

#### 绑定回调函数的对象

```javascript
var o = new Object();

o.f = function () {
  console.log(this === o);
}

var f = function (){
  o.f.apply(o);
  // 或者 o.f.call(o);
};

// jQuery 的写法
$('#button').on('click', f);
```

### `Function.prototype.bind()`

参数为所要绑定`this`的对象



+ 例子1

```javascript
var d = new Date();
d.getTime() // 1481869925657

var print = d.getTime;
print() // Uncaught TypeError: this is not a Date object.
```

`getTime()`方法内部有`this`绑定`Date`对象的实例，赋给`print`后`this`指向改变

```javascript
var print = d.getTime.bind(d);
print() // 1481869925657
```

+ 例子2

```javascript
var counter = {
  count: 0,
  inc: function () {
    this.count++;
  }
};

var func = counter.inc.bind(counter);
func();
counter.count // 1
```

```javascript
var counter = {
  count: 0,
  inc: function () {
    this.count++;
  }
};

var obj = {
  count: 100
};
var func = counter.inc.bind(obj);
func();
obj.count // 101
```

+ 例子3

还可以接收参数作为原函数的参数：

```javascript
var add = function (x, y) {
  return x * this.m + y * this.n;
}

var obj = {
  m: 2,
  n: 2
};

var newAdd = add.bind(obj, 5);
newAdd(5) // 20
```

#### 使用注意点：

##### 每一次返回一个新函数

会出现监听的问题：

```javascript
element.addEventListener('click', o.m.bind(o));
//上面代码中，click事件绑定bind方法生成的一个匿名函数。这样会导致无法取消绑定，所以，下面的代码是无效的。

element.removeEventListener('click', o.m.bind(o));
//正确的方法是写成下面这样：

var listener = o.m.bind(o);
element.addEventListener('click', listener);
//  ...
element.removeEventListener('click', listener);
```

##### 结合回调函数使用

解决将包含`this`的方法直接当作回调函数使用的问题

```javascript
var counter = {
  count: 0,
  inc: function () {
    'use strict';
    this.count++;
  }
};

function callIt(callback) {
  callback();
}

callIt(counter.inc.bind(counter));
counter.count // 1
```

或解决某些数组方法接受一个函数作为参数的内部`this`指向问题

```javascript
var obj = {
  name: '张三',
  times: [1, 2, 3],
  print: function () {
    this.times.forEach(function (n) {
      console.log(this.name);//此处this指向全局对象
    });
  }
};

obj.print()
// 没有任何输出
```

问题展现：

```javascript
obj.print = function () {
  this.times.forEach(function (n) {
    console.log(this === window);
  });
};

obj.print()
// true
// true
// true
```

解决办法

```javascript
obj.print = function () {
  this.times.forEach(function (n) {
    console.log(this.name);
  }.bind(this));
};

obj.print()
// 张三
// 张三
// 张三
```

##### 结合`call`方法使用

```javascript
[1, 2, 3].slice(0, 1) // [1]
// 等同于
Array.prototype.slice.call([1, 2, 3], 0, 1) // [1]
```

可以改写为：

```javascript
var slice = Function.prototype.call.bind(Array.prototype.slice);
slice([1, 2, 3], 0, 1) // [1]
```

上面代码的含义就是，将`Array.prototype.slice`变成`Function.prototype.call`方法所在的对象，调用时就变成了`Array.prototype.slice.call`

其他数组方法：

```javascript
var push = Function.prototype.call.bind(Array.prototype.push);
var pop = Function.prototype.call.bind(Array.prototype.pop);

var a = [1 ,2 ,3];
push(a, 4)
a // [1, 2, 3, 4]

pop(a)
a // [1, 2, 3]
```



































