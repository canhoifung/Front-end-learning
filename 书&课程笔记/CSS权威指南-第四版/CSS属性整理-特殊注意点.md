# 字体

## `font-weight`

1. 每个数字对应的权重至少和前面的数字具有相同的`font-weight`
2. 一般400对应normal，700对应bold
3. 若有比Medium更细的字体可以分配给400，此时Medium分配给500；若只有一个Medium变体，则分配给400
4. 若字体族中字重少于9个，用户代理所作的工作：
   1. 若500未分配，则与400对应字重一样
   2. 若300未分配，将其对应于比400细的变体，若无则和400一样。200和100同理
   3. 若600未分配，将其对应于比500黑的变体，若无则和500一样。700、800和900同理
5. `bolder`会先确定父元素继承的`font-weight`，然后选择比继承的字重高一级的最小数字，若无则将字重设为下一个数字值，直到900。
   1. 由于字重分配的原因，`bolder`和父元素为`bold`的视觉效果可能一致，但是字重可能不一样
   2. 若父元素为`light`，则子元素的`bolder`对应字型可能是`normal`，不一定是`bold`

# 字号

1. 不同换算系数的绝对定位大小：

   | 关键字   | CSS1 | CSS2 | CSS3 |
   | -------- | ---- | ---- | ---- |
   | xx-small | 5px  | 9px  | 10px |
   | x-small  | 7px  | 11px | 12px |
   | Small    | 11px | 13px | 14px |
   | Medium   | 16px | 16px | 16px |
   | Large    | 24px | 19px | 19px |
   | x-large  | 36px | 23px | 24px |
   | xx-large | 54px | 28px | 32px |

2. 但是换算系数用户代理可以调整

3. 相对定位大小换算系数和绝对定位一样

4. 字号的相对值没有上下限

5. ==字号继承的是计算得到的值，而不是百分数本身==

6. 设定的`font-size`*（`font-size-adjust`/字体的高宽比值）=== 调整后的`font-size`

# 文本

1. `white-space`属性区别：

   | 值       | 空白 | 换行符 | 自动换行 |
   | -------- | ---- | ------ | -------- |
   | pre-line | 折叠 | 保留   | 允许     |
   | normal   | 折叠 | 忽略   | 允许     |
   | nowrap   | 折叠 | 忽略   | 禁止     |
   | pre      | 保留 | 保留   | 禁止     |
   | pre-warp | 保留 | 保留   | 允许     |

2. `word-break`属性区别：

   | CCJK值    | 非CJK        | CJK          | 是否断字 |
   | --------- | ------------ | ------------ | -------- |
   | noraml    | 照常         | 照常         | 是       |
   | break-all | 任何字符之后 | 任何字符之后 | 否       |
   | keep-all  | 照常         | 序列两侧     | 是       |

# 视觉可视化

1. `border-box`：
   1. content-box：默认值，盒子不包含内边距和边框
   2. border-box：盒子包含内边距和边框
2. margin-left + border-left + padding-left + width + padding-right + border-right + margin-right = 父元素width
   1. 其中可以设为auto的只有margin和width，其他的不设置具体值则默认为0
   2. 因此若margin-left、margin-right和width有设为auto，其他的值需要自适应到符合上述公式
   3. 若三个值都设置了固定值，则为**过约束**，margin-right将会强制设为auto，会被强制设置为符合算式的值，即总和不能小于或大于父元素width，必须相等
   4. 若三个值都设置了auto，margin为0，width为全宽
   5. 若margin-left或margin-right其中之一和width设置了auto，设置了auto的margin会为0，
   6. 以上公式为content-box下，若为border-box则删除padding和border
   7. 若为块级置换元素（例如img），若width设为auto，则等于内容本身的宽度，且height会随width按比例变化，除非明确设定了height
3. 纵向高度上，margin-top或margin-bottom设为auto，会自动计算为0
4. 若为百分数高度，百分数是相对于框体的容纳块高度而言，因此若容纳块高度为auto，则百分数高度无效，自动计算为auto
5. 若height：auto，其高度为：
   1. 子代为块级元素，默认高度=最上边块级子元素的上边框外侧 到 最下边块级子元素的下边框外侧之间
   2. 块级元素有内边距或边框，高度=最上边子元素的上外边距外边界 到 最下边子元素的下外边距的外边界之间
6. 纵向外边距会折叠，显示较大的外边距
7. 若两个相邻外边距为负值，取其中绝对值较大的，然后从正外边距中减去它的绝对值作为外边距
8. 对于行内非置换元素：
   1. 内容区高度为font-size值
   2. 行距为line-height和font-size的差值
   3. 行内框高度=内容区高度+行距
   4. 行框高度 = 各行内框的最高点和最低点之间的距离
9. 对于行内非置换元素的盒模型：
   1. 因为边框边界由font-size控制，因此边框不影响行框
   2. 因为内边距不影响font-size，既不影响内容区高度，因此也不会影响行框
   3. 由于外边距透明，且不会影响到行框，因此上下外边距不会有视觉效果，但左右外边距会有效果，可以通过`box-decoration-break`属性控制断行效果
10. 对于行内置换元素：
    1. 行内置换元素的高度不影响行中任何元素（包括置换元素本身）的行高
    2. 行内框高度=内容+外边距+边框+内边距
    3. 与基线对齐对的是外边距边界
    4. 宽度则会有影响
11. `display:inline-block`，将元素当作置换元素进行格式化，处理行为相当于处理行内置换元素，在外部作为行内元素，在内部作为块级元素内容，且可以使用块级元素的css属性
    1. 可用于为元素设置宽高（行内非置换元素无法设置宽高）

# 内边距、边框、轮廓、外边距

1. `padding`内容规则：
   + 若没有针对左边的，就使用针对右边的值
   + 若没有针对底边的，就使用针对顶边的值
   + 若没有针对右边的，就使用针对顶边的值
   + 若为百分比，则相对于父元素内容区的宽度计算（若相对自身，则父元素也会变化，会陷入循环）
2. `border`规则：
   + 若`border-style:none`，则边框不存在，不管`border-width`是多少
   + 而`border-style`默认值就是`none`
   + 给`border-radius`给固定数值接近圆，而给百分比值则接近圆角
   + `border-radius`也可以设置四个值，规则和padding的一致
   + `border-radius`设置复杂圆角的方式：`border-radius:3ch/1ch`，斜线前为横向半径，斜线后为纵向半径，上述写法等价于：`border-radius:3ch 3ch 3ch 3ch/1ch 1ch 1ch 1ch`，斜线前后分别对应
   + 单独设置单边radius时，若提供两个值，则默认一个为横向半径，一个为纵向半径，不一定需要斜线来划分，当然也可以有斜线
   + `border-image-slice`针对的是边框背景图片，而`border-image-width`针对的是边框本身
   + 若`border-image-width`为数值，则表示`border-width`的倍数
   + 若`border-image-outset`为数值，同样表示`border-width`的倍数
   + `border-image`简写方法，必须按照指定的顺序排列**裁剪、宽度、偏移**，其余的source和repeat可以写在任何位置
3. `outline`规则：
   1. 轮廓不占空间、不一定是矩形、通常用于在：focus时渲染轮廓、无法设置单边
4. `margin`规则：
   1. 和`padding`一致，若为百分数，是相对于父元素内容区的宽度进行计算

# 颜色、背景和渐变

1. `background-position`规则：
   1. 若为百分数，比如`background-position:30% 70%`意为找到元素上横向位置为30%、纵向位置为70%的点，和图片横向位置为30%、纵向位置为70%的点对应
   2. 若百分数只有一个，默认为横向偏移，且纵向偏移默认为50%
   3. 若为长度数值，则用图像左上角和声明的点对齐
   4. 可以使用最多四个关键字来指定偏移位置，如：`background-position:left 30% top 30%`，此时若方向偏移量为0，可以忽略偏移量，但是边界关键字不能忽略，且此时不固定横向纵向的排序顺序
2. `background-repeat`规则：
   1. 若有两个值，第一个表示横向，第二个表示纵向
   2. 若只有一个值，表示横纵向都按照这个分配
   3. 若设置为`space`：
      1. 若某个方向上只能出现一次，出现位置根据该方向上`background-position`来判断
      2. 若某个方向上出现多次，忽略该方向上`background-position`的值
   4. 若设置为`round`，则分为两种情况
      1. 源图像放在四个角上，会拉伸图像进行填充
      2. 源图像并不是在四个角上，图像仍然会缩放，但是可能会被裁剪
   5. `space`和`round`是根据相对背景定位区域决定的，即`background-origin`的值
3. `background-size`规则：
   1. 若为`auto`：
      1. 若一个轴尺寸为auto，另一个不是，且图像有宽高比，则会根据宽高比计算
      2. 若一个轴尺寸为auto，另一个不是，且图像无宽高比，但有尺寸信息，那么设置为auto的那一个轴将会设为固有尺寸信息
      3. 若以上都没有执行，auto将解析为100%
   2. 使用`cover`和`contain`的图像，限定区域为`background-origin`定义的区域
4. `background`规则：
   1. `size`必须紧跟在`position`后面，且二者要以斜线隔开
   2. 若同时为`origin`和`clip`提供值，第一个作为`origin`，第二个作为`clip`
   3. 若只提供一个值，则同时设定`origin`和`clip`
   4. 可以设置不止一个背景层，但`color`只会出现在最后一个背景层中
   5. 除了`color`和`image`外，若`image`和其他属性不匹配，其他属性会自动从第一个开始进行重复，直至补全
5. `linear-gradiant`规则：
   1. 若<color-stop>的定位点在比前一个的定位点要小，则设为前一个定位点的位置
   2. 梯度线确定规则：若为关键字指定，则经过图像的中点将声明的两个角的两个相邻角连起来，梯度线与该线垂直
   3. 即比如梯度线方向为`top right`，并不是指向图像的右上角，而是指向右上象限
6. `radial-gradient`规则：
   1. 若为圆，梯度射线终点为尺寸值
   2. 若为椭圆，梯度射线重点为横轴尺寸值
   3. 若为圆，且尺寸为0，规定圆的半径为大于0的特别特别小的值，即渐变仍然是圆形，不过可能看不到
   4. 若为椭圆，若宽度为0，将椭圆的高度当作特别大的值，将宽度当作比0大的特别小的值
      1. 则宽度为0时，显示效果为纵向对称的横向线性渐变
      2. 若高度为0，得到的结果会是纯色



# 浮动及其形状

1. 浮动元素的容纳块是最近的块级祖辈元素
2. 浮动元素的左右边距不能超过容纳块的左右内边界
3. 行内框和浮动元素重叠时，其边框背景内容都在浮动元素之上渲染
4. 块级框和浮动元素重叠时，边框背景在浮动元素背后渲染，内容在前面渲染
5. `shape-outside`设置区域超出浮动框会被裁减

# 定位

1. `position:absolute`时，容纳块为最近的`position`非`static`的祖辈元素，且：
   1. 若祖辈为块级，容纳块为其内边距边界
   2. 若祖辈为行内，容纳块为其内容边界
   3. 若无祖辈，容纳块为初始容纳块
2. `position:absolute`，且除`bottom`之外的某个偏移属性为auto时：
   1. 顶边与假设定位元素`position:static`时的顶边对齐
   2. 左右类似顶边规则
3. 紧接规则2，对于非置换元素：
   1. width和height设为auto意为自动缩放，自动包裹内容
   2. 需要满足left + right + margin-left + border-left + padding-left + width + padding-right + border-right + margin-right = 容纳块宽度
   3. 对于从左向右书写的语言，若不满足规则2，且全部是固定值，会自动将right设为auto，若纵向尺寸过约束了，则bottom的值会被自动计算
4. 紧接规则2，对于置换元素：
   1. width和height设为auto，则由元素内容的内在宽高决定具体宽高
   2. 对从左向右的语言，若left为auto，则为静态位置
   3. 若无法为静态位置仍然为auto，则margin-left的auto为0
   4. 若margin-left和margin-right的值仍为auto，将二者设为相等
   5. 若还有一个属性为auto，修改为满足等式的值
   6. 若过约束，同规则3第四点
5. 对相对定位而言，若偏移过约束，则将一个定位视为另一个定位的相反数，如bottom=-top，right=-left，需要考虑书写顺序，以上情况为从左到右书写时

# 弹性盒布局

1. `display:flex`或`display:inline-flex`
2. `flex-direction:column`中`column`指当前书写模式下块级元素的移动方向，如英语中为纵轴，在日语中指横轴
3. `flex-direction:row`指按照文本方向即书写模式布置弹性元素，因此不需要考虑文本是从左到右还是从右到左，row会自动转换弹性方向
4. 若设置了min-height、min-width、max-height、max-width、width、height等属性，则`align-items:stretch`无效
5. 对`align-items`的设置，要考虑元素的外边距
6. `align-items:baseline`时，取在弹性元素行中，基线 和 垂轴起边那一侧 的 外边距边界 距离最远的弹性元素，然后将这个元素的 外边距外边界 和 弹性元素行的垂轴起边 对齐，其他弹性元素的基线和此时选中的弹性元素基线重合
7. `align-content:stretch`时，额外空间会平均分给各个行
8. 对于绝对定位的弹性元素，会从文档流中移除，但是初始定位仍然受`justify-content`和`align-self`影响，而浮动则不会有任何效果
9. 对于弹性元素本身设置的`flex`，若grow和shrink都为0，且basis为指定值，则表示元素不能扩大或缩小，此时主轴上的尺寸，width或者height的设置将会被忽略，哪怕使用了`!important`
10. 最好使用`flex`而不是单独使用`flex-grow`、`flex-shrink`、`flex-basis`
11. `flex-grow`为增长因子，为弹性元素基础空间排布后，多余的空间根据设置的这个属性进行按比例分配
12. 若`flex`没有设定增长因子和缩减因子，此时增长因子默认为==1==，若`flex`和`flex-grow`都没有进行声明，则增长因子默认为==0==
13. 若`flex`显式将弹性基准设为0%，或默认为0%，且增长因子为0，弹性元素在主轴上的长度将缩小为内容允许的最小长度，实现==包裹==效果
14. 若弹性元素溢出，且没有显式设定`min-width`，则弹性元素的最小宽度为 容下内容所需的最小宽度 和 声明的width或height 中的较小值
15. 若所有弹性元素弹性基准设为0%，且都允许增大，那么所有空间根据增长因子确定的比例分配，忽略设定的`width`
16. 不声明`flex`时，`flex-basis`默认为auto，只有额外空间按比例分配，若声明了`flex`，此时`flex-basis`默认为0%，所有空间都按比例分配
17. `flex-shrink`规则类似`flex-grow`，不过默认为1而不是0
18. 若弹性元素的内容不能换行，且不能在主轴方向上缩小，这是弹性元素会尽可能缩小到内容宽度，余下的应缩小空间会由其他可缩小弹性元素进行按比例分配
19. 缩小空间计算规则与扩大空间不同，缩小比例=缺少的空间 / ( ( 宽度1 × 缩减因子1) + （ 宽度2 × 缩减因子2 ) + .....)
20. `flex-basis`的优先级高于`width`，但`max-width`等的优先级高于`flex-basis`
21. `flex-basis:auto`时，弹性容器的尺寸根据多出来的空间进行按比例分配；`flex-basis:0%`时，弹性容器的尺寸根据弹性容器的全部空间进行按比例分配
22. `flex:initial`等价于`flex:0 1 auto`
23. `flex:auto`等价于`flex:1 1 auto`
24. `flex:none`等价于`flex: 0 0 auto`
25. `flex:<number>`等价于`flex: <number> 0 0`

# 栅格布局

1. `display:grid`或`display:inline-grid`
2. 栅格容器不是块级容器，如其不会移动到浮动元素下方，且外边距不与后代外边距折叠
3. 若栅格容器是浮动或绝对定位的，则对其设置`display:inline-grid`将会被解析为`display:grid`
4. 使用方式：`grid-template-rows:[name1 name2] 200px [name3 name4] minmax(3em,4em) [name5] min-content max-content minmax(0,max-content)`
5. `minmax(a,b)`中若最大值比最小值小，则最大值被忽略，且最小值不能使用`fr`单位
6. 弹性栅格容器，分配行列使用单位`fr`，可与其他单位搭配使用
7. 还可以设置值为`fit-content()`，规范给出的伪公式为：

```javascript
fit-content(argument) => min(max-content, max(min-content, argument));
```

8. 以上公式等价于`minmax(min-contetn, max-content)`，除非参数指定的值设置了更大的上限，类似`max-width`
9. 设置重复轨道：`repeat(num,length)`，其中`length`可以不止一个值
10. repeat的自动重复模式：`repeat(auto-fill, length)`
11. 自动重复模式2：`repeat(auto-fit, length)`，但这个模式会剔除没有栅格元素的轨道，剔除后剩余轨道按照`align-content`和`justify-content`的值进行处理
12. `gird-template-areas`区域只支持矩形，无法为L型或其他形状
13. `grid-row-start`等属性的`span`值后跟正整数，意为向确定了编号的栅格线的反方向计数
14. 若栅格元素超出了显式定义的栅格，超出部分为隐式栅格，需要注意使用`span`的话计算时是从显示栅格部分开始延伸，但不一定要在显示栅格部分结束
15. `grid-area`属性顺序：`row-start`/`column-start`/`row-end`/`column-end`，缺少的值分别行列对应位置，若`start`为名称，则`end`为对应名称，若为数值，则为`auto`
16. `grid-row-gap`和`grid-column-gap`值为非负数，且栏距要计算入`fr`的计算中
17. 外边距为正时，元素可见部分在栅格区域中向内收缩，同理为负时向外伸展
18. 外边距不影响栅格尺寸即`fr`的计算
19. `algn-self`的`left`和`right`视作`start`处理
20. `*-self:stretch`只有当`width`或`height`设为`auto`时才有效

# 表格布局

1. 指`display`值为`table`、`inilne-table`、`table-row`、`table-row-group`、`table-header-group`、`table-footer-group`、`table-column`、`table-column-group`、`table-cell`、`table-caption`

2. ```css
   talbe { display : table };
   tr { display : table-row }；
   thead { display : table-header-group };
   tbody { display : table-row-group };
   tfoot { display : table-footer-group };
   col { display : table-column };
   colgroup { display : table-column-group };
   td, th { display : table-cell };
   caption { display : table-caption };
   ```

3. 特殊属性设置：

   1. `border`：仅当`border-collapse:collapse`时，才能为列和列组设置边框
   2. `background`：仅当单元格及所在行背景为透明才显示列和列组的背景
   3. `width`：定义的是列和列组的最小宽度，根据单元格内容有可能会迫使列变宽
   4. `visibility`：若`visibility:collapse`，则列或列组的单元格不渲染，跨列的单元格会被裁剪
   
4. 对象插入规则：

   1. 若`table-cell`元素的父元素不是`table-row`，在`table-cell`及其父元素之间插入一个匿名`talbe-row`对象，该对象包含`table-cell`元素及其全部后续同辈元素
   2. 若`table-row`元素的父元素不是`talbe`、`inline-talbe`、`table-row-group`，在`table-row`元素及其父元素之间插入一个匿名`talbe`元素，插入对象包含`table-row`元素及其全部后续同辈元素
   3. 规则2对于`talbe-column`元素同样
   4. 若`table-row-group`、`table-header-group`、`table-footer-group`、`table-column-group`、`table-caption`元素的父元素不是`table`，则在该元素及其父元素之间插入一个匿名`table`对象
   5. 若`table`、`inline-table`的子元素不是`table-row-group`、`table-header-group`、`table-footer-group`、`table-row`、`table-caption`，在`table`元素及其子元素之前插入一个匿名`table-row`对象，插入的对象包含除了以上五种以外的全部后续同辈元素
   6. 若`table-row-group`、`table-header-group`、`table-footer-group`的子元素不是`table-row`，在他们与子元素之间插入一个匿名`table-row`对象，该对象包含了子元素的全部后续同辈元素
   7. 若`table-row`的子元素不是`table-cell`，在其与子元素之间插入一个匿名`table-cell`，该对象包含子元素的全部后续同辈元素（该规则涵盖匿名行内框-如没有元素名的文本）
   
5. 表格层级关系，单元格>行>行组>列>列组>表格

6. 在分离边框模式中，即`border-collapse:separate`，为行、行组、列、列组设置的边框将被忽略，同时`border-spacing`只能在表格声明

7. 在折叠单元格模式中，即`border-collapse:collapse`：

   1. table元素不能有内边距，可以有外边距
   2. 行、行组、列、列组可以设置边框
   3. 单元格之间边框没有间距
   4. 边框折叠规则：
      1. `border-style:hidden`的边框优先级最高，这个位置上的边框会被隐藏
      2. 除规则1外，更宽的边框优先级更高
      3. 若宽度相同但式样不同，优先级从大到小为：double、solid、dashed、dotted、ridge、outset、groove、inset、none
      4. 若宽度样式都相同，但颜色不同，颜色优先级从高到低：单元格、行、行组、列、列组、表格，若类型相同，在从左向右书写的语言中取距离顶部和左边较远的边框

8. 在固定宽度布局，即`table-layout:fixed`中：

   1. 若列元素的`width`非`auto`，则设定为整列宽度
   2. 若列元素的`width:auto`，若该列第一行的单元格的`width`非`auto`，则单元格宽度为整列宽度，若单元格跨列，则均分宽度
   3. 若非情况1、2，则列宽度将自动确定，并尽可能保持各列宽度相等
   4. 处理情况1、2、3后，表格宽度将由表格的`width`和列总宽中较大的决定

9. 在自动宽度布局，即`table-layout:auto`中：

   1. 计算一列中每一个单元格的最小宽度和最大宽度
      1. 最小宽度即可换行但不能超出单元格框，若设置了`width`且比最小宽度大，则`width`为最小宽度
      2. 最大宽度即除强制换行情况外不换行的情况下显示内容所需的宽度
   2. 计算各列的最小宽度和最大宽度
      1. 最小宽度=列中单元格最小宽度的最大值，若列显式设置了`width`且比最小宽度大，则`width`为最小宽度
      2. 最大宽度=列中单元格最大宽度的最大值，若列显式设置了`width`且比最大宽度大，则`width`为最大宽度
   3. 若单元格跨列，涉及那几列的最小宽度之和=单元格的最小宽度，最大宽度之和=单元格的最大宽度
   4. 若表格的`width`非`auto`，表格最终宽度为这个`width`和每一列宽度之和+边框+单元格间距的较大值，若设置的`width`更大，则差值均分给各列
   5. 若表格的`width:auto`，最终宽度=列宽度+边框+间距

10. 表格的`height`更像是`min-height`

# 列表和生成的内容

1. `list-style-tpye`适用于`display:list-item`的元素上
2. `list-style-type:none`只是不显示记号，但不会阻断有序列表的计数
3. `::before`或`::after`选择符的目标为：
   1. 块级元素，那么`display`只能为none、inline、block、marker，其余都视为block
   2. 行内元素，那么`display`只能为none、inline，其余都视为inline
4. `content`用法：
   1. 可以通过这样插入属性值：`a[href]::after {content: “ [" attr(href) "]";}`，若属性不存在则为空字符串
   2. `content:open-quote`和`content:close-quote`配合`quotes`属性使用
   3. 若嵌套层级较多，`quotes`可以重复两个为一组的开头结尾引号内容，使用`open-quote`、`close-quote`时会调用对应层级的引号
5. 可使用`@counter-style <name>`定义新的`list-style`值（浏览器不一定支持）

# 变形

