# ArrayBuffer对象

表示一段二进制数据，用于模拟内存里面的数据

通过这个对象，JavaScript可以读写二进制数据

==ES6引入==

```javascript
var buffer = new ArrayBuffer(8);
```

接收一个整数作为参数，表示这段二进制数据占用多少字节

## bytelength

表示当前实例占用的内存长度，单位为字节

```javascript
var buffer = new ArrayBuffer(8);
buffer.byteLength // 8
```

## slice()

用于复制一部分内存，参数：

+ 复制的开始位置（0开始）
+ 结束位置（不包括）

```javascript
var buf1 = new ArrayBuffer(8);
var buf2 = buf1.slice(0);
```



# Blob对象

表示一个二进制文件的数据内容，比如图片文件

用于读写二进制文

（ArrayBuffer用于操作内存）

```javascript
new Blob(array [,options])
```

接收两个参数：

+ 数组，成员为字符串或二进制对象，表示新生成的`Blob`实例对象的内容
+ 可选，为配置对象，只有一个属性`type`，值为字符串，表示数据的MIME类型，默认为空字符串

```javascript
var htmlFragment = ['<a id="a"><b id="b">hey!</b></a>'];
var myBlob = new Blob(htmlFragment, {type : 'text/html'});

var obj = { hello: 'world' };
var blob = new Blob([ JSON.stringify(obj) ], {type : 'application/json'});
```

## 实例属性、实例方法

实例属性：`size`和`type`，分别返回数据的大小和类型

```javascript
var htmlFragment = ['<a id="a"><b id="b">hey!</b></a>'];
var myBlob = new Blob(htmlFragment, {type : 'text/html'});

myBlob.size // 32
myBlob.type // "text/html"
```

实例方法：`slice`，用于拷贝原来的数据，返回一个`Blob`实例

```javascript
myBlob.slice(start, end, contentType)
```

三个参数都可选：

+ 其实字节位置（默认0）
+ 结束字节位置（默认为`size`属性的值，位置不包括在拷贝范围中）
+ 新实例的数据类型（默认空字符串）

## 获取文件信息

使用文件选择器`<input type="file">`让用户选择文件

处于安全考虑，浏览器不允许脚本自行设置控件的`value`属性，一旦用户选好了文件，脚本才可以读取这个文件









