# Obejct对象

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

```javascript
//jQuery方法
$('#result').append(
  'There are <b>' + basket.count + '</b> ' +
  'items in your basket, ' +
  '<em>' + basket.onSale +
  '</em> are on sale!'
);
//-->
$('#result').append(`
  There are <b>${basket.count}</b> items
   in your basket, <em>${basket.onSale}</em>
  are on sale!
`);
```

模版字符串用反引号==`==标识，可以用于普通字符串、定义多行字符串、或者字符串中嵌入变量

```javascript
// 普通字符串
`In JavaScript '\n' is a line-feed.`

// 多行字符串
`In JavaScript this is
 not legal.`

console.log(`string text line 1
string text line 2`);

// 字符串中嵌入变量
let name = "Bob", time = "today";
`Hello ${name}, how are you ${time}?`
```

如果模版字符串里面要用到反引号，就需要使用反斜杠转义

```javascript
let greeting = `\`Yo\` World!`;
```

模版字符串的变量需要写在`${}`中，且大括号里面可以写任意JavaScript表达式，包括函数

```javascript
let x = 1;
let y = 2;

`${x} + ${y} = ${x + y}`
// "1 + 2 = 3"

`${x} + ${y * 2} = ${x + y * 2}`
// "1 + 4 = 5"

let obj = {x: 1, y: 2};
`${obj.x + obj.y}`
// "3"

function fn() {
  return "Hello World";
}
`foo ${fn()} bar`
// foo Hello World bar
```

若变量没有声明将报错

可以嵌套：

```javascript
const tmpl = addrs => `
  <table>
  ${addrs.map(addr => `
    <tr><td>${addr.first}</td></tr>
    <tr><td>${addr.last}</td></tr>
  `).join('')}
  </table>
`;
const data = [
    { first: '<Jane>', last: 'Bond' },
    { first: 'Lars', last: '<Croft>' },
];
console.log(tmpl(data));
// <table>
//
//   <tr><td><Jane></td></tr>
//   <tr><td>Bond</td></tr>
//
//   <tr><td>Lars</td></tr>
//   <tr><td><Croft></td></tr>
//
// </table>
```

## 实例模版编译

常规模版：使用`<%...%>`放置JavaScript代码，使用`<%=...%>`输出JavaScript表达式

```javascript
let template = `
<ul>
  <% for(let i=0; i < data.supplies.length; i++) { %>
    <li><%= data.supplies[i] %></li>
  <% } %>
</ul>
`;
```

将其转为JavaScript表达式字符串：

```javascript
echo('<ul>');
for(let i=0; i < data.supplies.length; i++) {
  echo('<li>');
  echo(data.supplies[i]);
  echo('</li>');
};
echo('</ul>');
```

使用正则表达式转换：

```javascript
let evalExpr = /<%=(.+?)%>/g;
let expr = /<%([\s\S]+?)%>/g;

template = template
  .replace(evalExpr, '`); \n  echo( $1 ); \n  echo(`')
  .replace(expr, '`); \n $1 \n  echo(`');

template = 'echo(`' + template + '`);';
```

将`template`封装在函数内：

```javascript
let script =
`(function parse(data){
  let output = "";

  function echo(html){
    output += html;
  }

  ${ template }

  return output;
})`;

return script;
```

完整函数：

```javascript
function compile(template){
  const evalExpr = /<%=(.+?)%>/g;
  const expr = /<%([\s\S]+?)%>/g;

  template = template
    .replace(evalExpr, '`); \n  echo( $1 ); \n  echo(`')
    .replace(expr, '`); \n $1 \n  echo(`');

  template = 'echo(`' + template + '`);';

  let script =
  `(function parse(data){
    let output = "";

    function echo(html){
      output += html;
    }

    ${ template }

    return output;
  })`;

  return script;
}
```

## 标签模版

模版字符串紧跟在函数名后，可以作为参数调用函数

```javascript
alert`hello`
// 等同于
alert(['hello'])
```

若模版字符里面有变量，会先将模版字符串处理为多个参数，再调用函数

```javascript
let a = 5;
let b = 10;

tag`Hello ${ a + b } world ${ a * b }`;
// 等同于
tag(['Hello ', ' world ', ''], 15, 50);

function tag(stringArr, value1, value2){
  // ...
}
// 等同于
function tag(stringArr, ...values){
  // ...
}
```

stringArr为一个数组，表示模版字符串中没有变量替换的部分，变量替换发生再数组的成员之间，因此这里最后会有一个`‘'`

其他参数为模版字符串中的变量

==可以用于过滤HTML字符串==

```javascript
let message =
  SaferHTML`<p>${sender} has sent you a message.</p>`;

function SaferHTML(templateData) {
  let s = templateData[0];
  for (let i = 1; i < arguments.length; i++) {
    let arg = String(arguments[i]);

    // Escape special characters in the substitution.
    s += arg.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");

    // Don't escape special characters in the template.
    s += templateData[i];
  }
  return s;
}

let sender = '<script>alert("abc")</script>'; // 恶意代码
let message = SaferHTML`<p>${sender} has sent you a message.</p>`;
message
// <p>&lt;script&gt;alert("abc")&lt;/script&gt; has sent you a message.</p>
```

## 模版字符串限制

默认将字符串转义

如果遇到不合法的字符串

标签模版解析字符串时转义会返回`undefined`

标签模版的场合就会报错

```javascript
function tag(strs) {
  strs[0] === undefined
  strs.raw[0] === "\\unicode and \\u{55}";
}
tag`\unicode and \u{55}`

let bad = `bad escape sequence: \unicode`; // 报错
```





# 字符串新增方法

## String.fromCodePoint()

从Unicode码点返回对应字符

能识别码点大于`0xFFFF`的字符

```javascript
String.fromCharCode(0x20BB7)
// "ஷ"
//最高位2被舍弃，返回码点U+0BB7对应字符

String.fromCodePoint(0x20BB7)
// "𠮷"
String.fromCodePoint(0x78, 0x1f680, 0x79) === 'x\uD83D\uDE80y'
// true
//多个参数会合并成一个字符串返回
```

## String.raw()

返回一个斜杠被转义的字符串，用于模版字符串的处理方法

```javascript
String.raw`Hi\n${2+3}!`
// 实际返回 "Hi\\n5!"，显示的是转义后的结果 "Hi\n5!"

String.raw`Hi\u000A!`;
// 实际返回 "Hi\\u000A!"，显示的是转义后的结果 "Hi\u000A!"
```

```javascript
String.raw`Hi\\n`
// 返回 "Hi\\\\n"

String.raw`Hi\\n` === "Hi\\\\n" // true
```

```javascript
// `foo${1 + 2}bar`
// 等同于
String.raw({ raw: ['foo', 'bar'] }, 1 + 2) // "foo3bar"
```

实现代码：

```javascript
String.raw = function (strings, ...values) {
  let output = '';
  let index;
  for (index = 0; index < values.length; index++) {
    output += strings.raw[index] + values[index];
  }

  output += strings.raw[index]
  return output;
}
```

## 实例方法：codePointAt()

能正常处理4个字节存储的字符，并返回一个字符的码点

```javascript
var s = "𠮷";
s.length // 2
s.charAt(0) // ''
s.charAt(1) // ''
s.charCodeAt(0) // 55362
s.charCodeAt(1) // 57271

let s1 = '𠮷a';
//会将上面的看作三个字符
s1.codePointAt(0) // 134071
s1.codePointAt(1) // 57271
s1.codePointAt(2) // 97
```

```javascript
//测试一个字符是由四个字节还是两个字节组成
function is32Bit(c) {
  return c.codePointAt(0) > 0xFFFF;
}

is32Bit("𠮷") // true
is32Bit("a") // false
```

## 实例方法：normalize()

用于将字符的不同表示方法统一为同样的形式，即Unicode正规化

```javascript
'\u01D1'.normalize() === '\u004F\u030C'.normalize()
// true
```

接收一个参数指定`normalize()`的方式：

- `NFC`，默认参数，表示“标准等价合成”（Normalization Form Canonical Composition），返回多个简单字符的合成字符。所谓“标准等价”指的是视觉和语义上的等价。
- `NFD`，表示“标准等价分解”（Normalization Form Canonical Decomposition），即在标准等价的前提下，返回合成字符分解的多个简单字符。
- `NFKC`，表示“兼容等价合成”（Normalization Form Compatibility Composition），返回合成字符。所谓“兼容等价”指的是语义上存在等价，但视觉上不等价，比如“囍”和“喜喜”。（这只是用来举例，`normalize`方法不能识别中文。）
- `NFKD`，表示“兼容等价分解”（Normalization Form Compatibility Decomposition），即在兼容等价的前提下，返回合成字符分解的多个简单字符。

## 实例方法：includes()，startsWith()，endsWith()

- **includes()**：返回布尔值，表示是否找到了参数字符串。
- **startsWith()**：返回布尔值，表示参数字符串是否在原字符串的头部。
- **endsWith()**：返回布尔值，表示参数字符串是否在原字符串的尾部。

```javascript
let s = 'Hello world!';
s.startsWith('Hello') // true
s.endsWith('!') // true
s.includes('o') // true

s.startsWith('world', 6) // true    从第N个到字符串结束
s.endsWith('Hello', 5) // true   针对前N个字符
s.includes('Hello', 6) // false   从第N个到字符串结束
```

都支持第二个参数，表示要搜索的位置

## 实例方法：repeat()

返回一个新字符串，表示将原字符串重复`n`次

```javascript
'x'.repeat(3) // "xxx"
'hello'.repeat(2) // "hellohello"
'na'.repeat(0) // ""
//小数取整
'na'.repeat(2.9) // "nana"
//负数或Infinity报错
'na'.repeat(Infinity) // RangeError
'na'.repeat(-1)  // RangeError
//NaN等同0
'na'.repeat(NaN) // ""
//字符串先转为数字
'na'.repeat('na') // ""
'na'.repeat('3') // "nanana"
```

## 实例方法：padStart()，padEnd()

补全字符串长度

```javascript
'x'.padStart(5, 'ab') // 'ababx'
'x'.padStart(4, 'ab') // 'abax'

'x'.padEnd(5, 'ab') // 'xabab'
'x'.padEnd(4, 'ab') // 'xaba'

'abc'.padStart(10, '0123456789')
// '0123456abc'

'x'.padStart(4) // '   x'
'x'.padEnd(4) // 'x   '
```

如果原字符串长度大于等于最大长度，则返回原字符串

补全字符串和原字符串长度之和大于最大长度，就截去超出位数的补全字符串

省略第二个参数就默认用空格补全长度

==可以用作提示字符串格式==

```javascript
'12'.padStart(10, 'YYYY-MM-DD') // "YYYY-MM-12"
'09-12'.padStart(10, 'YYYY-MM-DD') // "YYYY-09-12"
```

## 实例方法：trimStart()，trimEnd()

不会修改原字符串

```javascript
const s = '  abc  ';

s.trim() // "abc"
s.trimStart() // "abc  "
s.trimEnd() // "  abc"
```

## 实例方法：matchAll()

返回正则表达式在当前字符串的所有匹配



# 正则的扩展

## 构造函数改动

```javascript
new RegExp(/abc/ig, 'i').flags
// "i"
```

如果第一个参数为正则对象，第二个参数可以指定修饰符，若指定了就会忽略正则对象原有的修饰符

## 字符串正则方法

ES6 将这 4 个方法，在语言内部全部调用`RegExp`的实例方法，从而做到所有与正则相关的方法，全都定义在`RegExp`对象上。

- `String.prototype.match` 调用 `RegExp.prototype[Symbol.match]`
- `String.prototype.replace` 调用 `RegExp.prototype[Symbol.replace]`
- `String.prototype.search` 调用 `RegExp.prototype[Symbol.search]`
- `String.prototype.split` 调用 `RegExp.prototype[Symbol.split]`

## u修饰符

含义为Unicode模式，用于正确处理大于`\uFFFF`的Unicode字符

```javascript
/^\uD83D/u.test('\uD83D\uDC2A') // false
/^\uD83D/.test('\uD83D\uDC2A') // true
```

### 点字符

添加`u`修饰符后可以匹配大于`\uFFFF`的Unicode字符

```javascript
var s = '𠮷';

/^.$/.test(s) // false
/^.$/u.test(s) // true
```

### Unicode字符表示法

```javascript
/\u{61}/.test('a') // false
/\u{61}/u.test('a') // true
/\u{20BB7}/u.test('𠮷') // true
```

使用大括号表示Unicode字符必须使用`u`修饰符，否则被解读为量词

### 量词

使用`u`修饰符后，所有两次都会正确识别大于`\uFFFF`的Unicode字符

```javascript
/a{2}/.test('aa') // true
/a{2}/u.test('aa') // true
/𠮷{2}/.test('𠮷𠮷') // false
/𠮷{2}/u.test('𠮷𠮷') // true
```

### 预定义模式

```javascript
/^\S$/.test('𠮷') // false
/^\S$/u.test('𠮷') // true
```

正确匹配字符串长度：

```javascript
function codePointLength(text) {
  var result = text.match(/[\s\S]/gu);
  return result ? result.length : 0;
}

var s = '𠮷𠮷';

s.length // 4
codePointLength(s) // 2
```

### i修饰符

有些 Unicode 字符的编码不同，但是字型很相近，比如，`\u004B`与`\u212A`都是大写的`K`。

```JavaScript
/[a-z]/i.test('\u212A') // false
/[a-z]/iu.test('\u212A') // true
```

上面代码中，不加`u`修饰符，就无法识别非规范的`K`字符

### 转义

没有`u`修饰符的情况下，正则中没有定义的转义（如逗号的转义`\,`）无效，而在`u`模式会报错。

```javascript
/\,/ // /\,/
/\,/u // 报错
```

上面代码中，没有`u`修饰符时，逗号前面的反斜杠是无效的，加了`u`修饰符就报错。

## RegExp.prototype.unicode属性

表示是否设置了`u`修饰符

```javascript
const r1 = /hello/;
const r2 = /hello/u;

r1.unicode // false
r2.unicode // true
```

## y修饰符

粘连修饰符，与`g`类似都是全局匹配，但是匹配必须从剩余的第一个位置开始

```javascript
var s = 'aaa_aa_a';
var r1 = /a+/g;
var r2 = /a+/y;

r1.exec(s) // ["aaa"]
r2.exec(s) // ["aaa"]

r1.exec(s) // ["aa"]
r2.exec(s) // null
```

单一`y`对`match`方法只能返回第一个匹配，需要和`g`修饰符联用

```javascript
'a1a2a3'.match(/a\d/y) // ["a1"]
'a1a2a3'.match(/a\d/gy) // ["a1", "a2", "a3"]
```



# 数值的拓展

## Number.isFinite()，Number.isNan()

检查一个数值是否为有限的（finite）

```javascript
Number.isFinite(15); // true
Number.isFinite(0.8); // true
Number.isFinite(NaN); // false
Number.isFinite(Infinity); // false
Number.isFinite(-Infinity); // false
Number.isFinite('foo'); // false
Number.isFinite('15'); // false
Number.isFinite(true); // false
```

只要不是数值类型一律返回`false`

```javascript
Number.isNaN(NaN) // true
Number.isNaN(15) // false
Number.isNaN('15') // false
Number.isNaN(true) // false
Number.isNaN(9/NaN) // true
Number.isNaN('true' / 0) // true
Number.isNaN('true' / 'true') // true
```



这两个方法只对数值有效，传统的全局方法`isFinite()`和`isNaN()`需要先调用`Number()`将非数值转为数值再判断

## Number.parseInt(), Number.parseFloat()

将全局方法移植到`Number`上，行为一致

可以减少全局性方法

## Number.isInteger()

判断一个数值是否为整数

数值精度最多53个二进制位

## Number.EPSILON

表示1与大于1的最小浮点数之间的差

```javascript
Number.EPSILON === Math.pow(2, -52)
// true
Number.EPSILON
// 2.220446049250313e-16
Number.EPSILON.toFixed(20)
// "0.00000000000000022204"
```

可以用于表示可以接受的误差范围

```javascript
function withinErrorMargin (left, right) {
  return Math.abs(left - right) < Number.EPSILON * Math.pow(2, 2);
}

0.1 + 0.2 === 0.3 // false
withinErrorMargin(0.1 + 0.2, 0.3) // true

1.1 + 1.3 === 2.4 // false
withinErrorMargin(1.1 + 1.3, 2.4) // true
```



# 函数的扩展

## 函数使用

### 函数参数默认值

使用参数默认值的话不能有同名参数

```javascript
// 不报错
function foo(x, x, y) {
  // ...
}

// 报错
function foo(x, x, y = 1) {
  // ...
}
// SyntaxError: Duplicate parameter name not allowed in this context
```

每次都是重新计算默认表达式的值，不传值

```javascript
let x = 99;
function foo(p = x + 1) {
  console.log(p);
}

foo() // 100

x = 100;
foo() // 101
```

### 与解构赋值默认值结合

```javascript
function foo({x, y = 5}) {
  console.log(x, y);
}

foo({}) // undefined 5
foo({x: 1}) // 1 5
foo({x: 1, y: 2}) // 1 2
foo() // TypeError: Cannot read property 'x' of undefined
```

```javascript
function foo({x, y = 5} = {}) {
  console.log(x, y);
}

foo() // undefined 5
```

如果函数的参数为对象，就不能省略第二个参数，除非对象参数设置了默认值

```javascript
//情况1：
    function fetch(url, { body = '', method = 'GET', headers = {} }) {
        console.log(method);
    }

    fetch('http://example.com', {})
    // "GET"

    fetch('http://example.com')
    // 报错
//情况2：
    function fetch(url, { body = '', method = 'GET', headers = {} } = {}) 	{
      console.log(method);
    }

    fetch('http://example.com')
    // "GET"
```

是否设置对象结构赋值默认值的区别：

```javascript
// 写法一:函数参数的默认值是空对象，但是设置了对象解构赋值的默认值
function m1({x = 0, y = 0} = {}) {
  return [x, y];
}

// 写法二:函数参数的默认值是一个有具体属性的对象，但是没有设置对象解构赋值的默认值
function m2({x, y} = { x: 0, y: 0 }) {
  return [x, y];
}
```

```javascript
// 函数没有参数的情况
m1() // [0, 0]
m2() // [0, 0]

// x 和 y 都有值的情况
m1({x: 3, y: 8}) // [3, 8]
m2({x: 3, y: 8}) // [3, 8]

// x 有值，y 无值的情况
m1({x: 3}) // [3, 0]
m2({x: 3}) // [3, undefined]

// x 和 y 都无值的情况
m1({}) // [0, 0];
m2({}) // [undefined, undefined]

m1({z: 3}) // [0, 0]
m2({z: 3}) // [undefined, undefined]
```

### 参数默认值的位置问题

定义默认值的参数应该是函数的末尾参数，这样可以判断到底可以省略哪些参数

如果是非末尾参数的话实际上是没有办法省略的，若要用默认值只能传入undefined

### length属性返回值改变

设置默认值后，length将返回没有指定默认值的参数个数

```javascript
(function (a) {}).length // 1
(function (a = 5) {}).length // 0
(function (a, b, c = 5) {}).length // 2
```

==`length`的含义：函数预期传入的参数个数==

设置了rest参数也不会计入length属性

## rest参数

rest参数：`...变量名`

用于获取函数的多余参数，是一个数组

而`arguments`是一个类似数组的对象，要使用数组的方法，需要先`Array.prototype.slice.call`转为数组

==rest只能作为最后一个参数==

## name属性

返回函数的函数名

ES6的`name`会返回函数声明的函数名和函数表达式的变量名

而ES6的`name`对于函数表达式会返回空字符串

若函数具有名，且赋值给变量，则还是返回原来的名字

## 箭头函数

使用`=>`定义函数

参数部分用圆括号包裹

代码块只有一条返回语句，可以省略大括号和return语句

代码块多于一条语句就使用大括号包裹，并用return返回

==如果返回的是一个对象，需要大括号外包一个括号来解析==

==如果不需要返回值且只有一行语句，就使用`void doesNotReturn()`来写==

参数可以搭配解构赋值

```javascript
const full = ({ first, last }) => first + ' ' + last;

// 等同于
function full(person) {
  return person.first + ' ' + person.last;
}
```

### 使用注意点

1. 函数体内的`this`对象，就是定义时所在的对象，而不是使用时所在的对象。

```javascript
function Timer() {
  this.s1 = 0;
  this.s2 = 0;
  // 箭头函数
  setInterval(() => this.s1++, 1000);
  // 普通函数
  setInterval(function () {
    this.s2++;
  }, 1000);
}

var timer = new Timer();

setTimeout(() => console.log('s1: ', timer.s1), 3100);
setTimeout(() => console.log('s2: ', timer.s2), 3100);
// s1: 3
// s2: 0
//s2的this指向执行时所在的作用域，即window
```

2. 不可以当作构造函数，也就是说，不可以使用`new`命令，否则会抛出一个错误。

==因为箭头函数没有自己的`this`==

```javascript
// ES6
function foo() {
  setTimeout(() => {
    console.log('id:', this.id);
  }, 100);
}

// ES5
function foo() {
  var _this = this;

  setTimeout(function () {
    console.log('id:', _this.id);
  }, 100);
}
```

3. 不可以使用`arguments`对象，该对象在函数体内不存在。如果要用，可以用 rest 参数代替。

4. 不可以使用`yield`命令，因此箭头函数不能用作 Generator 函数。

### 不适用场合

1. 定义对象的方法，且方法内部包含`this`

```javascript
const cat = {
  lives: 9,
  jumps: () => {
    this.lives--;
  }
}
//对象不构成单独的作用域，因此jumps指向全局作用域
```

2. 需要动态`this`时

如设置监听函数

## Function.prototype.toString()更改

现在不会省略注释和空格，会返回一模一样的原始代码

```javascript
function /* foo comment */ foo () {}

foo.toString()
// "function /* foo comment */ foo () {}"
```



# 数组的扩展

## 扩展运算符`...`

类似rest参数的逆运算，将一个数组转为用逗号分割的参数序列

```javascript
console.log(...[1, 2, 3])
// 1 2 3

console.log(1, ...[2, 3, 4], 5)
// 1 2 3 4 5

[...document.querySelectorAll('div')]
// [<div>, <div>, <div>]

[...[], 1]
// [1]
```

==扩展运算符后是一个空数组，则不产生效果==

1. 可以替代apply

```javascript
// ES5 的写法
Math.max.apply(null, [14, 3, 77])

// ES6 的写法
Math.max(...[14, 3, 77])

// 等同于
Math.max(14, 3, 77);
```

2. 可用于克隆数组

```javascript
//ES5
const a1 = [1, 2];
const a2 = a1.concat();
a2[0] = 2;
a1 // [1, 2]

//ES6
const a1 = [1, 2];
// 写法一
const a2 = [...a1];
// 写法二
const [...a2] = a1;
```

3. 合并数组

```javascript
const arr1 = ['a', 'b'];
const arr2 = ['c'];
const arr3 = ['d', 'e'];

// ES5 的合并数组
arr1.concat(arr2, arr3);
// [ 'a', 'b', 'c', 'd', 'e' ]

// ES6 的合并数组
[...arr1, ...arr2, ...arr3]
// [ 'a', 'b', 'c', 'd', 'e' ]
```

4. 和解构赋值结合

```javascript
//这种情况下扩展运算符只能放在参数最后一位
const [first, ...rest] = [1, 2, 3, 4, 5];
first // 1
rest  // [2, 3, 4, 5]
```

5. 将字符串转为数组

```javascript
[...'hello']
// [ "h", "e", "l", "l", "o" ]
```

6. Map、Set结构，Generator函数都可以使用扩展运算符
7. ==会将数组的空位转为`undefined`==

因为他们都部署了Iterator接口

## Array.from()

用于将类似数组的对象和可遍历对象转为数组

==需要部署了`Iterator`接口的数据结构或者拥有`length`属性==

```javascript
let arrayLike = {
    '0': 'a',
    '1': 'b',
    '2': 'c',
    length: 3
};

// ES5的写法
var arr1 = [].slice.call(arrayLike); // ['a', 'b', 'c']

// ES6的写法
let arr2 = Array.from(arrayLike); // ['a', 'b', 'c']
```

可以接收第二个参数，作用类似数组的`map`，接受一个函数

如果第二个参数的`map`函数内用到了`this`，还可以传入第三个参数绑定`this`

可以转换字符串

==会将数组的空位转为`undefined`==

## Array.of()

用于将一组值转换为数组

可以用于替代`Array()`和`new Array()`，来防止以下这种情况

```javascript
Array() // []
Array(3) // [, , ,]
Array(3, 11, 8) // [3, 11, 8]

Array.of() // []
Array.of(undefined) // [undefined]
Array.of(1) // [1]
Array.of(1, 2) // [1, 2]
```

功能类似：

```javascript
function ArrayOf(){
  return [].slice.call(arguments);
}
```

## 对数组空位的处理

空位，指没有任何值，而不是undefined

```javascript
0 in [undefined, undefined, undefined] // true
0 in [, , ,] // false
```



ES5:

- `forEach()`, `filter()`, `reduce()`, `every()` 和`some()`都会跳过空位。
- `map()`会跳过空位，但会保留这个值
- `join()`和`toString()`会将空位视为`undefined`，而`undefined`和`null`会被处理成空字符串。

ES6:

明确空位转为`undefined`

+ `Array.from`将数组空位转为`undefined`
+ `...`扩展运算符将数组空位转为`undefined`
+ `copyWithin()`会连空位一起拷贝
+ `fill`连空位也会填充
+ `for...of`会遍历空位
+ `entries()`、`keys()`、`values()`、`find()`和`findIndex()`会将空位处理成`undefined`。



# 对象的拓展

## 属性简洁表示

在大括号内直接写入变量和函数

属性名就是变量名，属性值就是变量值

```javascript
const foo = 'bar';
const baz = {foo};
baz // {foo: "bar"}

// 等同于
const baz = {foo: foo};
```

```javascript
const o = {
  method() {
    return "Hello!";
  }
};

// 等同于

const o = {
  method: function() {
    return "Hello!";
  }
};
```

==不能用于构造函数==

## 属性名表达式

ES6允许把表达式放在方括号内

```javascript
//定义属性名
let lastWord = 'last word'
const a = {
  'first word': 'hello',
  [lastWord]: 'world'
};
a['first word'] // "hello"
a[lastWord] // "world"
a['last word'] // "world"

//定义方法名
let obj = {
  ['h' + 'ello']() {
    return 'hi';
  }
};
obj.hello() // hi
```

==不能与简洁表示法共用，会报错==

==属性名表达式如果是对象，默认会将其转为字符串`[object Object]`==

## name属性

正常返回函数名

若使用了取值函数和存值函数，则属性会在这两个属性上

```javascript
const obj = {
  get foo() {},
  set foo(x) {}
};

obj.foo.name
// TypeError: Cannot read property 'name' of undefined

const descriptor = Object.getOwnPropertyDescriptor(obj, 'foo');

descriptor.get.name // "get foo"
descriptor.set.name // "set foo"
```

特殊情况：

+ `bind`方法创造的函数，`name`属性返回`bound`加上原函数的名字
+ `Function`构造函数创造的函数，`name`属性返回`anonymous`

+ 若为`Symbol`值，则返回Symbol值的描述

```javascript
const key1 = Symbol('description');
const key2 = Symbol();
let obj = {
  [key1]() {},
  [key2]() {},
};
obj[key1].name // "[description]"
obj[key2].name // ""
```

## enumerable可枚举性属性

若为`false`，则四个操作会忽略这个属性

- `for...in`循环：只遍历对象自身的和==继承的==可枚举的属性。
- `Object.keys()`：返回对象自身的所有可枚举的属性的键名。
- `JSON.stringify()`：只串行化对象自身的可枚举的属性。
- `Object.assign()`： 忽略`enumerable`为`false`的属性，只拷贝对象自身的可枚举的属性。

ES6中所有Class的原型的方法都是不可枚举的

## 属性遍历方法

**（1）for...in**

遍历对象自身的和继承的可枚举属性（不含 Symbol 属性）。

**（2）Object.keys(obj)**

返回一个数组，包括对象自身的（不含继承的）所有可枚举属性（不含 Symbol 属性）的键名。

**（3）Object.getOwnPropertyNames(obj)**

返回一个数组，包含对象自身的所有属性（不含 Symbol 属性，但是==包括不可枚举==属性）的键名。

**（4）Object.getOwnPropertySymbols(obj)**

返回一个数组，包含对象自身的所有 Symbol 属性的键名。

**（5）Reflect.ownKeys(obj)**

返回一个数组，包含对象自身的（不含继承的）所有键名，不管键名是 Symbol 或字符串，也不管是否可枚举。

### 遍历次序规则

- 首先遍历所有数值键，按照数值升序排列。
- 其次遍历所有字符串键，按照加入时间升序排列。
- 最后遍历所有 Symbol 键，按照加入时间升序排列。

## super关键字

类似`this`，但`super`指向当前对象的原型对象

相当于：`Object.getPrototyeOf(this).foo`

```javascript
const proto = {
  foo: 'hello'
};

const obj = {
  foo: 'world',
  find() {
    return super.foo;
  }
};

Object.setPrototypeOf(obj, proto);
obj.find() // "hello"
```

==只能用在对象的方法中==

==而目前只有对象方法的简写法可以让JavaScript引擎确认是对象的方法==

```javascript
// 报错
const obj = {
  foo: function () {
    return super.foo
  }
}
```

```javascript
const proto = {
  x: 'hello',
  foo() {
    console.log(this.x);
  },
};
const obj = {
  x: 'world',
  foo() {
    super.foo();
  }
}
Object.setPrototypeOf(obj, proto);
obj.foo() // "world"
```

上面的`super.foo`指向原型对象`proto`的`foo`，但是这里绑定的`this`指向的是当前对象`obj`

## 扩展运算符

### 解构赋值

```javascript
let { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 };
x // 1
y // 2
z // { a: 3, b: 4 }
```

==必须是最后一个参数==

==浅拷贝==

```javascript
let obj = { a: { b: 1 } };
let { ...x } = obj;
obj.a.b = 2;
x.a.b // 2
```

==不会复制继承自原型对象的属性==

### 扩展运算符

用于取出参数对象的所有可遍历属性，拷贝到当前对象中

```javascript
let z = { a: 3, b: 4 };
let n = { ...z };
n // { a: 3, b: 4 }

let foo = { ...['a', 'b', 'c'] };
foo
// {0: "a", 1: "b", 2: "c"}
```

==若参数不是对象，会自动转为包装对象==

==若参数是一个字符串，会转为类似数组的对象==

可用于合并对象

```javascript
let ab = { ...a, ...b };
// 等同于
let ab = Object.assign({}, a, b);
```

如果用户自定义的属性，放在扩展运算符后面，则扩展运算符内部的同名属性会被覆盖掉

```javascript
let aWithOverrides = { ...a, x: 1, y: 2 };
// 等同于
let aWithOverrides = { ...a, ...{ x: 1, y: 2 } };
// 等同于
let x = 1, y = 2, aWithOverrides = { ...a, x, y };
// 等同于
let aWithOverrides = Object.assign({}, a, { x: 1, y: 2 });
```

把自定义属性放在扩展运算符前面，就变成了设置新对象的默认属性值。

```javascript
let aWithDefaults = { x: 1, y: 2, ...a };
// 等同于
let aWithDefaults = Object.assign({}, { x: 1, y: 2 }, a);
// 等同于
let aWithDefaults = Object.assign({ x: 1, y: 2 }, a);
```

## 链判断运算符 `?.`

```javascript
const firstName = message?.body?.user?.firstName || 'default';
const fooValue = myForm.querySelector('input[name=foo]')?.value
```

判断左侧对象是否为`null`或`undefined`，是就返回`undefined`，否就表示对象存在继续运算

用法：

- `obj?.prop` // 对象属性
- `obj?.[expr]` // 同上
- `func?.(...args)` // 函数或对象方法的调用

特殊情况

1. 短路机制

```javascript
a?.[++x]
// 等同于
a == null ? undefined : a[++x]
```

2. delete运算符

```javascript
delete a?.b
// 等同于
a == null ? undefined : delete a.b
```

3. 括号

```javascript
(a?.b).c
// 等价于
(a == null ? undefined : a.b).c
```

4. 报错

```javascript
// 构造函数
new a?.()
new a?.b()

// 链判断运算符的右侧有模板字符串
a?.`{b}`
a?.b`{c}`

// 链判断运算符的左侧是 super
super?.()
super?.foo

// 链运算符用于赋值运算符左侧
a?.b = c
```

5. 右侧不得是十进制数值

```javascript
foo?.3.0;
//等同于
foo? .3:0;
```

## `??`Null判断运算符

只有运算符左侧的值为`null`或`undefined`时，才会返回右边的值

```javascript
const headerText = response.settings.headerText ?? 'Hello, world!';
const animationDuration = response.settings.animationDuration ?? 300;
const showSplashScreen = response.settings.showSplashScreen ?? true;
```

==如果多个逻辑运算符一起使用，必须用括号表明优先级，否则报错==

```javascript
// 报错
lhs && middle ?? rhs
lhs ?? middle && rhs
lhs || middle ?? rhs
lhs ?? middle || rhs
```





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









































