# 水平垂直居中

```html
<div class="center-wrap">
    <div class="logo"></div>
</div>
```

```css
.center-wrap {
    position: relative;
    background-color: #1f2022;
    height: 200px;
}
```

## 绝对定位、且目标宽高已知

```css
.logo {
    position: absolute;
    width: 160px;
    height: 100px;
    top: 50%;
    left: 50%;
    margin-top: -50px;
    margin-left: -80px;
    background-color #5b83fd;
}
```

## 绝对定位、且不在乎目标宽高

```css
.logo {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #5b83fd;
}
```

## flexbox布局，不在乎目标宽高，要注意IE浏览器

```css
.center-wrap {
    display: flex;
    justify-content: center;
    align-items: center;
}
```

# 水平居中

```html
<div class="center-wrap">
    <div class="logo"></div>
</div>
```

## 调节margin，适用于block元素，脱离文档流即失效

```css
.logo {
    width: 160px;
    height: 100px;
    margin: 0 auto;
    background-color: #5b83fd;
}
```

## flex布局，注意IE浏览器

```css
.center-wrap {
    display: flex;
    justify-content: center;
    background-color: #282c34;
    height: 140px;
}
```

## transform，对宽高无要求，可用于脱离文档流元素

```css
.logo {
    position: absolute;
    padding: 10px;
    left: 50%;
    transform: translate(-50%, 0);
    background-color: #5b83fd;
}
```

## inline-bolck+text-align

```css
.content-wrap {
    position: relative;
    background-color: #282c34;
    height: 140px;
    text-align: center;
}
.logo {
    display: inline-block;
    background-color: #5b83fd;
    padding: 10px;
}
```

# 两列（左宽度固定，右宽度自适应）

```html
<div class="content-wrap">
    <div class="left"></div>
    <div class="right"></div>
</div>
```

## 左浮动定宽，右margin-left

```css
.content-wrap {
    background-color: #282c34;
    height: 100px;
}

.left, .right {
    height: 100%;
}

.left {
    float: left;
    width: 140px;
    background-color: #5b83fd;
}

.right {
    margin-left: 140px;
    background-color: #F7B500;
}
```

## 左浮动定宽，右overflow

```css
.content-wrap {
    background-color: #282c34;
    height: 100px;
}

.left, .right {
    height: 100%;
}

.left {
    float: left;
    width: 140px;
    background-color: #5b83fd;
}

.right {
    overflow: hidden;/*用于清除浮动*/
    background-color: #FA6400;
}
```

## flexbox

```css
.content-wrap {
    display: flex;
    height: 100px;
    background-color: #282c34;
}
.left {
    height: 100%;
    width: 140px;
    background-color: #5b83fd;
}
.right {
    height: 100%;
    flex: 1;
    background-color: #6DD400;
}
```

# 三列布局

```html
<div class="content-wrap">
    <div class="left">Left</div>
    <div class="mid">Mid</div>
    <div class="right">Right</div>
</div>
```

## 左中固定右边自适应

overflow：

```css
.left {
    float: left;
    width: 140px;
    background-color: #5b83fd;
}
.mid {
    float: left;
    width: 100px;
    background-color: #FA6400;
}
.right {
    overflow: hidden;
    background-color: #F7B500;
}
```

float:

```css
.left {
    float: left;
    width: 140px;
    background-color: #5b83fd;
}
.mid {
    float: left;
    width: 100px;
    background-color: #FA6400;
}
.right {
    margin-left: 240px;
    background-color: #F7B500;
}
```

## 两边固定，中间自适应

==html写法改变==

```html
<div class="content-wrap">
    <div class="mid-wrap">
        <div class="mid">Mid</div>
    </div>
    <div class="left">Left</div>
    <div class="right">Right</div>
</div>
```

```css
.left, .right, .mid-wrap {
    height: 80%;
    float: left;
}

.left {
    width: 140px;
    background-color: #FA6400;
    margin-left: -100%;
}
.mid-wrap {
    height: 100%;
    width: 100%;
    background-color: #5b83fd;
}
.mid {
    background-color: #6DD400;
    padding-left: 140px;
    padding-right: 80px;
    height: 80%;
}
.right {
    width: 80px;
    background-color: #F7B500;
    margin-left:  -80px;
}
```

