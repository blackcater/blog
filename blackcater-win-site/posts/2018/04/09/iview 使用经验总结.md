---
title: iview 使用经验总结
header: header.png
date: 2018-04-09
tags: [vue, iview]
category: tech
draft: true
---

> 最近开始接触 vue 和 iview。这次将最近使用的经验总结给大家，希望对刚接触 iview 的开发者有一定的帮助。

## 什么是 iview

iview 是基于 vue 开发的主题框架。其设计理念来源于 [Ant Design](https://ant.design/)。可以算是 Vue 中的 Ant Design。项目主要是由开发者 [icarusion](https://github.com/icarusion) 进行维护。

## iview 介绍

### 组件

在 iview 中，一些组件需要同时出现才能起作用：

- `<Select>` 和 `<Option>`
- `<Tabs>` 和 `<TanPane>`
- `<Form>` 和 `<FormItem>`
- `<Collapse>` 和 `<Pane>`
- `<Timeline>` 和 `<TimelineItem>`
- `<Menu>` 和 `<MenuItem>`, `<Submenu>`
- `<DropdownMenu>` 和 `<DropdownItem>`
- `<Breadcrumb>` 和 `<BreadcrumbItem>`
- `<Steps>` 和 `<Step>`

一些组件成对出现会影响样式和效果等：

- `<ButtonGroup>` 和 `<Button>`
- `<RadioGroup>` 和 `<Radio>`
- `<CheckboxGroup>`和 `<CheckBox>`

一些组件是通过方法调用的：

- `$Message`
- `$Notice`
- `$Modal` 或 `<Modal>`
- `$Loading`

### 事件

iview 组件暴露的事件，都是以 `on-` 开头的，比方 `<Select>` 组件的 `on-change`等。

这些事件，你都可以在官方文档对应组件文档最下面找到。

所以代码中事件需要写成：

```html
<Select @on-change="() => {}"></Select>
```

### 组件间联动

## iview 组件实现揭秘

## 在 iview 基础之上封装自己的业务组件
