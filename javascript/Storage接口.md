# Storage接口

用于脚本在浏览器保存数据，有两个对象部署了这个接口

`window.sessionStorage`和`window.localStorage`

`sessionStorage`保存的数据用于浏览器的一次会话，会话结束数据清空

`localStorage`保存的数据长期存在，下一次访问该网站时可以直接读取以前保存的数据

每个域名的存储上限视浏览器而定，且都受同域限制

## 属性和方法

### `Storage.length`

返回保存的数据项个数

### Storage.setItem()

用于存入数据，接收两个参数：

+ 键名（字符串）
+ 保存的数据（字符串）

若键名已存在，新数据会覆盖旧数据

若参数不是字符串，会转为字符串再存入浏览器

若存储空间已满则会报错

```javascript
window.sessionStorage.setItem(3, { foo: 1 });
window.sessionStorage.getItem('3') // "[object Object]"

window.sessionStorage.setItem('key', 'value');
window.localStorage.setItem('key', 'value');
//多种写法
window.localStorage.foo = '123';
window.localStorage['foo'] = '123';
window.localStorage.setItem('foo', '123');
```

### Storage.getItem()

用于读取数据

参数为键名，若键名不存在则返回`null`

键名会被自动转为字符串格式

### Storage.removeItem()

用于清除某个键名对应的键值

参数为键名，若键名不存在则没有反应

### Storage.clear()

用于清楚所有保存的数据

返回`undefined`

### Storage.key()

接受一个整数作为参数（0开始），返回该位置对应的键值

```javascript
window.sessionStorage.setItem('key', 'value');
window.sessionStorage.key(0) // "key"
```

## 事件

接口存储的数据发生变化时，都会触发storage事件

```javascript
window.addEventListener('storage',onStorageChange);
```

监听函数接受`event`实例对象作为参数，除StorageEvent接口外还有几个只读的属性：

- `StorageEvent.key`：字符串，表示发生变动的键名。如果 storage 事件是由`clear()`方法引起，该属性返回`null`。
- `StorageEvent.newValue`：字符串，表示新的键值。如果 storage 事件是由`clear()`方法或删除该键值对引发的，该属性返回`null`。
- `StorageEvent.oldValue`：字符串，表示旧的键值。如果该键值对是新增的，该属性返回`null`。
- `StorageEvent.storageArea`：对象，返回键值对所在的整个对象。也说是说，可以从这个属性上面拿到当前域名储存的所有键值对。
- `StorageEvent.url`：字符串，表示原始触发 storage 事件的那个网页的网址。

==它不在导致数据变化的当前页面触发，而是在同一个域名的其他窗口触发。也就是说，如果浏览器只打开一个窗口，可能观察不到这个事件。比如同时打开多个窗口，当其中的一个窗口导致储存的数据发生改变时，只有在其他窗口才能观察到监听函数的执行。可以通过这种机制，实现多个窗口之间的通信。==

































