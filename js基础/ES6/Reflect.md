# Reflect

 设计目的：

1.  将`Object`对象的一些明显属于语言内部的方法（比如`Object.defineProperty`），放到`Reflect`对象上。现阶段，某些方法同时在`Object`和`Reflect`对象上部署，未来的新方法将只部署在`Reflect`对象上。也就是说，从`Reflect`对象上可以拿到语言内部的方法。
2. 修改某些`Object`方法的返回结果，让其变得更合理。比如，`Object.defineProperty(obj, name, desc)`在无法定义属性时，会抛出一个错误，而`Reflect.defineProperty(obj, name, desc)`则会返回`false`

3. 让`Object`操作都变成函数行为。某些`Object`操作是命令式，比如`name in obj`和`delete obj[name]`，而`Reflect.has(obj, name)`和`Reflect.deleteProperty(obj, name)`让它们变成了函数行为。
4. `Reflect`对象的方法与`Proxy`对象的方法一一对应，只要是`Proxy`对象的方法，就能在`Reflect`对象上找到对应的方法。这就让`Proxy`对象可以方便地调用对应的`Reflect`方法，完成默认行为，作为修改行为的基础。也就是说，不管`Proxy`怎么修改默认行为，你总可以在`Reflect`上获取默认行为。

## 静态方法

大部分和`Object`对象同名方法作用相同，且与`Proxy`对象的方法一一对应

### Reflect.get(target,name,receiver)

查找并返回`target`的`name`属性，若无则返回`undefined`

==若`name`属性部署了读取函数，则读取函数的`this`绑定`receiver`==

==`target`必须是对象，否则报错==

```javascript
var myObject = {
  foo: 1,
  bar: 2,
  get baz() {
    return this.foo + this.bar;
  },
};

var myReceiverObject = {
  foo: 4,
  bar: 4,
};

Reflect.get(myObject, 'baz', myReceiverObject) // 8
```

### Reflect.set(target,name,value,receiver)

设置`target`对象的`name`属性为`value`

==若`name`属性部署了赋值函数，则读取函数的`this`绑定`receiver`==

```javascript
var myObject = {
  foo: 4,
  set bar(value) {
    return this.foo = value;
  },
};

var myReceiverObject = {
  foo: 0,
};

Reflect.set(myObject, 'bar', 1, myReceiverObject);
myObject.foo // 4
myReceiverObject.foo // 1
```

`Proxy.set`的`receiver`总是指向当前的`Proxy`实例

`Reflect.set`传入了`receiver`就会将属性赋值到`receiver`上，会触发`defineProperty`拦截

### Reflect.has(obj,name)

对应`name in obj`里面的`in`运算符

### Reflect.deleteProperty(obj,name)

等同于`delete obj[name]`

删除成功，或者被删除的属性不存在，返回`true`

删除失败，被删除的属性依然存在，返回`false`。

### Reflect.construct(target,args)

等同于`new target(...args)`

==target不是函数就会报错==

### Reflect.getPrototypeOf(obj)

用于读取对象的`__proto__`，相当于`Object.getPrototypeOf(obj)`

参数不是对象就报错

而`Object`的会将参数转为对象再运行

### Reflect.setPrototypeOf(obj,newProto)

相当于`Object.setPrototypeOf(obj,newProto)`

返回布尔值

### Reflect.apply(func,thisArg,args)

相当于`Function.prototype.apply.call(func,thisArg,args)`

### Reflect.definePropperty(target,propertyKey,attributes)

基本等同于`Object.defineProperty`

### Reflect.getOwnPropertyDescriptor(target,proppertyKey)

等同于`Object.getOwnPropertyDescriptor`

### Reflect.isExtensible(target)

对应`Object.isExtensible`

### Reflect.preventExtensions(target)

对应`Object.preventExtensions`

返回布尔值

### Reflect.ownKeys(target)

返回对象的所有属性

等同于`Object.getOwnPropertyNames`与`Object.getOwnPropertySymbols`之和

## 实例：观察者模式

函数自动观察数据对象，一旦对象变化，函数自动执行

```javascript
const queuedObservers = new Set();

const observe = fn => queuedObservers.add(fn);
const observable = obj => new Proxy(obj, {set});

function set(target, key, value, receiver) {
  const result = Reflect.set(target, key, value, receiver);
    //自动执行所有观察者函数
  queuedObservers.forEach(observer => observer());
  return result;
}
```









