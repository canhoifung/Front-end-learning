# Generator

是一种==异步编程解决方案==

可以理解成一个状态机，封装了多个内部状态

返回一个遍历器对象

`function`关键字与函数名之间有一个星号

函数体内部使用`yield`表达式，定义不同的内部状态

## yield表达式

`yield`表达式作为一个暂停标志

遍历器的`next`方法运行逻辑：

1. 遇到`yield`表达式，就暂停执行后面的操作，并将紧跟在`yield`后面的那个表达式的值，作为返回的对象的`value`属性值。
2. 下一次调用`next`方法时，再继续往下执行，直到遇到下一个`yield`表达式
3. 如果没有再遇到新的`yield`表达式，就一直运行到函数结束，直到`return`语句为止，并将`return`语句后面的表达式的值，作为返回的对象的`value`属性值
4. 如果该函数没有`return`语句，则返回的对象的`value`属性值为`undefined`。

==`yield`表达式后面的表达式只有当调用`next`方法时才会执行==

==如果`yield`表达式用在另一个表达式中，则必须放在圆括号里面==

```javascript
function* demo() {
  console.log('Hello' + yield); // SyntaxError
  console.log('Hello' + yield 123); // SyntaxError

  console.log('Hello' + (yield)); // OK
  console.log('Hello' + (yield 123)); // OK
}
```

==`yield`表达式用作函数参数或放在赋值表达式的右边，可以不加括号。==

```javascript
function* demo() {
  foo(yield 'a', yield 'b'); // OK
  let input = yield; // OK
}
```

## 与Iterator接口

可以将Generator赋值给对象的`Symbol.iterator`属性，从而使该对象具有Iterator接口

Generator执行后返回一个遍历器对象，该对象本身的`Symbol.iterator`指向自己

```javascript
function* gen(){
  // some code
}

var g = gen();

g[Symbol.iterator]() === g
// true
```

## next方法的参数

`yield`表达式本身总是返回`undefined`

`next`方法可以带一个参数，会被当作上一个`yield`表达式的返回值

```javascript
function* f() {
  for(var i = 0; true; i++) {
    var reset = yield i;
    if(reset) { i = -1; }
  }
}

var g = f();

g.next() // { value: 0, done: false }
g.next() // { value: 1, done: false }
g.next(true) // { value: 0, done: false }
```

另一个例子：

```javascript
function* foo(x) {
  var y = 2 * (yield (x + 1));
  var z = yield (y / 3);
  return (x + y + z);
}

var a = foo(5);
a.next() // Object{value:6, done:false}
a.next() // Object{value:NaN, done:false}
a.next() // Object{value:NaN, done:true}

var b = foo(5);
b.next() // { value:6, done:false }
b.next(12) // { value:8, done:false }
b.next(13) // { value:42, done:true }
```

从语义上讲，第一个`next`方法用来启动遍历器对象，所以不用带有参数

## for...of循环

可以自动遍历Generator函数运行时生成的`Iterator`对象，而且不需要主动调用`next()`

若`next`返回对象的`done`属性为`true`，就会中止循环，且不包含该返回对象

## Generator.prototype.throw()

在函数体外抛出错误，然后在函数体内捕获

```javascript
var g = function* () {
  try {
    yield;
  } catch (e) {
    console.log('内部捕获', e);
  }
};

var i = g();
i.next();

try {
  i.throw('a');
  i.throw('b');
} catch (e) {
  console.log('外部捕获', e);
}
// 内部捕获 a
// 外部捕获 b
```

例子中抛出了两个错误，第一个被内部的`catch`捕获，捕获后`catch`执行结束，此时第二个错误不会被内部捕获，因此抛出到外部



`throw`方法的参数会被`catch`语句接收

若内部没有部署`try...catch`，则抛出错误会被外部的`try...catch`捕获

==要抛出错误要被内部捕获，必须先执行过至少一次`next`方法==

被捕获后会附带执行下一条`yield`表达式

```javascript
var gen = function* gen(){
  try {
    yield console.log('a');
  } catch (e) {
    // ...
  }
  yield console.log('b');
  yield console.log('c');
}

var g = gen();
g.next() // a
g.throw() // b
g.next() // c
```

若执行过程中抛出错误，且没有被内部捕获，就会被认为已经运行结束了，再调用`next`也只会返回`{value:undefined,done:true}`的对象

## Generator.prototype.return()

返回给定的值，并终结遍历Generator函数

```javascript
function* gen() {
  yield 1;
  yield 2;
  yield 3;
}

var g = gen();

g.next()        // { value: 1, done: false }
g.return('foo') // { value: "foo", done: true }
g.next()        // { value: undefined, done: true }
```

若Generator内部有`try...finally`代码块，且正在执行`try`代码块，`return`方法会导致立刻进入`finally`代码块，且要等`finally`执行完后函数才会结束

```javascript
function* numbers () {
  yield 1;
  try {
    yield 2;
    yield 3;
  } finally {
    yield 4;
    yield 5;
  }
  yield 6;
}
var g = numbers();
g.next() // { value: 1, done: false }
g.next() // { value: 2, done: false }
g.return(7) // { value: 4, done: false }
g.next() // { value: 5, done: false }
g.next() // { value: 7, done: true }
```

## next()、throw()、return()的共同点

本质是让Generator函数恢复执行，并用不同的语句替换`yield`表达式

`next()`将`yield`表达式替换成一个值

`throw()`将`yield`表达式替换成`throw`语句

`return()`将`yield`表达式替换成一个`return`语句

## yield*表达式

用于在一个Generator函数内部执行另一个Generator函数

```javascript
function* foo() {
  yield 'a';
  yield 'b';
}
```

```javascript
function* bar() {
  yield 'x';
  yield* foo();
  yield 'y';
}
// 等同于
function* bar() {
  yield 'x';
  yield 'a';
  yield 'b';
  yield 'y';
}
// 等同于
function* bar() {
  yield 'x';
  for (let v of foo()) {
    yield v;
  }
  yield 'y';
}
for (let v of bar()){
  console.log(v);
}
// "x"
// "a"
// "b"
// "y"
```

有`return`的情况

```javascript
function* foo() {
  yield 2;
  yield 3;
  return "foo";
}

function* bar() {
  yield 1;
  var v = yield* foo();
  console.log("v: " + v);
  yield 4;
}

var it = bar();

it.next()
// {value: 1, done: false}
it.next()
// {value: 2, done: false}
it.next()
// {value: 3, done: false}
it.next();
// "v: foo"
// {value: 4, done: false}
it.next()
// {value: undefined, done: true}
```

## 作为对象属性的Generator函数

可以简写为：

```javascript
let obj = {
  * myGeneratorMethod() {
    ···
  }
};
//等价于
let obj = {
  myGeneratorMethod: function* () {
    // ···
  }
};
```

## Generator函数的`this`

Generator函数总是返回一个遍历器，ES6规定这个遍历器是Generator函数的实例，继承了Generator函数的`prototype`对象上的方法

```javascript
function* g() {}

g.prototype.hello = function () {
  return 'hi!';
};

let obj = g();

obj instanceof g // true
obj.hello() // 'hi!'
```

==不能和`new`命令一起用，会报错==



让Generator函数返回一个正常的对象实例，既可以使用`next`方法，又可以获得正常的`this`

```javascript
function* F() {
  this.a = 1;
  yield this.b = 2;
  yield this.c = 3;
}
var obj = {};
var f = F.call(obj);

f.next();  // Object {value: 2, done: false}
f.next();  // Object {value: 3, done: false}
f.next();  // Object {value: undefined, done: true}

obj.a // 1
obj.b // 2
obj.c // 3

//或者更加统一：
var f = F.call(F.prototype);

f.next();  // Object {value: 2, done: false}
f.next();  // Object {value: 3, done: false}
f.next();  // Object {value: undefined, done: true}

f.a // 1
f.b // 2
f.c // 3
```

## Generator与状态机

状态机例子：每运行一次就改变一次状态

```javascript
var ticking = true;
var clock = function() {
  if (ticking)
    console.log('Tick!');
  else
    console.log('Tock!');
  ticking = !ticking;
}
//Generator实现
var clock = function* () {
  while (true) {
    console.log('Tick!');
    yield;
    console.log('Tock!');
    yield;
  }
};
```

## Generator与协程

协程（coroutine）是一种程序运行的方式，可以理解成“协作的线程”或“协作的函数”。协程既可以用单线程实现，也可以用多线程实现。前者是一种特殊的子例程，后者是一种特殊的线程

**（1）协程与子例程的差异**

传统的“子例程”（subroutine）采用堆栈式“后进先出”的执行方式，只有当调用的子函数完全执行完毕，才会结束执行父函数。协程与其不同，多个线程（单线程情况下，即多个函数）可以并行执行，但是只有一个线程（或函数）处于正在运行的状态，其他线程（或函数）都处于暂停态（suspended），线程（或函数）之间可以交换执行权。也就是说，一个线程（或函数）执行到一半，可以暂停执行，将执行权交给另一个线程（或函数），等到稍后收回执行权的时候，再恢复执行。这种可以并行执行、交换执行权的线程（或函数），就称为协程。

从实现上看，在内存中，子例程只使用一个栈（stack），而协程是同时存在多个栈，但只有一个栈是在运行状态，也就是说，协程是以多占用内存为代价，实现多任务的并行。

**（2）协程与普通线程的差异**

不难看出，协程适合用于多任务运行的环境。在这个意义上，它与普通的线程很相似，都有自己的执行上下文、可以分享全局变量。它们的不同之处在于，同一时间可以有多个线程处于运行状态，但是运行的协程只能有一个，其他协程都处于暂停状态。此外，普通的线程是抢先式的，到底哪个线程优先得到资源，必须由运行环境决定，但是协程是合作式的，执行权由协程自己分配。

由于 JavaScript 是单线程语言，只能保持一个调用栈。引入协程以后，每个任务可以保持自己的调用栈。这样做的最大好处，就是抛出错误的时候，可以找到原始的调用栈。不至于像异步操作的回调函数那样，一旦出错，原始的调用栈早就结束。

Generator 函数是 ES6 对协程的实现，但属于不完全实现。Generator 函数被称为“半协程”（semi-coroutine），意思是只有 Generator 函数的调用者，才能将程序的执行权还给 Generator 函数。如果是完全执行的协程，任何函数都可以让暂停的协程继续执行。

如果将 Generator 函数当作协程，完全可以将多个需要互相协作的任务写成 Generator 函数，它们之间使用`yield`表达式交换控制权。

## Generator与上下文

代码运行时，会产生一个全局的上下文环境（即context，又称为运行环境），包含了当前所有的变量和对象

执行函数或者块级代码时，会在当前上下文环境的上层，产生一个函数运行的上下文，变成当前active的上下文，由此形成一个上下文环境的堆栈（context stack）

这个堆栈是“后进先出”的数据结构，最后产生的上下文环境首先执行完成，退出堆栈，然后再执行完成它下层的上下文，直至所有代码执行完成，堆栈清空

Generator 函数不是这样，它执行产生的上下文环境，一旦遇到`yield`命令，就会暂时退出堆栈，但是并不消失，里面的所有变量和对象会==冻结在当前状态==。等到对它执行`next`命令时，这个上下文环境又会重新加入调用栈，冻结的变量和对象恢复执行。

## 应用

### 异步操作的同步化表达

```javascript
function* loadUI() {
  showLoadingScreen();
  yield loadUIDataAsynchronously();
  hideLoadingScreen();
}
var loader = loadUI();
// 加载UI
loader.next()

// 卸载UI
loader.next()
```

第一次调用函数返回一个遍历器

第一次调用`next`，执行`showLoadingScreen()`，并异步加载数据

第二次调用`next`，执行`hideLoadingScreen()`

Ajax例子：

```javascript
function* main() {
  var result = yield request("http://some.url");
  var resp = JSON.parse(result);
    console.log(resp.value);
}

function request(url) {
  makeAjaxCall(url, function(response){
    it.next(response);
  });
}

var it = main();
it.next();
```

逐行读取文本文件例子：

```javascript
function* numbers() {
  let file = new FileReader("numbers.txt");
  try {
    while(!file.eof) {
      yield parseInt(file.readLine(), 10);
    }
  } finally {
    file.close();
  }
}
```

### 控制流管理

用于比较耗时的多步操作：

```javascript
//采用回调函数写法：
step1(function (value1) {
  step2(value1, function(value2) {
    step3(value2, function(value3) {
      step4(value3, function(value4) {
        // Do something with value4
      });
    });
  });
});

//Promise改写：
Promise.resolve(step1)
  .then(step2)
  .then(step3)
  .then(step4)
  .then(function (value4) {
    // Do something with value4
  }, function (error) {
    // Handle any error from step1 through step4
  })
  .done();

//Generator函数优化：
function* longRunningTask(value1) {
  try {
    var value2 = yield step1(value1);
    var value3 = yield step2(value2);
    var value4 = yield step3(value3);
    var value5 = yield step4(value4);
    // Do something with value4
  } catch (e) {
    // Handle any error from step1 through step4
  }
}
scheduler(longRunningTask(initialValue));
function scheduler(task) {
  var taskObj = task.next(task.value);
  // 如果Generator函数未结束，就继续调用
  if (!taskObj.done) {
    task.value = taskObj.value
    scheduler(task);
  }
}
```

==只适用于同步操作==

### 部署Iterator接口

```javascript
function* iterEntries(obj) {
  let keys = Object.keys(obj);
  for (let i=0; i < keys.length; i++) {
    let key = keys[i];
    yield [key, obj[key]];
  }
}

let myObj = { foo: 3, bar: 7 };

for (let [key, value] of iterEntries(myObj)) {
  console.log(key, value);
}

// foo 3
// bar 7
```

### 作为数据结构

```javascript
function* doStuff() {
  yield fs.readFile.bind(null, 'hello.txt');
  yield fs.readFile.bind(null, 'world.txt');
  yield fs.readFile.bind(null, 'and-such.txt');
}
```







