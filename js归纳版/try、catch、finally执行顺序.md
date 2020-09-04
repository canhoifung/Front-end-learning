1. 若存在`finally`语句，在`try`与`catch`中的`return`语句在执行之前都会先执行`finally`语句
2. 若`finally`中有`return`语句，那么直接`return`
3. 若`finally`中无`return`语句，则执行完毕后返回`try`或`catch`（取决与`catch`是否存在）中执行`return`语句

```javascript
(function a(){
    try{
        console.log('trystart');
        return 1;
        console.log('try2')
    }finally{
        console.log('finallystart');
        return 2;
        console.log('finally2')
    }
})();
//trystart
//finallystart
//2
```

