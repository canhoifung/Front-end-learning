# Generator的异步应用

## 传统方法

+ 回调函数
+ 事件监听
+ 发布/订阅
+ Promise对象

### 回调函数

```javascript
fs.readFile('/etc/passwd', 'utf-8', function (err, data) {
  if (err) throw err;
  console.log(data);
});
```

==由于第一段执行完成后任务所在的上下文环境结束，之后抛出的错误原来的上下文已经无法捕捉，因此需要当作参数传入第二段==

### Promise

若回调函数需要读取A文件后再读取B文件，就会出现嵌套

```javascript
fs.readFile(fileA, 'utf-8', function (err, data) {
  fs.readFile(fileB, 'utf-8', function (err, data) {
    // ...
  });
});
```

若数量多了会形成多重嵌套，修改阅读困难

而Promise对象允许回调嵌套，改为链式调用

```javascript
//使用fs-readfile-promise模块获取readFile函数
var readFile = require('fs-readfile-promise');

readFile(fileA)
.then(function (data) {
  console.log(data.toString());
})
.then(function () {
  return readFile(fileB);
})
.then(function (data) {
  console.log(data.toString());
})
.catch(function (err) {
  console.log(err);
});
```

执行更清晰，但是代码冗余

## Generator函数

### 协程

即多个线程互相协作，完成异步任务

运行流程：

1. 协程`A`开始执行
2. `A`执行到一半暂停，将执行权转移到协程`B`
3. 一段时间后`B`交还执行权
4. `A`恢复执行

`A`即指代异步任务

读取文件的协程写法：

```javascript
function* asyncJob() {
  // ...其他代码
  var f = yield readFile(fileA);
  // ...其他代码
}
```

### 协程的Generator函数实现

特点在于可以通过`yield`交出函数的执行权

异步操作需要暂停的地方都用`yield`语句注明

```javascript
function* gen(x) {
  var y = yield x + 2;
  return y;
}

var g = gen(1);
g.next() // { value: 3, done: false }
g.next() // { value: undefined, done: true }
```

### 异步任务的封装

例子：

```javascript
var fetch = require('node-fetch');
//fetch模块返回一个Promise对象
function* gen(){
  var url = 'https://api.github.com/users/github';
  var result = yield fetch(url);
  console.log(result.bio);
}
```

```javascript
//调用方法
var g = gen();
var result = g.next();

result.value.then(function(data){
  return data.json();
}).then(function(data){
  g.next(data);
});
```

虽然 Generator 函数将异步操作表示得很简洁，但是流程管理却不方便

## Thunk函数

用于实现编译器的“传名调用”，即函数参数在内部调用的时候才求值

```javascript
var x = 1;

function f(m) {
  return m * 2;
}

f(x + 5);
//传值调用相当于：f(6)
//传名调用相当于：(x+5)*2
```

传名调用的实现是将参数放到一个临时函数中，再将临时函数传入函数体，临时函数即为Thunk函数

```javascript
//上面例子相当于：
var thunk = function () {
  return x + 5;
};

function f(thunk) {
  return thunk() * 2;
}
```



在JS中，采用的是传值调用，因为它的Thunk函数替换的不是表达式，而是多参数函数，将其替换为只接受回调函数作为函数的单参数函数

```javascript
// 正常版本的readFile（多参数版本）
fs.readFile(fileName, callback);

// Thunk版本的readFile（单参数版本）
var Thunk = function (fileName) {
  return function (callback) {
    return fs.readFile(fileName, callback);
  };
};

var readFileThunk = Thunk(fileName);
readFileThunk(callback);
```

Thunk函数转换器：

```javascript
// ES5版本
var Thunk = function(fn){
  return function (){
    var args = Array.prototype.slice.call(arguments);
    return function (callback){
      args.push(callback);
      return fn.apply(this, args);
    }
  };
};

// ES6版本
const Thunk = function(fn) {
  return function (...args) {
    return function (callback) {
      return fn.call(this, ...args, callback);
    }
  };
};
```



生产环境的转换器可以使用Thunkify模块

安装：

```javascript
$ npm install thunkify
```

使用方法：

```javascript
var thunkify = require('thunkify');
var fs = require('fs');

var read = thunkify(fs.readFile);
read('package.json')(function(err, str){
  // ...
});
```

源码：

```javascript
function thunkify(fn) {
  return function() {
    var args = new Array(arguments.length);
    var ctx = this;

    for (var i = 0; i < args.length; ++i) {
      args[i] = arguments[i];
    }

    return function (done) {
      var called;

      args.push(function () {
          //使用called确保回调函数只运行一次
        if (called) return;
        called = true;
        done.apply(null, arguments);
      });

      try {
        fn.apply(ctx, args);
      } catch (err) {
        done(err);
      }
    }
  }
};
```

例子：

```javascript
function f(a, b, callback){
  var sum = a + b;
  callback(sum);
  callback(sum);
}

var ft = thunkify(f);
var print = console.log.bind(console);
ft(1, 2)(print);
// 3
```

### Thunk函数用于Generator函数的流程管理

Generator函数例子：

```javascript
var fs = require('fs');
var thunkify = require('thunkify');
var readFileThunk = thunkify(fs.readFile);

var gen = function* (){
  var r1 = yield readFileThunk('/etc/fstab');
  console.log(r1.toString());
  var r2 = yield readFileThunk('/etc/shells');
  console.log(r2.toString());
};
```

函数执行：

```javascript
var g = gen();

var r1 = g.next();
r1.value(function (err, data) {
  if (err) throw err;
  var r2 = g.next(data);
  r2.value(function (err, data) {
    if (err) throw err;
    g.next(data);
  });
});
```

实质是将同一个回调函数反复传入`next`方法的`value`属性

### Thunk函数的自动流程管理

例子：

```javascript
// 一个普通的异步函数，接受3个参数，分别是延迟，执行处理函数，和回调函数
function delay(time, dealCallback, callback) {
    setTimeout(function () {
        dealCallback()
        callback()
    }, time ? time : 1000)
}
// 一个标准的thunk函数，声明时暴露打印内容和时间的配置，但不会立即执行
// 返回值是一个参数为回调函数的函数（执行本函数时，异步不会执行）
function thunkForAsync(time, dealCallback) {
    return function (callback) {
        delay(time, dealCallback, callback)
    }
}

// 一个Generator函数，目的是连续发起2次异步请求，但打印内容不同
function *g() {
    yield thunkForAsync(null, function () {
        console.log('first')
    })
    yield thunkForAsync(500, function () {
        console.log('second')
    })
}
// 一个用于自动执行（管理）Generator函数的Thunk函数
// 自动控制 Generator 函数的流程，接收和交还程序的执行权
// 但要求Generator函数的每个yield表达式，都是Thunk函数（不然next没有办法作为参数传过去）
function thunkForGenerator(callback) {
    let g = callback()

    function next() {
        let result = g.next()
        if (result.done) {
            return
        }
        result.value(next)
    }

    // 这里启动函数
    next()
}
// 执行管理函数，将Generator函数作为参数传给他即可
thunkForGenerator(g)
```

例子中`thunkForGenerator`函数就是用于自动控制Generator函数的流程，接收和交还程序的执行权

同时要求Generator函数内的每一个异步请求都是Thunk函数，因为每个Thunk函数都会返回一个函数，而函数内部唯一参数就是一个回调函数

上面例子的执行流程为：

1. `thunkForGenerator`函数执行，通过变量`g`获取`callback`即`g`构造函数的遍历器

2. 执行第一次`next`，执行`g.next()`，`result.value`赋值为第一个`thunkForAsync`的返回值，即

   ```javascript
   function(callback){
       delay(null,function(){console.log('first')},callback}
   }
   ```

3. 由于`result.done==false`，将`next`函数本身作为参数传入`result.value`返回的函数

4. 由于`delay`是一个异步函数，在`1000`毫秒后执行内容，执行下一次`next`函数

5. 重复上面过程，直到`result.done==true`，结束函数执行



## co模块

用于Generator函数的自动执行

返回一个`Promise`对象

```javascript
var gen = function* () {
  var f1 = yield readFile('/etc/fstab');
  var f2 = yield readFile('/etc/shells');
  console.log(f1.toString());
  console.log(f2.toString());
};
var co = require('co');
co(gen);
```

### co模块原理

将Thunk函数和Promise对象包装成一个模块

==使用前提：==Generator函数的`yield`命令后面只能是Thunk函数或Promise对象

### 基于Promise对象的自动执行

例子：

准备步骤：

```javascript
var fs = require('fs');

var readFile = function (fileName){
  return new Promise(function (resolve, reject){
    fs.readFile(fileName, function(error, data){
      if (error) return reject(error);
      resolve(data);
    });
  });
};

var gen = function* (){
  var f1 = yield readFile('/etc/fstab');
  var f2 = yield readFile('/etc/shells');
  console.log(f1.toString());
  console.log(f2.toString());
};
```

```javascript
//手动执行
var g = gen();

g.next().value.then(function(data){
  g.next(data).value.then(function(data){
    g.next(data);
  });
});
```

```javascript
//自动执行
function run(gen){
  var g = gen();
  function next(data){
    var result = g.next(data);
    if (result.done) return result.value;
    result.value.then(function(data){
      next(data);
    });
  }
  next();
}
run(gen);
```

### co模块源码

```javascript
function co(gen) {
  var ctx = this;
	//返回一个Promise对象
  return new Promise(function(resolve, reject) {
      //检查`gen`是否为Generator函数，是则执行获取内部指针对象，不是就返回并将Promise对象状态改为resolved
      if (typeof gen === 'function') gen = gen.call(ctx);
      if (!gen || typeof gen.next !== 'function') return resolve(gen);
      //将`next`方法包装成`onFulFilled`函数，便于捕捉抛出的错误
      onFulfilled();
      function onFulfilled(res) {
          var ret;
          try {
              ret = gen.next(res);
          } catch (e) {
              return reject(e);
          }
          next(ret);
      }
      //next函数
      function next(ret) {
          if (ret.done) return resolve(ret.value);
          var value = toPromise.call(ctx, ret.value);
          if (value && isPromise(value)) return value.then(onFulfilled, onRejected);
          return onRejected(
              new TypeError(
                  'You may only yield a function, promise, generator, array, or object, '
                  + 'but the following object was passed: "'
                  + String(ret.value)
                  + '"'
              )
          );
      }
  });
}
```

### 并发的异步操作

需要将操作都放在数组或对象里面，跟在`yield`语句后面

```javascript
// 数组的写法
co(function* () {
  var res = yield [
    Promise.resolve(1),
    Promise.resolve(2)
  ];
  console.log(res);
}).catch(onerror);

// 对象的写法
co(function* () {
  var res = yield {
    1: Promise.resolve(1),
    2: Promise.resolve(2),
  };
  console.log(res);
}).catch(onerror);
```



























