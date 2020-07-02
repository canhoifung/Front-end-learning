# let，const

let 定义的变量不会被变量提升，const 定义的常量不能被修改，let 和 const 都是块级作用域

提供了块级作用域

不再具备变量提升

## let

1. 块级作用域

```JavaScript
{
    let _a = 20;
}
console.log(a);  // a is not defined

// ES5
console.log(a);   // undefined
var a = 20;

// ES6
console.log(a); // a is not defined
let a = 20;
```

2. 不能重复声明

```javascript
let a = 1;
var a = 3;//Identifier 'a' has already been declared

var b = 1;
let b = 3;//Identifier 'b' has already been declared

let c = 1;
let c = 2; //Identifier 'c' has already been declared
```

3. 暂时性死区

```javascript
var tmp = 123;
if(true){
    tmp = 'abc'; //ReferenceError
    let tmp;
};


let x=x;//ReferenceError

function bar(x = y, y = 2) {
  return [x, y];
}
bar(); // 报错

function bar1(x = 2, y = x) {
  return [x, y];
}
bar1(); // [2, 2]
```

`let`命令绑定块级作用域 ，在作用域内`let`声明前都是声明变量的死区，只要用到变量就会报错

4. 避免在块级作用域内声明函数，如果需要也要写成函数表达式而不是函数声明

## const

**const定义的变量不可以被修改,而且必须初始化**  
**const定义的基础数据类型不能被修改,但是当定义的是对象,则只保存指向堆内存的指标**

```JavaScript
const a;   //报错 未定义

const b=10;
const b=20; //报错 b已经被定义
b=30;       //报错 b不能被修改

const d={
	a:10,
	b:20,
}
d.c=20;      //添加属性可以成功
d.a=50;      //修改属性可以成功
d={
	a:10,
	b:20,
}            //报错,指向了另外一个对象

const e=[];  //对数组可执行的操作都可以,但是不能赋值为另外一个数组.
```

>想冻结对象,需要使用Object.freeze()方法;

```JavaScript
const foo=Object.freeze(a);

foo.b=20;  //常规模式时,不起作用;严格模式时,报错
```

# 箭头函数
```JavaScript
// es5
var fn = function(a, b) {
    return a + b;
}

// es6 箭头函数写法，当函数直接被return时，可以省略函数体的括号
const fn = (a, b) => a + b;

// es5
var foo = function() {
    var a = 20；
    var b = 30;
    return a + b;
}

// es6
const foo = () => {
   const a = 20;
   const b = 30;
   return a + b;
}

如果参数不是一个，就需要用括号()括起来：
// 两个参数:
(x, y) => x * x + y * y

// 无参数:
() => 3.14

// 可变参数:
(x, y, ...rest) => {
    var i, sum = x + y;
    for (i=0; i<rest.length; i++) {
        sum += rest[i];
    }
    return sum;
}

如果要返回一个对象，就要注意，如果是单表达式，这么写的话会报错：

// SyntaxError:
x => { foo: x }
因为和函数体的{ ... }有语法冲突，所以要改为：

// 尤其是返回JSON对象时
x => ({ foo: x })
```
>箭头函数可以替换函数表达式，但是不能替换函数声明  
>当函数参数只有一个时，括号可以省略；但是没有参数时，括号不可以省略。  
>函数体（中括号）中有且只有一行return语句时，中括号及return 关键字可以省略。

**特点:**
1. 没有this,super,arguments,new.target绑定  
2. 不能通过new关键字调用  
3. 没有原型  
4. 不能改变this的绑定 继承当前上下文的this  
5. 不支持arguments对象  
6. 不支持重复命名的参数  

# 继承 class、extends、super
```JavaScript
class Animal {
    constructor() {
        this.type = 'animal';
    }
    says(say) {
        console.log(this.type + ' says ' + say);
    }
}

let animal = new Animal();
animal.says('hello'); //animal says hello

//通过extends关键字实现继承
class Cat extends Animal {
    constructor() {
    //必须调用super方法,否则会报错
        super();
        this.type = 'cat';
    }
}

let cat = new Cat();
cat.says('hello'); //cat says hello


////////////////////
class Colorpoint extends Point {
  constructor(x,y,color){
      super(x,y); //调用父类的constructor(x,y)
      this.color = color
  }
  toString(){
  //调用父类的方法
      return this.color + ' ' + super.toString();
}
}
```
>constructor内定义的方法和属性是实例对象自己的，而constructor外定义的方法和属性则是所有实力对象可以共享的  

# 模版字符串
```JavaScript
// es6
const a = 20;
const b = 30;
const string = `${a}+${b}=${a+b}`;

// es5
var a = 20;
var b = 30;
var string = a + "+" + b + "=" + (a + b);
```
使用 `` 将整个字符串包裹起来，而在其中使用 ${} 来包裹一个变量或者一个表达式。

# 解析结构

```JavaScript
// 首先有这么一个对象
const props = {
    className: 'tiger-button',
    loading: false,
    clicked: true,
    disabled: 'disabled'
}

//获取loading与clicked
// es5
var loading = props.loading;
var clicked = props.clicked;

// es6
const { loading, clicked } = props;

// 给一个默认值，当props对象中找不到loading时，loading就等于该默认值
const { loading = false, clicked } = props;

//对于数组
// es6
const arr = [1, 2, 3];
const [a, b, c] = arr;

// es5
var arr = [1, 2, 3];
var a = arr[0];
var b = arr[1];
var c = arr[2];
```
数组以序列号一一对应，这是一个有序的对应关系。
而对象根据属性名一一对应，这是一个无序的对应关系。

# 函数默认参数
```JavaScript
//ES5
function add(x, y) {
    var x = x || 20;
    var y = y || 30;
    return x + y;
}

console.log(add()); // 50

//ES6
function add(x = 20, y = 30) {
    return x + y;
}

console.log(add());
```

# 展开运算符
```JavaScript
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 10, 20, 30];

// 这样，arr2 就变成了[1, 2, 3, 10, 20, 30];

//对对象数据
const obj1 = {
  a: 1,
  b: 2, 
  c: 3
}

const obj2 = {
  ...obj1,
  d: 4,
  e: 5,
  f: 6
}

// 结果类似于 const obj2 = Object.assign({}, obj1, {d: 4})

//用于解析结构
const add = (a, b, ...more) => {
    return more.reduce((m, n) => m + n) + a + b
}

console.log(add(1, 23, 1, 2, 3, 4, 5)) // 39
```

# 对象字面量与class
```JavaScript
const name = 'Jane';
const age = 20

// es6
const person = {
  name,
  age
}

// es5
var person = {
  name: name,
  age: age
};
```