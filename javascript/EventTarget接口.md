# EventTarget接口

DOM的事件操作都定义在这个接口。

## EventTarget.addEventListener()

```javascript
target.addEventListener(type,listener[, useCapture]);
```

+ type：事件名称，对大小写敏感
+ listener：监听函数，传入的参数为event
+ useCapture：布尔值，表示监听函数是否在捕获阶段触发，默认为false。可选

```javascript
function hello() {
  console.log('Hello world');
}

var button = document.getElementById('btn');
button.addEventListener('click', hello, false);
```

listener除了监听函数外还可以是一个具有``handleEvent`方法的对象

```javascript
buttonElement.addEventListener('click', {
  handleEvent: function (event) {
    console.log('click');
  }
});
```

第三个参数除了useCapture外还可以是一个属性配置对象，具有以下属性：

+ capture：布尔值，表示该事件是否在捕获阶段触发监听函数
+ once：布尔值，表示监听函数是否只触发一次
+ passive：布尔值，false表示监听函数不会调用事件的`preventDefault`方法（若调用了浏览器会忽略这个请求并输出警告），为ture表示监听函数调用了

> 这是由于监听函数执行是需要时间的，而浏览器是不知道监听函数内部有没有preventDefault的，就会等待监听函数执行完毕，再执行默认行为，有时会导致页面卡顿，此时添加一个passive就能当浏览器知道这个监听有没有禁止默认行为，为true的话即使监听函数内有禁止默认行为的动作也无效，浏览器会直接在两个线程同时执行监听函数和默认行为



对同一个对象的同一个事件的不同监听函数，按照添加顺序先添加先触发

对同一个对象的同一个事件的相同监听函数，只触发一次，多余的会被自动去除



监听函数内部的`this`指向事件所在的对象

```javascript
// HTML 代码如下
// <p id="para">Hello</p>
var para = document.getElementById('para');
para.addEventListener('click', function (e) {
  console.log(this.nodeName); // "P"
}, false);
```

## EventTarget.removeEventListener()

用于移除`addEventListener`方法添加的事件监听函数

```javascript
div.addEventListener('click', listener, false);
div.removeEventListener('click', listener, false);
```

参数必须与`addEventListener`一致

其中

```javascript
div.addEventListener('click', function (e) {}, false);
div.removeEventListener('click', function (e) {}, false);
```

这种情况由于监听函数不是同一个，因此无效

## EventTarget.dispatchEvent()

在当前节点上触发指定事件或自定义事件

若监听函数调用了`Event.preventDefault()`，则返回false，否则返回true

参数是一个`Event`对象实例

```javascript
para.addEventListener('click', hello, false);  //绑定监听
var event = new Event('click');  //创建实例
para.dispatchEvent(event);      //触发事件
```

## Event()

`event = new Event(typeArg,eventInit)`

1. typeArg：表示创建事件的名称
2. eventInit：为一个对象，接受以下字段：
   + bubbles：可选，布尔值，默认false，表示该事件是否冒泡
   + cancelable：可选，布尔值，默认false，表示该事件能否被去取消
   + composed：可选，布尔值，默认false，表示该事件是否会在影子DOM根节点之外触发监听器

```javascript
// 创建一个支持冒泡且不能被取消的look事件

var ev = new Event("look", {"bubbles":true, "cancelable":false});
document.dispatchEvent(ev);

// 事件可以在任何元素触发，不仅仅是document
myDiv.dispatchEvent(ev);
```



> 冒泡：即一个元素接收到了事件，将这个事件传给父级元素，比如父div包含了子div，子div接收到了点击事件会同时触发父div的点击事件，即冒泡



























