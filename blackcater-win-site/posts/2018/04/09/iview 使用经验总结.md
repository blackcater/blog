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

### 自定义表单组件

`iview` 本身只提供了一些常用的表单组件：`<Input>`，`<Radio>`，`<Select>` 等。有时候，我们需要使用封装了业务逻辑的表单。

在学习 vue 时，我们都知道自定义组件的 `v-model` 的实现方式是，通过 `value` 和 `input` 事件实现（可以自定义）。

```javascript
// https://github.com/iview/iview/blob/2.0/src/mixins/emitter.js
import Emitter from 'Emitter'

export default {
  name: 'custom-component',
  
  mixins: [ Emitter ],
  
  props: {
    // value
    value: String,
  },
  
  data() {
    return {}
  },
  
  methods: {
    _onChange(val) {
      // v-model
      this.$emit('input', val)
      // 符合 iview 自定义事件
      this.$emit('on-change', val)
      // 自定义 iview 表单组件 必写该行
      this.dispatch('FormItem', 'on-form-change', this.val)
    },
  }
}
```

上面的 `this.dispatch('FormItem', 'on-form-change', this.val)` 可能会让你感到困惑，不过没关系，下一节将会让你弄明白。

## iview 组件实现揭秘

为了更好的理解该章节，我们以 `<Form>` 和 `<FormItem>` 为例，下面是一个简单的表单示例：

```html
<!-- template -->
<Form ref="form" :model="formModel">
  <FormItem prop="user" :rules="userRules">
    <Input type="text" v-model="formModel.user" placeholder="Username">
    </Input>
  </FormItem>
  <FormItem prop="pass" :rules="passRules">
    <Input type="password" v-model="formModel.pass" placeholder="Password">
    </Input>
  </FormItem>
  <FormItem>
    <Button type="primary" @click="handleSubmit">SUBMIT</Button>
  </FormItem>
</Form>
```

```javascript
// javascript
export default {
  data() {
    return {
      formModel: {},
      userRules: { required: true, message: 'Username cannot be empty' },
      passRules: { required: true, message: 'Password cannot be empty' },
    }
  },
  
  methods: {
    handleSubmit() {
      this.$refs.validate(valid => {
        if (!valid) return this.$Message.error('Not valid')
        
        // console. the result
        console.dir(this.formModel)
      })
    },
  },
}
```

当你未输入用户名密码，点击 `SUBMIT` 按钮时，你会看到在对应输入框下的错误提示。在 `handleSubmit` 中，我们只调用了 `<Form>` 组件的 `validate` 方法。

在 `<Form>` 组件中，`validate` 方法调用了其子 `<FormItem>` 组件中的 `validate` 方法。

为什么 `<Form>` 中可以调用到 `<FormItem>` 中的 `validate` 方法呢？

有些人可能说，这很简单，我们可以在 `<Form>` 节点处，向下遍历子节点，搜集所有的 `<FormItem>` 节点。

这样确实可以，但是很麻烦。在 `<Form>` 组件内部并不是这样的。

```javascript
// Form
// https://github.com/iview/iview/blob/2.0/src/components/form/form.vue
export default {
  data() {
    return {
      fields: [],
    }
  },
  
  // created
  created() {
    
  }
}
```

## 在 iview 基础之上封装自己的业务组件
