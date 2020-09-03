# CSS操作

[TOC]

通过JavaScript操作CSS

## HTML元素的style属性

最简单的操作CSS方法：

使用`getAttribute()`、`setAttribute()`、`removeAttribute()`方法，直接读写或删除网页元素的`style`属性

```javascript
div.setAttribute(
	'style',
    'background-color:red;' + 'border:1px solid black;'
)
```

相当于：

```html
<div style="background-color:red; border:1px solid black;" />
```

或：

```javascript
e.style.fontSize = '18px';
e.style.color = 'black';
```

## CSSStyleDeclaration 接口

用于操作元素的样式，在三个地方都部署了这个接口

+ 元素节点的`style`属性 `Element.style`
+ `CSSStyle`实例的`style`属性
+ `window.getComputedStyle()`的返回值

接口可直接读写CSS的样式属性，但连词号需要改成驼峰法

```javascript
var divStyle = document.querySelector('div').style;

divStyle.backgroundColor = 'red';
divStyle.border = '1px solid black';
divStyle.width = '100px';
divStyle.height = '100px';
divStyle.fontSize = '10em';

divStyle.backgroundColor // red
divStyle.border // 1px solid black
divStyle.height // 100px
divStyle.width // 100px
```

==*==若属性名为JavaScript保留字，则需要加上字符串`css`，比如：`float`→`cssFloat`

==*==需要包括单位

==*==返回的是行内样式。但通过①样式表设置的样式或②从父元素继承的样式，都不发通过这个属性获得，要获得需要使用`window.getComputedStyle()`

### CSSStyleDeclaration 实例属性

#### CSSStyleDeclaration.cssText

用于读写当前规则的所有样式声明文本

```javascript
var divStyle = document.querySelector('div').style;

divStyle.cssText = 'background-color: red;'
  + 'border: 1px solid black;'
  + 'height: 100px;'
  + 'width: 100px;';
```

==*==  `cssText`属性值不需要改写CSS属性名

> 删除一个元素的所有行内样式最方便方法：
>
> ```javascript
> divStyle.cssText = '';
> ```

#### CSSStyleDeclaration.length

返回一个整数值，表示当前规则包含多少条样式声明

```javascript
// HTML 代码如下
// <div id="myDiv"
//   style="height: 1px;width: 100%;background-color: #CA1;"
// ></div>
var myDiv = document.getElementById('myDiv');
var divStyle = myDiv.style;
divStyle.length // 3
```

#### CSSStyleDeclaration.parentRule

返回当前规则所属的样式块（CSSRule实例）

若不存在则返回`null`

只读

只在使用CSSRule接口时有意义

```javascript
var declaration = document.styleSheets[0].rules[0].style;
declaration.parentRule === document.styleSheets[0].rules[0]
// true
```

### CSSStyleDeclaration 实例方法

#### CSSStyleDeclaration.getPropertyPriority()

接收CSS样式的属性名所谓参数，返回一个字符串，表示是否设置了`important`优先级

若有则返回`important`，若无则返回空字符串

```javascript
// HTML 代码为
// <div id='myDiv' style='margin: 10px!important; color: red;'/>
var style = document.getElementBtId('myDiv').style;
style.margin // 10px
style.getPropertyPriority('margin') // 'important'
style.getPropertyPriority('color') // ''
```

#### CSSStyleDeclaration.getPropertyValue()

接受CSS样式属性名作为参数，返回一个字符串，表示该属性的属性值

```javascript
// HTML 代码为
// <div id="myDiv" style="margin: 10px!important; color: red;"/>
var style = document.getElementById('myDiv').style;
style.margin // "10px"
style.getPropertyValue("margin") // "10px"
```

#### CSSStyleDeclaration.item()

接受一个整数值作为参数，返回该位置的CSS属性名

```javascript
// HTML 代码为
// <div id="myDiv" style="color: red; background-color: white;"/>
var style = document.getElementById('myDiv').style;
style.item(0) // "color"
style.item(1) // "background-color"
```

> 若不提供参数会报错
>
> 若参数超过实际属性数目，会返回一个空字符

#### CSSStyleDeclaration.removeProperty()

接收一个属性名作为参数，在CSS内移除这个属性

返回这个属性原来的值

```javascript
// HTML 代码为
// <div id="myDiv" style="color: red; background-color: white;">
//   111
// </div>
var style = document.getElementById('myDiv').style;
style.removeProperty('color') // 'red'
// HTML 代码变为
// <div id="myDiv" style="background-color: white;">
```

#### CSSStyleDeclaration.setProperty()

用于设置新的CSS属性

无返回值

接收三个参数：

- 第一个参数：属性名，该参数是必需的。
- 第二个参数：属性值，该参数可选。如果省略，则参数值默认为空字符串。
- 第三个参数：优先级，该参数可选。如果设置，唯一的合法值是`important`，表示 CSS 规则里面的`!important`。

```javascript
// HTML 代码为
// <div id="myDiv" style="color: red; background-color: white;">
//   111
// </div>
var style = document.getElementById('myDiv').style;
style.setProperty('border', '1px solid blue');
```

## CSS模块的侦测

用于检测当前浏览器是否支持某个模块

可以使用判断元素的`style`对象的某个属性值是否为字符串

```javascript
typeof element.style.animationName === 'string';
typeof element.style.transform === 'string';
```



若CSS属性存在，则会返回一个空字符串，若不存在，则会返回`undefined`

```javascript
document.body.style['maxWidth'] // ""
document.body.style['maximumWidth'] // undefined
```

> 不论CSS属性名的写法是否带连词线，都能反映该属性是否存在



需要考虑不同浏览器的CSS前缀

```javascript
var content = document.getElementById('content');
typeof content.style['webkitAnimation'] === 'string'
```



侦测方法函数：

```javascript
function isPropertySupported(property) {
  if (property in document.body.style) return true;
  var prefixes = ['Moz', 'Webkit', 'O', 'ms', 'Khtml'];
  var prefProperty = property.charAt(0).toUpperCase() + property.substr(1);

  for(var i = 0; i < prefixes.length; i++){
    if((prefixes[i] + prefProperty) in document.body.style) return true;
  }

  return false;
}

isPropertySupported('background-clip')
// true
```

## CSS对象

### CSS.escape()

用于转义CSS选择器内的特殊字符

```javascript
// html部分  <div id="foo#bar">
document.querySelector('#' + CSS.escape('foo#bar'))
```

html部分由于有`#`，不能直接写成`document.querySelector('#foo#bar')`，而要写成`document.querySelector('#foo\\#bar')`

> 使用双斜杠是因为单引号也会转义一次斜杠

### CSS.supports()

返回一个布尔值，表示当前环境是否支持某一句CSS规则

参数有两种写法：

1. 第一个参数为属性名，第二个参数为属性值
2. 整个参数为一个完整的CSS语句

```javascript
// 第一种写法
CSS.supports('transform-origin', '5px') // true

// 第二种写法
CSS.supports('display: table-cell') // true
```

> 第二种写法结尾不能带有分号
>
> ```javascript
> CSS.supports('display: table-cell;') // false
> ```

## window.getComputedStyle()

返回浏览器计算后得到的最终规则

接受一个节点对象作为参数，返回一个CSSStyleDeclaration实例，包含了指定节点的最终样式信息（即各种CSS规则叠加后的结果）

```javascript
var div = document.querySelector('div');
var styleObj = window.getComputedStyle(div);
styleObj.backgroundColor
```

CSSStyleDeclaration实例为一个活对象，会实时反映

> 可以接收第二个参数表示当前元素的伪元素
>
> 如`:before`、`:after`、`:first-line`、`:first-letter`等
>
> ```javascript
> var result = window.getComputedStyle(div, ':before');
> ```



==注意点==

- CSSStyleDeclaration 实例返回的 CSS 值都是绝对单位。比如，长度都是像素单位（返回值包括`px`后缀），颜色是`rgb(#, #, #)`或`rgba(#, #, #, #)`格式。
- CSS 规则的简写形式无效。比如，想读取`margin`属性的值，不能直接读，只能读`marginLeft`、`marginTop`等属性；再比如，`font`属性也是不能直接读的，只能读`font-size`等单个属性。
- 如果读取 CSS 原始的属性名，要用方括号运算符，比如`styleObj['z-index']`；如果读取骆驼拼写法的 CSS 属性名，可以直接读取`styleObj.zIndex`。
- 该方法返回的 CSSStyleDeclaration 实例的`cssText`属性无效，返回`undefined`。

## CSS伪元素

即通过CSS向DOM添加的元素，主要通过`:before`和`:after`选择器生成，然后用`content`属性指定伪元素的内容

```html
<div id='test'>
    Test content
</div>
```

```css
#test:before{
    content:'Before';
    color:#FF0;
}
```

获取伪元素：

```javascript
var test = document.querySelector('#test');

var result = window.getComputedStyle(test, ':before').content;
var color = window.getComputedStyle(test, ':before').color;

//相当于
var result = window.getComputedStyle(test, ':before')
  .getPropertyValue('content');
var color = window.getComputedStyle(test, ':before')
  .getPropertyValue('color');
```

## StyleSheet接口

代表网页的一张样式表，包括`<link>`元素加载的样式和`<style>`元素内嵌的样式表

`document.styleSheets`属性可以返回当前页面的所有`StyleSheet`类似数组的实例（即样式表）

```javascript
var sheets = document.styleSheets;
var sheet = document.styleSheets[0];
sheet instanceof StyleSheet // true
```

另一种获取`StyleSheet`实例的方法：

```javascript
// HTML 代码为 <style id="myStyle"></style>
var myStyleSheet = document.getElementById('myStyle').sheet;
myStyleSheet instanceof StyleSheet // true
```



`StyleSheet`接口包括了网页样式表和XML文档的样式表

其中网页样式表即`CSSStyleSheet`

### 实例属性

`StyleSheet`实例具有以下属性：

#### StyleSheet.disabled

返回一个布尔值，表示该样式表是否处于禁用状态

可读写

> 只能在JavaScript脚本中设置，不能在HTML语句中设置

#### StyleSheet.href

返回样式表的网址

对于内嵌样式表，返回`null`

只读

```javascript
document.styleSheets[0].href
```

#### StyleSheet.media

返回一个类似数组的对象（`MediaList`实例），成员是表示适用媒介的字符串

表示当前样式表用于：

+ 屏幕（screen）
+ 打印（print）
+ 手持设备（handheld）
+ 都（all）

只读，默认为`screen`

`MediaList`实例的`appendMedium`方法，用于增加媒介；`deleteMedium`方法用于删除媒介。

```JavaScript
document.styleSheets[0].media.appendMedium('handheld');
document.styleSheets[0].media.deleteMedium('print');
```

#### StyleSheet.title

返回样式表的`title`属性

#### StyleSheet.type

返回样式表的`type`属性，通常是`text/css`

```javascript
document.styleSheets[0].type  // "text/css"
```

#### StyleSheet.parentStyleSheet

返回包含了当前样式表的那张样式表

CSS的`@import`命令允许在样式表中加载其他样式表

若为顶层样式表，则返回`null`

```javascript
if (stylesheet.parentStyleSheet) {
  sheet = stylesheet.parentStyleSheet;
} else {
  sheet = stylesheet;
}
```

#### StyleSheet.ownerNode

返回`StyleSheet`对象所在的DOM节点，通常是`<link>`或`<style>`

若为由其他样式表引用的样式表，则返回`null`

```javascript
// HTML代码为
// <link rel="StyleSheet" href="example.css" type="text/css" />
document.styleSheets[0].ownerNode // [object HTMLLinkElement]
```

#### CSSStyleSheet.cssRules

指向一个类似数组的对象（即`CSSRuleList`实例），成员为当前样式表的一条CSS规则

使用该规则的`cssText`属性可以获取CSS规则对应的字符串

```javascript
var sheet = document.querySelector('#styleElement').sheet;

sheet.cssRules[0].cssText
// "body { background-color: red; margin: 20px; }"

sheet.cssRules[1].cssText
// "p { line-height: 1.4em; color: blue; }"
```

每条 CSS 规则还有一个`style`属性，指向一个对象，用来读写具体的 CSS 命令。

```javascript
cssStyleSheet.cssRules[0].style.color = 'red';
cssStyleSheet.cssRules[1].style.color = 'purple';
```

#### CSSStyleSheet.ownerRule

有些样式表是通过`@import`规则输入的，它的`ownerRule`属性会返回一个`CSSRule`实例，代表那行`@import`规则。如果当前样式表不是通过`@import`引入的，`ownerRule`属性返回`null`。

### 实例方法

#### CSSStyleSheet.insertRule()

用于在当前样式表的插入一个新的CSS规则

```javascript
var sheet = document.querySelector('#styleElement').sheet;
sheet.insertRule('#block { color: white }', 0);
sheet.insertRule('p { color: red }', 1);
```

接受两个参数：

1. 表示CSS规则的字符串，只能有一条规则，否则报错
2. 该规则在样式表的插入位置（0开始），可选，默认为0（即头部）

> 浏览器对脚本在样式表里面插入规则有很多[限制](https://drafts.csswg.org/cssom/#insert-a-css-rule)。所以，这个方法最好放在`try...catch`里使用。

#### CSSStyleSheet.deleteRule()

用于在样式表里面移除一条规则，参数为该条规则在`cssRule`对象中的位置

无返回值

```javascript
document.styleSheets[0].deleteRule(1);
```

## 实例：添加样式表

添加样式表两种方法：

1. 添加一张内置样式表，即添加一个`<style>`节点

```javascript
// 写法一
var style = document.createElement('style');
style.setAttribute('media', 'screen');
style.innerHTML = 'body{color:red}';
document.head.appendChild(style);

// 写法二
var style = (function () {
  var style = document.createElement('style');
  document.head.appendChild(style);
  return style;
})();
style.sheet.insertRule('.foo{color:red;}', 0);
```

2. 添加外部样式表，即添加一个`<link>`节点，然后将`href`属性指向外部样式表的URL

```javascript
var linkElm = document.createElement('link');
linkElm.setAttribute('rel', 'stylesheet');
linkElm.setAttribute('type', 'text/css');
linkElm.setAttribute('href', 'reset-min.css');

document.head.appendChild(linkElm);
```

## CSSRuleList 接口

是一个类似数组的对象，表示一组CSS规则，成员都是CSSRule实例

通过`StyleSheet.cssRules`属性获取CSSRuleList实例

```javascript
// HTML 代码如下
// <style id="myStyle">
//   h1 { color: red; }
//   p { color: blue; }
// </style>
var myStyleSheet = document.getElementById('myStyle').sheet;
var crl = myStyleSheet.cssRules;
crl instanceof CSSRuleList // true
```

实例中每一条实例都可以通过`rules.item(index)`或者`rules[index]`获得

条数可以通过`rules.length`获得

## CSSRule接口

JavaScript通过CSSRuleList接口获取CSSRule实例

```javascript
// HTML 代码如下
// <style id="myStyle">
//   .myClass {
//     color: red;
//     background-color: yellow;
//   }
// </style>
var myStyleSheet = document.getElementById('myStyle').sheet;
var ruleList = myStyleSheet.cssRules;
var rule = ruleList[0];
rule instanceof CSSRule // true
```

### CSSRule实例属性

#### CSSRule.cssText

返回当前规则的文本

```javascript
rule.cssText;
// ".myClass { color: red; background-color: yellow; }"
```

如果规则为加载其他样式表的（`@import`），则返回`@import 'url'`

#### CSSRule.parentStyleSheet

返回当前规则所在的样式表对象

```javascript
rule.parentStyleSheet === myStyleSheet //true
```

#### CSSRule.parentRule

返回包含当前规则的父规则，若不存在父规则，则返回`null`

常见情况：当前规则包含在`@media`规则代码块之中

```javascript
// HTML 代码如下
// <style id="myStyle">
//   @supports (display: flex) {
//     @media screen and (min-width: 900px) {
//       article {
//         display: flex;
//       }
//     }
//  }
// </style>
var myStyleSheet = document.getElementById('myStyle').sheet;
var ruleList = myStyleSheet.cssRules;

var rule0 = ruleList[0];
rule0.cssText
// "@supports (display: flex) {
//    @media screen and (min-width: 900px) {
//      article { display: flex; }
//    }
// }"

// 由于这条规则内嵌其他规则，
// 所以它有 cssRules 属性，且该属性是 CSSRuleList 实例
rule0.cssRules instanceof CSSRuleList // true

var rule1 = rule0.cssRules[0];
rule1.cssText
// "@media screen and (min-width: 900px) {
//   article { display: flex; }
// }"

var rule2 = rule1.cssRules[0];
rule2.cssText
// "article { display: flex; }"

rule1.parentRule === rule0 // true
rule2.parentRule === rule1 // true
```

#### CSSRule.type

返回一个整数值，表示当前规则的类型

常见类型：

1. 普通样式规则（CSSStyleRule实例）
2. `@import`规则
3. `@media`规则（CSSMediaRule实例）
4. `@font-face`规则

### CSSStyleRule接口

若一条CSS规则为普通的样式规则，则除了CSSRule接口，还部署了CSSStyleRule接口

有一下两个属性：

#### （1）CSSStyleR.selectorText

返回当前规则的选择器

```javascript
var stylesheet = document.styleSheets[0];
stylesheet.cssRules[0].selectorText // ".myClass"
```

可写

#### （2）CSSStyle.style

返回一个对象（CSSStyleDeclaration实例），代表当前规则的样式声明

即选择器后面的大括号部分

```javascript
// HTML 代码为
// <style id="myStyle">
//   p { color: red; }
// </style>
var styleSheet = document.getElementById('myStyle').sheet;
styleSheet.cssRules[0].style instanceof CSSStyleDeclaration
// true
```

CSSStyleDeclaration 实例的`cssText`属性，可以返回所有样式声明，格式为字符串。

```javascript
styleSheet.cssRules[0].style.cssText
// "color: red;"
styleSheet.cssRules[0].selectorText
// "p"
```

### CSSMediaRule 接口

如果一条 CSS 规则是`@media`代码块，那么它除了 CSSRule 接口，还部署了 CSSMediaRule 接口。

该接口主要提供`media`属性和`conditionText`属性。前者返回代表`@media`规则的一个对象（MediaList 实例），后者返回`@media`规则的生效条件。

```javascript
// HTML 代码如下
// <style id="myStyle">
//   @media screen and (min-width: 900px) {
//     article { display: flex; }
//   }
// </style>
var styleSheet = document.getElementById('myStyle').sheet;
styleSheet.cssRules[0] instanceof CSSMediaRule
// true

styleSheet.cssRules[0].media
//  {
//    0: "screen and (min-width: 900px)",
//    appendMedium: function,
//    deleteMedium: function,
//    item: function,
//    length: 1,
//    mediaText: "screen and (min-width: 900px)"
// }

styleSheet.cssRules[0].conditionText
// "screen and (min-width: 900px)"
```

## window.matchMedia()

### 用法

用于将CSS的`MediaQuery`条件语句，转换成一个MediaQueryList实例

```javascript
var mdl = window.matchMedia('(min-width: 400px)');
mdl instanceof MediaQueryList // true
```

==*==若参数不是有效的`MediaQuery`条件语句，也不会报错，依然返回一个MediaQueryList实例

### 接口实例属性

#### MediaQueryList.media

返回一个字符串，表示对应的`MediaQuery`条件语句

```javascript
var mql = window.matchMedia('(min-width: 400px)');
mql.media // "(min-width: 400px)"
```

#### MediaQueryList.matches

返回一个布尔值，表示当前页面是否符合指定的MediaQuery条件语句

```javascript
if (window.matchMedia('(min-width: 400px)').matches) {
  /* 当前视口不小于 400 像素 */
} else {
  /* 当前视口小于 400 像素 */
}
```

例子：

```javascript
var result = window.matchMedia("(max-width: 700px)");

if (result.matches){
  var linkElm = document.createElement('link');
  linkElm.setAttribute('rel', 'stylesheet');
  linkElm.setAttribute('type', 'text/css');
  linkElm.setAttribute('href', 'small.css');

  document.head.appendChild(linkElm);
}
```

#### MediaQueryList.onchange

若MediaQuery条件语句的适配环境发生变化，会触发`change`事件

该属性用于指定`change`事件的监听函数

函数参数为`change`事件对象

```javascript
var mql = window.matchMedia('(max-width: 600px)');

mql.onchange = function(e) {
  if (e.matches) {
    /* 视口不超过 600 像素 */
  } else {
    /* 视口超过 600 像素 */
  }
}
```

### MediaQueryList接口的实例方法

MediaQueryList 实例有两个方法`MediaQueryList.addListener()`和`MediaQueryList.removeListener()`，用来为`change`事件添加或撤销监听函数。

```javascript
var mql = window.matchMedia('(max-width: 600px)');

// 指定监听函数
mql.addListener(mqCallback);

// 撤销监听函数
mql.removeListener(mqCallback);

function mqCallback(e) {
  if (e.matches) {
    /* 视口不超过 600 像素 */
  } else {
    /* 视口超过 600 像素 */
  }
}
```

注意，`MediaQueryList.removeListener()`方法不能撤销`MediaQueryList.onchange`属性指定的监听函数。



































