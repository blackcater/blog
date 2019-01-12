require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
});

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
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        excerpt_separator: `<!-- end -->`,
        plugins: [
          'gatsby-remark-images',
          'gatsby-remark-abbr',
          'gatsby-remark-emoji',
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              classPrefix: 'language-',
            },
          },
          {
            resolve: 'gatsby-remark-embed-gist',
            options: {
              username: 'blackcater',
              includeDefaultCss: true,
            },
          },
        ],
      },
    },

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
        trackingId: process.env.GATSBY_GOOGLE_ANALYTICS_TRACKINGID,
        // Setting this parameter is optional
        anonymize: true,
      },
    },

    // https://www.npmjs.com/package/gatsby-plugin-algolia
    {
      resolve: `gatsby-plugin-algolia`,
      options: {
        appId: process.env.GATSBY_ALGOLIA_APPID,
        apiKey: process.env.GATSBY_ALGOLIA_APPKEY,
        queries: [
          {
            query: `
              {
                allMarkdownRemark {
                  edges {
                    node {
                      id
                      fields {
                        slug
                      }
                      frontmatter {
                        title
                        cover {
                          childImageSharp {
                            original {
                              src
                            }
                          }
                        }
                        author {
                          name
                          email
                          nickname
                          slogan
                        }
                        tags {
                          name
                          description
                        }
                        series {
                          name
                          description
                        }
                      }
                      excerpt(format: PLAIN)
                    }
                  }
                }
              }`,
            transformer: ({ data }) =>
              data.allMarkdownRemark.edges.map(({ node }) => ({
                objectID: node.id,
                slug: node.fields.slug,
                title: node.frontmatter.title,
                cover: `${process.env.GATSBY_DOMAIN}${
                  node.frontmatter.cover.childImageSharp.original.src
                }`,
                excerpt: node.excerpt,
                author: node.frontmatter.author,
                tags: node.frontmatter.tags,
                series: node.frontmatter.series,
              })),
            indexName: 'posts',
          },
          {
            query: `
              {
                allAuthorJson {
                  edges {
                    node {
                      id
                      name
                      avatar {
                        childImageSharp {
                          original {
                            src
                          }
                        }
                      }
                      email
                      nickname
                      slogan
                    }
                  }
                }
              }`,
            transformer: ({ data }) =>
              data.allAuthorJson.edges.map(({ node }) => ({
                objectID: node.id,
                slug: `/author/${node.id}`,
                name: node.name,
                avatar: `${process.env.GATSBY_DOMAIN}${
                  node.avatar.childImageSharp.original.src
                }`,
                email: node.email,
                nickname: node.nickname,
                slogan: node.slogan,
              })),
            indexName: 'author',
          },
          {
            query: `
              {
                allTagJson {
                  edges {
                    node {
                      id
                      name
                      description
                      cover {
                        childImageSharp {
                          original {
                            src
                          }
                        }
                      }
                    }
                  }
                }
              }`,
            transformer: ({ data }) =>
              data.allTagJson.edges.map(({ node }) => ({
                objectID: node.id,
                slug: `/tag/${node.id}`,
                name: node.name,
                description: node.description,
                cover: `${process.env.GATSBY_DOMAIN}${
                  node.cover.childImageSharp.original.src
                }`,
              })),
            indexName: 'tag',
          },
          {
            query: `
              {
                allSeriesJson {
                  edges {
                    node {
                      id
                      name
                      description
                      cover {
                        childImageSharp {
                          original {
                            src
                          }
                        }
                      }
                    }
                  }
                }
              }`,
            transformer: ({ data }) =>
              data.allSeriesJson.edges.map(({ node }) => ({
                objectID: node.id,
                slug: `/series/${node.id}`,
                name: node.name,
                description: node.description,
                cover: `${process.env.GATSBY_DOMAIN}${
                  node.cover.childImageSharp.original.src
                }`,
              })),
            indexName: 'series',
          },
        ],
        chunkSize: 10000,
      },
    },
  ],
  mapping: {
    'MarkdownRemark.frontmatter.author': `AuthorJson`,
    'MarkdownRemark.frontmatter.series': `SeriesJson`,
    'MarkdownRemark.frontmatter.tags': `TagJson`,
  },
};
