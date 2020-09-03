`ArrayBuffer`对象、`TypedArray`视图、`DataView`视图是js用于操作二进制数据的一个接口，以数组的语法处理二进制数据，统称为二进制数组

而二进制数组由三类对象组成：

1. **ArrayBuffer对象**：代表内存之中的一段二进制数据，可以通过“视图”进行操作。“视图”部署了数组接口，这意味着，可以用数组的方法操作内存。
2. **TypedArray视图**：共包括 9 种类型的视图，比如`Uint8Array`（无符号 8 位整数）数组视图, `Int16Array`（16 位整数）数组视图, `Float32Array`（32 位浮点数）数组视图等等。
3. **DataView视图**：可以自定义复合格式的视图，比如第一个字节是 Uint8（无符号 8 位整数）、第二、三个字节是 Int16（16 位整数）、第四个字节开始是 Float32（32 位浮点数）等等，此外还可以自定义字节

`ArrayBuffer`对象代表原始的二进制数据

`TypedArray`视图用来读写简单类型的二进制数据

`DataView`视图用来读写复杂类型的二进制数据

# ArrayBuffer对象

代表了存储二进制数据的一段内容，不能直接读写，只能通过视图来读写

同时也是一个构造函数，用于分配一段可以存放数据的连续内存区域

```javascript
const buf = new ArrayBuffer(32);
//生成了一段32字节的内存区域，每个字节的值默认为0
```

为了读写这段内容，需要指定视图：

1. 使用`DataView`，单个构造函数方法

```javascript
const buf = new ArrayBuffer(32);
const dataView = new DataView(buf);
dataView.getUint8(0) // 0
//以不带符号的8位整数格式，从头读取8位二进制数据
```

2. 使用`TypedArray`，一组构造函数，表示不同的数据格式

   由于两段视图对应的是同一段内存，因此一个视图修改底层内存，会影响到另一个视图

```javascript
const buffer = new ArrayBuffer(12);
const x1 = new Int32Array(buffer);
x1[0] = 1;
const x2 = new Uint8Array(buffer);
x2[0]  = 2;
x1[0] // 2
```

`TypedArray`视图的构造函数，除了可以接受`ArrayBuffer`实例作为参数，还可以接收普通数组作为参数，直接分配内存生成底层的`ArrayBuffer`实例

```javascript
const typedArray = new Uint8Array([0,1,2]);
typedArray.length // 3

typedArray[0] = 5;
typedArray // [5, 1, 2]
```

## ArrayBuffer.prototype.byeteLength

返回所分配的内存区域的字节长度

若分配的内存区域过大，很可能分配失败，可以用这个方法来检查是否分配成功

## ArrayBuffer.prototype.slice()

将内存区域的一部分，拷贝生成一个新的`ArrayBuffer`对象

==唯一一个直接读写内存的方法==

## ArrayBuffer.isView()

返回一个布尔值，表示参数是否为`ArrayBuffer`的视图实例

大致相当于判断参数是否为`TypeArray`或`DataView`实例

```javascript
const buffer = new ArrayBuffer(8);
ArrayBuffer.isView(buffer) // false

const v = new Int32Array(buffer);
ArrayBuffer.isView(v) // true
```

# TypedArray视图

一段内存，不同数据有不同的解读方式，这就叫做“视图”（view）

`TypedArray`视图的数组成员都是同一个数据类型

`TypedArray`视图一共包括 9 种类型，每一种视图都是一种构造函数。

- **Int8Array**：8 位有符号整数，长度 1 个字节。
- **Uint8Array**：8 位无符号整数，长度 1 个字节。
- **Uint8ClampedArray**：8 位无符号整数，长度 1 个字节，溢出处理不同。
- **Int16Array**：16 位有符号整数，长度 2 个字节。
- **Uint16Array**：16 位无符号整数，长度 2 个字节。
- **Int32Array**：32 位有符号整数，长度 4 个字节。
- **Uint32Array**：32 位无符号整数，长度 4 个字节。
- **Float32Array**：32 位浮点数，长度 4 个字节。
- **Float64Array**：64 位浮点数，长度 8 个字节。

通过这九个构造函数生成的数组，统称为`TypedArray`视图，所有数组的方法都可以使用，但是和普通数组有以下这些最主要差异：

- TypedArray 数组的所有成员，都是同一种类型。
- TypedArray 数组的成员是连续的，不会有空位。
- TypedArray 数组成员的默认值为 0。比如，`new Array(10)`返回一个普通数组，里面没有任何成员，只是 10 个空位；`new Uint8Array(10)`返回一个 TypedArray 数组，里面 10 个成员都是 0。
- TypedArray 数组只是一层视图，本身不储存数据，它的数据都储存在底层的`ArrayBuffer`对象之中，要获取底层对象必须使用`buffer`属性。

## 构造函数

### TypedArray(buffer,byteOffset=0,length?)

+ 第一个参数（必需）：视图对应的底层`ArrayBuffer`对象
+ 第二个参数（可选）：视图开始的字节序号，默认从0开始
+ 第三个参数（可选）：视图包含的数据个数，默认知道本段内存区域结束

同一个`ArrayBuffer`对象上，可以根据不同的数据类型建立多个视图

```javascript
// 创建一个8字节的ArrayBuffer
const b = new ArrayBuffer(8);

// 创建一个指向b的Int32视图，开始于字节0，直到缓冲区的末尾
const v1 = new Int32Array(b);
v1[0];//32位整数，指向字节0~3
// 创建一个指向b的Uint8视图，开始于字节2，直到缓冲区的末尾
const v2 = new Uint8Array(b, 2);
v2[0];//8位无符号整数，指向字节2
// 创建一个指向b的Int16视图，开始于字节2，长度为2
const v3 = new Int16Array(b, 2, 2);
v3[0];//16位整数，指向字节2~字节3
```

==`byteOffset`必须与所要建立的数据类型一直，否则会报错==

```javascript
const buffer = new ArrayBuffer(8);
const i16 = new Int16Array(buffer, 1);
// Uncaught RangeError: start offset of Int16Array should be a multiple of 2
```

### TypedArray(length)

直接分配内存生成视图

```javascript
const f64a = new Float64Array(8);
f64a[0] = 10;
f64a[1] = 20;
f64a[2] = f64a[0] + f64a[1];
```

### TypedArray(typedArray)

接受另一个`TypedArray`实例作为参数

```javascript
const typedArray = new Int8Array(new Uint8Array(4));
```

此时新生成的数组只是赋值了参数数组的值，但是底层内存是不一样的

### TypedArray(arrayLikeObject)

接受普通数组生成`TypedArray`实例

```javascript
const typedArray = new Uint8Array([1, 2, 3, 4]);
```

同样会重新开辟内存

TypedArray也可以转回普通数组

```javascript
const normalArray = [...typedArray];
// or
const normalArray = Array.from(typedArray);
// or
const normalArray = Array.prototype.slice.call(typedArray);
```

## 数组方法

普通数组的操作方法和属性对TypedArray数组完全适用

==但是没有`concat`==，要实现`concat`效果可以：

```javascript
function concatenate(resultConstructor, ...arrays) {
  let totalLength = 0;
  for (let arr of arrays) {
    totalLength += arr.length;
  }
  let result = new resultConstructor(totalLength);
  let offset = 0;
  for (let arr of arrays) {
    result.set(arr, offset);
    offset += arr.length;
  }
  return result;
}

concatenate(Uint8Array, Uint8Array.of(1, 2), Uint8Array.of(3, 4))
// Uint8Array [1, 2, 3, 4]
```

TypedArray同样部署了Iterator接口

## 字节序

即数值在内存中的表示方法

# 参考链接

[ArrayBuffer](https://wangdoc.com/es6/arraybuffer.html)

























