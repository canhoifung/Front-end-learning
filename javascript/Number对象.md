# Number对象

## 静态属性

直接定义在`Number`对象上的属性为静态属性

`Number`的静态属性有：

- `Number.POSITIVE_INFINITY`：正的无限，指向`Infinity`。
- `Number.NEGATIVE_INFINITY`：负的无限，指向`-Infinity`。
- `Number.NaN`：表示非数值，指向`NaN`。
- `Number.MIN_VALUE`：表示最小的正数（即最接近0的正数，在64位浮点数体系中为`5e-324`），相应的，最接近0的负数为`-Number.MIN_VALUE`。
- `Number.MAX_SAFE_INTEGER`：表示能够精确表示的最大整数，即`9007199254740991`。
- `Number.MIN_SAFE_INTEGER`：表示能够精确表示的最小整数，即`-9007199254740991`。

```javascript
Number.POSITIVE_INFINITY // Infinity
Number.NEGATIVE_INFINITY // -Infinity
Number.NaN // NaN

Number.MAX_VALUE
// 1.7976931348623157e+308
Number.MAX_VALUE < Infinity
// true

Number.MIN_VALUE
// 5e-324
Number.MIN_VALUE > 0
// true

Number.MAX_SAFE_INTEGER // 9007199254740991
Number.MIN_SAFE_INTEGER // -9007199254740991
```

## 实例方法

### `Number.prototype.toString()`

用于将数值转为字符串形式

可以接收一个参数作为输出的进制，若省略参数则默认输出十进制

```javascript
(10).toString() // "10"
(10).toString(2) // "1010"
(10).toString(8) // "12"
(10).toString(16) // "a"
```

> 代码中数字需要放在括号中或者使用两个小数点，使用一个会报错
>
> ```javascript
> 10.toString(2)
> // SyntaxError: Unexpected token ILLEGAL
> 
> 10..toString(2)
> // "1010"
> 
> // 其他方法还包括
> 10 .toString(2) // "1010"
> 10.0.toString(2) // "1010"
> 
> //可以直接使用小数
> 10.5.toString() // "10.5"
> 10.5.toString(2) // "1010.1"
> 10.5.toString(8) // "12.4"
> 10.5.toString(16) // "a.8"
> ```

`toString()`方法只适用于十进制的数，若为其他的需要使用`parseInt`方法

### `Number.prototype.toFixed()`

先将一个数转为指定位数的小数，然后返回这个小数对应的字符串

```javascript
(10).toFixed(2) // "10.00"
10.005.toFixed(2) // "10.01"
```

> 有效范围为0~20

### `Number.prototype.toExponential()`

将一个数转为科学计数法形式

```javascript
(10).toExponential()  // "1e+1"
(10).toExponential(1) // "1.0e+1"
(10).toExponential(2) // "1.00e+1"

(1234).toExponential()  // "1.234e+3"
(1234).toExponential(1) // "1.2e+3"
(1234).toExponential(2) // "1.23e+3"
```

> 范围是0~20

### `Number.prototype.toPrecision()`

将一个数转为指定位数的有效数字

```javascript
(12.34).toPrecision(1) // "1e+1"
(12.34).toPrecision(2) // "12"
(12.34).toPrecision(3) // "12.3"
(12.34).toPrecision(4) // "12.34"
(12.34).toPrecision(5) // "12.340"
```

> 范围是1~21

### `Number.prototype.toLocaleString()`

接收一个地区码作为参数，返回一个字符串，表示当前数字在该地区的当地书写形式：

```javascript
(123).toLocaleString('zh-Hans-CN-u-nu-hanidec')
// "一二三"
```

可以接收第二个参数配置对象，用于定制指定用途的返回字符串

该对象的`style`属性指定输出样式，默认为`decimal`，表示输出十进制形式，若为`percent`则输出百分数

```javascript
(123).toLocaleString('zh-Hans-CN', { style: 'persent' })
// "12,300%"
```

若`style:'currency'`，则可以搭配`currency`属性，输出指定格式的货币字符串形式：

```javascript
(123).toLocaleString('zh-Hans-CN', { style: 'currency', currency: 'CNY' })
// "￥123.00"

(123).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })
// "123,00 €"

(123).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
// "$123.00"
```

若省略了参数，则由浏览器自行决定如何处理，通常按照操作系统的地区设定

## 自定义方法

只能在`Number.prototype`对象上自定义方法，被`Number`的实例继承

