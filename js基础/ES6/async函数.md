# async函数

作为Generator函数的语法糖

将Generator函数的`*`替换为`async`，将`yield`替换成`await`

对Generator函数的四点改进：

1. 内置执行器

   执行和普通函数一样，只需要一行

2. 更好的语义

3. 更广的适用性

   和`co`模块相比，`await`命令后可以是Promise对象和原始类型的值（若为原始类型都值会立刻转为resolved的Promise对象）

4. 返回值是Promise

## 用法

当函数执行时，一旦遇到`await`就会先返回，等到异步操作完成，再接着执行

例子：

```javascript
function timeout(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function asyncPrint(value, ms) {
  await timeout(ms);
  console.log(value);
}

asyncPrint('hello world', 50);
```

## 语法

### 返回Promise对象

`async`函数返回一个Promise对象

且内部`return`语句返回的值会称为`then`方法回调函数的参数

```javascript
async function f() {
  return 'hello world';
}

f().then(v => console.log(v))
// "hello world"
```

`async`内部抛出的错误，会导致返回的Promise对象变为`reject`状态，抛出的错误会被`catch`方法接收

```javascript
async function f() {
  throw new Error('出错了');
}

f().then(
  v => console.log(v),
  e => console.log(e)
)
// Error: 出错了
```

## Promise对象的状态变化

`async`返回的Promise必须等到内部所有`await`命令后面的Promise对象执行完才会发生状态变化，触发遇到`return`语句或者抛出了错误

## await命令

`await`后面如果是一个Promise对象，则返回该对象的结果

如果不是就直接返回对应的值

```javascript
async function f() {
  // 等同于
  // return 123;
  return await 123;
}

f().then(v => console.log(v))
// 123
```

若后面是一个定义了`then`方法的`thenable`对象，那么`await`等同于Promise对象

```javascript
class Sleep {
  constructor(timeout) {
    this.timeout = timeout;
  }
  then(resolve, reject) {
    const startTime = Date.now();
    setTimeout(
      () => resolve(Date.now() - startTime),
      this.timeout
    );
  }
}

(async () => {
  const sleepTime = await new Sleep(1000);
  console.log(sleepTime);
})();
// 1000
```

`await`命令后面的Promise对象如果变为`reject`状态，会被`catch`方法的回调函数接收，且整个`async`函数都会中断执行

如果想避免影响到后面的异步操作，可以将可能会报错的异步操作放在`try...catch`内

```javascript
async function f() {
  try {
    await Promise.reject('出错了');
  } catch(e) {
  }
  return await Promise.resolve('hello world');
}

f()
.then(v => console.log(v))
// hello world
```

或者在Promise后面跟一个`catch`方法来捕获错误

```javascript
async function f() {
  await Promise.reject('出错了')
    .catch(e => console.log(e));
  return await Promise.resolve('hello world');
}

f()
.then(v => console.log(v))
// 出错了
// hello world
```

## 错误处理

`await`后面的异步操作出错等同于`async`函数返回的Promise对象被`reject`

```javascript
async function f() {
  await new Promise(function (resolve, reject) {
    throw new Error('出错了');
  });
}

f()
.then(v => console.log(v))
.catch(e => console.log(e))
// Error：出错了
```

## 使用注意点

1.  最好将`await`放在`try...catch`中

   ```javascript
   async function myFunction() {
     try {
       await somethingThatReturnsAPromise();
     } catch (err) {
       console.log(err);
     }
   }
   
   // 另一种写法
   
   async function myFunction() {
     await somethingThatReturnsAPromise()
     .catch(function (err) {
       console.log(err);
     });
   }
   ```

2. 多个`await`命令后面的异步操作如果不存在继发关系，最好同时触发

   ```javascript
   let foo = await getFoo();
   let bar = await getBar();
   
   // 写法一
   let [foo, bar] = await Promise.all([getFoo(), getBar()]);
   
   // 写法二
   let fooPromise = getFoo();
   let barPromise = getBar();
   let foo = await fooPromise;
   let bar = await barPromise;
   ```

3. `await`只能在`async`函数中使用

4. `async`函数可以保留运行堆栈

   ```javascript
   const a = () => {
     b().then(() => c());
   };
   ```

   `a`内部有一个异步任务`b()`，当`b()`运行的时候，`a()`会继续执行，等到`b()`运行结束`a()`可能已经运行结束了，那`b()`的上下文环境就消失了

   可以改成`async`函数

   ```javascript
   const a = async() =>{
       await b();
       c();
   }
   ```

## async函数的实现原理

将Generator函数和自动执行器包装在一个函数内

```javascript
async function fn(args) {
  // ...
}

// 等同于

function fn(args) {
  return spawn(function* () {
    // ...
  });
}
```

`spawn`自动执行器都实现

```javascript
function spawn(genF) {
  return new Promise(function(resolve, reject) {
    const gen = genF();
    function step(nextF) {
      let next;
      try {
        next = nextF();
      } catch(e) {
        return reject(e);
      }
      if(next.done) {
        return resolve(next.value);
      }
      Promise.resolve(next.value).then(function(v) {
        step(function() { return gen.next(v); });
      }, function(e) {
        step(function() { return gen.throw(e); });
      });
    }
    step(function() { return gen.next(undefined); });
  });
}
```

## 与其他异步处理方法的比较

假定某个 DOM 元素上面，部署了一系列的动画，前一个动画结束，才能开始后一个。如果当中有一个动画出错，就不再往下执行，返回上一个成功执行的动画的返回值。

1. Promise写法

```javascript
function chainAnimationsPromise(elem, animations) {

  // 变量ret用来保存上一个动画的返回值
  let ret = null;

  // 新建一个空的Promise
  let p = Promise.resolve();

  // 使用then方法，添加所有动画
  for(let anim of animations) {
    p = p.then(function(val) {
      ret = val;
      return anim(elem);
    });
  }

  // 返回一个部署了错误捕捉机制的Promise
  return p.catch(function(e) {
    /* 忽略错误，继续执行 */
  }).then(function() {
    return ret;
  });

}
```

2. Generator函数的写法

```javascript
function chainAnimationsGenerator(elem, animations) {

  return spawn(function*() {
    let ret = null;
    try {
      for(let anim of animations) {
        ret = yield anim(elem);
      }
    } catch(e) {
      /* 忽略错误，继续执行 */
    }
    return ret;
  });

}
```

3. async函数的写法

```javascript
async function chainAnimationsAsync(elem, animations) {
  let ret = null;
  try {
    for(let anim of animations) {
      ret = await anim(elem);
    }
  } catch(e) {
    /* 忽略错误，继续执行 */
  }
  return ret;
}
```























