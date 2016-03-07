#创建HTTP与HTTPS服务器及客户端

[TOC]

##本章内容

- 如何创建HTTP服务器
- 如何使用HTTP服务器接受客户端请求数据
- 如何使用HTTP服务器向客户端返回响应数据
- 如何使用Node.js制作HTTP客户端
- 如何使用Node.js制作代理服务器
- 如何创建HTTPS服务器
- 如何创建HTTPS客户端





##HTTP服务器

###创建HTTP服务器

``` javascript
// 创建一个http服务器
// http.createServer([requestListener])
/*
	requestListener: 一个函数，将自动绑定到该函数返回的对象的request事件的回调函数上。回调函数如下：
    	function(request, response){
  			...
		}
    在回调函数中，使用两个参数，其中第一个参数值为一个http.IncomingMessage对象，此处代表一个客户端请求，第二个参数值为一个http.ServerResponse对象，代表一个服务器端响应对象。
    return: 返回http.Server对象
*/

// 在创建了HTTP服务器之后，需要制定服务器所要监听的地址（可以为一个IP地址，也可以为一个主机名）及端口，这时，可以使用该HTTP服务器的listen方法，该方法的使用方式如下：
// server.listen(port[, hostname][, backlog][, callback])
/*
	port: 用于指定需要监听的端口号，参数为0时，将为HTTP服务器分配一个随机端口号
    hostname: 用于指定需要监听的地址
    backlog: 一个整数值，用于指定位于等待队列中的客户端链接的最大数量，一旦超过这个连接数，链接就会被拒绝。
    callback: 用于指定listening事件触发时调用的灰调函数，该回调函数中不使用任何参数。如果不在该函数指定回调函数，我们可以监听http.Server对象的listening事件，指定其灰调函数达到相同的效果。
*/

// 关闭HTTP服务器
// server.close([callback])
// 当服务器被关闭时，将会触发http.Server对象的close事件，回调函数指定HTTP服务器关闭后，所需要做的事情。

// 在对HTTP服务器指定需要监听的地址及端口时，如果地址及端口已被占用，将产生一个错误代码为“EADDRINUSE”的错误，同时触发HTTP服务器的error事件，可以通过对error事件设置回调函数的方法来指定该错误产生时所需要执行的处理。
/*
	server.on("error", function(err){
  		if(err.code == "EADDRINUSE"){
  			// 指定端口被占用时所需执行的处理
		}
	})
*/

// 在默认情况下，客户端与服务器端每进行一次HTTP操作，都将建立一次链接，客户端与服务器端之间的交互通信完成后该连接就被中断。在HTTP1.1中，添加了“Connection: keep-alive”信息，则HTTP连接将继续保持，客户端可以继续通过相同的连接向服务器发送请求。
// 在Node.js中，当客户端与服务器端建立连接时，触发HTTP服务器对象的connection事件，可以监听该事件并在该事件触发时调用的回调函数中指定当连接建立时所需要执行的处理，方法如下：
/*
	server.on("connection", function(socket){
  		// 回调函数代码
	})
*/

// 可以使用HTTP服务器的setTimeout方法来设置服务器的超时时间。当超过该超时时间之后，客户端不可继续利用本次与HTTP服务器建立的连接，下次向该HTTP服务器发出请求时必须重新建立连接。
// server.setTimeout(msecs, callback)
/*
	msecs: 指定服务器的超时时间，单位为毫秒
    callback: 设置当服务器超时时调用的回调函数，在回调函数中可以使用一个参数，参数值为服务器端监听客户端请求的socket对象。你也可以通过监听server对象的timeout时间，通过设置其回调函数达到同样的效果。
    	server.on("timeout", function(socket){
  			// 回调函数中代码
		})

    另外，HTTP服务器拥有一个timeout属性，属性值为整数，单位为毫秒，可以查看或修改服务器的超时时间。
*/
```



###获取客户端请求信息

``` javascript
// HTTP服务器接收到客户端请求时调用的回调函数中的第一个参数值为一个http.IncomingMessage对象，该对象由http.Server和http.ClientRequest创建，分别存在于request事件和response事件的回调函数的第一个参数中。该对象用于读取请求流中的数据。因此当从请求流中读取到新的数据时触发data事件，当读取完请求流中的数据时触发end事件。该对象被用于读取请求流中的数据时，该对象拥有如下所示的一些属性。
/*
	headers: 该属性值为客户端发送的请求头对象，其中存放了客户端发送的所有请求头信息，包括各种cookie信息以及浏览器的各种信息。
    httpVersion: 该属性值一个字符串，字符串值为客户端发送的HTTP的版本，值为:"1.0"或"1.1"
    method: 该属性为一个字符串，字符串值为客户端向服务器发送请求时使用的方法，例如:"GET", "POST", "PUSH", "DELETE"。存在于http.Server
    rawHeaders: 为请求/相应头list，注意，key和value在一个list中。所以，偶数项为key，奇数项为value
    rawTrailers: 形如rawHeaders
    statusCode: 响应的状态码。存在于http.ClientRequest
    statusMessage: 响应的状态信息。存在于http.ClientRequest
    trailers:该属性值为客户端发送的trailer对象。该对象中存放了客户端附加的一些HTTP头信息，该对象被包含在客户端发送的请求数据之后，因此只有当http.IncomingMessage对象的end事件被触发之后才能读取到trailer对象中的信息
    url: 该属性值为客户端发送请求时使用的URL参数字符串，例如:"/", "/index.html?p=1", "/index.html?p=1#share"。存在于http.Server
    socket: 该属性值为服务器端用于监听客户端请求的socket对象。
*/

// http.METHODS
// 为HTTP所支持的方法的列表

// http.STATUS_CODES
// 为所有HTTP状态码与状态信息的合集。例如：http.STATUS_CODES[404] === "Not Found"
```



###转换URL字符串与查询字符串

``` javascript
// 在Node.js中，提供了一个url模块和一个Query String模块，分别用来转化完整的URL字符串与URL中的查询字符串。接下来，对Query String模块进行介绍。
// 在一个完整的URL字符串中，从"?"字符之后（不包括"?"字符）到"#"字符之前(如果存在"#"字符)或者到该URL字符串的结束(如果不存在"#"字符)的这一部分称为查询字符串。例如:"http://google.com/user.php?userNmae=Luingniu&age=40#share"这个完整的URL字符串中，"userNmae=Luingniu&age=40"就是查询字符串

// querystring.parse(str[, sep][, eq][, options])
/*
	str: 用于指定被转换的查询字符串
    sep: 指定该查询字符串的分隔符，默认为“&”
    eq: 指定查询字符串中的分配字符，默认为“=”
    options: 为一个对象
    	maxKeys: 整数，指定转换后的对象中属性个数。如果为0，其效果等同于不使用maxKeys属性值。
*/

// querystring.stringify(obj[, sep][, eq][, options])
/*
	obj: 用于指定被转换的对象
    sep: 用于指定查询字符串中所使用的分隔符，默认为"&"
    eq: 用于指定查询字符串中使用的分配字符，默认为"="
    options: 为一个对象
    	encodeURIComponent: 该属性用于将字符串进行非utf8格式进行编码。例如：

    querystring.stringify({ w: '中文', foo: 'bar' }, null, null,
  { encodeURIComponent: gbkEncodeURIComponent }) // 'w=%D6%D0%CE%C4&foo=bar'
*/

// 可以使用parse方法将URL字符串转化为一个对象，根据URL字符串中的不同内容，该对象中可能拥有的属性及其含义如下：
/*
	href: 被转化的原URL字符串
    protocal: 客户端发送的请求时使用的协议
    slashes: 在协议与路径中间是否使用"//"分隔符
    host: URL字符串中的完整地址及端口号，该地址可能为一个IP地址，也可能为一个主机名。为hostname与port的结合
    auth: URL字符串中的认证信息部分
    hostname: URL字符串中的完整地址，该地址可能为一个IP地址，也可能为一个主机名
    port: URL字符串中的端口号
    pathname: URL字符串中的路径，不包含查询字符串，不包含hash
    search: URL字符串中的查询字符串，包含起始字符"?"
    path: URL字符串中的路径，包含查询字符串，不包含hash
    query: URL字符串中的查询字符串，不包含起始字符"?"
    hash: URL字符串中的散列字符串，包含起始字符"#"
*/
// 例如:
url.parse("tcp://129.168.1.1:3991/home/register.html?name=tom&age=41#share", true)
/*
{
  protocol: 'tcp:',
  slashes: true,
  auth: null,
  host: '129.168.1.1:3991',
  port: '3991',
  hostname: '129.168.1.1',
  hash: '#share',
  search: '?name=tom&age=41',
  query: { name: 'tom', age: '41' },
  pathname: '/home/register.html',
  path: '/home/register.html?name=tom&age=41',
  href: 'tcp://129.168.1.1:3991/home/register.html?name=tom&age=41#share' }
*/ 
url.parse("//home/register.html?name=tom&age=41#share", true)
/*
{
  protocol: null,
  slashes: null,
  auth: null,
  host: null,
  port: null,
  hostname: null,
  hash: '#share',
  search: '?name=tom&age=41',
  query: { name: 'tom', age: '41' },
  pathname: '//home/register.html',
  path: '//home/register.html?name=tom&age=41',
  href: '//home/register.html?name=tom&age=41#share' }
*/
url.parse("//home/register.html?name=tom&age=41#share", true, true)
/*
{
  protocol: null,
  slashes: true,
  auth: null,
  host: 'home',
  port: null,
  hostname: 'home',
  hash: '#share',
  search: '?name=tom&age=41',
  query: { name: 'tom', age: '41' },
  pathname: '/register.html',
  path: '/register.html?name=tom&age=41',
  href: '//home/register.html?name=tom&age=41#share' }
*/ 

// url.format(urlObj) 将对象还原成URL字符串
```



###发送服务器端响应流

``` javascript
// 在createServer方法的参数值回调函数或服务器对象的request事件函数中的第二个参数值为一个http.ServerResponse对象，可以利用该对象发送服务器端响应流。

// response.writeHead(statusCode[, statusMessage][, headers]) 发送响应头信息
/*
	statusCode: 指定三位的HTTP状态码
    statusMessage: 一个字符串，用于指定对于状态码的描述信息
    headers: 为一个对象，用于指定服务器端创建的响应头对象。该对象包含一些常用的字段：
    	Content-Type: 用于指定内容的类型
        Location: 用于将客户端重定向到另一个URL地址
        Content-Disposition: 用于指定一个被下载的文件名
        Content-Length: 用于指定服务器端相应内容的字节数
        Set-Cookie: 用于在客户端创建一个cookie
        Content-Encoding: 用于指定服务器端相应内容的编码方式
        Cache-Control: 用于开启缓存机制
        Expires: 用于指定缓存的过期时间
        Etag: 用于指定当服务器端响应内容没有变化时不重新下载数据

       	当有跨域数据操作，需要在HTTP相应头中添加"Access-Control-Allow-Origin"字段，并且将参数值指定为允许向服务器请求数据的域名+端口号（省略端口号，将允许该域名下的任何端口向服务器请求数据）
        res.writeHead(200, {"Access-Control-Allow-Origin": "http://localhost"});
*/

// 如果不使用writeHead方法设置响应头信息，我们可以使用setHeader函数
// response.setHeader(name, value) 为一个确切的头指定信息具体内容
/*
	response.setHeader('Content-Type', 'text/html');
    response.setHeader('Set-Cookie', ['type=ninja', 'language=javascript']);
*/

// response.getHeader(name) 获取已经设置的响应头信息

// response.removeHeader(name) 删除已经设置的响应头信息,必须在使用response.write方法之前调用

// response.headersSent 该属性值为布尔值，当头信息发送完毕，返回true。否则返回false。

// response.finished 该属性值为布尔值，调用response.end()方法之后，返回true。开始为false。

// 当writeHead方法被调用之后，相应头信息就被发送了。但当未调用writeHead设置头信息，而是用setHeader方法，这时候，当调用write方法时，头信息就被发送了。

// response.sendDate 该属性值为布尔值
// 在默认情况下，HTTP服务器会自动将服务器当前时间作为响应头的Date字段值发送给客户端。可以通过将http.ServerResponse对象的sendDate属性值设置为false的方法在响应头中删除Date字段

// response.statusCode 获取响应头的状态码，或者设置响应头状态码（如果头信息不是使用writeHead方法设置的话）

// response.statusMessage 获取响应头状态信息，或者设置响应头状态信息（如果头信息不是使用writeHead方法设置的话）

// response.addTrailers(headers) 在响应数据的尾部追加一个头信息。
/*
	在使用addTrailers方法时，相应流必须使用分块编码方式。如果客户端使用HTTP版本为1.1以上（包括1.1），则响应流自动设置为分块编码方式。如果客户端使用HTTP1.0版本，则addTrailers方法将不能生效
    如果需要使用addTrailers方法，则必须在响应头中添加Trailer字段，并且将字段值设置为追加的响应头中所指定的字段名，代码如下：
        response.writeHead(200, {"Trailer": "Content-MD5"});
        response.write("数据");
        response.addTrailers({'Content-MD5': "isdj823rifu87a92873042i3fno3"});
        response.end();
*/

// response.setTimeout(msecs, callback) 设置响应的超时时间
// 如果不指定回调函数，则会在超时的时候没关闭与客户端的socket端口。
// socket将不会被关闭
server = http.createServer(function(req, res){
  if(req.url !== "/favicon.ico"){
    res.setTimeout(1000);
    res.on("timeout", function(){
      console.log("相应超时!");
    });
    setTimeout(function(){
      res.writeHead(200, {
        "Content-Type": "text/html"
      });
      res.write("<html><header><meta charset='utf-8' </header></html>");
      res.write("你好");
      res.end();
    }, 2000);
  }
}).listen(1337, "localhost");
// socket将被关闭
server = http.createServer(function(req, res){
  if(req.url !== "/favicon.ico"){
    res.setTimeout(1000);
    setTimeout(function(){
      res.writeHead(200, {
        "Content-Type": "text/html"
      });
      res.write("<html><header><meta charset='utf-8' </header></html>");
      res.write("你好");
      res.end();
    }, 2000);
  }
}).listen(1337, "localhost");

// 在http.ServerResponse对象的end方法被调用之前，如果连接中断，将触发http.ServerResponse对象的close事件。
```





##HTTP客户端

###向其他网站请求数据

```javascript
// http.request(options[, callback]) 可以使用该方法向其他网站请求数据。
/*
	options: 为一个对象或字符串，用于指定请求的目标的URL地址，如果参数为字符串，将自动使用url.parse()方法转化为一个对象。对象拥有以下属性:
    	host: 用于指定域名或主机IP地址，默认"localhost"
        hostname: 用于指定域名或主机IP地址，默认"localhost"。如果host与hostname属性值都被指定，优先使用hostname
        port: 用于指定目标服务器用于HTTP客户端连接的端口号。
        localAddress: 用于指定专用于网络链接的本地接口
        socketPath: 用于指定目标Unix域端口
        method: 用于指定HTTP的请求方式，默认为"GET"
        path: 用于指定请求路径及查询字符串，默认属性值为"/"
        headers: 用于指定客户端请求头对象
        auth: 用于指定认证信息部分，例如"user: password"
        agent: 用于指定HTTP代理。在Node.js中，使用http.Agent类代表一个HTTP代理。所谓的HTTP代理，就是一个代表通过HTTP向其他网站请求数据的浏览器或者代理服务器。在Node.js中，HTTP代理默认在请求数据时使用keep-alive连接(Connection: keep-alive)，同时使用一个全局的http.Agent对象来实现所有HTTP客户端请求。不使用agent属性值时，默认使用该全局http.Agent对象。可以为agent属性值显示指定一个http.Agent对象（即用户代理），也可以通过将agent属性值设定为false的方法从连接池中自动挑选一个当前连接状态为关闭(Connection: close)的http.Agent对象（即用户代理）。

    callback: 回调函数，为该函数返回的http.ClientRequest对象的response事件的回调函数。如果不指定该值，可以指定返回对象的response事件的回调函数，从而达到相同的效果。
    	funcion(response){...}  response对象为一个http.IncomingMessage对象。
*/

// request.write(chunk[, encoding][, callback]), request.end([data][, encoding][, callback])

// request.end([data][, encoding][, callback])

// request.abort() 终止本次请求

// 如果在向目标网站请求数据的过程中发生了错误，将触发http.ClientRequest的error事件
// request.on("error", function(err){.....})

// 在建立连接的过程中，当为连接分配端口时，触发http.ClientRequest对象的socket事件，可以通过对改时间的监听并且指定事件回调函数的方法来指定当分配端口时所需要执行的处理。
// request.on("socket", function(socket){....})

// socket.setTimeout(msc, callback) 指定超时时间
// 例如:
req.on("socket", function(socket){
  socket.setTimeout(1000);
  socket.on("timeout", function(){
  	req.abort();
  })
})
// socket端口超时，将触发"ECONNRESET"错误

// request.setTimeout(timeout[, callback])

// http.get(options[, callback]) 最常用的是GET请求，这是一个发送GET请求的方便方法
```



###向本地服务器请求数据

```javascript
// HTTP服务器
var http = require("http");
var server = http.createServer(function(req, res){
  if(req.url !== "/favicon.ico"){
  	req.on("data", function(data){
      console.log("服务器端接受到的数据: "+data);
      res.write("确认数据: "+data);
	});
    req.on("end", function(){
      res.addTrailers({"Content-MD5": "sdkfn239rf02i-31kmf1-2ked2"});
      res.end()
	});
  }
}).listen(1337, "127.0.0.1");

// HTTP客户端
var http = require("HTTP");
var options = {
  hostname: "127.0.0.1",
  port: 1337,
  path: "/",
  method: "POST"
}
var req = http.request(options, function(res){
  res.on("data", funciton(data){
  	console.log("客户端接收到的数据： "+data);
  });
  res.on("end", function(){
    console.log("Trailer头信息: %j", res.trailers);
  });
});
```



###制作代理服务器

```javascript
// 代理服务器制作示例
var http = require("http");
var server = http.createServer(function(req, res){
    var options = {
        hostname: "www.imooc.com",
        port: 80,
        path: req.url,
        method: "GET",
        headers: req.headers
    };
    var request = http.request(options, function(response){
        res.writeHead(response.statusCode, response.statusMessage, response.headers);
        response.pipe(res);
    });
    req.pipe(request);
});
server.listen(1337, "localhost");
```





##创建HTTPS服务器与客户端

在Node.js中，提供了一个`https`模块，专用于创建HTTPS服务器与客户端。HTTPS服务器与HTTP服务器的区别在于:

1. HTTPS服务器使用HTTPS协议，而HTTP服务器使用HTTP协议。

2. HTTPS服务器需要向证书授证（Certificate Authority）中心申请证书，一般免费证书很少，需要交费。在少许对客户端有要求的情况下，也会要求客户端使用证书。

3. HTTP服务器与客户端之间传输的是文明数据，而HTTPS服务器与客户端之间传输的是经过SSL安全加密后的密文数据。

4. HTTP服务器通常使用80端口或8080端口，而HTTPS服务器使用的是443端口。

   ​

   在实际场景中，私钥与公钥都保存在服务器端，在服务器与客户端相互确认彼此身份之前，公钥会传送到客户端，客户端随机发送消息给服务器端，服务器端拿到收到的字符计算成Hash值后用私钥加密再传送给客户端；客户端收到数据后用之前收到的公钥解密，解密后把之前随机发出的消息也计算成hash值，检查是否一致；如果一致，那么握手成功，客户端选择一个加密算法和相应密匙并用公钥加密后，送给服务器端；服务器端接受到加密算法和密匙后，也就可以正式沟通数据了。

​	

​	

##创建HTTPS服务器

后期追加....