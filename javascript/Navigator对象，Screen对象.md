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

























