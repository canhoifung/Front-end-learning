# Array对象

[TOC]

## 构造函数

`Array`作为JavaScript的原生对象，同时也是一个构造函数，可用于生成新数组

有没使用`new`，运行结果一样

```javascript
var arr = new Array(2);
// 等同于
var arr = Array(2);
```

不同的参数行为会不一样：

```javascript
// 无参数时，返回一个空数组
new Array() // []

// 单个正整数参数，表示返回的新数组的长度
new Array(1) // [ empty ]
new Array(2) // [ empty x 2 ]

// 非正整数的数值作为参数，会报错
new Array(3.2) // RangeError: Invalid array length
new Array(-3) // RangeError: Invalid array length

// 单个非数值（比如字符串、布尔值、对象等）作为参数，
// 则该参数是返回的新数组的成员
new Array('abc') // ['abc']
new Array([1]) // [Array[1]]

// 多参数时，所有参数都是返回的新数组的成员
new Array(1, 2) // [1, 2]
new Array('a', 'b', 'c') // ['a', 'b', 'c']
```

> 若参数为正整数，数组成员都为空位
>
> 读取时返回`undefined`，但该位置上没有值
>
> 可以取得`length`属性，但取不到键名
>
> ```javascript
> var a = new Array(3);
> var b = [undefined, undefined, undefined];
> 
> a.length // 3
> b.length // 3
> 
> a[0] // undefined
> b[0] // undefined
> 
> 0 in a // false
> 0 in b // true
> ```

## 静态方法

### `Array.isArray()`

返回一个布尔值，表示参数是否为数组

可以弥补`typeof`运算符的不足

```javascript
var arr = [1, 2, 3];

typeof arr // "object"
Array.isArray(arr) // true
```

## 实例方法

### `valueOf()`、`toString()`

两者都是对象所拥有的方法

数组的`valueOf()`返回数组本身

数组`toString()`返回数组的字符串形式

### `push()`、`pop()`

`push()`在数组末端添加一个或多个元素，并返回添加新元素后的数组长度

> 会改变原数组

```javascript
var arr = [];

arr.push(1) // 1
arr.push('a') // 2
arr.push(true, {}) // 4
arr // [1, 'a', true, {}]
```

`pop()`用于删除数组的最后一个元素，并返回该元素

> 同样会改变原数组

```javascript
var arr = ['a', 'b', 'c'];

arr.pop() // 'c'
arr // ['a', 'b']

//对空数组使用返回undefined
[].pop() // undefined
```

`push()`和`pop()`结合使用，构成“后进先出”的栈结构（stack）

### `shift()`、`unshift()`

`shift()`用于删除数组的第一个元素，并返回该元素

> 会改变原数组

```javascript
var a = ['a', 'b', 'c'];

a.shift() // 'a'
a // ['b', 'c']
```

可以遍历并清空一个数组：

```javascript
var list = [1, 2, 3, 4];
var item;

while (item = list.shift()) {
  console.log(item);
}

list // []
```

`push()`和`shift()`结合使用，构成“先进先出”的队列结构（stack）



`unshift`用于在数组的第一个位置添加元素，并返回添加新元素后的数组长度

> 会改变原数组

```javascript
var a = ['a', 'b', 'c'];

a.unshift('x'); // 4
a // ['x', 'a', 'b', 'c']

//可接收多个参数
var arr = [ 'c', 'd' ];
arr.unshift('a', 'b') // 4
arr // [ 'a', 'b', 'c', 'd' ]
```

### `join()`

以指定参数作为分隔符，将所有数组成员连接为一个字符串返回

若不提供参数，默认使用逗号

```javascript
var a = [1, 2, 3, 4];

a.join(' ') // '1 2 3 4'
a.join(' | ') // "1 | 2 | 3 | 4"
a.join() // "1,2,3,4"
```

若数组成员为`undefined`或`null`，会转化成空字符

```javascript
[undefined, null].join('#')
// '#'

['a',, 'b'].join('-')
// 'a--b'
```

==*==使用`call`方法，可以用于字符串或类似数组的对象：

```javascript
Array.prototype.join.call('hello', '-')
// "h-e-l-l-o"

var obj = { 0: 'a', 1: 'b', length: 2 };
Array.prototype.join.call(obj, '-')
// 'a-b'
```

### `concat()`

用于多个数组的合并

将新数组的成员添加到原数组成员的后部，然后返回一个新数组

> 原数组不变

```javascript
['hello'].concat(['world'])
// ["hello", "world"]

['hello'].concat(['world'], ['!'])
// ["hello", "world", "!"]

[].concat({a: 1}, {b: 2})
// [{ a: 1 }, { b: 2 }]

[2].concat({a: 1})
// [2, {a: 1}]
```

除数组外，还接收其他类型的值作为参数：

```javascript
[1, 2, 3].concat(4, 5, 6)
// [1, 2, 3, 4, 5, 6]
```

若数组成员包括了对象，`concat`方法返回当前数组的一个浅拷贝

即新数组拷贝的是对象的引用

```javascript
var obj = { a: 1 };
var oldArray = [obj];

var newArray = oldArray.concat();

obj.a = 2;
newArray[0].a // 2
```

### `reverse()`

用于颠倒排列数组元素，返回改变后的数组

> 改变原数组

```javascript
var a = ['a', 'b', 'c'];

a.reverse() // ["c", "b", "a"]
a // ["c", "b", "a"]
```

### `slice()`

用于提取目标数组的一部分，返回一个新数组

> 原数组不变

```javascript
arr.slice(start, end);
```

`start`为起始位置（从0开始），`end`为终止位置（但不包括该位置元素，可忽略，忽略则返回到原数组的最后一个成员）

```javascript
var a = ['a', 'b', 'c'];

a.slice(0) // ["a", "b", "c"]
a.slice(1) // ["b", "c"]
a.slice(1, 2) // ["b"]
a.slice(2, 6) // ["c"]
a.slice() // ["a", "b", "c"]
```

若负数则倒数计算位置

若`start`参数大于数组长度，或`end`<`start`，则返回空数组

==**==重要应用：将类似数组的对象转为真正的数组

```javascript
Array.prototype.slice.call({ 0: 'a', 1: 'b', length: 2 })
// ['a', 'b']

Array.prototype.slice.call(document.querySelectorAll("div"));
Array.prototype.slice.call(arguments);
```

### `splice()`

用于删除原数组的一部分成员，并可以在删除的位置添加新的成员，返回被删除的元素

> 会改变原数组

```javascript
arr.splice(start,count,addElement1,addElement2,...);
```

`start`为删除的起始位置（从0开始），`count`为被删除的元素个数，`addElement`为添加的新元素

```javascript
var a = ['a', 'b', 'c', 'd', 'e', 'f'];
a.splice(4, 2, 1, 2) // ["e", "f"]
a // ["a", "b", "c", "d", 1, 2]
```

单纯为了插入元素，`count`设为`0`

若只提供`start`，则将原数组在指定位置拆分成两个数组

### `sort()`

对数组成员进行排序，默认按照字典顺序排序（不是按照大小排序）·

> 原数组被改变

```javascript
['d', 'c', 'b', 'a'].sort()
// ['a', 'b', 'c', 'd']

[4, 3, 2, 1].sort()
// [1, 2, 3, 4]

[11, 101].sort()
// [101, 11]

[10111, 1101, 111].sort()
// [10111, 1101, 111]
```

想按照自定义方式排序，则可以传入一个函数作为参数：

```javascript
[10111, 1101, 111].sort(function (a, b) {
  return a - b;
})
// [111, 1101, 10111]
```

`sort`的函数本身接受两个参数，表示进行比较的两个数组成员

若函数返回值大于`0`，表示第一个成员排在第二个成员后面，其他情况下第一个成员排在第二个成员前面

==*==自定义的排序函数应该返回数值，不推荐返回布尔值

### `map()`

将数组的所有成员依次传入参数函数，然后将每一次执行结果==组成一个新数组==返回

```javascript
var numbers = [1, 2, 3];

numbers.map(function (n) {
  return n + 1;
});
// [2, 3, 4]

numbers
// [1, 2, 3]
```

`map()`方法接收一个函数作为第一个参数

该函数有三个参数：`elem`当前成员值，`index`当前成员位置，`arr`原数组

```javascript
[1, 2, 3].map(function(elem, index, arr) {
  return elem * index;
});
// [0, 2, 6]
```

`map()`方法第二个参数用于绑定回调函数内部的`this`变量：

```javascript
var arr = ['a', 'b', 'c'];

[1, 2].map(function (e) {
  return this[e];
}, arr)
// ['b', 'c']
```

若数组有空位，`map()`方法的回调函数不会在这个位置执行，会跳过

```javascript
var f = function (n) { return 'a' };

[1, undefined, 2].map(f) // ["a", "a", "a"]
[1, null, 2].map(f) // ["a", "a", "a"]
[1, , 2].map(f) // ["a", , "a"]
```

> 不会跳过`undefined`和`null`，但会跳过空位

### `forEach()`

与`map()`类似，但不返回值，只操作数据

用法与`map()`一致

```javascript
function log(element, index, array) {
  console.log('[' + index + '] = ' + element);
}

[2, 5, 9].forEach(log);
// [0] = 2
// [1] = 5
// [2] = 9
```

接收第二个参数：

```javascript
var out = [];

[1, 2, 3].forEach(function(elem) {
  this.push(elem * elem);
}, out);

out // [1, 4, 9]
```

基本就和`map()`一致

### `filter()`

用于过滤数组成员，满足条件的成员组成一个新数组返回

参数是一个函数，所有数组成员会依次执行该函数，返回结果为`true`的成员组成一个新数组返回

> 不会改变原数组

```javascript
[1, 2, 3, 4, 5].filter(function (elem) {
  return (elem > 3);
})
// [4, 5]

var arr = [0, 1, 'a', false];
arr.filter(Boolean)  // [1, "a"]
```

参数函数可以接收三个参数：`elem`当前成员值，`index`当前成员位置，`arr`原数组

```javascript
[1, 2, 3, 4, 5].filter(function (elem, index, arr) {
  return index % 2 === 0;
});
// [1, 3, 5]
```

接收第二个参数，用来绑定参数函数内部的`this`变量

```javascript
var obj = { MAX: 3 };
var myFilter = function (item) {
  if (item > this.MAX) return true;
};

var arr = [2, 8, 3, 4, 1, 3, 2, 9];
arr.filter(myFilter, obj) // [8, 4, 9]
```

### `find()`、`findIndex()`

返回`true`条件的符合find函数的第一个值/索引

### `fill()`

用value重复填充数组

```javascript
arr.fill(value,start,end);
```

### `copyWithin()`

```javascript
arr.copyWithin(target,start,end)
```

`target`：从该位置开始替换数据

`start`：可选，从该位置开始读取数据，默认为0，若为负值则表示倒数

`end`：可选，到该位置前停止读取数据，默认为数组长度，若为负值则表示倒数

```javascript
//  将 3 号位复制到 0 号位
[1, 2, 3, 4, 5].copyWithin(0, 3, 4)
// [4, 2, 3, 4, 5]
// -2 相当于 3 号位， -1 相当于 4 号位
[1, 2, 3, 4, 5].copyWithin(0, -2, -1)
// [4, 2, 3, 4, 5]
//  将 3 号位复制到 0 号位
[].copyWithin.call({length: 5, 3: 1}, 0, 3)
// {0: 1, 3: 1, length: 5}
//  将 2 号位到数组结束，复制到 0 号位
var i32a = new Int32Array([1, 2, 3, 4, 5]);
i32a.copyWithin(0, 2);
// Int32Array [3, 4, 5, 4, 5]
//  对于没有部署 TypedArray 的 copyWithin 方法的平台
//  需要采用下面的写法
[].copyWithin.call(new Int32Array([1, 2, 3, 4, 5]), 0, 3, 4);
// Int32Array [4, 2, 3, 4, 5]
```

### `some()`、`every()`

类似`assert`，返回一个布尔值，表示判断数组成员是否符合某种条件

接收一个函数作为参数，同上

`some()`方法，只要一个成员的返回值为`true`，则返回`true`，否则返回`false`

```javascript
var arr = [1, 2, 3, 4, 5];
arr.some(function (elem, index, arr) {
  return elem >= 3;
});
// true
```

`every`方法，所有成员的返回值为`true`才返回`true`，否则返回`false`

```javascript
var arr = [1, 2, 3, 4, 5];
arr.every(function (elem, index, arr) {
  return elem >= 3;
});
// false
```

均可绑定第二个参数绑定`this`变量

==*==对于空数组

`some()`返回`false`

`every()`返回`true`

回调函数都不会执行

```javascript
function isEven(x) { return x % 2 === 0 }

[].some(isEven) // false
[].every(isEven) // true
```

### `reduce()`、`reduceRight()`

依次处理数组的每个成员，最终累计为一个值

`reduce()`从第一个成员到最后一个，`reduceRight()`则相反

```javascript
[1, 2, 3, 4, 5].reduce(function (a, b) {
  console.log(a, b);
  return a + b;
})
// 1 2
// 3 3
// 6 4
// 10 5
//最后结果：15
```

第一个参数都是函数，接收四个参数：

1. 累计变量，默认为数组的第一个成员
2. 当前变量，默认为数组的第二个成员
3. 当前位置（从0开始）
4. 原数组

前两者必须，后两个可选

第二个参数，用于对累积变量指定初值：

（此时`b`对应数组的第一个成员）

```javascript
[1, 2, 3, 4, 5].reduce(function (a, b) {
  return a + b;
}, 10);
// 25
```

1. 可用于处理空数组：

 ```javascript
 function add(prev, cur) {
   return prev + cur;
 }
 
 [].reduce(add)
 // TypeError: Reduce of empty array with no initial value
 [].reduce(add, 1)
 // 1
 ```

 空数组没有初始值会报错

2. 还可用于找出字符长度最长的数组成员：

```javascript
function findLongest(entries) {
  return entries.reduce(function (longest, entry) {
    return entry.length > longest.length ? entry : longest;
  }, '');
}

findLongest(['aaa', 'bb', 'c']) // "aaa"
```

### `indexOf()`、`lastIndexOf()`

`indexOf()`返回元素在数组中第一次出现的位置，没有出现返回`-1`

```javascript
var a = ['a', 'b', 'c'];

a.indexOf('b') // 1
a.indexOf('y') // -1
```

接收的第二个参数表示搜索的开始位置

```javascript
['a', 'b', 'c'].indexOf('a', 1) // -1
```

`lastIndexOf()`返回元素在数组中最后一次出现的位置，没有出现返回`-1`



这两个方法都不可以用于搜索`NaN`的位置

```javascript
[NaN].indexOf(NaN) // -1
[NaN].lastIndexOf(NaN) // -1
```

> 因为两个方法内部都是使用`===`进行比较，而`NaN !== NaN`

### `includes()`

用于判断数组是否有`value`，有则返回true，否则返回false

```javascript
var a [1,2,3];
a.includes(1);//true
```



### 链式使用

数组方法若返回的是数组，则可以链式使用：

```javascript
var users = [
  {name: 'tom', email: 'tom@example.com'},
  {name: 'peter', email: 'peter@example.com'}
];

users
.map(function (user) {
  return user.email;
})    // [tom@example.com,peter@example.com]
.filter(function (email) {
  return /^t/.test(email);
})   // 过滤以t开头的eamil地址
.forEach(function (email) {
  console.log(email);
});   //打印地址
// "tom@example.com"
```

## Set数据结构

可以保证子项不重复，可以与数组转换

```javascript
const set = new Set()
set.add(1)
set.add(1)
set.add(1)
set.size // 1
const arr = [...set] // arr: [1]
```

