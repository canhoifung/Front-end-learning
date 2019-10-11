# `RegExp`对象

[TOC]

新建正则表达式的两种方式：

1. 使用字面量，以斜杠表示开始和结束
2. 使用`RegExp`构造函数

```javascript
var regex = /xyz/;
//等价于
var regex = new RegExp('xyz');
```

> 第一种方法在引擎编译代码时新建正则表达式
>
> 第二种方法在运行时新建正则表达式
>
> 因而第一种方法效率更高

构造函数还可以接收第二个参数，表示修饰符

```javascript
var regex = new RegExp('xyz', 'i');
// 等价于
var regex = /xyz/i;
```

## 实例属性

1. 与修饰符相关，用于了解设置了什么修饰符的实例属性

- `RegExp.prototype.ignoreCase`：返回一个布尔值，表示是否设置了`i`修饰符。
- `RegExp.prototype.global`：返回一个布尔值，表示是否设置了`g`修饰符。
- `RegExp.prototype.multiline`：返回一个布尔值，表示是否设置了`m`修饰符。
- `RegExp.prototype.flags`：返回一个字符串，包含了已经设置的所有修饰符，按字母排序

都是只读属性

```javascript
var r = /abc/igm;

r.ignoreCase // true
r.global // true
r.multiline // true
r.flags // 'gim'
```

2. 与修饰符无关的属性

- `RegExp.prototype.lastIndex`：返回一个整数，表示下一次开始搜索的位置。即上一次匹配的后一个位置。该属性可读写，但是只在进行连续搜索时有意义，详细介绍请看后文。
- `RegExp.prototype.source`：返回正则表达式的字符串形式（不包括反斜杠），该属性只读。

```javascript
var r = /abc/igm;

r.lastIndex // 0
r.source // "abc"
```

## 实例方法

### `RegExp.prototype.test()`

返回一个布尔值，表示当前模式是否能匹配参数字符串

若为空字符串，则匹配所有字符串

```javascript
/cat/.test('cats and dogs') // true

new RegExp('').test('abc')
// true
```

若正则表达式带有`g`修饰符，则每一次`test`方法都从上一次结束的位置开始向后匹配：

```javascript
var r = /x/g;
var s = '_x_x';

r.lastIndex // 0
r.test(s) // true

r.lastIndex // 2
r.test(s) // true

r.lastIndex // 4
r.test(s) // false
```

带有`g`修饰符时，可以通过正则对象的`lastIndex`属性指定开始搜索的位置：

```javascript
var r = /x/g;
var s = '_x_x';

r.lastIndex = 4;
r.test(s) // false
//lastIndex属性重置为0
r.lastIndex // 0
r.test(s)
```

带有`g`修饰符时，正则表达式内部会记住上一次的`lastIndex`属性

### `RegExp.prototype.exec()`

用于返回匹配结果。

如果有匹配则返回一个数组，成员为匹配成功的字符串。

若没有匹配则返回`null`

```javascript
var s = '_x_x';
var r1 = /x/;
var r2 = /y/;

r1.exec(s) // ["x"]
r2.exec(s) // null
```

1. 若正则表达式包含圆括号即组匹配，则返回的数组会包括多个成员。

+ 第一个成员为整个匹配成功的结果
+ 后面的成员为圆括号对应的匹配成功的组，即第二个成员对应第一个括号，第三个成员对应第二个括号
+ 数组的`length`属性等于组匹配的数量加1

```javascript
var s = '_x_x';
var r = /_(x)/;

r.exec(s) // ["_x", "x"]
```

2. `exec`返回的数组具有两个属性：

+ `input`：整个原字符串
+ `index`：整个模式匹配成功的开始位置（从0开始）

```javascript
var r = /a(b+)a/;
var arr = r.exec('_abbba_aba_');

arr // ["abbba", "bbb"]

arr.index // 1
arr.input // "_abbba_aba_"
```

3. 若正则表达式使用了`g`修饰符，则可以使用多次`exec`方法，下一次搜索的位置从上一次匹配成功结束的位置开始

```javascript
var reg = /a/g;
var str = 'abc_abc_abc'

var r1 = reg.exec(str);
r1 // ["a"]
r1.index // 0
reg.lastIndex // 1

var r2 = reg.exec(str);
r2 // ["a"]
r2.index // 4
reg.lastIndex // 5

var r3 = reg.exec(str);
r3 // ["a"]
r3.index // 8
reg.lastIndex // 9

var r4 = reg.exec(str);
r4 // null
reg.lastIndex // 0
```

可以利用一个循环完成全部匹配：

```javascript
var reg = /a/g;
var str = 'abc_abc_abc'

while(true) {
  var match = reg.exec(str);
  if (!match) break;
  console.log('#' + match.index + ':' + match[0]);
}
// #0:a
// #4:a
// #8:a
```

## 字符串的实例方法

4中实例方法与正则表达式有关：

- `String.prototype.match()`：返回一个数组，成员是所有匹配的子字符串。
- `String.prototype.search()`：按照给定的正则表达式进行搜索，返回一个整数，表示匹配开始的位置。
- `String.prototype.replace()`：按照给定的正则表达式进行替换，返回替换后的字符串。
- `String.prototype.split()`：按照给定规则进行字符串分割，返回一个数组，包含分割后的各个成员。

### `String.prototype.match()`

对字符串进行正则匹配，返回匹配结果

```javascript
var s = '_x_x';
var r1 = /x/;
var r2 = /y/;

s.match(r1) // ["x"]
s.match(r2) // null
```

与正则对象的`exec`方法类似，匹配成功返回一个数组，失败则返回`null`

匹配总是从字符串的第一个字符开始，设置正则表达式的`lastIndex`属性无效

若正则表达式有`g`修饰符，则会一次性返回所有匹配成功的结果

```javascript
var s = 'abba';
var r = /a/g;

s.match(r) // ["a", "a"]
r.exec(s) // ["a"]
```

### `String.prototype.search()`

返回第一个满足条件的匹配结果在整个字符串中的位置

若没有匹配则返回`-1`

```javascript
'_x_x'.search(/x/)
// 1
```

### `String.prototype.replace()`

用于替换匹配的值

两个参数：

+ 正则表达式，表示搜索模式
+ 替换的内容

```javascript
str.replace(search,replacement)
```

若没有`g`修饰符，则替换第一个匹配成功的值

否则全部替换

```javascript
'aaa'.replace('a', 'b') // "baa"
'aaa'.replace(/a/, 'b') // "baa"
'aaa'.replace(/a/g, 'b') // "bbb"
```

可用于消除字符串首尾两端的空格

```javascript
var str = '  #id div.class  ';

str.replace(/^\s+|\s+$/g, '')
// "#id div.class"
```

第二个参数可以使用`$`用于指代所替换的内容：

- `$&`：匹配的子字符串。
- `` $` ``：匹配结果前面的文本。
- `$'`：匹配结果后面的文本。
- `$n`：匹配成功的第`n`组内容，`n`是从1开始的自然数。
- `$$`：指代美元符号`$`。

```javascript
'hello world'.replace(/(\w+)\s(\w+)/, '$2 $1')  //互换位置
// "world hello"

'abc'.replace('b', '[$`-$&-$\']')  //改写匹配值
// "a[a-b-c]c"
```

第二个参数还可以为一个函数，将每一个匹配内容替换为函数返回值：

```javascript
'3 and 5'.replace(/[0-9]+/g, function (match) {
  return 2 * match;
})
// "6 and 10"

var a = 'The quick brown fox jumped over the lazy dog.';
var pattern = /quick|brown|lazy/ig;

a.replace(pattern, function replacer(match) {
  return match.toUpperCase();
});
// The QUICK BROWN fox jumped over the LAZY dog.
```

替换函数可以接收多个参数：

+ 第一个参数是捕捉到的内容
+ 第二个参数是捕捉到的组匹配（有多少个组匹配，就有多少个对应的参数）
+ 倒数第二个参数时捕捉到的内容在整个字符串中的位置
+ 最后一个参数是原字符串

```javascript
var prices = {
  'p1': '$1.99',
  'p2': '$9.99',
  'p3': '$5.00'
};

var template = '<span id="p1"></span>'
  + '<span id="p2"></span>'
  + '<span id="p3"></span>';

template.replace(
  /(<span id=")(.*?)(">)(<\/span>)/g,
  function(match, $1, $2, $3, $4){
    return $1 + $2 + $3 + prices[$2] + $4;
  }
);
// "<span id="p1">$1.99</span><span id="p2">$9.99</span><span id="p3">$5.00</span>"
```

### `String.prototype.split()`

按照正则规则分割字符串，返回一个由分割后的各个部分组成的数组

```javascript
str.split(separator, [limit])
```

+ `separator`：正则表达式
+ `[limit]`：返回数组的最大成员数

```javascript
// 非正则分隔
'a,  b,c, d'.split(',')
// [ 'a', '  b', 'c', ' d' ]

// 正则分隔，去除多余的空格
'a,  b,c, d'.split(/, */)
// [ 'a', 'b', 'c', 'd' ]

// 指定返回数组的最大成员
'a,  b,c, d'.split(/, */, 2)
[ 'a', 'b' ]
```

```javascript
// 例一
'aaa*a*'.split(/a*/)
// [ '', '*', '*' ]

// 例二
'aaa**a*'.split(/a*/)
// ["", "*", "*", "*"]
```

以上为分割0次或多次的`a`（若字符前面没有`a`则视为有0个`a`）

若正则表达式带有括号，则匹配的部分也会作为数组成员返回

```javascript
'aaa*a*'.split(/(a*)/)
// [ '', 'aaa', '*', 'a', '*' ]
```

## 匹配规则

### 字面量字符和元字符

字面量字符：在正则表达式中，某个字符只表示它字面的含义

元字符：除字面量字符外，具有特殊含义的字符

#### 点字符 `.`

点字符`.`匹配除了

+ 回车 `\r`
+ 换行 `\n`
+ 行分隔符 `\u2028`
+ 段分隔符 `\u2029`

以外的所有字符。

> 对于码点大于`0xFFFF`字符，点字符会认为这是两个字符

一个点字符对应匹配一个字符

```javascript
/c.t/.test('cat'); //true
/c.t/.test('coot'); //false
```

#### 位置字符 `^` `$`

用于提示字符所处的位置，主要有两个

+ `^`表示字符串的开始位置
+ `$`表示字符串结束位置

```javascript
// test必须出现在开始位置
/^test/.test('test123') // true

// test必须出现在结束位置
/test$/.test('new test') // true

// 从开始位置到结束位置只有test
/^test$/.test('test') // true
/^test$/.test('test test') // false
```

#### 选择符 `|`

表示或关系

```javascript
/11|22/.test('911') // true
```

#### 其余元字符

包括：`\`、`\*`、`+`、`?`、`()`、`[]`、`{}` 等



### 转义符 `\`

具有特殊含义的元字符，若要匹配它们本身便需要在他们前面加上反斜杠

```javascript
/1+1/.test('1+1')
// false

/1\+1/.test('1+1')
// true
```

==**==需要使用反斜杠转义的字符：

+ `^`
+ `[`
+ `$`
+ `(`
+ `)`
+ `|`
+ `*`
+ `+`
+ `?`
+ `{`
+ `\`

==*==若使用`RegExp`方法生成正则对象，转义需要使用两个斜杠，因为字符串内部会先转义一次

```javascript
(new RegExp('1\+1')).test('1+1')
// false

(new RegExp('1\\+1')).test('1+1')
// true
```

### 特殊字符

- `\cX` 表示`Ctrl-[X]`，其中的`X`是A-Z之中任一个英文字母，用来匹配控制字符。
- `[\b]` 匹配退格键(U+0008)，不要与`\b`混淆。
- `\n` 匹配换行键。
- `\r` 匹配回车键。
- `\t` 匹配制表符 tab（U+0009）。
- `\v` 匹配垂直制表符（U+000B）。
- `\f` 匹配换页符（U+000C）。
- `\0` 匹配`null`字符（U+0000）。
- `\xhh` 匹配一个以两位十六进制数（`\x00`-`\xFF`）表示的字符。
- `\uhhhh` 匹配一个以四位十六进制数（`\u0000`-`\uFFFF`）表示的 Unicode 字符

### 字符类 `[]`

表示有一系列字符可供选择，只需要匹配其中一个人就可以了

所有可供选择的字符都放在`[]`中

```javascript
/[abc]/.test('hello world') // false
/[abc]/.test('apple') // true
```

两个特殊含义字符

#### 脱字符 `^`

若`[]`内第一个字符为`^`，表示除了字符类中字符，只要包含其他字符都可以匹配：

```javascript
/[^abc]/.test('bbc news') // true
/[^abc]/.test('bbc') // false
```

若为`[^]`，则表示匹配一切字符包括换行符

> 而`.`点字符是不包括换行符的

```javascript
var s = 'Please yes\nmake my day!';

s.match(/yes.*day/) // null
s.match(/yes[^]*day/) // [ 'yes\nmake my day']
```

==**==只在`[]`的第一个位置才有含义，否则为字面意思

#### 连字符 `-`

对于连续序列的字符，`-`表示字符的连续范围

```javascript
/a-z/.test('b') // false
/[a-z]/.test('b') // true
```

> ```javascript
> [1-31];  //表示1到3而不是1到31
> ```

还可以用于Unicode字符的范围：

```javascript
var str = "\u0130\u0131\u0132";
/[\u0128-\uFFFF]/.test(str)
// true
```

> 不要过分使用连字符，有些范围内可能有意料之外的字符。
>
> 比如`[A-z]`中还包含其他字符比如`\`

### 预定义模式

指某些常见模式的简写方式：

- `\d` 匹配0-9之间的任一数字，相当于`[0-9]`。
- `\D` 匹配所有0-9以外的字符，相当于`[^0-9]`。
- `\w` 匹配任意的字母、数字和下划线，相当于`[A-Za-z0-9_]`。
- `\W` 除所有字母、数字和下划线以外的字符，相当于`[^A-Za-z0-9_]`。
- `\s` 匹配空格（包括换行符、制表符、空格符等），相等于`[ \t\r\n\v\f]`。
- `\S` 匹配非空格的字符，相当于`[^ \t\r\n\v\f]`。
- `\b` 匹配词的边界。
- `\B` 匹配非词边界，即在词的内部。

```javascript
// \s 的例子
/\s\w*/.exec('hello world') // [" world"]

// \b 的例子   即此处词首必须独立才会匹配 若为/world\b/则为词尾独立
/\bworld/.test('hello world') // true
/\bworld/.test('hello-world') // true
/\bworld/.test('helloworld') // false

// \B 的例子
/\Bworld/.test('hello-world') // false
/\Bworld/.test('helloworld') // true
```

正则表达式遇到换行符`\n`会停止匹配：

```javascript
var html = "<b>Hello</b>\n<i>world!</i>";

/.*/.exec(html)[0]
// "<b>Hello</b>"
```

此时需要使用`\s`字符类：（`[\S\s]`指代一切字符）

```javascript
var html = "<b>Hello</b>\n<i>world!</i>";

/[\S\s]*/.exec(html)[0]
// "<b>Hello</b>\n<i>world!</i>"
```

### 重复类 `{}`

使用`{}`表示精确匹配次数

+ `{n}`表示重复`n`次
+ `{n,}`表示至少重复`n`次
+ `{n,m}`表示重复次数不少于`n`次，不多于`m`次

```javascript
/lo{2}k/.test('look') // true
/lo{2,5}k/.test('looook') // true
```

### 量词符 `?` `*` `+`

用于设定某个模式出现的次数

+ `?` 表示某个模式出现0次或1次，等同于`{0,1}`
+ `*` 表示某个模式出现0次或多次，等同于`{0,}`
+ `+` 表示某个模式出现1次或多次，等同于`{1,}`

```javascript
// t 出现0次或1次
/t?est/.test('test') // true
/t?est/.test('est') // true

// t 出现1次或多次
/t+est/.test('test') // true
/t+est/.test('ttest') // true
/t+est/.test('est') // false

// t 出现0次或多次
/t*est/.test('test') // true
/t*est/.test('ttest') // true
/t*est/.test('tttest') // true
/t*est/.test('est') // true
```

### 贪婪模式

指代三个量词符，默认情况下都是最大可能地匹配，匹配一直到下一个字符不满足匹配规则为止。

```javascript
var s = 'aaa';
s.match(/a+/) // ["aaa"]
```

若想改为非贪婪模式，在量词符后面添加一个`?`

```javascript
var s = 'aaa';
s.match(/a+?/) // ["a"]
```

此时一旦条件满足，就停止匹配

- `+?`：表示某个模式出现1次或多次，匹配时采用非贪婪模式。
- `*?`：表示某个模式出现0次或多次，匹配时采用非贪婪模式。
- `??`：表格某个模式出现0次或1次，匹配时采用非贪婪模式。.

```javascript
'abb'.match(/ab*b/) // ["abb"]
'abb'.match(/ab*?b/) // ["ab"]

'abb'.match(/ab?b/) // ["abb"]
'abb'.match(/ab??b/) // ["ab"]
```

### 修饰符

表示模式的附加规则，放在正则模式的最尾部（放在`/ /`后）

#### `g`修饰符

表示全局匹配，正则对象将匹配全部符合条件的结果，主要用于搜索和替换

```javascript
//此时没有全局匹配，每次都是从字符串头部开始匹配
var regex = /b/;
var str = 'abba';

regex.test(str); // true
regex.test(str); // true
regex.test(str); // true

//使用全局匹配
var regex = /b/g;
var str = 'abba';

regex.test(str); // true
regex.test(str); // true
regex.test(str); // false
```

#### `i`修饰符

表示忽略大小写

```javascript
/abc/.test('ABC') // false
/abc/i.test('ABC') // true
```

#### `m`修饰符

表示多行模式，会修改`^`和`$`的行为

添加`m`修饰符后，`^`与`$`匹配行首和行尾，即识别换行符`\n`

```javascript
/world$/.test('hello world\n') // false
/world$/m.test('hello world\n') // true
```

### 组匹配

括号表示分组匹配，括号中的模式可以用于匹配分组的内容

```javascript
/fred+/.test('fredd') 
// true  此处+只表示重复字母d
/(fred)+/.test('fredfred')  
// true  此处+表示重复fred
```

#### 捕获组

分组捕获：

```javascript
var m = 'abcabc'.match(/(.)b(.)/);
m
// ['abc', 'a', 'c']
//返回数组第一个值为匹配值
//第二第三个为组匹配所匹配的值
```

> 若分组捕获时使用了`g`修饰符，则不会捕获分组的内容
>
> ```javascript
> var m = 'abcabc'.match(/(.)b(.)/g);
> m // ['abc', 'abc']
> ```
>
> 此时需要使用`exec`方法配合循环获得每一轮匹配的组捕获
>
> ```javascript
> var str = 'abcabc';
> var reg = /(.)b(.)/g;
> while (true) {
>   var result = reg.exec(str);
>   if (!result) break;
>   console.log(result);
> }
> // ["abc", "a", "c",index:0]
> // ["abc", "a", "c",index:3]
> ```

表达式内部还可以使用`\n`引用括号匹配的内容，`n`为自然数，表示对应顺序的括号

```javascript
/(.)b(.)\1b\2/.test("abcabc")
// true  以上匹配结果等于abcabc

/y(..)(.)\2\1/.test('yabccab') // true
/y((..)\2)\1/.test('yabababab') // true
```

匹配网页标签：

```javascript
var tagName = /<([^>]+)>[^<]*<\/\1>/;
//  ([^>]+)表示匹配除了>字符外的1个或多个字符，此处为b 
//  [^<]* 表示匹配除了<字符外的0个或多个字符，此处为bold  不会匹配到<
tagName.exec("<b>bold</b>")[1]
// 'b'
```

匹配带有属性的标签：

```javascript
var html = '<b class="hello">Hello</b><i>world</i>';
var tag = /<(\w+)([^>]*)>(.*?)<\/\1>/g;

var match = tag.exec(html);

match[1] // "b"
match[2] // " class="hello""
match[3] // "Hello"

match = tag.exec(html);

match[1] // "i"
match[2] // ""
match[3] // "world"
```

#### 非捕获组 `(?:x)`

`(?:x)`称为非捕获组，表示不返回该组匹配的内容，即匹配的结果中不计入这个括号

```javascript
var m = 'abc'.match(/(?:.)b(.)/);
m // ["abc", "c"]
```

此时返回的只有第二个括号匹配的内容

```javascript
// 正常匹配
var url = /(http|ftp):\/\/([^/\r\n]+)(\/[^\r\n]*)?/;

url.exec('http://google.com/');
// ["http://google.com/", "http", "google.com", "/"]

// 非捕获组匹配
var url = /(?:http|ftp):\/\/([^/\r\n]+)(\/[^\r\n]*)?/;

url.exec('http://google.com/');
// ["http://google.com/", "google.com", "/"]
```

#### 先行断言 `x(?=y)`

`x`只有在`y`前面才会匹配，且`y`不会计入返回结果

```javascript
var m = 'abc'.match(/b(?=c)/);
m // ["b"]
```

#### 先行否定断言 `x(?!y)`

`x`只有不在`y`前才会匹配，且`y`不会计入返回结果

```javascript
/\d+(?!\.)/.exec('3.14')
// ["14"]
```

