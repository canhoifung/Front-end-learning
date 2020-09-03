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

是类的默认方法，通过`new`命令生成实例对象时会自动调用这个方法

如果没有显式定义就会默认添加一个空的

```javascript
class Point {
}

// 等同于
class Point {
  constructor() {}
}
```

方法默认返回`this`，但可以指定返回另一个对象

## 类的实例

必须使用`new`调用，否则报错

## 取值函数和存值函数

在类内部可以用`set`、`get`对某个属性设置存值函数和取值函数，拦截存取行为

```javascript
class MyClass {
  constructor() {
    // ...
  }
  get prop() {
    return 'getter';
  }
  set prop(value) {
    console.log('setter: '+value);
  }
}

let inst = new MyClass();

inst.prop = 123;
// setter: 123

inst.prop
// 'getter'
```

这两个函数是设置在属性的Descriptor上

```javascript
class CustomHTMLElement {
  constructor(element) {
    this.element = element;
  }

  get html() {
    return this.element.innerHTML;
  }

  set html(value) {
    this.element.innerHTML = value;
  }
}

var descriptor = Object.getOwnPropertyDescriptor(
  CustomHTMLElement.prototype, "html"
);

"get" in descriptor  // true
"set" in descriptor  // true
```

## 属性表达式

类的属性名可以使用表达式的形式

```javascript
let methodName = 'getArea';

class Square {
  constructor(length) {
    // ...
  }

  [methodName]() {
    // ...
  }
}
```

## Class表达式

与函数一致

```javascript
const MyClass = class Me {
  getClassName() {
    return Me.name;
  }
};

let inst = new MyClass();
inst.getClassName() // Me
Me.name // ReferenceError: Me is not defined
```

可以省略类名：

```javascript
const MyClass = class { /* ... */ };
```

## 注意点

1.  严格模式

类和模块内部默认为严格模式

2. 没有变量提升
3. name属性

类的`name`总是返回紧跟在`class`关键字后面的类名

4. Generator方法

某个方法前加上`*`，就表示该方法是一个Generator函数

```javascript
class Foo {
  constructor(...args) {
    this.args = args;
  }
  * [Symbol.iterator]() {
    for (let arg of this.args) {
      yield arg;
    }
  }
}

for (let x of new Foo('hello', 'world')) {
  console.log(x);
}
// hello
// world
```

5. this的指向

类方法内部含有`this`，则默认指向类的实例，但若单独使用该方法可能会报错

因为class内部是严格模式，因此`this`实际指向了`undefined`

```javascript
class Logger {
  printName(name = 'there') {
    this.print(`Hello ${name}`);
  }

  print(text) {
    console.log(text);
  }
}

const logger = new Logger();
const { printName } = logger;
printName(); // TypeError: Cannot read property 'print' of undefined
```

## 静态方法

类中定义的方法，都会被实例继承

但如果方法前加上`static`关键字，则该方法不会被实例继承，而是会直接通过类来调用，即为静态方法

```javascript
class Foo {
  static classMethod() {
    return 'hello';
  }
}

Foo.classMethod() // 'hello'

var foo = new Foo();
foo.classMethod()
// TypeError: foo.classMethod is not a function
```

如果静态方法包含`this`，则指向类本身，而不是实例

且静态方法和非静态方法可以重名

```javascript
class Foo {
  static bar() {
    this.baz();
  }
  static baz() {
    console.log('hello');
  }
  baz() {
    console.log('world');
  }
}

Foo.bar() // hello
```

父类的静态方法可以被子类继承

```javascript
class Foo {
  static classMethod() {
    return 'hello';
  }
}

class Bar extends Foo {
}

Bar.classMethod() // 'hello'
```

也可以从`super`对象上调用静态方法

```javascript
class Foo {
  static classMethod() {
    return 'hello';
  }
}

class Bar extends Foo {
  static classMethod() {
    return super.classMethod() + ', too';
  }
}

Bar.classMethod() // "hello, too"
```

## 实例属性的新写法

除了定义在`constructor()`里面的`this`上，也可以定义在类的最顶层

```javascript
class IncreasingCounter {
  constructor() {
    this._count = 0;
  }
  get value() {
    console.log('Getting the current value!');
    return this._count;
  }
  increment() {
    this._count++;
  }
}
//等同于
class IncreasingCounter {
  _count = 0;
  get value() {
    console.log('Getting the current value!');
    return this._count;
  }
  increment() {
    this._count++;
  }
}
```

## 静态属性

即类本身的属性，而不是定义在实例对象`this`上的属性

```javascript
class Foo {
}

Foo.prop = 1;
Foo.prop // 1
```

只有这种写法明确规定可行

目前也有提案提议在实例属性前加上`static`关键字声明静态属性

```javascript
class MyClass {
  static myStaticProp = 42;

  constructor() {
    console.log(MyClass.myStaticProp); // 42
  }
}
```

## 私有方法和私有属性

### 现有解决方法

私有方法、私有属性，即==只能==在类的内部访问的方法和属性

目前ES6不支持，可以变通实现

1. 命名上加以区分

但不保险，外部仍然可以调用这个方法

```javascript
class Widget {

  // 公有方法
  foo (baz) {
    this._bar(baz);
  }

  // 私有方法
  _bar(baz) {
    return this.snaf = baz;
  }

  // ...
}
```

2. 将私有方法移出模块

```javascript
class Widget {
  foo (baz) {
    bar.call(this, baz);
  }

  // ...
}

function bar(baz) {
  return this.snaf = baz;
}
```

3. 利用`Symbol`的唯一性

但使用`Reflect.ownKeys`仍然可以获取

```javascript
const bar = Symbol('bar');
const snaf = Symbol('snaf');

export default class myClass{

  // 公有方法
  foo(baz) {
    this[bar](baz);
  }

  // 私有方法
  [bar](baz) {
    return this[snaf] = baz;
  }

  // ...
};
```

### 私有属性、方法的提案

在属性名前用`#`表示

在类外部使用就会报错

在类内部使用必须带上`#`

```javascript
class IncreasingCounter {
  #count = 0;
  get value() {
    console.log('Getting the current value!');
    return this.#count;
  }
  increment() {
    this.#count++;
  }
}
```

## new.target属性

一般用于构造函数中，返回`new`命令作用于的那个构造函数

如果构造函数不是通过`new`命令或`Reflect.construct()`调用，则返回`undefined`

可以用于确定构造函数是怎么调用的

```javascript
function Person(name) {
  if (new.target !== undefined) {
    this.name = name;
  } else {
    throw new Error('必须使用 new 命令生成实例');
  }
}

// 另一种写法
function Person(name) {
  if (new.target === Person) {
    this.name = name;
  } else {
    throw new Error('必须使用 new 命令生成实例');
  }
}

var person = new Person('张三'); // 正确
var notAPerson = Person.call(person, '张三');  // 报错
```

Class内部调用返回当前Class

子类继承父类时，`new.target`返回子类

```javascript
class Rectangle {
  constructor(length, width) {
    console.log(new.target === Rectangle);
    this.length = length;
    this.width = width;
  }
}
var obj = new Rectangle(3, 4); // 输出 true

class Square extends Rectangle {
  constructor(length, width) {
    super(length, width);
  }
}
var obj = new Square(3); // 输出 false
```



































