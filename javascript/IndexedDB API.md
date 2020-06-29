# IndexedDB API

随着浏览器的功能不断增强，越来越多的网站开始考虑，将大量数据储存在客户端，这样可以减少从服务器获取数据，直接从本地获取数据

Cookie 的大小不超过 4KB，且每次请求都会发送回服务器

LocalStorage 在 2.5MB 到 10MB 之间（各家浏览器不同），而且不提供搜索功能，不能建立自定义的索引

IndexedDB可以理解为浏览器提供的本地数据库

+ 可以被网页脚本创建和操作
+ 允许存储大量数据
+ 提供查找接口
+ 可以建立索引
+ 不支持SQL查询语句，更接近NoSQL数据库

还有一下特点：

1. 键值对存储。内部采用对象仓库存放数据，每个数据记录有对应的==独一无二==的主键
2. 异步。操作时不会锁死浏览器，防止大量数据的读写，拖慢页面
3. 支持失误。可以回滚
4. 同源限制。每个数据库对应创建它的域名，不能跨域
5. 存储空间大。一般不少于250MB，没有上限
6. 支持二进制存储。可以存储ArrayBuffer对象和Blob对象

## 概念

### 数据库 IDBDatabase 对象

一系列相关数据的容器，每个域名都可以新建任意多个数据库

同一时刻只能有一个版本的数据库存在

修改数据库结构需要通过升级数据库版本来完成

### 对象仓库 IDBObjectStore对象

每个数据库包含若干个对象仓库

### 数据记录

对象仓库保存的内容为数据记录

每条数据记录只有主键和数据体两部分，主键用于建立默认索引，==必须唯一==

主键可以是数据记录里面的属性或整数编号

```javascript
{id:1,test:'foo'}
```

### 索引 IDBIndex对象

用于加速数据的检索

在对象仓库里面为不同属性建立索引

### 事务 IDBTranscation对象

数据记录的读写和删改需要通过事务完成

提供`error`、`abort`、`complete`三个事件用于监听操作结果

### 操作请求 IDBRequest对象

### 指针 IDBCursor对象

### 主键集合 IDBKeyRange对象

## 操作流程

### 打开数据库

使用`indexedDB.open()`

```javascript
var request = window.indexedDB.open(databaseName,version);
```

+ databaseName，表示数据库名字，若不存在就会新建
+ version，整数，表示数据库版本，若省略会默认当前版本，新建数据库默认为1

返回IDBRequest对象（操作请求），通过`error`、`success`、`upgradeneeded`处理操作结果

#### error事件

表示打开数据库失败

```javascript
request.onerror = function (event) {
  console.log('数据库打开报错');
};
```

#### success事件

表示成功打开

```javascript
var db;

request.onsuccess = function (event) {
  db = request.result;
  console.log('数据库打开成功');
};
```

通过`request.result`获取数据库对象

#### upgradeneeded事件

指定版本号大于实际版本号就会发生数据库升级事件

```javascript
var db;

request.onupgradeneeded = function (event) {
  db = event.target.result;
}
```

通过`target.result`获取数据库实例

### 新建数据库

新建数据库会触发`upgradeneeded`事件，后续操作在这个事件的监听函数内完成

新建数据库后，新建对象仓库：

```javascript
request.onupgradeneeded = function(event) {
  db = event.target.result;
  var objectStore = db.createObjectStore('person', { keyPath: 'id' });
}
```

新建一个叫做`person`的表格，主键为`id`

判断表格是否已经存在，不存在再新建

```javascript
request.onupgradeneeded = function (event) {
  db = event.target.result;
  var objectStore;
  if (!db.objectStoreNames.contains('person')) {
    objectStore = db.createObjectStore('person', { keyPath: 'id' });
  }
}
```

指定主键为递增整数：

```javascript
var objectStore = db.createObjectStore(
  'person',
  { autoIncrement: true }
);
```

新增索引：

```javascript
request.onupgradeneeded = function(event) {
  db = event.target.result;
  var objectStore = db.createObjectStore('person', { keyPath: 'id' });
  objectStore.createIndex('name', 'name', { unique: false });
  objectStore.createIndex('email', 'email', { unique: true });
}
```

`IDBObject.createIndex()`的三个参数分别为:

+ 索引名称
+ 索引所在的属性
+ 配置对象（说明该属性是否包含重复的值）

### 新增数据

通过事务向对象仓库写入数据记录

```javascript
function add() {
    //指定表格名称和操作模式（只读或读写）
  var request = db.transaction(['person'], 'readwrite')
    .objectStore('person')
    .add({ id: 1, name: '张三', age: 24, email: 'zhangsan@example.com' });

  request.onsuccess = function (event) {
    console.log('数据写入成功');
  };

  request.onerror = function (event) {
    console.log('数据写入失败');
  }
}

add();
```

### 读取数据

通过事务完成

```javascript
function read() {
   var transaction = db.transaction(['person']);
   var objectStore = transaction.objectStore('person');
    //get参数为主键的值
   var request = objectStore.get(1);

   request.onerror = function(event) {
     console.log('事务失败');
   };

   request.onsuccess = function( event) {
      if (request.result) {
        console.log('Name: ' + request.result.name);
        console.log('Age: ' + request.result.age);
        console.log('Email: ' + request.result.email);
      } else {
        console.log('未获得数据记录');
      }
   };
}

read();
```

### 遍历数据

使用指针对象IDBCursor

```javascript
function readAll() {
  var objectStore = db.transaction('person').objectStore('person');

   objectStore.openCursor().onsuccess = function (event) {
     var cursor = event.target.result;

     if (cursor) {
       console.log('Id: ' + cursor.key);
       console.log('Name: ' + cursor.value.name);
       console.log('Age: ' + cursor.value.age);
       console.log('Email: ' + cursor.value.email);
       cursor.continue();
    } else {
      console.log('没有更多数据了！');
    }
  };
}

readAll();
```

### 更新数据

```javascript
function update() {
  var request = db.transaction(['person'], 'readwrite')
    .objectStore('person')
    .put({ id: 1, name: '李四', age: 35, email: 'lisi@example.com' });

  request.onsuccess = function (event) {
    console.log('数据更新成功');
  };

  request.onerror = function (event) {
    console.log('数据更新失败');
  }
}

update();
```

### 删除数据

```javascript
function remove() {
  var request = db.transaction(['person'], 'readwrite')
    .objectStore('person')
    .delete(1);

  request.onsuccess = function (event) {
    console.log('数据删除成功');
  };
}

remove();
```

### 使用索引

如果不建立索引，默认只能搜索主键

设置后可以搜索任意字段

```javascript
//新建表格时对name字段建立索引
objectStore.createIndex('name', 'name', { unique: false });
```

```javascript
var transaction = db.transaction(['person'], 'readonly');
var store = transaction.objectStore('person');
var index = store.index('name');
var request = index.get('李四');

request.onsuccess = function (e) {
  var result = e.target.result;
  if (result) {
    // ...
  } else {
    // ...
  }
}
```

## indexedDB对象

浏览器原生提供

### indexedDB.open()

用于打开数据库

异步操作，但会立刻返回一个IDBOenDBRequest对象

```javascript
var openRequest = window.indexedDB.open('test', 1);
```

可能触发的四种事件：

- **success**：打开成功。
- **error**：打开失败。
- **upgradeneeded**：第一次打开该数据库，或者数据库版本发生变化。
- **blocked**：上一次的数据库连接还未关闭。

==第一次打开数据库，会先触发upgradeneeded再触发success==

```javascript
var openRequest = indexedDB.open('test', 1);
var db;

openRequest.onupgradeneeded = function (e) {
  console.log('Upgrading...');
}

openRequest.onsuccess = function (e) {
  console.log('Success!');
  db = openRequest.result;
}

openRequest.onerror = function (e) {
  console.log('Error');
  console.log(e);
}
```

### indexedDB.deleteDatabase()

用于删除一个数据库，参数为数据库名称

异步操作，但会立刻返回一个IDBOenDBRequest对象

操作结果以事件`success`或者`error`来通知

```javascript
var DBDeleteRequest = window.indexedDB.deleteDatabase('demo');

DBDeleteRequest.onerror = function (event) {
  console.log('Error');
};

DBDeleteRequest.onsuccess = function (event) {
  console.log('success');
};
```

调用`deleteDatabase()`方法以后，当前数据库的其他已经打开的连接都会接收到`versionchange`事件。

注意，删除不存在的数据库并不会报错。

### indexedDB.cmp()

比较两个值是否为indexedDB的相同的主键

返回一个整数：

+ `0`表示相同
+ `1`表示第一个更大
+ `-1`表示第一个更小

```javascript
window.indexedDB.cmp(1, 2) // -1
```

==如果参数是布尔值或者对象会报错==

## IDBRequest对象

IDBRequest表示打开的数据库连接

`indexedDB.open()`和`indexedDB.deleteDatabase()`都会返回这个对象

对象的所有操作都是异步的，需要通过`readystate`判断是否完成

操作`done`后触发`success`或者`error`，可以通过`result`或`error`获取操作结果

属性有：

- `IDBRequest.readyState`：等于`pending`表示操作正在进行，等于`done`表示操作正在完成。
- `IDBRequest.result`：返回请求的结果。如果请求失败、结果不可用，读取该属性会报错。
- `IDBRequest.error`：请求失败时，返回错误对象。
- `IDBRequest.source`：返回请求的来源（比如索引对象或 ObjectStore）。
- `IDBRequest.transaction`：返回当前请求正在进行的事务，如果不包含事务，返回`null`。
- `IDBRequest.onsuccess`：指定`success`事件的监听函数。
- `IDBRequest.onerror`：指定`error`事件的监听函数。





IDBOpenDBRequest 对象继承了 IDBRequest 对象，提供了两个额外的事件监听属性。

- `IDBOpenDBRequest.onblocked`：指定`blocked`事件（`upgradeneeded`事件触发时，数据库仍然在使用）的监听函数。
- `IDBOpenDBRequest.onupgradeneeded`：`upgradeneeded`事件的监听函数。

## IDBDatabase对象

从打开数据成功以后可以从`IDBOpenDBRequest`对象的`result`属性上面，拿到一个`IDBDatabase`对象，它表示连接的数据库

后面对数据库的操作，都通过这个对象完成。

```javascript
var db;
var DBOpenRequest = window.indexedDB.open('demo', 1);

DBOpenRequest.onerror = function (event) {
  console.log('Error');
};

DBOpenRequest.onsuccess = function(event) {
  db = DBOpenRequest.result;
  // ...
};
```

### 属性

- `IDBDatabase.name`：字符串，数据库名称。
- `IDBDatabase.version`：整数，数据库版本。数据库第一次创建时，该属性为空字符串。
- `IDBDatabase.objectStoreNames`：DOMStringList 对象（字符串的集合），包含当前数据的所有 object store 的名字。
- `IDBDatabase.onabort`：指定 abort 事件（事务中止）的监听函数。
- `IDBDatabase.onclose`：指定 close 事件（数据库意外关闭）的监听函数。
- `IDBDatabase.onerror`：指定 error 事件（访问数据库失败）的监听函数。
- `IDBDatabase.onversionchange`：数据库版本变化时触发（发生`upgradeneeded`事件，或调用`indexedDB.deleteDatabase()`）。

### 方法

- `IDBDatabase.close()`：关闭数据库连接，实际会等所有事务完成后再关闭。
- `IDBDatabase.createObjectStore()`：创建存放数据的对象仓库，类似于传统关系型数据库的表格，返回一个 IDBObjectStore 对象。该方法只能在`versionchange`事件监听函数中调用。
- `IDBDatabase.deleteObjectStore()`：删除指定的对象仓库。该方法只能在`versionchange`事件监听函数中调用。
- `IDBDatabase.transaction()`：返回一个 IDBTransaction 事务对象。

`createObject`例子：

```javascript
var request = window.indexedDB.open('demo', 2);

request.onupgradeneeded = function (event) {
  var db = event.target.result;

  db.onerror = function(event) {
    console.log('error');
  };

  var objectStore = db.createObjectStore('items');

  // ...
};
```

`createObjectStore()`方法还可以接受第二个对象参数，用来设置对象仓库的属性。

```javascript
db.createObjectStore('test', { keyPath: 'email' });
db.createObjectStore('test2', { autoIncrement: true });
```

+ `keyPath`表示主键，默认为`null`
+ `sutoIncrement`表示是否使用自动递增的整数作为主键，默认为`false`

如果以上两个属性同时使用，表示主键为递增的整数，且对象不得缺少`keyPath`指定的属性



`deleteObjectStore()`例子：

```javascript
var dbName = 'sampleDB';
var dbVersion = 2;
var request = indexedDB.open(dbName, dbVersion);

request.onupgradeneeded = function(e) {
  var db = request.result;
  if (e.oldVersion < 1) {
    db.createObjectStore('store1');
  }

  if (e.oldVersion < 2) {
    db.deleteObjectStore('store1');
    db.createObjectStore('store2');
  }

  // ...
};
```



`transaction()`例子：

```javascript
var t = db.transaction(['items'], 'readwrite');
```

+ 参数为数组，里面是所涉及的对象仓库，通常只有一个
+ 表示操作类型的字符串，目前只有`readonly`和`readwrite`

## IDBObjectStore对象

对应一个对象仓库

IDBObjectStore 对象对应一个对象仓库（object store）。`IDBDatabase.createObjectStore()`方法返回的就是一个 IDBObjectStore 对象。

IDBDatabase 对象的`transaction()`返回一个事务对象，该对象的`objectStore()`方法返回 IDBObjectStore 对象，因此可以采用下面的链式写法：

```javascript
db.transaction(['test'], 'readonly')
  .objectStore('test')
  .get(X)
  .onsuccess = function (e) {}
```

### 属性

- `IDBObjectStore.indexNames`：返回一个类似数组的对象（DOMStringList），包含了当前对象仓库的所有索引。
- `IDBObjectStore.keyPath`：返回当前对象仓库的主键。
- `IDBObjectStore.name`：返回当前对象仓库的名称。
- `IDBObjectStore.transaction`：返回当前对象仓库所属的事务对象。
- `IDBObjectStore.autoIncrement`：布尔值，表示主键是否会自动递增。

### 方法

#### IDBObjectStore.add()

用于向对象仓库添加数据，返回一个IDBRequest对象

只用于添加数据，且主键相同会报错

```javascript
objectStore.add(value,key);
```

+ 键值
+ 主键，可选，省略默认为`null`

```javascript
var db;
var DBOpenRequest = window.indexedDB.open('demo', 1);

DBOpenRequest.onsuccess = function (event) {
  db = DBOpenRequest.result;
  var transaction = db.transaction(['items'], 'readwrite');

  transaction.oncomplete = function (event) {
    console.log('transaction success');
  };

  transaction.onerror = function (event) {
    console.log('transaction error: ' + transaction.error);
  };

  var objectStore = transaction.objectStore('items');
  var objectStoreRequest = objectStore.add({ foo: 1 });

  objectStoreRequest.onsuccess = function (event) {
    console.log('add data success');
  };

};
```

#### IDBObjectStore.put()

用于更新某个主键对应的数据记录，如果对应键值不存在则插入一条新纪录

返回一个IDBRequest对象

```javascript
objectStore.put(item, key)
```

+ 新数据
+ 主键，可选，且只有自动递增时才有必要提供，因为那时主键不包含在数据值里面

#### IDBObjectStore.clear()

用于删除当前对象仓库的所有记录

返回IDBRequest对象

```javascript
objectStore.clear()
```

#### IDBObjectStore.delete()

用于删除指定主键的记录

返回IDBRequest对象

```javascript
objectStore.delete(Key)
```

参数为主键值

#### IDBObjectStore.count()

用于计算记录数量

返回IDBRequest对象

```javascript
IDBObjectStore.count(key)
```

不带参数时，该方法返回当前对象仓库的所有记录数量

如果主键或 IDBKeyRange 对象作为参数，则返回对应的记录数量

#### IDBObjectStore.getKey()

用于获取主键

返回IDBRequest对象

```javascript
objectStore.getKey(key)
```

参数为主键值或IDBKeyRange对象

#### IDBObjectStore.getAll()

用于获取对象仓库的记录

返回一个IDBRequest对象

```javascript
// 获取所有记录
objectStore.getAll()

// 获取所有符合指定主键或 IDBKeyRange 的记录
objectStore.getAll(query)

// 指定获取记录的数量
objectStore.getAll(query, count)
```

#### IDBObjectStore.getAllKeys()

用于获取所有符合条件的主键

返回一个IDBRequest对象

```javascript
// 获取所有记录的主键
objectStore.getAllKeys()

// 获取所有符合条件的主键
objectStore.getAllKeys(query)

// 指定获取主键的数量
objectStore.getAllKeys(query, count)
```

#### IDBObjectStore.index()

返回制定名称的索引对象IDBIndex

```javascript
objectStore.index(name)
```

```javascript
//获取索引后续操作
var t = db.transaction(['people'], 'readonly');
var store = t.objectStore('people');

var index = store.index('name');

var request = index.get('foo');
```

#### IDBObjectStore.createIndex()

用于新建当前数据库的一个索引

==只能在VersionChange监听函数内调用==

```javascript
objectStore.createIndex(indexName, keyPath, objectParameters)
```

- indexName：索引名
- keyPath：主键
- objectParameters：配置对象（可选）
  - unique：如果设为`true`，将不允许重复的值
  - multiEntry：如果设为`true`，对于有多个值的主键数组，每个值将在索引里面新建一个条目，否则主键数组对应一个条目

```javascript
//对象仓库的数据记录
var person = {
  name: name,
  email: email,
  created: new Date()
};

var store = db.createObjectStore('people', { autoIncrement: true });

store.createIndex('name', 'name', { unique: false });
store.createIndex('email', 'email', { unique: true });
```

#### IDBObjectStore.deleteIndex()

用于删除指定的索引

==只能在VersionChange监听函数内调用==

```javascript
objectStore.deleteIndex(indexName)
```

#### IDBObjectStore.openCursor()

用于获取一个指针对象

```javascript
IDBObjectStore.openCursor()
```

可以用于遍历数据，异步操作，有`success`和`error`事件

```javascript
var t = db.transaction(['test'], 'readonly');
var store = t.objectStore('test');

var cursor = store.openCursor();

cursor.onsuccess = function (event) {
  //event.target.result指向当前数据记录
  var res = event.target.result;
  if (res) {
    //key和value分别返回主键和键值
    console.log('Key', res.key);
    console.dir('Data', res.value);
    //continue将光标移至下一个数据对象，若为最后一个则指向null
    res.continue();
  }
}
```

参数为主键值或IDBKeyRange对象

若指定了参数，将只处理包含指定主键的记录；

若省略，将处理所有记录

第二参数表示遍历方向，默认为`next`，还可能有`prev`、`nextunique`、`prevunique`，后两个会跳过重复值

#### IDBObjectStore.openKeyCursor()

用于获取一个主键指针对象

```javascript
IDBObjectStore.openKeyCursor()
```

## IDBTransaction对象

用于异步操作数据库事务，所有读写操作都通过这个对象进行

`IDBDatabase.transaction()`返回一个IDBTransaction对象

```javascript
var db;
var DBOpenRequest = window.indexedDB.open('demo', 1);

DBOpenRequest.onsuccess = function(event) {
  db = DBOpenRequest.result;
  var transaction = db.transaction(['demo'], 'readwrite');

  transaction.oncomplete = function (event) {
    console.log('transaction success');
  };

  transaction.onerror = function (event) {
    console.log('transaction error: ' + transaction.error);
  };

  var objectStore = transaction.objectStore('demo');
  var objectStoreRequest = objectStore.add({ foo: 1 });

  objectStoreRequest.onsuccess = function (event) {
    console.log('add data success');
  };

};
```

事务执行顺序是创建的顺序，不是发出请求的顺序

```javascript
var trans1 = db.transaction('foo', 'readwrite');
var trans2 = db.transaction('foo', 'readwrite');
var objectStore2 = trans2.objectStore('foo')
var objectStore1 = trans1.objectStore('foo')
objectStore2.put('2', 'key');
objectStore1.put('1', 'key');
//key的键值是2而不是1
```

属性：

- `IDBTransaction.db`：返回当前事务所在的数据库对象 IDBDatabase。
- `IDBTransaction.error`：返回当前事务的错误。如果事务没有结束，或者事务成功结束，或者被手动终止，该方法返回`null`。
- `IDBTransaction.mode`：返回当前事务的模式，默认是`readonly`（只读），另一个值是`readwrite`。
- `IDBTransaction.objectStoreNames`：返回一个类似数组的对象 DOMStringList，成员是当前事务涉及的对象仓库的名字。
- `IDBTransaction.onabort`：指定`abort`事件（事务中断）的监听函数。
- `IDBTransaction.oncomplete`：指定`complete`事件（事务成功）的监听函数。
- `IDBTransaction.onerror`：指定`error`事件（事务失败）的监听函数。

方法：

- `IDBTransaction.abort()`：终止当前事务，回滚所有已经进行的变更。
- `IDBTransaction.objectStore(name)`：返回指定名称的对象仓库 IDBObjectStore

## IDBIndex对象

代表数据库的索引，通过对象可以获取数据库里面的记录

主要用于通过除主键以外的其他键，建立索引获取对象

是持久性的键值对存储，只要插入、更新或删除数据记录，引用的对象库中的记录，索引就会自动更新

`IDBObjectStore.index()`可以获取IDBIndex对象

```javascript
var transaction = db.transaction(['contactsList'], 'readonly');
var objectStore = transaction.objectStore('contactsList');
var myIndex = objectStore.index('lName');

myIndex.openCursor().onsuccess = function (event) {
  var cursor = event.target.result;
  if (cursor) {
    var tableRow = document.createElement('tr');
    tableRow.innerHTML =   '<td>' + cursor.value.id + '</td>'
                         + '<td>' + cursor.value.lName + '</td>'
                         + '<td>' + cursor.value.fName + '</td>'
                         + '<td>' + cursor.value.jTitle + '</td>'
                         + '<td>' + cursor.value.company + '</td>'
                         + '<td>' + cursor.value.eMail + '</td>'
                         + '<td>' + cursor.value.phone + '</td>'
                         + '<td>' + cursor.value.age + '</td>';
    tableEntry.appendChild(tableRow);

    cursor.continue();
  } else {
    console.log('Entries all displayed.');
  }
};
```

属性：

- `IDBIndex.name`：字符串，索引的名称。
- `IDBIndex.objectStore`：索引所在的对象仓库。
- `IDBIndex.keyPath`：索引的主键。
- `IDBIndex.multiEntry`：布尔值，针对`keyPath`为数组的情况，如果设为`true`，创建数组时，每个数组成员都会有一个条目，否则每个数组都只有一个条目。
- `IDBIndex.unique`：布尔值，表示创建索引时是否允许相同的主键。

方法：立即返回的都是一个 IDBRequest 对象。

- `IDBIndex.count()`：用来获取记录的数量。它可以接受主键或 IDBKeyRange 对象作为参数，这时只返回符合主键的记录数量，否则返回所有记录的数量。
- `IDBIndex.get(key)`：用来获取符合指定主键的数据记录。
- `IDBIndex.getKey(key)`：用来获取指定的主键。
- `IDBIndex.getAll()`：用来获取所有的数据记录。它可以接受两个参数，都是可选的，第一个参数用来指定主键，第二个参数用来指定返回记录的数量。如果省略这两个参数，则返回所有记录。由于获取成功时，浏览器必须生成所有对象，所以对性能有影响。如果数据集比较大，建议使用 IDBCursor 对象。
- `IDBIndex.getAllKeys()`：该方法与`IDBIndex.getAll()`方法相似，区别是获取所有主键。
- `IDBIndex.openCursor()`：用来获取一个 IDBCursor 对象，用来遍历索引里面的所有条目。
- `IDBIndex.openKeyCursor()`：该方法与`IDBIndex.openCursor()`方法相似，区别是遍历所有条目的主键。

## IDBCursor对象

代表指针对象，用于遍历数据仓库或索引的记录

一般通过`IDBObjectStore.openCursor()`方法获得

```javascript
var transaction = db.transaction(['rushAlbumList'], 'readonly');
var objectStore = transaction.objectStore('rushAlbumList');

objectStore.openCursor(null, 'next').onsuccess = function(event) {
  var cursor = event.target.result;
  if (cursor) {
    var listItem = document.createElement('li');
      listItem.innerHTML = cursor.value.albumTitle + ', ' + cursor.value.year;
      list.appendChild(listItem);

      console.log(cursor.source);
      cursor.continue();
    } else {
      console.log('Entries all displayed.');
    }
  };
};
```

属性：

- `IDBCursor.source`：返回正在遍历的对象仓库或索引。
- `IDBCursor.direction`：字符串，表示指针遍历的方向。共有四个可能的值：next（从头开始向后遍历）、nextunique（从头开始向后遍历，重复的值只遍历一次）、prev（从尾部开始向前遍历）、prevunique（从尾部开始向前遍历，重复的值只遍历一次）。该属性通过`IDBObjectStore.openCursor()`方法的第二个参数指定，一旦指定就不能改变了。
- `IDBCursor.key`：返回当前记录的主键。
- `IDBCursor.value`：返回当前记录的数据值。
- `IDBCursor.primaryKey`：返回当前记录的主键。对于数据仓库（objectStore）来说，这个属性等同于 IDBCursor.key；对于索引，IDBCursor.key 返回索引的位置值，该属性返回数据记录的主键。

方法：

- `IDBCursor.advance(n)`：指针向前移动 n 个位置。
- `IDBCursor.continue()`：指针向前移动一个位置。它可以接受一个主键作为参数，这时会跳转到这个主键。
- `IDBCursor.continuePrimaryKey()`：该方法需要两个参数，第一个是`key`，第二个是`primaryKey`，将指针移到符合这两个参数的位置。
- `IDBCursor.delete()`：用来删除当前位置的记录，返回一个 IDBRequest 对象。该方法不会改变指针的位置。
- `IDBCursor.update()`：用来更新当前位置的记录，返回一个 IDBRequest 对象。它的参数是要写入数据库的新的值。

## IDBKeyRange对象

代表数据仓库里面的一组主键，根据主键可以获取数据仓库或索引里面的一组记录

可以只包含一个值，也可以指定上下限

方法：(前三个方法默认包括端点值，可以添加第二个布尔参数修改这个属性)

- `IDBKeyRange.lowerBound()`：指定下限。
- `IDBKeyRange.upperBound()`：指定上限。
- `IDBKeyRange.bound()`：同时指定上下限。
- `IDBKeyRange.only()`：指定只包含一个值。

```javascript
// All keys ≤ x
var r1 = IDBKeyRange.upperBound(x);

// All keys < x
var r2 = IDBKeyRange.upperBound(x, true);

// All keys ≥ y
var r3 = IDBKeyRange.lowerBound(y);

// All keys > y
var r4 = IDBKeyRange.lowerBound(y, true);

// All keys ≥ x && ≤ y
var r5 = IDBKeyRange.bound(x, y);

// All keys > x &&< y
var r6 = IDBKeyRange.bound(x, y, true, true);

// All keys > x && ≤ y
var r7 = IDBKeyRange.bound(x, y, true, false);

// All keys ≥ x &&< y
var r8 = IDBKeyRange.bound(x, y, false, true);

// The key = z
var r9 = IDBKeyRange.only(z);
```

属性：

- `IDBKeyRange.lower`：返回下限
- `IDBKeyRange.lowerOpen`：布尔值，表示下限是否为开区间（即下限是否排除在范围之外）
- `IDBKeyRange.upper`：返回上限
- `IDBKeyRange.upperOpen`：布尔值，表示上限是否为开区间（即上限是否排除在范围之外）

```javascript
var t = db.transaction(['people'], 'readonly');
var store = t.objectStore('people');
var index = store.index('name');

var range = IDBKeyRange.bound('B', 'D');

index.openCursor(range).onsuccess = function (e) {
  var cursor = e.target.result;
  if (cursor) {
    console.log(cursor.key + ':');

    for (var field in cursor.value) {
      console.log(cursor.value[field]);
    }
    cursor.continue();
  }
}
```

实例方法：

+ `includes(key)`：返回一个布尔值，表示某个主键是否包含在当前主键组内

```javascript
var keyRangeValue = IDBKeyRange.bound('A', 'K', false, false);

keyRangeValue.includes('F') // true
keyRangeValue.includes('W') // false
```





































