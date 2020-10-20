# CORS通信

允许浏览器向跨域的服务器，发出`XMLHttpRequest`请求，从而克服了 AJAX 只能同源使用的限制

==需要浏览器和服务器同时支持==

> 整个 CORS 通信过程，都是浏览器自动完成，不需要用户参与。对于开发者来说，CORS 通信与普通的 AJAX 通信没有差别，代码完全一样。浏览器一旦发现 AJAX 请求跨域，就会自动添加一些附加的头信息，有时还会多出一次附加的请求，但用户不会有感知。因此，实现 CORS 通信的关键是服务器。只要服务器实现了 CORS 接口，就可以跨域通信

## 请求划分

CORS将请求分成两类

简单需求要同时满足一下两个条件的请求：

+ 请求方法是以下三个之一：
  + HEAD
  + GET
  + POST
+ HTTP的头信息不超出以下几个字段
  - Accept
  - Accept-Language
  - Content-Language
  - Last-Event-ID
  - Content-Type：只限于三个值`application/x-www-form-urlencoded`、`multipart/form-data`、`text/plain`

不同时满足上面两个条件就都是非简单请求

==简单请求就是表单请求，表单一直可以跨域发出请求==

## 简单请求

### 基本流程

对于简单流程，浏览器会直接发出CORS请求，在头信息中增加一个`Origin`在字段，用于说明本次请求来自哪个域（协议+域名+端口）

```javascript
GET /cors HTTP/1.1
Origin: http://api.bob.com
Host: api.alice.com
Accept-Language: en-US
Connection: keep-alive
User-Agent: Mozilla/5.0...
```

若`Origin`指定的源不在许可范围内，服务器会返回一个正常的HTTP回应

​	但这个回应头信息不会包含`Acces-Control-Allow-Origin`字段，浏览器会识别到这种情况并抛出一个错误，被`XMLHttppRequest`的`onerror`回调函数捕捉

​	==这种错误的状态码可能是200，因此无法通过状态码识别错误==

若指定的源在许可范围内，服务器响应会多几个头信息字段：

```javascript
Access-Control-Allow-Origin: http://api.bob.com
Access-Control-Allow-Credentials: true
Access-Control-Expose-Headers: FooBar
Content-Type: text/html; charset=utf-8
```

1. `Access-Control-Allow_Origin`

   必须值，为请求时`Origin`的值，或者为`*`，表示接受任意域名

2. `Access-Control-Allow-Credentials`

   可选，为布尔值，表示是否允许发送Cookie

   若设置，只能设置为`true`，表示浏览器可以将Cookie包含在请求中，否则就不发送这个字段

3. `Access-Control-Expose-Headers`

   可选

   CORS 请求时，`XMLHttpRequest`对象的`getResponseHeader()`方法只能拿到6个服务器返回的基本字段：`Cache-Control`、`Content-Language`、`Content-Type`、`Expires`、`Last-Modified`、`Pragma`

   如果想拿到其他字段，就必须在`Access-Control-Expose-Headers`里面指定。上面的例子指定，`getResponseHeader('FooBar')`可以返回`FooBar`字段的值

### withCredentials属性

若服务器显示指定`Access-Control-Allow-Credentials`字段，则浏览器端也要在AJAX请求中设置：

```javascript
var xhr = new XMLHttpRequest();
xhr.withCredentials = true;
```

否则浏览器不会发送Cookie

有部分浏览器会默认为`true`，因此若不需要的话应该显式关闭

```javascript
xhr.withCredentials = false;
```

> 如果服务器要求浏览器发送 Cookie，`Access-Control-Allow-Origin`就不能设为星号，必须指定明确的、与请求网页一致的域名。同时，Cookie 依然遵循同源政策，只有用服务器域名设置的 Cookie 才会上传，其他域名的 Cookie 并不会上传，且（跨域）原网页代码中的`document.cookie`也无法读取服务器域名下的 Cookie。

## 非简单请求

比如请求方法是`PUT`或`DELETE`，或者`Content-Type`字段的类型是`application/json`

### 预检请求

非简单请求的CORS请求，会在正式通信之前增加一次HTTP查询请求

即先查询服务器，当前网页所在的域名是否在服务器的许可名单中，且可以使用哪些HTTP方法和头信息字段，若得到了肯定答复，浏览器就会发出正式的`XMLHttpRequest`请求，否则报错

这样做的理由是防止这些新增的请求对传统的没有CORS支持的服务器形成压力，给服务器一个提前拒绝的机会，可以防止服务器收到大量`DELETE`和`PUT`请求

```javascript
var url = 'http://api.alice.com/cors';
var xhr = new XMLHttpRequest();
xhr.open('PUT', url, true);
//发送自定义头信息
xhr.setRequestHeader('X-Custom-Header', 'value');
xhr.send();
```

```javascript
//预检请求的HTTP头信息
OPTIONS /cors HTTP/1.1
Origin: http://api.bob.com
Access-Control-Request-Method: PUT
Access-Control-Request-Headers: X-Custom-Header
Host: api.alice.com
Accept-Language: en-US
Connection: keep-alive
User-Agent: Mozilla/5.0...
```

`OPTIONS`为预检请求的请求方法

`Origin`表示请求来自哪个源

还有两个特殊字段：

1. `Access-Control-Request-Method`

   该字段是必须的，用来列出浏览器的 CORS 请求会用到哪些 HTTP 方法，上例是`PUT`。

2. `Access-Control-Request-Headers`

   该字段是一个逗号分隔的字符串，指定浏览器 CORS 请求会额外发送的头信息字段，上例是`X-Custom-Header`。

### 预检请求的回应

服务器收到预检请求，并检查确认允许跨域请求，就会作出以下回应：

```php
HTTP/1.1 200 OK
Date: Mon, 01 Dec 2008 01:15:39 GMT
Server: Apache/2.0.61 (Unix)
Access-Control-Allow-Origin: http://api.bob.com
Access-Control-Allow-Methods: GET, POST, PUT
Access-Control-Allow-Headers: X-Custom-Header
Content-Type: text/html; charset=utf-8
Content-Encoding: gzip
Content-Length: 0
Keep-Alive: timeout=2, max=100
Connection: Keep-Alive
Content-Type: text/plain
```

若否定了预检请求，返回的HTTP回应不会包含任何CORS相关的头信息字段，或明确表示请求不符合条件

```php
OPTIONS http://api.bob.com HTTP/1.1
Status: 200
Access-Control-Allow-Origin: https://notyourdomain.com
Access-Control-Allow-Method: POST
```

以上的`Access-Control-Allow-Origin`明确不包括请求地址，浏览器会触发一个错误，被`XMLHttpRequest`的`onerror`回调函数捕获并报错

```javascript
XMLHttpRequest cannot load http://api.alice.com.
Origin http://api.bob.com is not allowed by Access-Control-Allow-Origin.
```



服务器回应的CORS相关字段有如下几个

```php
Access-Control-Allow-Methods: GET, POST, PUT
Access-Control-Allow-Headers: X-Custom-Header
Access-Control-Allow-Credentials: true
Access-Control-Max-Age: 1728000
```

1. `Access-Control-Allow-Methods`

该字段必需，它的值是逗号分隔的一个字符串，表明服务器支持的所有跨域请求的方法。注意，返回的是==所有支持的方法==，而不单是浏览器请求的那个方法。这是为了避免多次“预检”请求。

2. `Access-Control-Allow-Headers`

如果浏览器请求包括`Access-Control-Request-Headers`字段，则`Access-Control-Allow-Headers`字段是必需的。它也是一个逗号分隔的字符串，表明服务器支持的所有头信息字段，不限于浏览器在“预检”中请求的字段。

3. `Access-Control-Allow-Credentials`

该字段与简单请求时的含义相同。

4. `Access-Control-Max-Age`

该字段可选，用来指定本次预检请求的有效期，单位为秒。上面结果中，有效期是20天（1728000秒），即允许缓存该条回应1728000秒（即20天），在此期间，不用发出另一条预检请求

### 浏览器正常请求与回应

一旦服务器通过了“预检”请求，以后每次浏览器正常的 CORS 请求，就都跟简单请求一样，会有一个`Origin`头信息字段。服务器的回应，也都会有一个`Access-Control-Allow-Origin`头信息字段。

下面是“预检”请求之后，浏览器的正常 CORS 请求。

```php
PUT /cors HTTP/1.1
Origin: http://api.bob.com
Host: api.alice.com
X-Custom-Header: value
Accept-Language: en-US
Connection: keep-alive
User-Agent: Mozilla/5.0...
```

上面头信息的`Origin`字段是浏览器自动添加的。

下面是服务器正常的回应。

```PHP
Access-Control-Allow-Origin: http://api.bob.com
Content-Type: text/html; charset=utf-8
```

上面头信息中，`Access-Control-Allow-Origin`字段是每次回应都必定包含的

## 与JSONP相比

JSONP仅支持`GET`请求，而CORS支持所有类型的HTTP请求

但JSONP可以支持老式浏览器，可以向不支持CORS的网站请求数据















