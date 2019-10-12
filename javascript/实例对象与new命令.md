# 实例对象与new命令

[TOC]

对象即为一个容器，其内封装了属性和方法

## 构造函数

JavaScript使用构造函数作为对象的模版

构造函数即为一个普通的函数，但有自己的特征和用法

==**==构造函数第一个字母通常大写

构造函数特点：

+ 函数体内部使用`this`关键字，代表所要生成的对象实例
+ 生成对象时需要使用`new`命令

```javascript
var Vehicle = function () {
  this.price = 1000;
};
```

## `new`命令

### 基本用法

用于执行构造函数，返回一个实例对象

```javascript
var Vehicle = function () {
  this.price = 1000;
};

var v = new Vehicle();
v.price // 1000


//可以接受参数
var Vehicle = function (p) {
  this.price = p;
};

var v = new Vehicle(500);
```

若不使用`new`命令，则会变成普通的函数，且此时`this`代表全局对象

```javascript
var Vehicle = function (){
  this.price = 1000;
};

var v = Vehicle();
v // undefined
price // 1000
```

> 构造函数内部使用严格模式，则会限制一定要使用`new`命令否则报错

解决方法：

```javascript
function Fubar(foo, bar){
  'use strict';
  this._foo = foo;
  this._bar = bar;
}

Fubar()
// TypeError: Cannot set property '_foo' of undefined
```

```javascript
function Fubar(foo, bar) {
  if (!(this instanceof Fubar)) {
    return new Fubar(foo, bar);
  }

  this._foo = foo;
  this._bar = bar;
}

Fubar(1, 2)._foo // 1
(new Fubar(1, 2))._foo // 1
```

### `new`命令的原理

使用`new`命令时，其后函数依次执行以下步骤：

1. 创建一个空对象，作为将要返回的对象实例。
2. 将这个空对象的原型，指向构造函数的`prototype`属性。
3. 将这个空对象赋值给函数内部的`this`关键字。
4. 开始执行构造函数内部的代码。

`this`指的是一个新生成的空对象，所有针对`this`的操作都会发生在这个空对象上

若构造函数内部有`return`语句，且其后跟着一个对象，`new`命令会返回`return`语句指定的对象；否则会忽略`return`语句，返回`this`对象

```javascript
var Vehicle = function () {
  this.price = 1000;
  return 1000;
};

(new Vehicle()) === 1000
// false
```

```javascript
var Vehicle = function (){
  this.price = 1000;
  return { price: 2000 };
};

(new Vehicle()).price
// 2000
```

若对内部没有`this`关键字的函数使用`new`命令，会返回一个空对象

```javascript
function getMessage() {
  return 'this is a message';
}

var msg = new getMessage();

msg // {}
typeof msg // "object"
```

### `new.target`

函数内部的属性

若当前函数是`new`命令调用，`new.target`指向当前函数，否则为`undefined`

```javascript
function f(){
    console.log(new.target === f);
};

f(); // false
new f(); //true
```

用于判断函数调用时是否使用`new`命令

```javascript
function f() {
  if (!new.target) {
    throw new Error('请使用 new 命令调用！');
  }
  // ...
}

f() // Uncaught Error: 请使用 new 命令调用！
```

## `Object.create()`创建实例对象

有时没有构造函数，只能拿到一个现有的对象，想以这个对象为模版生成新的实例对象

```javascript
var person1 = {
  name: '张三',
  age: 38,
  greeting: function() {
    console.log('Hi! I\'m ' + this.name + '.');
  }
};

var person2 = Object.create(person1);

person2.name // 张三
person2.greeting() // Hi! I'm 张三.
```

