## 2020.02.17-2020.02.18

看《Head First HTML与CSS》 复习HTML知识

1. 相对路径，用`../`表示上行到上一层父文件夹
2. `<br>`和`<img>`等void元素
3. `<q>`和`<blockquote>`都表示引用
   + `<q>`为内联元素，表示小段文本引用
   + `<blockquote>`为块元素，表示大段文本引用，其内可以放置其他内联元素

## 2020.02.19

看《Head First HTML与CSS》 复习HTML知识

1. `<a>`为内联元素，尽量不要用于包裹如`<div>`等块元素 [判断原因看这里](https://www.zhihu.com/question/34952563?sort=created)
2. 页面设计原则 ==**==
   + 先设计大的块元素
   + 再用内联元素完善
3. 其他元素 `<code>` `<pre>`

## 2020.02.20

看《Head First HTML与CSS》 复习HTML知识

1. 托管公司+域名购买
2. 通过FTP  File Transfer Protocol   文件传输协议  将文件传送到Web服务器 
3. HTTP   HyperText Transfer Protocol   超文本传输协议
4. URL    Uniform Resource Locators   统一资源定位符
5. 协议告诉服务器通过什么方式查找资源    网站告诉浏览器去往哪个服务器寻找资源    绝对路径告诉服务器需要寻找哪个资源

## 2020.02.24

1. 若网址无详细地址，则会返回当前选择目录下的默认文件  通常为==index.html==或==default.htm== 取决于托管公司使用的服务器
   + 注意是==default.htm== 而不是html
   + 还有可能是其他默认名 如使用脚本生成页面的==index.php==
   
2. 若请求网站末尾无==/==，浏览器会默认添加

3. 从本地获取文件使用==file==协议，且会有三==/== 
   
   + 类似URL中直接链接到对应地址，http的两个==/==加上域名后的一个==/==，总计三个
   
4. 端口：http://www.mydoain.com:8000/index.html
   + 默认端口为80，如果配置在另外一个不同的端口接受请求则另外说明
   + URL地址等于一个房间，而端口则是进入房间的门 通过不同的门接受不同的信息

5. `<a title='title test'>title</a>` a标签的title属性

6. 锚点

   + 网页1：index.html

   ```html
   <h2 id='test'>
       aaaaa
   </h2>
   ```

   ​	网页2：

   ```html
   <a href='index.html#test'>链接到h2的内容</a>
   ```
   
   + 同网页锚点
   
   ```html
   <h2 id ='test'>
       top
   </h2>
   <a href='#test'>buttom to top</a>
   ```
   
7. `tittle`属性不止在`<a>`元素中可以使用，其余元素也可以，起工具提示作用

8. `<a>`的`target`属性：
   + 若无`target`属性，则在同一窗口中打开
   + 若`target = _blank`，则在新窗口中打开
   + 若`target = test`，则所有target为test的链接都会在同一个窗口中打开
     + `target = name`，name等于告诉浏览器应该使用哪个窗口打开该链接，_blank为特殊情况，意为总是打开新窗口

9. gif&png格式图片，适合用于logo和文本图像

   JPEG擅长照片，但有损

   PNG可以设置任意颜色透明，透明区域更圆滑且无损

10. `<img src='logo.gif' alt='test'>` alt属性用于在图片无法显示时以文本形式告知用户内容

## 2020.02.25

1. 如何告知浏览器页面编写使用的html版本：

   `<!doctype html>` ，意为告知浏览器页面编写使用的是HTML5版本
   
2. 如何告知浏览器页面编写所使用的编码：

   `<meta charset='utf-8'>` 标准统一使用Unicode字符编码



## 2020.03.02

1. 对CSS，`<p>`中有`<a>`的话，调整`<p>`的文本颜色并不会影响到`<a>`中的文本颜色

2. 外部CSS使用`<link type='test/css' rel='stylesheet' href='a.css'>`

3. 如果一个元素在CSS文件中被多个选择器选择，则使用特定级的

   （比如`p`和`p.test`，就是采用的`p.test`的）

   若多个选择器同级，则采用在CSS规则中最靠后的

4. 五个字体系列及特点：

   1. Sans-serif：无衬线的字体，外观清晰，可读性好
   2. serif：有衬线的字体，常用于新闻报纸的文字排版，高雅传统
   3. Monospace：字体字符固定宽度，类似打字机打出来的，常用于软件代码示例
   4.  Cursive：类似手写的字体，有趣有风格，有时用于标题
   5. Fantasy：包含某种风格的装饰性字体，有趣有风格

## 2020.03.09

1. Web字体常用格式：
   + TrueType字体：`.ttf`
     + IE8前不支持
   + OpenType字体：`.otf`
     + otf建立在ttf的基础上，要更新
   + Embedded OpenType字体：`.eot`
     + 仅IE提供支持
   + SVG字体：`.svg`
   + Web开放字体格式：`.woff`
     + 建立在ttf的基础上，基本已经成为字体标准
     + IE8前不支持

2. 在CSS的`body{}`之上添加`@font-face`属性

   ```css
   @font-face{
       font-family:'Emblema One';
       src:url('http://www.a.com/EmblemaOne.woff'),
           url('http://www.a.com/EmblemaOne.ttf');
   };
   
   
   h1{
       font-family:'Emblema One',sans-serif;
   }
   ```

3. 给`body`指定一个关键字尺寸，控制页面默认字体大小，其他元素使用`em`或百分数   从而页面可以整体实现字体大小变化

4. ==**==`em`指父元素的字体尺寸，不要用在宽高的设置上

## 2020.03.15

1. 若要同时获得下划线和上划线，需要这样写：

   ```css
   em{
       text-decoration:underline overline;
   }
   ```

   而不是：

   ```css
   em{
       text-decoration:underline;
   }
   em{
       text-decoration:overline;
   }
   ```

2. 背景图像设置属性：

   + `background-image:url(...gif)`
   + `background-repeat:no-repeat`
   + `background-position:top left`

3. 媒体查询：

   ```css
   @media screen and (min-device-width:481px){}
   @meadia print{}
   ```

   或者：

   ```html
   <link href='loung-mobile.css' rel='stylesheet' media='screen and (max-device-width:480px)'>
   ```




## 2020.03.29

1. `text-align` 并不知针对文本，可以将块元素内的所有内联元素对齐，且只能设定在块元素上，否则无效
2. `text-align`能将div中块元素的布局改变是由于它们继承了div元素的`text-align`属性

3. `margin`、`padding` 可以简写

   ``background` 、`border`、可以简写 顺序不重要

   `font: font-style font-variant font-weitht font-size/line-height font-family`

   （font-style font-variant font-weight 这三个顺序不重要 但是需要在font-size前面）

## 2020.04.01

1. 链接伪类 `:link` `:visited` `:hover` `:focus` `active`

2. CSS选择器优先级：先优先作者>用户>浏览器  再根据下面进行排序

   1. 包含id  +100
   2. 包含类或伪类  +10
   3. 包含元素  +1

   





















































