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

