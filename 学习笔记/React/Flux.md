# Flux

[TOC]

## 简介

Flux应用有3个主要的部分：dispatcher, stores和views(React components). 这个概念不要和MVC相混淆了。Flux应用中不存在Controller，但是他们却是controller-views模式(views通常在层级的最上面，它从stores获得数据然后传递数据到子级中)。另外action creators(dispatcher helper methods)被使用去支持一个语义化的用于描述应用中可能发生改变的API。它是有用的去把他当做Flux更新周期中的第四部分。

Flux不采用MVC而是采用一种单向数据流。当用户和React View进行交互时，该view传递一个action穿过central dispatcher，到各种stores(其中存储了应用的数据和业务逻辑)，然后就更新了所有被影响到的视图。这种模式工作的很好在使用React所使用的编程风格时，这种编程风格允许store发送更新没有特定说明如何在状态间转换views。

## 数据流和结构

Flux应用数据流是单向的：

![flux-simple-f8-diagram-1300w](./images/flux-simple-f8-diagram-1300w.png)

上图是Flux编程的精神思想。Dispatcher, Stores, Views是独立的节点有着不同的输入和输出。Actions是简单的对象，其中包含了新数据和一个特定类型的属性值。

Views可能会造成一个新的Action被传入到系统中以相应用户交互。

![flux-simple-f8-diagram-with-client-action-1300w](./images/flux-simple-f8-diagram-with-client-action-1300w.png)

所有的数据都会流过Dispatcher，其作为一个中心枢纽。Actions被提供给Dispatcher，要么从一个action creator 方法中得到，要么大多数时候是来自用户和views之间的交互。Dispatcher然后调用stores已经在dispatcher注册的回调函数，分发actions到所有的stores。在这些注册的回调函数中，stores响应任何一个和他们所维护的状态相关的actions。Stores然后出发一个change事件来警告controller-views一个数据层面的改变发生了。controller-views监听这些事件然后在事件处理函数中取得来自于stores的数据。Controller-views调用他们自己的`setState()`方法，从而造成自身重新渲染和他们在组件树种所有后代组件重新渲染。

![flux-simple-f8-diagram-explained-1300w](./images/flux-simple-f8-diagram-explained-1300w.png)

应用状态仅仅维护在stores中，这保证了应用中不同部分的高度解耦性。发生在stores间的依赖关系以严格的层级的形式保存，被dispatcher管理进行同步的更新。

我们发现，双向数据绑定将导致级联更新，即一个对象的改变将导致另外一个对象的改变，这可能触发更多的更新。当应用变得越来越复杂的时候，这些级联更新将是很难预测到一个用户的交互江湖造成什么样的改变。当更新在一次循环中仅是改变数据，这个系统作为一个整体变得更能被预知。

## 单个Dispatcher

