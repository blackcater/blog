#Node.js核心模块之文件系统

[TOC]

##教学大纲



1. 如何读写整个文件内容，如何读取文件部分内容，以及如何在文件中的指定文字写入内容
2. 如何创建与读取目录
3. 如何查看和修改文件或目录的一些信息
4. 如何对文件执行其他各种类型的操作
5. Node.js中流的基本概念，Node.js中包括哪些用于读/写流数据的对象，这些对象各自有什么事件或方法，以及如何使用ReadStream对象与WriteStream对象来快速读/写文章
6. 如何利用该模块中的各种方法来进行各种绝对路径，相对路径字符串之间的转换处理及其他各种可以对路径字符串进行的处理。


**同步与异步方法**

在这个文件系统章节，以及后续的章节基本每个函数都有一个同步方法和异步方法。更具何时的情景使用何时的方法是最佳的实践。



##对文件进行读写操作

###文件完整读写

``` javascript
fs.readFile(filename[, options], callback); // 文件读取异步方法。options为一个对象，属性列表如下
/*
flag: r:读取文件/r+:读取并写入文件/rs:以同步方式读取文件并通知系统忽略本地文件系统缓存。适用于操作网络文件系统/w:写入文件/wx:排他方式写入文件/w+:读取并写入文件/wx+:排他方式打开文件，读取并写入/a:追加写入文件/ax:排他方式写入文件/a+:读取并追加写入文件/ax+:排他方式打开文件    默认为'r'

encoding: utf8/ascii/base64 指定何种编码格式来读取文件
*/
fs.readFileSync(filename[, options]); // 同步读取文件

// 例子
var fs = require("fs");
// 异步方法
fs.readFile("../test.txt", {
    "flag": "r+",
    "encoding": "utf8"
}, function(err, data){
  if (err) throw err;
    console.log(data);
});
// 同步方法
var data = fs.readFileSync("../test.txt", {
    "flag": "r+",
    "encoding": "utf8"
});
console.log(data);
```

``` javascript
fs.writeFile(filename, data[, options], callback); // 文件写入异步方法
/*
filename: 文件路径
data: 写入文件数据
options: {
  flag: 同readFile可选参数中的flag。'w'：会覆盖原来的文件内容，'a'：添加文件内容。默认为'w'
  mode: 用于指定当文件被打来时对该文件的读写权限，默认为0666（可读写），linux权限
  encoding: 指定使用何种编码格式来写入该文件
}
callback: function(err){}
*/
fs.writeFileSync(filename, data[, options]); // 文件写入同步方法

// 例子
var fs = require("fs");
// 异步方法
fs.writeFile("../test.txt", "Hello Node.js", {
    flag: "wx",
    mode: "0666",
    encoding: "utf8"
}, function(err){
    if (err) throw err;
});
// 同步方法
fs.writeFileSync("../test.txt", "Hello Node.js", {
    flag: "ax",
    mode: "0666",
    encoding: "utf8"
});
```

``` javascript
fs.appendFile(file, data[, options], callback); // 文件内容追加，异步方式

fs.appendFileSync(file, data[, options]); // 文件内容追加，同步方式
```


###从指定位置处开始读写文件

``` javascript
fs.open(filename, flags[, mode], callback);  // 异步方式打开文件
/*
filename: 文件路径
flags: 同readFile之类函数的可选参数中的flag属性
mode: 同writeFile之类的函数可选参数中的mode属性
callback: function(err, fd){} fd:表示返回的文件描述符
*/
fs.openSync(path, flags[, mode]); // 同步方法打开文件

fs.read(fd, buffer, offset, length, position, callback); // 异步方法读取文件内容
/*
fd: 文件描述符
buffer: Buffer对象，用于指定将文件数据读取到哪个缓存区中
offset: 用于指定向缓存区中写入数据时的开始写入位置（以字节为单位）
length: 用于指定从文件中读取的字节数
position: 用于指定读取文件时的开始位置（以字节为单位）
callback: function(err, bytesRead, buffer){} bytesRead:代表实际读取字节数；buffer:为被读取的缓存区对象
*/
fs.readSync(fd, buffer, offset, length, position); // 返回的是bytesRead值，所以在使用同步方法的时候，需要先声明一个缓存区，在给readSync

fs.write(fd, buffer, offset, length, position, callback); // 异步方式写入文件数据
/*
fd: 文件描述符
buffer: Buffer对象，用于指定从哪个缓存区中读取数据
offset: 用于指定向缓存区中写入数据时的开始写入位置（以字节为单位）
length: 用于指定从文件中读取的字节数
position: 用于指定读取文件时的开始位置（以字节为单位）
callback: function(err, written, buffer){} written: 代表写入的字节数; buffer: 为Buffer对象，代表被读取的缓存区对象.
*/
fs.writeSync(fd, buffer, offset, length, position); // 同步方法写入文件数据，返回written(写入的字节数)

fs.close(fd[, callback]); // 异步方式关闭文件
fs.closeSync(fd); // 同步方式关闭文件

// 注意：在使用write或writeSync方法在文件中写入数据时，操作系统的做法是首先将该部分数据读到内存中，再把数据写到文件中，当数据读完时并不代表数据已经写完，因为还有一部分有可能会留在内存缓存区中。这时如果你调用close或closeSync方法关闭文件，那么这部分的数据就会丢失，这是使用fs.fsync(fd[, callback])对文件进行同步操作，即将内存缓存区中剩余数据全部写入文件。
fs.fsync(fd[, callback]);
fs.fsyncSync(fd);

// 例子
var fs = require("fs");
// 异步方式
fs.open("../test.txt", "r+", "0666", function(err, fd){
    if (err) throw err;
    var CACHE = new Buffer(3);
    // 读取文件内容
    fs.read(fd, CACHE, 0, CACHE.length, 0, function(err, readBytes, buffer){
        if (err) throw err;
        console.log(buffer.slice(0, readBytes).toString("utf8"));
        var CACHE = new Buffer("热", "utf8");
        fs.write(fd, CACHE, 0, CACHE.length, 9, function(err, writeBytes, buffer){
            if (err) throw err;
            console.log(buffer.slice(0, readBytes).toString("utf8"));
        });
    });
});
// 同步方法
var CACHE1 = new Buffer(3);
var CACHE2 = new Buffer("热", "utf8");
var fd = fs.openSync("../test.txt", "r+", "0666");
var readBytes = fs.readSync(fd, CACHE1, 0, CACHE1.length, 0);
console.log(CACHE1.slice(0, readBytes).toString("utf8"));
var writeBytes = fs.writeSync(fd, CACHE2, 0, CACHE2.length, 9);
console.log(CACHE2.slice(0, writeBytes).toString("utf8"));
```




##创建与读取目录

###创建目录

``` javascript
fs.mkdir(path[, mode], callback); // 异步方法创建目录
/*
path: 用于指定需要被创建的目录的完整路径及目录名称
mode: 可选参数默认为"0777"
callback: function(err){}
*/
fs.mkdirSync(path[, mode]); // 同步方法创建目录

// 例子: 
var fs = require("fs");
// 异步创建
fs.mkdir("../test", "0777", function(err){
    if (err) throw err;
    console.log("Create 'test' Directory Successfully!");
});
// 同步创建
fs.mkdirSync("../test", "0777");
```



###读取目录

``` javascript
fs.readdir(path, callback); // 异步读取目录
/*
path: 用于指定需要被创建的目录的完整路径及目录名称
callback: function(err, files){}; 第二个参数为数组，其中存放了读取到的文件中的所有文件名
*/
fs.readdirSync(path); // 同步读取目录

// 例子:
var fs = require("fs");
// 异步创建
fs.readdir("../lib", function(err, files){
    if (err) throw err;
    console.log(files);
});
// 同步创建
var files = fs.readdirSync("../lib");
console.log(files);
```




##查看与修改文件或目录的信息

###查看文件或目录信息

``` javascript
fs.stat(path, callback); // 异步查看文件或目录信息，但是不能查看符号链接文件的信息
/*
path: 用于指定需要被创建的目录的完整路径及目录名称
callback: function(err, stats){} stats为fs.Stats对象，对象拥有如下的一些方法：
isFile: 判断查看的对象是否为一个文件
    isDirectory: 判断查看的对象是否为一个目录
    isBlockDevice: 判断查看的文件是否为一个块设备文件（UNIX系统有效）
    isCharacterDevice: 判断查看的文件是否为一个字符设备文件（UNIX系统有效）
    isSymbolicLink: 判断被查看的文件是否为一个符号链接文件，该方法仅在lstat方法的回调函数中有效
    isFIFO: 判断查看的文件是否是FIFO文件（UNIX系统有效）
    isSocket: 判断查看的文件是否为一个socket文件（UNIX系统有效）
    dev: 该属性值为文件或目录所在设备ID（UNIX系统有效）
    ino: 该属性值为文件或目录的索引编号（UNIX系统有效）
    mode: 该属性值为使用数值形式代表的文件或目录的权限标志
    nlink: 该属性值为文件或目录硬链接数量
    uid: 该属性值为文件或目录的所有者的用户ID（UNIX系统有效）
    gid: 该属性值为文件或目录的所有者的组ID（UNIX系统有效）
    rdev: 该属性值为字符设备文件或块设备文件所在设备的ID（UNIX系统有效）
    size: 该属性值为文件尺寸(文件的字节数)
    atime: 该属性值为文件的访问时间(access time)
    mtime: 该属性值为文件的修改时间(modify time)
    ctime: 该属性值为文件的创建事件(create time)
*/
fs.lstat(path, callback); // 异步查看文件或目录信息
fs.statSync(path); // 同步查看文件或目录信息，但是不能查看符号链接文件的信息
fs.lstatSync(path); // 同步查看文件或目录信息
// 如果你有fd（文件描述符），我们可以使用下面的方式
fs.fstat(fd, callback);
fs.fstatSync(fd);

// 例子:
var fs = require("fs");
// 异步方式
fs.stat("../test.txt", function(err, stats){
    if (err) throw err;
    console.log(stats);
});
// 同步方式
var stats = fs.lstatSync("../lib");
console.log(stats);
```


###检查文件或目录是否存在

``` javascript
// fs.exists()与fs.existsSync()已经被废弃，我们使用fs.access()进行替代
fs.access(path[, mode], callback); // 异步进行文件或目录的权限判定
/*
path: 文件或目录的路径
mode: 下面是一些常量值，用于定义mode可能的值
fs.F_OK: 文件或目录可以得到，但无法判断RWX权限
    fs.R_OK: 文件或目录能被读取
    fs.W_OK: 文件或目录能被写入
    fs.X_OK: 文件或目录能被执行(windows下表现和fs.F_OK效果一样)
    我们可以用|,&进行运算得到mode
callback: function(err){} 如果正确mode则会没错，不然会出现err
*/
fs.accessSync(path[, mode]); // 同步进行文件或目录的权限判定，错误抛出err

// 例子:
var fs = require("fs");
// 异步方法
fs.access("../test", fs.F_OK, function(err){
    if (err) throw err;
});
// 同步方法
fs.accessSync("../test", fs.F_OK);
```



###获取目录或文件的绝对路径

``` javascript
fs.realpath(path[, cache], callback); // 异步获取文件或目录的绝对路径
/*
path: 需要查看的文件或目录的完整路径
cache: 参数为一个对象，其中存放了一些预选指定的路径.
callback: function(err, resolvedpath){} 
*/
fs.realpathSync(path[, cache]); // 同步获取文件或目录的绝对路径，返回结果

// 例子:
var fs = require("fs");
// 异步方法
var cache = {'/etc':'/private/etc'};
fs.realpath('/etc/passwd', cache, function (err, resolvedPath) {
    if (err) throw err;
    console.log(resolvedPath);
});
// 同步方法
var resolvedPath = fs.realpathSync('/etc/passwd', cache);
console.log(resolvedPath);
```



###修改文件访问时间及修改时间

``` javascript
fs.utimes(path, atime, mtime, callback); // 异步修改文件或目录的访问时间及修改时间
/*
path: 用于指定需要被修改时间的文件的完整路径及文件名
atime: 用于指定修改后的访问时间
mtime: 用于指定修改后的修改时间
callback: function(err){} 
*/
fs.utimes(path, atime, mtime); // 同步修改文件或目录的访问时间及修改时间
// 如果你有fd(文件描述符),我们可以使用下面的函数
fs.futimes(fd, atime, mtime, callback);
fs.futimesSync(fd, atime, mtime);

// 例子：
var fs = require("fs");
// 异步方式
fs.utimes("../test.txt", new Date(), new Date(), function(err){
    if (err) throw err;
    console.log("修改时间成功！");
});
fs.stat("../test.txt", function(err, stats){
    if (err) throw err;
    console.log(stats);
});
// 同步方法
fs.utimesSync("../test.txt", new Date(), new Date());
var stats = fs.statSync("../test.txt");
console.log(stats);
```



###修改文件或目录的读写权限

``` javascript
fs.chmod(path, mode, callback); // 异步方法，用于修改文件或目录的读写权限
fs.chmodSync(path, mode); // 同步方法
/*
path: 文件或目录的路径
callback: function(err){} 
*/
// 如果你有fd(文件描述符),我们可以使用下面的函数
fs.fchmod(fd, mode, callback); // 异步方法，用于修改文件或目录的读写权限
fs.fchmodSync(fd, mode); // 同步方法

// 例子:
var fs = require("fs");
// 异步方式
fs.chmod("../lib", "0777", function(err){
    if (err) throw err;
    console.log("权限设置成功！");
});
// 同步方法
fs.chmodSync("../lib", "0777");
```




##可以对文件或目录执行的其他操作

###移动文件或目录

``` javascript
fs.rename(oldPath, newPath, callback); // 异步方法，移动文件或目录。路径在一级为重注名
fs.renameSync(oldPath, newPath);
/*
oldPath: 原路径
newPath: 新路径
callback: function(err){} 
*/

// 例子:
var fs = require("fs");
// 异步方式
fs.rename("../test.txt", "../my.note", function(err){
    if (err) throw err;
    console.log("文件路径修改成功！");
});
// 同步方法
fs.renameSync("../test.txt", "../my.note");
```



###创建与删除文件的硬链接

``` javascript
fs.link(srcPath, dstPath, callback); // 异步方法，创建文件的硬链接
/*
srcPath: 指定需要被创建硬链接的文件的完整路径及文件名
dstPath: 指定被创建的硬链接的完整路径及文件名
callback: function(err){}
*/
fs.linkSync(srcPath, dstPath); // 同步方法

fs.unlink(path, callback); // 异步方法，删除硬链接
/*
path: 硬链接路径
callback: function(err){}
*/
fs.unlinkSync(path); // 同步方法

// 例子:
var fs = require("fs");
// 异步方式
fs.link("../my.note", "../myBack.note", function(err){
    if (err) throw err;
    console.log("硬链接创建成功！");
    setTimeout(function(){
        fs.unlink("../myBack.note", function(err){
            if (err) throw err;
            console.log("硬链接删除成功!");
        })
    }, 2000);
});
// 同步方法
fs.linkSync("../my.note", "../myBack.note");
setTimeout(function(){
    fs.unlinkSync("../myBack.note");
}, 2000);
```



###创建与查看符号链接

``` javascript
// 何为符号链接：所谓的符号链接是一种特殊的文件，这个文件包含了另一个文件或目录的路径及文件名或目录名。如果打开一个文件的符号链接文件进行编辑，操作系统将自动打开符号链接中指向的原文件进行编辑，如果打开一个目录的符号链接文件进行文件的创建，编辑或删除操作，操作系统将会自动打开符号链接中所指向的原目录并执行相应的操作。如果删除符号链接文件，不会删除原文件或目录，如果删除或移动元文件或目录，符号链接文件也不会被删除，这时产生一种称为“断链”的现象。
fs.symlink(srcpath, destpath[, type], callback) // 创建符号链接
/*
srcpath: 指定需要被创建符号链接的文件或目录的完整路径及文件或目录名。
    destpath: 指定被创建的符号链接的完整路径及文件名
    type: 用于指定为文件创建符号链接还是为目录创建符号链接，可指定值file/dir(目录，非windows)/junction(目录，windows)；默认为file
    callbak: function(err) {}
*/
fs.symlinkSync(srcpath, destpath[, type])

fs.readlink(path, callback) // 用于读取符号链接中所包含的另一个文件或目录的路径及文件名或目录名
/*
path: 指定需要读取的符号链接的路径
    callback: function(err, linkString) {} linkString: 读取到的链接字符串
*/
fs.readlinkSync(path)
```



###截断文件

``` javascript
fs.truncate(filename, len, callback) // 对文件进行截断操作（所谓的文件截断就是指一种首先清除文件内容，然后修改文件尺寸的操作）
/*
filename: 指定要进行截断操作的文件名
    len: 整数值，指定被截断后文件的尺寸（以字节为单位）
    callback: function(err) {}
*/
fs.truncateSync(filename, len)

fs.ftruncate(fd, len, callback) // fd: 文件描述符
fs.ftruncateSync(fd, len)
```



###删除空目录

``` javascript
fs.rmdir(path, callback) // 删除空目录
fs.rmdirSync(path)
// 注：必须是目录且为空
```



###监视文件或目录

``` javascript
fs.watchFile(filename[, options], listener) // 对文件进行监视，并在监视到文件修改后执行某些处理
/*
filename: 指定需要被监视的文件的完整路径或文件名
    options: 一个对象
    persistent: 用来指定当指定了被监视的文件后是否停止当前正在运行的程序，默认值为true(不停止)
        interval: 用来指定每隔多少毫秒监视一次文件是否发生改变以及发生了什么改变
    listener: function (curr, prev) {} curr: 为fs.Stat对象, 代表改之后的当前文件；prev: 也为fs.Stat对象，代表改之前的当前文件
*/

fs.unwatchFile(filename[, listener]) // 取消当前文件发生改变需要进行的处理
/*
filename: 指定需要被取消处理的文件的完整路径或文件名
    listener: 用于指定当文件发生改变时需要取消哪个回调函数中所指定的处理，如果不指定该参数，则取消对文件的监视
*/

fs.watch(filename[, options][, listener]) // 对文件或目录进行监视，并在被监视的文件发生修改时执行某些处理。返回fs.FSWatch对象
/*
filename: 指定需要被监视的文件或目录的完整路径或文件名
    options: 为一个对象
    persistent: 用来指定当指定了被监视的文件后是否停止当前正在运行的程序，默认值为true(不停止)
        recursive: 指定是否子级目录也被监视，默认为false(不被监视)，该属性只在当前的filename为目录时有用
    listener: function (event, filename) {} event: "rename"(当指定的目录中任何文件被重注明，移动或删除时)/"change"(当指定的文件或被指定的目录中的任何文件内容发生改变时); filename: 参数值为任何发生改变的文件（可以是指定的文件，也可以是被指定的目录中任何发生改变的文件）
    return value: fs.FSWatch对象
   
    注： recursive属性现在只支持Windows和MacOS。但是你可以使用fs.watchFile他不是基于底层的监视，而是基于状态的改变，所以这种方式更慢，低可信赖
    回调函数支持filename参数，但是自在linux和Windows有作用

    watch方法返回一个fs.FSWatch对象，该对象有一个close方法，用于停止对watch方法中指定监视的文件或目录说执行的监视操作。用法如下:
    watchObj.close()

    当使用watch方法指定监视的文件或目录发生改变时，触发fs.FSWatch对象的"change"事件，该事件触发时可以调用回调函数的指定方法，该方法与listener一样。
*/

// 例子:
var fs = require("fs");
// watch方法监听
var watchObj1 = fs.watch("../my.note", function(event, filename){
    console.log(event+" : "+filename);
});
watchObj1.close();
// fs.FSWatch对象监听
var watchObj2 = fs.watch("../my.note");
watchObj2.on("change", function(event, filename){
    console.log(event+" : "+filename);
});
watchObj2.close()
```




##使用文件流

###流的基本概念

**fs模块中几种文件读写方式的区别**

|       用途       |  使用异步方法   |    使用同步方法     |
| :------------: | :-------: | :-----------: |
|   将文件完全读入缓存区   | readFile  | readFileSync  |
|   将文件部分读入缓存区   |   read    |   readSync    |
|   将数据完整写入文件    | writeFile | writeFileSync |
| 将缓存区中的部分内容写入文件 |   write   |   writeSync   |

如上表所示：使用readFile方法或readFileSync方法读取文件内容时，Nodejs会将文件内容完整地读入缓存区，再从缓存区中读取文件内容。在使用writeFile或writeFileSync方法写入文件内容时，Node.js首先将文件内容完整的写入缓存区中，然后一次性的将缓存区中的内容写入到文件中。也就是说，在使用这些方法对文件进行读取和写入操作时，Node.js将该文件内容视为一个整体，为其分配缓存区并一次性将文件内容读取到缓存区中，在这期间，Node.js将不能执行其他任何处理。

​

然而使用read,readSync对文件进行读取操作时，Node.js将不断地将文件中一小块内容放入缓存区，最后从该缓存区中读取文件内容。如果使用write,writeSync方法写入文件内容，Node.js将执行以下过程:

​1. 将需要书写的数据书写到一个内存缓存区

​2. 待缓存区写满后再将缓存区中内容写入到文件中

​3. 重复执行过程1和2直到数据全部写入文件为止

也就是说使用read,readSync和write,writeSync对文件进行读取和写入，可以在过程中进行其他的Node.js处理



###流的介绍

在一个应用程序中，流是一组有序的，有起点和终点的字节数据的传输手段。在应用程序中各种对象之间交换与传输数据的时候，总是先将该对象中所包含的数据转化为各种形式的流数据（即字节数据），再通过流的传输，到达目的对象后再将流数据转化为对象中可以使用的数据。

​

在Node.js中，使用各种实现了stream.Readable接口的对象来将对象数据读取为流数据，所有这些对象都是继承了EventEmitter类的实例对象，在读取数据的过程中，可能触发各种事件。

​

在Node.js中，可以使用flowing模式(flowing mode)和非flowing模式(paused mode)来读取数据。当使用flowing模式的时候，将使用操作系统的内部I/O机制来读取数据，这将允许你以最快的速度来读取数据。当使用非flowing模式时，你必须显示调用对象的read方法来读取数据。流开始是非flowing模式

​

如果没有绑定data事件的处理函数，没有指定`pipe()`方法的目的对象，而且你使用的仍然是flowing模式，则会造成数据的丢失。

​

你能通过以下方式转到flowing模式:

- 你可以给`data`事件添加事件处理函数
- 调用`resume()`方法去确切的打开流
- 调用`pipe()`方法去发送数据给一个stream.Writable对象

你能通过以下方法回到非flowing模式

- 如果没有`pipe`的目标对象，通过调用`pause()`方法
- 如果有`pipe`的目标对象，通过移除`data`事件的处理函数，然后移除所有的`pipe`目标通过调用`unpipe()`方法

​注意: 为了向后的兼容性考虑，移除`data`事件的处理函数的做法不将自动的暂停流。同样的，如果有`pipe`的目标对象，然后调用`pause()`方法将不能保证流在目标对象`drain`和请求更多数据时仍然保持着非flowing模式。

​

​**Node.js中各种用于读取数据的对象**

|           对象            |                    描述                    |
| :---------------------: | :--------------------------------------: |
|      fs.ReadStream      |                  用于读取文件                  |
|  http.IncomingMessage   |              代表客户端响应或服务器端请求              |
|       net.Socket        |              代表一个socket端口对象              |
|      child.stdout       | 用于创建子进程的标准输出流。如果子进程与父进程共享输入输出流，则子进程的标准输出流被废弃 |
|      child.stderr       | 用于创建子进程的标准错误输出流。如果子进程与父进程共享输入输出流，则子进程的标准错误输出流被废弃 |
|      process.stdin      |               用于创建进程的标准输入流               |
| Gzip,Deflate,DeflateRaw |                 用于实现数据压缩                 |

​**各种用于读取数据的对象将会触发的事件**

|   事件名    |                    描述                    |
| :------: | :--------------------------------------: |
| readable | 当可以从流中读取数据时触发。在大多数情况下没如果指定了readable事件的回调函数，将迫使系统将流数据首先读入操作系统的缓存区中，然后再从操作系统缓存区中读取数据。当操作系统的缓存区中对象被全部读出，且可以继续从流中读取数据时，将触发一个新的readable事件。 |
|   data   | 参数值为存放了已读取到的数据的缓存区对象或一个字符串（当对流数据指定编码格式时），当读取到来自于文件，客户端，服务器端等对象的新的数据时触发data事件。如果指定data事件的回调函数，将使用flowing模式来读取流数据，这允许你以最快速度读出流中的数据。 |
|   end    |    当读取完所有数据时触发，该事件的触发意味着data事件将不再被触发。    |
|  error   |             当读取数据过程中产生错误时触发。             |
|  close   | 当用于读取流数据的对象（例如一个文件描述符）被关闭时触发。并非所有用于读取流数据的对象都会触发该事件。 |

​**各种用于读取数据的对象所拥有的方法**

|             方法名              |                    描述                    |
| :--------------------------: | :--------------------------------------: |
|             read             |                  用于读取数据                  |
|         setEncoding          |             用于指定用什么编码方式读取数据              |
|            pause             |             用于通知对象停止触发data事件             |
|            resume            |             用于通知对象回复触发data事件             |
| pipe(destination[, options]) | 用于设置一个数据通道，然后取出所有流数据并将其输出到通道的另一端所指向的目标对象中。选项中end为布尔值，表示当读结束时，写是否也结束，默认为true(结束) |
|            unpipe            |             用于取消pipe方法中设置的通道             |
|           unshift            | 当对流数据绑定了一个解析器时，可以使用unshift方法来取消该解析器的绑定，使数据可以通过其他方式解析 |

​

在Node.js中，使用各种实现了stream.Writeable接口的对象来将流数据写入到对象中，所有这些对象都继承了EventEmitter类的实例对象，在写入数据的过程中，将可能触发各种事件。

​**Node.js中的各种用于写入数据的对象**

|            对象             |                    描述                    |
| :-----------------------: | :--------------------------------------: |
|      fs.WriteStream       |                  用于写入文件                  |
|    http.ClientRequest     |             用于写入HTTP客户端请求数据              |
|    http.ServerResponse    |             用于写入HTTP服务器端响应数据             |
|        net.Socket         | 用于读写TCP流或UNIX流，可被用户创建并作为一个客户端来使用，也可以被Node.js脚本程序创建并通过服务器的connection事件来传递给用户 |
|        child.stdin        | 用于创建子进程的标准输入流。使用该对象的close方法将终止子进程。如果子进程与父进程共享输入输出流，则子进程的标准输入流数据被弃用 |
|      process.stdout       |               用于创建进程的标准输出流               |
|      process.stderr       |              用于创建进程的标准错误输出流              |
| Gunzip,Inflate,InflateRaw |                  用于解压数据                  |

​**各种用于写入数据的对象将会触发的事件**

|  事件名   |                    描述                    |
| :----: | :--------------------------------------: |
| drain  | 当用于写入数据的write方法返回false之后触发，表示操作系统缓存区中的数据已全部输出到目标对象中，可以继续向操作系统的缓存区中写入数据 |
| finish |       当end方法被调用且数据被全部写入操作系统缓存区时触发        |
|  pipe  |         当用于读取数据的对象的pipe方法被调用时触发          |
| unpipe |         当用于读取的对象的unpipe方法被调用时触发          |
| error  |             当写入数据的过程中产生错误时触发             |

​**各种用于写入数据的对象所拥有的方法**

|  方法名  |                    描述                    |
| :---: | :--------------------------------------: |
| write |                  用于写入数据                  |
|  end  | 当没有数据再被写入流中时调用该方法。这将迫使操作系统缓存区中的剩余数据将被立即写入目标对象中。当该方法被调用后，将不能继续在目标对象中写入数据 |




##路径解析

该模块包含着处理和转化文件路径的工具函数。几乎所有函数只是字符串的转化，并不会检测该路径所指向的资源是否存在。使用`require("path")`引入path工具集

``` javascript
// path.basename(p[, ext]) 返回路径的最后一部分，相当于Unix系统的basename指令
/*
	p: 所要解析的路径
    ext: 可选参数，将会返回除去ext的部分
*/
// 例子
path.basename('/foo/bar/baz/asdf/quux.html')// returns 'quux.html'
path.basename('/foo/bar/baz/asdf/quux.html', '.html')// returns 'quux'

// path.delimiter  常量指路径分隔符 环境变量之间的分隔符 ";", ":"
// 例子
process.env.PATH.split(path.delimiter) 

// path.dirname(path) 返回路径的目录，和Unix的dirname指令相似
// 例子
path.dirname('/foo/bar/baz/asdf/quux') //returns '/foo/bar/baz/asdf'

// path.extname(p) 返回路径的扩展名，从路径最后一个“.”开始，到路径结束。如果没有"."或者，路径开头是"."，则返回""
// 例子
path.extname('index.html')// returns '.html'
path.extname('index.coffee.md')// returns '.md'
path.extname('index.')// returns '.'
path.extname('index')// returns ''
path.extname('.index')// returns ''

// path.format(pathObject) 将一个对象解析为路径字符串,反向操作是path.parse
/*
	root: 根目录
    dir: 目录路径
    base: basename
    ext: 扩展名
    name: 文件名
    文件名+扩展名=basename
*/
path.format({
    root : "/",
    dir : "/home/user/dir",
    base : "file.txt",
    ext : ".txt",
    name : "file"
})// returns '/home/user/dir/file.txt'

// path.isAbsolute(path) 判断路径字符串是否是绝对路径

// path.join([path1][, path2][, ...]) 将所有参数字符串(路径), 格式化为一个结果字符串
path.join('/foo', 'bar', 'baz/asdf', 'quux', '..')// returns '/foo/bar/baz/asdf'

// path.normalize(p) 格式化字符串，格式"..", "."
path.normalize('/foo/bar//baz/asdf/quux/..')// returns '/foo/bar/baz/asdf'

// path.parse(pathString) 将路径字符串解析为一个对象，反向操作为path.format 
path.parse('/home/user/dir/file.txt')

// path.relative(from, to) 获取从一个路径到另一个路径的相对路径
path.relative('/data/orandea/test/aaa', '/data/orandea/impl/bbb')// returns '../../impl/bbb'

// path.resolve([from ...], to) 解析为绝对路径
path.resolve('foo/bar', '/tmp/file/', '..', 'a/../subfile')
/*
上述操作相当于
cd foo/bar
cd /tmp/file/
cd ..
cd a/../subfile
pwd
*/

// path.sep 目录分隔符 "//", "\"
```