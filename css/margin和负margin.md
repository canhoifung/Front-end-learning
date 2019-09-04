# 垂直外边距合并
当两个垂直外边距相遇时,它们将形成一个外边距,合并后的外边距的高度等于两个发生合并的外边距的高度中的较大者.  

当一个元素包含在另一个元素中时,如果没有内边距或边框把外边距分隔开),它们的外边框会重合.
```html
<style>
.top{width:160px; height:50px; background:#ccf;}
.middle{width:160px; background:#cfc;}
.middle .firstChild{margin-top:20px;}
</style>
<body>
<div class="top"></div>
<div class="middle">
  <div class="firstChild">我其实只是想和我的父元素隔开点距离。</div>
</div>
//会发生合并,要解决就需要在父元素中添加border-top或padding-top
```
# 用Margin还是Padding
1. 使用Margin:  
需要在border外侧添加空白;空白处不需要背景色;上下相连的两个盒子之间的空白需要相互抵消时.  
15px+20px的margin,将得到20px的空白
2. 使用Padding:
需要在border内侧添加空白;空白处需要背景色;上下相连的两个盒子之间的空白,希望等于两者之和时.  
15px+20px的padding,将得到20px的空白
```
margin是用来隔开元素与元素的间距；
padding是用来隔开元素与内容的间隔。
margin用于布局分开元素使元素与元素互不相干；
padding用于元素与内容之间的间隔，让内容（文字）与（包裹）元素之间有一段“呼吸距离”
```

# 负Margin
对于`margin-top`和`margin-left`,为负值时,会将元素**向上或向左**移动,甚至会覆盖上方或左方元素内容;  
对于`margin-bottom`和`margin-right`,为负值时,本元素**位置不变**,会将**相邻元素**(下方元素或右方元素)向上或向左移动,甚至会覆盖本元素内容  
```
可以使用与自适应布局
```
当元素没有设置`width`或`width:auto`时`margin-left`和`margin-right`会**增加元素宽度**  
对于static的元素,不会影响其文档流  

