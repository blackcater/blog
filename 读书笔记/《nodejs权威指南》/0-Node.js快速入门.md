## Node.js快速入门

**创建http服务器**

``` javascript
var http = require("http");
http.createServer(function(req, res){
  res.writeHeader(200, {"Content-Type": "text/html"});
  res.write("<h1>Node.js构建http服务器</h1>");
  res.end("<p>Hello World!</p>");
}).listen(80);
console.log("HTTP server is listening at port 80");
```

node.js编译完成后代码就被加载到内存中，当修改源代码的时候，代码本身不会被修改，因此，需要从新编译。然而这种方式在开发中是相当复杂的。**supervisor**就是为了解决这个问题而存在的。你可以通过`npm install -g supervisor` 安装。

**阻塞与线程**

当线程遇到磁盘读写或者网络通信（统称为I/O操作），通常要耗费较长的时间，这时操作系统会剥夺这个线程的CPU控制权，使其暂停执行，同时将资源让给其他线程，这种线程调度方式称为**阻塞**。当I/0操作完成时，操作系统将这个线程的阻塞而状态解除，恢复其对CPU的控制权，令其继续执行。这种模式就称为同步I/O（Synchronous I/O）或阻塞式I/O（Blocking I/O）。

![阻塞式I/O](https://raw.githubusercontent.com/blackcater/blog/master/%E8%AF%BB%E4%B9%A6%E7%AC%94%E8%AE%B0/%E3%80%8Anodejs%E6%9D%83%E5%A8%81%E6%8C%87%E5%8D%97%E3%80%8B/images/%E9%98%BB%E5%A1%9E%E5%BC%8F.PNG)

相应的，异步I/O（Asynchronous I/O）或非阻塞式I/O（Non-blocking I/O）则针对所有I/O操作不采用阻塞的策略。当线程遇到I/O操作时，不会以阻塞的方式等待I/O操作的完成或者数据的返回，而只是将I/O请求发送给操作系统，继续执行下一条语句。当操作系统完成I/O操作时，以事件的形式通知执行I/O操作的线程，线程会在特定的时候处理这个事件。为了处理异步的I/O，线程必须有*事件循环*，不断地检查有没有未处理的事件，依次予以处理。

![非阻塞I/O](https://raw.githubusercontent.com/blackcater/blog/master/%E8%AF%BB%E4%B9%A6%E7%AC%94%E8%AE%B0/%E3%80%8Anodejs%E6%9D%83%E5%A8%81%E6%8C%87%E5%8D%97%E3%80%8B/images/%E9%9D%9E%E9%98%BB%E5%A1%9E%E5%BC%8F.PNG)

同步I/O与异步I/O的区别

|     同步I/O（阻塞式）      |  异步式I/O（非阻塞式）  |
| :-----------------: | :------------: |
|     利用多线程提供吞吐量      |    单线程实现吞吐量    |
| 通过事件片分割和线程调度利用多核CPU | 通过功能划分利用多核CPU  |
| 需要操作系统调度多线程使用多核CPU  | 可以将单线程绑定到单核CPU |
|     难以充分利用CPU资源     |  可以充分利用CPU资源   |
|    内存轨迹大，数据局部性弱     |  内存轨迹小，数据局部性强  |
|      符合线性的编程思维      |   不符合传统编程思维    |



**Node.js事件循环机制**

Node.js程序由事件循环开始，到事件循环结束，所有的逻辑都是事件的回调函数，所以Node.js始终在事件循环中，程序的入口就是事件循环第一个事件的回调函数。事件的回调函数在执行的过程中，可能会发生I/O请求或直接发射（emit）事件，执行完毕后再返回事件循环，事件循环会检查事件队列中有没有未处理的事件，直到程序结束。

![事件循环](https://raw.githubusercontent.com/blackcater/blog/master/%E8%AF%BB%E4%B9%A6%E7%AC%94%E8%AE%B0/%E3%80%8Anodejs%E6%9D%83%E5%A8%81%E6%8C%87%E5%8D%97%E3%80%8B/images/%E4%BA%8B%E4%BB%B6%E5%BE%AA%E7%8E%AF.PNG)



**模块和包**

