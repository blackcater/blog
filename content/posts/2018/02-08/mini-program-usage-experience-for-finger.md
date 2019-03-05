---
title: “Finger 音乐课堂”小程序开发总结
cover: cover.jpg
author: blackcater
date: 2018-02-08
tags: [miniprogram]
---

> 小程序已经有 1 年多时间了吧！从刚出来我就在关注，当时小程序写个组件，需要使用 `<template is="" data="" />` 这样的形式来复用组件。非常的不直观。从 1.6.3 之后，小程序已经支持了新的[自定义组件](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/custom-component/)的方式，这也使得小程序的开发更为简单了。依托于微信强大的用户数量，微信小程序很有可能成为新的一端（前端，iOS 端，Android 端）。

<p align="center"><img style="width: 129px; height: 129px;" src="img/miniprogram.jpg" /></p>
<p align="center"><strong>微信扫描👆二维码，立即查看效果</strong></p>

## 技术选型

很早之前体验过小程序，其极差开发体验和极低的效率一直被我诟病。但是很久已经没有关注小程序了。所以这次接到需求之后，首先进行了一些调研，希望可以让自己开发体验和开发效率变高的解决方案。

有一个项目进入了眼帘：[wepy](https://github.com/Tencent/wepy)。这个项目由腾讯团队维护，是一个让小程序支持组件化开发的框架，有着类似于 vue 的写法等等优点。听上去十分不错是不是？这种有着 vue 写法的开源项目也有许多，比方说 [weex](https://github.com/alibaba/weex)。然而 weex 是完全是 vue 的写法。wepy 只是**类似**。**类似**就意味着有些许的不同，可能会让你感到意想不到，因为需求紧迫，无法确保接入后不会影响自己的工期，并且 wepy 本身在打包之后也会占用体积，最终要的是现在小程序已经支持了[自定义组件](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/custom-component/)功能，体验也还不错，所以感觉并没有需要接入 wepy 的必要。

因此最后，我们没有用任何框架来写小程序，虽然其间也遇到了一些开发上体验不好的地方，但我们通过另一中方式解决了（后面会介绍）。

## 核心功能

“Finger 音乐课堂” 小程序（以下简称小程序）功能还是比较完整的。从用户登录，商品信息查看，支付到看回放或者直播，整个小程序可以说就是一个缩水版的 app。下面我会讲解小程序中核心的部分

### 登录

为何把登录放在第一个总结呢？是因为每个小程序都会有登录，并且只有登录了，你才能拿到用户的基本信息（昵称，性别，城市，openid 以及 unionid）。而手机号等其他信息，你需要特殊处理。

#### openid 和 unionid

在讲解登录具体细节之前，我先讲解一下什么是 openid 和 unionid。openid 就相当于用户的 userId，可以唯一标识用户。发服务通知时需要 openid 来指定发给哪个用户。unionid 也可以唯一标识用户。微信有许多服务，比如说 微信第三方登录，服务号，小程序等。他们是不同的服务，同一个用户使用不同服务，微信所返回的 openid 是不一样的。但是如果你将这些服务在微信开放平台进行绑定，那么这些服务还会返回一个 unionid，这个值是相同的。有了 unionid 你才能打通自己 app 内的服务逻辑。

#### wx.login 和 wx.getUserInfo

只是做一个简单的小程序，我想大家肯定都用过 `wx.getUserInfo`。但是 `wx.login` 很多人肯定都很陌生。这里将他们放在前面说，是因为后面获取 openid 和 unionid 都会用到这两个方法。

在讲解这两个方法之前，我先讲一下 sessionKey 吧。仔细看过微信开发文档的人，肯定都见过 sessionKey 这个字眼。微信在解密加密数据的时候，都需要这个值才能解密成功。通过 jssdk 或者其他方法拿到 code 之后，再向服务端请求换取 sessionKey。sessionKey 不推荐保存在客户端，所以换取的过程应该坐在服务端，客户端通过请求服务端接口拿到换取后的信息（openid 和 unionid）。

调用 `wx.login` 时，会得到一个 code，有了 code，我们(服务端)就可以请求 `https://api.weixin.qq.com/sns/jscode2session?appid=APP_ID&secret=APP_SECRET&js_code=CODE&grant_type=authorization_code`。之后你就可以在返回结果中，拿到 sessionKey, openid 和 unionid。`APP_ID` 和 `APP_SECRET` 分别是小程序的 appid 和 secret，你都可以在小程序的后台看到。`CODE` 就是通过 `wx.login` 得到的。

```javascript
wx.login({
  success: ({ code, errMsg }) => {
    if (code) {
      // 发起网络请求
      wx.request({
        // 请求你自己的服务器，该接口背后调用了 https://api.weixin.qq.com/sns/jscode2session?appid=<APP_ID>&secret=<APP_SECRET>&js_code=<CODE>&grant_type=authorization_code
        url: 'https://test.server.com/wechat/minprogram/login',
        data: { code },
      });
    } else {
      console.log('获取用户登录态失败！' + errMsg);
    }
  },
});
```

虽然拿到 code 之后换取 sessionKey 时，返回的有 openid 和 unionid。但是 unionid 字段可能为空。这和微信的 [unionid 机制](https://mp.weixin.qq.com/debug/wxadoc/dev/api/uinionID.html)有关。如果一个用户未使用过你注册的任何业务（第三方登录，服务号等）。那么在这一步你是拿不到 unionid 的。下面就得 `wx.getUserInfo` 大显身手了。

在 `wx.getUserInfo` [文档的第一行](https://mp.weixin.qq.com/debug/wxadoc/dev/api/open.html#wxgetuserinfoobject)你就能看到一句话（他很重要）。**获取用户信息，withCredentials 为 true 时需要先调用 `wx.login` 接口。**。只有你传入了 withCredentials 为 true，在返回值中才会有，encryptedData 和 iv 字段。解密这两个字段你就能拿到 openid 和 unionid。（这个地方必有 unionid）。解密过程也做在服务端即可。

_解密时需要 sessionKey，因此 sessionKey 需要服务端自行保存和维护起来。推荐放入 redis 里。每次调用 `wx.login` 时刷新 sessionKey。_

```javascript
wx.getUserInfo({
  // 确保调用该方法之前，调用了 wx.login
  // 只有该参数为 true，返回值中才会有 encryptedData 和 iv
  withCredentials: true,
  success: ({ userInfo, encryptedData, iv }) => {
    console.dir(userInfo);

    wx.request({
      url: 'https://test.server.com/wechat/minprogram/decipher',
      data: {
        encryptedData,
        iv,
      },
    });
  },
});
```

#### 登录态维护

每次调用 `wx.login` 都会刷新登录态。登录态刷新会导致 sessionKey 的失效。因此我们需要维护登录态。使用 `wx.checkSession` 可以检查登录态是否失效。如果失效需要我们自行的重新调用 `wx.login`。

**开发者要注意不应该直接把 session_key、openid 等字段作为用户的标识或者 session 的标识，而应该自己派发一个 session 登录态（请参考登录时序图）。对于开发者自己生成的 session，应该保证其安全性且不应该设置较长的过期时间。session 派发到小程序客户端之后，可将其存储在 storage ，用于后续通信使用。**

![微信官方 登录时序图](img/login-1.png)

```javascript
wx.checkSession({
  success: () => {
    // 未过期
    // TODO: 检查第三方session 是否过期
    if (check3rdSession()) {
      // 未过期
      // TODO: storage 中获取已有第三方登录数据
      getAppInfo();

      return;
    }

    // 过期，重新登录
    wechatLogin();
  },
  fail: () => {
    // 已过期
    wechatLogin();
  },
});
```

### mixin

微信自定义组件中，有一个特性叫做 **[behavior](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/custom-component/behaviors.html)**。它是用于组件间代码共享的特性，类似于一些编程语言中的 “mixins” 或 “traits”。

然而 [Page](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/app-service/page.html) 没有这种类似的特性。而这种特性很常用，比方说统一的页面加载逻辑，就会需要共享一部分 data 结构，和一部分方法。

因此我们自己实现了一个简单的 mixin。这里我就不去讲解代码的含义了，代码十分的简单。

```javascript
/**
 * 将多个对象中的方法整合为一个
 * @param methodName
 * @param list
 */
function combinePageMethods(methodName, list = []) {
  return function combinedPageMethod(...args) {
    list.forEach((item, index) => {
      if (item[methodName]) {
        if (list.length - 1 !== index) {
          console.log(
            `mixin: \`${
              item.$name
            }\`'s ${methodName} lifecycle method will be called`
          );
        }

        item[methodName].apply(this, args);
      }
    });
  };
}

/**
 * Page 支持 mixin
 *
 * @param page
 */
export function PageMixins(page) {
  const { mixins, ...nativePage } = page;
  // 如果没有 mixiin
  if (!mixins || mixins.length <= 0) return nativePage;

  const pagesDataList = [...mixins, nativePage];
  const pageDataWithMixin = pagesDataList.reduce((page, mixin) => {
    const { data: pageData = {}, ...pageMethods } = page;
    const { $name, data: mixinData = {}, ...mixinMethods } = mixin;

    return {
      data: {
        ...pageData,
        ...mixinData,
      },
      ...pageMethods,
      ...mixinMethods,
    };
  }, {});

  return {
    ...pageDataWithMixin,
    onLoad: combinePageMethods('onLoad', pagesDataList),
    onReady: combinePageMethods('onReady', pagesDataList),
    onShow: combinePageMethods('onShow', pagesDataList),
    onHide: combinePageMethods('onHide', pagesDataList),
    onUnload: combinePageMethods('onUnload', pagesDataList),
    onPullDownRefresh: combinePageMethods('onPullDownRefresh', pagesDataList),
    onReachBottom: combinePageMethods('onReachBottom', pagesDataList),
    onPageScroll: combinePageMethods('onPageScroll', pagesDataList),
    // 新增方法
    onTabItemTap: combinePageMethods('combinePageMethods', pagesDataList),
  };
}
```

因此我们使用起来就变得很简单了。

```javascript
/* mixins/customMixin.js */
export default {
  data: {
    mixinData: [],
  },
  mixinMethods: () => void 0,
};

/* index.js */
import Mixin from 'utils/mixin';
import customMixin from 'mixins/customMixin';

Page(
  Mixin({
    data: {
      myData: [],
    },
    mixins: [customMixin],
    someMethod() {
      // 访问数据
      console.dir(this.data.mixinData);

      this.setData({
        // 更新数据
        'mixinData[0]': true,
      });

      // 调用 mixin 中方法
      this.mixinMethods();
    },
  })
);
```

**_注意：写 mixin 时，方法不要使用 `=>` 书写方式，会导致 `this` 不正确。[你可以参考](https://segmentfault.com/a/1190000003781467#articleHeader2)_**

### page-loading

搞过 iOS 或 Android 开发，在开发具体功能之前，肯定都需要封装一个组件（Android 叫 Activity，iOS 叫 ViewController 应该是这样），其需要封装一些功能：上拉刷新，下拉加载，滑到底部的样式，加载中的样式，网络错误样式，页面为空样式等等。然后我们复用这个组件就可以了。这里 page-loading 组件就是这么一个存在。

page-loading 是一个自定义组件，也会暴露一个 mixin。该 mixin 中会暴露一些 data 和 公众方法。

```javascript
// mixins/pageLoadingMixin.js
export default {
  data: {
    // 请求状态
    $pageLoadingStatus: {},
    // 请求数据
    $pageLoadingData: null,
  },

  // 配置属性
  $pageLoadingConf: {},

  // page-loading 状态信息
  $pageLoadingState: {},

  // 数据缓存
  $pageLoadingStore: {},

  // 暴露方法
  $pageLoadingInit(config = {}) {
    this.$pageLoadingConf = {
      ...this.$pageLoadingConf,
      ...config,
    };
  },

  // 数据请求接口
  $pageLoadingFetch() {},

  // 上拉刷新
  onPullDownRefresh() {},

  // 下拉加载
  onReachBottom() {},
};
```

在 page-loading 组件中，我们传入 `$pageLoadingStatus` 即可。 有了 mixin 是不是觉得很简单？

### 网络检测

因为我们有直播，所以需要用到网络检测。微信提供两个方法：一个是 `wx.getNetworkType`，另一个是 `wx.onNetworkStatusChange`。看似很美好对么？然而在使用中，我发现，这个 `wx.onNetworkStatusChange` 会在全局加一个网络监听事件。即使退出直播，你还会收到网络变化的回调。额 O\_\_O "…，这可不好。

这时候又是 mixin 大显身手的时候了，我们自己实现了一个简单的网络检测方法。

```javascript
// mixins/networkMixin.js
export const NETWORK_STATUS = {
  WIFI: 'wifi',
  '4G': '4g',
  '3G': '3g',
  '2G': '2g',
  UNKNOWN: 'unknown',
  NONE: 'none',
};

/**
 * 网络检测定时器
 */
export default {
  $name: 'NetworkMixin',

  data: {
    $network: {
      [NETWORK_STATUS.NONE]: false,
      [NETWORK_STATUS.WIFI]: true,
      [NETWORK_STATUS['2G']]: false,
      [NETWORK_STATUS['3G']]: false,
      [NETWORK_STATUS['4G']]: false,
      [NETWORK_STATUS.UNKNOWN]: false,
    },
  },

  $latestNetworkStatus: NETWORK_STATUS.WIFI,
  // 回调列表
  $networkCbs: [],
  // 网络检测定时器
  $networkTimer: null,

  onUnload() {
    // 移除网络监听
    this.$offNetworkStatusChange();
  },

  $onNetworkStatusChange(cb) {
    if (cb) this.$networkCbs.push(cb);

    if (!this.$networkTimer) {
      // 启动定时器
      this.$networkTimer = setInterval(this._networkStepInterval, 1000);
    }
  },

  $offNetworkStatusChange(cb) {
    if (cb) {
      this.$networkCbs = this.$networkCbs.filter(ncb => ncb !== cb);
    } else {
      this.$networkCbs = [];
    }

    if (this.$networkCbs.length <= 0) {
      // 关闭定时器
      clearInterval(this.$networkTimer);

      this.$networkTimer = null;
    }
  },

  _networkStepInterval() {
    const $this = this;

    wx.getNetworkType({
      success: ({ networkType }) => {
        let result = null;

        // 事件回调
        for (let i = 0, len = $this.$networkCbs.length; i < len; i++) {
          const cb = $this.$networkCbs[i];

          result = cb(networkType, $this.$latestNetworkStatus);
        }

        // 网络变化
        if ($this.$latestNetworkStatus !== networkType) {
          if (networkType === NETWORK_STATUS.WIFI) {
            this.setData({
              $network: {
                [NETWORK_STATUS.NONE]: false,
                [NETWORK_STATUS.WIFI]: true,
                [NETWORK_STATUS['2G']]: false,
                [NETWORK_STATUS['3G']]: false,
                [NETWORK_STATUS['4G']]: false,
                [NETWORK_STATUS.UNKNOWN]: false,
              },
            });
          } else if (networkType === NETWORK_STATUS['4G']) {
            this.setData({
              $network: {
                [NETWORK_STATUS.NONE]: false,
                [NETWORK_STATUS.WIFI]: false,
                [NETWORK_STATUS['2G']]: false,
                [NETWORK_STATUS['3G']]: false,
                [NETWORK_STATUS['4G']]: true,
                [NETWORK_STATUS.UNKNOWN]: false,
              },
            });
          } else if (networkType === NETWORK_STATUS['3G']) {
            this.setData({
              $network: {
                [NETWORK_STATUS.NONE]: false,
                [NETWORK_STATUS.WIFI]: false,
                [NETWORK_STATUS['2G']]: false,
                [NETWORK_STATUS['3G']]: true,
                [NETWORK_STATUS['4G']]: false,
                [NETWORK_STATUS.UNKNOWN]: false,
              },
            });
          } else if (networkType === NETWORK_STATUS['2G']) {
            this.setData({
              $network: {
                [NETWORK_STATUS.NONE]: false,
                [NETWORK_STATUS.WIFI]: false,
                [NETWORK_STATUS['2G']]: true,
                [NETWORK_STATUS['3G']]: false,
                [NETWORK_STATUS['4G']]: false,
                [NETWORK_STATUS.UNKNOWN]: false,
              },
            });
          } else if (networkType === NETWORK_STATUS.UNKNOWN) {
            this.setData({
              $network: {
                [NETWORK_STATUS.NONE]: false,
                [NETWORK_STATUS.WIFI]: false,
                [NETWORK_STATUS['2G']]: false,
                [NETWORK_STATUS['3G']]: false,
                [NETWORK_STATUS['4G']]: false,
                [NETWORK_STATUS.UNKNOWN]: true,
              },
            });
          } else if (networkType === 'none') {
            this.setData({
              $network: {
                [NETWORK_STATUS.NONE]: true,
                [NETWORK_STATUS.WIFI]: false,
                [NETWORK_STATUS['2G']]: false,
                [NETWORK_STATUS['3G']]: false,
                [NETWORK_STATUS['4G']]: false,
                [NETWORK_STATUS.UNKNOWN]: false,
              },
            });
          }
        }

        if (result !== false) {
          $this.$latestNetworkStatus = networkType;
        }
      },
    });
  },
};
```

使用起来很简单：

```javascript
// index.js
import Mixin from 'utils/mixin';
import networkMixin, { NETWORK_STATUS } from 'mixins/networkMixin';

Page(
  Mixin({
    data: {},
    mixins: [networkMixin],
    onLoad() {
      // 开始进行网络检测
      this.$onNetworkStatusChange(this._networkChangeHandler);
    },

    // 网络变化处理
    _networkChangeHandler(currentNetworkType, lastNetworkType) {
      if (
        currentNetworkType !== NETWORK_STATUS.WIFI &&
        lastNetworkType === NETWORK_STATUS.WIFI
      ) {
        // 网络波动，给出警告
        wx.showModal({
          content: '当前为非 wifi 状态，您是否要继续播放？',
          showCancel: false,
          success: ({ confirm }) => {
            if (confirm !== true) {
              wx.navigateBack();
            }
          },
        });
      }
    },
  })
);
```

### IM

我们使用的是**腾讯 IM**，如果你用的不是腾讯 IM，可以<a href="#%E7%9B%B4%E6%92%AD">绕过这一节</a>。

腾讯有两种账号登录集成方式：**独立模式**和**托管模式**。具体区别请参考[官方文档](https://cloud.tencent.com/document/product/268/7653)。

![im 配置](img/im-1.png)

使用前，你需要进行一些配置，从而可以连接到腾讯 IM 服务器。如果你是托管模式，除了需要导入 `webim.js` 文件外，还需要导入一个 `tls.js` 文件（[选择 IM Web 平台 SDK](https://cloud.tencent.com/product/im)）。

```javascript
// mixin/timMixin.js
import webim from 'vendors/webim';

export default {
  data: {
    $tim: {
      // 消息列表
      msg: [],
      // 当前人数
      num: 0,
    },
  },

  // 配置
  $timConf: {
    // 最大消息队列数目
    maxMsgSeq: 300,
    sdkAppID: '<APP_ID>',
    accountType: '<ACCOUNT_TYPE>',
    // 重试次数
    relogin: 3,
  },

  onUnload() {
    this.$timLogout();
  },

  $timInit(conf) {
    //...
  },

  /**
   * @params times 重试次数
   */
  $timLogin(times, cb, errCb) {
    const relogin = typeof times === 'number' ? times : this.$timConf.relogin;

    if (times === 0) {
      // im 尝试登陆失败
      if (errCb) errCb();

      return;
    }

    if (!options.userId || !options.access_token || !options.groupId) {
      throw new Error('请传入 userId, access_token 和 groupId');
    }

    webim.login(
      {
        sdkAppID: this.$timConf.sdkAppID,
        appIdAt3rd: this.$timConf.sdkAppID,
        accountType: this.$timConf.accountType,
        identifier: '<userId>',
        identifierNick: null,
        // 登录 im 服务的凭证
        userSig: '<sig>',
      },
      {
        onConnNotify() {
          /* empty */
        },
        // 消息通知，处理消息，将结果加入 this.data.$tim.msg
        onMsgNotify: msgList => {
          /* empty */
        },
        // 消息通知，处理消息，将结果加入 this.data.$tim.msg
        onBigGroupMsgNotify: () => {
          /* empty */
        },
        onGroupInfoChangeNotify: () => {
          /* empty */
        },
        onGroupSystemNotifys: {
          /* empty */
        },
        onC2cEventNotifys() {
          /* empty */
        },
        onFriendSystemNotifys() {
          /* empty */
        },
        onProfileSystemNotifys() {
          /* empty */
        },
        onKickedEventCall() {
          /* empty */
        },
        onAppliedDownloadUrl() {
          /* empty */
        },
      },
      {},
      () => {
        // 加入群聊
        webim.applyJoinBigGroup(/* ... */);
      },
      () => this.$timLogin(relogin - 1, cb, errCb)
    );
  },

  // 退出
  $timLogout() {
    webim.logout();
  },
};
```

mixin 大致结构如上。你只需要处理 `onMsgNotify` 和 `onBigGroupMsgNotify` 收到的消息，将消息转化为展示需要的数据结构形式即可。之后你在页面中使用 `$tim.msg` 渲染出消息即可。

### 直播

直播有两个组件，一个是 `<video>` 组件，一个是 `<live-player>` 组件。`<video>` 只支持 HLS。`<live-player>` 支持 HLS 和 RTMP 甚至 RTC。但是 `<live-player>` 暂时只对部分类目开放，[官方文档](https://mp.weixin.qq.com/debug/wxadoc/dev/component/live-player.html)

HLS 延迟高，RTMP 延迟低。我们的场景对延迟要求苛刻，所以最终用的 `<live-player>`。该组件，需要手动开通权限。

![im 配置](img/live-1.png)

在开发中遇到了一些问题：

1. `<live-player>` 组件没有自带控制器，所以，你需要自己实现控制器。
2. 在 `<video>` 和 `<live-player>` 组件上添加样式，很多样式其实是不支持的。动态展示会出意想不到的问题。[issue 详情](https://developers.weixin.qq.com/blogdetail?action=get_post_info&docid=00068e1b1b453079d916809445b400)

### 分包

我们在开发期间，收到了小程序更新通知。支持了[分包加载](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/subpackages.html)，我去这个很强大。

分包加载是 `v1.7.3` 之后支持的。之前会默认项原来那样。所以，你不需要考虑兼容问题。

目前小程序分包大小有以下限制：

- 整个小程序所有分包大小不超过 4M
- 单个分包/主包大小不能超过 2M

```json
{
  "pages": [
    // 全局页面
    "pages/index",
    "pages/user"
  ],
  "subPackages": [
    {
      "root": "packages/live",
      "pages": [
        // 目录 packages/live 下所有 page
      ]
    },
    {
      "root": "packages/course",
      "pages": [
        // 目录 packages/course 下所有 page
      ]
    }
    // ...
  ]
}
```

### 其他

#### setData

`setData` 不要平凡调用和调用时传入过多数据，这两种情况都会导致页面性能的降低。

#### onPageScroll

为何要写这个？在我们开发课程详情页的时候，向下滚动会导致页面十分的卡。由于 onPageScroll 频繁调用，造成频繁的 `wx.createSelectorQuery()` 和 `setData` 性能十分低下。所以，我们对 onPageScroll 进行了节流，和对 `wx.createSelectorQuery()` 的结果进行了缓存。

#### wx.createSelectorQuery

`wx.createSelectorQuery`很强大，具体用法可以查看[官方文档](https://mp.weixin.qq.com/debug/wxadoc/dev/api/wxml-nodes-info.html)。在复杂页面，比如有定位的页面，可能都会用到 `wx.createSelectorQuery` 来计算展示的样式。

```javascript
Page({
  onPageScroll() {
    const query = wx.createSelectorQuery().in(this);

    query
      .select('#id')
      .boundingClientRect(rect => {
        const { width, height, top, left, right, bottom } = rect;
        // 单位 px

        // width, height 是 width + padding, height + padding 不包括 margin
        // top 距离顶部值
        // left 距离左侧边框值
        // right 距离右侧边框值
        // bottom 距离底部边框值
      })
      .exec();
  },
});
```

![wx.createSelectorQuery](img/createSelectorQuery-1.png)

对于上图，banner 的 top 值为 B 区域的高度。最近，微信小程序[配置项](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/config.html)添加了新参数--navigationStyle。navigationStyle 默认为 default。表示展示 A 区域。当 navigationStyle 值为 custom 时，不会展示 A 区域，其余其余会向上移动。因此此时 banner 的 top 值依旧为 B 区域的高度。

#### wx:for

[wx:for](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/view/wxml/list.html) 也是性能优化的一个点。所以，使用中需要小心。

## 尾声

这篇文章代码比较多，写的比较零散。希望对你开发小程序有所启迪和帮助。

小程序现如今的开发体验已经比去年初好了很多了。虽然小程序有很多的意想不到的问题。但是正常情况下都十分的完美。最近官方又开放了小游戏功能，跳瓶子我想大家已经都知道了。所以快去成为小程序开发的一员吧！

_公司上升期，需要大量志同道合的人才，有兴趣的小伙伴可以加入我们哦~ [Follow finger, anyone can play](https://www.lagou.com/gongsi/j51416.html)_
