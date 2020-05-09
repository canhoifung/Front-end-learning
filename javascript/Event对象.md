# Event对象

事件发生后都会产生一个事件对象，所有的事件对象都是`Event`对象的实例

```javascript
event = new Event(type,options);
```

+ type：表示事件名称
+ options：表示事件对象的配置，同样是一个对象，有两个属性：
  + bubbles：布尔值，可选，默认false，表示事件对象是否冒泡
  + cancelable：布尔值，可选，默认false，表示事件是否可被preventDefault()取消

## 实例属性

### Event.bubbles

返回一个布尔值，表示当前事件是否会冒泡，只读

### Event.eventPhase

返回一个整数常量，表示事件目前所处的阶段，只读

+ 0：事件目前没有发生
+ 1：事件目前处于捕获阶段
+ 2：事件到达目标节点
+ 3：事件处于冒泡阶段

### Event.cancelable

返回一个布尔值，表示事件是否可取消，只读

为`true`时，可以调用`Event.preventDefault()`取消事件

### Event.cancelBubble

返回一个布尔值，若为`true`相当于执行`Event.stopPropagation()`

### Event.defaultPrevented

返回一个布尔值，表示该事件是否调用过`Event.preventDefault()`并实现了，只读

### Event.currentTarget

事件当前正在通过的节点，随着事件传播会改变

### Event.target

事件的原始触发节点

### Event.type

返回一个字符串，表示事件类型，即生成事件时的`type`，只读

### Event.timeStamp

返回一个毫秒时间戳，表示事件发生的时间，从网页加载成功开始计时

可能为整数也可能为小数，取决于浏览器的设置

### Event.isTrusted

返回一个布尔值，表示该事件是否由真实的用户行为产生

由构造函数生成的事件就返回false

### Event.detail

只有浏览器的UI（用户界面）才具有，返回一个数值，表达事件的某种信息

与事件类型相关

## 实例方法

### Event.preventDefault()

取消浏览器对当前事件的默认行为

### Event.stopPropagation()

阻止事件在DOM中继续传播

### Event.stopImmediatePropagation()

阻止同一个事件的其他监听函数被调用，阻止了事件的传播

### Event.composedPath()

返回一个数组，成员是事件的最底层节点和一次冒泡经过的所有上层节点

```javascript
// HTML 代码如下
// <div>
//   <p>Hello</p>
// </div>
var div = document.querySelector('div');
var p = document.querySelector('p');

div.addEventListener('click', function (e) {
  console.log(e.composedPath());
}, false);
// [p, div, body, html, document, Window]
```













