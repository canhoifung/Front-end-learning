# Boolean对象

[TOC]

用于生成布尔值的包装对象实例

```javascript
var b = new Boolean(true);

typeof b; // 'object'
b.valueOf(); // true
```

==*==`false`对应的包装对象实例，布尔运算结果也是`true`：

```javascript
if (new Boolean(false)) {   //false对应的包装对象实例是一个对象，对象对应的布尔值为true
  console.log('true');
} // true

if (new Boolean(false).valueOf()) {
  console.log('true');
} // 无输出
```

## 类型转换作用

```javascript
Boolean(undefined) // false
Boolean(null) // false
Boolean(0) // false
Boolean('') // false
Boolean(NaN) // false

Boolean(1) // true
Boolean('false') // true
Boolean([]) // true
Boolean({}) // true
Boolean(function () {}) // true
Boolean(/foo/) // true
```

使用双重否运算符也可以将任意值转为对应的布尔值：

```javascript
!!undefined // false
!!null // false
!!0 // false
!!'' // false
!!NaN // false

!!1 // true
!!'false' // true
!![] // true
!!{} // true
!!function(){} // true
!!/foo/ // true
```

