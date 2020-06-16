# History对象

`window.history`属性指向History对象，表示当前窗口的浏览历史

由于安全原因，浏览器不允许脚本读取地址，但是允许在地址之间导航

## 属性

### History.length

当前窗口访问过的网址数量

### History.state

History堆栈最上层的状态值

```javascript
// 当前窗口访问过多少个网页
window.history.length // 1

// History 对象的当前状态
// 通常是 undefined，即未设置
window.history.state // undefined
```

## 方法

### History.back()，History.forward()，History.go()

用于在历史中移动

- `History.back()`：移动到上一个网址，等同于点击浏览器的后退键。对于第一个访问的网址，该方法无效果。
- `History.forward()`：移动到下一个网址，等同于点击浏览器的前进键。对于最后一个访问的网址，该方法无效果。
- `History.go()`：接受一个整数作为参数，以当前网址为基准，移动到参数指定的网址，比如`go(1)`相当于`forward()`，`go(-1)`相当于`back()`。如果参数超过实际存在的网址范围，该方法无效果；如果不指定参数，默认参数为`0`，相当于刷新当前页面。

==移动到以前访问过的页面时，页面通常是从浏览器缓存之中加载，而不是重新要求服务器发送新的网页==

### Histroy.pushState()

用于在历史中添加一条记录，但==不会刷新页面==

```javascript
window.history.pushState(state,title,url);
```

+ `state`：与添加的记录相关联的状态对象，主要用于`popstate`事件。当该事件触发时，该对象会作为参数传入回调函数，如果不需要可以填`null`
+ `title`：新页面的标题。可以填空字符串，现在浏览器都忽视这个参数
+ `url`：新的网址，必须与当前页面处在同一个域，浏览器地址栏会显示这个网址，若网址跨域，则会报错

```javascript
//例子
var stateObj = { foo: 'bar' };
history.pushState(stateObj, 'page 2', '2.html');
history.state // {foo: "bar"}
```

此时浏览器页面不刷新，地址栏显示2.html，若输入新地址然后倒退按钮，页面会显示`2.html`，再倒退才会返回设置前的页面url



如果`pushState`的 URL 参数设置了一个新的锚点值（即`hash`），并不会触发`hashchange`事件。反过来，如果 URL 的锚点值变了，则会在 History 对象创建一条浏览记录

### History.replaceState()

用于修改History对象的当前记录，其他与`pushState()`方法一样

```javascript
//当前网址为example.com/example.html
history.pushState({page: 1}, 'title 1', '?page=1')
// URL 显示为 http://example.com/example.html?page=1

history.pushState({page: 2}, 'title 2', '?page=2');
// URL 显示为 http://example.com/example.html?page=2

history.replaceState({page: 3}, 'title 3', '?page=3');
// URL 显示为 http://example.com/example.html?page=3

history.back()
// URL 显示为 http://example.com/example.html?page=1

history.back()
// URL 显示为 http://example.com/example.html

history.go(2)
// URL 显示为 http://example.com/example.html?page=3
```

## popstate事件

每当同一个文档的浏览历史出现变化就会触发

仅调用`pushState()`和`replaceState()`不会触发

只针对同一个文档

```javascript
window.onpopstate = function (event) {
  console.log('location: ' + document.location);
  console.log('state: ' + JSON.stringify(event.state));
};

// 或者
window.addEventListener('popstate', function(event) {
  console.log('location: ' + document.location);
  console.log('state: ' + JSON.stringify(event.state));
});
```

回调函数参数为`event`事件对象，`state`属性指向`pushState`和`replaceState`为当前URL所提供的状态对象

同时`state`对象也可以通过这样获取：

```javascript
var currentState = history.state;
```

==页面第一次加载不会触发`popstate`事件==

