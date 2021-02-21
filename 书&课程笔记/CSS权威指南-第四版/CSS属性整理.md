# 导入CSS方法

1. `<link rel="stylesheet" type="text/css" href="sheet1.css">`
2. `<style type='text/css'> @import url(sheet2.css) </style>`
3. 备用CSS：`<link rel='alternate stylesheet' title='test' href='sheet2.css'>`

# 媒体查询

+ `link`的`media`属性
+ `style`的`media`属性
+ `@import`的媒体描述符部分
+ `@media`的媒体描述符部分

媒体类型：all | print | screen 

媒体查询逻辑关键字：and | not | only

描述符：width | min-width | max-width | device-width | min-device-width | max-device-width |

​					height | min-height | max-height | adevice-height | min-device-height | max-device-height |

​					aspect-ratio | min-aspect-ratio | max-aspect-ratio | device-aspect-ratio | min-device-aspect-ratio | max-device-aspect-ratio |

​					color | min-color | max-color |

​					color-index | min-color-index | max-color-index |

​					monochrome | min-monochrome | max-monochrome

​					resolution | min-resolution | max-resolution

​					orientaion | scan | grid 

# 特性查询

+ `@supports`

特性查询逻辑关键字：and | not | or

# 选择器

分组选择器：`div,p`

通配选择器：`*`

类选择器：`.testclass`

id选择器：`#testid`

属性选择器：

+ 简单属性选择器：`h1[class]`

+ 准确属性值选择器：`h1[class='test']`

+ 部分匹配属性选择器：

  + 带有对应属性且属性内容包含对应单词：`[foo~="bar"]`

    如：`<h1 foo="test bar">`

  + 带有对应属性且属性内容包含对应单词子串：`[foo*="bar"]`

    如：`<h1 foo="testbar">`

  + 带有对应属性且属性内容开头为对应单词：`[foo^="bar"]`

    如：`<h1 foo="bar test">`

  + 带有对应属性且属性内容结尾为对应单词：`[foo$="bar"]`

    如：`<h1 foo="test bar">`

  + 带有对应属性且属性内容开头为对应单词且后接一个短线（U+002D）或属性内容就是对应单词：`[foo|="bar"]`

    如：`<h1 foo="bar-test">`或`<h1 foo="bar">`
    
  + 忽略大小写：`[foo='bar' i]`

    如：`<h1 foo="BaR">`


后代选择器：`div p`

子代选择器：`div>p`

紧邻兄弟选择器：`h1+p`

兄弟选择器：`h1~p`

伪类选择器：

+ 根元素选择器：`:root`
+ 空元素选择器：`p:empty`
+ 唯一子元素选择器：`img:only-child`
+ 兄弟唯一元素类型选择器：`img:only-of-type`
+ 选择第一个子元素：`p:first-child`
+ 选择最后一个子元素：`p:last-child`
+ 选择第一个特定类型的元素：`p:first-of-type`
+ 选择最后一个特定类型的元素：`p:last-of-type`
+ 选择第n个元素：`p:nth-child(n)`
  + 选择偶数行个元素：`p:nth-child(even)`===`p:nth-child(2n)`
  + 选择奇数行个元素：`p:nth-child(odd)`===`p:nth-child(2n-1)`
+ 倒数开始选择第n个元素：`p:nth-last-child(n)`
+ 选择第n个特定类型的元素：`p:nth-of-type(n)`、`p:nth-last-of-type(n)`
+ UI状态伪类：
  + 可用：`p:enabled`
  + 禁用：`p:disabled`
  + 选中：`input:checked`
  + 未选中：`input:not(:checked)`
  + 非checked或unchecked由DOM脚本或用户代理设置的未选中或取消选中：`input:indeterminate`
  + 初始选中：`input:default`
  + 必填项：`input:required`
  + 非必填项：`input:optional`
  + 数据合法：`input:valid`
  + 数据非法：`input:invalid`
  + 数据处于min和max内：`input:in-range`
  + 数据超出min或max：`input:out-of-range`
  + 可读写：`input:read-write`
  + 非可读写：`input:read-only`
+ 选择锚点元素：`p:target`
+ 选择特定语言规则元素：`p:lang(no)`
+ 否定选择器：`:not()`
+ 动态伪类选择器：
  + 未激活状态：`a:link`
  + 点击后状态：`a:visited`
  + 获得焦点状态：`a:focus`
  + 悬停状态：`a:hover`
  + 点击状态：`a:active`

伪元素选择器：

+ 选择元素的第一个字母：`p::first-letter`
+ 选择元素的第一行：`p::first-line`
+ 选择元素前：`p::before`
+ 选择元素后：`p::after`

# 优先级

每个CSS优先级可以视为`0,0,0,0`

+ 每个ID属性值，添加`0,1,0,0`
+ 每个类属性值、属性选择、伪类，添加`0,0,1,0`
+ 每个元素和伪元素，添加`0,0,0,1`
+ 组合和通用选择器不影响优先级
+ 每个内联声明，添加`1,0,0,0`
+ `!important`最优先
+ 继承值无优先级

层叠样式表优先级：

+ author > reader > user agent
+ `!important`reader >> ererything

# 属性值类型

+ Keywords
+ Global keywords：inherit | initial | unset 
+ Strings：<string>
+ URLs：`url()`
+ Images：<image>
+ 标识符：<identifier>
+ Numbers：<integer> | <number> | <percentage> | 
+ Frequencies：<number> + [ Hz | kHz ]
+ Times：<number> + [ s | ms ]
+ Angles：<number> + [ deg | grad | rad | turn ]
+ Length values：
  + Absolute：in | cm | mm | pt | pc
  + Relative：em | rem | ex | ch | px | vw | vh | wm
+ Color values：#RRGGBB | #RGB | rgb(rrr,ggg,bbb) | rgb(rrr.rr%,ggg.gg%,bbb.bb%) | rgba(rrr,ggg,bbb,a) | <keywords> | currentColor | transparent | hsl(h,s,l)

# 字体

`@font-face{}`：

+ `font-family`：<string>
+ `src`：
  + `local()`-可选
  + `url()`-必须
  + `format()`-可选
+ `unicode-range`
+ `font-weight` | `font-style` | `font-stretch` | `font-variant` 

`font-family`：serif | sans-serif | monospace | cursive | fantasy

`font-weight`：100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | lighter | normal | bold | bolder

`font-size`：xx-samll | x-small | small | medium | large | x-large | xx-large | <length> | <percentage>

`font-size-adjust`：<number> | none | auto

`font-style`：normal | italic | oblique

`font-stretch`：normal | ultra-condensed | extra-condensed | condensed | semi-condensed | semi-expanded | expanded | extra-expanded | ultra-expanded 

`font-kerning`：auto | normal | none

`font-variant`：normal | small-caps

`font-feature-settings`：normal | <feature-tag-value>

`font-synthesis`：none | [weight || style] | weight style 

`font`：[`font-style` || `font-weight` || `font-variant`] `font-size` `font-family`

# 文本

`text-indent`：<length> | <percentage>

`text-align`：left | right | center | start | end | justify | macth-parent 

`text-align-last`：auto | left | right | center | start | end | justify  

`line-height`：<length> | <percentage> | <number> | normal 

`vertical-align`：balseline | sub | super | bottom | text-bottom | middle | top | text-top | <percentage> | <length>

`word-spacing`：<length>  | normal

`letter-spacing`：<length>  | normal

`text-transform`：uppercase | lowercase | capitalize | none

`text-decoration`：underline | overline | line-through | blink | none

`text-render`：optimizeSpeed | optimizeLegibility | geometricPrecision | auto

`text-shadow`：<color> <horizontal offset> <vertical offset> <blur radius> | none

`white-space`：normal | pre | nowrap | pre-warp | pre-line

`tab-size`：<length> | <number>

`hyphens`：none | manual | auto

`word-break`：normal | break-all | keep-all

`word-wrap`：normal | break-word     **相当于`overflow-wrap`**

`line-break`：auto | loose | normal | strict | anywhere

`overflow-wrap`：normal | break-word

`writing-mode`：horizontal-tb | vertical-rl | vertical-lr 

`text-orientation`：mixed | upright  | sideways 

`direction`：rtl | ltr

`unicode-bidi`：normal | embed | bidi-override

# 视觉格式化

`display`：

+ `<display-outside>`：block | inline | run-in
+ `<display-indside>`：flow | flow-root | table | flex | grid | ruby
+ `<display-listitem>`：list-item | `<display-outside>` | flow | flow-root
+ `<display-internal>`：table-row-group | table-header-group | table-footer-group | table-row | table-cell | table-column-group | table-column | table-caption | ruby-case | ruby-text | ruby-base-container | ruby-text-container
+ `<display-box>`：contents | none
+ `<display-legacy>`：inline-clock | inline-list-item | inline-table | inline-flex | inline-grid

`box-sizing`：content-box | padding-box | border-box

横向格式化属性：

+ content-box下：
  + margin-left + border-left + padding-left + width + padding-right + border-right + margin-right = 父元素width
+ margin：auto | length
+ padding ： 0 | length
+ width： auto | length
+ border： 0 | length

`box-decoration-break`：slice | clone

# 内边距、边框、轮廓、外边距

`width`：<length> | <percentage> | auto

`height`：<length> | <percentage> | auto



`padding`：<length> | <percentage>

`padding-top`、`padding-right`、`padding-bottom`、`padding-left`：<length> | <percentage>



`border-style`：none | hidden | solid | dotted | dashed | double | groove | ridge | inset | outset

`border-top-style`、`border-right-style`、`border-bottom-style`、`border-left-style`：

`boder-width`：thin | medium | thick | <length

`border-top-width`、`border-right-width`、`border-bottom-width`、`border-left-width`：

`border-color`：<color> | transparent

`border-top-color`、`border-right-color`、`border-bottom-color`、`border-left-color`：

`border-top`、`border-right`、``border-bottom`、`border-left`：[<border-width> || <border-style> || <border-color>]

`border`：[<border-width> || <border-style> || <border-color>]

`border-radius`：[<length> | <percentage>]{1,4}

`border-top-radius`、`border-right-radius`、`border-bottom-radius`、`border-left-radius`：[<length> | <percentage>]{1,2}

`border-image-source`：none | <image>

`border-image-slice`：[<number> | <percentage>]{1,4} && fill?

`border-image-width`：[<length> | <percentage> | <number> | auto]{1,4}

`border-image-outset`：[<length> | <number>]{1,4}

`border-image-repeat`：[stretch | repeat | round | space]{1,2}

`border-image`：<border-image-source> || <border-image-slice> [ / <border-image-width> | / <border-image-outset> ] ? || <border-image-repeat>



`outline-style`：auto | none | solid | dotted | dashed | double | groove | ridge | inset | outset

`outline-width`：<length> | thin | medium | thick

`outline-color`：<color> | invert

`outline`：[<outline-color> || <outline-style> || <outline-width>]



`margin`：[<length> | <percentage> | auto]{1,4}

`margin-top`、`margin-right`、``margin-bottom`、`margin-left`：

# 颜色、背景和渐变

`color`：<color>

`background-color`：<color>

`background-clip`：border-box | padding-box | content-box | text

`background-image`：<image> | none

`background-position`：<position>

`background-origin`：border-box | padding-box | content-box

`background-repeat`：repeat-x | repeat-y | repeat | space | round | no-repeat

`background-attachment`：scroll | fixed | local

`background-size`：<length> | <percentage> | auto | cover | contain

`background`

`background-image`：linear-gradient( [ [ <angle> | to <side-or-quadrant> ] , ]?  [ <color-stop> [ , <color-hint>] ? ] # , <color-stop>)

<color-stop>：<color> [ <length> | <percentage> ]?

`background-image`：radial-gradient( [ [ <shape> || <size> ] [ at <position> ] ? , [ at <position> , ] ? [ <cololr-stop> [ , <color-hint> ] ? ] [ , <color-stop> ] + )

<size> ：closest-side | farthest-side | closest-corner | fatrhest-corner | <length> | <percentage>

<shage> ：circle | ellipse

`box-shadow`：none | inset | <length> | <color>

# 浮动及其形状

`float`：left | right | none

`clear`：left | right | both | none

`shape-outside`：none | [ <basic-shape> || <shape-box> ] | <image>

<basic-shape>：inset() | circle() | ellipse() | polygon()

<shape-box>：margin-box | border-box | padding-box | content-box

`shape-image-threshold`：<number>

`shape-margin`：<length> | <percentage>

# 定位

`position`：static | relative | sticky | absolute | fixed

`top`、`right`、`bottom`、`left`：<length> | <percentage> | auto

`min-width`、`min-height`：<length> | <percentage> 

`max-width`、`max-height`：<length> | <percentage> | none

`overflow`：visible | hidden | scroll | auto

`visibility`：visible | hidden | collapse

`z-index`：<integer> | auto

# 弹性盒布局

`flex-direction`：row | row-reverse | column | column-reverse

`flex-wrap`：nowarp | warp | warp-reverse

`flex-flow`：<flex-direction> || <flex-warp>

`justify-content`：flex-start | flex-end | center | space-between | space-around | space-evenly

`align-items`：flex-start | flex-end | center | baseline | stretch

`align-content`：flex-start | flex-end | space-between | space-around | space-evenly | stretch



`align-self`：auto | flex-start | flex-end | center | baseline | stretch

`flex`：[ <flex-grow> <flex-shrink> ? || <flex-basis> ] | none | initial | auto

`flex-grow`：<number>

`flex-shrink`：<number>

`flex-basis`：content | [ <length> | <percentage> ]

`order`：<integer>

# 栅格布局

`grid-template-rows`：none | <track-list> | <auto-track-list>

`grid-template-columns`：none | <track-list> | <auto-track-list>

`grid-template-areas`：none | <string>

`grid-row-start`、`grid-row-end`、`grid-column-start`、`grid-column-end`：auto | <custom-ident> | [ <integer> && <custom-ident>? ] | [ span && [ <integer> || <custom-ident> ] ]

`grid-row`、`grid-column`：<grid-line> [ / <grid-line> ] ?

`grid-area`：<grid-line> [ / <grid-line> ] { 0, 3 }

`grid-auto-flow`：[ row | column ] || dense

`grid-auto-rows`、`grid-auto-columns`：<track-readth> | minmax( <track-breadth> , <track-breadth> )

`grid`：none | subgrid | [ <grid-template-rows> / <grid-template-columns> ] | [ <line-names> ? <string> <track-size> ? <line-names> ? ] + [ / <track-lise> ] ? | [ <grid-auto-flow> [ <grid-auto-rows> [ / <grid-auto-columns> ] ? ] ? ] ]

`grid-row-gap`、`gird-colummn-gap`：<length> | <percentage>

`grip-gap`：<grid-row-gap> <grid-column-gap>

`*`：`justify` | `align`

`*-selft`：start | end | center | left | right | self-start | self-end | stretch

​	`align-selft`：last-baseline | baseline

`*-content`：space-between | space-around | space-evenly 

`*-items`：start | end | center | left | right | self-start | self-end | stretch 

`z-index`：<number>

`order`：<integer>

# 表格布局

`caption-side`：top | bottom

`border-collapse`：collapse | separate | inherit

`border-spacing`：<length> <length> ? 

`empty-cells`：show | hide

`talbe-layout`：auto | fixed

# 列表和生成的内容

`list-style-style`：disc | circle | square | ....

`list-style-image`：<uri> | <image> | none | inherit

`list-style-position`：inside | outside | inherit

`list-style`：[ <list-style-type> || <list-style-image> || <list-style-position> ] | inherit

`content`：normal | [ <string> | <uri> | <counter> | attr(<identifier>) | open-quote | close-quote | no-open-quote | no-close-quote ] + | inherit

`quotes`：[ <string> <string> ] + | none | inherit

`counter-reset`：[ <identifier> <integer>? ]+ | none | inherit

`counter-increment`：[ <identifier> <integer>? ]+ | none | inherit

`@counter-style <name>{}`：system | symbols | additive-symbols | prefix | suffix | negative | range | fallback | pad | speak-as 

# 变形

