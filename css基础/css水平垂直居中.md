# 水平居中

## 方案一
```css
margin:0 auto;   //  上下边距为0,左右边距相同
```
1. 对于块级元素,需要设置其宽度
2. 对于行内元素,需要设置`display:block;`并设置其宽度
3. 若元素宽度不定,默认与父元素宽度一样,此时将子元素`display:inline;`并在父元素添加`text-align:center`实现居中
3. 可以对块内元素设置`text-align:center`实现内联元素的水平居中
## 方案二 使用定位属性
设置父元素为相对定位，再设置子元素为绝对定位，设置子元素的`left:50%`，即让子元素的左上角水平居中
1. 定宽度的情况下.设置绝对子元素的` margin-left: -元素宽度的一半px;` 或者设置`transform: translateX(-50%)`
2. 不定宽度的情况下.利用css3新增属性`transform: translateX(-50%);`
```html
<style>
    #father {
        width: 500px;
        height: 300px;
        background-color: skyblue;
        position: relative;
}
    #son {
        width: 100px;
        height: 100px;
        background-color: green;
        position: absolute;
        left: 50%;
        margin-left: -50px;  //或使用  transform:translateX(-50%)
}
</style>
<div id="father">
    <div id="son">我是块级元素</div>
</div>
```
## 方案三 使用flex布局
待处理的块状元素的父元素添加属性 `display: flex; justify-content: center`
```html
<style>
    #father {
        width: 500px;
        height: 300px;
        background-color: skyblue;
        display: flex;
        justify-content: center;
    }
    #son {
        width: 100px;
        height: 100px;
        background-color: green;
    }
</style>
<div id="father">
    <div id="son">我是块级元素</div>
</div>
```
# 垂直居中

## 行内元素

### 单行行内元素

行高等于盒子的高
```html
<style>
    #father {
        width: 500px;
        height: 300px;
        background-color: skyblue;
    }
    #son {
        background-color: green;
        height: 300px;
    }
</style>
<div id="father">
    <span id="son">我是单行的行内元素</span>
</div>
```
### 多行行内元素
给父元素设置`display:table-cell;`和`vertical-align: middle;`即可；
```html
<style>
    #father {
        width: 500px;
        height: 300px;
        background-color: skyblue;
        display: table-cell;
        vertical-align:middle;
    }
    #son {
        background-color: green;
    }
</style>
<div id="father">
    <span id="son">我是多行的行内元素我是多行的行内元素我是多行的行内元素我是多行的行内元素我是多行的行内元素我是多行的行内元素我是多行的行内元素我是多行的行内元素</span>
</div>
```
## 块级元素

### 方案一 使用定位属性

父元素为相对定位，再设置子元素为绝对定位，设置子元素的`top: 50%`，即让子元素的左上角垂直居中；
1. 定高度,设置绝对子元素的 `margin-top: -元素高度的一半px;` 或者设置`transform: translateY(-50%);`
2. 不定高度,设置`transform: translateY(-50%);`
```html
<style>
    #father {
        width: 500px;
        height: 300px;
        background-color: skyblue;
        position: relative;
}
    #son {
        height: 100px;
        background-color: green;
        position: absolute;
        top: 50%;
        margin-top: -50px;
}
</style>
<div id="father">
    <div id="son">我是块级元素</div>
</div>
```
### 方案二 使用flex布局
给待处理的块状元素的父元素添加属性 `display: flex;` `align-items: center;`
```html
<style>
    #father {
        width: 500px;
        height: 300px;
        background-color: skyblue;
        display: flex;
        align-items: center;
    }
    #son {
        width: 100px;
        height: 100px;
        background-color: green;
    }
</style>
<div id="father">
    <div id="son">我是块级元素</div>
</div>
```
# 水平垂直居中
## 已知宽度和高度
### 使用定位属性
1. 设置父元素为相对定位，给子元素设置绝对定位，`top: 0; right: 0; bottom: 0; left: 0; margin: auto;`
```html
<style>
    #father {
        width: 500px;
        height: 300px;
        background-color: skyblue;
        position: relative;
}
    #son {
        width: 100px;
        height: 100px;
        background-color: green;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        margin: auto;
}
</style>
<div id="father">
    <div id="son">我是块级元素</div>
</div>
```
2. 设置父元素为相对定位，给子元素设置绝对定位，`left: 50%; top: 50%; margin-left: --元素宽度的一半px; margin-top: --元素高度的一半px;`
```html
<style>
    #father {
        width: 500px;
        height: 300px;
        background-color: skyblue;
        position: relative;
}
    #son {
        width: 100px;
        height: 100px;
        background-color: green;
        position: absolute;
        left: 50%;
        top: 50%;
        margin-left: -50px;
        margin-top: -50px;
}
</style>
<div id="father">
    <div id="son">我是块级元素</div>
</div>
```
## 未知高度和宽度
### 方案一 使用定位属性
设置父元素为相对定位，给子元素设置绝对定位，`left: 50%; top: 50%; transform: translateX(-50%) translateY(-50%);`
```html
<style>
    #father {
        width: 500px;
        height: 300px;
        background-color: skyblue;
        position: relative;
}
    #son {
        background-color: green;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translateX(-50%) translateY(-50%);
}
</style>
<div id="father">
    <div id="son">我是块级元素</div>
</div>
```
### 方案二 使用flex布局

设置父元素为flex定位，`justify-content: center; align-items: center;`
```html
<style>
    #father {
        width: 500px;
        height: 300px;
        background-color: skyblue;
        display: flex;
        justify-content: center;
        align-items: center;
}
    #son {
        background-color: green;
}
</style>
<div id="father">
    <div id="son">我是块级元素</div>
</div>
```