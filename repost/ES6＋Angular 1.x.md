# ES6＋Angular 1.x

[作者：太极客](https://segmentfault.com/a/1190000002680386)

> 本文原题：**《面向未来的前端模块化开发与包管理》**，最初发表于 div.io。目前原文还在不断更新修改中，有更新再同步到 SF。由于是实验性质的尝试，故相关视频的录制将等到完全成稿之后再进行。因为我相信很多前端工程师都会对这个事情很关注，所以先写成文分享出来顺便听听反馈以进一步完善这个实验。

# 面向未来的前端模块化开发与包管理

![img](https://segmentfault.com/image?src=http://divio.qiniudn.com/FlEfOFL-qPkDAyu-u-AXe9lvETkL&objectId=1190000002680386&token=aafc3108339b52b8fc734d8e2365db1a)

ES2015 是让人兴奋的！除了语法层面的种种提升之外，最令人期待的就是模块化系统和异步模块加载机制。JavaScript 第一次在语言层面拥有了标准且先进的模块化系统。

然而标准本身只是落在纸面上的“理想”，更进一步的问题则是如何实践？理想状况下，只要各浏览器厂商尽快根据标准实现对新模块化语法的解释运行以及实现异步模块加载的接口 API，我们就可以“享用”这些特性了，但是实际上还有更多的问题需要解决。接下来要谈到的 jspm 就是一个完整的解决方案，它有着许多迷人的特质：比如它包容并蓄的广泛适应性，容易上手的工具链，面向未来的设计哲学并不失对遗留代码的向后兼容能力等等……尽管从名字上看它只是一个**包管理器（package manager）**，但它帮助我们做到的则远不止如此。

要理解 jspm 所能做的一切事情将会是一个相对漫长的过程，并且其中的一些细节也很难只是用文字就可以描述的清楚和简洁。在我们开始之前，我强烈推荐你去看两个视频／文章（需科学上网）：

1. [Glen Maddern](https://twitter.com/glenmaddern) 编写的文章和视频：[JavaScript in 2015](http://glenmaddern.com/articles/javascript-in-2015)
2. [Guy Bedford](https://twitter.com/guybedford) 在 JSConf 2014 发表的第一次介绍 jspm.io 的演讲：[Package Management for ES6 Modules](https://www.youtube.com/watch?v=szJjsduHBQQ)

我建议你最好按顺序来看，第一个视频简短而明快，没有太多的理论但却能一眼遍观 ES2015 的许多魅力所在；第二个视频则是 jspm/SystemJS/ES6 Modules Loader 的原作者亲自介绍和演示 jspm 的实现细节。

如果你并没有认真了解过 ES2015 的模块化系统，上述视频中所演示的东西大概会带给你一些“黑魔法”般的惊艳＋困惑。不用担心，本文将会用另外一个例子一步一步的重现这些“黑魔法”并告诉你这其中的奥妙之处。

为了让我们的例子更具实践指导意义本文将不只是介绍 jspm 了事，而是结合 jspm 构造一个基于 Angular 1.x 的前端项目——我们都知道关于 Angular 2.0 的故事，但是在那变成可“接受”的现实之前我们也不想一直做一个 ES2015 的旁观者。所以，就是今天！Angular 1.x＋ES2015，jspm 为你立刻实现！

## 背景故事——“三驾马车”

jspm 的模块化实现有两个基石：[ES6 Module Loader Polyfill](https://github.com/ModuleLoader/es6-module-loader) 和 [SystemJS Universal Dynamic Module Loader](https://github.com/systemjs/systemjs)，在这里我们不做太多深入讨论，你可以去看看这两个项目的文档和源码。此时此刻，你只需要问自己这样一个问题：

> CJS/AMD/Global/ES6 Module...，我们有办法把它们全部统一起来并且都能在浏览器里使用吗？

答案当然是可以，上述两个项目就是做这些事情的，并且在此基础上我们也可以把其他非 JavaScript 资源当作模块来导入到项目代码中（html/css/js 在此融为一体，这是组件化的一种可行之道，后面再举例解释）。

仔细想想看这件事情的意义吧。即使 ES6 Module 实现的完美无缺，但等到环境成熟且绝大多数包的作者都把他们的作品用 ES6 Module 重新封装发布之前，我们还有很长时间要面对两个基本的挑战：

1. 要如何使用其他格式封装的模块，CJS/AMD/Global...？
2. 要如何分发和管理其他格式封装的模块？npm/bower/component...？

如你所见，随处都是混乱。

第一个问题，上述两个项目替我们回答了；而第二个问题就是 jspm 要替我们解决的。因此尽管 jspm 的名字只是暗示了它身为包管理器的本质，但由于它自身的实现基于 ES6 Module Loader/SystemJS 之上，所以它可以解决的并非只有包管理这一个问题而已。

嗯，可是我们的题目是“三驾马车”，还有一个是什么呢？由于 ES6 Module 的介入，即使你不需要其他的新特性，可目前的环境（浏览器的支持）还是无法保证立刻用于现实之中。于是我们需要一个“桥梁”帮助我们把新的语法转换成应用环境可以理解并正确执行的语法，也就是 ES6 => ES5(.1)。

jspm 内置支持两种编译工具，一个是 [Google 的 traceur](https://github.com/google/traceur-compiler)；另一个是 [Babel](http://babeljs.io/)。同样的，对此二者我们在此不做过多介绍，目前你只需要知道：

1. traceur 比较老牌，但是编译后代码的可读性较差，支持 ES2015 的语言特性也相对较少（[63%，截止发表时，最新进度请点击查看](http://kangax.github.io/compat-table/es6/#tr)）；
2. Babel 比较新也比较先进，编译后代码可读性较高，支持 ES2015 的语言特性相对较多（[75%，截止发表时，最新进度请点击查看](http://kangax.github.io/compat-table/es6/#babel)）

> **那我应该选哪个？**都可以。


> Babel 现在看起来会更有吸引力（也是我的首选），不过这些项目其实底层都依赖许多其他的 Node 项目，因此时常也会产生问题。比如最新版本（jspm 里默认的最新版本）的 Babel 在 IE 中会报错，但原因和 Babel 本身无关，是其中依赖的一个组件使用了非标准的 `__defineGetter__` 引起的……这只是一个例子，jspm 允许你随时切换所使用的编译器，好事。

好了，故事讲够了，我们来动手玩玩看。

### 上哪儿去找演示代码？

我不知道关于这个演示项目我会写多久，因为我有很严重的拖延症……，如果只是写代码的话其实很快，但我这不是得码一段代码再码一段字嘛……不过但凡我更新了就一定会放到 Github 上（[nightire/jspm-angular-demo](https://github.com/nightire/jspm-angular-demo)），欢迎随时取用，等不及的话自己 fork 了去折腾吧。

## Step 1：项目初始化

一个典型的前端项目（独立 SPA）通常是从 `package.json` 开始的，即使你并不打算作为模块发布，但也要利用好 npm 依赖管理的特性不是？我一直很讨厌这个！没想到 jspm 连这一步都替我省了。

首先，你得全局安装 jspm。BTW，我用的是 [io.js](https://iojs.org/) v1.6.4，node.js 也没有问题的。

```
$ npm install --global jspm

```

然后使用 jspm 初始化项目：

```
$ mkdir jspm-angular-demo && cd jspm-angular-demo
$ jspm init

```

下图是你第一次运行 `jspm init` 后的过程：

![img](https://segmentfault.com/image?src=http://divio.qiniudn.com/Fn7Wl20RiKH_HhniYcVJqcyMZ1fP&objectId=1190000002680386&token=41e92b460921766b5a7e180395d8f37d)

总共八道问答题，大部分都比较简单，一路默认值过去就可以了——有两点先说明一下：

第一，这里所有关于路径的选项，嗯……全是坑点：如果你尚未理解 jspm 的工作机理，这些路径你很可能会想当然的填“错”——你觉得是对的，结果却出乎意料。这里有点小复杂，我先简单予以说明（但我保证你会犯错），之后到了必要的步骤我会进一步解释原因。

1. **Server baseURL**：指的是当你运行一个 HTTP Server 的时候所伺服的根路径。这个路径会影响之后 *jspm packages folder* 和 *config.js* 的默认路径（尽管之后你还可以更改，但是会伴随一些痛苦），因此如无特殊情况请保持和项目的根路径一致——如果你此时脑中已有问号，坚持住，我后面一定会给你合理的解释，因为我当初也是如此过来的。
2. **jspm packages foldes**：类似 *node_modules* 或 *bower_components*，是所有 jspm 包的保存地点。你或许会问：“既然 jspm 一开始也创建了 *package.json* 并且插入了相关属性（第一问和第二问所做的事情），为什么不直接使用 *node_modules*？”简单的答案：因为 *node_modules* （约定俗成地）只能保存 CommonJS 格式封装的包，不够 jspm 用的。
3. **config.js**：类似 *requirejs* 等浏览器端的模块化解决方案中必然会有的配置文件，在这里其实是 *SystemJS*所需要的。它需要和 `system.js` 一起从 HTML 入口处加载，从而为浏览器环境提供 `System` API（异步模块加载）。所以基本上它应该放在你的 `index.html` 能够引用到的地方——如果你又有疑问，一样的坚持住！
4. **Client baseURL**：如果说 **Server baseURL** 是给 node 用的（jspm 运行在 node 环境之下），那么 **Client baseURL** 就是给浏览器用的。它的值写在 `config.js` 里，由 `index.html` 引入浏览器执行。它的作用就是告诉 SystemJS 去哪里寻找模块

剩下的就无须一一解释了。到了这里 jspm 的初始化就完成了，下一步要验证它真的有用！

## Step 2：最基本的例子

jspm 有很多使用的场景，不过我们一步一步来，先看看它到底能不能工作吧。最基本的我们需要一个 HTTP Server 和一个最简单的 `index.html`。

HTTP Server，node 环境之下有一个很好的选择：[BrowserSync](http://www.browsersync.io/)。话说在前，我们选择 BrowserSync 是有理由的（马上会讲），但是它并不是一个适合于部署用的 HTTP Server，我们只是将它用在开发环境当中。关于和部署相关的 jspm 用法到最后我们再聊。

BrowserSync 可以在命令行下直接启动，不过我希望告诉你更具有可操作性和维护性的工程方法，我们把它和基本的开发／构建自动化工作流程整合在一起，因此还需要一个工具 grunt／gulp……这里我们用 gulp：

```
$ npm install --save-dev gulp js-yaml browser-sync

```

这些事情都是前端架构师的基本功，我们就不占用篇幅了，我先把相关代码贴出来然后重点说一下 BrowserSync 的一些选项。

```
// gulpfile.js
var fs          = require('fs');
var yaml        = require('js-yaml');
// var _           = require('lodash');
var gulp        = require('gulp');
// var proxy       = require('proxy-middleware');
// var url         = require('url');
var browserSync = require('browser-sync');

try {
    var options = yaml.safeLoad(fs.readFileSync('./config.yaml', 'utf-8'));
} catch (error) {
    throw new Error(error);
}

var taskDependencies = (function() {
    gulp.task('server', function() {
        // var proxyMiddleware = proxy(
        //     _.assign(url.parse(options.proxyURL), options.proxyOptions)
        // );
        // options.browserSync.server.middleware.push(proxyMiddleware);
        browserSync(options.browserSync);
    });

    return ['server'];
}());

gulp.task('default', taskDependencies, function() {
    // Default Task Denifition
});

```

```
# config.yaml
---
browserSync: &browserSync
  files:
    - "public/**"
    - "source/**"
  watchOptions:
    debounceDelay: 3000
  server:
    baseDir: "public"
    routes:
      "/config.js": "./config.js"
      "/jspm_packages": "./jspm_packages/"
      "/source": "./source/"
    # middleware: []
  startPath: "/"
  host: "127.0.0.1"
  port: 3000
  # open: false
  # notify: false
  # online: false
  # tunnel: false
  # tunnel: "jspm-angular-demo"
  # logLevel: "info"
  # logPrefix: "jspm-angular-demo"
  # logConnections: false
  # logFileChanges: false

# proxyURL: "http://your.endpoint.api/"
# proxyOptions: &proxyOptions
  # route: "/api"
  # via: "nightire@localhost"
  # cookieRewrite: "hostname"
  # reserveHost: false

```

因为有 Github，我们倒是没有必要总是贴大段代码，这次则是一个例外。因为我知道许多前端工程师对工程这块并不是很擅长（有点讽刺），gulp 什么的只懂个基本，那我担心克隆下来以后没弄明白这是干啥的。

上规模的项目不可能没有配置，有些框架强调**约定俗成胜于配置**，但是前端这块儿目前没这个“幸运”。JSON 是非常适合数据负载但却不适合工程配置，这就是我们选择 yaml 的原因，因此在 `gulpfile.js` 里才有了使用 *js-yaml* 解析 yaml 文件的部分，因为最终所有的配置都要变成 js 对象 `options`。

> `taskDependencies` 部分的代码在这里有一些奇怪，其实它是在复杂项目中动态构建任务依赖链所用的，对于目前的需求是有些过度了。不理解的话现在可以忽略，不要紧。

其他被注释的部分先不用理会，因为目前用不到。BrowserSync 的许多选项官网里介绍的都比较清楚，在这里我们只说一个：`server.routes`：

其实这个选项容易理解，*key* 是你在页面上请求资源的路径，*value* 是 BrowserSync 实际映射的文件路径，可问题是：我们为什么要这么做？

还记得前面我让你“坚持住”吧？我卖了一个关子到现在，因为解决的“钥匙”现在才讲到。前因后果如何，让我们了解几个事实：

1. 我们不喜欢把 `index.html` 放在项目根路径之下，通常也不会，比较常见的是放在 `public/` 路径下。
2. 尽管如此，我们却还是倾向于 HTTP Server 把 `index.html` 所在的位置作为伺服的“根”。简单地说：`http://localhost:3000/` 比 `http://localhost:3000/public/` 更令人愉悦（也常常更符合实际上线后的场景）。
3. Again，尽管如此，我们却不喜欢把 `jspm_packages/` 等目录（包括 `node_modules/` 和`bower_components/` 等等）放在与 `index.html` 平级或之下的路径，因为有很多琐碎（但重要）的原因导致这些目录有太多实际上线后完全不需要的东西。传统的构建方法会把所有需要的东西抽出来变成配置里又臭又长又难维护的条目，然后利用合并等技术将它们“转移”到合适的位置。

2 和 3合起来给 jspm 带来了一点点尴尬。从 3 的角度来说，受益于 ES6 模块系统以及即将到来的 HTTP/2，传统构建方法里的合并／压缩等“工艺”已不再那么重要，技术上讲 `jspm_packages/` 等目录放在哪里也不再打紧，但从 2 的角度来说，如果把 `jspm_packages/` 等目录放在 `index.html` 访问不到的地方也不行……

`server.routes` 就是干这个的：

- `jspm_packages/`/`node_modules/`/`bower_components/` 等等该去哪儿去哪儿，不和应用里的静态资源瞎掺和
- 在 `index.html` 里，当你请求 `jspm_packages/xxx`，BrowserSync 帮你去寻找在 `public/` 目录外面的 `jspm_packages/`
- 其他类似

最后一个“痛点”，`config.js` 怎么办？本来它和 `index.html` 在一块儿挺合适的，也应该如此。可你知道么？由于 jspm 需要更改 `config.js`（后面会讲）而且 jspm 不会去“尊重”你对于本地 HTTP Server 的各种特定配置，因此 `config.js` 最好最好最好保持和 `jspm_packages/` 平级的位置，这会为你省去很多困扰。

> 对我这样有点“强迫症”的人来说，`config.js` 和 `jspm_packages/` 不在一层才是最完美的，办法的确是有但却超出了本文的范畴。其实主要的纠结点我已经分析完了，如果你像我一样追求“完美”，不妨自己折腾一下。

讲这么多，晕了吗？烦了吗？如果你理解不能，只需记住一个最简单的原则：**jspm init 时候，路径相关的都用默认值。**之后无论你如何设置开发用的 HTTP Server，BrowserSync 都有办法给你调整，所以尽量不要尝试把`config.js` 和 `jspm_packages/` 挪来挪去，除非你有这个折腾的欲望和动机。

接着就剩下 `public/index.html` 了，代码很简单，重要的就这几句：（其他的自行去 Github 看）

```
<script src="jspm_packages/system.js"></script>
<script src="config.js"></script>

```

这是我们唯一需要的。写好之后我们 `$ gulp` 一下然后打开浏览器看一下开发者工具里的 *Network* 面板。

![img](https://segmentfault.com/image?src=http://divio.qiniudn.com/Fh9wmBpe89gRcy2MILakXVEu0be-&objectId=1190000002680386&token=4597634f9481aa9732403714c94506d9)

通过观察 *Network* 面板，我们知道目前工作良好，没有错误，似乎也没有惊喜。不过我们只引了两个文件，但是`es6-module-loader.js` 也加载到了。这是一个好的信号，接下来我们要开始看看 jspm 的“黑魔法”了，看看什么才是现代化的包管理器。

## Step 3：让 Angular 飞

还记得我们要做的是个 Angular 1.x 的应用吧，那第一步得先引入 Angular 了。呃……有谁知道 Angular 用什么模块规范封装的？啥？你说 `angular.module`？别逗了……我倒是还记得 Angular＋Require.js 那个费劲儿。

托 *SystemJS* 的福，jspm 完全不挑食，管你怎么封装的一概通吃。如果你要安装一个包，你不用事先调研它去哪儿找该怎么用，只需要一句：

```
$ jspm install angular

```

我们先把魔法看完再说里面的把戏。安装好了之后怎么用？

```
// source/bootstrap.js
import 'angular'

let CoreModule = angular.module('core', [])

angular.element(document).ready(
    () => angular.bootstrap(document, [CoreModule.name], { strictDi: true })
)

export default CoreModule

```

```
<!-- public/index.html -->
<script>
    System.import('source/bootstrap').then(function(module) {
        console.log(module)
    })
</script>

```

第一反应是不是觉得有点过分，初始化一个 Angular 应用要写这么多代码，值得吗？

首先，这么多代码并非必须，很传统的方式也是可以的：

```
// source/bootstrap.js
angular.module('core', [])

```

```
<!-- public/index.html -->
<script>
    System.import('source/bootstrap')
</script>
<body data-ng-app="core" data-ng-strict-di>

```

其次——这不是重点好吗？看图：

![img](https://segmentfault.com/image?src=http://divio.qiniudn.com/Fsi74dctXkKUvLLC0QOPl-UYKtxB&objectId=1190000002680386&token=83a6fe1ad2eee934b27760316d9dda79)

不管你的代码是怎么写的，我们不再需要在 HTML 里引入这些模块了。同时 `System.import` 是基于 Promise 的，代码和截图已经说明了这一点。另外，我们直接使用了 ES6 语法而无须任何额外的设置！

所有这些也都要托 *SystemJS* 的福，赞！

因为异步加载模块的缘由，使用 `ng-app` 指令声明 Angular 应用的方式有可能会出问题，貌似随着 jspm 的发展现在已经没什么关系了，不过我依然把手动初始化的方式贴在了最前面。我建议你习惯它，以后就没有 `ng-app`啦（当然也不需要这么繁琐）。另外以后也没有鸡肋一样的 `angular.module` 啦，我们今后会尽可能减少“鸡肋”的代码和结构，面向未来而编程。

### 番外篇：jspm 黑魔法的秘密

说是番外篇因为这部分都是理论分析，不感兴趣的可以跳过到下一部分继续讲实操。

那么问题来了。jspm 如何知道 `jspm install angular` 安装的包从哪里获得？先上图：

![img](https://segmentfault.com/image?src=http://divio.qiniudn.com/FgKcAPmWk8AEqlvIE3DkRtyeO8BQ&objectId=1190000002680386&token=67eb8c5419482a8bde54b9514a35f0ab)

1. 当解析到 `import 'angular'` 时，SystemJS 先去找 `config.js` 里的 `"map"`，如 **1** 所示，找到`"angular": "github:angular/bower-angular@1.3.15"`。从名称上看，这个包应该是来自于注册在 Bower 的 Angular v1.3.15，`github:` 看起来是一个命名空间，需要它的原因是 jspm 可以管理来自于不同注册点的同名模块（比如说图右的 `babel` 来自 npm）。
2. 接着，在 `"path"` 里面找这个命名空间映射的本地路径，如 **2** 所示。
3. 然后顺藤摸瓜，我们看到了如 **3** 所示的路径结构。

`bower-angular@1.3.15.js` 里面有什么？

```
module.exports = require("github:angular/bower-angular@1.3.15/angular");

```

啊哈！原来是封装成了 CJS。这就是 SystemJS 能把原本全局声明（`window.angular`）的 Angular 作为模块对待的处理的全部秘密，说穿了也不怎么神秘。

如果我想要 npm 上注册的 Angular 怎么办？

![img](https://segmentfault.com/image?src=http://divio.qiniudn.com/FiE96ZX5JRS4pwzVqDKOT7Mlglie&objectId=1190000002680386&token=39f97a5676a4e482ce3754310ab714db)

啊哈！命名空间是这么用的啊。但是 `"angular"` 的版本被覆盖了呀（红框部分），能不能两个一起用？

> 注意绿框部分，这里声明了一些依赖关系——既然是包管理器，当然也要能做到这些了。

![img](https://segmentfault.com/image?src=http://divio.qiniudn.com/FsP70bRgGekt-f_hYG-49pdEJham&objectId=1190000002680386&token=0b9f87b563f979b6338718576c662ef3)

之后只需要 `import 'angular-new'` 即可，啊哈了没？

当然还有一个问题：为什么 jspm 默认安装了 bower-angular 而不是 npm-angular？

实际上没有什么“默认”，你可以试着用 jspm 安装一些常用的包，就会发现默认安装 bower-* 或 npm-* 的都有。当你不显式指明命名空间的时候，jspm 会从自己维护的一个注册表里去寻找这个“默认值”，这个注册表的工作原理与 npm 或 bower 都是类似的，因此你也可以注册和发布自己的模块上去——当然了，显式指明命名空间也可以，注册 jspm 是可选的。不过注册 jspm 也是有意义的，特别是当你的模块可以跨包管理器的声明依赖关系的时候。

关于注册和发布 jspm 模块我们以后有机会再聊，现在我们只关注和使用相关的“秘密”。

> **你注意到 "paths" 里定义的路径了吗？**如果我们把 `config.js` 放在 `public/` 下，那么这些路径就变成 `../` 开头的，因为 *Server baseURL* 是项目的根，而 *Client baseURL* 是 `public/`；但由于我们设置了 BrowserSync 将 `public/` 视作 HTTP Server 的根，因此 `../` 是会导致解析错误的。


> 尽管我们可以手动把 `../` 去掉，但是每次 jspm 安装／更新的时候都会重置这个值（jspm 无视因为 HTTP Server 需要而做的手动更改，因为这是无法预见的）。这就是为什么我之前建议把 `config.js` 和`jspm_packages/` 放在一起的缘故。

## Step 4：没有测试可怎么活？

对于我来说，常规的流程到了这里就该轮到测试了。如果你不喜欢写测试也可以跳过这一步，之后我们将会去看看一些常规组件在 ES6 中的写法以及如何引入第三方的资源；如果测试也是你的菜，那我们就继续吧！

Angular 有一个用于单元测试的模块，还有基于 *Protractor* 的集成测试（端到端测试）。我个人不喜欢前端的集成测试——不是说它不好，就是自己习惯不来，所以整合 *Protractor* 的事儿我没有做，这里只谈单元测试。（个人观点：单元测试写好了就差不多了，集成测试有太多变数，有时候维护集成测试远比编写它困难无数倍）

以下工具是我们将要用到的：

```
$ npm install --save-dev karma karma-jspm karma-mocha karma-mocha-reporter karma-sinon-chai karma-chai-as-promised karma-chrome-launcher

```

那一长串的 `karma-*` 只有几个是本文的内容真正用到的，不过剩下的也都很有用，你以后写下去迟早会用到。

如何配置 karma 不是本文关注的内容，网上的教程一大把随便挑，我只列举出与 jspm 整合相关的变动。

下图是运行 `karma init` 以后所填的选项：

![img](https://segmentfault.com/image?src=http://divio.qiniudn.com/FtBJ0IbDiIUfBd6gWTmEwAbd-9oc&objectId=1190000002680386&token=299891c07e37b3748a59c652e192623f)

比较不同的地方就是没有写源码和测试文件的路径，这是因为我们需要 jspm 来辅佐 karma 读取这些文件，这样才能正确处理依赖和新的 ES6 语法。因此，我们要对生成的 `karma.conf.js` 做一些改动：

```
// karma.conf.js
frameworks: [
    'chai-as-promised',
    'sinon-chai',
    'mocha',
    'jspm'
],
// files: []
jspm: {
    loadFiles: [
        'test/**/*.js'
    ],
    serveFiles: [
        'source/**/*.js'
    ]
},
reports: [
    'mocha'
],
browsers: ['Chrome']

```

我只列出了有改动的部分，剩下的可以保持原样，需要留意的有这样几处：

1. 要注意 `frameworks` 的加载顺序，karma 是倒着来的，所以依赖关系要反着写：最后加载的写在数组最前面；
2. 原来指定加载路径的 `files` 不用了，可以注释掉；取而代之的是要手动加一个新的 `jspm` 对象，其中`loadFiles` 是 karma 要加载的文件，基本等价于之前的 `files`，但由于加载源代码和第三方模块的机制变了，所以这里只需要填写测试代码的位置；而 `serverFiles` 则是 jspm 需要的，同常指明源码文件的位置即可。

> 实际上测试的部分我是最后才实验完成的，因为此前 karma-jspm 我没用过，走了一些个弯路。目前我也没浏览过此模块的源码，所以分析可能有误，敬请指正。

就是这些，测试环境的搭建还是很简单的。为了确保工作正常，我们试试写一个模块和单元测试。

第一步，把之前的 `bootstrap.js` 分拆一下，把属于模块定义的部分单独写成一个模块：

```
// source/bootstrap.js
import 'angular-new'
import CoreModule from 'source/core/core-module'

angular.element(document).ready(
    () => angular.bootstrap(document, [CoreModule.name], { strictDi: true })
)

```

```
// source/core/core-module.js
export default angular.module('core', [])

```

第二步，现在可以针对这俩文件写单元测试了：

```
// test/helper.js
import 'angular-mocks'

```

```
// test/bootstrap.test.js
import 'test/helper'
import 'source/bootstrap'

describe('［应用］：Angular Application 手动初始化', () => {
    it('可以通过应用根节点元素访问 $rootScope，$id 应为 1', () => {
        this.rootElement = angular.element(document.querySelector('body'))
        expect(rootElement.scope()).to.have.property('$id', 1)
    })
})

```

```
// test/core/core-module.test.js
import 'test/helper'
import CoreModule from 'source/core/core-module'

describe('［模块］：CoreModule', () => {
    it('具有正确的模块名称', () => {
        expect(CoreModule.name).to.equal('core')
    })
})

```

运行 `karma start`，以下是一切 OK 的样子，测试也可以用 ES6 哦，棒！

![img](https://segmentfault.com/image?src=http://divio.qiniudn.com/FvBzy6a-vZ5fT14Pty7VggK3YX9U&objectId=1190000002680386&token=e3ec174f3991912df6c09cd9fccacfbc)

> ~~剧透：此时你克隆下来的代码应该会发现我已经从 babel 切换到了 traceur，这是为了使第一个测试运行成功。截止本文写到这里为止，最新的 jspm 已经支持配置 babel 的 runtime，因此理论上应该可以和 traceur 一样了……遗憾的是我没试出来——也许这是 karma-jspm 还没跟上的缘故，我现在还不清楚。~~


> 关于 PhantomJS：你或许与我一样也喜欢完全 Headless 的单元测试运行环境，然而目前为止 karma-jspm 与 PhantomJS 的整合还没有完全做好，另一个项目正在努力工作中，不会太远了。

## Step...n

木有了，不需要一步一步的指导了，使用 jspm 创建一个前端工程就是这么简单。接下来我们跳出 step by step 的模式，来聊聊一些更常规化的话题。

### 第三方组件，举例：*ui-router*

> without ui-router, angular 1.x should've been dead already...

这句“名言”是……呃，我说的。不过话糙理不糙，这的确是句大实话（详见[在下于 Ruby-China 的详细分析](https://ruby-china.org/topics/24646?page=1#reply29)）。我用 *ui-router* 为例讲讲外部组件的引入，一方面是为了谈 jspm 的用法和便利，另外一方面则是要稍微讲一下 Angular 项目的架构。

#### 安装 *ui-router*

```
$ jspm install angular-ui-router

```

#### 引用 *ui-router*

```
// source/core/core-module.js
import 'angular-new'
import 'angular-ui-router'

export default angular.module('core', [
    'ui.router'
])

```

> 你甚至可以不用 `import 'angular'`，因为对于 *ui-router* 来说，*angular* 就是它的依赖，jspm 会自动帮你加载 *angular* 的。至于我这个 demo，由于 `angular-new` 映射的是 *angular v1.4.0-rc.0*，所以我需要显式 *import*；如果我去掉这一句，jspm 会自动加载 *angular v1.3.15*，因为 `'angular'` 对应的版本是这个。

#### 如何写 Angular 应用的状态（也就是 *ui-router* 里的 *state*）？

对于 SPA 应用来说，路由就是核心、骨架、生命线，没有路由机制的应用谈不上 SPA 应用；路由机制实现的很糟糕的 SPA 框架也谈不上好框架。从这个角度来说，我说 Angular 很烂并非无理取闹。还好有 *ui-router*，挽救 Angular 的颜面于水火之中。

当我们谈及路由，在 SPA 应用中其实就是指应用程序的状态，所以 *ui-router* 本质上就是一个状态机。于是问题来了，我们应该如何定义、管理、组织应用程序的状态？

回答这个问题需要一个前提，那就是理解何为模块化，为何模块化？我不觉得我有这个资格或者说资历来为**模块化**下一个定义，但是我可以列举一个对比的场景：

```
angular.module('app', [
    'ui.router'
])
    .config(function($stateProvider) {
        $stateProvier
            .state('stateA', {
                url: '/stateA',
                controller: 'stateAController as state',
                resolve: {
                    model: function(stateAService) {
                        return stateAService.getModel()
                    }
                }
            })
            .state('stateB', {
                url: '/stateB',
                controller: 'stateBController as state',
                resolve: {
                    model: function(stateBService) {
                        return stateBService.getModel()
                    }
                }
            })
    })
    .service('stateAService', function($http) { ... })
    .controller('stateAController' function(model) { ... })
    .service('stateBService', function($http) { ... })
    .controller('stateBController' function(model) { ... })

```

对比：

```
angular.module('app', [
    'app.stateA',
    'app.stateB'
])



angular.module('app.stateA', [
    'ui.router'
])
    .config(function($stateProvider) {
        $stateProvier
            .state('stateA', {
                url: '/stateA',
                controller: 'stateAController as state',
                resolve: {
                    model: function(stateAService) {
                        return stateAService.getModel()
                    }
                }
            })
    })
    .service('stateAService', function($http) { ... })
    .controller('stateAController' function(model) { ... })



angular.module('app.stateB', [
    'ui.router'
])
    .config(function($stateProvider) {
        $stateProvider
            .state('stateB', {
                url: '/stateB',
                controller: 'stateBController as state',
                resolve: {
                    model: function(stateBService) {
                        return stateBService.getModel()
                    }
                }
            })
    })
    .service('stateBService', function($http) { ... })
    .controller('stateBController' function(model) { ... })

```

你来说说，哪一种更“模块化”一些？很显然，答案是后者。但由于 `angular.module` 这个貌似 *modulize* 实则只是 *namespace* 的鸡肋机制，导致在传统的前端项目中使用后者组织项目架构会有很多不好回避的痛苦（比如需要手动指明加载／合并顺序等），所以现存的 Angular 项目还是以第一种为主。

但即使是后者，也并不完全合情合理。有人就跟我提过：“我不喜欢 states 分散在各模块当中，你很难一眼尽观整个项目的状态分布”。嗯，我觉得非常有道理呢！这一点 Rails 或是 Ember 在前后两端都作出了很好的示范。

那么我们可以怎么做？我认为以下几点是值得考虑的。

- 目录结构上，以 `states` 和 `components` 做一个大分类，然后 `states` 以下以状态为区分划分子目录（对应一个模块）；`components` 以下自然是以组件为区分划分子目录（对应一个模块）了。见下图：

![img](https://segmentfault.com/image?src=http://divio.qiniudn.com/Frt0E8owdKxEzX3jyn_vizXfaxOt&objectId=1190000002680386&token=a7f48844f11011cacbfccc155731337b)

这个我就不想细细说明了，会吐……但凡对组织结构有过研究的大概都能看明白这些目录文件是什么，若有不解或相异之处我们可以单独探讨。

我要说的是这么分割下来伴随 jspm 要怎么写。我们从 `home` 开始：

首先，核心模块里引入 `HomeModule`：

```
// source/core/core-module.js
import 'angular-new'
import 'angular-ui-router'

import HomeModule from 'source/states/home/home-module'

import CoreRouter from 'source/core/core-router'

export default angular.module('core', [
    'ui.router',

    HomeModule.name
])
    .config(CoreRouter)

```

**这里还是一个关键点**：我会定义一个全局性的*路由配置*文件，它不会定义具体的路由对象，只是一个映射性质的文件，就是为了“一眼尽观整个项目的状态分布”。它实际上是一个 `angular.config` 使用的工厂函数。以下是这个文件大概的样子：

```
// source/core/core-router.js
import HomeRoute from 'source/states/home/home-route'

function CoreRouter($stateProvider) {
    $stateProvider
        // Home
        .state('home', HomeRoute)

        // Session
        // .state('session',        SessionRoute)
        // .state('session.signin', SessionSigninRoute)
        // .state('session.signup', SessionSignupRoute)
}

CoreRouter.$inject = ['$stateProvider']

export default CoreRouter

```

此时此刻我们还没有任何可用的 *route*，所以大部分的代码都被注释着。

紧接着，定义 `HomeModule` 和 `HomeRoute`：

```
// source/states/home/home-module.js
export default angular.module('home', [])

```

```
// source/states/home/home-route.js
import HomeTemplate from './home-template.html!text'    // ⚠
import HomeController from './home-controller'

var HomeRoute = {
    url:          '/home',
    template:     HomeTemplate,
    controller:   HomeController,
    controllerAs: 'home'
}

export default HomeRoute

```

唔，注意到那个 *⚠* 符号了吧？我们在 `HomeRoute` 的定义中需要引入 HTML 模板。传统的做法要么写成字符串，要么使用 `$templateCache` 预编译；其实都可以，不过 jspm 和其他一些包管理器一样也提供了非 JS 模块的加载机制，这就是 *⚠* 所要演示的。要做到这一点，我们需要安装一个 *text* 插件（实际上是 *SystemJS* 的插件）

```
$ jspm install text

```

OK了！以后任何文本格式的文件都可以在后面加上 `!text` 导入到 Javascript 程序中，导入后是什么？字符串。

这一块代码整体的基本思路就是：状态对象（state object）的定义跟随对应的模块走，而状态名字与状态对象的映射则做成全局的放在核心模块里。这样一来就等于把路由器（router）和路由（route）分开了。

当然，为了让这个例子能够有效，你得给 `index.html` 提供一个 `ui-view`：

```
<!-- public/index.html -->
<body data-ui-view>
    <a data-ui-sref="home"></a>
</body>

```

测试一下你会发现当你点击链接的时候 Angular 才会报找不到 `HomeController` 的错误，这也是从侧面作证异步模块加载生效的证据。

好，编写一个简单的控制器完成这个例子，顺便休息一下……

```
// source/home/home-controller.js
class HomeController {
    constructor($filter) {
        this.$filter  = $filter
        this.now      = new Date()
        this.greeting = `你好，今天是：${this.time()}！`
    }

    time() {
        return this.$filter('date')(this.now)
    }
}

HomeController.$inject = ['$filter']

export default HomeController

```

```
<!-- source/states/home/home-template.html -->
<a data-ui-sref="^">返回</a>
<p data-ng-bind="::home.greeting"></p>
```

