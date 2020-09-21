# 增

1. `document.createElement()`

2. `document.createTextNode()`

3. `elment.clondeNode()`

   参数可选，默认否则只赋值当前节点

   为`ture`则递归复制当前节点的所有子孙节点

4. `document.createDocumentFragment()`



# 删

1. `parent.removeChild(child)`

   返回移除的子节点

2. `element.remove()`

   移除自身



# 改

1. `parent.appendChild(child)`
2. `parentNode.insertBefore(newNode,targetNode)`
3. `parent.replaceChild(newChild,oldChild)`
4. `element.innerText`
5. `element.innerHTML`
6. `element.textContent`
   + innerText依赖浏览器的显示
   + textContent依赖代码的显示（即textContent显示什么取决于JS代码中那一段有什么文本）
   + innerText将block元素类型的空标签解析为换行，多个连起来视为一个；
   + textContent将N个空标签解析为N个换行
   + textContent对==IE8==不支持
   + innerText一定导致重流
   + textContent只有当赋值内容超出容器尺寸影响页面布局才回流，但一定重绘



# 查

1. `document.getElementById()`

2. `document.getElementsByTagName()`

3. `document.getElementsByName()`

4. `document.getElementsByClassName()`

5. `document.querySelector()`

6. `document.querySelectorAll()`

7. `document.elementFromPoint(x,y)`

   返回相对于浏览器窗口坐上的指定坐标最顶层的元素



# 元素属性操作

1. `element.getAttribute()`

2. `element.createAttribute(name)`

   返回创建的属性节点

3. `element.setAttribute(name,value)`

4. `element.removeAttribute()`

5. `element.attributes`

   返回元素属性数组