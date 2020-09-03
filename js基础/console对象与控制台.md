[TOC]

`console`常见用途：

- 调试程序，显示网页代码运行时的错误信息。
- 提供了一个命令行接口，用来与网页代码互动。

控制台面板：

- **Elements**：查看网页的 HTML 源码和 CSS 代码。
- **Resources**：查看网页加载的各种资源文件（比如代码文件、字体文件 CSS 文件等），以及在硬盘上创建的各种内容（比如本地缓存、Cookie、Local Storage等）。
- **Network**：查看网页的 HTTP 通信情况。
- **Sources**：查看网页加载的脚本源码。
- **Timeline**：查看各种网页行为随时间变化的情况。
- **Performance**：查看网页的性能情况，比如 CPU 和内存消耗。
- **Console**：用来运行 JavaScript 命令。

# `console`对象的静态方法

## `console.log()`、`console.info()`、`console.debug()`

`console.log()`若第一个参数为格式字符串，将依次用后面的参数替换占位符

支持的占位符有如下：

- `%s` 字符串
- `%d` 整数
- `%i` 整数
- `%f` 浮点数
- `%o` 对象的链接
- `%c` CSS 格式字符串

如：

```javascript
var number = 11 * 9;
var color = 'red';

console.log('%d %s balloons', number, color);
// 99 red balloons
```

```javascript
console.log(
  '%cThis text is styled!',
  'color: red; background: yellow; font-size: 24px;'
)
```

`console.info()`为`console.log()`别名，用法一样，但会在输出信息的前面添加一个蓝色图标

`console.debug()`与`consoele.log()`类似，会在控制台输出调试信息。但默认下其输出信息不会显示，只有打开现实级别在`verbose`的情况下才会显示

## `console.warn()`、`console.error()`

`console.warn()`会在输出信息时在最前面加一个黄色三角，表示警告

`console.error()`会在输出信息时在最前面加一个红色的叉，表示出错。

同时还会高亮显示输出文字和错误发生的堆栈

## `console.table()`

将复合类型的数据转化为表格显示：

```javascript
var languages = [
  { name: "JavaScript", fileExtension: ".js" },
  { name: "TypeScript", fileExtension: ".ts" },
  { name: "CoffeeScript", fileExtension: ".coffee" }
];

console.table(languages);
```

```javascript
var languages = {
  csharp: { name: "C#", paradigm: "object-oriented" },
  fsharp: { name: "F#", paradigm: "functional" }
};

console.table(languages);
```

## `console.count()`

用于计数，输出它被调用的次数

可以接收一个字符串作为参数，对执行次数进行分类

```javascript
function greet(user) {
  console.count();
  return 'hi ' + user;
}

greet('bob')
//  : 1
// "hi bob"

greet('alice')
//  : 2
// "hi alice"

greet('bob')
//  : 3
// "hi bob"
```

```javascript
function greet(user) {
  console.count(user);
  return "hi " + user;
}

greet('bob')
// bob: 1
// "hi bob"

greet('alice')
// alice: 1
// "hi alice"

greet('bob')
// bob: 2
// "hi bob"
```

## `console.dir()`、`console.dirxml()`

用于对一个对象进行检查，并以易于阅读和打印的格式显示

```javascript
console.log({f1: 'foo', f2: 'bar'})
// Object {f1: "foo", f2: "bar"}

console.dir({f1: 'foo', f2: 'bar'})
// Object
//   f1: "foo"
//   f2: "bar"
//   __proto__: Object
```

用于输出DOM对象的时候，会显示DOM对象的所有属性，更易读

`console.dirxml()`主要用于以目录树的形式显示DOM节点

## `console.assert()`

用于程序运行过程中进行条件判断，如果不满足条件则会显示一个错误，但不会中断程序执行

接收两个参数，第一个为表达式，第二个为字符串

只有当第一个参数为`false`时，才会提示有错误并输出第二个参数

```javascript
console.assert(false, '判断条件不成立')
// Assertion failed: 判断条件不成立

// 相当于
try {
  if (!false) {
    throw new Error('判断条件不成立');
  }
} catch(e) {
  console.error(e);
}
```

## `console.time()`、`console.timeEnd()`

用于计时，可以算出一个操作所花费的准确时间

参数为计时器的名称

`console.time()`表示开始，而`console.timeEnd()`表示结束

```javascript
console.time('Array initialize');

var array= new Array(1000000);
for (var i = array.length - 1; i >= 0; i--) {
  array[i] = new Object();
};

console.timeEnd('Array initialize');
// Array initialize: 1914.481ms
```

## `console.group()`、`console.groupEnd()`、`console.groupCollapsed()`

`console.group()`、`console.groupEnd()`用于将显示的信息分组

只在输出大量信息时有用

```javascript
console.group('一级分组');
console.log('一级分组的内容');

console.group('二级分组');
console.log('二级分组的内容');

console.groupEnd(); // 二级分组结束
console.groupEnd(); // 一级分组结束
```

`console.groupCollapsed()`与`console.group()`类似，但第一次显示时是收起的不是展开的

```javascript
console.groupCollapsed('Fetching Data');

console.log('Request Sent');
console.error('Error: Server not responding (500)');

console.groupEnd();
```

## `console.trace()`、`console.clear()`

`console.trace`方法显示当前执行的代码在堆栈中的调用路径。

```javascript
console.trace()
// console.trace()
//   (anonymous function)
//   InjectedScript._evaluateOn
//   InjectedScript._evaluateAndWraps
//   InjectedScript.evaluate
```

`console.clear`方法用于清除当前控制台的所有输出，将光标回置到第一行。如果用户选中了控制台的“Preserve log”选项，`console.clear`方法将不起作用。

# 控制台命令行API

1. `$_`

用于返回上一个表达式的值

```javascript
2+2 //4
$_  //4
```

2. `$0`-`$4`

控制台保存了最近5个在Elements面板选中的DOM元素，`$0`代表倒数第一个，以此类推到`$4`

3. `$(selector)`

返回第一个匹配的元素，相当于`document.querySelector()`

> 根据CSS选择器选择

若页面脚本对`$`有定义，则会覆盖原始的定义

4. `$$(selector)`

返回选中的DOM对象，相当于`document.querySelector()`

5. `$x(path)`

返回一个数组，包含匹配特定XPath表达式的所有DOM元素

```javascript
$x("//p[a]")  //返回所有包含a元素的p元素
```

6. `inspect(object)`

打开相关面板，并选中相应的元素，显示它的细节

DOM 元素在`Elements`面板中显示，比如`inspect(document)`会在 Elements 面板显示`document`元素。JavaScript 对象在控制台面板`Profiles`面板中显示，比如`inspect(window)`

7. `keys(object)`、`values(object)`

`keys(object)`方法返回一个数组，包含`object`的所有键名

`values(object)`方法返回一个数组，包含`object`的所有键值

```javascript
var o = {'p1': 'a', 'p2': 'b'};

keys(o)
// ["p1", "p2"]
values(o)
// ["a", "b"]
```

8. `getEventListeners(object)`

返回一个对象，该对象的成员为`object`登记了回调函数的各种事件（如`click`、`keydown`），每个事件对应一个数组，数组成员为该事件的回调函数

9. `monitorEvents(object[, events]) ，unmonitorEvents(object[, events])`

`monitorEvents(object[, events])`方法监听特定对象上发生的特定事件。事件发生时，会返回一个`Event`对象，包含该事件的相关信息。`unmonitorEvents`方法用于停止监听。

```javascript
monitorEvents(window, "resize");
monitorEvents(window, ["resize", "scroll"])
```

上面代码分别表示单个事件和多个事件的监听方法。

```javascript
monitorEvents($0, 'mouse');
unmonitorEvents($0, 'mousemove');
```

上面代码表示如何停止监听。

`monitorEvents`允许监听同一大类的事件。所有事件可以分成四个大类。

- mouse："mousedown", "mouseup", "click", "dblclick", "mousemove", "mouseover", "mouseout", "mousewheel"
- key："keydown", "keyup", "keypress", "textInput"
- touch："touchstart", "touchmove", "touchend", "touchcancel"
- control："resize", "scroll", "zoom", "focus", "blur", "select", "change", "submit", "reset"

```javascript
monitorEvents($("#msg"), "key");
```

上面代码表示监听所有`key`大类的事件。

10. 其他方法

命令行 API 还提供以下方法。

- `clear()`：清除控制台的历史。
- `copy(object)`：复制特定 DOM 元素到剪贴板。
- `dir(object)`：显示特定对象的所有属性，是`console.dir`方法的别名。
- `dirxml(object)`：显示特定对象的 XML 形式，是`console.dirxml`方法的别名。

# `debugger`语句

用于除错，作用是设置断点

若有正在运行的出错工具，程序运行到`debugger`会自动停下

若无，则会忽略`debugger`语句

```javascript
for(var i = 0; i < 5; i++){
  console.log(i);
  if (i === 2) debugger;
}
```

