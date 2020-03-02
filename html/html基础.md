# html基础

[TOC]

注释 `<!-- 这是一个注释 -->`
## 头部 `<head>`
头部元素包含关于文档的概要信息,也成为元信息.  
1. `<title>` 定义了浏览器工具栏的标题及网页被收藏时显示在收藏夹中的标题及显示在搜索引擎结果页面的标题
2. `<base>`  描述基本的链接地址/链接目标  作为HTML文档中所有链接标签的默认链接
```html
<base href="http://www.baidu.com" target="_blank">
此时其余链接以href的url为基准使用相对路径,且不加说明下默认添加 target="_blank"
```
3. `<link>`  定义文档与外部资源间的关系 常用于链接样式表
4. `<style>`  定义HTML文档样式
5. `<meta>`  提供元数据,不显示在页面上但会被浏览器解析
6. `<script>`  加载脚本文件
## 标题 `<h1>-<h6>`

h1-h6 字体大小依次递减  **浏览器自动在标题前后添加空行**
## 段落 `<p>-</p>`
在`</p>`后进行换行 **相当于有一换行符**  
## 链接`<a>...</a>`
空链接
```html
<a href="#">链接文字</a>  //点击后会返回页面顶部
<a href="javascript:void(0)">  //点击后不会返回页面顶部
```
使用target属性
```html
<a href="#" target="_blank">在新窗口打开</a>
<a href="#" target="_top">跳出框架在整个窗口打开</a>
<a href="#" target="_self">在当前页面打开</a>
```
插入ID
```html
<a id="tips">TIPS</a>
<a href="#tips">访问TIPS</a>
<!-- 从另一个页面创建链接至tips -->
<a href="存放含有tips id的html地址">Visit</a>
```
### 绝对路径 相对路径
<html>
  <table>
      <tr>
            <td>绝对路径</td>
            <td>完整的从盘符开始的路径</td>
     </tr>
      <tr>
            <td rowspan="3">相对路径</td>
            <td>../表示源文件所在目录的上一级目录</td>
     </tr>
     <tr><td>../../表示源文件所在目录的上上级目录</td></tr>
     <tr><td>./表示目前所在目录</td></tr>
  </table>
</html>

## 图像`<img>`
```html
<img src="url" alt="some_text">
```
alt属性用于为图像定义预备的可替换文本,当浏览器无法载入图像时显示文本
## 表格 `<table>`
```html
<table> 
	<th>表头</th>
	<th>表头</th>
	<tr>
		<td>第一行第一列</td>
		<td>第一行第二列</td>
	</tr>
	<tr>
		<td colspan="2">行跨两格</td>
	</tr>
	<tr>
		<td rowspan="2">列跨两格</td>
		<td></td>
	<tr>
	<tr>
		<td></td>
	</tr>
</table>
```
<html>
<table> 
	<th>表头</th>
	<th>表头</th>
	<tr>
		<td>第一行第一列</td>
		<td>第一行第二列</td>
	</tr>
	<tr>
		<td colspan="2">行跨两格</td>
	</tr>
	<tr>
		<td rowspan="2">列跨两格</td>
		<td></td>
	</tr>
	<tr><td></td></tr>
</table>
</html>

## 列表
1. 无序列表 `<ul>`
2. 有序列表 `<ol>`
```html
	<ol type="A">  <!--也可以为a i I-->
		<li>A</li>
		<li>B</li>
	</ol>
```
3. 自定义列表 `<dl>`
  ```html
  <dl>
  	<dt>A</dt>
  	<dd>b</dd>
  	<dd>c</dd>
  </dl>
  ```
## 区块

1. `<div>`块级元素
2. `<span>` 内联元素
## 表单`<form>`
**单选按钮等的value静态页面不显示但是用于提交后台,因此必须写value**
1. 文本域 `<input type="text" name="" value="">` <input type="text" value="文本框">
2. 密码 `<input type="password" name="">` <input type="password" value="请输入密码">
3. 单选按钮 `<input type="radio" name="" value="">` <input type="radio" name="test" value="单选按钮">单选按钮
4. 复选框 `<input type="checkbox" name="" value="">`
<input type="checkbox" name="test" value="多选按钮">多选按钮1<input type="checkbox" name="test" value="多选按钮">多选按钮2
5. 提交按钮 `<input type="submit" name="" value="submit">` <input type="submit" name="test" value="submit">
```html
<form name="input" action="a.php" method="get">  action定义了当点击提交按钮后表单内容会传送到哪一个文件
	username:<input type="text" name="user:><input type="submit" value="submit">
</form>
```
6. 普通按钮 `<input type="button" value="" onclick="">` <input type="button"  value="可用于onclick绑定函数" onclick="">
## 框架`<iframe>`

规定一个内联框架,用于在当前HTML文档中嵌入另一个文本框,显示另外的页面
`<iframe src="url" name="" width="" height="" frameborder='"></iframe>`

## HTML字符实体

| 显示结果 | 描述 | 实体名称 | 实体编号 |
| ------- | ---- | ------- | ------- |
| &nbsp; | 空格| `&nbsp;`|` &#160;` |
|<|小于号|`&lt;`|`&#60;`|
|>|大于号|`&gt;`|`&#62;`|
|&|和号|`&amp;`|`&#38;`|
|"|引号|`&quot;`|`&#34;`|
|'|撇号 |`&apos;` (IE不支持)|`&#39;`|
|￠|分（cent）|`&cent;`|`&#162;`|
|£|镑（pound）|`&pound;`|`&#163;`|
|¥|元（yen）|`&yen;`|`&#165;`|
|€|欧元（euro）|`&euro;`|`&#8364;`|
|§|小节|`&sect;`|`&#167;`|
|©|版权（copyright）|`&copy;`|`&#169;`|
|®|注册商标|`&reg;`|`&#174;`|
|™|商标|`&trade;`|`&#8482;`|
|×|乘号|`&times;`|`&#215;`|
|÷|除号|`&divide;`|`&#247;`|

## 文本格式化标签
```html
<b>加粗</b>  <i>斜体</i>  <sub>下标</sub>  <sup>上标</sup>
```
## URL 
即Uniform Resource Locators 统一资源定位器
```
例子:http://www.baidu.com/html/html-test.html
语法规则:scheme://host.domain:port/path/filename
```

|  | 定义 |
| --- | ---- |
|scheme|定义因特网服务类型,最常见为http|
|host|定义域主机(http的默认主机为www)|
|domain|定义因特网域名|
|:port|定义主机上的端口(http默认端口号80)|
|path|定义服务器上的路径|
|filename|定义文档/资源的名称|

| scheme |       访问        |             用于             |
| ------ | ---------------- | ---------------------------- |
| http   | 超文本传输协议     | 以http://开头的普通网页,不加密 |
| https  | 安全超文本传输协议 | 安全网页,加密所有信息交换      |
| ftp    | 文件传输协议      | 用于将文件下载或上传至网站     |
| file   |                  | 本人计算机上的文件             |

## `<hr>`

形成一条横线,但其定义为故事走向的转变或话题的转变,若没这两个关系,应使用css的border来形成视觉效果的横线

## 引述

1. blockquote : 表示段落级引述内容
2. q : 表示行内的引述内容
3. cite : 表示引述的作品名