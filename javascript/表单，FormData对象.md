# 表单

即`<form>`，用于手机用户提交的数据发送到服务器

例如：

```html
<form action="/handling-page" method="post">
  <div>
    <label for="name">用户名：</label>
    <input type="text" id="name" name="user_name" />
  </div>
  <div>
    <label for="passwd">密码：</label>
    <input type="password" id="passwd" name="user_passwd" />
  </div>
  <div>
    <input type="submit" id="submit" name="submit_button" value="提交" />
  </div>
</form>
```

用户点击提交按钮，每个控件都会生成一个键值对，键名为控件的`name`，键值为控件的`value`属性，之间用等号连接

提交的数据格式与`<form>`元素的`method`属性相关

若为GET，则键值对会以URL的查询字符串形式提交，比如`/handling-page?user_name=张三&user_passwd=123&submit_button=提交`

```php
GET /handling-page?user_name=张三&user_passwd=123&submit_button=提交
Host: example.com
```

若为POST，键值对会连接成一行，作为HTTP请求的数据体发送到服务器，比如`user_name=张三&user_passwd=123&submit_button=提交`

```php
POST /handling-page HTTP/1.1
Host: example.com
Content-Type: application/x-www-form-urlencoded
Content-Length: 74

user_name=张三&user_passwd=123&submit_button=提交
```

==表单中的`<button>`元素如果没有用`type`指定类型，则默认为`submit`控件==



通过表单元素的`submit()`方法提交表单：

```javascript
formElement.submit();
```

通过表单元素的`reset()`方法重置控件值

```javascript
formElement.reset()
```



# FormData对象

用于通过脚本构造和编辑表单键值对

```javascript
var formdata = new FormData(form);
```

参数为表单元素，可选，若为空则表示空表单

例子：

```html
<form id="myForm" name="myForm">
  <div>
    <label for="username">用户名：</label>
    <input type="text" id="username" name="username">
  </div>
  <div>
    <label for="useracc">账号：</label>
    <input type="text" id="useracc" name="useracc">
  </div>
  <div>
    <label for="userfile">上传文件：</label>
    <input type="file" id="userfile" name="userfile">
  </div>
<input type="submit" value="Submit!">
</form>
```

```javascript
var myForm = document.getElementById('myForm');
var formData = new FormData(myForm);

// 获取某个控件的值
formData.get('username') // ""

// 设置某个控件的值
formData.set('username', '张三');

formData.get('username') // "张三"
```

## 实例方法

- `FormData.get(key)`：获取指定键名对应的键值，参数为键名。如果有多个同名的键值对，则返回第一个键值对的键值。
- `FormData.getAll(key)`：返回一个数组，表示指定键名对应的所有键值。如果有多个同名的键值对，数组会包含所有的键值。
- `FormData.set(key, value)`：设置指定键名的键值，参数为键名。如果键名不存在，会添加这个键值对，否则会更新指定键名的键值。如果第二个参数是文件，还可以使用第三个参数，表示文件名。
- `FormData.delete(key)`：删除一个键值对，参数为键名。
- `FormData.append(key, value)`：添加一个键值对。如果键名重复，则会生成两个相同键名的键值对。如果第二个参数是文件，还可以使用第三个参数，表示文件名。
- `FormData.has(key)`：返回一个布尔值，表示是否具有该键名的键值对。
- `FormData.keys()`：返回一个遍历器对象，用于`for...of`循环遍历所有的键名。
- `FormData.values()`：返回一个遍历器对象，用于`for...of`循环遍历所有的键值。
- `FormData.entries()`：返回一个遍历器对象，用于`for...of`循环遍历所有的键值对。如果直接用`for...of`循环遍历 FormData 实例，默认就会调用这个方法。

## 表单的内置验证

### 自动校验

在元素中添加限制从而实现自动验证

```html
<!-- 必填 -->
<input required>

<!-- 必须符合正则表达式 -->
<input pattern="banana|cherry">

<!-- 字符串长度必须为6个字符 -->
<input minlength="6" maxlength="6">

<!-- 数值必须在1到10之间 -->
<input type="number" min="1" max="10">

<!-- 必须填入 Email 地址 -->
<input type="email">

<!-- 必须填入 URL -->
<input type="URL">
```

若控件通过验证，会匹配`:valild`的CSS伪类，浏览器继续表单提交

若没有通过验证，会匹配`:invalid`的CSS伪类，浏览器停止表单提交并报错

```css
input:invalid {
  border-color: red;
}
input,
input:valid {
  border-color: #ccc;
}
```

### checkValidity()

用于手动出发校验，表单元素和表单控件都有这个方法

```javascript
// 触发整个表单的校验
form.checkValidity()

// 触发单个表单控件的校验
formControl.checkValidity()
```

返回一个布尔值，表示是否通过校验

```javascript
function submitForm(action) {
  var form = document.getElementById('form');
  form.action = action;
  if (form.checkValidity()) {
    form.submit();
  }
}
```

### willValidate属性

为布尔值，表示该控件是否在提交时进行校验

```javascript
// HTML 代码如下
// <form novalidate>
//   <input id="name" name="name" required />
// </form>

var input = document.querySelector('#name');
input.willValidate // true
```

### validationMessage属性

返回一个字符串，表示控件不满足校验条件时浏览器显示的提示文本

+ 控件不会在提交时自动校验
+ 控件满足校验条件

以上两种条件会返回空字符串

```javascript
// HTML 代码如下
// <form><input type="text" required></form>
document.querySelector('form input').validationMessage
// "请填写此字段。"
```

```javascript
var myInput = document.getElementById('myinput');
if (!myInput.checkValidity()) {
  document.getElementById('prompt').innerHTML = myInput.validationMessage;
}
```

### setCustomValidity()

用于定制校验失败时的报错信息，接收一个字符串作为参数，若为空则清楚上次设置的信息

```html
<form action="somefile.php">
  <input
    type="text"
    name="username"
    placeholder="Username"
    pattern="[a-z]{1,15}"
    id="username"
  >
  <input type="submit">
</form>
```

```javascript
var input = document.getElementById('username');
input.oninvalid = function (event) {
  event.target.setCustomValidity(
    '用户名必须是小写字母，不能为空，最长不超过15个字符'
  );
}
```

也可以直接调用该方法，浏览器会认为该控件没有通过校验

```javascript
/* HTML 代码如下
<form>
  <p><input type="file" id="fs"></p>
  <p><input type="submit"></p>
</form>
*/

document.getElementById('fs').onchange = checkFileSize;

function checkFileSize() {
  var fs = document.getElementById('fs');
  var files = fs.files;
  if (files.length > 0) {
     if (files[0].size > 75 * 1024) {
       fs.setCustomValidity('文件不能大于 75KB');
       return;
     }
  }
  fs.setCustomValidity('');
}
```

上面代码一旦发现文件大于 75KB，就会设置校验失败，同时给出自定义的报错信息。然后，点击提交按钮时，就会显示报错信息。

这种校验失败是不会自动消除的，所以如果所有文件都符合条件，要将报错信息设为空字符串，手动消除校验失败的状态。

### validity属性

控件元素的`validity`属性返回一个`ValidityState`对象，包含当前校验状态的信息

有以下只读属性：

- `ValidityState.badInput`：布尔值，表示浏览器是否不能将用户的输入转换成正确的类型，比如用户在数值框里面输入字符串。
- `ValidityState.customError`：布尔值，表示是否已经调用`setCustomValidity()`方法，将校验信息设置为一个非空字符串。
- `ValidityState.patternMismatch`：布尔值，表示用户输入的值是否不满足模式的要求。
- `ValidityState.rangeOverflow`：布尔值，表示用户输入的值是否大于最大范围。
- `ValidityState.rangeUnderflow`：布尔值，表示用户输入的值是否小于最小范围。
- `ValidityState.stepMismatch`：布尔值，表示用户输入的值不符合步长的设置（即不能被步长值整除）。
- `ValidityState.tooLong`：布尔值，表示用户输入的字数超出了最长字数。
- `ValidityState.tooShort`：布尔值，表示用户输入的字符少于最短字数。
- `ValidityState.typeMismatch`：布尔值，表示用户填入的值不符合类型要求（主要是类型为 Email 或 URL 的情况）。
- `ValidityState.valid`：布尔值，表示用户是否满足所有校验条件。
- `ValidityState.valueMissing`：布尔值，表示用户没有填入必填的值

```javascript
var input = document.getElementById('myinput');
if (input.validity.valid) {
  console.log('通过校验');
} else {
  console.log('校验失败');
}
```

```javascript
var txt = '';
if (document.getElementById('myInput').validity.rangeOverflow) {
  txt = '数值超过上限';
}
document.getElementById('prompt').innerHTML = txt;
```

禁止浏览器弹出表单验证的错误信息，可以监听`invalid`事件

```javascript
var input = document.getElementById('username');
var form  = document.getElementById('form');

var elem = document.createElement('div');
elem.id  = 'notify';
elem.style.display = 'none';
form.appendChild(elem);

input.addEventListener('invalid', function (event) {
  event.preventDefault();
  if (!event.target.validity.valid) {
    elem.textContent   = '用户名必须是小写字母';
    elem.className     = 'error';
    elem.style.display = 'block';
    input.className    = 'invalid animated shake';
  }
});

input.addEventListener('input', function(event){
  if ( 'block' === elem.style.display ) {
    input.className = '';
    elem.style.display = 'none';
  }
});
```

### 表单的novalidate属性

可以关闭浏览器的自动校验

```html
<form novalidate>
</form>
```

```javascript
form.noValidate = true;
```

```html
<form>
  <input type="submit" value="submit" formnovalidate>
</form>
```

### enctype属性

决定表单发送数据的编码格式

#### GET方法

使用`GET`方法，则`enctype`属性无效
数据将以URL的查询字符串发出

#### application/x-www-form-urlencoded

如果表单用`POST`发送数据，且省略`enctype`属性，那么数据以`application/x-www-form-urlencoded`格式（默认值）发送

```php
Content-Type: application/x-www-form-urlencoded

foo=bar&baz=The+first+line.%0D%0AThe+second+line.%0D%0A
```

#### text/plain

若表单使用`POST`发送数据，且`enctype`属性为`text/plain`，则数据以纯文本格式发送

```html
<form
  action="register.php"
  method="post"
  enctype="text/plain"
  onsubmit="AJAXSubmit(this); return false;"
>
</form>
```

HTTP请求：

```php
Content-Type: text/plain

foo=bar
baz=The first line.
The second line.
```

#### multipary/form-data

若表单使用`POST`发送数据，且`enctype`属性为`multipart/form-data`，则数据以混合格式发送

```html
<form
  action="register.php"
  method="post"
  enctype="multipart/form-data"
  onsubmit="AJAXSubmit(this); return false;"
>
</form>
```

HTTP请求：

```php
Content-Type: multipart/form-data; boundary=---------------------------314911788813839

-----------------------------314911788813839
Content-Disposition: form-data; name="foo"

bar
-----------------------------314911788813839
Content-Disposition: form-data; name="baz"

The first line.
The second line.

-----------------------------314911788813839--
```

## 文件上传

```html
<input type="file" id="file" name="myFile">
```

上传文件，需`<form>`的`method`属性设为`POST`，且`enctpye`设为`multipart/form-data`

```html
<form method="post" enctype="multipart/form-data">
  <div>
    <label for="file">选择一个文件</label>
    <input type="file" id="file" name="myFile" multiple>
  </div>
  <div>
    <input type="submit" id="submit" name="submit_button" value="上传" />
  </div>
</form>
```

```javascript
//获取文件列表
var fileSelect = document.getElementById('file');
var files = fileSelect.files;
//新建FormData实例对象，模拟发送到服务器的表单数据
var formData = new FormData();
for (var i = 0; i < files.length; i++) {
  var file = files[i];
  // 只上传图片文件
  if (!file.type.match('image.*')) {
    continue;
  }
  formData.append('photos[]', file, file.name);
}
//使用Ajax上传
var xhr = new XMLHttpRequest();
xhr.open('POST', 'handler.php', true);
xhr.onload = function () {
  if (xhr.status !== 200) {
    console.log('An error occurred!');
  }
};
xhr.send(formData);

//或者直接用AJAX发送文件
var file = document.getElementById('test-input').files[0];
var xhr = new XMLHttpRequest();

xhr.open('POST', 'myserver/uploads');
xhr.setRequestHeader('Content-Type', file.type);
xhr.send(file);
```







