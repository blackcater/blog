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
          name: 'Tuotuo Inc.',
          time: '(2017.8 - Now)',
          link: 'https://www.finger66.com',
          projects: [
            {
              name: 'Operation Management System(OMS)',
              desc: `
              <p>负责项目的功能开发与维护。OMS 囊括了移动 APP 运营需要的各种功能，以及 APP 页面配置的功能。</p>
              <p>项目采用 React 框架，flux 进行状态管理，webpack 进行项目打包构建。</p>
              `,
            },
            {
              name: 'Rich-text Editor',
              desc: `
              <p>负责整个项目的开发与维护。项目基于 React 框架，和 draft.js 富文本编辑器框架进行开发。支持文件，图片添加，字体颜色，大小等行内样式。以及支持其他信息的添加：帖子，曲谱等。</p>
              `,
            },
            {
              name: 'Miniprogram',
              desc: `<p>负责整个小程序项目的开发与维护。负责的功能包括统一请求处理，用户登录，全局搜索，直播 IM 等。</p>`,
            },
          ],
        },
      ],
    },
    projects: {
      title: 'Personal Projects',
      projects: [
        {
          title: 'My blog',
          desc: `
          <p>根据 gatsby 开发的个人博客。</p>
          `,
          source: 'source code',
          sourceUrl: '',
          demoUrl: '',
        },
      ],
    },
    skills: {
      title: 'Skills',
      data: [
        {
          title: 'Front End',
          sections: [
            {
              title: 'HTML / CSS',
              desc: `
                <p>Can write semantic HTML, modular CSS, and complete complex layout</p>
                <p>Skill preprocessing and modular tools like Less, Sass, Stylus and Postcss</p>
              `,
            },
            {
              title: 'JavaScript',
              desc: `
                <p>Skill native JavaScript, can code without jQuery and other library</p>
                <p>Skill modular and object-oriented programming</p>
                <p>Skill React and Vue framework</p>
              `,
            },
            {
              title: 'Others',
              desc: `
                <p>Skill front-end automation tools like Webpack, Rollup and Gulp</p>
                <p>Understand security and performance optimization of front-end</p>
              `,
            },
          ],
        },
        {
          title: 'Back End',
          sections: [
            {
              title: 'Node.js',
              desc: `
                <p>Understand Node.js web development, front-end separation, and crawler</p>
                <p>Can develop complex miniprogram and rich-text editor</p>
              `,
            },
          ],
        },
        {
          title: 'Others',
          sections: [
            {
              desc: `
                <p>Dedicate to open source</p>
                <p>Be interested in all technologies</p>
                <p>Have patient and perseverance</p>
              `,
            },
          ],
        },
      ],
    },
  },
  aboutInfos: {},

  '404': 'NOT FOUND',
}
