# Document节点

[TOC]



`document`节点对象代表了整个文档

不同的获取`document`节点方法：

- 正常的网页，直接使用`document`或`window.document`。
- `iframe`框架里面的网页，使用`iframe`节点的`contentDocument`属性。
- Ajax 操作返回的文档，使用`XMLHttpRequest`对象的`responseXML`属性。
- 内部节点的`ownerDocument`属性。

`document`对象继承了`EventTarget`接口、`Node`接口、`ParentNode`接口

## 属性

### 快捷方式属性

指向文档内部的某个节点的快捷方式

#### `document.defaultView`

返回`document`对象所属的`window`对象

若当前文档不属于`window`对象，则返回`null`

#### `document.doctype`

指向`<DOCTYPE>`节点，即文档类型节点

同时为`document`对象的第一个子节点

若无则返回`null`

```javascript
var doctype = document.doctype;
doctype // "<!DOCTYPE html>"
doctype.name // "html"
```

#### `document.documentElement`

返回当前文档的根元素节点

通常是`document`节点的第二个子节点

对HTML一般是`<html>`

#### `document.body`、`document.head`

分别指向`<body>`、`<head>`节点

且可写  如果改写它们的值相当于移除所有子节点

#### `document.scrollingElement`

返回文档的滚动元素，即当文档整体滚动时，到底是哪个元素在滚动

标准模式下，返回`document.documentElement`，即`<html>`

兼容模式下，返回`<body>`

若不存在，则返回`null`

#### `document.activeElement`

返回获得当前焦点的DOM元素

通常返回`<input>`、`<textarea>`、`<select>`等表单元素

若没有焦点元素，返回`<body>`或`null`

#### `document.fullscreenElement`

返回当前以全屏状态展示的DOM元素

若不是全凭状态，则返回`null`

```javascript
//判断是否全屏
if (document.fullscreenElement.nodeName == 'VIDEO') {
  console.log('全屏播放视频');
}
```

### 节点集合属性

会返回一个`HTMLColection`实例

动态的





















































































