# Web Worker

为JavaScript创造多线程环境，允许主线程创建Worker线程，将一些任务分配给Worker运行

主线程运行的同时，Worker线程在后台运行，两者互不干扰

Worker线程一旦新建成功，就会始终运行，不会被主线程上的活动打断，但与此同时比较耗费资源，且使用完毕应该立刻关闭

使用注意点：

+ **同源限制**

  分配给Worker线程的脚本文件必须与主线程脚本文件同源

+ **DOM限制**

  Worker线程所在的全局对象与主线程不一样，无法读取主线程所在网页的DOM对象，也无法使用`document`，`window`，`parent`这些对象

  但可以使用`navigator`对象和`location`对象

+ **全局对象限制**

  WorkerWorker 的全局对象`WorkerGlobalScope`，不同于网页的全局对象`Window`，很多接口拿不到

  比如，理论上 Worker 线程不能使用`console.log`，因为标准里面没有提到 Worker 的全局对象存在`console`接口，只定义了`Navigator`接口和`Location`接口。不过，浏览器实际上支持 Worker 线程使用`console.log`，保险的做法还是不使用这个方法

+ **通信联系**

  Worker 线程和主线程不在同一个上下文环境，它们不能直接通信，必须通过消息完成。

+ **脚本限制**

  Worker 线程不能执行`alert()`方法和`confirm()`方法，但可以使用 XMLHttpRequest 对象发出 AJAX 请求。

+ **文件限制**

  Worker 线程无法读取本地文件，即不能打开本机的文件系统（`file://`），它所加载的脚本，必须来自网络。

## 基本用法

### 主线程

1. 使用`new`命令，调用`Worker()`构造函数新建一个Worker线程

```javascript
var worker = new Worker('work.js');
```

参数为脚本文件，为Worker线程要执行的任务

==这个脚本必须来自网络==

若下载没有成功Worker会失败但不会报错

2. 主线程调用`worker.postMessage()`，向Worker发信息

```javascript
worker.postMessage('Hello World');
worker.postMessage({method: 'echo', args: ['Work']});
```

参数为主线程传给Worker的数据，可以是各种数据类型，包括二进制

3. 主线程通过`worker.onmessage()`，监听子线程发回来的消息

```javascript
worker.onmessage = function (event) {
  doSomething(event.data);
}

function doSomething() {
  // 执行任务
  worker.postMessage('Work done!');
}
```

4. Worker完成任务后，主线程关闭Worker

```javascript
worker.terminate();
```

### Worker线程

内部需要一个监听函数，监听`message`事件

```javascript
self.addEventListener('message', function (e) {
  self.postMessage('You said: ' + e.data);
}, false);
```

`self`为子线程本身，即子线程的全局对象，等同于：

```javascript
// 写法一
this.addEventListener('message', function (e) {
  this.postMessage('You said: ' + e.data);
}, false);

// 写法二
addEventListener('message', function (e) {
  postMessage('You said: ' + e.data);
}, false);
```

使用`self.postMessage()`向主线程发送信息

```javascript
self.addEventListener('message', function (e) {
  var data = e.data;
  switch (data.cmd) {
    case 'start':
      self.postMessage('WORKER STARTED: ' + data.msg);
      break;
    case 'stop':
      self.postMessage('WORKER STOPPED: ' + data.msg);
      self.close(); // Terminates the worker.
      break;
    default:
      self.postMessage('Unknown command: ' + data.msg);
  };
}, false);
```

### Worker加载脚本

内部加载其他脚本，需要使用`importScripts()`

```javascript
importScripts('script1.js');
//可同时加载多个脚本
importScripts('script1.js', 'script2.js');
```

### 错误处理

如果Worker发生错误，会触发主线程的`error`事件

```javascript
worker.onerror(function (event) {
  console.log([
    'ERROR: Line ', event.lineno, ' in ', event.filename, ': ', event.message
  ].join(''));
});

// 或者
worker.addEventListener('error', function (event) {
  // ...
});
```

### 关闭Worker

```javascript
// 主线程
worker.terminate();

// Worker 线程
self.close();
```

## 数据通信

主线程与Worker之间的通信内容，是==传值而不是传址==

浏览器内部的运行机制是，先将通信内容串行化，然后把串行化后的字符串发给 Worker，后者再将它还原

```javascript
// 主线程
var uInt8Array = new Uint8Array(new ArrayBuffer(10));
for (var i = 0; i < uInt8Array.length; ++i) {
  uInt8Array[i] = i * 2; // [0, 2, 4, 6, 8,...]
}
worker.postMessage(uInt8Array);

// Worker 线程
self.onmessage = function (e) {
  var uInt8Array = e.data;
  postMessage('Inside worker.js: uInt8Array.toString() = ' + uInt8Array.toString());
  postMessage('Inside worker.js: uInt8Array.byteLength = ' + uInt8Array.byteLength);
};
```



























