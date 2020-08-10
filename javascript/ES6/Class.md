# Class

类，作为对象的模块

通过`class`关键字定义

==类中定义方法直接将函数定义放进去就可以了不用`function`关键字，且方法之间不能加逗号==

类的所有方法都定义在类的`prototype`上

```javascript
class Point {
  constructor() {
    // ...
  }

  toString() {
    // ...
  }

  toValue() {
    // ...
  }
}

// 等同于

Point.prototype = {
  constructor() {},
  toString() {},
  toValue() {},
};

Point.prototype.constructor === Point // true
```

==类内部所有定义的方法都是不可枚举的==

```javascript
class Point {
  constructor(x, y) {
    // ...
  }

  toString() {
    // ...
  }
}

Object.keys(Point.prototype)
// []
Object.getOwnPropertyNames(Point.prototype)
// ["constructor","toString"]
```

## constructor方法

