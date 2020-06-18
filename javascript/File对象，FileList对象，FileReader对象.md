# File对象

一个对象代表一个文件，用于读写文件信息

是一种特殊的Blob对象

## 构造函数

```javascript
new File(array,name [,options]);
```

三个参数：

+ array：数组，成员为二进制对象或者字符串，用于表示文件内容
+ name：字符串，表示文件名或文件路径
+ options：配置对象，设置实例的属性。可选
  + type：字符串，表示实例对象的MIME类型，默认空字符串
  + lastModified：时间戳，表示上次修改时间，默认为`Date.now()`

```javascript
var file = new File(
  ['foo'],
  'foo.txt',
  {
    type: 'text/plain',
  }
);
```

## 实例属性和实例方法

### 属性

- File.lastModified：最后修改时间
- File.name：文件名或文件路径
- File.size：文件大小（单位字节）
- File.type：文件的 MIME 类型

```javascript
var myFile = new File([], 'file.bin', {
  lastModified: new Date(2018, 1, 1),
});
myFile.lastModified // 1517414400000
myFile.name // "file.bin"
myFile.size // 0
myFile.type // ""
```

### 方法

继承了Blob的`slice()`



# FileList对象

为一个类似数组的对象，成员为File实例

主要出现在：

+ 文件控件节点（`<input type="file">`）的`files`属性，返回一个 FileList 实例。
+ 拖拉一组文件时，目标区的`DataTransfer.files`属性，返回一个 FileList 实例。

```javascript
// HTML 代码如下
// <input id="fileItem" type="file">
var files = document.getElementById('fileItem').files;
files instanceof FileList // true
```

属性：`length`，表示包含多少文件

实例方法：`item()`，用于返回指定位置的实例



# FileReader对象

用于读取File对象或Blob对象所包含的文件内容

```javascript
var reader = new FileReader();
```

实例属性：

- FileReader.error：读取文件时产生的错误对象
- FileReader.readyState：整数，表示读取文件时的当前状态。一共有三种可能的状态，`0`表示尚未加载任何数据，`1`表示数据正在加载，`2`表示加载完成。
- FileReader.result：读取完成后的文件内容，有可能是字符串，也可能是一个 ArrayBuffer 实例。
- FileReader.onabort：`abort`事件（用户终止读取操作）的监听函数。
- FileReader.onerror：`error`事件（读取错误）的监听函数。
- FileReader.onload：`load`事件（读取操作完成）的监听函数，通常在这个函数里面使用`result`属性，拿到文件内容。
- FileReader.onloadstart：`loadstart`事件（读取操作开始）的监听函数。
- FileReader.onloadend：`loadend`事件（读取操作结束）的监听函数。
- FileReader.onprogress：`progress`事件（读取操作进行中）的监听函数。

```javascript
// HTML 代码如下
// <input type="file" onchange="onChange(event)">

function onChange(event) {
  var file = event.target.files[0];
  var reader = new FileReader();
  reader.onload = function (event) {
    console.log(event.target.result)
  };

  reader.readAsText(file);
}
```



实例方法：

- FileReader.abort()：终止读取操作，`readyState`属性将变成`2`。
- FileReader.readAsArrayBuffer()：以 ArrayBuffer 的格式读取文件，读取完成后`result`属性将返回一个 ArrayBuffer 实例。
- FileReader.readAsBinaryString()：读取完成后，`result`属性将返回原始的二进制字符串。
- FileReader.readAsDataURL()：读取完成后，`result`属性将返回一个 Data URL 格式（Base64 编码）的字符串，代表文件内容。对于图片文件，这个字符串可以用于`<img>`元素的`src`属性。注意，这个字符串不能直接进行 Base64 解码，必须把前缀`data:*/*;base64,`从字符串里删除以后，再进行解码。
- FileReader.readAsText()：读取完成后，`result`属性将返回文件内容的文本字符串。该方法的第一个参数是代表文件的 Blob 实例，第二个参数是可选的，表示文本编码，默认为 UTF-8。

```javascript
/* HTML 代码如下
  <input type="file" onchange="previewFile()">
  <img src="" height="200">
*/

function previewFile() {
  var preview = document.querySelector('img');
  var file    = document.querySelector('input[type=file]').files[0];
  var reader  = new FileReader();

  reader.addEventListener('load', function () {
    preview.src = reader.result;
  }, false);

  if (file) {
    reader.readAsDataURL(file);
  }
}
```











