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



# Promise

[参考链接](https://mp.weixin.qq.com/s/ek41c2qoWg7WCCNyVvd2eA)

```javascript
function Promise(fn) {
  // Promise resolve时的回调函数集
  this.cbs = [];

  // 传递给Promise处理函数的resolve
  // 这里直接往实例上挂个data
  // 然后把onResolvedCallback数组里的函数依次执行一遍就可以
  const resolve = (value) => {
    // 注意promise的then函数需要异步执行
    setTimeout(() => {
      this.data = value;
      this.cbs.forEach((cb) => cb(value));
    });
  }

  // 执行用户传入的函数 
  // 并且把resolve方法交给用户执行
  fn(resolve.bind(this));
}

Promise.prototype.then = function (onResolved) {
  // 这里叫做promise2
  return new Promise((resolve) => {
    this.cbs.push(() => {
        //onResolved对应then传入函数
      const res = onResolved(this.data);
      if (res instanceof Promise) {
        // resolve的权力被交给了user promise
        res.then(resolve);
      } else {
        // 如果是普通值 就直接resolve
        // 依次执行cbs里的函数 并且把值传递给cbs
        resolve(res);
      }
    });
  });
};
```

实例：

```javascript
const fn = (resolve) => {
  setTimeout(() => {
    resolve(1);
  }, 500);
};

const promise1 = new Promise(fn);

promise1.then((res) => {
  console.log(res);
  // user promise
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(2);
    }, 500);
  });
});
```



# Promise --2

[参考链接](https://blog.csdn.net/qq_41672008/article/details/100639104)

```javascript
function _Promise(executor){
    this._status = 'pending';
    this._value = undefined;
    this._reason = undefined;
    this._onFulfilledCbs = [];
    this._onRejectedCbs = [];
    
    try{
        executor(this.resolve.bind(this),this.reject.bind(this));
    }catch(e){
        this.reject(e);
    }
};
_Promise.prototype.resolve = function(value){
    if(this._status === 'pending'){
        this._status = 'fullfilled';
        this._value = value;
        this._onFulfilledCbs.forEach(fn => fn(this._value));
    }
};

_Promise.prototype.reject = function(reason){
    if(this._status === 'pending'){
        this._status = 'rejected';
        this._reason = reason;
        this._onRejectedCbs.forEach(fn => fn(this._reason));
    }
};

_Promise.prototype.then = function(onFulfilled,onRejected){
    if(this._status === 'fullfilled'){
        let _isPromise = onFulfilled(this._value);
        if(_isPromise instanceof _Promise){
            return _isPromise;
        };
        return this;
    };
    if(this._status === 'rejected'){
        let _isPromise = onRejected(this._reason);
        if(_isPromise instanceof _Promise){
            return _isPromise;
        };
        return this;
    };
    if(this._status === 'pending'){
        this._onFulfilledCbs.push(onFulfilled);
        this._onRejectedCbs.push(onRejected);
    }
};

_Promise.prototype.catch = function(onRejected){
    if(this._status === 'fullfilled'){
        return;
    };
    if(this._status === 'rejected'){
        onRejected(this._reason);
    };
    if(this._status === 'pending'){
        this._onRejectedCbs.push(onRejected);
    }
};
```



# Promise--3

[参考链接](https://www.cnblogs.com/samsara-yx/p/12217818.html)

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
                this.onFulfilledCbs.push(value=>{
                    setTimeout(()=>{
                        try{
                            const data = onFulfilled(value);
                            _Promise.resolvePromise(promise2,data,resolve,reject);
                        }catch(e){
                            reject(e);
                        }
                    })
                });
                this.onRejectedCbs.push(reason=>{
                    setTimeout(()=>{
                        try{
                            const data = onRejected(reason);
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
};

_Promise.resolvePromise = function(promise2,data,resolve,reject){
    //data与promise相等
    if(promise2 === data){
        reject(new TypeErroe('Chaining cycle detected for promise'))
    };

    let flag = false;
    if(data instanceof _Promise){
        //判断data为Promise
        data.then(
            value=>{
                _Promise.resolvePromise(promise2,value,resolve,reject);
            },
            reason=>{
                reject(reason)
            }
        )
    } else if(data !==null && (typeof data === 'object' || typeof data === 'function')){
        //data为函数或对象
        try{
            const then = date.then;
            if(typeof then === 'function'){
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

