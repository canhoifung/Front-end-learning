# Canvas API

`<canvas>`是脚本调用各种方法生成图像，SVG则是一个XML文件，通过子元素生成图像

```html
<canvas id="myCanvas" width="400" height="250">
  您的浏览器不支持 Canvas
</canvas>
```

若浏览器不支持这个API就会显示文字

每个`<canvas>`元素都有一个对应的`CanvasRenderingContext2D`对象（上下文对象），Canvas API就定义在这个对象上，获取这个对象的方法：

```javascript
var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');
```

如果`getContext`方法指定参数为`webgl`，则表示用于生成3D的立体图案，属于WebGL API

## Canvas API：绘制图形

Canvas空间内原点位于图像左上角，x轴往右为正，y轴往下为正

### 路径

绘制路径的方法和属性：

- `CanvasRenderingContext2D.beginPath()`：开始绘制路径。
- `CanvasRenderingContext2D.closePath()`：结束路径，返回到当前路径的起始点，会从当前点到起始点绘制一条直线。如果图形已经封闭，或者只有一个点，那么此方法不会产生任何效果。
- `CanvasRenderingContext2D.moveTo()`：设置路径的起点，即将一个新路径的起始点移动到`(x，y)`坐标。
- `CanvasRenderingContext2D.lineTo()`：使用直线从当前点连接到`(x, y)`坐标。
- `CanvasRenderingContext2D.fill()`：在路径内部填充颜色（默认为黑色）。
- `CanvasRenderingContext2D.stroke()`：路径线条着色（默认为黑色）。
- `CanvasRenderingContext2D.fillStyle`：指定路径填充的颜色和样式（默认为黑色）。
- `CanvasRenderingContext2D.strokeStyle`：指定路径线条的颜色和样式（默认为黑色）。

### 线型

控制线条视觉特征的方法和属性：

`CanvasRenderingContext2D.lineWidth`：指定线条的宽度，默认为1.0。

`CanvasRenderingContext2D.lineCap`：指定线条末端的样式，有三个可能的值：`butt`（默认值，末端为矩形）、`round`（末端为圆形）、`square`（末端为突出的矩形，矩形宽度不变，高度为线条宽度的一半）。

`CanvasRenderingContext2D.lineJoin`：指定线段交点的样式，有三个可能的值：`round`（交点为扇形）、`bevel`（交点为三角形底边）、`miter`（默认值，交点为菱形)。

`CanvasRenderingContext2D.miterLimit`：指定交点菱形的长度，默认为10。该属性只在`lineJoin`属性的值等于`miter`时有效。

`CanvasRenderingContext2D.getLineDash()`：返回一个数组，表示虚线里面线段和间距的长度。

`CanvasRenderingContext2D.setLineDash()`：数组，用于指定虚线里面线段和间距的长度

### 矩形

绘制矩形的方法：

- `CanvasRenderingContext2D.rect()`：绘制矩形路径。
- `CanvasRenderingContext2D.fillRect()`：填充一个矩形。
- `CanvasRenderingContext2D.strokeRect()`：绘制矩形边框。
- `CanvasRenderingContext2D.clearRect()`：指定矩形区域的像素都变成透明。

四个方法都接收四个参数，分别是横纵坐标和矩形宽高

### 弧形

绘制弧形的方法：

- `CanvasRenderingContext2D.arc()`：通过指定圆心和半径绘制弧形。
- `CanvasRenderingContext2D.arcTo()`：通过指定两根切线和半径绘制弧形。

其中`arc()`主要用于绘制圆形和扇形，其格式为：

```javascript
ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise)
```

实例：

```javascript
ctx.arc(5, 5, 5, 0, 2 * Math.PI, true)
```

其中`startAngel`和`endAngle`以弧度表示，`anticlockwise`表示逆时针（`true`）或顺时针（`false`）

`arcTo()`主要用于绘制圆弧，有5个参数：

前两个是第一个点的坐标

第三第四个是第二个点的坐标

第五个是半径

例子：

```javascript
var ctx = canvas.getContext('2d');

ctx.beginPath();
ctx.moveTo(0, 0);
ctx.arcTo(50, 50, 100, 0, 25);
ctx.lineTo(100, 0);
ctx.stroke();
```

先`(0,0)`和`(50,50)`形成一条直线，然后`(50,50)`和`(100,0)`形成第二条直线，弧线就是与这两根直线相切的部分

### 文本

绘制文本的方法和属性

- `CanvasRenderingContext2D.fillText()`：在指定位置绘制实心字符。
- `CanvasRenderingContext2D.strokeText()`：在指定位置绘制空心字符。
- `CanvasRenderingContext2D.measureText()`：返回一个 TextMetrics 对象。
- `CanvasRenderingContext2D.font`：指定字型大小和字体，默认值为`10px sans-serif`。
- `CanvasRenderingContext2D.textAlign`：文本的对齐方式，默认值为`start`。
- `CanvasRenderingContext2D.direction`：文本的方向，默认值为`inherit`。
- `CanvasRenderingContext2D.textBaseline`：文本的垂直位置，默认值为`alphabetic`。

其中，`fillText()`方法接收四个参数：

+ `text`：所要填充的字符串。
+ `x`：文字起点的横坐标，单位像素。
+ `y`：文字起点的纵坐标，单位像素。
+ `maxWidth`：文本的最大像素宽度。该参数可选，如果省略，则表示宽度没有限制。如果文本实际长度超过这个参数指定的值，那么浏览器将尝试用较小的字体填充

```javascript
CanvasRenderingContext2D.fillText(text, x, y [, maxWidth])
```

且`fillText()`方法不支持文本断行



`textAlign`可以取五个值：

- `left`：左对齐
- `right`：右对齐
- `center`：居中
- `start`：默认值，起点对齐（从左到右的文本为左对齐，从右到左的文本为右对齐）。
- `end`：结尾对齐（从左到右的文本为右对齐，从右到左的文本为左对齐）。



`textBaseline`属性可以取以下值：

- `top`：上部对齐（字母的基线是整体上移）。
- `hanging`：悬挂对齐（字母的上沿在一根直线上），适用于印度文和藏文。
- `middle`：中部对齐（字母的中线在一根直线上）。
- `alphabetic`：默认值，表示字母位于字母表的正常位置（四线格的第三根线）。
- `ideographic`：下沿对齐（字母的下沿在一根直线上），使用于东亚文字。
- `bottom`：底部对齐（字母的基线下移）。对于英文字母，这个设置与`ideographic`没有差异。



`measureText()`接收一个子字符串作为参数，返回一个TexxtMetrics对象，可以从对象上获取参数字符串的信息，目前主要是获取文本渲染后的宽度

```javascript
var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

var text1 = ctx.measureText('Hello world');
text1.width // 49.46

ctx.font = 'Bold 20px Arial';
var text2 = ctx.measureText('Hello world');
text2.width // 107.78
```

### 渐变色和图像填充

设置渐变效果和图像填充效果的方法：

- `CanvasRenderingContext2D.createLinearGradient()`：定义线性渐变样式。
- `CanvasRenderingContext2D.createRadialGradient()`：定义辐射渐变样式。
- `CanvasRenderingContext2D.createPattern()`：定义图像填充样式。

`createLinearGradient()`：

```javascript
ctx.createLinearGradient(x0, y0, x1, y1)
```

`x0`、`y0`分别是起点的横纵坐标，`x1`、`y1`分别是终点的横纵坐标

方法返回一个`CanvasGradient`对象，只有一个`addColorStop()`方法，用于指定渐变点的颜色

​	`addColorStop()`接收两个参数：

+ 第一个是0到1的一个位置量，0表示起点，1表示终点
+ 第二个参数是一个字符串，表示CSS颜色

例子：

```javascript
var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

var gradient = ctx.createLinearGradient(0, 0, 200, 0);
gradient.addColorStop(0, 'green');
gradient.addColorStop(1, 'white');
ctx.fillStyle = gradient;
ctx.fillRect(10, 10, 200, 100);
```



`createRadialGradient()`定义一个辐射渐变，需要指定两个圆

```javascript
ctx.createRadialGradient(x0, y0, r0, x1, y1, r1)
```

0是辐射起始圆的信息，1是辐射终止圆的信息

同样返回一个`CanvasGradient`对象

例子：

```javascript
var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

var gradient = ctx.createRadialGradient(100, 100, 50, 100, 100, 100);
gradient.addColorStop(0, 'white');
gradient.addColorStop(1, 'green');
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, 200, 200);
```



`createPattern()`：

```javascript
ctx.createPattern(image, repetition)
```

+ image：可以是`<img>`元素，也可以是另一个`<canvas>`元素，或者一个表示图像的Blob对象
+ repetition：有四个值：`repeat`（双向重复）、`repeat-x`(水平重复)、`repeat-y`(垂直重复)、`no-repeat`(不重复)。如果第二个参数是空字符串或`null`，则等同于`null`

返回一个`CanvasPattern`对象

例子：

```javascript
var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

var img = new Image();
img.src = 'https://example.com/pattern.png';
img.onload = function( ) {
  var pattern = ctx.createPattern(img, 'repeat');
  ctx.fillStyle = pattern;
  ctx.fillRect(0, 0, 400, 400);
};
```

### 阴影

设置阴影的属性：

- `CanvasRenderingContext2D.shadowBlur`：阴影的模糊程度，默认为`0`。
- `CanvasRenderingContext2D.shadowColor`：阴影的颜色，默认为`black`。
- `CanvasRenderingContext2D.shadowOffsetX`：阴影的水平位移，默认为`0`。
- `CanvasRenderingContext2D.shadowOffsetY`：阴影的垂直位移，默认为`0`。



## Canvas API：图像处理

### CanvasRenderingContext2D.drawImage()

读取图片后，使用`drawImage()`方法将图片放上画布

有三种格式：

```javascript
ctx.drawImage(image, dx, dy);
ctx.drawImage(image, dx, dy, dWidth, dHeight);
ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
```

参数含义：

- image：图像元素
- sx：图像内部的横坐标，用于映射到画布的放置点上。
- sy：图像内部的纵坐标，用于映射到画布的放置点上。
- sWidth：图像在画布上的宽度，会产生缩放效果。如果未指定，则图像不会缩放，按照实际大小占据画布的宽度。
- sHeight：图像在画布上的高度，会产生缩放效果。如果未指定，则图像不会缩放，按照实际大小占据画布的高度。
- dx：画布内部的横坐标，用于放置图像的左上角
- dy：画布内部的纵坐标，用于放置图像的左上角
- dWidth：图像在画布内部的宽度，会产生缩放效果。
- dHeight：图像在画布内部的高度，会产生缩放效果。

例子：将图像放在画布上，两者左上角对齐：

```javascript
var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

var img = new Image();
img.src = 'image.png';
img.onload = function () {
  ctx.drawImage(img, 0, 0);
};
```

这时的图像是原始大小，如果画布小于图像，就会剪切显示

显示完整的图片：

```javascript
var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

var image = new Image(60, 45);
image.onload = drawImageActualSize;
image.src = 'https://example.com/image.jpg';

function drawImageActualSize() {
  canvas.width = this.naturalWidth;
  canvas.height = this.naturalHeight;
  ctx.drawImage(this, 0, 0, this.naturalWidth, this.naturalHeight);
}
```

### 像素读写

读写像素的方法：

- `CanvasRenderingContext2D.getImageData()`：将画布读取成一个 ImageData 对象
- `CanvasRenderingContext2D.putImageData()`：将 ImageData 对象写入画布
- `CanvasRenderingContext2D.createImageData()`：生成 ImageData 对象

#### getImageData()

用于读取`<canvas>`的内容，返回一个ImageData对象，包含每个像素的信息

```javascript
ctx.getImageData(sx, sy, sw, sh)
```

+ sx：读取区域的左上角横坐标
+ sy：读取区域的左上角纵坐标
+ sw：读取区域的宽度
+ sh：读取区域的高度

返回一个`ImageData`对象，对象有三个属性：

- ImageData.data：一个一维数组。该数组的值，依次是每个像素的红、绿、蓝、alpha 通道值（每个值的范围是 0～255），因此该数组的长度等于`图像的像素宽度 x 图像的像素高度 x 4`。这个数组不仅可读，而且可写，因此通过操作这个数组，就可以达到操作图像的目的。
- ImageData.width：浮点数，表示 ImageData 的像素宽度。
- ImageData.height：浮点数，表示 ImageData 的像素高度。

#### putImageData()

将`ImageData`对象的像素绘制在`<canvas>`上，有两种格式：

```javascript
ctx.putImageData(imagedata, dx, dy)
ctx.putImageData(imagedata, dx, dy, dirtyX, dirtyY, dirtyWidth, dirtyHeight)
```

- imagedata：包含像素信息的 ImageData 对象。
- dx：`<canvas>`元素内部的横坐标，用于放置 ImageData 图像的左上角。
- dy：`<canvas>`元素内部的纵坐标，用于放置 ImageData 图像的左上角。
- dirtyX：ImageData 图像内部的横坐标，用于作为放置到`<canvas>`的矩形区域的左上角的横坐标，默认为0。
- dirtyY：ImageData 图像内部的纵坐标，用于作为放置到`<canvas>`的矩形区域的左上角的纵坐标，默认为0。
- dirtyWidth：放置到`<canvas>`的矩形区域的宽度，默认为 ImageData 图像的宽度。
- dirtyHeight：放置到`<canvas>`的矩形区域的高度，默认为 ImageData 图像的高度。

#### createImageData()

用于生成一个空的`ImageData`对象，所有对象都是透明的黑色，即`rgba(0,0,0,0)`，有两种格式：

```javascript
ctx.createImageData(width, height)
ctx.createImageData(imagedata)
```

- width：ImageData 对象的宽度，单位为像素。
- height：ImageData 对象的高度，单位为像素。
- imagedata：一个现有的 ImageData 对象，返回值将是这个对象的拷贝。

### CanvasRenderingContext2D.save()

用于将画布的当前样式保存到堆栈，相当于在内存中产生一个样式快照

```javascript
var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

ctx.save();
```

### CanvasRenderingContext2D.restore()

将画布的样式恢复到上一个保存的快照，若没有已保存的快照，则没有效果

```javascript
var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

ctx.save();

ctx.fillStyle = 'green';
ctx.restore();

ctx.fillRect(10, 10, 100, 100);
```

### CanvasRenderingContext2D.canvas()

指向当前对象所在的`<canvas>`元素

只读

### 图像变换

图像变化的方法：

- `CanvasRenderingContext2D.rotate()`：图像旋转
- `CanvasRenderingContext2D.scale()`：图像缩放
- `CanvasRenderingContext2D.translate()`：图像平移
- `CanvasRenderingContext2D.transform()`：通过一个变换矩阵完成图像变换
- `CanvasRenderingContext2D.setTransform()`：取消前面的图像变换

#### rotate()

用于图像旋转，参数为一个弧度，表示顺时针旋转的度数

旋转中心点为画布左上角的原点，要改变中心点需要使用`translate()`移动画布

```javascript
var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

ctx.rotate(45 * Math.PI / 180);
ctx.fillRect(70, 0, 100, 30);
```

#### scale()

用于缩放图像，接收两个参数：

+ `x`轴方向的缩放因子
+ `y`轴方向的缩放因子

缩放因子可以缩放单位像素

若缩放因子为-1，则表示方向翻转，坐标轴是画布左上角为原点的坐标轴

#### translate()

用于平移图像，接收两个参数：

+ x轴移动的单位像素
+ y轴移动的单位像素

#### transfrom()

接收一个变换矩阵的六个元素作为参数，完成缩放、旋转、转动、倾斜等变形

```javascript
ctx.transform(a, b, c, d, e, f);
/*
a:水平缩放(默认值1，单位倍数)
b:水平倾斜(默认值0，单位弧度)
c:垂直倾斜(默认值0，单位弧度)
d:垂直缩放(默认值1，单位倍数)
e:水平位移(默认值0，单位像素)
f:垂直位移(默认值0，单位像素)
*/
```

例子：

```javascript
var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

ctx.transform(2, 0, 0, 1, 50, 50);
ctx.fillRect(0, 0, 100, 100);
```

==多个`transform()`具有叠加效果==

#### setTransfrom()

取消前面的图形变换，参数与`transform()`方法一致

```javascript
var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

ctx.translate(50, 50);
ctx.fillRect(0, 0, 100, 100);

ctx.setTransform(1, 0, 0, 1, 0, 0);
ctx.fillRect(0, 0, 100, 100);
```

## `<canvas>`元素的方法

### HTMLCanvasElement.toDataURL()

可以将Canvas数据转为Data URI格式的图像

```javascript
canvas.toDataURL(type, quality)
```

- type：字符串，表示图像的格式。默认为`image/png`，另一个可用的值是`image/jpeg`，Chrome 浏览器还可以使用`image/webp`。
- quality：浮点数，0到1之间，表示 JPEG 和 WebP 图像的质量系数，默认值为0.92。

返回一个Data URI格式的字符串

```javascript
function convertCanvasToImage(canvas) {
  var image = new Image();
  image.src = canvas.toDataURL('image/png');
  return image;
}
//将canvas元素转成高中低三种画质的JPEG图像
var fullQuality = canvas.toDataURL('image/jpeg', 0.9);
var mediumQuality = canvas.toDataURL('image/jpeg', 0.6);
var lowQuality = canvas.toDataURL('image/jpeg', 0.3);
```

### HTMLCanvasElement.toBlob()

将`<canvas>`对象转成一个Blob对象，默认类型为`image/png`

```javascript
// 格式
canvas.toBlob(callback, mimeType, quality)

// 示例
canvas.toBlob(function (blob) {...}, 'image/jpeg', 0.95)
```

- callback：回调函数。它接受生成的 Blob 对象作为参数。
- mimeType：字符串，图像的 MIMEType 类型，默认是`image/png`。
- quality：浮点数，0到1之间，表示图像的质量，只对`image/jpeg`和`image/webp`类型的图像有效。

方法没有返回值

例子：

```javascript
var canvas = document.getElementById('myCanvas');

function blobToImg(blob) {
  var newImg = document.createElement('img');
  var url = URL.createObjectURL(blob);

  newImg.onload = functio () {
    // 使用完毕，释放 URL 对象
    URL.revokeObjectURL(url);
  };

  newImg.src = url;
  document.body.appendChild(newImg);
}

canvas.toBlob(blobToImg);
```

## 使用实例

### 动画效果

```javascript
var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

var posX = 20;
var posY = 100;

setInterval(function () {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  posX += 1;
  posY += 0.25;

  ctx.beginPath();
  ctx.fillStyle = 'white';

  ctx.arc(posX, posY, 10, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.fill();
}, 30);
```

产生一个小圆点，每隔30毫秒就向右下方移动

修改为先上升后下降：

```javascript
var vx = 10;
var vy = -10;
var gravity = 1;

setInterval(function () {
  posX += vx;
  posY += vy;
  vy += gravity;
  // ...
});
```

### 像素处理

通过`getImageData()`方法和`putImageData()`方法，可以处理每个像素

```javascript
if (canvas.width > 0 && canvas.height > 0) {
  var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  filter(imageData);
  context.putImageData(imageData, 0, 0);
}
```

`filter`是处理像素的函数，有如下几种常见的：

#### 灰度效果

取红蓝绿三个像素值的算术平均值，将图像转成了黑白形式

```javascript
grayscale = function (pixels) {
  var d = pixels.data;
  for (var i = 0; i < d.length; i += 4) {
    var r = d[i];
    var g = d[i + 1];
    var b = d[i + 2];
    d[i] = d[i + 1] = d[i + 2] = (r + g + b) / 3;
  }
  return pixels;
};
```

#### 复古效果

将红绿蓝三种值，分别取这三个值的某种加权平均值

```javascript
sepia = function (pixels) {
    var d = pixels.data;
    for (var i = 0; i < d.length; i += 4) {
      var r = d[i];
      var g = d[i + 1];
      var b = d[i + 2];
      d[i]     = (r * 0.393) + (g * 0.769) + (b * 0.189); // red
      d[i + 1] = (r * 0.349) + (g * 0.686) + (b * 0.168); // green
      d[i + 2] = (r * 0.272) + (g * 0.534) + (b * 0.131); // blue
    }
    return pixels;
};
```

#### 红色蒙版效果

将红设为红绿蓝的平均值，且绿蓝均为0

```javascript
var red = function (pixels) {
  var d = pixels.data;
  for (var i = 0; i < d.length; i += 4) {
    var r = d[i];
    var g = d[i + 1];
    var b = d[i + 2];
    d[i] = (r + g + b)/3;        // 红色通道取平均值
    d[i + 1] = d[i + 2] = 0; // 绿色通道和蓝色通道都设为0
  }
  return pixels;
};
```

#### 亮度效果

将红绿蓝同时加上一个正值或负值

```javascript
var brightness = function (pixels, delta) {
  var d = pixels.data;
  for (var i = 0; i < d.length; i += 4) {
    d[i] += delta;     // red
    d[i + 1] += delta; // green
    d[i + 2] += delta; // blue
  }
  return pixels;
};
```

#### 反转效果

红绿蓝都取相反值

```javascript
invert = function (pixels) {
  var d = pixels.data;
  for (var i = 0; i < d.length; i += 4) {
    d[i] = 255 - d[i];
    d[i + 1] = 255 - d[i + 1];
    d[i + 2] = 255 - d[i + 2];
  }
  return pixels;
};
```











































