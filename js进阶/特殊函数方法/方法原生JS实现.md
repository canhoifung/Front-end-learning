# new

```javascript
let newMethod = function (Parent, ...rest) {
    // 1.以构造器的prototype属性为原型，创建新对象；
    let child = Object.create(Parent.prototype);
    // 2.将this和调用参数传给构造器执行
    let result = Parent.apply(child, rest);
    // 3.如果构造器没有手动返回对象，则返回第一步的对象
    return typeof result  === 'object' ? result : child;
}
```



# Object.create()

```javascript
Object.create = target=>{
    const F = function(){};
    F.prototype = target;
    return new F();
}
```



# Promise

[参考链接](https://mp.weixin.qq.com/s/ek41c2qoWg7WCCNyVvd2eA)

[参考链接](https://blog.csdn.net/qq_41672008/article/details/100639104)

[参考链接](https://www.cnblogs.com/samsara-yx/p/12217818.html)

[参考链接2](https://juejin.im/post/6844904088963022856#heading-0)

```javascript
class _Promise{
    constructor(handler){
        //判断参数是否为函数
        if(typeof handler !== 'function'){
            throw new TypeError(`${handler} is not a function`)
        };
        this.initValue();//初始化值
        this.bindThis();//绑定this

        try{
            handler(this.resolver,this.reject);
        }catch(e){
            this.reject(error);
        };
    }
    bindThis(){
        this.resolver = this.resolver.bind(this);
        this.reject = this.reject.bind(this);
    };
    initValue(){
        this.state = 'pending';
        this.value = null;
        this.reason = null;
        this.onFulfilledCbs = [];
        this.onRejectedCbs = [];
    };

    resolve(value){
        //若value也是一个promise
        ////resolve和reject都是当前promise的， 递归解析直到是普通值, 这里的resolve,reject都取的到，因为resolve的执行是在这两个函数执行之后，这里递归是防止value也是一个promise
        if(value instanceof Promise){
            value.then(resolve,reject);
            return;
        };
        
        if(this.state === 'pending'){
            this.state = 'fulfilled';
            this.value = value;
            //resolve成功执行
            this.onFulfilledCbs.forEach(fn=>fn(this.,value));
        }
    };
    reject(reason){
        if(this.state === 'pending'){
            this.state = 'rejected');
            this.reason = reason;
            this.onRejectedCbs.forEach(fn => fn(this.reason));
        }
    };
/**
 * [注册fulfilled状态/rejected状态对应的回调函数]
 * @param  {function} onFulfilled fulfilled状态时 执行的函数
 * @param  {function} onRejected  rejected状态时 执行的函数
 * @return {function} newPromsie  返回一个新的promise对象
 */
    then(onFulfilled,onRejected){
        if(typeof onFulfilled !== 'function'){
            onFulfilled = function(value){
                return value;
            }
        };
        if(typeof onRejected !== 'function'){
            onRejected = function(reason){
                return reason;
            }
        };

        if(this.state === 'fulfilled'){
            //模拟异步
            setTimeout(()=>{
                onFulfilled(this.value);
            })
        };
        if(this.state === 'reject'){
            setTimeout(()=>{
                onRejected(this.reason);
            })
        };

        let promise2 = new _Promise((resolve,reject)=>{
            if(this.state === 'fulfilled'){
                setTimeout(()=>{
                    try{
                        const data = onFulfilled(this.value);
                        _Promise.resolvePromise(promise2,data,resolve,reject);
                    }catch(e){
                        reject(e);
                    }
                })
            };
            if(this.state === 'rejected'){
                setTimeout(()=>{
                    try{
                        const data = onRejected(this.reason);
                        _Promise.resolvePromise(promise2,data,resolve,reject);
                    }catch(e){
                        reject(e);
                    }
                })
            };
            if(this.state === 'pending'){
                this.onFulfilledCbs.push(()=>{
                    setTimeout(()=>{
                        try{
                            const data = onFulfilled(this.value);
                            _Promise.resolvePromise(promise2,data,resolve,reject);
                        }catch(e){
                            reject(e);
                        }
                    })
                });
                this.onRejectedCbs.push(()=>{
                    setTimeout(()=>{
                        try{
                            const data = onRejected(this.reason);
                            _Promise.resolvePromise(promise2,data,resolve,reject);
                        }catch(e){
                            reject(e);
                        }
                    })
                })
            }
        });
        return promise2;
    };
    //catch相当于没有成功回调的then方法
    catch(errCallBack){
        return this.then(null,errCallback);
    }
};
/**
 * resolve中的值几种情况：
 * 1.普通值
 * 2.promise对象
 * 3.thenable对象/函数
 */
/**
 * 对resolve 进行改造增强 针对resolve中不同值情况 进行处理
 * @param  {promise} promise2 promise1.then方法返回的新的promise对象
 * @param  {[type]} x         promise1中onFulfilled/onRejected的返回值
 * @param  {[type]} resolve   promise2的resolve方法
 * @param  {[type]} reject    promise2的reject方法
 */
_Promise.resolvePromise = function(promise2,data,resolve,reject){
    //data与promise相等，会导致循环引用报错
    if(promise2 === data){
        reject(new TypeErroe('Chaining cycle detected for promise'))
    };

    let flag = false; //避免多次调用
    //判断data是否为_Promise对象
    if(data instanceof _Promise){
        if(data.status === 'pending'){
            //若为pending需要等待data被执行或拒绝，并解析value
            data.then(
                value=>{
                    _Promise.resolvePromise(promise2,value,resolve,reject);
                },
                reason=>{
                    reject(reason)
                }
            )
        }else{
            //若data已经处于fulfilled或者reject，则用相同值执行传递promise
            data.then(resolve,reject);
        }
    } else if(data !==null && (typeof data === 'object' || typeof data === 'function')){
        //data为函数或对象
        try{
            const then = date.then;
            if(typeof then === 'function'){ //判断是否为thenable对象
                then.call(
                    data,
                    value =>{
                        if(flag) return;
                        flag = true;
                        _Promise.resolvePromise(promise2,value,resolve,reject)
                    },
                    reason =>{
                        if(flag) return;
                        flag = true;
                        reject(reason);
                    }
                )
            } else {
                if (flag) return;
                flag = true;
                resolve(data);
            }
        }catch(e){
            if(flag) return;
            flag = true;
            reject(e);
        }
    }else{
        resolve(data);
    }
};
```

```javascript
new _Promise((resolve, reject) => {
    setTimeout(() => {
        resolve(1234567)
    }, 1000);
}).then((value) => {
    console.log(value, 'value')
    return 11111
}, (reason) => {
    console.log(reason, 'reason')
}).then((res) => {
    console.log(res, 'res')
})
```



# Promise.all

```javascript
/**
 * Promise.all Promise进行并行处理
 * 参数: promise对象组成的数组作为参数
 * 返回值: 返回一个Promise实例
 * 当这个数组里的所有promise对象全部进入FulFilled状态的时候，才会resolve。
 */
Promise.all = function(promises) {
    if(!Array.isArray(promises)){
        throw new Error("promises must be an array")
    }
    return new Promise((resolve, reject) => {
        let values = []
        let count = 0
        promises.forEach((promise, index) => {
            promise.then(value => {
                console.log('value:', value, 'index:', index)
                values[index] = value
                count++
                if (count === promises.length) {
                    resolve(values)
                }
            }, reason=>{
                reject(reason);
            })
        })
    })
}
```



# Promise.race

```javascript
/**
 * Promise.race
 * 参数: 接收 promise对象组成的数组作为参数
 * 返回值: 返回一个Promise实例
 * 只要有一个promise对象进入 FulFilled 或者 Rejected 状态的话，就会继续进行后面的处理(取决于哪一个更快)
 */
Promise.race = function(promises) {
    return new Promise((resolve, reject) => {
        promises.forEach((promise) => {
            promise.then(res=>{
                resolve(res);
            }, reason=>{
                reject(reason);
            });
        });
    });
}
```



# call()

```javascript
Function.prototype.call = function(context,...args){
    //确保函数在上下文环境中执行
    context = context instanceof Object ? context : {};
    context.fn = this;
    const result = context.fn(...args);
    //call不能污染上下文，因此要删掉
    delete context.fn;
    return result;
}
```



# apply()

```javascript
Function.prototype.apply = function(context,args){
    context = context instanceof Object ? context : {};
    context.fn = this;
    const result = args?context.fn(...args):context.fn();
    delete context.fn;
    return result;
}
```



# bind()

```javascript
Function.prototype.bind = function(context=window){
    //调用bind的一定要是一个函数
    if(typeof this !== 'function') throw Error(
        'not a function');
    const self = this;
    const args = [...arguments].slice(1);

    const temp = function(){};
    const resFn = function(){
        const innerArgs = [...arguments].slice(1);
        const finalArgs = args.concat(innerArgs);
        //判断是否使用了new
        //若返回函数作为构造函数搭配了new关键字，绑定的this就要被忽略
        return self.apply(this instanceof temp ? this : context,finalArgs)
    };
    //考虑实例化后对原型链的影响，等同执行了resFn.prototype = Object.create(this.prototype);
    temp.prototype = this.prototype;
    resFn.prototype = new temp();
    return resFn;
}
```



# instanceof

```javascript
function instance_of(L,R){
    const O = R.prototype;
    L = L.__proto__;
    while(true){
        if(L === null)return false;
        if(L === O)return true;
        L = L.__proto__;
    }
}
```

