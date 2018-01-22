const poststylus = require('poststylus')
const rupture = require('rupture')
const autoprefixer = require('autoprefixer')
const rucksack = require('rucksack-css')

module.exports = {
  siteMetadata: {
    title: "blackcater's blog",
    description: 'blackcater的个人博客———-对任何技术都感兴趣的普通程序猿',
    website: 'http://www.blackcater.win',
    siteUrl: 'http://www.blackcater.win',
    nickname: 'blackcater',
    slogan: '一心所向，必有回响',
    email: 'blackcater2015@gmail.com',
    socials: [
      // {
      //   type: "facebook",
      //   url: "",
      // },
      // {
      //   type: "google",
      //   url: "",
      // },
      {
        type: 'twitter',
        url: 'https://twitter.com/tomtang2015',
      },
      {
        type: 'github',
        url: 'https://github.com/blackcater',
      },
      {
        type: 'medium',
        url: 'https://medium.com/@blackcater',
      },
      {
        type: 'weibo',
        url: 'https://weibo.com/tangyinong2013',
      },
      {
        type: 'segmentfault',
        url: 'https://segmentfault.com/u/blackcater',
      },
      {
        type: 'zhihu',
        url: 'https://www.zhihu.com/people/blackcater2015',
      },
      {
        type: 'jianshu',
        url: 'https://www.jianshu.com/users/df03cf10f42f/timeline',
      },
      {
        type: 'bilibili',
        url: 'https://space.bilibili.com/4718807/#/',
      },
      {
        type: 'rss',
        url: 'http://www.blackcater.win/rss.xml',
      },
    ],
    links: [
      {
        name: "blackcater's blog",
        link: 'http://www.blackcater.win',
      },
    ],
  },
  plugins: [
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'posts',
        path: `${__dirname}/posts/`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              classPrefix: 'language-',
            },
          },
          `gatsby-remark-autolink-headers`,
        ],
      },
    },
    {
      resolve: 'gatsby-plugin-stylus',
      options: {
        use: [
          poststylus([
            autoprefixer({
              browsers: ['last 2 versions', '> 1%', 'not ie <= 9'],
            }),
            rucksack(),
          ]),
          rupture(),
        ],
      },
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: 'UA-111803122-1',
        // Setting this parameter is optional
        anonymize: true,
      },
    },
    'gatsby-plugin-feed',
    'gatsby-plugin-offline',
    'gatsby-plugin-react-helmet',
  ],
}
