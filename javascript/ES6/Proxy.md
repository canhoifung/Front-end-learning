# Proxy

用于修改某些操作的默认行为

在目标对象之前架设一层“拦截”，外界对该对象的访问，都必须先通过这层拦截，因此提供了一种机制，可以对外界的访问进行过滤和改写

构造函数：

```javascript
var proxy = new Proxy(target,handler);
```

`target`：表示要拦截的目标对象

`handler`：配置对象，用于定制拦截行为，若为空对象，则等同直通原对象

## 实例方法

### get（）

拦截属性读取操作
==可以被继承==

==三个参数：==

1. 目标对象
2. 属性名
3. proxy实例本身（可选）

```javascript
var person = {
  name: "张三"
};

var proxy = new Proxy(person, {
  get: function(target, propKey) {
    if (propKey in target) {
      return target[propKey];
    } else {
      throw new ReferenceError("Prop name \"" + propKey + "\" does not exist.");
    }
  }
});

proxy.name // "张三"
proxy.age // 抛出一个错误
```

==若属性的`configurable:false`且`writable:false`，则Proxy不能修改该属性==

```javascript
const target = Object.defineProperties({}, {
  foo: {
    value: 123,
    writable: false,
    configurable: false
  },
});

const handler = {
  get(target, propKey) {
    return 'abc';
  }
};

const proxy = new Proxy(target, handler);

proxy.foo  // TypeError: Invariant check failed
```

### set()

用于拦截某个属性的赋值操作

==四个参数：==

1. 目标对象
2. 属性名
3. 属性值
4. Proxt实例本身（可选）

```javascript
const handler = {
  set: function(obj, prop, value, receiver) {
    obj[prop] = receiver;
  }
};
const proxy = new Proxy({}, handler);
proxy.foo = 'bar';
proxy.foo === proxy // true
```

==若属性的`configurable:false`且`writable:false`，则set不起作用==

==严格模式下，只要没有返回`true`就会报错==

### apply()

拦截函数的调用、`call`和`apply`操作

==三个参数：==

1. 目标对象
2. 目标对象的上下文对象（this）
3. 目标对象的参数数组

```javascript
var twice = {
  apply (target, ctx, args) {
    return Reflect.apply(...arguments) * 2;
  }
};
function sum (left, right) {
  return left + right;
};
var proxy = new Proxy(sum, twice);
proxy(1, 2) // 6
proxy.call(null, 5, 6) // 22
proxy.apply(null, [7, 8]) // 30
```

### has()

用于拦截`HasProperty`操作,**而不是`HasOwnProperty`操作**

==两个参数：==

1. 目标对象
2. 需查询的属性名

==如果原对象不可配置或者禁止扩展，这时`has`拦截会报错==

生效操作：`in`运算符

不生效操作：`for..in`

### construct()

用于拦截`new`命令

==三个参数：==

1. 目标对象
2. 构造函数的参数对象
3. 创建实例对象时，`new`命令作用的构造函数

==必须返回一个对象==

```javascript
var handler = {
  construct (target, args, newTarget) {
    return new target(...args);
  }
};
```

```javascript
var p = new Proxy(function () {}, {
  construct: function(target, args) {
    console.log('called: ' + args.join(', '));
    return { value: args[0] * 10 };
  }
});

(new p(1)).value
// "called: 1"
// 10
```

### deleteProperty()

拦截`delete`操作

若抛出错误或返回`false`，则属性无法被`delete`操作

==目标对象自身的不可配置（configurable）的属性，不能被`deleteProperty`方法删除==

```javascript
var handler = {
  deleteProperty (target, key) {
    invariant(key, 'delete');
    delete target[key];
    return true;
  }
};
function invariant (key, action) {
  if (key[0] === '_') {
    throw new Error(`Invalid attempt to ${action} private "${key}" property`);
  }
}

var target = { _prop: 'foo' };
var proxy = new Proxy(target, handler);
delete proxy._prop
// Error: Invalid attempt to delete private "_prop" property
```

### defineProperty()

拦截`Object.defineProperty()`操作

```javascript
var handler = {
  defineProperty (target, key, descriptor) {
    return false;
  }
};
var target = {};
var proxy = new Proxy(target, handler);
proxy.foo = 'bar' // 不会生效
```

==如果目标对象不可扩展（non-extensible），则`defineProperty()`不能增加目标对象上不存在的属性，否则会报错。另外，如果目标对象的某个属性不可写（writable）或不可配置（configurable），则`defineProperty()`方法不得改变这两个设置==

### getOwnPropertyDescriptor()

拦截`Object.getOwnPropertyDescriptor()`，返回一个属性描述对象或者`undefined`

```javascript
var handler = {
  getOwnPropertyDescriptor (target, key) {
    if (key[0] === '_') {
      return;
    }
    return Object.getOwnPropertyDescriptor(target, key);
  }
};
var target = { _foo: 'bar', baz: 'tar' };
var proxy = new Proxy(target, handler);
Object.getOwnPropertyDescriptor(proxy, 'wat')
// undefined
Object.getOwnPropertyDescriptor(proxy, '_foo')
// undefined
Object.getOwnPropertyDescriptor(proxy, 'baz')
// { value: 'tar', writable: true, enumerable: true, configurable: true }
```

### getPrototypeOf()

用于拦截获取对象原型，比如：

- `Object.prototype.__proto__`
- `Object.prototype.isPrototypeOf()`
- `Object.getPrototypeOf()`
- `Reflect.getPrototypeOf()`
- `instanceof`

==返回值必须是对象或者`null`==

==若目标对象不可扩展（non-extensible）， `getPrototypeOf()`方法必须返回目标对象的原型对象==

```javascript
var proto = {};
var p = new Proxy({}, {
  getPrototypeOf(target) {
    return proto;
  }
});
Object.getPrototypeOf(p) === proto // true
```

### isExtensible()

拦截`Object.isExtensible()`操作

==只能返回布尔值==

==返回值必须与目标对象的`isExtensible`属性保持一致，否则就会抛出错误==



```javascript
var p = new Proxy({}, {
  isExtensible: function(target) {
    console.log("called");
    return true;
  }
});

Object.isExtensible(p)
// "called"
// true
```













