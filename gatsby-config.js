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
    footer: {
      links: [
        {
          name: 'CHANNELS',
          list: [
            {
              name: 'Github',
              link: 'https://github.com/blackcater',
              tag: 'hot',
            },
            {
              name: 'Twitter',
              link: 'https://www.twitter.com/tomtang2015',
            },
            {
              name: 'Weibo',
              link: 'https://www.weibo.com/tangyinong2013',
            },
            {
              name: 'Email',
              link: 'mailto:blackcater2015@gmail.com',
            },
          ],
        },
        {
          name: 'PROJECTS',
          list: [
            {
              name: 'VSUITE',
              link: 'https://github.com/vsuite/vsuite',
              tag: 'soon',
            },
            {
              name: 'BCFLOW',
              link: 'https://github.com/the-bcflow/bcflow',
              tag: 'soon',
            },
          ],
        },
      ],
    },
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
          'gatsby-remark-abbr',
          'gatsby-remark-autolink-headers',
          'gatsby-remark-copy-linked-files',
          {
            resolve: `gatsby-remark-embed-gist`,
            options: {
              username: 'blackcater',
              includeDefaultCss: true,
            },
          },
          'gatsby-remark-emoji',
          'gatsby-remark-external-links',
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 1200,
              showCaptions: true,
              linkImagesToOriginal: false,
              backgroundColor: 'transparent',
            },
          },
          'gatsby-remark-katex',
          {
            resolve: `gatsby-remark-mermaid`,
            options: {
              theme: 'neutral',
            },
          },
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              classPrefix: 'language-',
              noInlineHighlight: false,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin: 2em -30px`,
            },
          },
          'gatsby-remark-sub-sup',
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
                allMarkdownRemark(
                  sort: { fields: frontmatter___date, order: DESC }
                  filter: { frontmatter: { draft: { ne: true } } }
                ) {
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
                            fluid(maxWidth: 1200, maxHeight: 500, cropFocus: CENTER) {
                              src
                            }
                          }
                        }
                        date: date(formatString: "MMM D")
                        author {
                          id
                          name
                          nickname
                        }
                        series {
                          id
                          name
                        }
                        tags {
                          id
                          name
                        }
                      }
                      timeToRead
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
                cover: node.frontmatter.cover.childImageSharp.fluid.src,
                date: node.frontmatter.date,
                excerpt: node.excerpt,
                timeToRead: node.timeToRead,
                author: node.frontmatter.author,
                series: node.frontmatter.series,
                tags: node.frontmatter.tags,
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
                          fluid(cropFocus: CENTER) {
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
                avatar: node.avatar.childImageSharp.fluid.src,
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
                          fluid(cropFocus: CENTER) {
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
                cover: node.cover.childImageSharp.fluid.src,
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
                          fluid(cropFocus: CENTER) {
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
                cover: node.cover.childImageSharp.fluid.src,
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
