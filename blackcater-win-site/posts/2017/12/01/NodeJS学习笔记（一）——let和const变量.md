---
title: let和const变量
cover: http://oameisqha.bkt.clouddn.com/14834472506416.png
date: 2017-12-01
tags: [Note, Tutorial]
category: tech
---

# let和const变量

## let命令

###作用域

在es5中，只有函数级别的和全局的作用域。

在es6中，只要是具有`{}`包裹的内部，都是块儿级作用域。在内部用`let`声明变量，只会在当前块儿级作用域及后续的块儿级作用域中有效。上级作用域是无法访问的。

```javascript
console.log(author); //ReferenceError
{
  let author = "blackcater";
  {
  	console.log(author); // blackcater
    {
  	  console.log(author); // blackcater
	}
  }
}
```



###变量,函数提升

在es5中，变量以及函数都具有作用域提升的性质。

变量和函数提升就是说：在解析作用域（这里因为是es5，所以只支持全局作用域和函数作用域）中的代码时，内部变量的声明，函数的声明都会隐式的放在当前作用域的最前面，提前声明。

对于变量提升：将会将变量声明为`undefined`。

对于函数提升：将会将函数代码放在作用域的最前面，且同名函数后者覆盖前者。

例如：

```javascript
console.log(author);
var author = "blackcater";
function f(){
  console.log(author);
}
function f(){
  console.log("github");
}
```

解析时：

```javascript
var f = function {
  console.log(author);
}
f = function (){
  console.log("github");
}
var author; // 等价于 var author = undefined;
// 变量，函数作用域提升
console.log(author); // undefined
var author = "blackcater";
```

在es6中，对于let变量，是不存在变量提升的。

另外，在es5中，不在严格模式下，可以在`if`块儿中声明函数。

在es6中，在不在严格模式下都能在块儿级作用域中声明函数。这是因为es6具有块儿级作用域，函数可以声明在其内部。

在es5非严格模式下：(es5严格模式下只能在顶层作用域和函数作用域内声明函数)

```javascript
if(true){
	function bar(){
		console.log("blackcater!");
	}
}
bar(); // blackcater 由于发生了函数提升，所以函数相当于在全局声明，所以不会报错。
```

所以，我们就能很好的理解下面的代码了：

```javascript
function f() { console.log('I am outside!'); }
(function () {
  if(false) {
    // 重复声明一次函数f
    function f() { console.log('I am inside!'); }
  }

  f();
}());
```

上面代码在ES5中运行，会得到“I am inside!”，但是在ES6中运行，会得到“I am outside!”。这是因为ES5存在函数提升，不管会不会进入 `if`代码块，函数声明都会提升到当前作用域的顶部，得到执行；而ES6支持块级作用域，不管会不会进入if代码块，其内部声明的函数皆不会影响到作用域的外部。



###暂时性死区

在使用`let`时，在当前作用域中，let变量声明之前，任何对let变量的赋值和访问等操作都是出错的（ReferenceError）。在let变量声明前至当前作用域开始，都是该变量的**暂时性死区**

```javascript
if (true) { // 当前块儿级作用域
  // TDZ开始
  tmp = 'abc'; // ReferenceError
  console.log(tmp); // ReferenceError

  let tmp; // TDZ结束 之前都是tmp变量的暂时性死区
  console.log(tmp); // undefined

  tmp = 123;
  console.log(tmp); // 123
}
```

由于暂时性死区的存在，所以`typeof`操作并不是安全的操作。当使用`typeof`操作判断触发暂时性死区的变量，则会出错(ReferenceError)。

```javascript
{ // 当前块儿级作用域
  typeof x; // ReferenceError
  let x;
}
```

有一些的暂时性死区很难被发现，比较隐蔽，如下:

```javascript
function bar(x = y, y = 2) {
  return [x, y];
}

bar(); // 报错
```

你可以向下面这样理解代码：

```javascript
function bar(){// 当前函数作用域
  let x = y; // 之前都是x的暂时性死区
  let y = 2; // 之前都是y的暂时性死区
}
bar(); // 报错
```

这样就很好理解了：调用`bar`函数之所以报错，是因为参数`x`默认值等于另一个参数`y`，而此时`y`还没有声明，属于”死区“。

ES6规定暂时性死区和不存在变量提升，主要是为了减少运行时错误，防止在变量声明前就使用这个变量，从而导致意料之外的行为。这样的错误在ES5是很常见的，现在有了这种规定，避免此类错误就很容易了。

总之，暂时性死区的本质就是，只要一进入当前作用域，所要使用的变量就已经存在了，但是不可获取，只有等到声明变量的那一行代码出现，才可以获取和使用该变量。



###不能重复声明

let不允许在同一作用域下重复的声明同一个变量。

```javascript
// 报错
function () {
  let a = 10;
  let a = 1;
}
// 报错
function () {
  let a = 10;
  var a = 1;
}

function func(arg) {
  let arg; // 报错
}

function func(arg){
  {
  	let arg = "123"; // 不报错
  }
}
```



## const命令

`const`命令用来声明常量，一旦声明，值就不会发生变化。

在严格模式下，对`const`变量进行修改是会报错的，但在非严格模式下，是没有事，但是变量值并不会改变。

```javascript
// 严格模式下
'use strict';
const PI = 3.1415;
PI // 3.1415

PI = 3;
// TypeError: "PI" is read-only

// 普通模式下
const PI = 3.1415;
PI = 3; // 常规模式时，重新赋值无效，但不报错
PI // 3.1415
```

`const`声明的变量不能改变值，这意味着，`const`一旦声明变量，就必须立即初始化，不能留到以后赋值。

```javascript
// 严格模式下
'use strict';
const foo; // SyntaxError: missing = in const declaration

// 非严格模式下
const foo;
foo = 1; // 常规模式，重新赋值无效
foo // undefined
```

`const`变量和`let`一样，也是块儿级作用域类有效。也存在暂时性死区。也不能重复声明

```javascript
// 暂时性死区
if (true) {
  console.log(MAX); // ReferenceError
  const MAX = 5;
}

// 不能重复声明
var message = "Hello!";
let age = 25;
// 以下两行都会报错
const message = "Goodbye!";
const age = 30;
```

对于复合类型的变量，变量名不指向数据，而是指向数据所在的地址。const命令只是保证变量名指向的地址不变，并不保证该地址的数据不变，所以将一个对象声明为常量必须非常小心。

```javascript
// 对象
const foo = {};
foo.prop = 123;
foo.prop // 123
foo = {} // TypeError: "foo" is read-only
// 数组
const a = [];
a.push("Hello"); // 可执行
a.length = 0;    // 可执行
a = ["Dave"];    // 报错
```

如果真想让对象冻结，内部属性不能被修改和添加。我们应该使用`Object.freeze()`函数。

```javascript
const foo = Object.freeze({});
// 常规模式时，下面一行不起作用；
// 严格模式时，该行会报错
foo.prop = 123;
```

上面代码中，常量`foo`指向一个冻结的对象，所以添加新属性不起作用，严格模式时还会报错。

除了将对象本身冻结，对象的属性也应该冻结。下面是一个将对象彻底冻结的函数。

```javascript
var constantize = (obj) => {
  Object.freeze(obj);
  Object.keys(obj).forEach( (key, index) => {
    if ( typeof obj[key] === 'object' ) {
      constantize( obj[key] );
    }
  });
};
```

ES5只有两种声明变量的方法：`var`命令和`function`命令。

ES6除了添加`let`和`const`命令，后面章节还会提到，另外两种声明变量的方法：`import`命令和`class`命令。所以，ES6一共有6种声明变量的方法。



##跨模块常量

上面说过，const声明的常量只在当前代码块有效。如果想设置跨模块的常量，可以采用下面的写法。

```javascript
// constants.js 模块
export const A = 1;
export const B = 3;
export const C = 4;

// test1.js 模块
import * as constants from './constants';
console.log(constants.A); // 1
console.log(constants.B); // 3

// test2.js 模块
import {A, B} from './constants';
console.log(A); // 1
console.log(B); // 3
```



##全局对象的属性

全局对象是最顶层的对象，在浏览器环境指的是`window`对象，在Node.js指的是`global`对象。ES5之中，全局对象的属性与全局变量是等价的。

```javascript
window.a = 1;
a // 1

a = 2;
window.a // 2
```

上面代码中，全局对象的属性赋值与全局变量的赋值，是同一件事。（对于Node来说，这一条只对REPL环境适用，模块环境之中，全局变量必须显式声明成`global`对象的属性。）

这种规定被视为JavaScript语言的一大问题，因为很容易不知不觉就创建了全局变量。ES6为了改变这一点，一方面规定，var命令和function命令声明的全局变量，依旧是全局对象的属性；另一方面规定，let命令、const命令、class命令声明的全局变量，不属于全局对象的属性。

```javascript
var a = 1;
// 如果在Node的REPL环境，可以写成global.a
// 或者采用通用方法，写成this.a
window.a // 1

let b = 1;
window.b // undefined
```

上面代码中，全局变量`a`由`var`命令声明，所以它是全局对象的属性；全局变量`b`由`let`命令声明，所以它不是全局对象的属性，返回`undefined`。

