---
title: JS继承详解-红宝书
tags: JS
---

## 1. 原型链继承

```js
function Parent() {
    this.name = 'kiven'
}

Parent.prototype.getname = function () {
    return this.name
}

function Child() {
    
}
Child.prototype = new Parent()
```

缺点: 

- 原型链中引用类型属性被所有实例共享

- 创建Child实例时, 不能向Parent传参



## 2. 借用构造函数继承

```js
function Parent() {
    this.name = ['Jeden']
}
function Child() {
    Parent.call(this);
}
var child1 = new Child();
var child2 = new Child();
child1.name.push('Jeden1');
child2.name.push('Jeden2');
print(child1.name); // ['Jeden', 'Jeden1']
print(child2.name); // ['Jeden', 'Jeden2']
```

优点: 

- 避免了引用类型数据被共享

- 可以向Parent传参

缺点: 每一次都会创建一个新的方法, 占用内存空间



## 3. 组合继承 (组合原型链继承和经典继承)

```js
function Parent (name) {
    this.name = name;
    this.colors = ['red', 'blue', 'green'];
}
Parent.prototype.getName = function () {
    console.log(this.name) // 函数定义在外面避免重复创建
}
function Child (name, age) {
    Parent.call(this, name);
    this.age = age;
}
```

优点: 融合了原型继承和经典继承优点, 是**最常用的继承方式**



## 4. 原型继承

```js
function createObj (o) {
    function F() {};
    F.prototype = o.prototype;
    return new F();
}
```

算是Object.create的模拟实现

缺点跟原型链继承差不多



## 5. 寄生式继承

```js
function createObj(o) {
    let clone = Object.create(o);
    clone.sayName = function () {
        console.log('hi')
    }
    return clone
}
```

缺点: 和构造函数继承一样, 每一次都创建方法



## 6. 圣杯模式 (寄生组合式继承) -- 完美继承

```js
let inherit = (function ()  {
    function F() {};
    return function (Target, Origin) {
        F.prototype = Origin.prototype;
        Target.prototype = new F();
        Target.prototype.constructor = Target;
        Target.prototype.uber = Origin.prototype;
    }
})()
```

*这种方式的高效率体现它只调用了一次 Parent 构造函数，并且因此避免了在 Parent.prototype 上面创建不必要的、多余的属性。与此同时，原型链还能保持不变；因此，还能够正常使用 instanceof 和 isPrototypeOf。开发人员普遍认为寄生组合式继承是引用类型最理想的继承范式。*