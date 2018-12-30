module.exports = {
  pathPrefix: '/',
  siteMetadata: {
    title: 'blackcater',
    description: "blackcater's personal website",
    keywords: "blackcater,blog,blackcater's blog,",
    website: 'http://www.blackcater.win',
    siteUrl: 'http://www.blackcater.win',
    nickname: 'blackcater',
    slogan: '求知若饥，虚心若愚 (Stay hungry, stay foolish)',
    email: 'blackcater2015@gmail.com',
  },
  plugins: [
    // https://www.npmjs.com/package/gatsby-source-filesystem
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `data`,
        path: `${__dirname}/content/data`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `posts`,
        path: `${__dirname}/content/posts`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },

    // https://www.npmjs.com/package/gatsby-transformer-json
    'gatsby-transformer-json',

    // https://www.npmjs.com/package/gatsby-transformer-remark
    'gatsby-transformer-remark',

    // https://www.npmjs.com/package/gatsby-transformer-sharp
    'gatsby-transformer-sharp',
    // https://www.npmjs.com/package/gatsby-plugin-sharp
    'gatsby-plugin-sharp',

    // http://lesscss.org/
    'gatsby-plugin-less',

    // https://www.npmjs.com/package/gatsby-plugin-remove-trailing-slashes
    'gatsby-plugin-remove-trailing-slashes',

    // https://www.npmjs.com/package/gatsby-plugin-manifest
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: 'gatsby-starter-default',
        short_name: 'starter',
        start_url: '/',
        background_color: '#03a87c',
        theme_color: '#03a87c',
        display: 'minimal-ui',
        icon: 'src/images/avatar.png',
      },
    },

    // https://gatsby.app/offline
    'gatsby-plugin-offline',

    // https://www.npmjs.com/package/gatsby-plugin-feed
    'gatsby-plugin-feed',

    // https://www.npmjs.com/package/gatsby-plugin-google-analytics
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: 'UA-111803122-1',
        // Setting this parameter is optional
        anonymize: true,
      },
    },
  ],
  mapping: {
    'MarkdownRemark.frontmatter.author': `AuthorJson`,
    'MarkdownRemark.frontmatter.series': `SeriesJson`,
  },
};
