# Promise内部Promise执行顺序问题

```javascript
let p = new Promise((resolve, reject) => {
  console.log("log: 外部promise");
  resolve();
})
p.then(() => {
    console.log("log: 外部第一个then");
    new Promise((resolve, reject) => {
      console.log("log: 内部promise");
      resolve();
    })
      .then(() => {
        console.log("log: 内部第一个then");
      })
      .then(() => {
        console.log("log: 内部第二个then");
      });
  })
  .then(() => {
    console.log("log: 外部第二个then");
  });
p.then(() => {
    console.log("log: 外部第一个then2");
    new Promise((resolve, reject) => {
      console.log("log: 内部promise2");
      resolve();
    })
      .then(() => {
        console.log("log: 内部第一个then2");
      })
      .then(() => {
        console.log("log: 内部第二个then2");
      });
  })
  .then(() => {
    console.log("log: 外部第二个then2");
  });

// log: 外部promise
// log: 外部第一个then
// log: 内部promise
// log: 外部第一个then2
// log: 内部promise2
// log: 内部第一个then
// log: 外部第二个then
// log: 内部第一个then2
// log: 外部第二个then2
// log: 内部第二个then
// log: 内部第二个then2
```

结论1：

> 当执行 then 方法时，如果前面的 promise 已经是 resolved 状态，则直接将回调放入微任务队列中

​	`then`方法本身是同步执行的，但是`then`内部的回调会被放入微任务队列

​	如果执行`then`方法时，前面的`promise`已经是`resolved`，就会将回调推入微任务队列

​	若还是`pending`状态，回调会存储在`promise`的内部

结论2：

> 当一个 promise 被 resolve 时，会遍历之前通过 then 给这个 promise 注册的所有回调，将它们依次放入微任务队列中

​	比如：

```javascript
let p = new Promise((resolve, reject) => {
  setTimeout(resolve, 1000);
});
p.then(() => {
  console.log("log: 外部第一个then");
});
p.then(() => {
  console.log("log: 外部第二个then");
});
p.then(() => {
  console.log("log: 外部第三个then");
});
```

定义时已经通过`then`给`p`注册了三个回调，此时由于`p`还处于`pending`，1秒后才会被`resolved`，此时的三个回调存储在`p`内部，等到`p`被`resolved`，依次将回调放入微任务队列

## 案例解析

1. Promise实例化，同步执行函数打印`log:外部promise`，执行`resolve`，将`promise`变为`resovled`，此时`then`方法还未执行

   此时剩余任务：

   > 主线程：外部第一个 then，外部第一个同步then，外部第二个 then
   >
   > 微任务队列：空

2. 开始执行外1then和外1同then，由于外部`promise`已经`resolved`，直接将回调放入微任务队列

   此时剩余任务：

   > 主线程：外2then
   >
   > 微任务队列：外1then 的回调，外部1同then的回调

3. 由于回调还未执行，因此外1then返回的`promise`仍然是`pending`，此时同步执行外2then，由于前面的`promise`仍然是`pending`，因此外2then的回调存储在函数中，不会执行也不会放入微队列

   此时剩余任务：

   > 主线程：空
   >
   > 微任务队列：外1then 的回调，外部1同then的回调

4. 开始执行外1then的内容，打印`log:外部第一个then`，随后实例化`promise`，执行打印`log:内部promise`，然后执行`resolve`，然后执行到内1then，此时内部的`promise`已经`resolved`，（此时进入了异步，开始执行外1同then的回调）因此将回调放入微任务队列

   此时剩余任务：

   > 主线程：内2then
   >
   > 微任务队列：内1then 的回调

5. 此时由于正在执行外1then的回调，因此外1then返回的`promise`仍然是`pending`，因此外2then会保持状态不变

6. 继续同步执行内2then，由于内1then返回的`promise`为`pending`状态（因为还在微任务队列中，还未执行），因此内2then的回调和外2then回调状态一致

   此时剩余任务：

   > 主线程：空
   >
   > 微任务队列：内1then 的回调

7. 此时外1then回调执行完毕，外1then的`promise`变为`resolved`，同时遍历之前通过then给这个`promise`注册的所有回调，将他们放入微任务队列，即外2then的回调

   此时剩余任务：

   > 主线程：空
   >
   > 微任务队列：内1then  的回调，外2then 的回调

8. 主线程逻辑执行完毕，开始执行微任务，取第一个微任务内1then开始执行

   此时剩余任务：

   > 主线程：内1then 的回调
   >
   > 微任务队列：外2then 的回调

9. 执行内1then的回调打印`log:内部第一个then`，执行完毕后内1then的`promise`变为`resolved`，同时遍历之前通过then给这个`promise`注册的所有回调，将他们放入微任务队列，即内2then的回调

   此时剩余任务：

   > 主线程：空
   >
   > 微任务队列：外2then 的回调，内2then 的回调

10. 开始执行下一个微任务，外2then的回调打印`log:外部第二个then`，执行完毕，外2then的`promise`变为`resolved`，遍历后后续没有通过then注册的回调，主线程任务结束

    此时剩余任务：

    > 主线程：空
    >
    > 微任务队列：内2then 的回调

11. 开始执行下一个微任务，内2then的回调打印`log:内部第二个then`，内2then的`promise`变为`resolved`，遍历后后续没有通过then注册的回调，结束