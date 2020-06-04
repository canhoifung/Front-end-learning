# JS表达式创建顺序和赋值顺序


```javascript
   var a = { n: 1};
   var b = a;
   a.x = a = { n: 2 };//方式1
   //a = a.x = { n: 2 };//方式2
   console.log(a.x);//undefined
   console.log(b.x);//{n:2}
```

   之所以a.x为undefined，是由于赋值表达式里面需要用到的变量都会先创建（如果事先没有的话）并指向null，此处a={n:2}还没开始赋值的时候就已经创建了a.x了，赋值之后a就变了，a.x不存在，因此为undefined

   JS表达式，严格按照从左到右计算，先计算所有变量，再进行赋值过程，如上题

   ```javascript
   a.x=         //此处获得了a.x的表达式结果，此时a={n:1}
       a=       //此时a为当前环境的变量，仍然a={n:1}
         {n:2}  //此时发生了赋值，变量a的值被覆盖，此时a={n:2}
   
   //此时原始的a，即上面的b为
   b；  //{x:{n:2},n:1};
   ```

   复现代码：

   ```javascript
   // 声明“原始的变量 a”
   var a = {n:1};
   
   // 使它的属性表冻结（不能再添加属性）
   Object.freeze(a);
   
   try {
     // 本节的示例代码
     a.x = a = {n:2};
   }
   catch (x) {
     // 异常发生，说明第二次赋值“a.x = ...”中操作的`a`正是原始的变量 a
     console.log('第二次赋值导致异常.');
   }
   
   // 第一次赋值是成功的
   console.log(a.n); //
   
   ```

   # for中let与var

from [[for循环中let与var的区别，块级作用域如何产生与迭代中变量i如何记忆上一步的猜想](https://www.cnblogs.com/echolun/p/10584703.html)]

常规问题：

```javascript
//使用var声明，得到3个3
var a = [];
for (var i = 0; i < 3; i++) {
  a[i] = function () {
    console.log(i);
  };
}
a[0](); //3
a[1](); //3
a[2](); //3
//使用let声明，得到0,1,2
var a = [];
for (let i = 0; i < 3; i++) {
  a[i] = function () {
    console.log(i);
  };
}
a[0](); //0
a[1](); //1
a[2](); //2
```

for循环执行顺序：

1. 设置循环变量
2. 判断循环变量是否符合要求
3. 满足则执行循环体
4. 循环变量自增



改写后var声明逻辑理解：

```javascript
{
  //我是父作用域
  let i = 0;
  if (0 < 3) {
    a[0] = function () {
      //我是子作用域
      console.log(i);
    };
  };
  i++; //为1
  if (1 < 3) {
    a[1] = function () {
      console.log(i);
    };
  };
  i++; //为2
  if (2 < 3) {
    a[2] = function () {
      console.log(i);
    };
  };
  i++; //为3
  // 跳出循环
}
//调用N次指向都是最终的3
a[0](); //3
a[1](); //3
a[2](); //3

```

改写后let声明逻辑理解：

由于let产生了块级作用域，因此每次迭代中的i都是独立存在的

ES6中说明，js引擎会在底层记住上一次循环后的i并赋值给新的一轮循环i

```javascript
var a = []; 
{
    //我是父作用域
    let i = 0;
    if (i < 3) {
        //这一步模拟底层实现
        let k = i;
        a[k] = function () {
            //我是子作用域
            console.log(k);
        };
    };
    i++; //为1
    if (i < 3) {
        let k = i;
        a[k] = function () {
            console.log(k);
        };
    };
    i++; //为2
    if (i < 3) {
        let k = i;
        a[k] = function () {
            console.log(k);
        };
    };
    i++; //为3
    // 跳出循环
}
a[0](); //0
a[1](); //1
a[2](); //2
```



加入引用数据概念后：

```javascript
var a = []
for (let y = {i: 0}; y.i < 3; y.i++) {
    a[y.i] = function () {
        console.log(y.i);
    };
};
a[0](); //3
a[1](); //3
a[2](); //3
```

此处的y绑定的是一个引用对象的地址，虽然每次循环会建立一个新的块级作用域，但他们指向的仍然是同一个引用地址

```javascript
var a = []; {
    //我是父作用域
    let y = {
        i: 0
    };
    if (y.i < 3) {
        //这一步模拟底层实现
        let k = y;
        a[k.i] = function () {
            //我是子作用域
            console.log(k.i);
        };
    };
    y.i++; //为1
    if (y.i < 3) {
        let k = y;
        a[k.i] = function () {
            console.log(k.i);
        };
    };
    y.i++; //为2
    if (y.i < 3) {
        let k = y;
        a[k.i] = function () {
            console.log(k.i);
        };
    };
    y.i++; //为3
    // 跳出循环
}
a[0](); //3
a[1](); //3
a[2](); //3
```



```javascript
var a = []
var b = {i:0};
for (let y = b.i; y < 3; y++) {
    a[y] = function () {
        console.log(y);
    };
};
a[0]();  //0
a[1]();  //1
a[2]();  //2
```



# this绑定优先级

显式绑定 > 隐式绑定 > 默认绑定

new绑定 > 隐式绑定 > 默认绑定

显式绑定和new绑定同时书写会直接报错



+ 默认绑定

  函数调用时无任何调用前缀，指向全局对象

  严格模式下指向undefined

+ 隐式绑定

  函数调用时，前面有调用它的对象，则this绑定在对象上

+ 显示绑定

  通过call、apply、bind方法改变this

+ new绑定

  new实例

```javascript
//显示>隐式
let obj = {
    name:'行星飞行',
    fn:function () {
        console.log(this.name);
    }
};
obj1 = {
    name:'时间跳跃'
};
obj.fn.call(obj1);// 时间跳跃
```

```javascript
//new>隐式
obj = {
    name: '时间跳跃',
    fn: function () {
        this.name = '听风是风';
    }
};
let echo = new obj.fn();
echo.name;//听风是风
```



# 函数中的实参形参局部变量

若实参为基本数据类型，传入函数的实际是实参的副本，存储在函数中的变量组中，因此在函数中修改实参值不会影响函数外的值

若实参为复杂数据类型，传入函数的是地址，因此函数中修改实参会直接修改地址信息



由于通过var重复声明的变量，会被忽略，因此在函数中若有声明实参，声明过程会被忽略

```javascript
var a=1;
(function A(a){
    console.log(a); //1
    var a=2;
    console.log(a);//2
})(a);
console.log(a); //1
```

```javascript
var a=1;
(function A(){
    console.log(a); //undefined
    var a=2;
    console.log(a);//2
})(a);
console.log(a); //1
```



# 只有函数对象有prototype属性

```javascript
function Foo(){};
var foo = new Foo();
```

foo是一个实例对象，但不是一个函数，因此没有prototype

Function，Object，Array，RegExp都是函数

所有对象都会有`__proto__`属性，指向构造函数的prototype

原型链就是根据`__proto_`属性往上的过程，查找对象属性方法时，对象没有，就到`constructor`去找，没有就到`__proto__`去找，再没有就到`__proto__.constructor`去找

![img](JS疑难杂症.assets/13902845-babea8f0cde0d791.webp)

而`Object.create()`则是创建一个新对象，用参数对象作为新对象的`__proto__`



# 宏任务和微任务

异步任务的两种

![img](JS疑难杂症.assets/1053223-20180831162152579-2034514663.png)

![img](JS疑难杂症.assets/1053223-20180831162350437-143973108.png)

例子：

```javascript
//同步任务
console.log(1);
//宏任务
setTimeout(()=>{
    console.log(2);
},0);
//微任务
Promise.resolve(3).then(b=>{
    console.log(b);
});

//  1 3 2
```

## 宏任务

| #                     | 浏览器 | Node |
| --------------------- | ------ | ---- |
| setTimeout            | √      | √    |
| setInterval           | √      | √    |
| setImmediate          | x      | √    |
| requestAnimationFrame | √      | x    |

## 微任务

| #                          | 浏览器 | Node |
| -------------------------- | ------ | ---- |
| process.nextTick           | x      | √    |
| MutationObserver           | √      | x    |
| Promise.then catch finally | √      | √    |

## 例子

```javascript
//主线程直接执行
console.log('1');
//丢到宏事件队列中
setTimeout(function() {
    console.log('2');
    /**
    node.js下执行的
    process.nextTick(function() {
        console.log('3');
    }) 
    **/
    new Promise(function(resolve) {
        console.log('4');
        resolve();
    }).then(function() {
        console.log('5')
    })
})
//微事件1
/**
node.js下执行的
process.nextTick(function() {
    console.log('6');
})
**/
//主线程直接执行
new Promise(function(resolve) {
    console.log('7');
    resolve();
}).then(function() {
    //微事件2
    console.log('8')
})
//丢到宏事件队列中
setTimeout(function() {
    console.log('9');
    /**
    node.js下执行的
    process.nextTick(function() {
        console.log('10');
    })
    **/
    new Promise(function(resolve) {
        console.log('11');
        resolve();
    }).then(function() {
        console.log('12')
    })
})
```

首先浏览器执行js进入第一个宏任务进入主线程, 直接打印console.log('1')

+ 遇到 **setTimeout**  分发到宏任务Event Queue中
+ 遇到 process.nextTick 丢到微任务Event Queue中
+ 遇到 Promise， new Promise 直接执行 输出 console.log('7');
+ 执行then 被分发到微任务Event Queue中``
+ 第一轮宏任务执行结束，开始执行微任务 打印 6,8
+ 第一轮微任务执行完毕，执行第二轮宏事件，执行setTimeout
+ 先执行主线程宏任务，在执行微任务，打印'2,4,3,5'
+ 在执行第二个setTimeout,同理打印 ‘9,11,10,12’
+ 整段代码，共进行了三次事件循环，完整的输出为1，7，6，8，2，4，3，5，9，11，10，12。

# 闭包

```javascript
function test(){
    var n=4399;
    function add(){
        n++;
        console.log(n);
    }
    
    return {n:n,add:add};
};
var result = test();
var result2 = test();
result.add(); //4400
result.add(); //4401
console.log(result.n);  //4399
result2.add(); //4400
```

此处`test()`产生了闭包，返回的函数`add()`获取到的是`test`中的`n`，与`result.n`无关

若与`result.n`有关，则要用`this`绑定

```javascript
function test(){
    var n=4399;
    function add(){
        this.n++;
        console.log(this.n);
    }
    
    return {n:n,add:add};
};
var result = test();
var result2 = test();
result.add(); //4400
result.add(); //4401
console.log(result.n);  //4401
result2.add(); //4400
```

# new function()

```javascript
'foo' == new function(){return String('foo');}; // false

'foo' == new function(){return new String('foo')};//true
```

String(‘foo’)  返回一个String类型的’foo’

new String(‘foo’) 返回一个object类型的 String(‘foo’)



首先了解一下new一个对象进行了什么操作：

```javascript
function Person(){
    this.age = 1;
};
var person = new Person();
```

1. 创建空的JS对象

   ```javascript
   var obj = new Object();
   ```

2. 将空对象的原型链上级设置成Person的原型函数

   ```javascript
   obj.__proto__ = Person.prototype;
   ```

3. 更换this调用

   ```javascript
   Person.call(obj);
   ```

4. 返回obj

   ```javascript
   return obj;
   ```

此时如果new的函数返回了一个基础类型，会忽略基础类型，而返回创建的对象obj

如果new的函数返回的是一个对象，会忽略新建的对象obj，返回函数中返回的对象











