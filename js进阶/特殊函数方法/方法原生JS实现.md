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



# Promise--2

```javascript
function _Promise(resolver){
    this._status = 'pending';
    this._result = '';
    resolver(this.resolve.bind(this),this.reject.bind(this));
};
_Promise.prototype.resolve = function(result){
    if(this._status == 'pending'){
        this._status = 'fullfilled';
        this._result = result;
    }
};
_Promise.prototype.reject = function(result){
    if(this._status == 'pending'){
        this._status = 'rejected';
        this._result = result;
    }
};
_Promise.prototype.catch = function(isReject){
    if(this._status === 'rejected'){
        var err = new TypeError(this._result);
        var _isPromise = isReject(err);
        if(_isPromise instanceof _Promise){
            return _isPromise;
        };
        return this;
    }
}
//考虑到Promise.then().then()链式调用，then函数要返回一个_Promise
_Promise.prototype.then = function(isResolve,isReject){
    if(this._status === 'fullfilled'){
        var _isPromise = isResolve(this._result);
        if(_isPromise instanceof _Promise){
            return _isPromise;
        };
        return this;
    }else if(this._status === 'rejected' && arguments[1]){
        var err = new TypeError(this._result);
        var _isPromise = isReject(err);
        if(_isPromise instanceof _Promise){
            return _isPromise;
        };
        return this;
    }
}
```

