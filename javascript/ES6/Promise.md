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







