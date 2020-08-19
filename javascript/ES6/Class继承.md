# Class的继承

Class通过`extends`关键字实现继承

子类必须在`constructor`方法中调用`super`方法，否则会报错

`super`关键字表示父类的构造函数，用于新建父类的`this`对象，获取父类同样的实例属性和方法，且子类只有调用了`super`之后才能使用`this`关键字

父类的静态方法也会被子类继承

```javascript
class Point {
};
class ColorPoint extends Point {
  constructor(x, y, color) {
    super(x, y); // 调用父类的constructor(x, y)
    this.color = color;
  }

  toString() {
    return this.color + ' ' + super.toString(); // 调用父类的toString()
  }
}
```

ES5 的继承，实质是先创造子类的实例对象`this`，然后再将父类的方法添加到`this`上面（`Parent.apply(this)`）。

ES6 的继承机制完全不同，实质是先将父类实例对象的属性和方法，加到`this`上面（所以必须先调用`super`方法），然后再用子类的构造函数修改`this`。

## Object.getPrototypeOf()

可以用于从子类上获取父类

可以用于判断一个类是否继承了另一个类

## super关键字

可以当作函数使用，也可以当作对象使用

### 作为函数调用

代表父类的构造函数，但是返回的是子类的实例，即`super`内部的`this`指向子类的实例

相当于`A.prototype.constructor.call(this)`

```javascript
class A {
  constructor() {
    console.log(new.target.name);
  }
}
class B extends A {
  constructor() {
    super();
  }
}
new A() // A
new B() // B
```

作为函数时，`super()`只能用在子类的构造函数中，否则会报错

### 作为对象使用

1. 在普通方法中指向父类的原型对象
   1. 不能调用实例的方法和属性
   2. 调用的父类方法内部`this`指向当前子类实例
   3. 通过`super`对属性进行赋值，等于对当前子类实例属性进行赋值

2. 在静态方法中，指向父类
   1. 调用父类的方法，方法内部的`this`指向当前的子类，而不是子类的实例

```javascript
class A {
  p() {
    return 2;
  }
}

class B extends A {
  constructor() {
    super();
    console.log(super.p()); // 2
  }
}

let b = new B();
```

此时`super`指向`A.prototype`，`super.p()`相当于`A.prototype.p()`

==由于指向父类的原型对象，因此父类实例上的方法和属性是无法通过`super`调用的==

此时调用父类的方法，方法内部的`this`指向当前的子类实例

```javascript
class A {
  constructor() {
    this.x = 1;
  }
  print() {
    console.log(this.x);
  }
}

class B extends A {
  constructor() {
    super();
    this.x = 2;
  }
  m() {
    super.print();
  }
}

let b = new B();
b.m() // 2
```

由于方法内部的`this`指向子类实例，如果通过`super`对某个属性赋值，会变成对子类实例的属性赋值

```javascript
class A {
  constructor() {
    this.x = 1;
  }
}

class B extends A {
  constructor() {
    super();
    this.x = 2;
    super.x = 3; //相当于 this.x = 3
    console.log(super.x); // 相当于 A.prototype.x  所以返回undefined
    console.log(this.x); // 3
  }
}

let b = new B();
```



`super`用在静态方法中，指向父类而不是父类的原型

```javascript
class Parent {
  static myMethod(msg) {
    console.log('static', msg);
  }

  myMethod(msg) {
    console.log('instance', msg);
  }
}

class Child extends Parent {
  static myMethod(msg) {
    super.myMethod(msg);
  }

  myMethod(msg) {
    super.myMethod(msg);
  }
}

Child.myMethod(1); // static 1

var child = new Child();
child.myMethod(2); // instance 2
```

在子类的静态方法中通过`super`调用父类的方法，方法内部的`this`指向当前的子类，而不是子类的实例

## 类的prototype属性和`__proto__`属性

1. 子类的`__proto__`表示构造函数的继承，指向父类
2. 子类`prototype`属性的`__proto__`属性，表示方法的继承，总是指向父类的`prototype`属性

```javascript
class A {
}

class B extends A {
}

B.__proto__ === A // true
B.prototype.__proto__ === A.prototype // true
```

`extends`关键字后可以跟多种类型值

```javascript
class B extends A {
}
```

只要`A`是一个有`prototype`属性的函数就能被`B`继承

因此`A`可以是任意函数

此外还有两种情况：

1. `Object`：

   ```javascript
   class A extends Object {
   }
   
   A.__proto__ === Object // true
   A.prototype.__proto__ === Object.prototype // true
   ```

2. 不存在任何继承：

   ```javascript
   class A {
   }
   
   A.__proto__ === Function.prototype // true
   A.prototype.__proto__ === Object.prototype // tru
   ```

   `A`此时作为一个基类，等于一个普通函数，因此继承了`Function.prototype`，但是`A`调用后返回一个空对象（`Object`实例），因此`A.prototype.__proto__`指向构造函数的`prototype`

### 实例的`__proto__`属性

子类实例的`__proto__`属性的`__proto__`属性，指向父类实例的`__proto__`属性

即子类的原型的原型，是父类的原型

```javascript
class Point{};
class ColorPoint extends Point{}
var p1 = new Point(2, 3);
var p2 = new ColorPoint(2, 3, 'red');

p2.__proto__ === p1.__proto__ // false
p2.__proto__.__proto__ === p1.__proto__ // true
//通过子类实例的__proto__.__proto__属性可以修改父类实例的行为
p2.__proto__.__proto__.printName = function () {
  console.log('Ha');
};
p1.printName() // "Ha"
```

## 原生构造函数的继承

原生构造函数大致有：

- Boolean()
- Number()
- String()
- Array()
- Date()
- Function()
- RegExp()
- Error()
- Object()

ES6允许通过`class..extends`来继承原生构造函数

```javascript
class MyArray extends Array {
  constructor(...args) {
    super(...args);
  }
}

var arr = new MyArray();
arr[0] = 12;
arr.length // 1

arr.length = 0;
arr[0] // undefined
```

## Mixin模式的实现

即多个对象合成一个新的对象，新对象具有各个组成成员的接口

简单实现：

```javascript
const a = {
  a: 'a'
};
const b = {
  b: 'b'
};
const c = {...a, ...b}; // {a: 'a', b: 'b'}
```

更完备的方法：

```javascript
function mix(...mixins) {
  class Mix {
    constructor() {
      for (let mixin of mixins) {
        copyProperties(this, new mixin()); // 拷贝实例属性
      }
    }
  }

  for (let mixin of mixins) {
    copyProperties(Mix, mixin); // 拷贝静态属性
    copyProperties(Mix.prototype, mixin.prototype); // 拷贝原型属性
  }

  return Mix;
}

function copyProperties(target, source) {
  for (let key of Reflect.ownKeys(source)) {
    if ( key !== 'constructor'
      && key !== 'prototype'
      && key !== 'name'
    ) {
      let desc = Object.getOwnPropertyDescriptor(source, key);
      Object.defineProperty(target, key, desc);
    }
  }
}
```































