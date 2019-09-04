### 1.子标签 同级标签 父标签

| 子标签 | 同级标签 | 父标签 |
| ------ | -------- | ------ |
| >      | +        | ^      |

例如`div>p+p^div`表示div下有子标签p，p有同级标签p，且p还有一个父级标签的同级标签div，效果如下：

```html
<div>
    <p></p>
    <p></p>
</div>
<div></div>
```

###　2.为元素设置属性、值

| 属性 | 值   | class | id   |
| ---- | ---- | ----- | ---- |
| []   | {}   | .     | #    |

例如`div.abc[title=666 index=1]{123}`效果为

```html
<div class='abc' title='666' index='1'>123</div>
```

### 3.重复某个标签多次使用*

例如`div*2`效果为

```html
<div></div>
<div></div>
```

### 4.自动计数使用$

例如`div.abc$*2`效果为

```html
<div class='abc1'></div>
<div class='abc2'></div>
```

若生成两位数则用$$以此类推，同时可以使用@修饰符更改编号方向（升序或降序，默认升序）与基数（如起始值），@-表示降序，@+表示升序，@N表示起始值从N开始，例如：

```html
ul>li.item$@-*3
=>
<ul>
    <li class="item3"></li>
    <li class="item2"></li>
    <li class="item1"></li>
</ul>
---------------------------
ul>li.item$@-10*3
=>
<ul>
    <li class="item12"></li>
    <li class="item11"></li>
    <li class="item10"></li>
</ul>
```



### 5.分组操作符

例如`div>(ul>li+span)>a`与`div>ul>li+span>a`不一样

若加了括号效果为：a与括号内的内容同级

```html
<div>
    <ul>
        <li></li>
        <span></span>
    </ul>
    <a href=""></a>
</div>
```





