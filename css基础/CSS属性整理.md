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

# 布局

`display`：

+ `<display-outside>`：block | inline | run-in
+ `<display-indside>`：flow | flow-root | table | flex | grid | ruby
+ `<display-listitem>`：list-item | `<display-outside>` | flow | flow-root
+ `<display-internal>`：table-row-group | table-header-group | table-footer-group | table-row | table-cell | table-column-group | table-column | table-caption | ruby-case | ruby-text | ruby-base-container | ruby-text-container
+ `<display-box>`：contents | none
+ `<display-legacy>`：inline-clock | inline-list-item | inline-table | inline-flex | inline-grid

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

伪元素选择器：

+ 选择元素的第一个字母：`p::first-letter`
+ 选择元素的第一行：`p::first-line`
+ 选择元素前：`p::before`
+ 选择元素后：`p::after`

# 优先级

每个CSS优先级可以视为`‘0,0,0,0’`

+ 每个ID属性值，添加`0,1,0,0`
+ 每个类属性值、属性选择、伪类，添加`0,0,1,0`
+ 每个元素和伪元素，添加`0,0,0,1`
+ 组合和通用选择器不影响优先级























































