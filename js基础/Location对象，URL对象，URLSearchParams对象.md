# Loacation对象

为浏览器提供的原生对象

`window.loaction`和`document.loaction`属性都可以获取这个对象

## 属性

- `Location.href`：整个 URL。
- `Location.protocol`：当前 URL 的协议，包括冒号（`:`）。
- `Location.host`：主机。如果端口不是协议默认的`80`和`433`，则还会包括冒号（`:`）和端口。
- `Location.hostname`：主机名，不包括端口。
- `Location.port`：端口号。
- `Location.pathname`：URL 的路径部分，从根路径`/`开始。
- `Location.search`：查询字符串部分，从问号`?`开始。
- `Location.hash`：片段字符串部分，从`#`开始。
- `Location.username`：域名前面的用户名。
- `Location.password`：域名前面的密码。
- `Location.origin`：URL 的协议、主机名和端口。除这个只读外其他都可写

```javascript
// 当前网址为
// http://user:passwd@www.example.com:4097/path/a.html?x=111#part1
document.location.href
// "http://user:passwd@www.example.com:4097/path/a.html?x=111#part1"
document.location.protocol
// "http:"
document.location.host
// "www.example.com:4097"
document.location.hostname
// "www.example.com"
document.location.port
// "4097"
document.location.pathname
// "/path/a.html"
document.location.search
// "?x=111"
document.location.hash
// "#part1"
document.location.username
// "user"
document.location.password
// "passwd"
document.location.origin
// "http://user:passwd@www.example.com:4097"
```

可写内容示例

```javascript
// 跳转到新网址
document.location.href = 'http://www.example.com';

//这个特性常常用于让网页自动滚动到新的锚点。
document.location.href = '#top';
// 等同于
document.location.hash = '#top';

//直接改写location，相当于写入href属性。
document.location = 'http://www.example.com';
// 等同于
document.location.href = 'http://www.example.com';
```

==`Location.href`属性是浏览器唯一允许跨域写入的属性，即非同源的窗口可以改写另一个窗口（比如子窗口与父窗口）的`Location.href`属性，导致后者的网址跳转。`Location`的其他属性都不允许跨域写入。==

## 方法

### Location.assign()

接受一个URL字符串作为参数，使浏览器立刻跳转到新的URL

URL字符串无效则会报错

```javascript
// 跳转到新的网址
document.location.assign('http://www.example.com')
```

### Location.replace()

接受一个URL字符串作为参数，使浏览器立刻跳转到新的URL

URL字符串无效则会报错

`replace`会在浏览器的`History`删除当前网址，相当于新的URL替换了旧URL

可用于脚本发现当前为移动设备时跳转到移动版网页

### Location.reload()

使浏览器重新加载当前网址，相当于浏览器的刷新按钮

接收一个布尔值作为参数

为`true`，则浏览器会向服务器重新请求这个网页，且重新加载后会滚动到头部`scrollTop===0`

为`false`或空，浏览器会从本地缓存重新加载网页，且加载后网页视口位置不变

### Location.toString()

返回URL字符串，相当于`Location.href`



# URL的编码和解码

URL只能包含合法字符，为以下两类：

- URL 元字符：分号（`;`），逗号（`,`），斜杠（`/`），问号（`?`），冒号（`:`），at（`@`），`&`，等号（`=`），加号（`+`），美元符号（`$`），井号（`#`）
- 语义字符：`a-z`，`A-Z`，`0-9`，连词号（`-`），下划线（`_`），点（`.`），感叹号（`!`），波浪线（`~`），星号（`*`），单引号（`'`），圆括号（`()`）

除此以外其他字符都需要转义，将每个字符转为`%`加上两个大写的十六进制字母

有四种URL编码/解码方法：

## encodeURI()

用于转码整个URL，将元字符和语义字符以外的字符都进行转义

```javascript
encodeURI('http://www.example.com/q=春节')
// "http://www.example.com/q=%E6%98%A5%E8%8A%82"
```

## encodeURIComponent()

用于转码URL的组成部分，会将除了语义字符以外的所有字符都转码

==包括了元字符==

因此不能用于转码整个URL

```javascript
encodeURIComponent('春节')
// "%E6%98%A5%E8%8A%82"
encodeURIComponent('http://www.example.com/q=春节')
// "http%3A%2F%2Fwww.example.com%2Fq%3D%E6%98%A5%E8%8A%82"
```

## decodeURI()

用于整个URL的解码

## decodeURIComponent()

用于URL片段的解码



# URL接口

`URL`接口是一个构造函数，由浏览器原生提供

`window.URL`可以获取这个构造函数

## 构造函数

可以用于生成URL实例

接受URL字符串作为参数，若字符串不合法，会报错

```javascript
var url = new URL('http://www.example.com/index.html');
url.href
// "http://www.example.com/index.html"
```

若参数为另一个URL实例，会自动读取其`href`属性作为实际参数

若参数的URL字符串为相对路径，则需要表示绝对路径的第二个参数

```javascript
var url1 = new URL('index.html', 'http://example.com');
url1.href
// "http://example.com/index.html"

var url2 = new URL('page2.html', 'http://example.com/page1.html');
url2.href
// "http://example.com/page2.html"

var url3 = new URL('..', 'http://example.com/a/b.html')
url3.href
// "http://example.com/"
```

## 实例属性

基本与`Location`对象的属性一致，返回当前URL的信息

- URL.href：返回整个 URL
- URL.protocol：返回协议，以冒号`:`结尾
- URL.hostname：返回域名
- URL.host：返回域名与端口，包含`:`号，默认的80和443端口会省略
- URL.port：返回端口
- URL.origin：返回协议、域名和端口  ==这只有这个只读，其他可写==
- URL.pathname：返回路径，以斜杠`/`开头
- URL.search：返回查询字符串，以问号`?`开头
- URL.searchParams：返回一个`URLSearchParams`实例，该属性是`Location`对象没有的
- URL.hash：返回片段识别符，以井号`#`开头
- URL.password：返回域名前面的密码
- URL.username：返回域名前面的用户名

```javascript
//例子
var url = new URL('http://user:passwd@www.example.com:4097/path/a.html?x=111#part1');

url.href
// "http://user:passwd@www.example.com:4097/path/a.html?x=111#part1"
url.protocol
// "http:"
url.hostname
// "www.example.com"
url.host
// "www.example.com:4097"
url.port
// "4097"
url.origin
// "http://www.example.com:4097"
url.pathname
// "/path/a.html"
url.search
// "?x=111"
url.searchParams
// URLSearchParams {}
url.hash
// "#part1"
url.password
// "passwd"
url.username
// "user"
```

## 静态方法

### URL.createObjectURL()

用于为上传/下载的文件、流媒体文件生成一个URL字符串

字符串代表了`File`对象或`Blob`对象的URL

```javascript
// HTML 代码如下
// <div id="display"/>
// <input
//   type="file"
//   id="fileElem"
//   multiple
//   accept="image/*"
//   onchange="handleFiles(this.files)"
//  >
var div = document.getElementById('display');

function handleFiles(files) {
  for (var i = 0; i < files.length; i++) {
    var img = document.createElement('img');
    img.src = window.URL.createObjectURL(files[i]);
    div.appendChild(img);
  }

 //生成的URL
    blob:http://localhost/c745ef73-ece9-46da-8f66-ebes574789b1
```

每次使用都会在内存生成一个URL实例，如果不再需要URL字符串，为了节省内存，可以使用`URL.revokeObjectURL()`释放实例

### URL.revokeObjectURL()

用于释放`URL.createObjectURL()`方法生成的URL实例

参数是`URL.createObjectURL()`方法返回的URL字符串

```javascript
var div = document.getElementById('display');

function handleFiles(files) {
  for (var i = 0; i < files.length; i++) {
    var img = document.createElement('img');
    img.src = window.URL.createObjectURL(files[i]);
    div.appendChild(img);
      //图片加载成功后本地生成的URL子字符串就没用了，可以卸载掉
    img.onload = function() {
      window.URL.revokeObjectURL(this.src);
    }
  }
}
```

# URLSearchParams对象

为浏览器的原生对象，用于构造、解析和处理URL的查询字符串（即？后面的部分）

也是一个构造函数，可以生成实例

参数可以为查询字符串（起首的问号可有可无），或是对应查询字符串的数组或对象

```javascript
// 方法一：传入字符串
var params = new URLSearchParams('?foo=1&bar=2');
// 等同于
var params = new URLSearchParams(document.location.search);

// 方法二：传入数组
var params = new URLSearchParams([['foo', 1], ['bar', 2]]);

// 方法三：传入对象
var params = new URLSearchParams({'foo' : 1 , 'bar' : 2});
```

构造函数会对查询字符串自动编码

```javascript
var params = new URLSearchParams({'foo': '你好'});
params.toString() // "foo=%E4%BD%A0%E5%A5%BD"
```

浏览器向服务器发送表单数据时可以直接使用实例作为表单数据

```javascript
const params = new URLSearchParams({foo: 1, bar: 2});
fetch('https://example.com/api', {
  method: 'POST',
  body: params
}).then(...)
```



```javascript
var url = new URL(window.location);
var foo = url.searchParams.get('foo') || 'somedefault';
```

代码中URL实例的`searchParams`就是一个`URLSearchParams`实例，因此可以使用接口的`get`方法

### URLSearchParams.toString()

返回实例的字符串形式

```javascript
var url = new URL('https://example.com?foo=1&bar=2');
var params = new URLSearchParams(url.search);

params.toString() // "foo=1&bar=2'
```

### URLSearchParams.append()

用于追加一个查询参数

参数：

+ 键名
+ 键值

无返回值，不会识别键名是否已存在

```javascript
var params = new URLSearchParams({'foo': 1 , 'bar': 2});
params.append('foo', 3);
params.toString() // "foo=1&bar=2&foo=3"
```

### URLSearchParams.delete()

用于删除指定的查询参数，参数为键名

```javascript
var params = new URLSearchParams({'foo': 1 , 'bar': 2});
params.delete('bar');
params.toString() // "foo=1"
```

### URLSearchParams.has()

返回一个布尔值，表示查询字符串是否包含指定的键名

```javascript
var params = new URLSearchParams({'foo': 1 , 'bar': 2});
params.has('bar') // true
params.has('baz') // false
```

### URLSearchParams.set()

用于查询字符串的键值

参数：

+ 键名
+ 键值

若键名已存在，键值会被改变

若有多个，则会移除显存的同名键名新增一个

```javascript
var params = new URLSearchParams('?foo=1');
params.set('foo', 2);
params.toString() // "foo=2"
params.set('bar', 3);
params.toString() // "foo=2&bar=3"
```

```javascript
// URL: https://example.com?version=1.0
var params = new URLSearchParams(location.search.slice(1));
params.set('version', 2.0);

window.history.replaceState({}, '', location.pathname + `?` + params);
// URL: https://example.com?version=2.0
```

### URLSearchParams.get()，URLSearchParams.getAll()

用于读取查询字符串里面的指定键，参数为键名

返回为字符串，若原始值为数值会转换类型

若键名不存在，返回`null`

若多个同名键，只会返回位置在最前面的

```javascript
var params = new URLSearchParams('?foo=3&foo=2&foo=1');
params.get('foo') // "3"
```

`getAll()`则可以返回所有键值

```javascript
var params = new URLSearchParams('?foo=1&foo=2');
params.getAll('foo') // ["1", "2"
```

### URLSearchParams.sort()

对查询字符串内的键潘旭，按照Unicode码点从小到大排序

没有返回值

若键名相同则保留原始顺序

```javascript
var params = new URLSearchParams('c=4&a=2&b=3&a=1');
params.sort();
params.toString() // "a=2&a=1&b=3&c=4"
```

### URLSeatchParams.keys()，URLSearchParams.values()，URLSearchParams.entries()

返回一个遍历器对象供`for...of`循环遍历

`keys()`返回键名的遍历器

`values()`返回键值的遍历器

`entries()`返回键值对的遍历器

```javascript
var params = new URLSearchParams('a=1&b=2');

for(var p of params.keys()) {
  console.log(p);
}
// a
// b

for(var p of params.values()) {
  console.log(p);
}
// 1
// 2

for(var p of params.entries()) {
  console.log(p);
}
// ["a", "1"]
// ["b", "2"]
```

直接对`URLSearchParams`进行遍历就等于调用`entries`接口





















