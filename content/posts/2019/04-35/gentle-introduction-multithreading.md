---
title: 多线程简介（翻译）
cover: cover.png
author: blackcater
date: 2019-04-25
series: concurrent-secrets
tags: [translation]
---

现代计算机可以同时执行多个操作。在先进的硬件和智能的操作系统的支持下，该特性使得你的程序在执行速度和响应速度上都更加的快。

开发出这种功能的软件，即让人着迷又让人头疼：它要求你要知道计算机底层到底发生了什么。在这第一章里，我将尝试去揭露线程的秘密，它是计算机所提供的用于实现该种功能的工具之一。让我们开始吧！

<!-- end -->

> 原文来自：[https://www.internalpointers.com/post/gentle-introduction-multithreading](https://www.internalpointers.com/post/gentle-introduction-multithreading)

## 进程和线程：以正确的方式命名事物

现代操作系统可以同时运行多个程序。这就是你为何能读这这片文章（一个程序）与此同时有能使用你的播放器听音乐（另一个程序）的原因。每个程序都是一个正在执行的**进程（Process）**。操作系统有许多软件方式可以使一个进程和其他进程同时运行，操作系统也可以利用底层硬件实现。无论哪种方式，最终的你看到的效果就是所有的软件在同时运行。

在操作系统这哦功能运行进程并不是同时执行多个操作的唯一途径。每个进程都可以在其内部同时运行子任务，叫**线程（Thread）**。你可以将线程视为进程的一部分。每个进程在启动时至少出发一个线程，叫**主线程（Main Thread）**。随后，根据程序或程序员的需要，额外的线程将被开始或终止。**多线程（Multithreading）**就是在单个进程中运行多个线程。

例如说，你的播放器可能运行这多线程：一个线程来渲染界面——这个线程通常是主线程，另一个线程来播放音乐等等。

你可以将操作系统理解为可以存储多个进程的容器，每个进程又是一个可以存储多个线程的容器。在这篇文章，我将仅仅聚焦于线程，但是整个话题是令人着迷的，值得后续深入分析研究。

![processes-threads.png](https://cdn.nlark.com/yuque/0/2019/png/93017/1555906213257-2f15ca30-0d26-47e6-9647-daf0dbd9dbc2.png#align=left&display=inline&height=327&name=processes-threads.png&originHeight=263&originWidth=600&size=6112&status=done&width=746)

### 进程和线程的区别

每个进程具有由操作系统分配的独立的一块内存。默认情况下，这块内存是不可与其他进程共享的：你的浏览器没有权限访问播放器的内存，反之亦然。如果你运行相同进程的两个实例，比方说打开浏览器两次，这也是一样的情况。操作系统将每个实例当作一个新的进程，被分配独立的一部分内存。因此，默认情况下，两个或多个进程是没办法共享数据的，除非它们使用高级技巧——叫做**进程间通信（IPC，Inter-process Communication）**。

不像进程，线程共享着由操作系统分配给其父进程的共同的一块内存：播放器主页面上的数据可以被音频引擎轻松访问到，反之亦然。因此，两个线程更为容易通信。最为重要的是，线程通常比进程更为轻量：它们占用的资源更少，创建的速度更快，这就是为何它们被称为**轻量级（Lightweight）**的进程。

线程是使程序同时执行多个操作的便捷方式。如果没有线程，你就需要为每个任务写个程序，以进程方式运行它们，然后通过操作系统进行同步。这将是更为的困难（IPC 很棘手）和慢（进程比线程更重）。

### 绿色线程或者叫纤程

到目前为止所提到的线程都是操作系统的东西：进程想要创建一个新的进程必须告诉操作系统。但并非每个平台都原生支持线程。**绿色线程（Green Thread）**（也叫**纤程（Fiber）**）是一种模拟技术，可以让多线程程序在不提供该功能的环境下也能运行。例如，如果底层操作系统没有原生线程支持，虚拟机则可能会实现绿色线程。

绿色线程可以更快的被创建和管理，因为它们完全绕过了操作系统，但是也是有缺点的。我将会在下章讨论这个话题。

“绿色线程”名字由来于 Sun Mocrosystem 的 Green Team，它在 90 年代设计了 Java 最初的线程库。现今，Java 已不再使用绿色线程：他们于 2000 年切回到了原生线程。其他的编程语言，例如 Go，Haskell，Rust 等，有这类似于绿色线程的实现来替代原生线程。

## 线程用来干什么？

为何进程应该使用多线程？正如前面提到的，并行的做事可以大大加快速度。假如你要在视频编辑器中渲染一个视频。编辑器可能足够聪明， 会让多个线程来执行渲染操作，每个线程处理视频的一部分。因此，假设一个线程需要花费 1 小时，两个线程则只花费 30 分钟，四个线程则仅花费 15 分钟，依此类推。

真的这么简单么？这里有三点需要考虑：

1. 并非每个程序都需要多线程。如果你的应用是执行顺序操作，或者总是等待用户来操作，那么多线程并没有太多益处。
1. 不要创建过多线程使程序更快：每个子任务必须为并行操作仔细思考和设计。
1. 并不能百分百确定线程会并行执行操作，这还得取决于底层硬件。

最后一条是至关重要的：如果你的电脑不支持同时执行多个操作，则操作系统不得不伪造。我们将快速看看这到底是怎么一会是。首先，我们先把**并发（Concurrency）**视为认知上的多任务同时执行，**真正的并行（True Parallelism）**视为多任务真正的同时执行。

![concurrency-parallelism.png](https://cdn.nlark.com/yuque/0/2019/png/93017/1556073510759-b6e68214-6d65-457f-8a3c-f6096bc01ecd.png#align=left&display=inline&height=240&name=concurrency-parallelism.png&originHeight=240&originWidth=240&size=8410&status=done&width=240)<br />并发与真正的并行

## 什么使得并发和并行成为可能？

你的计算机中的**中央处理器（CPU）**承担着运行程序的繁重任务。它是由多个部分组成的，最重要的一个部分叫做**核芯（内核，Core）**：计算真正执行的地方。一个核芯只能同时执行一个操作。

这当然算是一个大缺点。由于这个原因，操作系统开发了先进的技术来让用户有能力一下执行多个进程（或线程），尤其在图形环境中，甚至是单核机器上。其中最重要的一个技术叫**抢占式多任务（Preemptive Multitasking）**，**抢占式（Preemption）**就是有能力中断一项任务，切换到另一项任务并在之后继续执行原任务。

如果你的 CPU 只有一个核芯，操作系统的部分工作就是将单个核芯的计算能力分散给多个进程或线程，在循环中一个一个的执行。这种操作给你一种不止一个程序在并行执行，或一个程序同时执行多件事（如果是多线程程序）的假象。并发就是如此，但是并行——可以同时运行多个进程的能力——仍未清楚。

现如今的 CPU 在底层都不止一个核芯，同一时间，每个核芯执行着独立的任务。这就意味着两个或更多的核芯可以实现真正意义上的并行。例如，我的英特尔酷睿 i7（Intel Core i7） 有四个核芯：它可以同时运行四个不同的进程或线程。

操作系统可以检测出 CPU 有多少核芯并为它们每个指派进程或线程。一个线程可以被操作系统随意分配给任一核芯，这种调度对运行着的程序来说是完全透明的。另外，抢占式多任务可在所有核芯都繁忙的时候其作用。这样你就可以运行远多于机器上核芯数目的进程或线程。

### 单核上的多线程应用：是否有意义？

单核机器上是不可能实现真正意义上的并行。尽管如此，如果你的应用能从中获益，开发多线程应用仍然有意义。当一个进程使用许多线程，强占式多任务能使应用在其中某个进程执行缓慢或阻塞的任务下，仍能正常的运行。

举例来说明，假如你正在开发一个从奇慢无比的磁盘读取数据的桌面应用。如果你使用单线程开发这个程序，整个应用将会卡住，直到从磁盘读取数据操作完成：等待磁盘唤醒时浪费了分配给线程的计算能力。当然，操作系统不止运行着这一个进程，但是你的这个应用不会有任何进展。

让我们以多线程的角度重新思考你的应用。线程 A 负责磁盘访问，同时线程 B 负责主界面。如果线程 A 阻塞（由于磁盘读写很慢），线程 B 仍然能运行，保证你的程序有响应。这是可能的，因为有两个线程，操作系统可以在线程间切换 CPU 的计算资源而不会卡在较慢的线程上。

## 越多线程，越多问题

众所周知，线程共用着父进程中的一块内存。这就使得一个应用中两个或更多线程可以很容易的交换数据。例如：一个视频编辑器可能具有包含视频时间线的一大部分的共享内存。这片共享内存被设计用来将视频渲染到文件中的多个工作线程读取。它们仅仅需要一个指向该内存的**句柄（Handle）**（例如：**指针（Pointer）**）以便从中读取数据并将渲染画面输出到磁盘里。

当两个或多个线程从同一个内存位置读取数据，一切看似都近乎完美。当它们中有一个从这片共享内存中写数据而其它线程正在从中读取数据时，麻烦就找上门来了。此时可能会出现两个问题：

1. **数据竞争（Data Race）**—— 当一个写线程修改内存，另一个读线程可能正在从中读取数据。如果写线程还没有完成它的工作，读线程可能会获取到损坏的数据。
1. **竞争状态（Race Condition）**—— 读线程应该仅在写线程写完之后才会读。如果相反的情况发生了呢？竞争状态是两个或多个线程以不可预期的顺序执行任务，而实际上操作应该以近乎完美的顺序执行以便正确完成任务。你的程序即使防范了数据竞争，仍可能会发生条件竞争。

### 线程安全的概念

一段代码如果能正常工作，即使多个线程同时执行这段代码也没发生数据竞争和竞争状态，我们就叫这段代码是**线程安全（Thread-safe）**的。你可能已经注意到许多编程库都宣称自己是线程安全的：如果您正在编写多线程程序，并且希望确保任何其他第三方函数可以跨不同线程使用，而不会触发并发问题。

## 数据竞争的根本原因

我们都知道一个 CPU 核芯在任一时刻只能执行一个机器指令。这种指令被成为**原子指令（Atomic Instruction）**，因为其不可再分：它不能再分为更小的操作。希腊单词“atom”（ἄτομος; atomos）意思就是不可切分。

不可分割的特性使得原子操作本质上就是线程安全的。当一个线程执行在共享数据上执行原子写操作，没有其他线程能半途中读取修改信息。相反的，当一个线程在共享数据上执行原子读操作，它会读取单个事件点出现的整个数据。线程无法绕过原子操作，因此不会发生数据竞争。

坏消息是绝大多数的操作都是非原子操作。甚至在一些硬件上像 `x=1`  这样稀疏平常的操作也可能是由多个原子机器指令组合而成，这就使得分配本身整体上是一个非原子操作。因此，如果一个线程读 `x` 而另一个线程执行分配，这会发生数据竞争。

## 竞争状态的根本原因

抢占式多任务使得操作系统能够完全控制线程管理：它可以根据先进的调度算法来启动，停止和暂停线程。作为程序员，你无法控制执行时间和顺序。事实上，不能保证下面这么简单的代码：

```
writer_thread.start()
reader_thread.start()
```

会以特定的循序启动代码。跑这段程序多次，你会注意到每次的不同之处：有时候写线程先启动，有时候读线程先启动。如果你的程序需要写总是在读之前运行，那么你肯定会遇到竞争状态。

这种行为也叫做**不确定性（Non-deterministic）**：结果每次都会变，你无法预测它。调试发生竞争状态的软件是十分让人恼火的，因为您不能总是以可控方式重现问题。

## 教导线程和平相处：并发控制

数据竞争和竞争状态都是现实中会发生的问题：有些人甚至[因此死亡](https://en.wikipedia.org/wiki/Therac-25)。调节两个或更多并发线程的技术叫**并发控制（Concurrency Control）**：操作系统和编程语言提供了一些反感来处理它。最重要的是：

- **同步（Synchronization）**—— 一种确保一次只有一个线程能使用资源的方法。同步是将代码的特定部分标记为“受保护”，这样两个或多个并发线程就不会同时执行它，也就不会破坏共享数据；
- **原子操作（Atomic Operations）**——  由于操作系统提供了特殊的指令，许多非原子操作（如前面提到的分配操作）可以变成原子操作。这样，无论其他线程如何访问共享数据，共享数据始终保持有效状态；
- **不可变数据（Immutable Data）**——  共享数据被标记为不可变，没有任何东西可以更改它：线程只能从中读取，从根本上消除了竞争。正如我们所知，只要它们不修改它，线程可以安全地从相同的内存位置读取信息。这是就是函数式编程的重要思想。

在这个关于并发性的小系列的下一节，我将讲解这些让人着迷的话题。敬请期待！！

## 引用

8 bit avenue - [Difference between Multiprogramming, Multitasking, Multithreading and Multiprocessing](https://www.8bitavenue.com/difference-between-multiprogramming-multitasking-multithreading-and-multiprocessing/)<br />Wikipedia - [Inter-process communication](https://en.wikipedia.org/wiki/Inter-process_communication)<br />Wikipedia - [Process (computing)](https://en.wikipedia.org/wiki/Process_%28computing%29)<br />Wikipedia - [Concurrency (computer science)](https://en.wikipedia.org/wiki/Concurrency_%28computer_science%29)<br />Wikipedia - [Parallel computing](https://en.wikipedia.org/wiki/Parallel_computing)<br />Wikipedia - [Multithreading (computer architecture)](https://en.wikipedia.org/wiki/Multithreading_%28computer_architecture%29)<br />Stackoverflow - [Threads & Processes Vs MultiThreading & Multi-Core/MultiProcessor: How they are mapped?](https://stackoverflow.com/questions/1713554/threads-processes-vs-multithreading-multicore-multiprocessor-how-they-are)<br />Stackoverflow - [Difference between core and processor?](https://stackoverflow.com/questions/19225859/difference-between-core-and-processor)<br />Wikipedia - [Thread (computing)](https://en.wikipedia.org/wiki/Thread_%28computing%29)<br />Wikipedia - [Computer multitasking](https://en.wikipedia.org/wiki/Computer_multitasking)<br />Ibm.com - [Benefits of threads](https://www.ibm.com/support/knowledgecenter/en/ssw_aix_71/com.ibm.aix.genprogc/benefits_threads.htm)<br />Haskell.org - [Parallelism vs. Concurrency](https://wiki.haskell.org/Parallelism_vs._Concurrency)<br />Stackoverflow - [Can multithreading be implemented on a single processor system?](https://stackoverflow.com/questions/16116952/can-multithreading-be-implemented-on-a-single-processor-system)<br />HowToGeek - [CPU Basics: Multiple CPUs, Cores, and Hyper-Threading Explained](https://www.howtogeek.com/194756/cpu-basics-multiple-cpus-cores-and-hyper-threading-explained/)<br />Oracle.com - [1.2 What is a Data Race?](https://docs.oracle.com/cd/E19205-01/820-0619/geojs/index.html)<br />Jaka's corner - [Data race and mutex](http://jakascorner.com/blog/2016/01/data-races.html)<br />Wikipedia - [Thread safety](https://en.wikipedia.org/wiki/Thread_safety)<br />Preshing on Programming - [Atomic vs. Non-Atomic Operations](https://preshing.com/20130618/atomic-vs-non-atomic-operations/)<br />Wikipedia - [Green threads](https://en.wikipedia.org/wiki/Green_threads)<br />Stackoverflow - [Why should I use a thread vs. using a process?](https://stackoverflow.com/questions/617787/why-should-i-use-a-thread-vs-using-a-process)
