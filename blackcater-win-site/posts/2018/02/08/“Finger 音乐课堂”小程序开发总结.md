---
title: “Finger 音乐课堂”小程序开发总结
cover: https://image.finger66.com/website-banner1.jpg
date: 2018-02-08
tags: [小程序]
category: tech
---

> 小程序已经有1年多时间了吧！从刚出来我就在关注，当时小程序写个组件，需要使用 `<template is="" data="" />` 这样的形式来复用组件。非常的不直观。从 1.6.3 之后，小程序已经支持了新的[自定义组件](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/custom-component/)的方式，这也使得小程序的开发更为简单了。依托于微信强大的用户数量，微信小程序很有可能成为新的一端（前端，iOS端，Android端）。

<p align="center"><img style="width: 129px; height: 129px;" src="/images/2018/02/08/miniprogram.jpg" /></p>
<p align="center"><strong>微信扫描👆二维码，立即查看效果</strong></p>

## 技术选型

很早之前体验过小程序，其极差开发体验和极低的效率一直被我诟病。但是很久已经没有关注小程序了。所以这次接到需求之后，首先进行了一些调研，希望可以让自己开发体验和开发效率变高的解决方案。

有一个项目进入了眼帘：[wepy](https://github.com/Tencent/wepy)。这个项目由腾讯团队维护，是一个让小程序支持组件化开发的框架，有着类似于 vue 的写法等等优点。听上去十分不错是不是？这种有着 vue 写法的开源项目也有许多，比方说 [weex](https://github.com/alibaba/weex)。然而 weex 是完全是 vue 的写法。wepy 只是**类似**。**类似**就意味着有些许的不同，可能会让你感到意想不到，因为需求紧迫，无法确保接入后不会影响自己的工期，并且 wepy 本身在打包之后也会占用体积，最终要的是现在小程序已经支持了[自定义组件](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/custom-component/)功能，体验也还不错，所以感觉并没有需要接入 wepy 的必要。

因此最后，我们没有用任何框架来写小程序，虽然其间也遇到了一些开发上体验不好的地方，但我们通过另一中方式解决了（后面会介绍）。

## 核心功能

“Finger 音乐课堂” 小程序功能比较多，有完整的服务履行功能。

### 登录

### mixin

### page-loading

### 搜索

### IM

### 直播

### 分包


## 总结
