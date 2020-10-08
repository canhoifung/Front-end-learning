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

























































