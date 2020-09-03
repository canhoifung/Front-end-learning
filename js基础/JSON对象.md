# JSON

[TOC]

JSON = JavaScript Object Notation

是一种数据交换格式，可以是数组或对象或原始类型的值

JSON中的数据类型：

- number：和JavaScript的`number`完全一致，必须使用十进制
- boolean：就是JavaScript的`true`或`false`；
- string：就是JavaScript的`string`；
- null：就是JavaScript的`null`；
- array：就是JavaScript的`Array`表示方式——`[]`；
- object：就是JavaScript的`{ ... }`表示方式。
- 不能是函数、正则表达式对象、日期对象

> JSON规定字符集必须是UTF-8，字符串==必须==使用双引号`“”`，Object的键也需要使用`“”`。
>
> 不能使用`NaN`、`Infinity`、`-Infinity`和`undefined`
>
> 数组或对象最后一个成员的后面不能加逗号

## `JSON.stringify()`

将一个值转为JSON字符串

```javascript
JSON.stringify('abc') // ""abc""
JSON.stringify(1) // "1"
JSON.stringify(false) // "false"
JSON.stringify([]) // "[]"
JSON.stringify({}) // "{}"

JSON.stringify([1, "false", false])
// '[1,"false",false]'

JSON.stringify({ name: "张三" })
// '{"name":"张三"}'
```

> 对于原始类型的字符串，转换结果带双引号
>
> ```javascript
> JSON.stringify('foo') === "foo" // false
> JSON.stringify('foo') === "\"foo\"" // true
> ```

若对象属性为`undefined`、函数或XML对象，会被`JSON.stringify`过滤

若数组的成员为`undefined`、函数或XML对象，会转化为`null`

正则对象会被转化为空对象

```javascript
var obj = {
  a: undefined,
  b: function () {}
};
JSON.stringify(obj) // "{}"

var arr = [undefined, function () {}];
JSON.stringify(arr) // "[null,null]"

JSON.stringify(/foo/) // "{}"
```

==*==会忽略对象的不可遍历属性

### 第二个参数

用于指定需要转成字符串的属性

```javascript
var obj = {
  'prop1': 'value1',
  'prop2': 'value2',
  'prop3': 'value3'
};

var selectedProperties = ['prop1', 'prop2'];

JSON.stringify(obj, selectedProperties)
// "{"prop1":"value1","prop2":"value2"}"
```

> 只对对象的属性有效，对数组无效
>
> ```javascript
> JSON.stringify(['a', 'b'], ['0'])
> // "["a","b"]"
> 
> JSON.stringify({0: 'a', 1: 'b'}, ['0'])
> // "{"0":"a"}"
> ```

还可以作为一个函数，更改`JSON.stringify`的返回值

接收两个参数：

+ 被转换对象的键名
+ 键值

```javascript
function f(key, value) {
  if (typeof value === "number") {
    value = 2 * value;
  }
  return value;
}

JSON.stringify({ a: 1, b: 2 }, f)
// '{"a": 2,"b": 4}'
```

且会递归处理所有键：

```javascript
var o = {a: {b: 1}};

function f(key, value) {
  console.log("["+ key +"]:" + value);
  return value;
}

JSON.stringify(o, f)
// []:[object Object]
// [a]:[object Object]
// [b]:1
// '{"a":{"b":1}}'
```

上面代码中，对象`o`一共会被`f`函数处理三次，最后那行是`JSON.stringify`的输出。第一次键名为空，键值是整个对象`o`；第二次键名为`a`，键值是`{b: 1}`；第三次键名为`b`，键值为1

> 若处理函数返回`undefined`或没有返回值，则对应属性会被忽略

### 第三个参数

用于增加返回的JSON字符串的可读性

+ 若为数字，表示每个属性前面添加的空格（不超过10个）
+ 若为字符串（不超过10个字符），则字符串会添加在每行前面

```javascript
JSON.stringify({ p1: 1, p2: 2 }, null, 2);
/*
"{
  "p1": 1,
  "p2": 2
}"
*/

JSON.stringify({ p1:1, p2:2 }, null, '|-');
/*
"{
|-"p1": 1,
|-"p2": 2
}"
*/
```

### 参数对象的`toJSON`方法

若参数有自定义的`toJSON`方法，则会使用这个方法的返回值作为参数，忽略原对象的其他属性

```javascript
var user_old = {
  firstName: '三',
  lastName: '张',

  get fullName(){
    return this.lastName + this.firstName;
  }
};

var user = {
  firstName: '三',
  lastName: '张',

  get fullName(){
    return this.lastName + this.firstName;
  },

  toJSON: function () {
    return {
      name: this.lastName + this.firstName
    };
  }
};

JSON.stringify(user_old)
// "{"firstName":"三","lastName":"张","fullName":"张三"}"
JSON.stringify(user)
// "{"name":"张三"}"
```

+ `Date`对象有自己的`toJSON`方法
+ 可以用于将正则对象自动转为字符串，从而实现转换正则对象

```javascript
var obj = {
  reg: /foo/
};

// 不设置 toJSON 方法时
JSON.stringify(obj) // "{"reg":{}}"

// 设置 toJSON 方法时
RegExp.prototype.toJSON = RegExp.prototype.toString;
JSON.stringify(/foo/) // ""/foo/""
```

## `JSON.parse()`

用于将JSON格式的字符串对象转换成一个JavaScript对象

```javascript
JSON.parse('{}') // {}
JSON.parse('true') // true
JSON.parse('"foo"') // "foo"
JSON.parse('[1, 5, "false"]') // [1, 5, "false"]
JSON.parse('null') // null

var o = JSON.parse('{"name": "张三"}');
o.name // 张三

//不是有效的JSON格式会报错
JSON.parse("'String'") // illegal single quotes
// SyntaxError: Unexpected token ILLEGAL
```

可以接收一个处理函数，用法与`JSON.stringify`类似