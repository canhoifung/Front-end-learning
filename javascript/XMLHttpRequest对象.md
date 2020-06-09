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

表示服务器返回的数据体（即HTTP回应的body部分）

可以是任何数据类型，由`XMLHttpRequest.responseType`属性决定

若本次请求没有成功或数据不完整，则属性为`null`

如果`responseType`属性等于`text`或空字符串，在请求没有结束之前（`readyState`等于3的阶段），`response`属性包含服务器已经返回的部分数据。

### XMLHttpRequest.responseType

字符串格式，表示服务器返回数据的类型

可写

可在`open()`后，`send()`前设置

若为空字符串则等于默认值`text`

也可以为以下值：

- ""（空字符串）：等同于`text`，表示服务器返回文本数据。
- "arraybuffer"：ArrayBuffer 对象，表示服务器返回二进制数组。
- "blob"：Blob 对象，表示服务器返回二进制对象。适合返回图片文件
- "document"：Document 对象，表示服务器返回一个文档对象。
- "json"：JSON 对象。
- "text"：字符串。

```javascript
var xhr = new XMLHttpRequest();
xhr.open('GET', '/path/to/image.png', true);
xhr.responseType = 'blob';

xhr.onload = function(e) {
  if (this.status === 200) {
    var blob = new Blob([xhr.response], {type: 'image/png'});
    // 或者
    var blob = xhr.response;
  }
};

xhr.send();
```

```javascript
var xhr = new XMLHttpRequest();
xhr.open('GET', '/path/to/image.png', true);
xhr.responseType = 'arraybuffer';

xhr.onload = function(e) {
  var uInt8Array = new Uint8Array(this.response);
  for (var i = 0, len = uInt8Array.length; i < len; ++i) {
    // var byte = uInt8Array[i];
  }
};

xhr.send();
```

==若设为json，浏览器会自动对返回数据调用JSON.parse()方法==

### XMLHttpRequest.responseText

返回从服务器接收到的字符串

只读

只有HTTP请求完成接收后，才会包含完整的数据

```javascript
var xhr = new XMLHttpRequest();
xhr.open('GET', '/server', true);

xhr.responseType = 'text';
xhr.onload = function () {
  if (xhr.readyState === 4 && xhr.status === 200) {
    console.log(xhr.responseText);
  }
};

xhr.send(null);
```

### XMLHttpRequest.responseXML

返回从服务器接收到的HTML或XML文档对象

只读

若请求没有成功会接收数据无法解析为XML或HTML，则为`null`

该属性生效的前提是 HTTP 回应的`Content-Type`头信息等于`text/xml`或`application/xml`。这要求在发送请求前，`XMLHttpRequest.responseType`属性要设为`document`。如果 HTTP 回应的`Content-Type`头信息不等于`text/xml`和`application/xml`，但是想从`responseXML`拿到数据（即把数据按照 DOM 格式解析），那么需要手动调用`XMLHttpRequest.overrideMimeType()`方法，强制进行 XML 解析。

该属性得到的数据，是直接解析后的文档 DOM 树。

```javascript
var xhr = new XMLHttpRequest();
xhr.open('GET', '/server', true);

xhr.responseType = 'document';
xhr.overrideMimeType('text/xml');

xhr.onload = function () {
  if (xhr.readyState === 4 && xhr.status === 200) {
    console.log(xhr.responseXML);
  }
};

xhr.send(null);
```

### XMLHttpRequest.responseURL

表示发送数据的服务器的网址

```javascript
var xhr = new XMLHttpRequest();
xhr.open('GET', 'http://example.com/test', true);
xhr.onload = function () {
  // 返回 http://example.com/test
  console.log(xhr.responseURL);
};
xhr.send(null);
```

==若服务器端发生跳转，会返回最后实际返回数据的地址==,因此可能与`open()`指定的请求网址不相同

且会剥离原始URL的锚点

### XMLHttpRequest.status,XMLHttpRequest.statusText

`XMLHttpRequest.status`返回一个整数，表示服务器返回的HTTP状态码

若没有返回状态码默认返回200

请求发出之前为`0`，只读

- 200, OK，访问正常
- 301, Moved Permanently，永久移动
- 302, Moved temporarily，暂时移动
- 304, Not Modified，未修改
- 307, Temporary Redirect，暂时重定向
- 401, Unauthorized，未授权
- 403, Forbidden，禁止访问
- 404, Not Found，未发现指定网址
- 500, Internal Server Error，服务器发生错误

只有2xx和304表示服务器返回正常状态

```javascript
if (xhr.readyState === 4) {
  if ( (xhr.status >= 200 && xhr.status < 300)|| (xhr.status === 304) ) {
    // 处理服务器的返回数据
  } else {
    // 出错
  }
}
```



`XMLHttpRequest.statusText`属性返回一个字符串，表示服务器发送的状态提示

包含了整个状态信息

在请求发送前，即`open()`前，值为空字符串

若没有返回状态，则默认为‘OK’

只读

### XMLHttpRequest.timeout，XMLHttpRequestEventTarget.ontimeout

`XMLHttpRequest.timeout`属性返回一个整数，表示多少毫秒后，如果请求仍然没有得到结果，就会自动终止。==如果该属性等于0，就表示没有时间限制==。

`XMLHttpRequestEventTarget.ontimeout`属性用于设置一个监听函数，如果发生 timeout 事件，就会执行这个监听函数。

```javascript
var xhr = new XMLHttpRequest();
var url = '/server';

xhr.ontimeout = function () {
  console.error('The request for ' + url + ' timed out.');
};

xhr.onload = function() {
  if (xhr.readyState === 4) {
    if (xhr.status === 200) {
      // 处理服务器返回的数据
    } else {
      console.error(xhr.statusText);
    }
  }
};

xhr.open('GET', url, true);
// 指定 10 秒钟超时
xhr.timeout = 10 * 1000;
xhr.send(null);
```

### 事件监听属性

==所有监听事件都要在调用`send()`前设定==

- XMLHttpRequest.onloadstart：loadstart 事件（HTTP 请求发出）的监听函数

- XMLHttpRequest.onprogress：progress事件（正在发送和加载数据）的监听函数

  只有onprogress有事件对象参数，且对象有是三个属性：

  + `loaded`：返回已经传输的数据量
  + `totla`：返回总数据量
  + `lengthComputable`：返回布尔值，表示加载进度是否可以计算

- XMLHttpRequest.onabort：abort 事件（请求中止，比如用户调用了`abort()`方法）的监听函数

- XMLHttpRequest.onerror：error 事件（请求失败）的监听函数

- XMLHttpRequest.onload：load 事件（请求成功完成）的监听函数

- XMLHttpRequest.ontimeout：timeout 事件（用户指定的时限超过了，请求还未完成）的监听函数

- XMLHttpRequest.onloadend：loadend 事件（请求完成，不管成功或失败）的监听函数

```javascript
xhr.onload = function() {
 var responseText = xhr.responseText;
 console.log(responseText);
 // process the response.
};

xhr.onabort = function () {
  console.log('The request was aborted');
};

xhr.onprogress = function (event) {
  console.log(event.loaded);
  console.log(event.total);
};

xhr.onerror = function() {
  console.log('
```

### XMLHttpRequest.withCredentials

`XMLHttpRequest.withCredentials`属性是一个布尔值，表示跨域请求时，用户信息（比如 Cookie 和认证的 HTTP 头信息）是否会包含在请求之中，默认为`false`，即向`example.com`发出跨域请求时，不会发送`example.com`设置在本机上的 Cookie（如果有的话）。

如果需要跨域 AJAX 请求发送 Cookie，需要`withCredentials`属性设为`true`。注意，同源的请求不需要设置这个属性。

```javascript
var xhr = new XMLHttpRequest();
xhr.open('GET', 'http://example.com/', true);
xhr.withCredentials = true;
xhr.send(null);
```

为了让这个属性生效，服务器必须显式返回`Access-Control-Allow-Credentials`这个头信息。

```php+HTML
Access-Control-Allow-Credentials: true
```

`withCredentials`属性打开的话，跨域请求不仅会发送 Cookie，还会设置远程主机指定的 Cookie。反之也成立，如果`withCredentials`属性没有打开，那么跨域的 AJAX 请求即使明确要求浏览器设置 Cookie，浏览器也会忽略。

注意，脚本总是遵守同源政策，无法从`document.cookie`或者 HTTP 回应的头信息之中，读取跨域的 Cookie，`withCredentials`属性不影响这一点。

### XMLHttpRequest.upload

XMLHttpRequest 不仅可以发送请求，还可以发送文件，这就是 AJAX 文件上传。发送文件以后，通过`XMLHttpRequest.upload`属性可以得到一个对象，通过观察这个对象，可以得知上传的进展。主要方法就是监听这个对象的各种事件：loadstart、loadend、load、abort、error、progress、timeout。

假定网页上有一个`<progress>`元素。

```html
<progress min="0" max="100" value="0">0% complete</progress>
```

文件上传时，对`upload`属性指定`progress`事件的监听函数，即可获得上传的进度。

```javascript
function upload(blobOrFile) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/server', true);
  xhr.onload = function (e) {};

  var progressBar = document.querySelector('progress');
  xhr.upload.onprogress = function (e) {
    if (e.lengthComputable) {
      progressBar.value = (e.loaded / e.total) * 100;
      // 兼容不支持 <progress> 元素的老式浏览器
      progressBar.textContent = progressBar.value;
    }
  };

  xhr.send(blobOrFile);
}

upload(new Blob(['hello world'], {type: 'text/plain'}));
```

## 实例方法

### XMLHttpRequesst.open()

用于指定HTTP请求的参数，即初始化XMLHttpRequest实例对象

可以接收五个参数：

```javascript
void open(
   string method,
   string url,
   optional boolean async,
   optional string user,
   optional string password
);
```

- `method`：表示 HTTP 动词方法，比如`GET`、`POST`、`PUT`、`DELETE`、`HEAD`等。
- `url`: 表示请求发送目标 URL。
- `async`: 布尔值，表示请求是否为异步，默认为`true`。如果设为`false`，则`send()`方法只有等到收到服务器返回了结果，才会进行下一步操作。该参数可选。由于同步 AJAX 请求会造成浏览器失去响应，许多浏览器已经禁止在主线程使用，只允许 Worker 里面使用。所以，这个参数轻易不应该设为`false`。
- `user`：表示用于认证的用户名，默认为空字符串。该参数可选。
- `password`：表示用于认证的密码，默认为空字符串。该参数可选。

==若对使用过`open()`的AJAX请求再次使用这个方法，等同于调用`abort()`==

### XMLHttpRequest.send()

用于实际发出HTTP请求

参数可选，若不带参数，表示HTTP请求只有一个URL没有数据体，如GET请求

如带参数，表示除了头信息，还带有包含具体数据的信息体，如POST请求

```javascript
//POST请求范例
var xhr = new XMLHttpRequest();
var data = 'email='
  + encodeURIComponent(email)
  + '&password='
  + encodeURIComponent(password);

xhr.open('POST', 'http://www.example.com', true);
xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
xhr.send(data);
```

`send`方法的参数支持多种格式：

```javascript
void send();
void send(ArrayBufferView data);
void send(Blob data);
void send(Document data);
void send(String data);
void send(FormData data);
```

```javascript
//发送表单数据例子
var formData = new FormData();

formData.append('username', '张三');
formData.append('email', 'zhangsan@example.com');
formData.append('birthDate', 1940);

var xhr = new XMLHttpRequest();
xhr.open('POST', '/register');
xhr.send(formData);

//相当于 html代码：
<form id='registration' name='registration' action='/register'>
  <input type='text' name='username' value='张三'>
  <input type='email' name='email' value='zhangsan@example.com'>
  <input type='number' name='birthDate' value='1940'>
  <input type='submit' onclick='return sendForm(this.form);'>
</form>
```

### XMLHttpRequest.setRequestHeader()

用于设置浏览器发送的HTTP请求的头信息

==需要在`open()`之后，`send()`之前调用==

若多次调用设定统一字段，则会合并多次设置的值为一个单一的值发送

接收两个参数：

+ 字符串，表示头信息的字段名
+ 字段值

```javascript
xhr.setRequestHeader('Content-Type', 'application/json');
xhr.setRequestHeader('Content-Length', JSON.stringify(data).length);
xhr.send(JSON.stringify(data));
```

### XMLHttpRequest.overrideMimeType()

用于指定MIME类型，覆盖服务器返回的真正的MIME类型

比如：服务器返回的数据类型是`text/xml`，由于种种原因浏览器解析不成功报错，这时就拿不到数据了。为了拿到原始数据，我们可以把 MIME 类型改成`text/plain`，这样浏览器就不会去自动解析，从而我们就可以拿到原始文本了。

==必须在`send()`前调用==

==只有在服务器无法返回某种数据类型时才使用这个方法==

### XMLHttpRequest.getResponseHeader()

返回HTTP头信息指定字段的值

若还没有收到服务器回应或指定字段不存在，就返回`null`

不区分大小写

```javascript
function getHeaderTime() {
  console.log(this.getResponseHeader("Last-Modified"));
}

var xhr = new XMLHttpRequest();
xhr.open('HEAD', 'yourpage.html');
xhr.onload = getHeaderTime;
xhr.send();
```





















