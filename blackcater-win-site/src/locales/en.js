export const translation = {
  home: 'HOME',
  tag: 'TAG',
  column: 'COLUMN',
  category: 'CATEGORY',
  archive: 'ARCHIVE',
  resume: 'RESUME',
  about: 'ABOUT',

  slogan: 'SLOGAN',
  links: 'LINKS',

  recent: 'RECENT',
  more: 'MORE',

  read: 'READ',

  index: 'INDEX',

  zhifubao: 'AliPay',
  wechat: 'WeChat',

  prev: 'PREV POST',
  next: 'NEXT POST',

  reward: 'reward',

  resumeInfos: {
    contact: {
      title: 'Contact',
      phone: '+86 17681820960',
      mail: 'blackcater2015@gmail.com',
    },
    application: {
      title: 'Application',
      data: 'Front-End Engineer',
    },
    basic: {
      title: 'Basic',
      name: {
        key: 'Name',
        value: 'Tom Tang',
      },
      age: {
        key: 'Age',
        value: 22,
      },
      gender: {
        key: 'Gender',
        value: 'man',
      },
      school: {
        key: 'Graduate from',
        value: 'NEU (China)',
      },
      nickname: {
        key: 'Nickname',
        value: 'blackcater',
      },
      blog: {
        key: 'Blog',
        value: 'http://www.blackcater.win',
        link: 'http://www.blackcater.win',
      },
      github: {
        key: 'Github',
        value: 'https://www.github.com/blackcater',
        link: 'https://www.github.com/blackcater',
      },
    },
    experience: {
      title: 'Experience',
      data: [
        {
          logo: '/resume/experience/finger-logo.png',
          name: '杭州妥妥网络科技',
          time: '(2017.8 - 至今)',
          link: 'https://www.finger66.com',
          projects: [
            {
              name: '运营后台',
              desc: `
              <p>负责运营后台已有功能重构与维护以及新功能的添加。其中包括移动首屏页和二级页面配置等。</p>
              <p>项目采用 React 框架，flux 进行状态管理，webpack 进行项目打包构建。</p>
              `,
            },
            {
              name: '富文本编辑器开发',
              desc: `
              <p>负责整个项目的开发与维护。项目基于 React 框架，和 draft.js 富文本编辑器框架进行开发。支持文件，图片添加，字体颜色，大小等行内样式。以及支持其他信息的添加：帖子，曲谱等。</p>
              <p><img src="/resume/experience/2-1.png"/></p>
              `,
            },
            {
              name: '"Finger 音乐课堂" 小程序开发',
              desc: `
                <p>负责整个小程序项目的开发与维护。功能包括用户登录，全局搜索，商品详情页，购买支付流程，直播 IM 等。</p>
                <p><img src="/resume/experience/3-1.png"/></p>
              `,
            },
            {
              name: '前端工程化体系搭建',
              desc: `
                <p>前端工程化从前到后依次有：代码检测，测试工具，持续集成（交付），线上监控等。</p>
                <p>搭建私有 NPM，开发项目管理和构建工具。</p>
              `,
            },
            {
              name: '用户管理后台',
              desc: `
                <p>基于 Vue 开发的用户管理后台，具有细粒度的权限控制体系。整体基于 Vue 全家桶和 iview 框架进行开发。</p>
                <p>借鉴 Ant Design Pro 组件，开发了对应一系列的 iview 版本的组件。</p>
                <p><img src="/resume/experience/5-1.png"/></p>
              `,
            },
          ],
        },
      ],
    },
    projects: {
      title: 'Personal Projects',
      data: [
        {
          logo: '/resume/project/blog-logo.png',
          title: '我的博客',
          desc: `
            <p>使用 Gatsby 工具开发的静态博客，存放在 Github。</p>
            <p><img src="/resume/project/2-1.png"/></p>
          `,
          sourceUrl: 'https://github.com/blackcater/blog',
          demoUrl: 'http://www.blackcater.win',
        },
      ],
    },
  },
  aboutInfos: {},

  '404': 'NOT FOUND',
}
