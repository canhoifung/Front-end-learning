# 原型链

1. 只有==函数对象==才有`prototype`属性

   ```javascript
   function Foo(){};
   var foo = new Foo();
   ```

   例子中`foo`是一个实例对象不是函数对象，因此没有`prototype`

2. ==所有对象==都有`__proto__`，指向构造函数的==原型对象==

3. `Object.create()`是以参数对象作为新对象的`__proto__`

![img](../JS疑难杂症.assets/13902845-babea8f0cde0d791.webp)



# new

`new`命令实际执行步骤：

1.  以构造器的prototype属性为原型，创建新对象
2. 将this(也就是上一句中的新对象)和调用参数传给构造器，执行
3.  如果构造器没有手动返回对象，则返回第一步创建的新对象，如果有，则舍弃掉第一步创建的新对象，返回手动return的对象。

js实现：

```javascript
let newMethod = function (Parent, ...rest) {
    // 1.以构造器的prototype属性为原型，创建新对象；
    let child = Object.create(Parent.prototype);
    // 2.将this和调用参数传给构造器执行
    let result = Parent.apply(child, rest);
    // 3.如果构造器没有手动返回对象，则返回第一步的对象
    return typeof result  === 'object' ? result : child;
};
```



# Object.create()

将参数作为新对象的原型，并返回新对象

```javascript
Object.create = target=>{
    const F = function(){}
    F.prototype = target;
    return new F();
};
```























