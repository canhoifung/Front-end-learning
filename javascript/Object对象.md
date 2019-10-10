# Obejct对象

## `Object`的原生方法

分为两类：

1. `Object`本身的方法
2. `Object`的实例方法

### `Obejct`本身的方法

即直接定义在`Object`对象的方法

```javascript
Object.print = function (o) { console.log(o) };
```

> 此处`print`方法为直接定义在`Object`对象上

### `Object`的实例方法

即定义在`Object`原型对象`Object.prototype`上的方法，可直接被`Object`的实例使用

```javascript
Object.prototype.print = function () {
  console.log(this);
};

var obj = new Object();
obj.print() // Object
```

## `Object()`

用于将任意值转为对象，常用于保证某个值一定是对象

> 若参数为空或undefined或null，Object()返回一个空对象

```javascript
var obj = Object();
// 等同于
var obj = Object(undefined);
var obj = Object(null);

obj instanceof Object // true
```

若参数是原始类型的值，`Object()`将其转为对应的包装对象的实例：

```javascript
var obj = Object(1);
obj instanceof Object // true
obj instanceof Number // true

var obj = Object('foo');
obj instanceof Object // true
obj instanceof String // true

var obj = Object(true);
obj instanceof Object // true
obj instanceof Boolean // true
```

若参数时一个对象，则总是返回该对象，没有转换：

```javascript
var arr = [];
var obj = Object(arr); // 返回原数组
obj === arr // true

var value = {};
var obj = Object(value) // 返回原对象
obj === value // true

var fn = function () {};
var obj = Object(fn); // 返回原函数
obj === fn // true
```

可用于判断变量是否为对象：

```javascript
function isObject(value) {
  return value === Object(value);
}

isObject([]) // true
isObject(true) // false
```

## Object构造函数

直接用于生成新对象：

```javascript
var obj = new Object();
//等价于
var obj = {};
```

用法与`Object()`类似

```javascript
var o1 = {a: 1};
var o2 = new Object(o1);
o1 === o2 // true

var obj = new Object(123);
obj instanceof Number // true
```

但

+ `Object(value)`语义为将`value`转为一个对象
+ `new Object(value)`语义为新生成一个对象，其值为`value`

## Object静态方法

即指部署在`Object`对象自身的方法

### `Object.keys()`，`Object.getOwnPropertyNames()`

都用于遍历对象的属性

`Object.keys()`的参数时一个对象，返回一个数组。

数组内的成员为对象自身的所有属性名。（非继承而来的）

```javascript
var obj = {
  p1: 123,
  p2: 456
};

Object.keys(obj) // ["p1", "p2"]
```

一般而言两个方法返回结果一样。

但若涉及不可枚举属性时，`Object.keys()`只返回可枚举的属性，而另一个可返回不可枚举的属性

```javascript
var a = ['Hello', 'World'];

Object.keys(a) // ["0", "1"]
Object.getOwnPropertyNames(a) // ["0", "1", "length"]
```

以上，数组的`length`属性为不可枚举的属性。

可用于计算对象属性的数量：

```javascript
var obj = {
  p1: 123,
  p2: 456
};

Object.keys(obj).length // 2
Object.getOwnPropertyNames(obj).length // 2
```

### 其他方法

**（1）对象属性模型的相关方法**

- `Object.getOwnPropertyDescriptor()`：获取某个属性的描述对象。
- `Object.defineProperty()`：通过描述对象，定义某个属性。
- `Object.defineProperties()`：通过描述对象，定义多个属性。

**（2）控制对象状态的方法**

- `Object.preventExtensions()`：防止对象扩展。
- `Object.isExtensible()`：判断对象是否可扩展。
- `Object.seal()`：禁止对象配置。
- `Object.isSealed()`：判断一个对象是否可配置。
- `Object.freeze()`：冻结一个对象。
- `Object.isFrozen()`：判断一个对象是否被冻结。

**（3）原型链相关方法**

- `Object.create()`：该方法可以指定原型对象和属性，返回一个新的对象。
- `Object.getPrototypeOf()`：获取对象的`Prototype`对象。

## Object的实例方法

定义在`Object.prototype`对象上的方法，称为实例方法：

- `Object.prototype.valueOf()`：返回当前对象对应的值。
- `Object.prototype.toString()`：返回当前对象对应的字符串形式。
- `Object.prototype.toLocaleString()`：返回当前对象对应的本地字符串形式。
- `Object.prototype.hasOwnProperty()`：判断某个属性是否为当前对象自身的属性，还是继承自原型对象的属性。
- `Object.prototype.isPrototypeOf()`：判断当前对象是否为另一个对象的原型。
- `Object.prototype.propertyIsEnumerable()`：判断某个属性是否可枚举。

### `Object.prototype.valueOf()`

返回一个对象的值，默认返回对象本身

```javascript
var obj = new Object();
obj.valueOf() === obj // true
```

在进行自动类型转换时会默认调用这个方法

可自定义

### `Object.prototype.toString()`

返回一个对象的字符串形式，默认返回类型字符串

```javascript
var o1 = new Object();
o1.toString() // "[object Object]"

var o2 = {a:1};
o2.toString() // "[object Object]"
```

> 第二个Object表示该值的构造函数

数组、字符串、函数、Date对象分别有自定义的`toString()`方法：

```javascript
[1, 2, 3].toString() // "1,2,3"

'123'.toString() // "123"

(function () {
  return 123;
}).toString()
// "function () {
//   return 123;
// }"

(new Date()).toString()
// "Tue May 10 2016 09:11:31 GMT+0800 (CST)"
```

#### `toString()`应用：判断数据类型

由于实例对象可能会自定义`toString()`方法，因而为了获得类型字符串，应该：

```javascript
Object.prototype.toString.call(value);
```

不同数据类型的返回值：

- 数值：返回`[object Number]`。
- 字符串：返回`[object String]`。
- 布尔值：返回`[object Boolean]`。
- undefined：返回`[object Undefined]`。
- null：返回`[object Null]`。
- 数组：返回`[object Array]`。
- arguments 对象：返回`[object Arguments]`。
- 函数：返回`[object Function]`。
- Error 对象：返回`[object Error]`。
- Date 对象：返回`[object Date]`。
- RegExp 对象：返回`[object RegExp]`。
- 其他对象：返回`[object Object]`。

类型判断函数：

```javascript
var type = function (o){
  var s = Object.prototype.toString.call(o);
  return s.match(/\[object (.*?)\]/)[1].toLowerCase();
};

type({}); // "object"
type([]); // "array"
type(5); // "number"
type(null); // "null"
type(); // "undefined"
type(/abcd/); // "regex"
type(new Date()); // "date"
```

专门用于判断某种类型数据的方法：

```javascript
var type = function (o){
  var s = Object.prototype.toString.call(o);
  return s.match(/\[object (.*?)\]/)[1].toLowerCase();
};

['Null',
 'Undefined',
 'Object',
 'Array',
 'String',
 'Number',
 'Boolean',
 'Function',
 'RegExp'
].forEach(function (t) {
  type['is' + t] = function (o) {
    return type(o) === t.toLowerCase();
  };
});

type.isObject({}) // true
type.isNumber(NaN) // true
type.isRegExp(/abc/) // true
```

### `Object.prototype.toLocaleString()`

与`toString()`返回结果相同，返回一个值的字符串形式

```javascript
var obj = {};
obj.toString(obj) // "[object Object]"
obj.toLocaleString(obj) // "[object Object]"
```

可用于留一个借口返回针对不同地域的值

目前有三个对象自定义了`toLocaleString()`方法：

+ Array.prototype.toLocaleString()
+ Number.prototype.toLocaleString()
+ Date.prototype.toLocaleString()

```javascript
var date = new Date();
date.toString() // "Tue Jan 01 2018 12:01:33 GMT+0800 (CST)"
date.toLocaleString() // "1/01/2018, 12:01:33 PM"
```

### `Object.prototype.hasOwnProperty()`

接收一个字符串作为参数，返回一个布尔值，表示该实例对象自身是否具有该属性

```javascript
var obj = {
  p: 123
};

obj.hasOwnProperty('p') // true
obj.hasOwnProperty('toString') // false
```

> 继承的属性会返回false