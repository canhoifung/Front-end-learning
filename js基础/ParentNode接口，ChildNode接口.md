# ParentNode接口，ChildNode接口

[TOC]

## ParentNode接口

若当前节点为父节点，就会继承`ParentNode`接口

只有元素节点、文档节点和文档片段节点拥有子节点，因而会继承`ParentNode`接口

### `ParentNode.children`

返回一个`HTMLCollection`实例，成员是当前节点的所有元素子节点

属性只读

为动态集合

### `ParentNode.firstElementChild`

返回当前节点的第一个元素子节点

若无则返回`null`

### `ParentNode.lastElementChild`

返回当前节点的最后一个元素子节点

若无则返回`null`

### `ParentNode.childElementCount`

返回一个整数，表示当前节点的所有元素子节点的数目

若无则返回`0`

### `ParentNode.append()`、`ParentNode.prepend()`

`append`为当前节点追加一个或多个子节点，位置为最后一个元素子节点的后面

`prepeng`为当前节点追加一个或多个子节点，位置为第一个元素子节点的前面

> 可以添加文本子节点和元素子节点

无返回值

## ChildNode接口

### `ChildNode.remove()`

用于从父节点移除当前节点

```javascript
el.remove()
```

### `ChildNode.before()`、`ChildNode.after()`

`before`用于在当前节点的前面，插入一个或多个同级节点

`after`用于在当前节点的后面，插入一个或多个同级节点

> 可以插入文本节点和元素节点

### `ChildNode.replaceWith()`

使用参数节点，替换当前节点

可以是元素节点或文本节点























































