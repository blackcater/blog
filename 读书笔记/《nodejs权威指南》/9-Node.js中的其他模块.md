#Node.js中的其他模块

[TOC]

##本章内容

- 如何使用Node.js中的dns模块来实现域名查找及域名解析处理。
- 如何使用Node.js中的punycode模块实现地方语言所采用的各种编码及punycode编码之间的互相转化处理。
- 如何使用Node.js中的os模块来获取运行Node.js应用程序的操作系统的各种信息。
- 如何使用Node.js中的readline模块实现逐行读取流数据的处理。
- 如何使用Node.js中提供了许多实用方法的util模块。
- 如何使用Node.js中的vm模块实现在独立环境中运行脚本代码的处理。
- 如何使用repl模块中的start方法的options参数值对象中的各种属性定制REPL运行环境。




##使用dns模块解析域名

在网络编程中，开发者更倾向于使用域名，而不是IP地址来指定网络链接的目标地址。在Node.js中，提供dns模块，以实现域名查找及域名解析的处理。



在dns模块中，提供了三个主方法及一系列便捷方法。其中三个主方法分别为用于将一个域名解析为一组DNS记录的resolve方法，用于将一个IP地址转化为一组域名的reverse方法以及用于将一个域名转化为一个IP地址的lookup方法，dns模块中的其余便捷方法均为resolve方法的一种便捷形式。



###使用resolve方法将域名解析为DNS记录

```javascript
// resolve方法用于将一个域名解析为一组DNS记录。
// dns.resolve(hostname[, rrtype], callback)
/*
	hostname: 为一个字符串，用于指定需要被解析的域名。
    rrtype: 为一个字符串，用于指定需要获取的记录
    	"A": 该参数为默认参数。当记录类型为“A”时，该记录将一个域名映射为一个IPv4地址。
        "AAAA": 该记录将一个域名映射为一个IPv6地址。
        "CNAME": 表示该记录为一个域名的别名记录。例如，一个www.example.com域名记录也许为一个example.com域名记录的别名记录
        "MX": MX记录指向一个使用SMTP的域中的邮件服务器。例如：当你向person@domain.com邮件地址发送电子邮件时，domain.com域的MX记录中保存了发送该邮件时的邮件服务器地址。
        "TXT": TXT记录是为该域名附加的描述记录
        "SRV": SRV记录用于为一个特定域中所有可用服务提供信息
        "PTR": PTR记录用于反向地址解析，该记录将一个IPv4地址转化为域名
        "NS": NS记录是域名服务器记录，用来指定该域名由哪个DNS服务器进行解析
    callback: 参数值用于指定当域名解析操作完成时调用的回调函数
    	function(err, address){
  			// ...
		} 
        // err: 域名解析失败时触发错误对象。
        // address: 参数值为一个数组，其中存放了所有获取到的DNS记录。
*/

// 在dns模块中，为resolve方法定制了更加便捷的方法
// dns.resolve4(domain, callback)
// dns.resolve6(domain, callback)
// dns.resolveMx(domain, callback)
// dns.resolveTxt(domain, callback)
// dns.resolveSrv(domain, callback)
// dns.resolveNs(domain, callback)
// dns.resolveCname(domain, callback)
```



###使用lookup方法查询IP地址

当使用resolve4或resolve6方法时，由于callback参数值回调函数中的address参数组中存放所有获取到的IPv4地址或IPv6地址，因此，dns模块中也提供了另一个用于获取第一个被发现的IPv4地址或IPv6地址的lookup方法

```javascript
// dns.lookup(hostname[, options], callback)
/*
	hostname: 一个字符串，用于指定需要解析的域名
    options: 一个对象，有一下属性及属性值
    	family：一个数字，4或6表示IPv4或IPv6
        hints: 
        all: 当为true，将会返回所有被解析得到的地址，返回一个数组。默认为false。
    callback: 指定当获取地址操作完成时调用的回调函数
    	function(err, address, family){
  			//...
		}
        // err: 当域名不存在或查询失败时该对象的code属性值为ENOENT
        // address: 一个字符串或一个数组
        // family: 整数
*/
```



###使用reverse方法反向解析IP地址

```javascript
// 在dns模块中，可以使用reverse方法将一个IP地址反向解析为一组与该IP地址绑定的域名
// dns.reverse(ip, callback)
/*
	ip: 需要查询的IP地址
    callback: 用于指定当反向解析地址操作完成时调用的回调函数。
    	function(err, domains){
  			//...
		}
*/
```



###dns模块中的各种错误代码

![dns_error1](C:\Users\BlackCater\Desktop\note\nodejs\dns_error1.PNG)![dns_error2](C:\Users\BlackCater\Desktop\note\nodejs\dns_error2.PNG)





##使用punycode模块转化punycode编码

用于将域名从地方语言所采用的各种编码转化为可用于DNS服务器的punycode编码。目前，因为操作系统的核心都是英文组成，DNS服务器的解析也是由英文代码交换，所以DNS服务器上并不支持直接的使用地方语言的域名解析，所有地方语言的解析都需要转化成punycode编码，然后由DNS服务器解析punycode编码。

```javascript
// 将一个Unicode编码字符串转化为一个punycode编码字符串
// punycode.encode(string) 返回被转换后的punycode

// 将一个punycode编码字符串转化为一个Unicode编码字符串
// punycode.decode(string) 返回被转换后的Unicode字符串

// 将一个Unicode编码格式的域名转化为一个punycode编码格式的域名。
// punycode.toASCII(domain) 该方法只转换地方语言域名，不转换英文域名

// 将一个punycode编码格式的域名转换为一个Unicode编码格式的域名。
// punycode.toUnicode(domain) 该方法只转换地方语言域名，不转换英文域名。

// 将一个UCS-2编码数组转化为一个字符串
// punycode.ucs2.encode(codePoints)

// 参数值为需要被转换的字符串，方法返回被转化后的UCS-2编码数组
// punycode.ucs2.decode(string)

// 获取punycode.js类库的版本号
// punycode.version
```





##使用os模块获取操作系统信息

```javascript
os.EOL : 常量值，为操作系统中使用的换行符。
os.arch() : 用于获取CPU架构
os.cpus() : 方法返回一个数组，其中存放了所有CPU内核的各种信息，包括CPU规格，运行速度（单位MHz）及运行时间信息。
os.endianness() : 用于获取CPU的字节序（endianness），可能返回值为"BE","LE"。
os.freemem() : 返回系统的空闲内存量，单位为字节。
os.homedir() : 返回当前用户的家目录
os.hostname() : 返回当前操作系统的计算机名
os.loadavg() : 返回一个数组，其中存放了1分钟，5分钟及15分钟的系统平均负载
os.networkInterfaces() : 方法返回一个数组，其中存放了系统中的所有网络接口
os.platform() : 用于获取操作系统平台。例如: "win32"
os.release() : 用于获取操作系统版本号
os.tmpdir() : 用于获取操作系统中默认的用于存放临时文件的目录
os.totalmem() : 该方法返回系统的中内存量，单位为字节。
os.type() : 用于获取操作系统类型。例如："Windows_NT"
os.uptime() : 用于获取系统当前运行时间，单位为秒。
```





##使用readline模块逐行读取流数据

###创建Interface对象

```javascript
// 在readline模块中，通过Interface对象的使用来实现逐行读取数据的处理。因此，首先要创建Interface对象。
// readline.createInterface(options)
/*
	options: 一个对象，可使用的属性及属性值如下
    	input: 为一个可用来读取流数据的对象，用于指定读入数据的来源。
        output: 为一个可用来写入流数据的对象，用于指定数据的输出对象。
        completer: 属性值为一个函数，用于指定Tab补全处理。函数的参数被自动设定为从该行中读入的Tab字符之间的数据，该函数应该返回一个由所有用于Tab补全时的匹配字符串组成的数据以及从该行中读入的Tab字符之前的数据。一个典型的例子如下：
        	function completer(line){
                var completions = ".help .error .exit .quit .q".split(" ");
                var hits = completions.filter(function(c){
                    return c.indexOf(line) == 0;
                });
                return [hits.length?hits : completions, line];
            }
        terminal: 该属性值为一个布尔值类型，当需要像一个终端那样实时地将数据流进行输出，且需要在输出数据中写入ANSI/VT100控制字符时，需要将该属性设置为true。默认属性值等于output属性对象的isTTY属性值。
        historySize: 最大历史记录的行数，默认是30
*/

// 当创建并使用Interface对象从终端设备读取行数据时，必须使用对象的close方法结束数据的读取操作。
// rl.close()

// 当Interface对象读取到一个“\n”字符时，表示该行数据读取结束，触发该对象的line事件。
/*
	rl.on("line", function(line){
  		//...
	})
    // line: 被读取的该行数据
*/
```

```javascript
// 例子: 使用Interface对象读取用户输入行数据
var readline = require("readline");
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
rl.on("line", function(line){
    if(line == "exit" || line == "quit" || line == "q"){
        rl.close();
        console.log("程序退出!");
        process.exit(0);
    }else{
        console.log("您输入了: "+line);
    }
});
```

```javascript
// 在下面几种情况发生时，将触发Interface对象的close事件，代表Interface对象结束读数据操作
/*
	1. 调用Interface对象的close方法
    2. Interface对象的input属性值对象的end事件被触发
    3. Interface对象接收到一个EOT信号（如果用户在命令行按下Ctrl+D组合件，那么Interface对象接收到一个EOT信号）
    4. Interface对象接收到一个SIGINT信号（如果用户在命令行按下Ctrl+C组合件，那么Interface对象接收到一个SIGINT信号）

    rl.on("close", function(){
  		console.log("行数据读取操作被终止。");
	})
*/
```

```javascript
// 使用completer属性实现Tab代码补全功能
var readline = require("readline");

function completer(line){
    var completions = "help error quit aaa bbb ccc eee".split(" ");
    var hits = completions.filter(function(c){
        return c.indexOf(line) == 0;
    });
    return [hits.length ? hits : completions, line]
}

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    completer: completer
});

rl.on("line", function(line){
    if(line == "exit" || line == "quit" || line == "q"){
        rl.close();
        console.log("程序退出!");
        process.exit(0);
    }else{
        console.log("您输入了: "+line);
    }
});
```

```javascript
// 使用Interface对象逐行读取一个文件中的数据并将其写入另一个文件中
var readline = require("readline");
var fs = require("fs");
var file = fs.createReadStream("./message.txt");
var out = fs.createWriteStream("./anotherMessage.txt");
var index = 1;

out.write("line"+index.toString()+":");
index++;
var rl = readline.createInterface({
    input: file,
    output: out,
    terminal: true
});
rl.on("line", function(line){
    out.write("line"+index.toString()+":");
    index++;
});
```



###Interface对象所拥有的各种方法与事件

```javascript
// pause事件： 可以使用Interface对象的pause方法暂停使用创建该对象所使用的属性选项中input属性值对象读取流数据。
// rl.pause()
// 当Interface对象的pause方法被调用或者input属性值对象接受到一个SIGCONT信号（非windows操作系统）或一个SIGINT信号（windows操作系统）时触发Interface对象的pause事件。

// resume事件： 当使用Interface对象的pause方法暂停使用创建该对象所使用的属性选项中input属性值对象读取流数据后，可以调用Interface对象的resume方法恢复读取流数据。
// rl.resume()

// write方法： 可以使用Interface对象的write方法向创建该对象所使用的属性选项中output属性值目标对象中写入一些数据。
// rl.write(data[, key])
/*
	data: 要写的数据，字符串或Buffer对象
    key: 一个对象，用于在终端环境中模拟一个按键操作，例如模拟Ctrl+u组合：rl.write(data, {ctrl: true, name: "u"})。就像控制台一样，当到要写入该数据时，会出现控制台，如果输入key将取消数据的写入。

    如果创建Interface对象所使用的createInterface方法中所使用的options参数对象的input属性值对象的读取流数据已被暂停或终止，那么write方法将通知input属性值对象继续读取流数据，读入的起始数据为write方法所写入的数据。
*/

// setPrompt方法与prompt方法
// 可以使用Interface对象的setPrompt方法在终端环境下制定一个命令提示符，所谓命令提示符，就是中断环境中每一行开头用于提示用户输入字符的符号。
// rl.setPrompt(prompt[, length])
/*
	prompt: 需要显示的命令提示符
    length: 用户输入字符的起始位置，单位为字符。（即：用户可以从左数第几个字符开始输入字符）
*/

// rl.prompt()
// 用于显示命令提示符，没有设置过命令提示符，则显示默认的命令提示符">"
```

```javascript
// 简易的命令行工具
const readline = require('readline');
const rl = readline.createInterface(process.stdin, process.stdout);

rl.setPrompt('OHAI> ');
rl.prompt();

rl.on('line', (line) => {
  switch(line.trim()) {
    case 'hello':
      console.log('world!');
      break;
    default:
      console.log('Say what? I might have heard `' + line.trim() + '`');
      break;
  }
  rl.prompt();
}).on('close', () => {
  console.log('Have a great day!');
  process.exit(0);
});
```

```javascript
// question方法
// Interface对象的question方法用于在终端环境中显示一个问题，使用方法如下所示
// rl.question(query, callback)
/*
	query: 为一个字符串，用于指定需要体温的问题
    callback: 为一个回调函数
    	function(answer){
  			//....
		}
        // answer: 为用户输入的答案
*/

// 信号事件
/*
	当input属性值对象接收到一个SIGINT信号（例如，当用户在终端环境中按下Ctrl+C组合键时，用于读取标准输入数据流的对象将接收到一个SIGINT信号）时，触发Interface对象的SIGINT事件。如果不指定回调函数，那么input属性对象将暂停流数据的读取操作。
    当input属性值对象接收到一个SIGTSTP信号（例如，当月用户在终端中按下Ctrl+Z组合键时，用于读取标准输入流的对象将接收到一个SIGTSTP信号）时，触发Interface对象的SIGTSTP事件。如果不指定SIGTSTP事件回调函数，那么用于运行Node.js应用程序的进程将被挂起。在windows操作系统中，不支持SIGTSTP信号的使用。
    当input属性值对象对于数据流的读取操作未被暂停或终止，而input对象接收到一个SIGTSTP信号，用于运行Node.js应用程序将被挂起后，当使用Interface对象的resume等方法恢复数据流的读取操作时，input属性值对象将接收到一个系统自动发出的SIGCONT信号。如果在input属性值对象接收到一个SIGTSTP信号之前已暂停或终止对于数据流的读取操作，则当使用Interface对象的resume等方法恢复数据流的读取操作时，input属性值对象将不会接收到SIGCONT信号。在Windows操作系统中，不发送SIGCONT信号。
*/
```





##使用util模块中提供的一些实用方法

```javascript
// util.format(format[, ...])
/* 
	类似于C语言的printf方法，该方法第一个参数为需要格式化的字符串，其中有一些占位符，这些占位符有一下几种:
    	%d: 数字
        %s: 字符串
        %j: JSON
        %%: %本身
        
    如果格式化字符串中使用的参数个数少用format方法中使用的除了format参数之外的其他参数个数，则根据format方法中多余参数值的类型自动将其转化为字符串，中间使用一个空格进行分割。
*/

// util.log(string)
// log方法用于将一个字符串作为标准输出流进行输出，该字符串前输出系统当前时间。

// util.inspect(object[, options])
// 返回一个字符串，该字符串中包含了一个对象的信息。在调试应用程序的过程中该方法变得非常有用。
/*
	object: 必须指定参数，指定需要被查看信息的对象
    	showHidden: 布尔值，true，该对象中包含该对象的不可枚举的属性及属性值。
    	depth: 整数，当被查看的对象信息具有阶层关系时，该属性值指定被查看的对象信息的深度，默认为2。
        colors: 该属性为布尔值，当属性值为true时，在输出该信息时属性值应用各种颜色。默认为false。
        customInspect: 该属性为一个布尔值类型的属性，当属性值为true时，在查看对象信息时将调用对象被查看信息的对象自定义的Inspect方法。默认为true。
*/
```

![util-inspect-style](C:\Users\BlackCater\Desktop\note\nodejs\util_inspect1.PNG)

![util-inspect-colors](C:\Users\BlackCater\Desktop\note\nodejs\util_inspect2.PNG)



```javascript
// util.inherits(constructor, superConstructor)
// inherits方法用于将一个父类的方法继承给该父类的子类。
/*
	constructor: 子类的构造函数
    superConstructor: 父类的构造函数
*/
```







##使用vm模块改变脚本运行环境

在Node.js中，提供vm模块，该模块允许改变一些JavaScript脚本代码的上下文运行环境。请注意，这些代码仍然运行在Node.js应用程序的当前进程中，从这个角度来说，该模块的功能有些类似于JavaScript脚本代码中的eval函数功能，但是该模块提供了一些eval函数所不能实现的特性，也提供了更好的代码管理功能。

###在独立环境中运行JavaScript代码

```javascript
// 在vm模块中，提供了两个用于运行JavaScript脚本代码的方法。其中runInThisContext方法的作用类似于eval函数。该方法预编译代码，在一个独立的上下文环境中运行这些代码并返回运行结果。与eval函数不同的是，在该上下文环境中，不能访问任何模块中定义地变量，属性值，对象或方法。
// vm.runInThisContext(code[, options])
/*
	code: 一个字符串，用于指定需要运行的代码
    options: 一个对象，可选属性及属性值如下：
    	filename: 一个文件名，该文件名可以为一个事实上并不存在的文件名，在内存中将临时创建该文件并使用它来记录代码运行时的堆栈信息。
        lineOffset: 行偏移值
        columnOffset: 列偏移值
        displayErrors: 布尔值，是否输出错误到stderr。默认为true。
        timeout: a number of milliseconds to execute code before terminating execution. If execution is terminated, an Error will be thrown.
    
    事实上runInThisContext方法维护的是一个独立的上下文运行环境，因此，如果一个runInThisContext方法中定义一个变量，对象或方法，那么可以在之后的runInThisContext方法中访问这些变量，对象或方法。
*/

// 可以预先定义javascript脚本代码的独立运行环境，然后使用runInNewContext方法在独立的上下文环境中运行javascript脚本代码，并且将上下文环境指定为预先定义的独立运行环境。与runInThisContext方法相同的是，runInNewContext方法预编译代码，在被指定的上下文环境中运行这些代码并返回运行结果。在被指定的上下文环境中不能访问任何模块中定义的本地变量，属性值，对象或方法。与runInThisContext方法不同的是，在被指定的上下文环境中，不能访问Node.js中定义的全局变量，属性值及方法。
// vm.runInNewContext(code[, sandbox][, options])
/*
	code: 一个字符串，用于指定需要编译的代码
    sandbox: 一个对象，用于指定独立的上下文环境
    options: 和runInThisContext的options属性值用法一样
    // 例子:
        const util = require('util');
        const vm = require('vm');

        const sandbox = {
          animal: 'cat',
          count: 2
        };

        vm.runInNewContext('count += 1; name = "kitty"', sandbox);
        console.log(util.inspect(sandbox));

        // { animal: 'cat', count: 3, name: 'kitty' }
*/

// 如果使用runInNewContext方法，那么，当独立的上下文环境中的变量值或对象属性值被修改后，不能返回到初始状态。为了维护一个独立的上下文环境中的初始状态，在Node.js中提供createContext方法与一个runInContext方法，其中createContext方法用于根据一个被初始化的上下文对象创建另一个上下文对象，当另一个上下文对象被创建后就可以使用runInContext方法子啊该上下文环境中运行javascript代码，而初始的上下文对象中保存的变量值或对象属性值将不被修改。
// vm.createContext([sandbox]) 参数为一个保存了初始变量值或对象属性值的上下文环境，方法返回另一个上下文环境。
// 可以使用runInContext方法在createContext方法返回的上下文环境中运行javascript脚本代码并返回运行结果。
```



###创建并使用Script对象

```javascript
// 在vm模块中，可以使用createScript方法编译一段代码但是不运行该代码，而是将其保存在Script对象中，之后可以通过Script对象的各种方法来运行这些代码。
// new vm.Script(code, options)
/*
	code: 要执行的代码
    options: 与上面讲的options一样
*/

// script.runInContext(contextifiedSandbox[, options])
// script.runInNewContext([sandbox][, options])
// script.runInThisContext([options])
```





##自定义REPL运行环境

```javascript
// 使用start方法来运行并返回一个REPL运行环境实例对象。
// repl.start(options)
/*
	prompt: 用于修改REPL运行环境中的命令提示符，默认选项值为>”。
    input: 用于指定需要用来读入流数据的对象。默认选项为process.stdin
    output: 用于指定需要用来写入流数据的对象。默认选项为process.stdout
    terminal: 该属性为布尔值，当需要像一个终端那样实时地将输入数据流进行输出，且需要在输出数据中写入ANSI/VT100控制字符时，需要将该属性值设定为true。默认属性值等于output属性值对象的isTTY属性值。
    eval: 属性值为一个函数，用于指定对输入表达式的执行方法。默认属性值如下面的图。
    useColors: 该属性值为布尔值，用于指定在使用默认的writer属性值即util.inspect方法输出表达式的执行结果时是否需要使用颜色。如果默认的writer属性值被修改，则useColors属性值失效。
    useGlobal: 该属性值为布尔值，当属性值为false时开启一个独立的上下文运行环境并在该运行环境中运行所有代码，这些代码不可访问当运行环境开启之后开发者在全局作用域中定义的变量值或对象。当属性值为true，在当前上下文运行环境中运行的所有代码，这些代码可访问当运行环境开启之后开发者在全局作用域中定义的变量值或对象。默认为false。
    ignoreUndefined: 
    writer: 属性值为一个函数，用于指定在输出表达式运行结束时用于格式化运行结果以及对运行结果使用各种颜色的函数，默认属性值为util.inspect(obj)，其中obj参数值为表达式运行结果。
    replMode: 控制是否repl运行说所有的命令通过严格模式。
        repl.REPL_MODE_SLOPPY - run commands in sloppy mode.
        repl.REPL_MODE_STRICT - run commands in strict mode. This is equivalent to prefacing every repl statement with 'use strict'.
        repl.REPL_MODE_MAGIC - attempt to run commands in default mode. If they fail to parse, re-try in strict mode.
*/
```

![repl-eval属性值默认值](C:\Users\BlackCater\Desktop\note\nodejs\repl_eval.PNG)