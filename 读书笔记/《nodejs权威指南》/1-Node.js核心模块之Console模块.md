## Node.js核心模块之Console模块

**console.assert(value\[, message\]\[, .....\])**

与`assert.ok()`相似，但是错误信息被像是`util.format(message...)`那样格式化输出。



**console.dir(obj\[, options\])**

options: 

> showHidden: 是否显示不可递归的属性，默认为false(不显示)
> 
> depth: 递归查询的深度，默认为2，最顶层为0，全部查询为null
> 
> colors: 结果有颜色， 默认false



**console.error()和console.warn()**

警告程度不同



**console.log()**

形式有点像Python的`print()`，其中%d, %s, %%表示数字，字符串以及%号本身.



**console.trace()**

显示当前位置的栈信息



**console.time()和console.timeEnd()**

用于记录一段代码执行开始于结束时间，参数为独一无二的字符串标志，第一次调用	`console.time(label)`将开始计时，再次调用`console.timeEnd(label)`将停止计时。