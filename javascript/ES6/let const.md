# let const

let 定义的变量不会被变量提升，const 定义的常量不能被修改，let 和 const 都是块级作用域

提供了块级作用域

不再具备变量提升

声明的变量不属于顶层对象

```javascript
var a = 1;
// 如果在 Node 的 REPL 环境，可以写成 global.a
// 或者采用通用方法，写成 this.a
window.a // 1

let b = 1;
window.b // undefined
```

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
5. 外层作用域无法获取内层作用域的变量，但内部的可以==定义==外部作用域的同名变量

```javascript
{{{{
  {let insane = 'Hello World'}
  console.log(insane); // 报错
}}}};

{{{{
  let insane = 'Hello World';
  {let insane = 'Hello World'}
}}}};
```

## const

const定义的变量

+ 不可以被修改
+ 必须声明时进行初始化赋值
+ 基础数据类型不能被修改
+ 复合数据类型只保存指向堆内存的指标，对象或数组自身可以修改，指标不变

同样有暂时性死区，无法重复声明，变量不提升

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

赋值给冻结对象：

```javascript
const foo = Object.freeze({});
```

