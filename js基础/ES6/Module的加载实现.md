# Module的加载实现

## 浏览器加载

### 传统方法

默认情况下，浏览器同步加载JS脚本，但是如果脚本过大，浏览器会堵塞，没有反应

因此加入了两种异步加载的语法

```html
<script src="path/to/myModule.js" defer></script>
<script src="path/to/myModule.js" async></script>
```

其中：

`defer`：等到整个页面在内存中正常渲染结束（DOM结构完成生成，且其他脚本执行完成），才会执行，多个此类脚本会按照出现顺序加载

`async`：一旦下载完，渲染引擎就会中断渲染，执行脚本后再继续渲染，多个此类脚本不能保证加载顺序

### 加载规则

加载ES6模块，需要在`<script>`标签内加入`type='module'`属性

```javascript
<script type="module" src="./foo.js"></script>
```

带有`type='module'`的都是异步加载，等同于设置了`defer`

也可以显式设置`async`属性，打开后会按照`async`的执行方法

## ES6模块与CommonJS模块的差异

三大差异：

- CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。
- CommonJS 模块是运行时加载，ES6 模块是编译时输出接口。
- CommonJS 模块的`require()`是同步加载模块，ES6 模块的`import`命令是异步加载，有一个独立模块依赖的解析阶段。

第二个差异原因：CommonJS加载的是一个对象（`module.exports`属性），该对象只有在脚本运行完才会生成。而 ES6 模块不是对象，它的对外接口只是一种静态定义，在代码静态解析阶段就会生成

第一个差异原因：

由于输出的是值的拷贝，CommonJS一旦输出一个值，模块内部的变化就影响不到这个值

例子：

```javascript
// lib.js
var counter = 3;
function incCounter() {
  counter++;
}
module.exports = {
  counter: counter,
  incCounter: incCounter,
};

// main.js
var mod = require('./lib');

console.log(mod.counter);  // 3
mod.incCounter();
console.log(mod.counter); // 3
```

`mod.counter`是一个原始类型的值，会被缓存，若要获取变动后的值需要这样改写

```javascript
// lib.js
var counter = 3;
function incCounter() {
  counter++;
}
module.exports = {
  get counter() {
    return counter
  },
  incCounter: incCounter,
};
```

对于ES6模块而言：

```javascript
// lib.js
export let counter = 3;
export function incCounter() {
  counter++;
}

// main.js
import { counter, incCounter } from './lib';
console.log(counter); // 3
incCounter();
console.log(counter); // 4
```

同时同一个接口输出的是同一个值，不同脚本加载接口获取的是同一个实例

```javascript
// mod.js
function C() {
  this.sum = 0;
  this.add = function () {
    this.sum += 1;
  };
  this.show = function () {
    console.log(this.sum);
  };
}

export let c = new C();

// x.js
import {c} from './mod';
c.add();

// y.js
import {c} from './mod';
c.show();

// main.js
import './x';
import './y';
```

## Node.js的模块加载方法

JS现在有两种模块，一为ES6模块，ESM；另一种为CommonJS模块，CJS

其中CommonJS是Node.js专用的，与ES6模块不兼容

其使用的是`require()`和`module.exports`，对应ESM的`import`和`export`

但从Node.js v13.2开始，已经支持了ESM

Node.js要求ES6模块采用`.mjs`后缀文件名

若不希望后缀改为`.mjs`，可以在项目的`package.json`文件夹中，指定`type:module`

```javascript
{"type":"module"}
```

设置了后目录内的JS脚本会被解释用ES6模块

```javascript
# 解释成 ES6 模块
$ node my-app.js
```

此时还要使用CommonJs模块，需要将其后缀名改成`.cjs`

若无`type`字段或者`{"type":"commmonjs"}`，则`.js`脚本被解释为CommonJS模块

### package.json的main字段

`package.json`有两个字段可以指定模块的入口文件，`main`和`exports`

```javascript
// ./node_modules/es-module-package/package.json
{
  "type": "module",
  "main": "./src/index.js"
}

// ./my-app.mjs
import { something } from 'es-module-package';
// 实际加载的是 ./node_modules/es-module-package/src/index.js
```

例子中由于使用了ES6模块，因此不能使用CommonJS模块的`require()`命令去加载

### package.json的exports字段

`exports`字段优先高于`main`字段，有以下用法：

1. 子目录别名

   `package.json`的`exports`字段可以指定脚本或子目录的别名，可以通过别名加载这个文件

   ```javascript
   // ./node_modules/es-module-package/package.json
   {
     "exports": {
       "./submodule": "./src/submodule.js"
     }
   }
   
   import submodule from 'es-module-package/submodule';
   // 加载 ./node_modules/es-module-package/src/submodule.js
   
   ```

   如果不指定别名，就不能用这种形式加载脚本

2. main的别名

   `exports`字段的别名如果是`.`，就代表模块的主入口，优先级高于`main`字段，且可简写

   ```javascript
   {
     "exports": {
       ".": "./main.js"
     }
   }
   
   // 等同于
   {
     "exports": "./main.js"
   }
   ```

3. 条件加载

   利用`.`别名，可以为ES6和CommonJS指定不同入口

   ==需要Node.js运行时打开`--experimental-conditional-exports`标志

   ```javascript
   {
     "type": "module",
     "exports": {
       ".": {
         "require": "./main.cjs",
         "default": "./main.js"
       }
     }
   }
   ```

### Node.js的内置模块

内置模块可以整体加载或者加载指定的输出项

```javascript
// 整体加载
import EventEmitter from 'events';
const e = new EventEmitter();

// 加载指定的输出项
import { readFile } from 'fs';
readFile('./foo.txt', (err, source) => {
  if (err) {
    console.error(err);
  } else {
    console.log(source);
  }
});
```

### 加载路径

ES6模块的加载路径必须给出脚本的完整路径，`import`命令和`package.json`文件的`main`字段如果省略脚本的后缀名会报错

`.mjs`文件支持URL路径

```javascript
import './foo.mjs?query=1'; // 加载 ./foo 传入参数 ?query=1
```

同一个脚本只要参数不同，就会被加载多次

 目前Node.js的`import`命令只支持加载本地模块 ，即`file:`协议和`data:`协议，且只支持相对路径

### 内部变量

ES6 模块应该是通用的，同一个模块不用修改，就可以用在浏览器环境和服务器环境。为了达到这个目标，Node.js 规定 ES6 模块之中不能使用 CommonJS 模块的特有的一些内部变量。

首先，就是`this`关键字。ES6 模块之中，顶层的`this`指向`undefined`；CommonJS 模块的顶层`this`指向当前模块，这是两者的一个重大差异。

其次，以下这些顶层变量在 ES6 模块之中都是不存在的。

- `arguments`
- `require`
- `module`
- `exports`
- `__filename`
- `__dirname`

## 循环加载

即`a`脚本依赖`b`脚本，而`b`脚本又依赖`a`脚本

```javascript
// a.js
var b = require('b');

// b.js
var a = require('a');
```

### CommonJS模块的加载原理

CommonJS 的一个模块，就是一个脚本文件。`require`命令第一次加载该脚本，就会执行整个脚本，然后在内存生成一个对象。

```javascript
{
  id: '...',
  exports: { ... },
  loaded: true,
  ...
}
```

上面代码就是 Node 内部加载模块后生成的一个对象。该对象的`id`属性是模块名，`exports`属性是模块输出的各个接口，`loaded`属性是一个布尔值，表示该模块的脚本是否执行完毕。其他还有很多属性，这里都省略了。

以后需要用到这个模块的时候，就会到`exports`属性上面取值。即使再次执行`require`命令，也不会再次执行该模块，而是到缓存之中取值。也就是说，CommonJS 模块无论加载多少次，都只会在第一次加载时运行一次，以后再加载，就返回第一次运行的结果，除非手动清除系统缓存。

### CommonJS模块的循环加载

脚本代码在`require`的时候，就会全部执行

如果出现某个模块被循环加载，就只输出已经执行的部分

```javascript
//a.js
exports.done = false;
var b = require('./b.js');
console.log('在 a.js 之中，b.done = %j', b.done);
exports.done = true;
console.log('a.js 执行完毕');

//b.js
exports.done = false;
var a = require('./a.js');
console.log('在 b.js 之中，a.done = %j', a.done);
exports.done = true;
console.log('b.js 执行完毕');
```

`a.js`先输出一个`done`变量，然后加载`b.js`，`b.js`执行到第二行，去加载`a.js`，而此时只能获取`a.js`已经执行的部分，即`done`变量的输出，然后往下执行，完毕后将执行权交还给`a.js`，`a.js`继续往下执行

### ES6模块的循环加载

ES6 模块是动态引用，如果使用`import`从一个模块加载变量（即`import foo from 'foo'`），那些变量不会被缓存，而是成为一个指向被加载模块的引用，需要开发者自己保证，真正取值的时候能够取到值。

```javascript
// a.mjs
import {bar} from './b';
console.log('a.mjs');
console.log(bar);
export let foo = 'foo';

// b.mjs
import {foo} from './a';
console.log('b.mjs');
console.log(foo);
export let bar = 'bar';
```

```javascript
//执行结果
$ node --experimental-modules a.mjs
b.mjs
ReferenceError: foo is not defined
```

`b.mjs`从`a.mjs`输入了`foo`接口，这时不会去执行`a.mjs`，而是认为接口已经存在，继续往下执行












