# Navigator对象

## 属性

### navigator.userAgent

返回浏览器的User Agent字符串，表示浏览器的厂商和版本信息

```javascript
navigator.userAgent
// "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/29.0.1547.57 Safari/537.36"
//chrome浏览器信息
```

可用于大致识别手机浏览器，测试是否包含`mobi`字符串

```javascript
var ua = navigator.userAgent.toLowerCase();

if (/mobi/i.test(ua)) {
  // 手机浏览器
} else {
  // 非手机浏览器
}
```

### navigator.plugins

返回一个类似数组的对象，成员为Plugin实例对象，表示浏览器安装的插件

```javascript
var pluginsLength = navigator.plugins.length;

for (var i = 0; i < pluginsLength; i++) {
  console.log(navigator.plugins[i].name);
  console.log(navigator.plugins[i].filename);
  console.log(navigator.plugins[i].description);
  console.log(navigator.plugins[i].version);
}
```

### navigator.platform

返回用户的操作系统信息

### navigator.onLine

返回布尔值，表示用户在线或离线

局域网也会返回true

可以用`window.ononline`和`window.onoffline`监听

### navigator.language，navigator.languages

`navigator.language`返回一个字符串，表示浏览器的首选语言

`navigator.languages`属性返回一个数组，表示用户可以接受的语言。`navigator.language`总是这个数组的第一个成员。HTTP 请求头信息的`Accept-Language`字段，就来自这个数组。

```javascript
navigator.languages  // ["en-US", "en", "zh-CN", "zh", "zh-TW"]
```

如果这个属性发生变化，就会在`window`对象上触发`languagechange`事件。

### navigator.geolocation

返回一个Geolocation对象，包含用户地理位置的信息

==只能在HTTPS协议下可用==

Geolocation 对象提供下面三个方法。

- Geolocation.getCurrentPosition()：得到用户的当前位置
- Geolocation.watchPosition()：监听用户位置变化
- Geolocation.clearWatch()：取消`watchPosition()`方法指定的监听函数

注意，调用这三个方法时，浏览器会跳出一个对话框，要求用户给予授权。

### navigator.cookieEnabled

返回一个布尔值，表示浏览器的Cookie功能是否打开

与是否存储某个具体网站cookie无关

## Navigator对象的方法

### Navigator.javaEnabled()

返回一个布尔值，表示浏览器是否能运行Java Applet小程序

### Navigator.sendBeacon()

用于向服务器异步发送数据

# Screen对象

提供显示设备的信息

属性有：

- `Screen.height`：浏览器窗口所在的屏幕的高度（单位像素）。除非调整显示器的分辨率，否则这个值可以看作常量，不会发生变化。显示器的分辨率与浏览器设置无关，缩放网页并不会改变分辨率。
- `Screen.width`：浏览器窗口所在的屏幕的宽度（单位像素）。
- `Screen.availHeight`：浏览器窗口可用的屏幕高度（单位像素）。因为部分空间可能不可用，比如系统的任务栏或者 Mac 系统屏幕底部的 Dock 区，这个属性等于`height`减去那些被系统组件的高度。
- `Screen.availWidth`：浏览器窗口可用的屏幕宽度（单位像素）。
- `Screen.pixelDepth`：整数，表示屏幕的色彩位数，比如`24`表示屏幕提供24位色彩。
- `Screen.colorDepth`：`Screen.pixelDepth`的别名。严格地说，colorDepth 表示应用程序的颜色深度，pixelDepth 表示屏幕的颜色深度，绝大多数情况下，它们都是同一件事。
- `Screen.orientation`：返回一个对象，表示屏幕的方向。该对象的`type`属性是一个字符串，表示屏幕的具体方向，`landscape-primary`表示横放，`landscape-secondary`表示颠倒的横放，`portrait-primary`表示竖放，`portrait-secondary`。

下面是`Screen.orientation`的例子。

```javascript
window.screen.orientation
// { angle: 0, type: "landscape-primary", onchange: null }
```

下面的例子保证屏幕分辨率大于 1024 x 768。

```javascript
if (window.screen.width >= 1024 && window.screen.height >= 768) {
  // 分辨率不低于 1024x768
}
```

下面是根据屏幕的宽度，将用户导向不同网页的代码。

```javascript
if ((screen.width <= 800) && (screen.height <= 600)) {
  window.location.replace('small.html');
} else {
  window.location.replace('wide.html');
}
```























