# jQuery

## `$`

```javascript
window.jQuery; // jQuery(selector, context)
window.$; // jQuery(selector, context)
$ === jQuery; // true
typeof($); // 'function'
```

> jQuery将所有功能封装在一个全局变量`jQuery`中，而`$`是`jQuery`的别名

若`$`变量与其他库冲突：

```javascript
$.noConflict();
//令jQuery让出$变量，使用另一个库的$的代码
```

## 选择器

```javascript
//根据id寻找
var div = $('#abc'); //若为空返回 []
//根据tag寻找
var p = $('p');
//按class寻找
var cla = $('.red');
var clas = $('.red.blue'); //同时查找包含两个class类型的节点
//按属性寻找
var email = $('[name = email]');
var a = $('[items = 'A B']'); //属性值包含空格等特殊字符需要使用双引号
var a_front = $('[name ^= icon]'); //查找所有name属性以icon开头的
var a_back = $('[name $= icon]'); //查找所有name属性以icon结尾的

//从匹配元素集合中删除元素
var p = $('p').not('#selected');  //删除id为selected的段落
```

DOM对象与jQuery对象相互转化：

```javascript
var div = $('#abc'); // jQuery对象
var divDom = div.get(0); // 假设存在div，获取第1个DOM元素 
var divDom2 = div[0]; 
var divDom3 = div.get()[0];

var another = $(divDom); // 重新把DOM包装为jQuery对象
```

### 层级选择器

1. 两个元素有层级关系，`$('ancestor descendant')`

```html
<!-- HTML结构 -->
<div class="testing">
    <ul class="lang">
        <li class="lang-javascript">JavaScript</li>
        <li class="lang-python">Python</li>
        <li class="lang-lua">Lua</li>
    </ul>
</div>
```

```javascript
$('ul.lang li.lang-javascript'); // [<li class="lang-javascript">JavaScript</li>]
$('div.testing li.lang-javascript'); // [<li class="lang-javascript">JavaScript</li>]
```

首先收缩选择范围，定位父节点再选择对应的子节点

2. 子选择器，`$('parent>child')`

与层级选择器类似，但子节点必须是父节点的直属节点

```javascript
$('ul.lang>li.lang-javascript'); // 可以选出[<li class="lang-javascript">JavaScript</li>]
$('div.testing>li.lang-javascript'); // [], 无法选出，因为<div>和<li>不构成父子关系
```

3. 过滤器

更精确定位元素：

```javascript
$('ul.lang li'); // 选出JavaScript、Python和Lua 3个节点

$('ul.lang li:first-child'); // 仅选出JavaScript
$('ul.lang li:last-child'); // 仅选出Lua
$('ul.lang li:nth-child(2)'); // 选出第N个元素，N从1开始
$('ul.lang li:nth-child(even)'); // 选出序号为偶数的元素
$('ul.lang li:nth-child(odd)'); // 选出序号为奇数的元素
```

4. 表单选择

针对表单元素，jQuery还有一组特殊的选择器：

- `:input`：可以选择`<input>`，`<textarea>`，`<select>`和`<button>`；
- `:file`：可以选择`<input type="file">`，和`input[type=file]`一样；
- `:checkbox`：可以选择复选框，和`input[type=checkbox]`一样；
- `:radio`：可以选择单选框，和`input[type=radio]`一样；
- `:focus`：可以选择当前输入焦点的元素，例如把光标放到一个`<input>`上，用`$('input:focus')`就可以选出；
- `:checked`：选择当前勾上的单选框和复选框，用这个选择器可以立刻获得用户选择的项目，如`$('input[type=radio]:checked')`；
- `:enabled`：可以选择可以正常输入的`<input>`、`<select>` 等，也就是没有灰掉的输入；
- `:disabled`：和`:enabled`正好相反，选择那些不能输入的。

此外，jQuery还有很多有用的选择器，例如，选出可见的或隐藏的元素：

```javascript
$('div:visible'); // 所有可见的div
$('div:hidden'); // 所有隐藏的div
```

### 查找与过滤

#### 查找

```html
<!-- HTML结构 -->
<ul class="lang">
    <li class="js dy">JavaScript</li>
    <li class="dy">Python</li>
    <li id="swift">Swift</li>
    <li class="dy">Scheme</li>
    <li name="haskell">Haskell</li>
</ul>
```

```javascript
//使用find()查找子节点
var ul = $('ul.lang'); // 获得<ul>
var dy = ul.find('.dy'); // 获得JavaScript, Python, Scheme
var swf = ul.find('#swift'); // 获得Swift
var hsk = ul.find('[name=haskell]'); // 获得Haskell

//使用parent()查找父节点
var swf = $('#swift'); // 获得Swift
var parent = swf.parent(); // 获得Swift的上层节点<ul>
var a = swf.parent('.red'); // 获得Swift的上层节点<ul>，同时传入过滤条件。如果ul不符合条件，返回空jQuery对象

//使用next()与prev()查找同层级节点
var swift = $('#swift');
swift.next(); // Scheme
swift.next('[name=haskell]'); // 空的jQuery对象，因为Swift的下一个元素Scheme不符合条件[name=haskell]
swift.prev(); // Python
swift.prev('.dy'); // Python，因为Python同时符合过滤器条件.dy
```

#### 过滤

1. `filter()`

```javascript
var langs = $('ul.lang li'); // 拿到JavaScript, Python, Swift, Scheme和Haskell
var a = langs.filter('.dy'); // 拿到JavaScript, Python, Scheme
```

或传入函数：

```javascript
var langs = $('ul.lang li'); // 拿到JavaScript, Python, Swift, Scheme和Haskell
langs.filter(function () {
    return this.innerHTML.indexOf('S') === 0; // 返回S开头的节点
}); // 拿到Swift, Scheme
```

> 此处this绑定为DOM对象而不是jQuery对象

2. `map()`

将一个jQuery对象包含的若干DOM节点转化为其他对象；

```javascript
var langs = $('ul.lang li'); // 拿到JavaScript, Python, Swift, Scheme和Haskell
var arr = langs.map(function () {
    return this.innerHTML;
}).get(); 
// 用get()拿到包含string的Array：['JavaScript', 'Python', 'Swift', 'Scheme', 'Haskell']
```

此外，一个jQuery对象如果包含了不止一个DOM节点，`first()`、`last()`和`slice()`方法可以返回一个新的jQuery对象，把不需要的DOM节点去掉：

```javascript
var langs = $('ul.lang li'); // 拿到JavaScript, Python, Swift, Scheme和Haskell
var js = langs.first(); // JavaScript，相当于$('ul.lang li:first-child')
var haskell = langs.last(); // Haskell, 相当于$('ul.lang li:last-child')
var sub = langs.slice(2, 4); // Swift, Scheme, 参数和数组的slice()方法一致
```



例子：用jQuery获取表单的JSON字符串：

```html
<form id="test-form" action="#0" onsubmit="return false;">
    <p><label>Name: <input name="name"></label></p>
    <p><label>Email: <input name="email"></label></p>
    <p><label>Password: <input name="password" type="password"></label></p>
    <p>Gender: <label><input name="gender" type="radio" value="m" checked> Male</label> <label><input name="gender" type="radio" value="f"> Female</label></p>
    <p><label>City: <select name="city">
    	<option value="BJ" selected>Beijing</option>
    	<option value="SH">Shanghai</option>
    	<option value="CD">Chengdu</option>
    	<option value="XM">Xiamen</option>
    </select></label></p>
    <p><button type="submit">Submit</button></p>
</form>
```

```javascript
var json = null;
var obj = {};
// 限定状态:input 可获取：<input>，<textarea>，<select>和<button> 元素
$('#test-form :input').filter
(
    function()
    {
      // 过滤节点数组中：未选中的radio单选框节点和submit按钮节点
      // this是DOM对象，获取节点属性type、checked等
       var isNotChecked  = this.type === 'radio' && !this.checked;
       if( isNotChecked  || this.type === 'submit')
            return false;
       else
            return true;
    }
).map
(
    function()
    {
       // select元素可直接获取name属性和选中的值
       return obj[this.name] = this.value;
    }
)
json = JSON.stringify(obj,null,'  ');
```



## 操作DOM

修改Text与HTML

### `text()` `html()`

```html
<!-- HTML结构 -->
<ul id="test-ul">
    <li class="js">JavaScript</li>
    <li name="book">Java &amp; JavaScript</li>
</ul>
```

```javascript
$('#test-ul li[name=book]').text(); // 'Java & JavaScript'
$('#test-ul li[name=book]').html(); // 'Java &amp; JavaScript'

var j1 = $('#test-ul li.js');
var j2 = $('#test-ul li[name=book]');
j1.html('<span style="color: red">JavaScript</span>');
j2.text('JavaScript & ECMAScript');
```

> 若选择器没有返回DOM节点也不会报错，但理所当然没有修改效果

## 修改CSS

```html
<!-- HTML结构 -->
<ul id="test-css">
    <li class="lang dy"><span>JavaScript</span></li>
    <li class="lang"><span>Java</span></li>
    <li class="lang dy"><span>Python</span></li>
    <li class="lang"><span>Swift</span></li>
    <li class="lang dy"><span>Scheme</span></li>
</ul>
```

```javascript
//调用jQuery对象的css('name','value')方法
$('#test-css li.dy>span').css('background-color', '#ffd351').css('color', 'red');
```

> 可以使用`background-color`和`backgroundColor`两种格式

> `css()`方法作用于DOM节点的`style`属性

```javascript
var div = $('#test-div');
div.css('color'); // '#000033', 获取CSS属性
div.css('color', '#336699'); // 设置CSS属性
div.css('color', ''); // 清除CSS属性
```

修改`class`属性：

```javascript
var div = $('#test-div');
div.hasClass('highlight'); // false， class是否包含highlight
div.addClass('highlight'); // 添加highlight这个class
div.removeClass('highlight'); // 删除highlight这个class
```

## 显示和隐藏DOM

```javascript
var a = $('a[target=_blank]');
a.hide(); // 隐藏
a.show(); // 显示
```

## 获取DOM信息

```javascript
// 浏览器可视窗口大小:
$(window).width(); // 800
$(window).height(); // 600

// HTML文档大小:
$(document).width(); // 800
$(document).height(); // 3500

// 某个div的大小:
var div = $('#test-div');
div.width(); // 600
div.height(); // 300
div.width(400); // 设置CSS属性 width: 400px，是否生效要看CSS是否有效
div.height('200px'); // 设置CSS属性 height: 200px，是否生效要看CSS是否有效
```

### `attr()` `removeAttr()`

用于操作DOM节点的属性：

```javascript
// <div id="test-div" name="Test" start="1">...</div>
var div = $('#test-div');
div.attr('data'); // undefined, 属性不存在
div.attr('name'); // 'Test'
div.attr('name', 'Hello'); // div的name属性变为'Hello'
div.removeAttr('name'); // 删除name属性
div.attr('name'); // undefined
```

### `prop()`

与`attr()`类似，但是对于那种可以没有值，只有出现与否之分的属性的操作不同：

```html
<input id="test-radio" type="radio" name="test"     checked       value="1">
=======
<input id="test-radio" type="radio" name="test" checked="checked" value="1">
```

```javascript
var radio = $('#test-radio');
radio.attr('checked'); // 'checked'
radio.prop('checked'); // true
```

对于拥有true和false两个属性的属性，使用`prop()`进行设置

> ==*==
>
> 使用`is()`方法判断会更好：
>
> ```javascript
> var radio = $('#test-radio');
> radio.is(':checked'); // true
> ```

## 操作表单

```html
<input id="test-input" name="email" value="">
<select id="test-select" name="city">
    <option value="BJ" selected>Beijing</option>
    <option value="SH">Shanghai</option>
    <option value="SZ">Shenzhen</option>
</select>
<textarea id="test-textarea">Hello</textarea>
```

```javascript
var
    input = $('#test-input'),
    select = $('#test-select'),
    textarea = $('#test-textarea');

input.val(); // 'test'
input.val('abc@example.com'); // 文本框的内容已变为abc@example.com

select.val(); // 'BJ'
select.val('SH'); // 选择框已变为Shanghai

textarea.val(); // 'Hello'
textarea.val('Hi'); // 文本区域已更新为'Hi'
```

## 修改DOM结构

### 添加DOM

使用`append()`方法：

```html
<div id="test-div">
    <ul>
        <li><span>JavaScript</span></li>
        <li><span>Python</span></li>
        <li><span>Swift</span></li>
    </ul>
</div>
```

```javascript
var ul = $('#test-div>ul');
ul.append('<li><span>Haskell</span></li>');

//还可以传入原始的DOM对象，jQuery对象与函数对象：

// 创建DOM对象:
var ps = document.createElement('li');
ps.innerHTML = '<span>Pascal</span>';
// 添加DOM对象:
ul.append(ps);

// 添加jQuery对象:
ul.append($('#scheme'));

// 添加函数对象:
ul.append(function (index, html) {
    return '<li><span>Language - ' + index + '</span></li>';
});
```

`append()`将DOM放到最后，`prepend()`将DOM放到最前

同级节点使用`after()` 与 `before()`方法

> 若用于已存在的DOM节点，则等价于移动DOM节点

### 删除节点

`remove()`方法，可以一次删除多个DOM节点，取决于获取的节点数

## 事件

```javascript
// 获取超链接的jQuery对象:
var a = $('#test-link');
a.on('click', function () {
    alert('Hello!');
});

//简化写法
a.click(function () {
    alert('Hello!');
});
```

jQuery使用`on`方法来绑定一个事件，需要传入事件名称与对应的处理函数

### 鼠标事件

| 名称         | 效果                   |
| :----------- | ---------------------- |
| `click`      | 鼠标单击               |
| `dblclick`   | 鼠标双击               |
| `mouseenter` | 鼠标进入               |
| `mouseleave` | 鼠标移出               |
| `mousemove`  | 鼠标在区域内移动       |
| `hover`      | 鼠标进入和退出时都触发 |

### 键盘事件

| 名称       | 效果               |
| ---------- | ------------------ |
| `keydown`  | 键盘按下时触发     |
| `keyup`    | 键盘松开时触发     |
| `keypress` | 键盘按一次键后触发 |

###　其他事件

| 名称     | 效果                                                    |
| -------- | ------------------------------------------------------- |
| `focus`  | 当DOM获得焦点时触发                                     |
| `blur`   | 当DOM失去焦点时触发                                     |
| `change` | 当`<input>`、`<select>`、`<textarea>`的内容改变时触发   |
| `submit` | 当`<form>`提交时触发                                    |
| `ready`  | 当页面被载入且DOM树完成初始化后触发，仅作用于`document` |

对于初始化代码，为了保证DOM完成初始化后再触发，可以：

```javascript
$(document).on('ready',function(){
    alert('ok');
});

//可以简化为
$(document).ready(functino(){});

//再简化为
$(function(){});
```

### 事件参数

所有事件都会传入`Event`对象作为参数：

```javascript
$(function () {
    $('#testMouseMoveDiv').mousemove(function (e) {
        $('#testMouseMoveSpan').text('pageX = ' + e.pageX + ', pageY = ' + e.pageY);
    });
});
```

### 取消绑定

一个已被绑定的事件可以通过`off('click',function)`实现取消绑定：

```javascript
function hello() {
    alert('hello!');
}

a.click(hello); // 绑定事件

// 10秒钟后解除绑定:
setTimeout(function () {
    a.off('click', hello);
}, 10000);
```

> 以下写法无效：
>
> ```javascript
> // 绑定事件:
> a.click(function () {
>     alert('hello!');
> });
> 
> // 解除绑定:
> a.off('click', function () {
>     alert('hello!');
> });
> ```

无参数调用`off()`一次性移除所有类型的已绑定函数

### 事件触发条件

如对于监视文本框内容改动，若用户进行输入会触发`change`，但若使用JavaScript代码改动则不会触发，此时可以直接调用无参数的`change()`来进行触发：

```javascript
var input = $('#test-input');
input.val('change it!'); // 无法触发change事件

var input = $('#test-input');
input.val('change it!');
input.change(); // 触发change事件  相当于input.trigger('change');
```

### 浏览器安全限制

有部分代码需要用户触发才能执行，且延时后有可能被拦截：

```javascript
// 无法弹出新窗口，将被浏览器屏蔽:
$(function () {
    window.open('/');
});3


var button1 = $('#testPopupButton1');
var button2 = $('#testPopupButton2');

function popupTestWindow() {
    window.open('/');
}

button1.click(function () {
    popupTestWindow();
});

button2.click(function () {
    // 不立刻执行popupTestWindow()，100毫秒后执行:
    setTimeout(popupTestWindow, 100);
});
```

点击`button1`，会执行`click`事件，但`button2`不会（我使用chrome浏览器会）

## 动画

### `show/hide`

传递时间参数：从左上角逐渐展开或收缩

```javascript
var div = $('#test-show-hide');
div.hide(3000); // 在3秒钟内逐渐消失

var div = $('#test-show-hide');
div.show('slow'); // 在0.6秒钟内逐渐显示
```

>`toggle()`方法则根据当前状态决定是`show()`还是`hide()`

### `slideUP/slideDown`

在垂直方向逐渐展开或收缩

```javascript
var div = $('#test-slide');
div.slideUp(3000); // 在3秒钟内逐渐向上消失
```

>`slideToggle()`则根据元素是否可见来决定下一步动作：

### `fadeIn/fadeOut`

淡入淡出

```javascript
var div = $('#test-fade');
div.fadeOut('slow'); // 在0.6秒内淡出
```

>`fadeToggle()`则根据元素是否可见来决定下一步动作：

### 自定义动画 `animate()`

需要传入DOM元素最终的CSS状态和事件

```javascript
var div = $('#test-animate');
div.animate({
    opacity: 0.25,
    width: '256px',
    height: '256px'
}, 3000); // 在3秒钟内CSS过渡到设定值
```

还可以传入一个函数，当动画结束时，调用该函数

```javascript
var div = $('#test-animate');
div.animate({
    opacity: 0.25,
    width: '256px',
    height: '256px'
}, 3000, function () {
    console.log('动画已结束');
    // 恢复至初始状态:
    $(this).css('opacity', '1.0').css('width', '128px').css('height', '128px');
});
```

#### 串行动画

通过`delay()`方法实现暂停

```javascript
var div = $('#test-animates');
// 动画效果：slideDown - 暂停 - 放大 - 暂停 - 缩小
div.slideDown(2000)
   .delay(1000)
   .animate({
       width: '256px',
       height: '256px'
   }, 2000)
   .delay(1000)
   .animate({
       width: '128px',
       height: '128px'
   }, 2000);
}
```

## AJAX

优点：不用考虑浏览器问题，简化代码

`$.ajax(url,settings)`函数接收一个URL和一个可选的`settings`对象：

- async：是否异步执行AJAX请求，默认为`true`，千万不要指定为`false`；
- method：发送的Method，缺省为`'GET'`，可指定为`'POST'`、`'PUT'`等；
- contentType：发送POST请求的格式，默认值为`'application/x-www-form-urlencoded; charset=UTF-8'`，也可以指定为`text/plain`、`application/json`；
- data：发送的数据，可以是字符串、数组或object。如果是GET请求，data将被转换成query附加到URL上，如果是POST请求，根据contentType把data序列化成合适的格式；
- headers：发送的额外的HTTP头，必须是一个object；
- dataType：接收的数据格式，可以指定为`'html'`、`'xml'`、`'json'`、`'text'`等，缺省情况下根据响应的`Content-Type`猜测

```javascript
//发送一个GET请求，返回一个JSON格式的数据
var jqxhr = $.ajax('/api/categories', {
    dataType: 'json'
});
// 请求已经发送了
```

使用回调函数处理返回的数据和出错：

```javascript
function ajaxLog(s) {
    var txt = $('#test-response-text');
    txt.val(txt.val() + '\n' + s);
}

$('#test-response-text').val('');

var jqxhr = $.ajax('/api/categories', {
    dataType: 'json'
}).done(function (data) {
    ajaxLog('成功, 收到的数据: ' + JSON.stringify(data));
}).fail(function (xhr, status) {
    ajaxLog('失败: ' + xhr.status + ', 原因: ' + status);
}).always(function () {
    ajaxLog('请求完成: 无论成功或失败都会调用');
});
```

