1. ```javascript
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
   
   