# let，const

let 定义的变量不会被变量提升，const 定义的常量不能被修改，let 和 const 都是块级作用域

提供了块级作用域

不再具备变量提升

声明的变量不属于顶层对象

```javascript
var a = 1;
// 如果在 Node 的 REPL 环境，可以写成 global.a
// 或者采用通用方法，写成 this.a
window.a // 1

let b = 1;
window.b // undefined
```

## let

1. 块级作用域

```JavaScript
{
    let _a = 20;
}
console.log(a);  // a is not defined

// ES5
console.log(a);   // undefined
var a = 20;
 
// ES6
console.log(a); // a is not defined
let a = 20;
```

2. 不能重复声明

```javascript
let a = 1; 
var a = 3;//Identifier 'a' has already been declared

var b = 1;
let b = 3;//Identifier 'b' has already been declared

let c = 1;
let c = 2; //Identifier 'c' has already been declared
```

3. 暂时性死区

```javascript
var tmp = 123;
if(true){
    tmp = 'abc'; //ReferenceError
    let tmp;
};


let x=x;//ReferenceError

function bar(x = y, y = 2) {
  return [x, y];
}
bar(); // 报错

function bar1(x = 2, y = x) {
  return [x, y];
}
bar1(); // [2, 2]
```

`let`命令绑定块级作用域 ，在作用域内`let`声明前都是声明变量的死区，只要用到变量就会报错

4. 避免在块级作用域内声明函数，如果需要也要写成函数表达式而不是函数声明
5. 外层作用域无法获取内层作用域的变量，但内部的可以==定义==外部作用域的同名变量

```javascript
{{{{
  {let insane = 'Hello World'}
  console.log(insane); // 报错
}}}};

{{{{
  let insane = 'Hello World';
  {let insane = 'Hello World'}
}}}};
```

## const

const定义的变量

+ 不可以被修改
+ 必须声明时进行初始化赋值
+ 基础数据类型不能被修改
+ 复合数据类型只保存指向堆内存的指标，对象或数组自身可以修改，指标不变

同样有暂时性死区，无法重复声明，变量不提升

```JavaScript
const a;   //报错 未定义

const b=10;
const b=20; //报错 b已经被定义
b=30;       //报错 b不能被修改

const d={
	a:10,
	b:20,
}
d.c=20;      //添加属性可以成功
d.a=50;      //修改属性可以成功
d={
	a:10,
	b:20,
}            //报错,指向了另外一个对象

const e=[];  //对数组可执行的操作都可以,但是不能赋值为另外一个数组.
```

赋值给冻结对象：

```javascript
const foo = Object.freeze({});
```

# 解构赋值

## 数组的解构赋值

### 模式匹配赋值

```javascript
let [foo, [[bar], baz]] = [1, [[2], 3]];
foo // 1
bar // 2
baz // 3

let [ , , third] = ["foo", "bar", "baz"];
third // "baz"

let [x, , y] = [1, 2, 3];
x // 1
y // 3

let [head, ...tail] = [1, 2, 3, 4];
head // 1
tail // [2, 3, 4]

let [x, y, ...z] = ['a'];
x // "a"
y // undefined
z // []

let [x, y] = [1, 2, 3];
x // 1
y // 2

let [a, [b], d] = [1, [2, 3], 4];
a // 1
b // 2
d // 4

let [x, y, z] = new Set(['a', 'b', 'c']);
x // "a"
```

==只要某种数据结构具有 Iterator 接口，都可以采用数组形式的解构赋值。==

#### 默认值

```javascript
let [foo = true] = [];
foo // true

let [x, y = 'b'] = ['a']; // x='a', y='b'
let [x, y = 'b'] = ['a', undefined]; // x='a', y='b'
```

只有当一个数组成员===undefined时，默认值才会生效

```javascript
let [x = 1] = [undefined];
x // 1

let [x = 1] = [null];
x // null
```

若变量已经声明，可以引用解构赋值的其他变量

```javascript
let [x = 1, y = x] = [];     // x=1; y=1
let [x = 1, y = x] = [2];    // x=2; y=2
let [x = 1, y = x] = [1, 2]; // x=1; y=2
let [x = y, y = 1] = [];     // ReferenceError: y is not defined
```

## 对象解构赋值

对象的变量必须和属性同名才能获取正确的值

```javascript
let { bar, foo } = { foo: 'aaa', bar: 'bbb' };
foo // "aaa"
bar // "bbb"

let { baz } = { foo: 'aaa', bar: 'bbb' };
baz // undefined
```

若变量和属性不同名，则要这样写

```javascript
let { foo: baz } = { foo: 'aaa', bar: 'bbb' };
baz // "aaa"

let obj = { first: 'hello', last: 'world' };
let { first: f, last: l } = obj;
f // 'hello'
l // 'world'

//相当于
let { foo: foo, bar: bar } = { foo: 'aaa', bar: 'bbb' };
```

可用于嵌套结构对象

```javascript
let obj = {
  p: [
    'Hello',
    { y: 'World' }
  ]
};

let { p: [x, { y }] } = obj;
x // "Hello"
y // "World"

let { p, p: [x, { y }] } = obj;
x // "Hello"
y // "World"
p // ["Hello", {y: "World"}]
```

嵌套赋值例子：

```javascript
const node = {
  loc: {
    start: {
      line: 1,
      column: 5
    }
  }
};

let { loc, loc: { start }, loc: { start: { line }} } = node;
line // 1
loc  // Object {start: Object}
start // Object {line: 1, column: 5}
```

```javascript
let obj = {};
let arr = [];

({ foo: obj.prop, bar: arr[0] } = { foo: 123, bar: true });

obj // {prop:123}
arr // [true]
```

==可以取到继承的属性==

#### 默认值

需要对象的属性值严格等于`undefined`

```javascript
var {x = 3} = {x: undefined};
x // 3

var {x = 3} = {x: null};
x // null
```

#### 注意事项

1. 不要讲大括号写在行首

```javascript
// 错误的写法
let x;
{x} = {x: 1};
// SyntaxError: syntax error

// 正确的写法
let x;
({x} = {x: 1});
```

JavaScript 引擎会将`{x}`理解成一个代码块，从而发生语法错误

2. 可以对数组进行对象属性的解构

```javascript
let arr = [1, 2, 3];
let {0 : first, [arr.length - 1] : last} = arr;
first // 1
last // 3
```

## 字符串解构赋值

```javascript
const [a, b, c, d, e] = 'hello';
a // "h"
b // "e"
c // "l"
d // "l"
e // "o"
```

```javascript
let {length : len} = 'hello';
len // 5
```

## 数值和布尔值的解构赋值

若等号右边为数值或布尔值，会先转为对象

```javascript
let {toString: s} = 123;
s === Number.prototype.toString // true

let {toString: s} = true;
s === Boolean.prototype.toString // true
```

## null和undefined的解构赋值

解构赋值规则是等号右侧不是对象或数组就先转为对象

而null和undefined无法转为对象，因此会报错

```javascript
let { prop: x } = undefined; // TypeError
let { prop: y } = null; // TypeError
```

## 函数参数的解构赋值

```javascript
function add([x, y]){
  return x + y;
}

add([1, 2]); // 3

[[1, 2], [3, 4]].map(([a, b]) => a + b);
// [ 3, 7 ]

//默认值
function move({x = 0, y = 0} = {}) {
  return [x, y];
}
move({x: 3, y: 8}); // [3, 8]
move({x: 3}); // [3, 0]
move({}); // [0, 0]
move(); // [0, 0]

//undeifned触发默认值
[1, undefined, 3].map((x = 'yes') => x);
// [ 1, 'yes', 3 ]
```

## 圆括号问题

只要有可能导致解构的歧义，就不得使用圆括号

### 不能使用圆括号的情况

1. 变量声明语句

```javascript
// 全部报错
let [(a)] = [1];

let {x: (c)} = {};
let ({x: c}) = {};
let {(x: c)} = {};
let {(x): c} = {};

let { o: ({ p: p }) } = { o: { p: 2 } };
```

2. 函数参数

函数参数也属于变量声明

```javascript
// 报错
function f([(z)]) { return z; }
// 报错
function f([z,(x)]) { return x; }
```

3. 赋值语句的模式

```javascript
// 全部报错
//将整个模式放在圆括号中
({ p: a }) = { p: 42 };
([a]) = [5];

// 报错
//将一部分模式放在圆括号中
[({ p: a }), { x: c }] = [{}, {}];
```

### 可以使用圆括号的情况

只有当赋值语句的非模式部分可以使用圆括号

```javascript
[(b)] = [3]; // 正确  
({ p: (d) } = {}); // 正确  模式是p而不是d
[(parseInt.prop)] = [3]; // 正确
```

## 用途

### 交换变量值

```javascript
let x = 1;
let y = 2;

[x, y] = [y, x];
```

### 从函数返回多个值

```javascript
// 返回一个数组

function example() {
  return [1, 2, 3];
}
let [a, b, c] = example();

// 返回一个对象

function example() {
  return {
    foo: 1,
    bar: 2
  };
}
let { foo, bar } = example();
```

### 函数参数的定义

```javascript
// 参数是一组有次序的值
function f([x, y, z]) { ... }
f([1, 2, 3]);

// 参数是一组无次序的值
function f({x, y, z}) { ... }
f({z: 3, y: 2, x: 1});
```

### 提取JSON数据**

```javascript
let jsonData = {
  id: 42,
  status: "OK",
  data: [867, 5309]
};

let { id, status, data: number } = jsonData;

console.log(id, status, number);
// 42, "OK", [867, 5309]
```

### 函数参数默认值

```javascript
jQuery.ajax = function (url, {
  async = true,
  beforeSend = function () {},
  cache = true,
  complete = function () {},
  crossDomain = false,
  global = true,
  // ... more config
} = {}) {
  // ... do stuff
};
```

### 遍历Map结构

```javascript
const map = new Map();
map.set('first', 'hello');
map.set('second', 'world');

for (let [key, value] of map) {
  console.log(key + " is " + value);
}
// first is hello
// second is world
```

```javascript
// 获取键名
for (let [key] of map) {
  // ...
}

// 获取键值
for (let [,value] of map) {
  // ...
}
```

### 输入模块的指定方法

```javascript
const { SourceMapConsumer, SourceNode } = require("source-map");
```



# 字符串扩展

## 字符Unicode表示法

允许采用`\uxxxx`表示一个字符，`xxxx`表示字符的Unicode码点

只限于码点在`\u0000`~`\uFFFF`之间的字符，超出的需要用双字节形式表示

```javascript
"\u0061"
// "a"
"\uD842\uDFB7"
// "𠮷
"\u20BB7"
// " 7"
```

若`xxxx`为超过`0xFFFF`的数值，比如`\u20BB7`，JS会理解为`\u20BB+7`，会显示为一个空格加一个7

需要将码点放入大括号来解读

```javascript
"\u{20BB7}"
// "𠮷"

"\u{41}\u{42}\u{43}"
// "ABC"

let hello = 123;
hell\u{6F} // 123

'\u{1F680}' === '\uD83D\uDE80'
// true
```

表示字符的方法

```javascript
'\z' === 'z'  // true
'\172' === 'z' // true
'\x7A' === 'z' // true
'\u007A' === 'z' // true
'\u{7A}' === 'z' // true
```

## 添加了遍历器接口

字符串现在可以被`for...of`循环遍历

可以识别大于`0xFFFF`的码点

```javascript
let text = String.fromCodePoint(0x20BB7);

for (let i = 0; i < text.length; i++) {
  console.log(text[i]);
}
// " "
// " "

for (let i of text) {
  console.log(i);
}
// "𠮷"
```

## 直接输入字符或转义形式

```javascript
'中' === '\u4e2d' // true
```

==5种字符只能使用转义形式不能直接使用：==

- U+005C：反斜杠（reverse solidus)
- U+000D：回车（carriage return）
- U+2028：行分隔符（line separator）
- U+2029：段分隔符（paragraph separator）
- U+000A：换行符（line feed）

==JS字符串可以直接输入U+2028和U+2029==

==正则不可以==

## 模版字符串













# 箭头函数

```JavaScript
// es5
var fn = function(a, b) {
    return a + b;
}

// es6 箭头函数写法，当函数直接被return时，可以省略函数体的括号
const fn = (a, b) => a + b;

// es5
var foo = function() {
    var a = 20；
    var b = 30;
    return a + b;
}

// es6
const foo = () => {
   const a = 20;
   const b = 30;
   return a + b;
}

如果参数不是一个，就需要用括号()括起来：
// 两个参数:
(x, y) => x * x + y * y

// 无参数:
() => 3.14

// 可变参数:
(x, y, ...rest) => {
    var i, sum = x + y;
    for (i=0; i<rest.length; i++) {
        sum += rest[i];
    }
    return sum;
}

如果要返回一个对象，就要注意，如果是单表达式，这么写的话会报错：

// SyntaxError:
x => { foo: x }
因为和函数体的{ ... }有语法冲突，所以要改为：

// 尤其是返回JSON对象时
x => ({ foo: x })
```
>箭头函数可以替换函数表达式，但是不能替换函数声明  
>当函数参数只有一个时，括号可以省略；但是没有参数时，括号不可以省略。  
>函数体（中括号）中有且只有一行return语句时，中括号及return 关键字可以省略。

**特点:**
1. 没有this,super,arguments,new.target绑定  
2. 不能通过new关键字调用  
3. 没有原型  
4. 不能改变this的绑定 继承当前上下文的this  
5. 不支持arguments对象  
6. 不支持重复命名的参数  

# 继承 class、extends、super
```JavaScript
class Animal {
    constructor() {
        this.type = 'animal';
    }
    says(say) {
        console.log(this.type + ' says ' + say);
    }
}

let animal = new Animal();
animal.says('hello'); //animal says hello

//通过extends关键字实现继承
class Cat extends Animal {
    constructor() {
    //必须调用super方法,否则会报错
        super();
        this.type = 'cat';
    }
}

let cat = new Cat();
cat.says('hello'); //cat says hello


////////////////////
class Colorpoint extends Point {
  constructor(x,y,color){
      super(x,y); //调用父类的constructor(x,y)
      this.color = color
  }
  toString(){
  //调用父类的方法
      return this.color + ' ' + super.toString();
}
}
```
>constructor内定义的方法和属性是实例对象自己的，而constructor外定义的方法和属性则是所有实力对象可以共享的  

# 模版字符串
```JavaScript
// es6
const a = 20;
const b = 30;
const string = `${a}+${b}=${a+b}`;

// es5
var a = 20;
var b = 30;
var string = a + "+" + b + "=" + (a + b);
```
使用 `` 将整个字符串包裹起来，而在其中使用 ${} 来包裹一个变量或者一个表达式。



# 函数默认参数
```JavaScript
//ES5
function add(x, y) {
    var x = x || 20;
    var y = y || 30;
    return x + y;
}

console.log(add()); // 50

//ES6
function add(x = 20, y = 30) {
    return x + y;
}

console.log(add());
```

# 展开运算符
```JavaScript
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 10, 20, 30];

// 这样，arr2 就变成了[1, 2, 3, 10, 20, 30];

//对对象数据
const obj1 = {
  a: 1,
  b: 2, 
  c: 3
}

const obj2 = {
  ...obj1,
  d: 4,
  e: 5,
  f: 6
}

// 结果类似于 const obj2 = Object.assign({}, obj1, {d: 4})

//用于解析结构
const add = (a, b, ...more) => {
    return more.reduce((m, n) => m + n) + a + b
}

console.log(add(1, 23, 1, 2, 3, 4, 5)) // 39
```

# 对象字面量与class
```JavaScript
const name = 'Jane';
const age = 20

// es6
const person = {
  name,
  age
}

// es5
var person = {
  name: name,
  age: age
};
```