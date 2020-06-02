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

5. `<a title='title test'>title</a>` a标签的title属性，鼠标悬停时显示title

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

   `background` 、`border`、可以简写 顺序不重要

   `font: font-style font-variant font-weitht font-size/line-height font-family`

   （font-style font-variant font-weight 这三个顺序不重要 但是需要在font-size前面）

## 2020.04.01

1. 链接伪类 `:link` `:visited` `:hover` `:focus` `active`

2. CSS选择器优先级：先优先作者>用户>浏览器  再根据下面进行排序

   1. 包含id  +100
   2. 包含类或伪类  +10
   3. 包含元素  +1


## 2020.04.04

1. 如果两个内联元素并排放置，他们的==间距==为两者==外边距之和==

2. 如果两个块元素上下放置，他们的==间距==为两者==最大的外边距高度==

3. 如果一个元素嵌套在另一个元素中，他们的==垂直外边距==相碰，也会发生折叠，如果外面的元素==有边框==就不会发生折叠

4. 居中布局：

   ```css
   .test{
       margin-left:auto;
       margin-right:auto;
   }
   ```

   当设为`auto`时，浏览器会根据需要扩展内容，左右同时设定会保证左右外边距相等，因此实现居中

5. 使用绝对定位来实现两栏布局时，如果有页脚的话由于绝对定位的存在页脚内容可能会被覆盖

### float

1. 浮动元素必须规定宽度
2. 设置浮动后，浮动元素会从流中删除，所以块级元素会==填在其下方==，但是块级元素中的内联元素会考虑浮动元素的边界，==围绕浮动元素布局==
3. `clear:right`，不允许块元素右侧有浮动元素，可以用于如页脚单独置于页面最低  不围绕浮动元素
4. 可以浮动内联元素比如图像

### 凝胶布局

处于流体布局（html正常布局）和冻结布局（给定body内的所有元素一个div固定宽高）之间

可以实现两栏布局：

+ 主内容`float:left`
+ 右边栏内容流动布置  设置`margin-left`实现两个内容块之间的边框
+ body内弄一个大的`div`，设置css：`width:400px; margin-left:auto; margin-right:auto`实现固定宽度居中
+ 有页脚的话需要设置`clear:left`清除左边浮动

## 2020.04.12

### table

```html
<div id='tableContainer'>
    <div id='tableRow'>
        <div id='main'>
            //..
        </div>
        <div id='sidebar'>
            //..
        </div>
    </div>
</div>
```

```css
div#tableContainer{
    display:table;
    border-spacing:10px; //边框间距 替代外边距
}
div#tableRow{
    display:table-row;
}

#main{
    display:table-cell;
}
#sidebar{
    display:table-cell;
}
```

1. `border-spacing`，边框间距不会和外边距重叠



### fixed定位

对于浏览器窗口进行定位



## 2020.04.13

1. HTML5语义化标签：

   + `<header>`
   + `<footer>`
   + `<section>`
   + `<aside>`
   + `<article>`
   + `<nav>`
   + 等

2. `<time>`标签

   `<time datetime="2020-04-13">13/4/2020</time>`

   标准格式为：`2020-04-13 22:09:55Z`

   可以只指定年、年月、年月日、年月日时分、时分  最后的Z为时区，有TZD

## 2020.05.05

1. `<video>`

   ```html
   <video controls     //设置了播放器会提供控件用于控制视频或音频播放
          autoplay     //设置了会让视频自动播放
          width='512' height='288'
          src='video/video.mp4'
          poster='images/video_poster.png'  //视频海报
          id='video'>
   </video>
   ```

   其他属性：

   + preload：设置为`none`则用户播放前不下载视频；设置为`metadata`则下载视频元数据（比如时长），不下载视频内容；设置为`auto`则由浏览器做决定

     设置了autoplay则会忽略这个属性

   + loop：设置了就会循环播放

   ==*==设置了width，height的话视频仍然会保持原始宽高比，多余空间会用黑边填充

2. 视频编码

   一个视频文件包括了音频编码和视频编码两部分

   主流三种视频格式：

   1. WebM：Vp8视频编码+Vorbis音频编码
   2. MP4：H.264视频编码+AAC音频编码
   3. Ogg：Theora视频编码+Vorbis音频编码

   

   提供多种格式的视频以便浏览器选择：

   ```html
   <video width='512' height='288'>
   	<source src='video/video.mp4'>
   	<source src='video/video.webm'>
   	<source src='video/video.ogv'
                type='video/ogg ; codecs="thoera,vorbis"'
               //      视频文件MIME类型     视频编解码器，音频编解码器
               //    用于为浏览器提供帮助决定是否可以播放这个文件，提高效率
               >
       <p>
           your browser 不支持
       </p>
   </video>
   ```

### table标签

`<caption>`标题，要作为table下第一个元素

`<tr>`表示行

`<td>`表示列

`<th>`表示表头



## 2020.05.23  P610-645

### table标签2.0

1. 表格单元格也有内容、内边距、边框，但是外边距由`border-spacing`替代，表示单元格之间的空间

   ==*==`border-spacing`不能设定特定单元格，而是所有单元格公有的设置

2. `border-collapse:collapse;`，这个CSS设置可以忽略表格设置的所有边框间距，将他们合并在一起

3. nth-child伪类：

   ```css
   p:nth-child(even){}; //偶数p
   p:nth-child(odd){}; //奇数p
   ```

4. `rowspan`设置单元格跨行

   `colspan`设置单元格跨列

5. table内的td可以嵌套table

## 2020.05.25 P645-666

1. 表单工作流程：

   浏览器--表单打包数据--web服务器--通过服务器脚本处理--返回HTML页面作为响应--浏览器显示响应HTML页面

2. 表单元素：`<form>`

   ```html
   <form action='https://www.test.com/test/test.php' method="POST">
       
   </form>
   ```

   test.php为处理数据的服务器脚本文件名

3. 表单元素

   ```html
   <input type='text' name='fullname' maxlength="20">
   //文本输入框
   <input type="passwor" name="secret">
//密码输入框
   ```
   
   ```html
   <input type="submit" value="Submit Now">
//提交按钮
   ```
   
   ```html
   <input type="radio" name="radiochose" value="radio">
//与一组给定选项关联的单选按钮必须有相同的name，可以有不同的value
   ```
   
   ```html
<input type="checkbox" name="checkboxchose" value="check">
   ```
   
   ```html
   <textarea name="comments" rows="10" cols"48"></textarea>
//开始和结束标签之间的文本会作为初始文本
   ```
   
   ```html
   <select name="characters">
       <option value="apple">Apple</option>
       <option value="banana">Banana</option>
</select>
   ```
   
   ```html
   //HTML5元素 若不支持就显示普通文本输入框
   <input type="number" min="0" max="20">
   //限制只能输入数字的输入框
   <input type="range" min="10" max="20" step="5">
   //滑块
   <input type="color">
   //颜色输入
   <input type="date">
   //日期选择控件
   <input type="email">
   //在部分移动浏览器上，会得到一个方便输入email的定制键盘
   <input type="url">
   //同上，在部分移动浏览器中获得方便输入url的定制键盘
   <input type="tel">
//同上
   ```

   ==*==提交表单时，浏览器会使用name来打包所有数据  因此都要添加上name的属性
   
   ​	

## 2020.05.26 P666-700

1. ```html
   <input type="radio" name="test" checked value="test">
   //添加checked属性默认选中
   ```

2. POST请求：打包表单变量，在后台将它们发送到服务器；

3. GET请求：打包表单变量，记那个它们追加到URL的最后，然后向服务器发送一个请求

4. `<label>`元素，标记标签，让页面提供更好的页面结构

   ```html
   <input type="radio" name="hotornot" value="hot" id="hot">
   <label for="hot">hot</label>
   <input type="radio" name="hotornot" value="not" id="not">
   <label for="not">not</label>
   ```

   ==**==`<label>`标签中的for要对应表单的id

   ==*==标签放表单控件前后并没有关系

5. `<fieldset>`用于将表单控件组织在一起，`<legend>`为一组表单提供标签

   ```html
   <fieldset>
       <legend>
           Condiments
       </legend>
       <input type="radio" name="hotornot" value="hot" id="hot">
       <label for="hot">hot</label>
       <input type="radio" name="hotornot" value="not" id="not">
       <label for="not">not</label>
   </fieldset>
   ```

6. ```html
   <input type="file" name="doc">
   //文件输入
   ```

   只能使用post

7. ```html
   <select name="characters" multiple>
       <option></option>
   </select>
   ```

   多选下拉菜单

8. `placeholder`属性，输入内容提示语

   ```html
   <input type="text" placeholder="请输入名字">
   ```

9. `required`属性，用于指示一个域是必要的，若为空则无法提交表单

## 2020.05.27 P701-完

1. 开发商特定CSS属性：

   如：`-moz-transform`，类似的还有：

   + `-webkit-`  safari和chrome
   + `-moz-`  Mozilla
   + `-o-`    opera
   + `-ms-`  IE

2. CSS变换：通过`transform`属性

3. CSS过度：通过`transition`属性

   使用方法如：

   ```css
   div{
       width:100px;
       transition:width 2s;
   }
   div:hover{
       width:300px;
   }
   ```

   























