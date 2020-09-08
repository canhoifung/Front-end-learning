# this绑定优先级

显式绑定 > 隐式绑定 > 默认绑定

new绑定 > 隐式绑定 > 默认绑定

显式绑定和new绑定同时书写会直接报错



- 默认绑定

  函数调用时无任何调用前缀，指向全局对象

  严格模式下指向undefined

- 隐式绑定

  函数调用时，前面有调用它的对象，则this绑定在对象上

- 显示绑定

  通过call、apply、bind方法改变this

- new绑定

  指向new实例

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

