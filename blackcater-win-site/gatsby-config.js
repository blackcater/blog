const theme = require('./theme')

module.exports = {
  siteMetadata: {
    title: '一心所向，必有回响',
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
