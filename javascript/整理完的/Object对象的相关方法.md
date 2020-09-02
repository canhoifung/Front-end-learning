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

`new`命令新建实例对象可分为两步：

1. 将一个空对象的原型设为构造函数的`prototype`属性
2. 将构造函数内部的`this`绑定这个空对象，然后执行构造函数，使定义在`this`上的方法和属性转移到空属性上

## `Object.create()`

接收一个对象作为参数，以其为原型返回一个实例对象，实例对象==完全==继承原型对象的属性。

可用于由一个实例对象生成另一个实例对象

```javascript
// 原型对象
var A = {
  print: function () {
    console.log('hello');
  }
};

// 实例对象
var B = Object.create(A);

Object.getPrototypeOf(B) === A // true
B.print() // hello
B.print === A.print // true
```

可用代码代替：

```javascript
if (typeof Object.create !== 'function') {
  Object.create = function (obj) {
    function F() {}
    F.prototype = obj;
    return new F();
  };
}
```

以下三对象等价：

```javascript
var obj1 = Object.create({});
var obj2 = Object.create(Object.prototype);
var obj3 = new Object();
```

可以生成一个不继承任何属性（包括`toString`和`valueOf`方法）的对象：

```javascript
var obj = Object.create(null);

obj.valueOf()
// TypeError: Object [object Object] has no method 'valueOf'
```

+ 参数不能为空

+ 生成的新对象是动态继承原型，原型上修改或添加会立刻反应到对象上

```javascript
var obj1 = { p: 1 };
var obj2 = Object.create(obj1);

obj1.p = 2;
obj2.p // 2
```

+ 可接收第二个参数

为属性描述对象，所描述的对象属性会添加到实例对象，作为该对象自身的属性

```javascript
var obj = Object.create({}, {
  p1: {
    value: 123,
    enumerable: true,
    configurable: true,
    writable: true,
  },
  p2: {
    value: 'abc',
    enumerable: true,
    configurable: true,
    writable: true,
  }
});

// 等同于
var obj = Object.create({});
obj.p1 = 123;
obj.p2 = 'abc';
```

+ 生成的对象继承其原型对象的构造函数

```javascript
function A() {}
var a = new A();
var b = Object.create(a);

b.constructor === A // true
b instanceof A // true
```

## `Object.prototype.isPrototypeOf()`

用于判断该对象是否为参数对象的原型

```javascript
var o1 = {};
var o2 = Object.create(o1);
var o3 = Object.create(o2);

o2.isPrototypeOf(o3) // true
o1.isPrototypeOf(o3) // true
```

只要实例对象处在参数对象的原型链上，都会返回`true`

```javascript
Object.prototype.isPrototypeOf({}) // true
Object.prototype.isPrototypeOf([]) // true
Object.prototype.isPrototypeOf(/xyz/) // true
Object.prototype.isPrototypeOf(Object.create(null)) // false
```

## `Object.prototype.__proto__`

实例对象的`__proto__`属性用于返回该对象的原型

该属性可读写

```javascript
var obj = {};
var p = {};

obj.__proto__ = p;
Object.getPrototypeOf(obj) === p // true
```

==**==应该少用，多使用`getPrototypeOf()`和`setPrototypeOf()`对原型对象的读写进行操作

只有浏览器才需要部署

## 获取原型对象方法的比较

获取实例对象`obj`的原型对象，三种方法：

+ `obj.__proto__`
+ `obj.constructor.prototype`
+ `Object.getPrototypeOf(obj)`

第一种属性只有浏览器才需要部署，其他环境可以不部署

第二种在手动改变原型对象时可能会失效

```javascript
var P = function () {};
var p = new P();

var C = function () {};
C.prototype = p;
var c = new C();

c.constructor.prototype === p // false
```

```javascript
C.prototype = p;
C.prototype.constructor = C;  //这两个需要同时设置

var c = new C();
c.constructor.prototype === p // true
```

因而推荐使用第三种

## `Object.getOwnPropertyNames()`

返回一个数组，成员为参数对象本身所有属性的键名

==**==不包含继承的属性键名

==**==不管是否可以遍历

```javascript
Object.getOwnPropertyNames(Date)
// ["parse", "arguments", "UTC", "caller", "name", "prototype", "now", "length"]
```

若要获取可以遍历的属性使用`Object.keys()`

```javascript
Object.keys(Date) // []
```

## `Object.prototype.hasOwnProperty()`

返回一个布尔值，用于判断某个属性定义在对象身上或原型链上

```javascript
Date.hasOwnProperty('length') // true
Date.hasOwnProperty('toString') // false
```

==**==唯一一个处理对象属性时不会遍历原型链的方法

## `in`运算符与`for...in`循环

`in`返回一个布尔值，表示对象是否具有某个属性

> 不区分是否为对象自身的属性

```javascript
'length' in Date // true
'toString' in Date // true
```

`for...in`获得对象的所有可遍历属性

```javascript
var o1 = { p1: 123 };

var o2 = Object.create(o1, {
  p2: { value: "abc", enumerable: true }
});

for (p in o2) {
  console.info(p);
}
// p2
// p1
```

可以利用`hasOwnProperty`方法来循环对象自身的属性：

```javascript
for ( var name in object ){
    if ( object.hasOwnProperty(name) ){
        //code
    }
}
```

获取对象的所有属性（自身+继承+是否可遍历）

```javascript
function inheritedPropertyNames(obj) {
  var props = {};
  while(obj) {
    Object.getOwnPropertyNames(obj).forEach(function(p) {
      props[p] = true;
    });
    obj = Object.getPrototypeOf(obj);
  }
  return Object.getOwnPropertyNames(props);
}
```

## 对象的拷贝

1. 确保拷贝后的对象，与原对象具有相同的原型
2. 确保拷贝后的对象，与原对象具有相同的实例属性

### 方法一：

```javascript
function copyObject(orig) {
  var copy = Object.create(Object.getPrototypeOf(orig));
  copyOwnPropertiesFrom(copy, orig);
  return copy;
}

function copyOwnPropertiesFrom(target, source) {
  Object
    .getOwnPropertyNames(source)
    .forEach(function (propKey) {
      var desc = Object.getOwnPropertyDescriptor(source, propKey);
      Object.defineProperty(target, propKey, desc);
    });
  return target;
}
```

+ `Object.getOwnPropertyDescriptor(obj,prop)`

返回指定对象上一个自有属性对应的属性描述

+ `Object.defineProperty(obj, prop, descriptor)`

直接在对象上定义一个新属性或修改对象的现有属性，并返回该对象

### 方法二

```javascript
function copyObject(orig) {
  return Object.create(
    Object.getPrototypeOf(orig),
    Object.getOwnPropertyDescriptors(orig)
  );
}
```

+ `Object.getOwnPropertyDescriptors(obj,props)`

直接在一个对象上定义新的属性或修改现有属性，并返回该对象。

可返回复数项







































