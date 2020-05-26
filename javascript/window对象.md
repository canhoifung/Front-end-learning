# window对象

最顶层的对象

若变量未声明，就默认为顶层对象的属性

## 属性

### window.name

表示当前浏览器窗口的名字

只能保存字符串，非字符串的会转为字符串保存

只要浏览器窗口不关闭，属性就不会消失，即若同一窗口载入了新网页，新网页也可以获取到设置的内容

### window.closed，window.opener

`window.closed`返回布尔值，表示窗口是否关闭

一般用于检查使用脚本打开的新窗口是否关闭

```javascript
var popup = window.open();
if ((popup !==null)&& !popup.closed){
    //窗口打开着
}
```

`window.opener`表示打开当前窗口的父窗口，若没有则返回`null`

若两个窗口之间不需要通信，可以将子窗口的`opener`属性显式设置为`null`，更安全

```javascript
var newWin = window.open('example.html', 'newWindow', 'height=400,width=400');
newWin.opener = null;
```

若两个窗口同源，且其中一个由另一个打开，可以通过`opener`属性获取父窗口的全局属性和方法

`<a>`元素添加`rel="noopener"`属性，可以防止新打开的窗口获取父窗口，减轻被恶意网站修改父窗口 URL 的风险。

```html
<a href="https://an.evil.site" target="_blank" rel="noopener">
恶意网站
</a>
```













