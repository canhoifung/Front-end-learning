# Promise对象

[TOC]

为JavaScript的异步操作解决方案，为异步操作提供统一接口

起代理作用，充当异步操作与回调函数之间的中介



设计思想：所有异步任务都返回一个Promise实例。

实例有一个`then`方法，用于指定下一步的回调函数

```javascript
function f1(resolve, reject) {
  // 异步代码...
}

var p1 = new Promise(f1);
p1.then(f2);
```

```javascript
// 传统写法
step1(function (value1) {
  step2(value1, function(value2) {
    step3(value2, function(value3) {
      step4(value3, function(value4) {
        // ...
      });
    });
  });
});

// Promise 的写法
(new Promise(step1))
  .then(step2)
  .then(step3)
  .then(step4);
```

## Promise对象的状态

Promise实例具有三种状态：

+ `pending`：异步操作未完成
+ `fulfilled`：异步操作成功
+ `rejected`：异步操作失败

其中`fulfilled`和`rejected`合称为`resolved`（已定型）

一旦状态发生变化，就不会再有新的状态变化

因此Promise实例状态变化只有两种：

+ 异步操作成功，`pending -> fulfilled`，实例传回一个值
+ 异步操作失败，`pengding -> rejected`，实例抛出一个错误

## Promise构造函数

```javascript
var promise = new Promise(function (resolve, reject) {
  // ...

  if (/* 异步操作成功 */){
    resolve(value);
  } else { /* 异步操作失败 */
    reject(new Error());
  }
});
```

`Promise`构造函数接收一个函数作为参数

函数接受两个参数：

+ `resolve`：将`Promise`实例的状态从`pending`变为`fulfilled`，在异步操作成功时调用，并将异步操作的结果作为参数传递出去
+ `reject`：将`Promise`实例的状态从`pending`变为`rejected`，在异步操作失败时调用，并将异步操作报出的错误，作为参数传递出去

这两个参数同样是两个函数，由JavaScript提供，不用自己实现

```javascript
function timeout(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms, 'done');
  });
}

timeout(100)
```

##　`Promise.prototype.then()`

用于添加回调函数

接受两个回调函数：

+ 异步操作成功时的回调函数
+ 异步操作失败时的回调函数（可以省略）

```javascript
var p1 = new Promise(function (resolve, reject) {
  resolve('成功');
});
p1.then(console.log, console.error);
// "成功"

var p2 = new Promise(function (resolve, reject) {
  reject(new Error('失败'));
});
p2.then(console.log, console.error);
// Error: 失败
```

链式使用：

```javascript
p1
  .then(step1)
  .then(step2)
  .then(step3)
  .then(
    console.log,
    console.error
  );
```

`console.log`只显示`step3`的返回值

`console.error`可以显示`p1`、`step1`、`step2`、`step3`之中任意一个发生的错误

## `then()`用法解析

```javascript
// 写法一
f1().then(function () {
  return f2();
});

// 写法二
f1().then(function () {
  f2();
});

// 写法三
f1().then(f2());

// 写法四
f1().then(f2);
```

写法一的`f3`回调函数的参数，是`f2`函数的运行结果。

```javascript
f1().then(function () {
  return f2();
}).then(f3);
```

写法二的`f3`回调函数的参数是`undefined`。

```javascript
f1().then(function () {
  f2();
  return;
}).then(f3);
```

写法三的`f3`回调函数的参数，是`f2`函数==返回的函数==的运行结果。

```javascript
f1().then(f2())
  .then(f3);
```

写法四与写法一只有一个差别，那就是`f2`会接收到`f1()`返回的结果。

```javascript
f1().then(f2)
  .then(f3);
```

## 实例：图片加载

```javascript
var preloadImage = function (path) {
  return new Promise(function (resolve, reject) {
    var image = new Image();
    image.onload  = resolve;
    image.onerror = reject;
    image.src = path;
  });
};


preloadImage('https://example.com/my.jpg')
  .then(function (e) { document.body.append(e.target) })
  .then(function () { console.log('加载成功') })
```

图片加载成功后，`onload`返回一个事件对象，因此第一个`then`方法的回调函数会接收这个事件对象。`tatget`属性就是

## 微任务

Promise的回调函数属于微任务

微任务追加到本轮事件循环

```javascript
setTimeout(function() {
  console.log(1);
}, 0);

new Promise(function (resolve, reject) {
  resolve(2);
}).then(console.log);

console.log(3);
// 3
// 2
// 1
```

































































