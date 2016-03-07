#实现基于TCP与UDP的数据通信

[TOC]

##本章内容

- 如何创建TCP服务器
- 如何使用TCP服务器监听客户端连接的socket端口对象读取客户端发送的数据
- 如何创建TCP客户端以及怎样利用客户端用于连接TCP服务器的socket端口对象向服务器发送数据
- 如何创建UDP服务器与UDP客户端，以及如何实现UDP客户端与UDP服务器之间的通信
- 如何从UDP服务器向客户端广播数据，以及如何从UDP服务器向客户端组播数据





##使用net模块实现基于TCP的数据通信

在node.js中，提供一个`net`模块，专门用于实现TCP服务器与TCP客户端之间的通信。

###创建TCP服务器

``` javascript
// net.createServer([options][, connectionListener]) 方便的创建TCP服务器
/*
	options: 
    	allowHalfOpen: 布尔值，当属性值为false时，当TCP服务器接收到客户端发送的一个FIN包时将会会发一个FIN包；当属性值被设定为true时，当TCP服务器接收到客户端发送的一个FIN包时将不会回发一个FIN包，这使得TCP服务器可以继续向客户端发送数据，但是不会继续接受客户端发送的数据。开发者必须调用end方法来关闭socket链接。该属性默认值为false。
        pauseOnConnect: 布尔值，如果为真，则服务器与该客户端之间的socket将被暂停，进入非flowing状态(paused mode)，所以将没有数据从处理函数中读取出。在暂停期间的数据将被缓存起来，在下次转化到flowing模式的时候被获得。从暂停的socket中读取数据，就调用resume()函数即可。
        	    var net = require("net");
                var server = net.createServer({
                    pauseOnConnect: true
                }, function(socket){
                    setTimeout(function(){
                        socket.resume();
                    }, 10000);
                    socket.on("data", function(chunk){
                        console.log("data : "+chunk);
                    });
                });
    connectionListener: 指定当客户端与服务器建立连接时所需要调用的回调函数，该回调函数方法为function (socket) {...} 参数socket为该TCP服务器监听的socket端口对象。
   	createServer方法返回被创建的TCP服务器。

    server.listen(8181, function(){
        console.log("Connected on 8181!");
    });

    当客户端与服务器建立连接时，触发connection事件，我们也可以不在createServer方法中加回connectionListener参数，而是通过对connection事件进行监听，并指定事件的回调函数。
*/
// 例子: 
var server = net.createServer(function(socket){....});
// 等价于
server.on("connection", function(socket){...})


// 指定TCP服务器监听客户端链接有3中方式
// 方式一：server.listen(options[, callback]) 
/*
	options: 对象，有如下属性值可供选择：
    	port: 数字，监听的端口号
        host: 字符串，指定需要监听的IP地址或主机名
        backlog: 数字，用于指定位于等待队列中的客户端连接的最大数量，一旦超过这个数量，TCP服务器开始拒绝来自于新的客户端的链接请求，默认值为511
        path: 字符串
        exclusive: 布尔值，默认值为false
      port, host, backlog属性和可选的回调函数与server.listen(port[, host][, backlog][, callback])的行为一样。path属性能够是一个Unix socket文件的路径。
      如果exclusive是false, 
*/
// 方式二：server.listen(path[, callback])
/*
	path: 字符串，路径
    callback: listening事件的回调函数

    通知一个使用Unix端口的服务器开始监听来自于指定路径的客户端连接。
    该函数为异步函数。当服务器被绑定时，listening事件将会被触发。而该函数的回调函数将会被绑定到该事件的监听器上。
*/
// 方式三：server.listen(handle[, callback])
/*
	handle: 指定需要监听的socket句柄
    callback: listening事件的监听器

    这种形式的listen方法通知一个TCP服务器开始监听来自于指定socket句柄（该句柄可以为一个TCP服务器对象，也可以是一个socket端口对象，也可以是文件描述符，在Windows中不支持对文件描述符的监听）的客户端连接。
*/
// 如果在不适用上述3中形式的listen方法中使用callback参数，我们也可以通过监听TCP服务器对象的listening事件，并指定回调函数

// server.on("close", function(e){...})  监听TCP服务器的错误事件。
// 当端口被占用的时候，将会产生一个错误代码为"EADDRINUSE"的错误。同时触发TCP服务器的error事件。
// 例子
server.on("close", function(e){
  if(e.code == "EADDRINUSE"){
    console.log("端口已经被占用!");
  }
})

// server.address() 方法返回一个对象
/*
	port: 属性值为TCP服务器监听的socket端口号
    address: 属性值为TCP服务器监听的地址
    familt: 属性值为一个标识了TCP服务器监听的地址是IPv4地址还是IPv6地址的字符串，例如“IPv4”

    请不要再listening事件触发前调用该函数。
*/

// server.getConnections(calback) 异步方法获取客户端连接数
/*
	callback: 回调函数，形如function(err, count){...} err：获取客户端连接数触发的错误对象；count：客户端连接数目
*/

// server.close([callback]) 服务器拒绝所有新的客户端连接
/*
	callback: 如果不填该参数，可以在close事件中填写回调函数达到同样的效果。
*/
```



###socket端口对象

在Node.js中，使用`net.Socket`代表一个socket端口对象。上面，使用createServer创建TCP服务器时，函数的回调函数的参数就是一个`net.Socket`对象。

``` javascript
// socket.address() 与server.address()一样。

// socket.on("data", function(data){...}) 读取客户端发送的流数据，每次客户端发送数据时，都会触发data事件。
/*
	回调函数使用一个参数，参数为一个Buffer对象，或者字符串（如果对其进行编码了）
*/

// socket.bytesRead 和 socket.bytesWrite 
/*
	socket.bytesRead: 表示从客户端读取了多少字节数据
    socket.bytesWrite: 表示发送了多少字节数据
*/

// socket.pipe(destination[, options]) 将客户端发送的流数据写入到目标对象中
/*
	destination: 必须为一个可以用于写入流数据的对象
    options：对象
    	end: 布尔值，true: 当数据被全部读取完毕时立即结束写操作。false: 比了不结束写操作，目标对象可以继续写入新的数据，默认为true。

    使用socket.unpipe(destination) 解除绑定
*/
// 例子:
var net = require("net");
var file = new require("fs").WriteStream("../bk.note");
var server = net.createServer(function(socket){
    console.log("连接成功!");
    socket.pipe(file);
});

server.listen({
    host: "localhost",
    port: 8181
}, function(){
    var address = server.address();
    console.log("服务器正在监听 "+address.address+":"+address.port+"......");
});

// socket.pause() 使用该方法暂停data事件的触发之后，可以使用socket端口对象的resume方法恢复data事件的触发，这时将读取被缓存的该客户端数据。

// socket.setTimeout(timeout[, callback]) 为客户端连接指定默认的超时时间，默认未指定超时时间。
/*
	timeout: 指定客户端连接的超时时间，单位为毫秒。
    callback: 用于指定超时时需要进行的处理，如果没有改参数，可以对socket的timeout时间进行监听，设置其回调函数，可以达到同样的效果。

    当timeout为0时，可取消超时时间。
*/
// 例子
server.on("connection", funciton(socket){
  socket.pause();
  socket.setTimeout(10*1000, function(){
  	socket.resume();
    scoket.pipe(file);
  });
  socket.on("data", funtion(data){
  	socket.pause();
  });
});
```



###创建TCP客户端





``` javascript
// net.Socket([options]) 创建TCP客户端很简单，就是只需要创建一个用于连接TCP服务器的socket端口对象即可。
/*
	options是一个对象，默认值为:
    {
  		fd: null,
        allowHalfOpen: false,
        readable: false,
        writable: false
	}

    fd: 指定一个现存的socket的文件描述符，TCP客户端将使用这个现存的socket端口与服务器端相连接。
    allowHalfOpen: 为false是当TCP服务器接收到客户端的FIN包时将会回发一个FIN包。当为true时，则不会回发FIN包，这使得TCP服务器可以向客户端继续发送数据，但是不会继续接受客户端发送的数据。
    writable/readable: 是否允许对socket进行读写操作。

    注意：writable和readable只有在fd有用的时候才起作用。
*/

// 创建了socket端口对象之后，即可使用socket端口对象的connect方法连接TCP服务器（代码中socket代表一个socket端口对象）
// 方法一：socket.connect(port[, host][, connectListener])
/*
	port: 用于指定需要连接的TCP服务器端口
    host: 用于指定需要连接的TCP服务器地址
    connectListener: 用于指定当一个客户端与TCP服务器建立连接后，触发socket端口对象的connect事件。可以不再事件上指定监听器。其作用于下面一段代码相同

    	socket.on("connect", function(){...})
*/
// 方法二：socket.connect(path[, connectListener])
/*
	这种形式的connect方法用于与一个使用unix端口的服务器进行连接，方法中使用两个参数
    path: 为必须指定参数，用于指定服务器所使用的unix端口路径
    connectListener: 和上一个作用一样
*/
// 方法三：socket.connect(options[, connectListener])
/*
	options为一个对象，有如下属性可供选择：
    	port: 客户端需要连接的TCP服务器端口
        host: 客户端需要连接的TCP服务器地址，默认为"localhost"
        localAddress: 本地用于建立连接的地址
        localPort: 本地用于建立连接的端口号
        family: 指定IP类型，是IPv4还是IPv6
        lookup: 查询函数，默认为dns.lookup
      对于局部域(local domain)socket, options参数应该是一个包含特殊属性path的对象	
      	path: 客户端连接的路径。

        该方法为异步的，当connect事件被触发，连接就被建立。如果连接出现问题，connect将不会被触发，会触发error事件。
*/

// socket.write(data[, encoding][, callback])
/*
	data: 可以为一个Buffer对象或一个字符串，用于指定写入的数据
    encoding: 指定数据以什么编码方式写入，默认是“utf8”
    callback: 设置写入数据完毕后说进行的回调函数。

    在一个快速的网络中，当数据量较小的时候，Node.js总是将数据直接发送到操作系统专用于发送数据的TCP缓存区中，然后从该TCP缓存区中取出数据发送给对方。在一个慢速的网络中或需要发送大数据量时，TCP客户端或服务器端所发送的数据并不一定会立即被对方所接受，在这种情况下，Node.js会将这些数据缓存在缓存队列中，在对方可以接受数据的情况下将缓存队列中的数据通过TCP缓存区发送给对方。socket端口对象的write方法返回一个布尔类型的返回值，当数据直接被发送到TCP缓存区中时，该返回值为true；当数据首先被发送到缓存队列时，该返回值为false。当返回值为false且TCP缓存区中数据以全部发送出去时，触发drain事件。
    可以使用socket端口对象的bufferSize属性来查看用于缓存队列中当前缓存的字符数。
*/

// socket.on("error", function(err){...})
// 例如当TCP客户端应用程序在未关闭与TCP服务器之间连接的情况下被强制退出时，也将触发TCP服务器端用于监听与该客户端相连接的socket端口对象的error事件（这时触发的错误代码为ECONNRESET）

// socket.destory() 在上述发生了错误。在捕捉到错误之后，我们应该使用触发错误的socket端口对象的destory方法销毁socket端口对象，以确保该socket端口对象不会再被利用

// socket.end([data][, encoding])
// 当TCP服务器与TCP客户端建立连接后，TCP服务器可以使用与该客户端相连接的socket端口对象的end方法关闭该客户端连接，TCP客户端也可以使用与服务器端相连接的socket端口对象的end方法关闭与服务器端的连接。

// server.unref() TCP服务器不会自动退出，即使客户端连接已被全部关闭。我们可以使用该函数指定当客户端连接被全部关闭时退出应用程序

// server.ref() 对TCP服务器使用了unref方法之后，可以继续使用TCP服务器的ref方法继续阻止应用程序的退出。

// socket.on("close", function(had_error){...}) 当socket端口彻底关闭时，触发socket端口对象的close事件，可以通过对close事件进行监听并指定事件函数的方法来指定当socket端口关闭时说需自行的处理
```

``` javascript
// 例子
// 使用TCP服务器对象的close方法拒绝新的客户端连接请求
var net = require("net"),
    server = net.createServer();

server.on("connection", function(socket){
    console.log("客户端与服务器端连接已经建立！");
    socket.setEncoding("utf8");
    socket.on("data", function(data){
        console.log("已接受客户端发送的数据: "+data);
        socket.write("确认数据: "+data);
    });
    socket.on("error", function(err){
        console.log("与客户端通信的过程中发生了一个错误，错误编码为%s。", err.code);
        socket.destroy();
    });
    socket.on("end", function(){
        console.log("客户端连接被关闭。");
        server.unref();
    });
    socket.on("close", function(had_error){
        if(had_error){
            console.log("由于一个错误导致socket端口被关闭。");
            server.unref();
        }else{
            console.log("socket端口被正常关闭。");
        }
    });
    server.getConnections(function(err, counts){
        if (err) throw err;
        if (counts == 2){
            server.close();
        }
    });
});

server.listen(8181, "localhost");

server.on("close", function(){
    console.log("TCP服务器被关闭。");
});


// 客户端
var net = require("net"),
    client = new net.Socket();

client.connect(8181, "localhost", function(){
    console.log("已连接到服务器端。");
    client.write("你好!");
    setTimeout(function(){
        client.end("再见!");
    }, 10000);
});
client.on("data", function(data){
    console.log("已经接收服务器发送的数据： "+data);
});

client.on("error", function(err){
    console.log("与服务器连接或通信的过程中发生了一个错误，错误编码为%s", err.code);
    client.destroy();
});
```

``` javascript
// socket.bufferSize, socket.bytesRead和socket.bytesWritten
/*
	socket.bufferSize: 当前缓存队列的字节数
    socket.bytesRead: 属性值为从该socket端口向TCP客户端或TCP服务器端已读取的字节数
    socket.bytesWritten： 属性值为从该socket端口向TCP客户端或TCP服务器端已发送的字节数
*/

// socket.setKeepAlive([enable][, initialDelay])
// 在TCP客户端与服务器端链接后，当一方主机突然断电，重启或崩溃等意外情况时，将来不及给另一方发送FIN包，这将使另一方永远处于连接状态。
/*
	enable: 布尔值。为true, 启用Keep-alive机制。启用该机制后，使用该函数的一方将会不断地向对方发送一个探测包，如果发送探测包后对方没有发回相应的话，则人会对方已经关闭链接，执行对方关闭连接时应该执行的处理。默认为false。
    initialDelay： 用于指定每隔多久发送一次探测包，单位为毫秒，如果为0，则保持操作系统中默认设置的Keep-alive探测包的发送间隔时间。默认为0。
*/
```



###net模块中的类方法

``` javascript
// net.isIP(input), net.isIPv4(input)和net.isIPv6(input)
```





##使用dgram模块实现基于UDP的数据通信

我们知道TCP是一种基于连接的协议，在进行通信前，首先要求客户端与服务器端建立一条通信的连接。而UDP是一种面向非链接的协议，在通信前，不要求首先建立客户端与服务器端之间的连接，可以直接把数据包发送给对方。基于这个原因，UDP也是一种不可靠的协议，但是其传输速度比TCP更快，因此更适合于实时通信的场合。

在Node.js中，提供了dgram模块，用于创建UDP服务器与客户端，以及实现UDP服务器与客户端之间的通信。



###创建UDP服务器与客户端

``` javascript
// 创建一个用于实现UDP通信的socket端口对象有2中方法
// 方法一: dgram.createSocket(type[, callback])
/*
	type: 指定进行UDP通信时使用的协议类型，可以为"udp4"或"udp6"
    callback: 函数，绑定到获取的socket端口对象的message事件上。
    return: socket端口对象。function(msg, info){...} msg: buffer对象，报文。 info: 对象，远程地址的信息有如下一些属性
    	address: 属性值为发送者所使用的地址
        family: 属性值为一个标识了发送者说使用的地址时IPv4地址还是IPv6地址的字符串
        port: 属性值为发送者说使用的socket端口号
        size: 属性值为发送者所发送的数据的字节数
*/
// 方法二: dgram.createSocket(options[, callback])
/*
	options: 对象 有如下一些属性
    	type: 指定udp协议类型"udp4"或"udp6"可供选择
        reuseAddr: 布尔值，当值为true时，socket.bind()将会从再使用该地址，即使如果另一个进程已经绑定了一个端口对象到该地址。默认值为false。
*/

// 在创建了socket端口对象之后，可以使用socket端口对象的bind方法来指定该端口对象所监听的地址与端口号。
// socket.bind([port][, address][, callback])
/*
	port: 指定socket端口对象所监听的端口号。没有该参数将会随机绑定一个端口
    address: 指定socket端口对象所监听的地址。没有该地址将会监听所有地址。
    callback: 回调函数， 指定开始监听时所要调用的回调函数，该回调函数中不使用任何的参数。当socket端口对象开始监听来自于指定端口和地址的数据时，触发socket端口对象的listening事件。
    	function("listening", function(){...})
*/

// 当创建了一个socket端口对象之后，可以利用socket端口对象的send发送数据
// socket.send(buf, offset, length, port, address[, callback])
/*
	buf: 代表一个缓存区的Buffer对象，该缓存区存放了需要发送的数据。
    offser: 指定从缓存区中的第几个字节处开始取出要发送的数据。
    length: 指定需要发送数据的字节数。
    port: 指定接收数据的socket端口对象所使用的端口号。
    address: 指定接收数据的socket端口对象所属地址
    callback: 用于指定当数据发送完毕时需要调用的回调函数
    	function(err, bytes){....}
        err: 发送数据失败触发的错误对象，通常是由于DNS解析错误导致的。
        bytes: 指发送数据的字节数
*/

// 获取该socket端口对象相关的地址信息
// socket.address()
// 返回一个对象，有port, address, family属性

// 创建简单的UDP服务器
var dgram = require("dgram"),
    server = dgram.createSocket("udp4");
server.on("message", function(msg, info){
    console.log("已接受客户端发送的数据: "+msg);
    console.log("客户端地址信息为 %j", info);
    var buf = new Buffer("确认信息: "+msg);
    server.send(buf, 0, buf.length, info.port, info.address, function(err, byteSize){
        if (err) throw err;
        console.log("已发送数据大小: "+byteSize+"字节!");
    });
});
server.on("listening", function(){
    var address = server.address();
    console.log("服务器开始监听。地址信息为 %j", address);
});
server.bind(8181, "localhost");

// 创建简单的UDP客户端
var dgram = require("dgram"),
    buf = new Buffer("你好，服务器!"),
    client = dgram.createSocket("udp4");
client.on("message", function(msg, info){
    console.log("已经接受服务器发送的数据: %s", msg);
    console.log("服务器地址为 %s。", info.address);
    console.log("服务器所用端口为 %s。", info.port);
});
client.send(buf, 0, buf.length, 8181, "localhost",  function(err, byteSize){
    if (err) throw err;
    console.log("已发送 %d字节的数据!", byteSize);
});

// 在创建socket端口对象之后，应用程序不会被自动关闭
// socket.close() 关闭socket端口对象。socket端口被关闭时，触发该socket端口对象的close事件，可以通过对该事件的监听并指定事件回调函数范式来指定socket端口被关闭所需要执行的处理。socket.on("close", function(){...})

// 使用socket.unref()方法指定当不存在与该socket端口对象进行通信的客户端连接时，允许运行UDP服务器的应用程序被正常退出，可以使用socket.ref()取消退出。

// 再网络中发送的每个数据包都有TTL值，用于标识一个数据包的生存时间。大多数的操作系统TTL值设置都是64。在Node.js中，我们可以指定1~255之间的任意一个整数
// socket.setTTL(ttl)
```



###实现广播与组播

``` javascript
// 广播
// socket.setBroadcast(flag) 
/*
	flag: 布尔值。当为true时，UDP服务器或客户端可以利用其所用的socket端口对象的send方法来进行数据的广播，在广播的时候，需要将socket端口对象的send方法中的地址修改为广播地址。
*/

// 组播
// 在实现数据的组播前，首先要使用socket端口对象的addMembership方法将该socket端口对象加入到组播组中。
// socket.addMembership(multicastAddress[, multicastInterface])
/*
	multicastAddress: 为一个字符串，用于指定socket端口需要加入的组播组地址
    multicastInterface: 为一个字符串，用于指定socket端口需要加入的网络接口IP地址，如果省略，socket端口将加入到所有有效的网络接口中。之后就可以从该socket端口收发组播消息。
*/

// 退出组播
// socket.dropMembership(multicastAddress[, multicastInterface])

// 设置进行数据组播时从该端口发送出去的数据包在被路由器废弃前，该数据包可以经过的路由器的最大数目。
// socket.setMulticastTTL(ttl)

// 设置是否允许组播数据回送，如果为true，被组播的数据将被主机的本地接口所接受收。
// socket.setMulticastLoopback(flag)
```