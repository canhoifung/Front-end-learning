# Object对象的相关方法

[TOC]

## `Object.getPrototypeOf()`

返回参数对象的原型。

获取原型对象的标准方法

```javascript
var F = function () {};
var f = new F();
Object.getPrototypeOf(f) === F.prototype // true
```

特殊对象的原型：

```javascript
// 空对象的原型是 Object.prototype
Object.getPrototypeOf({}) === Object.prototype // true

// Object.prototype 的原型是 null
Object.getPrototypeOf(Object.prototype) === null // true

// 函数的原型是 Function.prototype
function f() {}
Object.getPrototypeOf(f) === Function.prototype // true
```

## `Object.setPrototypeOf()`

为参数对象设置原型，返回该参数对象

接受两个参数：

1. 现有对象
2. 原型对象

```javascript
var a = {};
var b = {x: 1};
Object.setPrototypeOf(a, b);

Object.getPrototypeOf(a) === b // true
a.x // 1
```

可以模拟`new`命令：

```javascript
var F = function () {
  this.foo = 'bar';
};
var f = new F();

// 等同于
var F = function () {
  this.foo = 'bar';
};
var f = Object.setPrototypeOf({}, F.prototype);
F.call(f);
```

























































