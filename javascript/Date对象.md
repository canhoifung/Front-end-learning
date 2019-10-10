# Date对象

以国际标准时间1970年1月1日00:00:00作为时间的零点

可以表示的时间范围是前后各1亿天（单位为毫秒）

## 作为普通函数

直接调用返回一个代表当前时间的字符串

```javascript
Date()
// "Tue Dec 01 2015 09:34:43 GMT+0800 (CST)"
```

==*==即使带有参数，直接调用时仍然返回当前时间

```javascript
Date(2000, 1, 1)
// "Tue Dec 01 2015 09:34:43 GMT+0800 (CST)"
```

## 作为构造函数

若不加参数，则实例表示当前时间

`Date`实例求值时默认调用`toString()`方法，因而对`Date`实例求值均返回一个字符串代表该实例对应的时间

```javascript
var today = new Date();

today
// "Tue Dec 01 2015 09:34:43 GMT+0800 (CST)"

// 等同于
today.toString()
// "Tue Dec 01 2015 09:34:43 GMT+0800 (CST)"
```

可接收多种格式的参数：

1. 参数可以为负整数，代表1970年元旦前的事件
2. 只要能被`Date.parse()`解析的字符串，都可以作为参数
3. 参数为年月日等多个整数时，年和月不能省略，其他可以省略。即若单使用年参数，会被解释为毫秒数

```javascript
new Date(-1378218728000)
// Fri Apr 30 1926 17:27:52 GMT+0800 (CST)

new Date('2013-2-15')
new Date('2013/2/15')
new Date('02/15/2013')
new Date('2013-FEB-15')
new Date('FEB, 15, 2013')
new Date('FEB 15, 2013')
new Date('February, 15, 2013')
new Date('February 15, 2013')
new Date('15 Feb 2013')
new Date('15, February, 2013')
// Fri Feb 15 2013 00:00:00 GMT+0800 (CST)

new Date(2013)
// Thu Jan 01 1970 08:00:02 GMT+0800 (CST)
new Date(2013, 0)
// Tue Jan 01 2013 00:00:00 GMT+0800 (CST)
new Date(2013, 0, 1)
// Tue Jan 01 2013 00:00:00 GMT+0800 (CST)
new Date(2013, 0, 1, 0)
// Tue Jan 01 2013 00:00:00 GMT+0800 (CST)
new Date(2013, 0, 1, 0, 0, 0, 0)
// Tue Jan 01 2013 00:00:00 GMT+0800 (CST)
```

参数取值范围：

- 年：使用四位数年份，比如`2000`。如果写成两位数或个位数，则加上`1900`，即`10`代表1910年。如果是负数，表示公元前。
- 月：`0`表示一月，依次类推，`11`表示12月。
- 日：`1`到`31`。
- 小时：`0`到`23`。
- 分钟：`0`到`59`。
- 秒：`0`到`59`
- 毫秒：`0`到`999`。

> 若参数超出正常范围，会自动折算。如月为15则为下一年的4月

> 日期为`0`表示上个月的最后一天

> 可以使用负数，表示扣去的时间

## 日期运算

类型自动转换时：

1. 如果`Date`实例转为数值，则等于对应的毫秒数
2. 如果`Date`实例转为字符串，则等于对应的日期字符串

```javascript
var d1 = new Date(2000, 2, 1);
var d2 = new Date(2000, 3, 1);

d2 - d1
// 2678400000
d2 + d1
// "Sat Apr 01 2000 00:00:00 GMT+0800 (CST)Wed Mar 01 2000 00:00:00 GMT+0800 (CST)"
```

## 静态方法

### `Date.now()`

返回当前时间距离时间零点的毫秒数，相当于Unix时间戳乘以1000

```javascript
Date.now() // 1364026285194
```

### `Date.parse()`

用于解析日期字符串，返回该时间距离时间零点的毫秒数

格式应为：

```YYYY-MM-DDTHH:mm:ss.sssZ```，最后的`Z`表示时区

但其他格式也可以被解析

```javascript
Date.parse('Aug 9, 1995')
Date.parse('January 26, 2011 13:51:50')
Date.parse('Mon, 25 Dec 1995 13:30:00 GMT')
Date.parse('Mon, 25 Dec 1995 13:30:00 +0430')
Date.parse('2011-10-10')
Date.parse('2011-10-10T14:48:00')
```

若解析失败则返回`NaN`

### `Date.UTC()`

返回该时间距离时间零点的毫秒数

接收年月日等变量作为参数

格式：

```javascript
// 格式
Date.UTC(year, month[, date[, hrs[, min[, sec[, ms]]]]])
```

用法：

```javascript
// 用法
Date.UTC(2011, 0, 1, 2, 3, 4, 567)
// 1293847384567
```

==*==该方法的参数会被解释为UTC时间（世界标准时间）

## 实例方法

除了`valueOf()`与`toString()`，实例方法大概分为三类：

+ `to`类：从`Date`对象返回一个字符串，表示指定的时间
+ `get`类：获取`Date`对象的日期和时间
+ `set`类：设置`Date`对象的日期和时间

### `Date.prototype.valueOf()`

返回实例对象距离时间零点对应的毫秒数，等同于`getTime()`方法

预期为数值的场合，`Date`实例会自动调用该方法

```javascript
var start = new Date();
// ...
var end = new Date();
var elapsed = end - start;
```

### `to`类方法

#### `Date.prototype.toString()`

返回一个完整的日期字符串

```javascript
var d = new Date(2013, 0, 1);

d.toString()
// "Tue Jan 01 2013 00:00:00 GMT+0800 (CST)"
d
// "Tue Jan 01 2013 00:00:00 GMT+0800 (CST)"
```

> `toString()`是默认的调用方法，因而直接读取`Date`实例，等于调用这个方法

#### `Date.prototype.toUTCString()`

返回对应的UTC时间

```javascript
var d = new Date(2013, 0, 1);

d.toUTCString()
// "Mon, 31 Dec 2012 16:00:00 GMT"
```

#### `Date.prototype.toISOString()`

返回对应时间的ISO8601写法

```javascript
var d = new Date(2013, 0, 1);

d.toISOString()
// "2012-12-31T16:00:00.000Z"
```

> 总是返回UTC时区的时间

#### `Date.prototype.toJSON()`

返回一个符合JSON格式的ISO日期字符串，与`toISOString()`方法的返回结果完全相同

#### `Data.prototype.toDateString()`

返回日期字符串

不含时分秒

```javascript
var d = new Date(2013, 0, 1);
d.toDateString() // "Tue Jan 01 2013"
```

#### `Data.prototype.toTimeString()`

返回时间字符串

不含年月日

```javascript
var d = new Date(2013, 0, 1);
d.toTimeString() // "00:00:00 GMT+0800 (CST)"
```

#### 本地时间

将Date实例转为表示本地时间的字符串方法：

+ `Date.prototype.toLocaleString()`：完整的本地时间
+ `Date.prototype.toLocaleDateString()`：本地日期（不含时分秒）
+ `Date.prototype.toLocaleTimeString()`：本地时间（不含年月日）

```javascript
var d = new Date(2013, 0, 1);

d.toLocaleString()
// 中文版浏览器为"2013年1月1日 上午12:00:00"
// 英文版浏览器为"1/1/2013 12:00:00 AM"

d.toLocaleDateString()
// 中文版浏览器为"2013年1月1日"
// 英文版浏览器为"1/1/2013"

d.toLocaleTimeString()
// 中文版浏览器为"上午12:00:00"
// 英文版浏览器为"12:00:00 AM"
```

三个方法都有两个可选的参数：

```javascript
dateObj.toLocaleString([locales[, options]])
dateObj.toLocaleDateString([locales[, options]])
dateObj.toLocaleTimeString([locales[, options]])
```

`locales`为指定所用语言的字符串

`options`为配置对象

```javascript
var d = new Date(2013, 0, 1);

d.toLocaleString('en-US') // "1/1/2013, 12:00:00 AM"
d.toLocaleString('zh-CN') // "2013/1/1 上午12:00:00"

d.toLocaleDateString('en-US') // "1/1/2013"
d.toLocaleDateString('zh-CN') // "2013/1/1"

d.toLocaleTimeString('en-US') // "12:00:00 AM"
d.toLocaleTimeString('zh-CN') // "上午12:00:00"

// 时间格式
// 下面的设置是，星期和月份为完整文字，年份和日期为数字
d.toLocaleDateString('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
})
// "Tuesday, January 1, 2013"

// 指定时区
d.toLocaleTimeString('en-US', {
  timeZone: 'UTC',
  timeZoneName: 'short'
})
// "4:00:00 PM UTC"

d.toLocaleTimeString('en-US', {
  timeZone: 'Asia/Shanghai',
  timeZoneName: 'long'
})
// "12:00:00 AM China Standard Time"

// 小时周期为12还是24
d.toLocaleTimeString('en-US', {
  hour12: false
})
// "00:00:00"

d.toLocaleTimeString('en-US', {
  hour12: true
})
// "12:00:00 AM"
```

### get类方法

- `getTime()`：返回实例距离1970年1月1日00:00:00的毫秒数，等同于`valueOf`方法。
- `getDate()`：返回实例对象对应每个月的几号（从1开始）。
- `getDay()`：返回星期几，星期日为0，星期一为1，以此类推。
- `getFullYear()`：返回四位的年份。
- `getMonth()`：返回月份（0表示1月，11表示12月）。
- `getHours()`：返回小时（0-23）。
- `getMilliseconds()`：返回毫秒（0-999）。
- `getMinutes()`：返回分钟（0-59）。
- `getSeconds()`：返回秒（0-59）。
- `getTimezoneOffset()`：返回当前时间与 UTC 的时区差异，以分钟表示，返回结果考虑到了夏令时因素。

返回的均为整数

```javascript
var d = new Date('January 6, 2013');

d.getDate() // 6
d.getMonth() // 0
d.getFullYear() // 2013
d.getTimezoneOffset() // -480
```

UTC版本：

- `getUTCDate()`
- `getUTCFullYear()`
- `getUTCMonth()`
- `getUTCDay()`
- `getUTCHours()`
- `getUTCMinutes()`
- `getUTCSeconds()`
- `getUTCMilliseconds()`

```javascript
var d = new Date('January 6, 2013');

d.getDate() // 6
d.getUTCDate() // 5
```

### set类方法

- `setDate(date)`：设置实例对象对应的每个月的几号（1-31），返回改变后毫秒时间戳。
- `setFullYear(year [, month, date])`：设置四位年份。
- `setHours(hour [, min, sec, ms])`：设置小时（0-23）。
- `setMilliseconds()`：设置毫秒（0-999）。
- `setMinutes(min [, sec, ms])`：设置分钟（0-59）。
- `setMonth(month [, date])`：设置月份（0-11）。
- `setSeconds(sec [, ms])`：设置秒（0-59）。
- `setTime(milliseconds)`：设置毫秒时间戳。

其中参数都会自动折算，若超过范围会自动往下一轮顺延

UTC时区版本：

- `setUTCDate()`
- `setUTCFullYear()`
- `setUTCHours()`
- `setUTCMilliseconds()`
- `setUTCMinutes()`
- `setUTCMonth()`
- `setUTCSeconds()`