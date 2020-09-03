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

文件选择器返回一个`FileList`对象，为类似数组的成员，每个成员都是一个`File`实例对象

`File`实例对象是特殊的Blob实例，多了`name`和`lastModifiedDate`属性

```javascript
// HTML 代码如下
// <input type="file" accept="image/*" multiple onchange="fileinfo(this.files)"/>

function fileinfo(files) {
  for (var i = 0; i < files.length; i++) {
    var f = files[i];
    console.log(
      f.name, // 文件名，不含路径
      f.size, // 文件大小，Blob 实例属性
      f.type, // 文件类型，Blob 实例属性
      f.lastModifiedDate // 文件的最后修改时间
    );
  }
}
```

## 下载文件

AJAX请求时，如果`responseType`属性为`blob`，下载的就是一个Blob对象

```javascript
function getBlob(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.responseType = 'blob';
  xhr.onload = function () {
      //xhr.response获取Blob对象
    callback(xhr.response);
  }
  xhr.send(null);
}
```

## 生成URL

浏览器允许通过`URL.createObjectURL()`方法针对Blob对象生成临时URL以便某些API使用

URL开头为`blob://`表示为Blob对象，协议头后为一个识别符，用于唯一对应内存中的Blob对象

```javascript
var droptarget = document.getElementById('droptarget');
//为拖放的图片文件生成URL产生缩略图
droptarget.ondrop = function (e) {
  var files = e.dataTransfer.files;
  for (var i = 0; i < files.length; i++) {
    var type = files[i].type;
    if (type.substring(0,6) !== 'image/')
      continue;
    var img = document.createElement('img');
    img.src = URL.createObjectURL(files[i]);
    img.onload = function () {
      this.width = 100;
      document.body.appendChild(this);
      URL.revokeObjectURL(this.src);
    }
  }
}
```

处理BlobURL  若Blob对象不存在，返回404，若跨域，返回403,

且Blob URL只对GET请求有效，若请求成功返回200

## 读取文件

获取Blob对象后，可以通过`FileReader`对象读取Blob对象的内容

`FileReader`提供四个方法处理Blob对象，其参数为Blob对象

- `FileReader.readAsText()`：返回文本，需要指定文本编码，默认为 UTF-8。
- `FileReader.readAsArrayBuffer()`：返回 ArrayBuffer 对象。
- `FileReader.readAsDataURL()`：返回 Data URL。
- `FileReader.readAsBinaryString()`：返回原始的二进制字符串。

```javascript
// HTML 代码如下
// <input type=’file' onchange='readfile(this.files[0])'></input>
// <pre id='output'></pre>
function readfile(f) {
  var reader = new FileReader();
  reader.readAsText(f);
  reader.onload = function () {
    var text = reader.result;
    var out = document.getElementById('output');
    out.innerHTML = '';
    out.appendChild(document.createTextNode(text));
  }
  reader.onerror = function(e) {
    console.log('Error', e);
  };
}
```

```javascript
// HTML 代码如下
// <input type="file" onchange="typefile(this.files[0])"></input>
function typefile(file) {
  // 文件开头的四个字节，生成一个 Blob 对象
  var slice = file.slice(0, 4);
  var reader = new FileReader();
  // 读取这四个字节
  reader.readAsArrayBuffer(slice);
  reader.onload = function (e) {
    var buffer = reader.result;
    // 将这四个字节的内容，视作一个32位整数
    var view = new DataView(buffer);
    var magic = view.getUint32(0, false);
    // 根据文件的前四个字节，判断它的类型
    switch(magic) {
      case 0x89504E47: file.verified_type = 'image/png'; break;
      case 0x47494638: file.verified_type = 'image/gif'; break;
      case 0x25504446: file.verified_type = 'application/pdf'; break;
      case 0x504b0304: file.verified_type = 'application/zip'; break;
    }
    console.log(file.name, file.verified_type);
  };
};
```



































