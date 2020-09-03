# String对象

[TOC]

作为包装对象，用于生成字符串对象

```javascript
var s1 = 'abc';
var s2 = new String('abc');

typeof s1 // "string"
typeof s2 // "object"

s2.valueOf() // "abc"
```

字符串对象时一个类似数组的对象：

```javascript
new String('abc')
// String {0: "a", 1: "b", 2: "c", length: 3}

(new String('abc'))[1] // "b"
```

## 静态方法

### `String.fromCharCode()`

静态方法（定义在对象本身）

参数为一个或多个数值，代表Unicode码点，返回值是这些码点组成的字符串

```javascript
String.fromCharCode() // ""
String.fromCharCode(97) // "a"
String.fromCharCode(104, 101, 108, 108, 111)
// "hello"
```

> 传入参数不能大于`OxFFFF`即十进制的65535
>
> 传入参数大于，则会忽略多出的位数

## 实例属性

### `String.prototype.length`

返回字符串的长度

```javascript
'abc'.length // 3
```

## 实例方法

### `String.prototype.charAt()`

返回指定位置的字符，参数为从`0`开始编号的位置

```javascript
var s = new String('abc');

s.charAt(1) // "b"
s.charAt(s.length - 1) // "c"
```

若为整数，可以使用数组下标替代：

```javascript
'abc'.charAt(1) // "b"
'abc'[1] // "b"
```

若为负数或大于等于字符串的长度，会返回空字符串：

```javascript
'abc'.charAt(-1) // ""
'abc'.charAt(3) // ""
```

### `String.prototype.charCodeAt()`

返回字符串指定位置的Unicode码点（十进制表示）

相当于`String.fromCharCode()`的逆操作

```javascript
'abc'.charCodeAt(1) // 98
```

若没有参数则返回首字符的Unicode码点

若参数为负数，或大于等于字符串的长度，则返回`NaN`

> 返回的码点不会大于65536（OxFFFF）

### `String.prototype.concat()`

用于连接两个字符串，返回一个新字符串

> 不改变原字符串

```javascript
var s1 = 'abc';
var s2 = 'def';

s1.concat(s2) // "abcdef"
s1 // "abc"
```

若参数不是字符串，则会将其转化为字符串再进行连接

可以接收多个参数

### `String.prototype.slice()`

从原字符串取出子字符串并返回

+ 第一个参数为字符串开始的位置，第二个参数为结束位置（不含该位置）

+ 省略第二个参数则一直到原字符串结束

+ 若参数为负数，则从结尾开始倒数计算位置

+ 若第一个参数大于第二个参数，则返回一个空字符串

> 不改变原字符串

```javascript
'JavaScript'.slice(0, 4) // "Java"

'JavaScript'.slice(4) // "Script"
```

### `String.prototype.substring()`

从原字符串取出子字符串并返回   与`slice()`类似

+ 第一个参数为字符串开始的位置，第二个参数为结束位置（不含该位置）
+ 省略第二个参数则一直到原字符串结束

- 若参数为负数，则将负数转为0

- 若第一个参数大于第二个参数，则会自动更换两个参数的位置

> 不改变原字符串

```javascript
'JavaScript'.substring(10, 4) // "Script"
// 等同于
'JavaScript'.substring(4, 10) // "Script"

'JavaScript'.substring(-3) // "JavaScript"
'JavaScript'.substring(4, -3) // "Java"
```

==*==由于规则违反直觉，不推荐使用`substring()`，推荐使用`slice()`

### `String.prototype.substr()`

与`slice`和`substring`方法的作用相同

+ 第一个参数为字符串开始位置，第二个参数为子字符串的长度
+ 省略第二个参数则一直到原字符串结束
+ 若第一个参数为负数，则从结尾开始倒数计算位置
+ 若第二个参数为负数，则自动转为0，因而返回空字符串

> 不改变原字符串

```javascript
'JavaScript'.substr(4, 6) // "Script"

'JavaScript'.substr(-6) // "Script"
'JavaScript'.substr(4, -1) // ""
```

### `String.prototype.indexOf()`、`String.prototype.lastIndexOf()`

`indexOf()`用于确定一个字符串在另一个字符串中第一次出现的位置，返回匹配开始的位置

```javascript
'hello world'.indexOf('o') // 4
'JavaScript'.indexOf('script') // -1
```

接收第二个参数，表示从该位置向后匹配：

```javascript
'hello world'.indexOf('o', 6) // 7
```

`lastIndexOf()`为从后往前匹配，字符串第一次出现的位置（即从前往后最后一次出现的位置）

```javascript
'hello world'.lastIndexOf('o') // 7
'hello world'.lastIndexOf('o', 6) // 4
```

### `String.prototype.trim()`

用于去除字符串两段的空格、制表符（`\t`、`\v`）、换行符（`\n`）、回车符（`\r`），返回一个新字符串

> 不改变原字符串

```javascript
'  hello world  '.trim()
// "hello world".

'\r\nabc \t'.trim() // 'abc'
```

### `String.prototype.toLowerCase()`、`String.prototype.toUpperCase()`

用于将一个字符串全部转为小写/大写

> 不改变原字符串



### `String.prototype.match()`

用于确定原字符串是否匹配某个子字符串，返回一个数组，成员为匹配的第一个字符串

若没有匹配项，则返回`null`

```javascript
'cat, bat, sat, fat'.match('at') // ["at"]
'cat, bat, sat, fat'.match('xt') // null
```

返回的数组有`index`属性和`input`属性，表示匹配字符串开始的位置和原始字符串

```javascript
var matches = 'cat, bat, sat, fat'.match('at');
matches.index // 1
matches.input // "cat, bat, sat, fat"
```

还可以使用正则表达式作为参数

### `String.prototype.search()`、`String.prototype.replace()`

`search()`用法基本等同于`match`，但是返回值为匹配的第一个位置

若没有匹配，则返回`-1`

```javascript
'cat, bat, sat, fat'.search('at') // 1
```

同样可以使用正则表达式作为参数

`replace()`用于替换匹配的子字符串，一般情况下只替换第一个匹配

（除非使用带有`g`修饰符的正则表达式）

```javascript
'aaa'.replace('a', 'b') // "baa"
```

同样可以使用正则表达式

### `String.prototype.split()`

按照给定规则分割字符串，返回一个由分割出来的子字符串组成的数组

+ 若分割规则为空字符串，则返回的数组成员为原字符串的每一个字符
+ 若省略参数，则返回数组的唯一成员为原字符串
+ 若满足分割规则的两个部分紧邻，则返回数组之中会有一个空字符串
+ 若满足分割规则的部分位于字符串开头或结尾，则返回数组的第一个或最后一个成员为空字符串
+ 接收第二个参数，用于限定返回数组的最大成员数

```javascript
'a|b|c'.split('|') // ["a", "b", "c"]

'a|b|c'.split('') // ["a", "|", "b", "|", "c"]

'a|b|c'.split() // ["a|b|c"]

'a||c'.split('|') // ['a', '', 'c']

'|b|c'.split('|') // ["", "b", "c"]
'a|b|'.split('|') // ["a", "b", ""]

'a|b|c'.split('|', 0) // []
'a|b|c'.split('|', 1) // ["a"]
'a|b|c'.split('|', 2) // ["a", "b"]
'a|b|c'.split('|', 3) // ["a", "b", "c"]
'a|b|c'.split('|', 4) // ["a", "b", "c"]
```

同样可以使用正则表达式

### `String.prototype.localeCompare()`

用于比较两个字符串，返回一个整数

+ 若整数小于0，则第一个字符串小于第二个字符串
+ 若等于0，则相等
+ 若大于0，则第一个字符串大于第二个字符串

考虑自然语言的顺序

大写英文字母小于小写字母

接收第二个参数，用于指定所使用的语言（默认英语），根据该语言规则进行比较

```javascript
'apple'.localeCompare('banana') // -1
'apple'.localeCompare('apple') // 0

'B' > 'a' // false

'ä'.localeCompare('z', 'de') // -1
'ä'.localeCompare('z', 'sv') // 1
```