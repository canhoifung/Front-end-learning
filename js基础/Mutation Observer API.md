# Mutatin Observer API

[TOC]

用于监听DOM变动，DOM发生变动就会触发Mutation Observer事件

但这个是异步触发，要等到所有DOM操作都结束才会触发

+ 将DOM变动记录封装为数组进行处理，而不是一条条单独个别处理
+ 可以监测DOM所有类型变动，也可以指定只监测某一类变动

## 构造函数

```javascript
var observer = new MutationObserver(callback);
```

`callback`回调函数会在每次DOM变动后调用，接收两个参数：

1. 变动数组
2. 观察器实例

## 实例方法

### observe()

用于启动监听

两个参数：

1. 所要观察的DOM节点

2. 一个配置对象，指定所要观察的特定变动

   有以下几种：

   + childList:子节点变动
   + attributes:属性变动
   + characterData:节点内容或节点文本变动

   还有以下的属性设置：

   - `subtree`：布尔值，表示是否将该观察器应用于该节点的所有后代节点
   - `attributeOldValue`：布尔值，表示观察`attributes`变动时，是否需要记录变动前的属性值
   - `characterDataOldValue`：布尔值，表示观察`characterData`变动时，是否需要记录变动前的值
   - `attributeFilter`：数组，表示需要观察的特定属性（比如`['class','src']`）

```javascript
var article = document.querySelector('article');

var  options = {
  'childList': true,
  'attributes':true
} ;

observer.observe(article, options);
```

对同一个节点添加多个观察器，以最后添加的为准

### disconnect()

用于停止观察器

### takeRecords()

用于清除变动记录

不再处理未处理的变动，返回变动记录的数组

```javascript
// 保存所有没有被观察器处理的变动
var changes = mutationObserver.takeRecords();

// 停止观察
mutationObserver.disconnect();
```

## MutationRecord对象

每次DOM变化就会生成一条MutationRecord实例

Mutation Observer处理的就是MutationRecord实例所组成的数组

对象包含了DOM的相关信息：

- `type`：观察的变动类型（`attributes`、`characterData`或者`childList`）。
- `target`：发生变动的DOM节点。
- `addedNodes`：新增的DOM节点。
- `removedNodes`：删除的DOM节点。
- `previousSibling`：前一个同级节点，如果没有则返回`null`。
- `nextSibling`：下一个同级节点，如果没有则返回`null`。
- `attributeName`：发生变动的属性。如果设置了`attributeFilter`，则只返回预先指定的属性。
- `oldValue`：变动前的值。这个属性只对`attribute`和`characterData`变动有效，如果发生`childList`变动，则返回`null`。

## 实例

### 子元素变动

```javascript
var callback = function (records){
  records.map(function(record){
    console.log('Mutation type: ' + record.type);
    console.log('Mutation target: ' + record.target);
  });
};

var mo = new MutationObserver(callback);

var option = {
  'childList': true,
  'subtree': true
};

mo.observe(document.body, option);
```



### 属性变动

```javascript
var callback = function (records) {
  records.map(function (record) {
    console.log('Previous attribute value: ' + record.oldValue);
  });
};

var mo = new MutationObserver(callback);

var element = document.getElementById('#my_element');

var options = {
  'attributes': true,
  'attributeOldValue': true
}

mo.observe(element, options);
```

### 取代DOMContentLoaded事件

由于网页加载的时候DOM节点生成会产生变动记录，因此观测DOM变动就可以触发相关事件，不需要DOMContentLoaded事件

```JavaScript
var observer = new MutationObserver(callback);
observer.observe(document.documentElement, {
  childList: true,
  subtree: true
});
```

监听DOM生成的函数：

```javascript
(function(win){
  'use strict';

  var listeners = [];
  var doc = win.document;
  var MutationObserver = win.MutationObserver || win.WebKitMutationObserver;
  var observer;

  function ready(selector, fn){
    // 储存选择器和回调函数
    listeners.push({
      selector: selector,
      fn: fn
    });
    if(!observer){
      // 监听document变化
      observer = new MutationObserver(check);
      observer.observe(doc.documentElement, {
        childList: true,
        subtree: true
      });
    }
    // 检查该节点是否已经在DOM中
    check();
  }

  function check(){
  // 检查是否匹配已储存的节点
    for(var i = 0; i < listeners.length; i++){
      var listener = listeners[i];
      // 检查指定节点是否有匹配
      var elements = doc.querySelectorAll(listener.selector);
      for(var j = 0; j < elements.length; j++){
        var element = elements[j];
        // 确保回调函数只会对该元素调用一次
        if(!element.ready){
          element.ready = true;
          // 对该节点调用回调函数
          listener.fn.call(element, element);
        }
      }
    }
  }

  // 对外暴露ready
  win.ready = ready;

})(this);

// 使用方法
ready('.foo', function(element){
  // ...
});
```













