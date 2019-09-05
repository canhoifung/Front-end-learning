# Map与Set

>JavaScript的对象有个小问题，就是键必须是字符串。但实际上Number或者其他数据类型作为键也是非常合理的。为了解决这个问题，最新的==ES6==规范引入了新的数据类型`Map`。

## Map

`Map`是一组键值对的结构，具有极快的查找速度

> 相比`Array`，相同的数据查找需要用到两个`Array`数组

一个`key`对应一个`value`

```javascript
var m = new Map(); // 空Map
m.set('Adam', 67); // 添加新的key-value
m.set('Bob', 59);
m.has('Adam'); // 是否存在key 'Adam': true
m.get('Adam'); // 67
m.delete('Adam'); // 删除key 'Adam'
m.get('Adam'); // undefined
```

## Set

`Set`和`Map`类似，也是一组key的集合，但不存储value。由于key不能重复，所以，在`Set`中，没有重复的key

创建`Set`有两个方法，直接创建一个空的，或者提供一个`Array`作为输入

```javascript
var s1 = new Set(); // 空Set
var s2 = new Set([1, 2, 3]); // 含1, 2, 3

//重复的元素会自动过滤
var s = new Set([1, 2, 3, 3, '3']);
s; // Set {1, 2, 3, "3"}
```

添加元素使用`add(key)`，删除元素使用`delete(key)`：

```JavaScript
var s = new Set([1,2,3])
s.add(4);
s; // Set {1, 2, 3, 4}
s.add(4);
s; // 仍然是 Set {1, 2, 3, 4}

var s = new Set([1, 2, 3]);
s; // Set {1, 2, 3}
s.delete(3);
s; // Set {1, 2}
```