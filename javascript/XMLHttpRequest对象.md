# XMLHttpRequest对象

AJAX = Asynchronous JavaScript and XML，指通过JavaScript的异步通信，从服务器获取XML文档从中提取数据，再更新当前网页的==对应部分==

包含以下步骤：

+ 创建 XMLHttpRequest 实例
+ 发出 HTTP 请求
+ 接收服务器传回的数据
+ 更新网页数据

`XMLHttpRequest`对象是 AJAX 的主要接口，用于浏览器与服务器之间的通信。尽管名字里面有`XML`和`Http`，它实际上可以使用多种协议（比如`file`或`ftp`），发送任何格式的数据（包括字符串和二进制）

```javascript
var xhr = new XMLHttpRequest();
//建立实例后通过open()方法建立HTTP连接的细节，如
xhr.open('GET','http://www.example.com/page.php',true)''
//第三个参数表示请求异步
//指定回调函数，监听通信状态readyState属性的变化
xhr.onreadystatechange = handleStateChange;
function handleStateChange(){..};
//最后使用send发出实际请求
xhr.send(null);
//参数为null表示不带数据发送
```

==只能向同源网站（协议、域名、端口都相同）发出HTTP请求==

如：

```javascript
var xhr = new XMLHttpRequest();

xhr.onreadystatechange = function(){
  // 通信成功时，状态值为4
  if (xhr.readyState === 4){
    if (xhr.status === 200){
      console.log(xhr.responseText);
    } else {
      console.error(xhr.statusText);
    }
  }
};

xhr.onerror = function (e) {
  console.error(xhr.statusText);
};

xhr.open('GET', '/endpoint', true);
xhr.send(null);
```

## 实例属性

### XMLHttpRequest.readyState

返回一个整数，表示实例对象当前状态，只读

- 0，表示 XMLHttpRequest 实例已经生成，但是实例的`open()`方法还没有被调用。
- 1，表示`open()`方法已经调用，但是实例的`send()`方法还没有调用，仍然可以使用实例的`setRequestHeader()`方法，设定 HTTP 请求的头信息。
- 2，表示实例的`send()`方法已经调用，并且服务器返回的头信息和状态码已经收到。
- 3，表示正在接收服务器传来的数据体（body 部分）。这时，如果实例的`responseType`属性等于`text`或者空字符串，`responseText`属性就会包含已经收到的部分信息。
- 4，表示服务器返回的数据已经完全接收，或者本次接收已经失败

每次变化都会触发`readyStateChange`事件

==若使用实例的`abort()`终止XMLHttpRequest请求也会造成状态变化==

### XMLHttpRequest.onreadystatechange

指向一个监听函数

### XMLHttpRequest.response



















