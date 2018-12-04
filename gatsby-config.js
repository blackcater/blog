module.exports = {
  pathPrefix: '/',
  siteMetadata: {
    title: 'Gatsby Default Starter',
  },
  plugins: [
    // https://www.npmjs.com/package/gatsby-plugin-react-helmet
    'gatsby-plugin-react-helmet',

    // https://www.npmjs.com/package/gatsby-source-filesystem
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },

    // https://www.npmjs.com/package/gatsby-transformer-remark
    'gatsby-transformer-remark',

    // https://www.npmjs.com/package/gatsby-transformer-sharp
    'gatsby-transformer-sharp',
    // https://www.npmjs.com/package/gatsby-plugin-sharp
    'gatsby-plugin-sharp',

    // http://lesscss.org/
    'gatsby-plugin-less',
    'gatsby-plugin-remove-trailing-slashes',

    // https://www.npmjs.com/package/gatsby-plugin-manifest
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: 'gatsby-starter-default',
        short_name: 'starter',
        start_url: '/',
        background_color: '#663399',
        theme_color: '#663399',
        display: 'minimal-ui',
        icon: 'src/images/gatsby-icon.png',
      },
    },

    // https://gatsby.app/offline
    // 'gatsby-plugin-offline',
  ],
};
