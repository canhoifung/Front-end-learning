# Promise

类似一个容器，内部保存着某个未来才会结束的事件（通常是异步操作）的结果

是一个对象，有以下两个特点：

1. 对象状态不受外界影响。一共三个状态：

   + `pending`
   + `fulfilled`
   + `rejected`

   只有异步操作可以决定当前是什么状态

2. 一旦状态改变，就不会再变化

   只会从 1. `pending`->`fulfilled`，2.`pending`->`rejected`

   改变后就会保持结果，`resolved`了

也有部分缺点：

1. 一旦新建就会立即执行，无法中途取消
2. 不设置回调函数，内部抛出的错误不会反应到外部
3. 当处于`pending`时，无法得知目前进展到哪一个阶段

## 基本用法

创造实例

```javascript
const promise = new Promise(function(resolve, reject) {
  // ... some code

  if (/* 异步操作成功 */){
    resolve(value);
  } else {
    reject(error);
  }
});
```

接收函数作为参数，函数内的参数是`resolve`和`reject`两个函数

`resolve`函数的作用是，将`Promise`对象的状态从“未完成”变为“成功”（即从 pending 变为 resolved），在异步操作成功时调用，并将异步操作的结果，作为参数传递出去

`reject`函数的作用是，将`Promise`对象的状态从“未完成”变为“失败”（即从 pending 变为 rejected），在异步操作失败时调用，并将异步操作报出的错误，作为参数传递出去



生成实例后，通过`then`方法分别指定`resolve`状态和`rejected`状态的回调函数

```javascript
promise.then(function(value) {
  // success
}, function(error) {
  // failure
});
```

`rejected`状态函数可选

特性：

1. 由于Promise新建后会立即执行，因此会如下结果：

```javascript
let promise = new Promise(function(resolve, reject) {
  console.log('Promise');
  resolve();
});

promise.then(function() {
  console.log('resolved.');
});

console.log('Hi!');

// Promise
// Hi!
// resolved
```

2. 若`resolve`函数的参数是另一个Promise实例，

```javascript
const p1 = new Promise(function (resolve, reject) {
  // ...
});

const p2 = new Promise(function (resolve, reject) {
  // ...
  resolve(p1);
})
```

此时`p1`的状态会传给`p2`，`p1`是`pending`，`p2`的回调函数就会等待`p1`的状态改变

`p1`为`resolved`或者`rejected`，`p2`的回调函数会立即执行

```javascript
const p1 = new Promise(function (resolve, reject) {
  setTimeout(() => reject(new Error('fail')), 3000)
})

const p2 = new Promise(function (resolve, reject) {
  setTimeout(() => resolve(p1), 1000)
})

p2
  .then(result => console.log(result))
  .catch(error => console.log(error))
// Error: fail
```

由于`p2`返回的是另一个Promise，导致`p2`自己的状态无效

其后的`then`语句针对`p1`，因此`p1`的状态改变会触发`catch`方法指定的回调函数

3. `resolve`或者`reject`不会终结Promise参数函数的执行

```javascript
new Promise((resolve, reject) => {
  resolve(1);
  console.log(2);
}).then(r => {
  console.log(r);
});
// 2
// 1
```

## Promise.prototype.then()

第一个参数是`resolved`状态回调函数

第二个参数是`rejected`状态回调函数（可选）

`then`返回一个新的`Promise`实例

```javascript
getJSON("/posts.json").then(function(json) {
  return json.post;
}).then(function(post) {
  // 第一个返回的json.post作为第二个then的参数
});
```

## Promise.prototype.catch()

是`.then(null, rejection)`或`.then(undefined, rejection)`的别名，用于指定发生错误时的回调函数

同样返回一个`Promise`实例，因此后面可以跟`catch()`或者`then()`

```javascript
getJSON('/posts.json').then(function(posts) {
  // ...
}).catch(function(error) {
  // 处理 getJSON 和 前一个回调函数运行时发生的错误
  console.log('发生错误！', error);
});
```

例子中`getJSON()`对象变为`rejected`，就会调用`catch()`，或者`then`指定的回调函数抛出错误，也会调用`catch()`

Promise对象的错误会一直向后传递直到被捕获

==建议用`catch()`而不是编写`then`的第二个参数==

==Promise内部的错误不会影响到外部的代码，内部报错外部还是可以继续运行==



```javascript
const promise = new Promise(function (resolve, reject) {
  resolve('ok');
  setTimeout(function () { throw new Error('test') }, 0)
});
promise.then(function (value) { console.log(value) });
// ok
// Uncaught Error: test
```

例子中Promise已经完成了，setTimeout才抛出错误，是在下一轮事件循环时再凹出，此时算作时再Promise函数体外抛出，会冒泡到最外层，称为未捕获的错误

## Promise.prototype.finally()

指定不管Promise对象最后状态如何都会执行的操作

会在执行完`then`、`catch`指定的回调函数后执行

## Promise.all()

将多个Promise实例，包装成一个新的Promise实例

```javascript
const p = Promise.all([p1,p2,p3])
```

如果不是Promise实例，会将参数转为Promise实例再处理

`p`状态相关：

1. 只有`p1`、`p2`、`p3`的状态都变成`fulfilled`，`p`的状态才会变成`fulfilled`，此时`p1`、`p2`、`p3`的返回值组成一个数组，传递给`p`的回调函数。
2. 只要`p1`、`p2`、`p3`之中有一个被`rejected`，`p`的状态就变成`rejected`，此时第一个被`reject`的实例的返回值，会传递给`p`的回调函数。

==如果作为参数的Promise实例自定义了`catch`方法，那么如果状态变为`reject`，不会触发`Promise.all()`的`catch`方法==

## Promise.race()

与`Promise.all()`作用相同

但是只要`p1`、`p2`、`p3`之中有一个实例率先改变状态，`p`的状态就跟着改变。那个率先改变的 Promise 实例的返回值，就传递给`p`的回调函数。

## Promise.allSettled()

接收一组Promise实例作为参数，包装为新的Promise实例

只有当所有参数实例都返回结果（不论成功与否），包装实例才会结束

```javascript
const resolved = Promise.resolve(42);
const rejected = Promise.reject(-1);

const allSettledPromise = Promise.allSettled([resolved, rejected]);

allSettledPromise.then(function (results) {
  console.log(results);
});
// [
//    { status: 'fulfilled', value: 42 },
//    { status: 'rejected', reason: -1 }
// ]
```

## Promise.any()

接收一组Promise实例作为参数，包装为新的Promise实例

只要参数实例有一个变成`fulfilled`状态，包装实例就会变成`fulfilled`状态；如果所有参数实例都变成`rejected`状态，包装实例就会变成`rejected`状态



抛出的错误，不是一个一般的错误，而是一个 AggregateError 实例。它相当于一个数组，每个成员对应一个被`rejected`的操作所抛出的错误。下面是 AggregateError 的实现示例。

```javascript
new AggregateError() extends Array -> AggregateError

const err = new AggregateError();
err.push(new Error("first error"));
err.push(new Error("second error"));
throw err;
```

## Promise.resolve()

将现有对象转为Promise对象

```javascript
Promise.resolve('foo')
// 等价于
new Promise(resolve => resolve('foo'))
```

参数情况：

1. 为Promise实例

不做修改，返回实例

2. `thenable`对象

指具有`then`方法的对象，会将对象转为Promise对象，然后立即执行里面的`then`方法

3. 参数为原始值，或者是不具有`then`方法的对象

返回一个新的Promise对象，状态为`resolved`

```javascript
const p = Promise.resolve('Hello');

p.then(function (s){
  console.log(s)
});
// Hello
```

4. 不带有任何参数

直接返回一个`resolved`状态的Promise对象

执行顺序：

```javascript
setTimeout(function () {
  console.log('three');
}, 0);

Promise.resolve().then(function () {
  console.log('two');
});

console.log('one');

// one
// two
// three
```

## Promise.reject()











