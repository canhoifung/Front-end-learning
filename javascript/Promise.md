# Promise对象
**Promise对象有三种状态**,分别是:  
1. pending:等待中,或进行中,表示还没有得到结果;  
2. resolved(Fulfilled):已经完美,表示得到了我们想要的结果,可以继续往下执行;  
3. rejected:也表示得到结果,但是由于结果并非我们所愿,因此拒绝执行.  
>三种状态不受外界影响,且只能从pending改为resolved或rejected,且**不可逆**  

在Promise对象的构造函数中，将一个函数作为第一个参数。而这个函数，就是用来处理Promise的状态变化。

```JavaScript
new Promise(function(resolve, reject) {
    if(true) { resolve() };
    if(false) { reject() };
})
```
>resolve和reject为一个函数,分别是将状态修改为resolve或reject

# Promise对象的then方法
**then方法**可以接收构造函数中处理的状态变化，并分别对应执行。  
then方法有2个参数，第一个函数接收resolved状态的执行，第二个参数接收reject状态的执行。  

```JavaScript
function fn(num) {
    return new Promise(function(resolve, reject) {
        if (typeof num == 'number') {
            resolve();
        } else {
            reject();
        }
    }).then(function() {
        console.log('参数是一个number值');
    }, function() {
        console.log('参数不是一个number值');
    })
}

fn('hahha');
fn(1234);
```