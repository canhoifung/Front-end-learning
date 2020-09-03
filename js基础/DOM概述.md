# DOM概述

[TOC]

DOM，即Document Object Model

## 节点

即DOM的最小组成单位

节点类型有七种：

- `Document`：整个文档树的顶层节点
- `DocumentType`：`doctype`标签（比如`<!DOCTYPE html>`）
- `Element`：网页的各种HTML标签（比如`<body>`、`<a>`等）
- `Attribute`：网页元素的属性（比如`class="right"`）
- `Text`：标签之间或标签包含的文本
- `Comment`：注释
- `DocumentFragment`：文档的片段

浏览器提供的原生节点对象`Node`，以上七种节点都继承了`Node`，因而具有一些共同的属性和方法

## 节点树

`document`节点，代表整个文档

文档第一层有两个节点：

1. 文档类型节点 `<!doctype html>`
2. HTML网页的顶级容器标签 `<html>`

`<html>`标签构成了树结构的根节点，其余HTML标签节点都是其下级节点



除根节点外，其余节点的层级关系：

+ 父节点关系（parentNode）：直接的那个上级节点
+ 子节点关系（childNodes）：直接的下级节点
+ 同级节点关系（sibling）：拥有同一个父节点的节点





















