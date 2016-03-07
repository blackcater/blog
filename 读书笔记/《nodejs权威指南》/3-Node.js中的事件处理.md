#Node.js中的事件处理

[TOC]

##EventEmitter类

在Node.js的用于实现各种事件处理的event模块中，定义了一个EventEmitter类。所有可能触发事件的对象都是一个继承了EventEmitter类的子类的实例对象，在Node.js中，为EventEmitter类定义了许多方法，所有与对象事件函数的绑定及解除相关的处理均依靠这些方法调用来执行。

​						



​                                            **EventEmitter类的各种方法**

​	

​	

​	

|             方法名与参数              |           描述           |
| :-----------------------------: | :--------------------: |
|  addListener(event, listener)   |     对指定事件绑定事件处理函数      |
|       on(event, listener)       | 对指定事件绑定事件处理函数（上面方法的别名） |
|      once(event, listener)      |  对指定事件绑定只执行一次的事件处理函数   |
| removeListener(event, listener) |     对指定事件解除事件处理函数      |
|   removeAllListener([event])    |    对指定事件解除所有事件处理函数     |
|       setMaxListeners(n)        |  指定事件处理函数的最大数量。n为整数。   |
|        listeners(event)         |    获取指定事件的所有事件处理函数     |
|     emit(event[, arg.....])     |        手动触发指定事件        |