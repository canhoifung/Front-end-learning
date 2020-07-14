





# 继承 class、extends、super

```JavaScript
class Animal {
    constructor() {
        this.type = 'animal';
    }
    says(say) {
        console.log(this.type + ' says ' + say);
    }
}

let animal = new Animal();
animal.says('hello'); //animal says hello

//通过extends关键字实现继承
class Cat extends Animal {
    constructor() {
    //必须调用super方法,否则会报错
        super();
        this.type = 'cat';
    }
}

let cat = new Cat();
cat.says('hello'); //cat says hello


////////////////////
class Colorpoint extends Point {
  constructor(x,y,color){
      super(x,y); //调用父类的constructor(x,y)
      this.color = color
  }
  toString(){
  //调用父类的方法
      return this.color + ' ' + super.toString();
}
}
```
>constructor内定义的方法和属性是实例对象自己的，而constructor外定义的方法和属性则是所有实力对象可以共享的  









































