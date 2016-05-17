## Angular 1.x和ES6的结合

[作者: 徐飞](https://github.com/xufei/blog/issues/29)

在Web前端技术飞速发展的今天，Angular 1.x可以说是一个比较旧的东西，而ES6是新生事物。我们想要把这两个东西结合起来，感觉就好像“十八新娘八十郎，苍苍白发对红妆。”但这件事的难度也并不大，因为我们最终是要把ES6构建成ES5代码，而ES5代码是可以很容易和Angular 1.x协作的。

不过，为什么我们要干这件事呢？

在[这篇文章](https://www.zhihu.com/question/38571416/answer/77067217)中，我提到过：

> 尽管在整个前端开发圈中，大家并不是很欢迎Angular，而且很多人认为它的1.x版本已经衰落，但我跟 @小猪有个观点是一致的，那就是：“在企业开发领域，ng1的应用才方兴未艾”，也就是说，它在这个领域其实还是上升阶段。

所以，在不少场合下，它还是要承载一些开发工作，部分老系统的逐步平滑迁移也是比较重要的。

做这件事的另外一个意图是：虽然未来的框架选型会有不少争议，但有一点毋庸置疑，那就是业务JS代码的全面ES6或者TS化，这一点我们现在就可以着手去做，并且可以尽量把数据和业务逻辑层实现成框架无关的形式。

在[这篇](https://github.com/xufei/blog/issues/24)里大致讲了点对这方面的考虑。

### 模块机制

Angular 1.x的module机制是比较别扭的，也是一种框架私有的模块机制，所以，我们需要淡化这层东西，具体的措施是：

- 把各功能模块的具体实现代码独立出来
- module机制作为一个壳子，对功能模块进行包装
- 每个功能分组，使用一个总的壳子来包装，减少上级模块的引用成本
- 每个壳子文件把module的name属性export出去

举例来说，我们有一个moduleA，里面有serviceA，serviceB，那么，就有这样一些文件：

*serviceA的实现，service/a.js*

```
export default class ServiceA {}
```

*serviceB的实现，service/b.js*

```
export default class ServiceB {}
```

*moduleA的壳子定义，moduleA.js*

```
import ServiceA from "./services/a";
import ServiceB from "./services/b";

export default angular.module("moduleA", [])
    .service("ServiceA", ServiceA)
    .service("ServiceB", ServiceB)
    .name;
```

存在一个moduleB要使用moduleA：

```
import moduleA from "./moduleA";

export default angular.module("moduleB", [moduleA]).name;
```

注意，这里为什么我们要export module的name呢？这是为了这个module的引用者方便，如果某个module改名了，所有依赖它的module可以不修改代码。

在这里我们可以看到，a.js，b.js，moduleA.js这三个文件，只有moduleA是作为一次性的配置项，而a和b可以尽量实现成框架无关的代码，这样将来的迁移代价会比较小。

### service，factory，controller，filter

在Angular 1.x里面，有factory和service两个概念，其实这两者可以替换，service传入的是构造函数，通过new创建出实例，而factory传入的是工厂函数，通过对这个工厂函数的调用而创建实例。

所以，如果要使用ES6代码来编写这个部分，也就很自然了：

*serviceA的实现，service/a.js*

```
export default class ServiceA {}
```

*serviceA的模块包装器moduleA的实现*

```
import ServiceA from "./service/a";

export angular.module("moduleA", [])
    .service("ServiceA", ServiceA)
    .name;
```

*factoryA的实现，factory/a.js*

```
import EntityA from "./model/a";

export default function FactoryA {
    return new EntityA();
}
```

*factoryA的模块包装器moduleA的实现*

```
import FactoryA from "./factory/a";

export angular.module("moduleA", [])
    .factory("FactoryA", FactoryA)
    .name;
```

注意看这个例子中，FactoryA函数的返回结果是new EntityA，在实际项目中，这里不一定是通过某个实体类创建的，也可能是直接一个对象字面量：

```
export default function FactoryA {
    return {
        a: 1
    };
}
```

在ES6下，factory的定义其实可以有一些优化，比如说，我们可以不需要factory/a.js这个文件，也不需要这层factory封装，而是在module定义的地方，这样写：

```
import EntityA from "./model/a";

export angular.module("moduleA", [])
    .factory("FactoryA", () => new EntityA())
    .name;
```

使用ES6定义controller的方式大致与service相同，

### 如何处理依赖注入

有一点值得注意，刚才我们提到的模块定义方式里，并没有考虑依赖注入，但实际业务中一般都要注入点东西，那怎么办呢？

有两种办法：

*controllers/a.js*

```
export default class ControllerA {
    constructor(ServiceA) {
        this.serviceA = ServiceA;
    }
}

ControllerA.$inject = ["ServiceA"];
```

```
import ControllerA from "./controllers/a";

export angular.module("moduleA", [])
    .controller("ControllerA", ControllerA);
```

或者：

或者：
*controllers/a.js*

```
export default class ControllerA {
    constructor(ServiceA) {
        this.serviceA = ServiceA;
    }
}
```

```
import ControllerA from "./controllers/a";

export angular.module("moduleA", [])
    .controller("ControllerA", ["ServiceA", ControllerA]);
```

个人推荐前一种，理由是，一个模块的依赖项声明，最好跟其实现放在一起，这样对可维护性更有利。

在考虑依赖注入的时候，还存在另外一个问题，我们现在这样做，实质上已经弱化了Angular自身的DI，但这时候，为什么我们还需要DI？如果我们在一个Controller里面依赖某个Service，大可以直接import它啊，为什么还非要去从DI走一圈？

这里面有个麻烦，如果你所依赖的东西没有对Angular DI依赖，那还好，不然的话，没法实例化，比如说：

```
export default class ServiceA {
    constructor($http) {}
}

ServiceA.$inject = ["$http"];
```

如果我要在一个别的东西里实例化这个ServiceA，就没法给它传入$http，这些东西要从ng里获取，考虑是不是搞个专门的实例化函数，类似provider，专门去做这个实例化，这样可以消除DI，直接import。

### directive

这个是终极纠结点了，因为一个directive，可能包含有compile，link等多个成员函数，各种配置项，一个可选controller之类，这里面我们要考虑这么一些东西：

- directive自身怎么定义为ES6代码
- 里面的各项成员如何处理
- controller如何定义

我们看一下directive主要包含些什么东西，它其实是一个ddo（Directive Definition Object），所以本质上这是一个对象，我们可以给它构建一个类。

```
export default class DirectiveA {
}
```

DDO上面的东西大致可以分两类，属性和方法，所以就在构造函数里这样定义：

```
constructor () {
    this.template = template;
    this.restrict = "E";
}
```

像这些都是基础的配置字符串，没什么特别的。剩下的就是controller和link，compile等函数了，这些东西其实也简单，比如controller，可以先实现一个普通controller类，然后赋值到controller属性上来：

```
this.controller = ControllerA;
```

注意现在写directive，尽量使用controllerAs这样的语法，这样controller可以清晰些，不必注入$scope，而且还可以使用bindToController属性，把在attr上定义的属性或者方法直接传递到controller实例上来。

比如我们要做一个日期控件，最后合起来就是这样：

```
import template from "../templates/calendar.html";
import CalendarCtrl from "../controllers/calendar";

import "../css/calendar.css";

export default class CalendarDirective {
    constructor() {
        this.template = template;
        this.restrict = "E";

        this.controller = CalendarCtrl;
        this.controllerAs = "calendarCtrl";
        this.bindToController = true;

        this.scope = {
            minDate: "=",
            maxDate: "=",
            selectedDate: "=",
            dateClick: "&"
        };
    }

    link (scope) {
        // 这段代码太别扭了，但问题是如果搬到controller里面去写成setter，会在constructor之前执行，真头疼，先这样吧
        scope.$watch("calendarCtrl.selectedDate", newDate => {
            if (newDate) {
                scope.calendarCtrl.calendar.year = newDate.getFullYear();
                scope.calendarCtrl.calendar.month = newDate.getMonth();
                scope.calendarCtrl.calendar.date = newDate.getDate();
            }
        });
    }
}
```

然后，在module定义的地方：

```
import CalendarDirective from "./directives/calendar";

export default angular.module("components.form.calendar", [])
    .directive("snCalendar", () => new CalendarDirective())
    .name;
```

上面这个例子里，还有些比较头疼的地方。本来我们剥离了清晰的controller，就是为了里面不要有$scope这些奇奇怪怪的东西，但我们需要$watch这个selectedDate的赋值，就折腾了，$watch是定义在$scope上面的，而如果在controller上给selectedDate定义一个setter，可能由于babel跟angular共同的作用，时序有点问题……后面再想办法优化吧。

一个directive除了有这些，还可以有template的定义，所以在这个例子里我们也是用import把一个html加进来了，Webpack的html loader会自动把它变成一个字符串。

还有，组件化的思想指导下，单个组件也应当管理自己的样式，所以我们在这里也import了一个css，这个后面会被Webpack的css loader处理。

### 消除显式的$scope

我们前面提到，做这套方案有一个很重要的意图，那就是在数据和业务逻辑层尽量清除Angular的影子，使得除了最上层的部分，其他都可以被其他框架方案使用，比如React和Vue，这里面有一些关键。

在Angular 1.x中，一个核心的东西是$scope，它是一切东西运行的基石，然而，把这些东西暴露给一线开发者，其实并不优雅，所以，Angular 1.2之后，逐步提供了一些选项，用于减少开发过程中对$scope的显式依赖。

那么，我们可能会在什么场景下用到$scope，主要用到它的什么能力呢？

- controller中注入，给界面模板中的绑定变量或者方法用
- 依赖属性的计算，比如说我们可以手动$watch一个变量、对象、数组，然后在变更回调中更改另外的东西
- 事件的冒泡和广播，根作用域
- directive中的controller，link等函数使用

我们一个一个来看，这些东西怎么消除。

#### controller注入

以前我们一般要在controller中注入$scope，但是从1.2版本之后，有了controllerAs语法，所以这个就不再必要了，之前是这样：

```
<div ng-controller="TestCtrl">
    <input ng-model="aaa">
</div>
```

```
xxx.controller("TestCtrl", ["$scope", function($scope) {
    $scope.aaa = 1;
}]);
```

现在成了：

```
<div ng-controller="TestCtrl as testCtrl">
    <input ng-model="testCtrl.aaa">
</div>
```

```
xxx.controller("TestCtrl", [function() {
    this.aaa = 1;
}]);
```

这里的关键点就在于，controller变成了一个纯净的视图模型，实际上框架会做一件事：

```
$scope.testCtrl = new TestCtrl();
```

所以，对于这一块，其实我们是不必担忧的，把那个function换成一个普通的ES6 Class就好了。

#### 依赖属性的计算

我们知道，在$scope上，除了有$watch，$watchGroup，$watchCollection，还有$eval（作用域上的表达式求值）这类东西，我们必须想到对它们的替代办法。

先来看看$watch，一个典型的例子是：

```
$scope.$watch("a", function(val) {
    $scope.b = val + 1;
});
```

这个我们的办法很简单，在ES5+，对象上是有setter和getter的，那我们只要在ES6代码里这么定义就行了：

```
class A {
    set a(val) {
        this.b = val + 1;
    }
}
```

如果有多个变量的观测，比如：

```
$scope.$watchGroup(["firstName", "lastName"], function(val) {
    $scope.fullName = val.join(",");
});
```

我们可以写多个setter来做，也可以写一个getter：

```
class A {
    get fullName() {
        return this.firstName + "," + this.lastName;
    }
}
```

下一个，$watchCollection，这个有些复杂，因为它可以观测数组内部元素的变化，但其实JavaScript语法层面是缺少一些东西的，对比其他语言，早在十多年前，C# 1.0中就支持了indexer，也就是可以自定义下标操作。

不过这个也难不倒我们，在Adobe Flex里面，有一个ArrayCollection，实际上是封装了对于数组的操作，所以，我们需要的只是把数组的变更操作封装起来，不直接在原始数组上进行操作就好了。

所以我们的结构就类似如下：

```
class A {
    constructor() {
        this.arr = [];
    }

    add(item) {
        this.arr.push[item];

        //这里干点别的
    }
}
```

对于这个封装好的东西，我们的原则是：读取操作可以直接取引用，但是写入操作必须通过封装的这些方法去调用。

这里还有技巧，我们其实是可以把这类数组操作全部封装，也搞成类似ArrayCollection那样，但很多时候，ArrayCollection太通用了，我们其实要的是强化的领域模型，而不是通用模型。所以，针对每个业务模型单独封装，有其自身的优势。

注意，我们这里仅仅是封装了数组元素的操作，并未对元素自身属性的变更，或者高维数组，这些需要多层封装。

#### 事件的冒泡和广播

在$scope上，另外一套常用的东西是$emit，$broadcast，$on，这些API其实是有争议的，因为如果说做组件的事件传递，应当以组件为单位进行通信，而不是在另外一套体系中。所以我们也可以不用它，比较直接的东西通过directive的attr来传递，更普遍的东西用全局的类似Flux的派发机制去通信。

根作用域的问题也是一样，尽量不要去使用它，对于一个应用中全局存在的东西，我们有各种策略去处理，不必纠结于$rootScope。

#### directive等地方中的$scope

哎，其实理论上是可以把业务代码中每个地方都搞得完全没有$scope的，而且也能比较优雅通用，但是。。。总有一些例外。

先看看正常的吧。

我们知道，在定义directive的时候，ddo中有个属性是scope，这个里面定义了要在directive内外进行传递的属性或者方法，并且有不同的传递类型。我们又知道，directive有个controllerAs选项，可以类似前面提到的，controller中不注入$scope：

```
class TestCtrl {
    constructor() {
        this.a = 1;
    }
}

export default class CalendarDirective {
    constructor() {
        //...
        this.controller = TestCtrl;
        this.controllerAs = "testCtrl";

        this.scope = {
            a: "="
        };
    }
}
```

这时候就有个问题了，我们知道，最终结构会变成：

```
$scope.testCtrl.a == 1;
```

但这句：

```
this.scope = {
    a: "="
};
```

又会导致$scope.a == 1，而且，在testCtrl这个实例中，如果你不显式传入$scope，还访问不到外面那个a，这跟我们的预期是不相符的。所以，这时候我们要配合用bindToController，可以写个属性true，也可以把scope对象搬上去（1.4以上版本支持）。

所以代码就成了这样：

```
class TestCtrl {
    constructor() {
        this.a = 1;
    }
}

export default class CalendarDirective {
    constructor() {
        //...
        this.controller = TestCtrl;
        this.controllerAs = "testCtrl";
        this.bindToController = true;

        this.scope = {
            a: "="
        };
    }
}
```

这样都对了吗，并不会……

我们再综合一下：

```
class TestCtrl {
    constructor() {
        this.a = 1;
    }

    set a(val) {
        this.b = val + 1;
    }
}

export default class CalendarDirective {
    constructor() {
        //...
        this.controller = TestCtrl;
        this.controllerAs = "testCtrl";
        this.bindToController = true;

        this.scope = {
            a: "="
        };
    }
}
```

这里，只是在TestCtrl中给a加了一个setter，然而这个代码是不运行的，貌似绑定过程有问题，所以我才会在上面那个地方加了个很别扭的$watch，也就是：

```
class TestCtrl {
    constructor() {
        this.a = 1;
    }
}

export default class CalendarDirective {
    constructor() {
        //...
        this.controller = TestCtrl;
        this.controllerAs = "testCtrl";
        this.bindToController = true;

        this.scope = {
            a: "="
        };
    }

    link(scope) {
        scope.$watch("testCtrl.a", val => scope.testCtrl.b = val + 1);
    }
}
```

而且，这里再$watch的话，需要把controller实例的别名也作为路径放进去，testCtrl.a，而不是a。总之还是有些别扭，但我觉得这里应该还有办法解决。

// 上面这段等我有空详细再想想

有的时候，直接把setter或者getter绑定到界面，会不太适合，虽然Angular的ng-model中支持getterSetter这种辅助，但毕竟还有所不同，所以很多时候我们很多时候可能需要把带getter和setter的业务对象下沉一级，外面再包装一层给angular绑定用。

### 小结

在任何一个严谨的项目中，应当有比较确定的业务模型，即使脱离界面本身，这些模型也应当是可以运作的，而ES6之类语法的便利性，使得我们可以更好地组织下层业务代码。即使目的不是为了使用Angular 1.x，这一层的精心构造也是有价值的。当做完这层之后，上层迁移到各种框架都基本只剩体力活了。