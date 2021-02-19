# Set

类似数组，但成员都是唯一的，没有重复

作为构造函数：

```javascript
const s = new Set();

[2, 3, 5, 4, 5, 2, 2].forEach(x => s.add(x));

for (let i of s) {
  console.log(i);
}
// 2 3 5 4
```

可以接受一个数组或具有lterable接口的其他数据结构作为参数

==在Set内部，`NaN`是相等的，不能添加多个==

## 实例属性和方法

Set 结构的实例有以下属性。

- `Set.prototype.constructor`：构造函数，默认就是`Set`函数。
- `Set.prototype.size`：返回`Set`实例的成员总数。

Set 实例的方法分为两大类：操作方法（用于操作数据）和遍历方法（用于遍历成员）。下面先介绍四个操作方法。

- `Set.prototype.add(value)`：添加某个值，返回 Set 结构本身。
- `Set.prototype.delete(value)`：删除某个值，返回一个布尔值，表示删除是否成功。
- `Set.prototype.has(value)`：返回一个布尔值，表示该值是否为`Set`的成员。
- `Set.prototype.clear()`：清除所有成员，没有返回值

## 遍历操作

- `Set.prototype.keys()`：返回键名的遍历器
- `Set.prototype.values()`：返回键值的遍历器
- `Set.prototype.entries()`：返回键值对的遍历器
- `Set.prototype.forEach()`：使用回调函数遍历每个成员

==遍历顺序是插入顺序==

==由于Set键名和键值是同一个值，因此`keys()`和`values()`行为一致==



# WeakSet

结构与Set类似，但是：

1. 成员只能是对象

```javascript
const ws = new WeakSet();
ws.add(1)
// TypeError: Invalid value used in weak set
ws.add(Symbol())
// TypeError: invalid value used in weak set
```

2. 对象都是弱引用

即若其他对象都不再引用该对象，垃圾回收机制会自动回收对象所占用的内存



==适合临时存放一组对象，以及存放跟对象绑定的信息==

==不可遍历==（无法预测垃圾回收机制什么时候回收，内部成员个数不稳定）



可作为构造函数，接收一个数组或类似数组的对象作为参数

```javascript
const a = [[1, 2], [3, 4]];
const ws = new WeakSet(a);
// WeakSet {[1, 2], [3, 4]}
```

==是a的成员作为参数，不是a本身==



三个方法：

- `WeakSet.prototype.add(value)`：向 WeakSet 实例添加一个新成员。
- `WeakSet.prototype.delete(value)`：清除 WeakSet 实例的指定成员。
- `WeakSet.prototype.has(value)`：返回一个布尔值，表示某个值是否在 WeakSet 实例之中。



# Map

类似于对象，为键值对的集合，但是键名可以是各种类型包括对象

可以接受一个数组作为参数，数组成员为表示键值对的数组

```javascript
const map = new Map([
  ['name', '张三'],
  ['title', 'Author']
]);

map.size // 2
map.has('name') // true
map.get('name') // "张三"
map.has('title') // true
map.get('title') // "Author"
```

==只要内存地址不一样，就视为两个键==

两个内容一样的数组，地址不同，视为两个不同的键

将`NaN`、`null`、`undefined`分别视为同一个键

## 实例属性和方法

### size属性

返回Map结构的成员总数

### Map.prototype.set(key,value)

设置某个键值对，返回==整个Map结构==

`key`已存在，则键值更新

### Map.prototype.get(key)

读取`key`值对应的键值，若无则返回`undefined`

### Map.prototype.has(key)

返回布尔值

### Map.prototype.delete(key)

删除某个键，成功返回`true`，否则返回`false`

### Map.prototype.clear()

清除所有成员

## 遍历方法

- `Map.prototype.keys()`：返回键名的遍历器。
- `Map.prototype.values()`：返回键值的遍历器。
- `Map.prototype.entries()`：返回所有成员的遍历器。
- `Map.prototype.forEach()`：遍历 Map 的所有成员。

遍历顺序是插入顺序

## 数据结构转换

### Map转数组

```javascript
const myMap = new Map()
  .set(true, 7)
  .set({foo: 3}, ['abc']);
[...myMap]
// [ [ true, 7 ], [ { foo: 3 }, [ 'abc' ] ] ]
```

### 数组转为 Map

将数组传入 Map 构造函数，就可以转为 Map。

```javascript
new Map([
  [true, 7],
  [{foo: 3}, ['abc']]
])
// Map {
//   true => 7,
//   Object {foo: 3} => ['abc']
// }
```

### Map 转为对象

如果所有 Map 的键都是字符串，它可以无损地转为对象。

```javascript
function strMapToObj(strMap) {
  let obj = Object.create(null);
  for (let [k,v] of strMap) {
    obj[k] = v;
  }
  return obj;
}

const myMap = new Map()
  .set('yes', true)
  .set('no', false);
strMapToObj(myMap)
// { yes: true, no: false }
```

如果有非字符串的键名，那么这个键名会被转成字符串，再作为对象的键名。

### 对象转为 Map

对象转为 Map 可以通过`Object.entries()`。

```javascript
let obj = {"a":1, "b":2};
let map = new Map(Object.entries(obj));
```

此外，也可以自己实现一个转换函数。

```javascript
function objToStrMap(obj) {
  let strMap = new Map();
  for (let k of Object.keys(obj)) {
    strMap.set(k, obj[k]);
  }
  return strMap;
}

objToStrMap({yes: true, no: false})
// Map {"yes" => true, "no" => false}
```

### Map 转为 JSON

Map 转为 JSON 要区分两种情

一种情况是，Map 的键名都是字符串，这时可以选择转为对象 JSON。

```javascript
function strMapToJson(strMap) {
  return JSON.stringify(strMapToObj(strMap));
}

let myMap = new Map().set('yes', true).set('no', false);
strMapToJson(myMap)
// '{"yes":true,"no":false}'
```

另一种情况是，Map 的键名有非字符串，这时可以选择转为数组 JSON。

```javascript
function mapToArrayJson(map) {
  return JSON.stringify([...map]);
}

let myMap = new Map().set(true, 7).set({foo: 3}, ['abc']);
mapToArrayJson(myMap)
// '[[true,7],[{"foo":3},["abc"]]]'
```

### JSON 转为 Map

JSON 转为 Map，正常情况下，所有键名都是字符串。

```javascript
function jsonToStrMap(jsonStr) {
  return objToStrMap(JSON.parse(jsonStr));
}

jsonToStrMap('{"yes": true, "no": false}')
// Map {'yes' => true, 'no' => false}
```

但是，有一种特殊情况，整个 JSON 就是一个数组，且每个数组成员本身，又是一个有两个成员的数组。这时，它可以一一对应地转为 Map。这往往是 Map 转为数组 JSON 的逆操作。

```javascript
function jsonToMap(jsonStr) {
  return new Map(JSON.parse(jsonStr));
}

jsonToMap('[[true,7],[{"foo":3},["abc"]]]')
// Map {true => 7, Object {foo: 3} => ['abc']}
```



# WeakMap

与Map结构类似

区别：

1. 只接受对象作为键名，`null`除外
2. 指向的对象，不计入垃圾回收机制

用于想在某个对象上存放一些数据

有助于防止内存泄漏

键名弱引用

键值任意

```javascript
const wm = new WeakMap();
let key = {};
let obj = {foo: 1};

wm.set(key, obj);
obj = null;
wm.get(key)
// Object {foo: 1}
```

## 语法

1. 没有遍历操作
2. 没有`size`属性
3. 不支持`clear`方法
4. 只有`get()`、`set()`、`has()`、`delete()`







