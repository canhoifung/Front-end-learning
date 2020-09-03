# GlobalEventHandlers接口

另一种方法用于指定事件的回调函数：

```javascript
div.onclick = clickHandler;
```

优点是使用比较方便，缺点是只能为每个事件指定一个回调函数，并且无法指定事件触发的阶段（捕获阶段还是冒泡阶段）

HTML元素、`document`对象、`window`对象都可以使用这个`GlobalEventHandlers`接口

## GlobalEventHandlers.onabort

某个对象的`abort`事件（停止加载）发生时，就会调用这个属性指定的回调函数

一般只用在`<img>`元素上

```javascript
// HTML 代码如下
// <img src="example.jpg" id="img">
var img = document.getElementById('img');
img.onabort = function () {
  console.log('image load aborted.');
}
```

##  GlobalEventHandlers.onerror

`error`事件发生时调用

分为两种`error`：

1. JavaScript运行时错误，会传到`window`对象，导致`window.onerror()`

```javascript
window.onerror = function (message, source, lineno, colno, error) {
  // ...
}
```

- message：错误信息字符串
- source：报错脚本的 URL
- lineno：报错的行号，是一个整数
- colno：报错的列号，是一个整数
- error： 错误对象

2. 资源加载错误，比如`<img>`或`<script>`加载的资源出现加载错误，此时Error对象会传到对应的元素

```javascript
element.onerror = function (event){};
```

​			资源加载错误一般不会触发`window.onerror()`

## GlobalEventHandlers.onload、GlobalEventHandlers.onloadstart

元素完成加载时，触发`load`事件，触发`onload`

常用于`window`和`<img>`，对于`window`，只有页面的所有资源包括外部资源都加载完毕才会触发`load`事件

对于`<img>`和`<video>`等元素，加载开始时还会触发`loadstart`事件，导致执行`onloadstart`

## GlobalEventHandlers.onfocus，GlobalEventHandlers.onblur

当前元素获得焦点时，会触发`element.onfocus`

失去焦点时，会触发`element.onblur`

```javascript
element.onfocus = function () {
  console.log("onfocus event detected!");
};
element.onblur = function () {
  console.log("onblur event detected!");
};
```

==*==注意，如果不是可以接受用户输入的元素，要触发`onfocus`，该元素必须有`tabindex`属性。

## GlobalEventHandlers.onscroll

页面或者元素滚动时触发

## GlobalEventHandlers.oncontextmenu，GlobalEventHandlers.onshow

用户在页面上按下鼠标的右键，会触发`contextmenu`事件，导致执行`oncontextmenu()`

如果该属性执行后返回`false`，就等于禁止了右键菜单。`document.oncontextmenu`与`window.oncontextmenu`效果一样。

```
document.oncontextmenu = function () {
  return false;
};
```

上面代码中，`oncontextmenu`属性执行后返回`false`，右键菜单就不会出现。

元素的右键菜单显示时，会触发该元素的`onshow`监听函数

## 其他的事件属性

鼠标的事件属性。

- onclick
- ondblclick
- onmousedown
- onmouseenter
- onmouseleave
- onmousemove
- onmouseout
- onmouseover
- onmouseup
- onwheel

键盘的事件属性。

- onkeydown
- onkeypress
- onkeyup

焦点的事件属性。

- onblur
- onfocus

表单的事件属性。

- oninput
- onchange
- onsubmit
- onreset
- oninvalid
- onselect

触摸的事件属性。

- ontouchcancel
- ontouchend
- ontouchmove
- ontouchstart

拖动的事件属性分成两类：一类与被拖动元素相关，另一类与接收被拖动元素的容器元素相关。

被拖动元素的事件属性。

- ondragstart：拖动开始
- ondrag：拖动过程中，每隔几百毫秒触发一次
- ondragend：拖动结束

接收被拖动元素的容器元素的事件属性。

- ondragenter：被拖动元素进入容器元素。
- ondragleave：被拖动元素离开容器元素。
- ondragover：被拖动元素在容器元素上方，每隔几百毫秒触发一次。
- ondrop：松开鼠标后，被拖动元素放入容器元素。

`<dialog>`对话框元素的事件属性。

- oncancel
- onclose



























