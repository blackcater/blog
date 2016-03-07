#Node.js核心模块之Buffer模块

[TOC]

##教学大纲

1. 如何在Node.js中创建Buffer对象
2. 如何在Node.js中计算字符串的长度以及缓存区的长度
3. 如何在Node.js中实现Buffer对象与字符串之间的相互转换
4. 如何在Node.js中实现Buffer对象与数值对象之间的相互转换
5. 如何在Node.js中实现Buffer对象与JSON对象之间的相互转换
6. 如何在Node.js中实现将一个Buffer对象中保存的二进制数据复制到另外一个Buffer对象中
7. Node.js中的Buffer类的所有类方法以及如何实现这些类方法

##创建Buffer对象

``` javascript
// Buffer类似全局类，并不需要进行手动的引入。Buffer类有3种形式的构造函数
var buf = new Buffer(size); // 只需要将缓存区大小（以字节为单位）指定为构造函数的参数
// 被创建的Buffer对象拥有一个length属性，属性值为缓存区的大小
buf.fill(value[, offset][, end]); // offset默认为0，表示buf开始，end默认为buf.length表示结尾

var array = [2, 11, 23];
var buf = new Buffer(array); // 用数组生成Buffer对象,数组必须是数字，且数字会被转成16进制

var buf = new Buffer(str[, encoding]); // 将字符串初始化缓存区，编码默认为"utf8",编码还支持"ascii", "base64", "hex"
```



##字符串的长度与缓存区的长度

``` javascript
// 我们都知道，字符串有一个length属性，表示字符串的长度，buffer的length表示对象空间大小
var buf = new Buffer("我爱编程");
console.log(buf.length); // 12 因为是uft8编码，中文3个字节
buf[2]; // 获取buffer空间中索引为2（第3位）的值
buf.slice([start[, end]]); //start默认为0，end默认为buf.length。负值则倒数
// 注意：slice得到的新的buf是原来buf的部分的引用，所以，如果你修改原来的buf或修改新的buf则会造成数据的不一致
```



##Buffer对象与字符串之间的相互转换

``` javascript
buf.toString([encoding][, start][, end]); // 编码默认是uft8，start默认为0， end默认为buf.length

buf.write(string[, offset][, length][, encoding]); // offset默认为0，length默认为(buf.length-offset)，encoding默认为utf8。
// 注意：如果空间不够，将只会写取字符串的部分数据

//使用StringDecoder对象，使用前需要引入require(string_decoder)
var StringDecoder = require("string_decoder").StringDecoder;
//创建StringDecoder对象
var decoder = new StringDecoder([encoding]);// 默认为utf8
decoder.write(buf); // 将buf对象中的数据转化为字符串
/* 
StringDecoder的使用环境是当需要将多个Buffer对象中二进制数据转化成字符串输出的时候有用。有时候由于多个Buffer对象中字符串个数不完整会输出乱码，我们可以通过2种方式处理
// 方法一
Buffer.concat(buf1, buf2).toString();
// 方法二 好像有缓存区一样，将数据缓存起来，在下次调用decoder的时候，会使用
decoder.write(buf1);
decoder.write(buf2);
*/
```



##Buffer对象与数值对象之间的相互转换

``` javascript
// write系列函数与read系列函数
// 函数讲解
writeXXXX(value, offset[, noAssert]); // value为要写入Buffer对象的数值;offset为偏移值;noAssert为boolean值，默认为false表示有错误提示
// 8/16/32表示value需要的数值个数，8表示8位，这是0x__，同理16位为0x____依次类推
// float/double表示32/64位
// U表示无符号
// BE/LE BE表示Big Endian 从低位到高位; LE表示Little Endian 从高位到低位
readXXXX(offset[, noAssert]); // 读取值
```



##Buffer对象与JSON对象之间的相互转换

``` javascript
var buf = new Buffer("我爱编程");
var jsonStr = JSON.stringify(buf); // 将Buffer对象中保存的数据转换为一个字符串，形如'[230, 11, 9, 143, 79....]'
var jsonBuf = JSON.parse(jsonStr); // 将字符串转成一个数组，形如[230, 11, 9, 143, 79....]
var copy = new Buffer(jsonBuf); // Buffer对象

buf.copy(targetBuffer[, targetStart][, sourceStart][, sourceEnd]); // targetStart默认为0; sourceStart默认为0; sourceEnd默认为buf.length。用于将buffer数据从一个对象拷贝到另一个对象

// 类方法
Buffer.byteLength(string[, encoding]); // 获取字符串编码后的长度
Buffer.isBuffer(obj); // 判断一个对象是否为一个Buffer对象
Buffer.concat(list[, totalLength]); // list表示Buffer对象的数组列表，totalLength表示连接后的Buffer对象的长度。
// 注意：如果list为空或者totalLength为0，则返回0长度的Buffer对象；提供totalLength将会提升性能
Buffer.isEncoding(encoding); // 用于检测一个字符串是否为一个有效的编码格式的字符串

// 其他常用方法
buf.entries();
buf.keys();
buf.values();
buf.copy(targetBuffer[, targetStart][, sourceStart][, sourceEnd]); // 复制Buffer对象
buf.equals(otherBuffer); // 判断Buffer对象是否相等
buf.fill(value[, offset][, end]); // 
buf.indexOf(value[, byteOffset]); // 与Array#indexOf()用法相似
buf.slice([start[, end]]); // 切片，截取对象一部分
```