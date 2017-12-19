const theme = require('./theme')

module.exports = {
  siteMetadata: {
    title: 'blackcater\'s blog',
    nickname: 'blackcater',
    slogan: '一心所向，必有回响',
    email: 'blackcater2015@gmail.com',
    socials: [
      {
        type: 'twitter',
        url: '',
      },
      {
        type: 'facebook',
        url: '',
      },
      {
        type: 'google',
        url: '',
      },
      {
        type: 'github',
        url: '',
      },
      {
        type: 'weibo',
        url: '',
      },
    ],
  },
  plugins: [
    `gatsby-transformer-remark`,
    `gatsby-plugin-antd`,
    {
      resolve: `gatsby-plugin-less`,
      options: {
        modifyVars: theme,
      },
    },
    `gatsby-plugin-feed`,
    `gatsby-plugin-offline`,
    `gatsby-plugin-react-helmet`,
  ],
}
