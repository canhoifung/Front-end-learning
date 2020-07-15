# Symbol

保证了每个属性的名字都独一无二，防止属性名的冲突

`Symbol`，表示独一无二的值



接收一个字符串作为参数，表示对Symbol实例的==描述==

```javascript
let s1 = Symbol('foo');
let s2 = Symbol('bar');

s1 // Symbol(foo)
s2 // Symbol(bar)

s1.toString() // "Symbol(foo)"
s2.toString() // "Symbol(bar)"
```

若参数是对象，会调用对象的`toString`方法将其转为字符串



不能和其他类型的值进行运算

不能使用`new`

能显式转为字符串和布尔值，不能转为数值

```javascript
let sym = Symbol('My symbol');

String(sym) // 'Symbol(My symbol)'
sym.toString() // 'Symbol(My symbol)'

Boolean(sym) // true
!sym  // false

Number(sym) // TypeError
sym + 2 // TypeError
```

## Symbol.prototype.description

返回Symbol的描述

## 作为属性名

```javascript
let mySymbol = Symbol();

// 第一种写法
let a = {};
a[mySymbol] = 'Hello!';

// 第二种写法
let a = {
  [mySymbol]: 'Hello!'
};

// 第三种写法
let a = {};
Object.defineProperty(a, mySymbol, { value: 'Hello!' });

// 以上写法都得到同样结果
a[mySymbol] // "Hello!"
```

==不能使用点运算符==

```javascript
const mySymbol = Symbol();
const a = {};

a.mySymbol = 'Hello!';
a[mySymbol] // undefined
a['mySymbol'] // "Hello!"
```

## 属性的遍历

Symbol作为属性名时，不会出现在：

1. `for...in`
2. `for...of`
3. `Object.keys()`
4. `Object.getOwnPropertyNames()`
5. `JSON.stringify()`

但可以通过：

`Object.getOwnPropertySymbols()`来获取制定对象的所有Symbol属性名

==不是一个私有属性==

## Symbol.for()，Symbol.keyFor()

`Symbol.for()`接受一个字符串作为参数，搜索有没有以该参数作为名称的Symbol值，有就返回这个值，没有就新建并==注册到全局==

```javascript
let s1 = Symbol.for('foo');
let s2 = Symbol.for('foo');

s1 === s2 // true
```



`Symbol.keyFor()`返回一个已登记的Symbol类型值的key

```javascript
let s1 = Symbol.for("foo");
Symbol.keyFor(s1) // "foo"

let s2 = Symbol("foo");
Symbol.keyFor(s2) // undefined
```

























