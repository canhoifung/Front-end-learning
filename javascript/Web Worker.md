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

拷贝方式发送二进制数据，会造成性能问题

比如，主线程向 Worker 发送一个 500MB 文件，默认情况下浏览器会生成一个原文件的拷贝。为了解决这个问题，JavaScript 允许主线程把二进制数据直接转移给子线程，但是一旦转移，主线程就无法再使用这些二进制数据了，这是为了防止出现多个线程同时修改数据的麻烦局面。这种转移数据的方法，叫做[Transferable Objects](https://www.w3.org/html/wg/drafts/html/master/infrastructure.html#transferable-objects)。这使得主线程可以快速把数据交给 Worker，对于影像处理、声音处理、3D 运算等就非常方便了，不会产生性能负担。

如果要直接转移数据的控制权，就要使用下面的写法

```javascript
// Transferable Objects 格式
worker.postMessage(arrayBuffer, [arrayBuffer]);

// 例子
var ab = new ArrayBuffer(1);
worker.postMessage(ab, [ab]);
```

## 同页面的Web Worker

Worker可以载入单独JavaScript脚本文件，也可以载入与主线程在同一个页面的代码

```html
<!DOCTYPE html>
  <body>
      <!--必须指定script的type为浏览器不认识的值-->
    <script id="worker" type="app/worker">
      addEventListener('message', function () {
        postMessage('some message');
      }, false);
    </script>
  </body>
</html>
```

```javascript
var blob = new Blob([document.querySelector('#worker').textContent]);
var url = window.URL.createObjectURL(blob);
var worker = new Worker(url);

worker.onmessage = function (e) {
  // e.data === 'some message'
};
```

## 实例：Worker线程完成轮询

用于轮询服务器状态以便第一时间得知状态改变

```javascript
function createWorker(f) {
  var blob = new Blob(['(' + f.toString() + ')()']);
  var url = window.URL.createObjectURL(blob);
  var worker = new Worker(url);
  return worker;
}

var pollingWorker = createWorker(function (e) {
  var cache;

  function compare(new, old) { ... };

  setInterval(function () {
    fetch('/my-api-endpoint').then(function (res) {
      var data = res.json();

      if (!compare(data, cache)) {
        cache = data;
        self.postMessage(data);
      }
    })
  }, 1000)
});

pollingWorker.onmessage = function () {
  // render data
}

pollingWorker.postMessage('init');
```

每秒钟轮询一次数据，与缓存做比较，如果不一致就说明服务端有新变化要通知主线程

## 实例：Worker新建Worker

Worker线程内部新建Worker线程

==目前只有Firefox支持==

```javascript
//主线程
var worker = new Worker('worker.js');
worker.onmessage = function (event) {
  document.getElementById('result').textContent = event.data;
};
```

```javascript
//Worker线程
// worker.js

// settings
var num_workers = 10;
var items_per_worker = 1000000;

// start the workers
var result = 0;
var pending_workers = num_workers;
for (var i = 0; i < num_workers; i += 1) {
  var worker = new Worker('core.js');
  worker.postMessage(i * items_per_worker);
  worker.postMessage((i + 1) * items_per_worker);
  worker.onmessage = storeResult;
}

// handle the results
function storeResult(event) {
  result += event.data;
  pending_workers -= 1;
  if (pending_workers <= 0)
    postMessage(result); // finished!
}
```

```javascript
//计算任务
// core.js
var start;
onmessage = getStart;
function getStart(event) {
  start = event.data;
  onmessage = getEnd;
}

var end;
function getEnd(event) {
  end = event.data;
  onmessage = null;
  work();
}

function work() {
  var result = 0;
  for (var i = start; i < end; i += 1) {
    // perform some complex calculation here
    result += 1;
  }
  postMessage(result);
  close();
}
```

Worker 线程内部新建了10个 Worker 线程，并且依次向这10个 Worker 发送消息，告知了计算的起点和终点

## API

### 主线程

原生提供了`Worker()`构造函数，用于生成Worker线程

```javascript
var myWorker = new Worker(jsUrl,options);
```

+ 脚本网址，必须遵循同源政策

+ 配置对象，可选，可以用于指定Worker的名称

  ```javascript
  // 主线程
  var myWorker = new Worker('worker.js', { name : 'myWorker' });
  
  // Worker 线程
  self.name // myWorker
  ```

构造函数返回一个Worker线程对象，属性和方法如下：

- Worker.onerror：指定 error 事件的监听函数。
- Worker.onmessage：指定 message 事件的监听函数，发送过来的数据在`Event.data`属性中。
- Worker.onmessageerror：指定 messageerror 事件的监听函数。发送的数据无法序列化成字符串时，会触发这个事件。
- Worker.postMessage()：向 Worker 线程发送消息。
- Worker.terminate()：立即终止 Worker 线程。

### Worker线程

专属的全局属性和方法：

- self.name： Worker 的名字。该属性只读，由构造函数指定。
- self.onmessage：指定`message`事件的监听函数。
- self.onmessageerror：指定 messageerror 事件的监听函数。发送的数据无法序列化成字符串时，会触发这个事件。
- self.close()：关闭 Worker 线程。
- self.postMessage()：向产生这个 Worker 线程发送消息。
- self.importScripts()：加载 JS 脚本。





















