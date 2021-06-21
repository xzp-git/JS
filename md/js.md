## ECMAScript262中数据类型的标准定义

> **4.2 ECMAScript Overview**
> ECMAScript is object-based: basic language and host facilities are provided by objects, and an ECMAScript program is a cluster of communicating objects. In ECMAScript, an object is a collection of zero or more properties each with attributes that determine how each property can be used—for example, when the Writable attribute for a property is set to false, any attempt by executed ECMAScript code to assign a different value to the property fails. Properties are containers that hold other objects, primitive values, or functions. A primitive value is a member of one of the following built-in types: Undefined, Null, Boolean, Number, String, and Symbol; an object is a member of the built-in type Object; and a function is a callable object. A function that is associated with an object via a property is called a method.
> ECMAScript是基于对象的:基本语言和主机设施是由对象提供的，而ECMAScript程序是通信对象的集群。在ECMAScript中，对象是0个或多个属性的集合，每个属性都具有决定如何使用每个属性的属性——例如，当属性的可写属性被设置为false时，执行ECMAScript代码为属性分配不同值的任何尝试都将失败。属性是容纳其他对象、基本值或函数的容器。原始值是以下内置类型之一的成员:未定义、Null、布尔、数字、字符串和符号;对象是内置类型对象的成员;函数是可调用对象。通过属性与对象关联的函数称为方法。
>
> ECMAScript defines a collection of built-in objects that round out the definition of ECMAScript entities. These built-in objects include the global object; objects that are fundamental to the runtime semantics of the language including Object, Function, Boolean, Symbol, and various Error objects; objects that represent and manipulate numeric values including Math, Number, and Date; the text processing objects String and RegExp; objects that are indexed collections of values including Array and nine different kinds of Typed Arrays whose elements all have a specific numeric data representation; keyed collections including Map and Set objects; objects supporting structured data including the JSON object, ArrayBuffer, and DataView; objects supporting control abstractions including generator functions and Promise objects; and, reflection objects including Proxy and Reflect.
> ECMAScript定义了一个内置对象集合，它完善了ECMAScript实体的定义。这些内置对象包括全局对象;对象是语言运行时语义的基础，包括对象、函数、布尔值、符号和各种错误对象;表示和操作数值(包括数学、数字和日期)的对象;文本处理对象字符串和RegExp;对象，该对象是值的索引集合，包括数组和9种不同类型的数组，其元素都具有特定的数值数据表示;键控集合，包括Map和Set对象;支持结构化数据的对象，包括JSON对象、ArrayBuffer和DataView;支持控制抽象的对象，包括生成器函数和承诺对象;以及反射对象，包括代理和反射
- 原始值类型【值类型/基本数据类型】
  - number 数字
  - string 字符串
  - boolean 布尔
  - null 空对象指针
  - undefined 未定义
  - symbol 唯一值
  - bigint 大数
- 对象类型【引用数据类型】
  - 标准普通对象 object
  - 标准特殊对象 Array RegExp Date Math Error...
  - 非标准特殊对象 Number String Boolean
  - 可调用/执行对象 function
  
## typeof数据类型检测的底层机制
- 特点1: 返回的结果是字符串，字符串中包含了对应的数据类型
  - ```js 
    typeof typeof typeof [1,2,3] //'string' 
    ```
- 特点2：按照计算机底层存储的二进制进行检测【效率高】
  - 000 对象
  - 1 整数
  - 010 浮点数
  - 100 字符串
  - 110 布尔
  - 0000... null
  - -2^30 undefined
  - ...
- 特点3：typeof null -> 'object'
- 特点4：typeof '对象' -> 'object' typeof '函数/class' -> 'function'
  
  - 验证是否是对象的判断
- 特点5：typeof '未被声明的变量' -> 'undefined'
  - 插件封装中的暴露API
  - ```js
     /*
      *  1.typeof  **
      *  2.instanceof
      *  3.constructor
      *  4.Object.prototype.toString.call([value])  **
      *  ---
      *  Array.isArray
      *  isNaN
      *  ...
      * 
      * typeof底层处理机制
      */

      // (function () {
      //     let utils = {
      //     };
      //     if (typeof window !== "undefined") window.utils = utils;
      //     if (typeof module === "object" && typeof module.exports === "object") module.exports = utils;
      // })();
      // utils.xxx();
     ```
## JS底层存储机制:堆(Heap)、栈(Stack)内存
- 以下代码作为运行示例
```js
var a = 12;        //window.a = 13
var b = a;         
b = 13; 

console.log(a) 12


let b = 14
const c = 15
d = 16           //window.d = 16
```

![](../image/V8底层运行机制_EC_VO_GO（1）.png)
- 以下代码作为运行示例
```js
var a = {
    n: 1
};

var b = a;

a.x = a = {
    n: 2
};

console.log(a.x);    // undefined    

console.log(b);      //  { n:1,x:{ n:2 } }

```

![](../image/V8底层运行机制_EC_VO_GO（2）.png)

