# Module语法

ES6模块不是对象，是通过`export`命令显式指定输出的代码，再通过`import`命令输入

```javascript
// CommonJS模块
let { stat, exists, readfile } = require('fs');

// 等同于
let _fs = require('fs');
let stat = _fs.stat;
let exists = _fs.exists;
let readfile = _fs.readfile;
//要先加载整个fs模块，生成一个对象，再从对象上读取三个方法，只有运行时才能得到这个对象

// ES6模块
import { stat, exists, readFile } from 'fs';
//仅加载三个方法，其他方法不加载，为静态加载
```

## 严格模式

ES6的模块自动采用严格模式，具有以下限制：

- 变量必须声明后再使用
- 函数的参数不能有同名属性，否则报错
- 不能使用`with`语句
- 不能对只读属性赋值，否则报错
- 不能使用前缀 0 表示八进制数，否则报错
- 不能删除不可删除的属性，否则报错
- 不能删除变量`delete prop`，会报错，只能删除属性`delete global[prop]`
- `eval`不会在它的外层作用域引入变量
- `eval`和`arguments`不能被重新赋值
- `arguments`不会自动反映函数参数的变化
- 不能使用`arguments.callee`
- 不能使用`arguments.caller`
- 禁止`this`指向全局对象，顶层的`this`指向`undefined`
- 不能使用`fn.caller`和`fn.arguments`获取函数调用的堆栈
- 增加了保留字（比如`protected`、`static`和`interface`）

## export命令

用于规定模块的对外接口

一个模块是一个独立的文件，文件内部所有变量外部无法获取

要外部能读取模块内部的某个变量，必须使用`export`关键字输出该变量

例子：

```javascript
// profile.js
export var firstName = 'Michael';
export var lastName = 'Jackson';
export var year = 1958;
```

或者：（优先使用这种方法）

```javascript
// profile.js
var firstName = 'Michael';
var lastName = 'Jackson';
var year = 1958;

export { firstName, lastName, year };
```

可以使用`as`关键字重命名输出变量：

```javascript
function v1() { ... }
function v2() { ... }

export {
  v1 as streamV1,
  v2 as streamV2,
  v2 as streamLatestVersion
};
```

规定输出的是对外的接口，需要与模块内部变量建立一一对应关系

```javascript
// 报错
export 1;

// 报错
var m = 1;
export m;

//正确写法：
// 写法一
export var m = 1;

// 写法二
var m = 1;
export {m};

// 写法三
var n = 1;
export {n as m};

//对于fucntion和class同样
// 报错
function f() {}
export f;

// 正确
export function f() {};

// 正确
function f() {}
export {f};
```

`export`语句输出的接口和对应值是动态绑定的，能实时取到模块内部的值

`export`不能处于块级作用域内，可以出现在模块的任何位置，只要是处于模块顶层

## import命令

通过这个命令加载模块

```javascript
// main.js
import { firstName, lastName, year } from './profile.js';

function setName(element) {
  element.textContent = firstName + ' ' + lastName;
}
```

`import`后大括号内的变量名必须与被导入模块的对外接口的名称相同

若要取新名字，需要使用`as`关键字

```javascript
import { lastName as surname}from './pprofile.js'
```

`import`输入的变量都是只读的，不允许改写接口，但如果输出是一个对象，那么改写对象的属性是允许的

`import`命令会提升到整个模块的头部，首先执行

`import`命令是在编译阶段执行的，在代码运行之前，因此不能使用表达式和变量

`import`命令可以用于执行所加载的模块，且多次重复执行同一句`import`语句只会执行一次

```javascript
import 'lodash';
```

## 模块的整体加载

用`*`指定一个对象，所有输出值都会加载到这个对象上

会忽略模块的`default`方法

```javascript
// circle.js

export function area(radius) {
  return Math.PI * radius * radius;
}

export function circumference(radius) {
  return 2 * Math.PI * radius;
}
```

```javascript
// main.js
//逐一指定加载方法
import { area, circumference } from './circle';

console.log('圆面积：' + area(4));
console.log('圆周长：' + circumference(14));

//整体加载：
import * as circle from './circle';

console.log('圆面积：' + circle.area(4));
console.log('圆周长：' + circle.circumference(14));
```

整体加载的对象不允许运行时改变

## export default命令

为模块指定默认输出

可以不用阅读文档就能加载模块

这时候`import`命令后不用使用大括号

一个模块只能有一个默认输出，因此这个命令只能使用一次

本质是将命令后面的变量赋值给`default`，因此后面不能跟变量声明语句

```javascript
// export-default.js
export default function () {
  console.log('foo');
}
```

```javascript
// import-default.js
import customName from './export-default';
customName(); // 'foo'
```

同时输入默认方法和其他接口：

```javascript
import _, { each, forEach } from 'lodash';
```

## export和import的复合写法

如果一个模块中，先输入后输出同一个模块，则两个命令语句可以写在一起

但是相当于转发了接口，当前模块并不能使用接口

```javascript
export { foo, bar } from 'my_module';

// 可以简单理解为
import { foo, bar } from 'my_module';
export { foo, bar };
```

```javascript
//默认接口写法
export { default } from 'foo';
//具体接口改为默认接口
export { es6 as default } from './someModule';
// 等同于
import { es6 } from './someModule';
export default es6;
//默认改名为具名接口
export { default as es6 } from './someModule';
```

## 模块的继承

例子：

```javascript
// circleplus.js
export * from 'circle';
export var e = 2.71828182846;
export default function(x) {
  return Math.exp(x);
}
```

输出`circle`模块的所有属性和方法，然后再自定义输出变量和默认方法

## 跨模块常量

`const`声明的常量只在当前代码块有效

如果一个值要被多个模块共享，可以这样：

```javascript
// constants.js 模块
export const A = 1;
export const B = 3;
export const C = 4;

// test1.js 模块
import * as constants from './constants';
console.log(constants.A); // 1
console.log(constants.B); // 3

// test2.js 模块
import {A, B} from './constants';
console.log(A); // 1
console.log(B); // 3
```

## import()

`import`、`export`语句都是在编译时被处理，因此不能动态加载

而`import()`函数就是用于动态加载模块

```javascript
import(specifier)
```

`specifier`为所要加载的模块的位置

`import()`返回一个Promise对象

函数可以用在任何地方，在运行时执行

### 适用场合

1. 按需加载

   可以在有需要的时候再加载某个模块

2. 条件加载

   可以放在`if`代码块内，根据条件选择加载不同的模块

3. 动态的模块路径

   `import()`允许模块路径动态生成

### 注意点

`import()`加载模块成功后，模块会作为一个对象，作为`then`方法的参数，因此可以使用对象解构赋值的语法获取输出接口

```javascript
import('./myModule.js')
.then(({export1, export2}) => {
  // ...·
});
```

如果有默认输出接口，也可以直接用参数获取

```javascript
import('./myModule.js')
.then(myModule => {
  console.log(myModule.default);
});
//或者具名输入的形式
import('./myModule.js')
.then(({default: theDefault}) => {
  console.log(theDefault);
});
```





















