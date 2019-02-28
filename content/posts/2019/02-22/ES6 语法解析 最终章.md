---
title: ES6 语法解析 之 最终章
cover: cover.png
author: blackcater
series: advanced-frontend
tags: [javascript]
date: 2019-02-22
draft: true
---

> 这是《前端进阶》系列的第八篇文章

The tutorial is divided into several sections:

- [Setup for the Tutorial](/) will give you a starting point to follow the tutorial.
- Overview will teach you the fundamentals of React: components, props, and state.
- Completing the Game will teach you the most common techniques in React development.
- Adding Time Travel will give you a deeper insight into the unique strengths of React.

You don’t have to complete all of the sections at once to get the value out of this tutorial. Try to get as far as you can — even if it’s one or two sections.

It’s fine to copy and paste code as you’re following along the tutorial, but we recommend to type it by hand. This will help you develop a muscle memory and a stronger understanding.

<details>
    <summary><strong>Optional: Instructions for following along locally using your preferred text editor</strong></summary>

Something small enough to escape casual notice.

This setup requires more work but allows you to complete the tutorial using an editor of your choice. Here are the steps to follow:

1. Make sure you have a recent version of Node.js installed.
2. Follow the installation instructions for [Create React App](/) to make a new project.

```bash
cd my-app
cd src

# If you're using a Mac or Linux:
rm -f *

# Or, if you're on Windows:
del *

# Then, switch back to the project folder
cd ..
```

</details>

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
// highlight-next-line
import './index.css';
```
