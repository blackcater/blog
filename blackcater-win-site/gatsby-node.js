/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */
const path = require('path')
const { createFilePath } = require('gatsby-source-filesystem')

exports.onCreateNode = ({ node, getNode, boundActionCreators }) => {
  if (node.internal.type === 'MarkdownRemark') {
    const { createNodeField } = boundActionCreators
    const slug = createFilePath({ node, getNode, basePath: `pages` })

    createNodeField({
      node,
      name: 'slug',
      value: slug,
    })
  }
}

exports.createPages = ({ graphql, boundActionCreators }) => {
  const { createPage } = boundActionCreators

  return new Promise((resolve, reject) => {
    graphql(`
      {
        allMarkdownRemark(sort: { fields: [frontmatter___date], order:DESC }) {
          edges {
            node {
              fields {
                slug
              }
              frontmatter {
                title
                cover
                date
                tags
                category
              }
              tableOfContents
              timeToRead
              wordCount {
                paragraphs
                sentences
                words
              }
              headings {
                value
                depth
              }
              excerpt
              html
            }
          }
        }
      }
    `)
      .then(({ data }) => {
        const tagMap = {}
        const archiveMap = {}
        const categoryMap = {}

        data.allMarkdownRemark.edges.map(({ node }) => {
          const { fields: { slug }, frontmatter: { date, tags, category } } = node

          // 每个帖子的详情页
          createPage({
            path: slug,
            component: path.resolve(__dirname, 'src/templates/post.js'),
            context: {
              // 你可以在 graphql 中使用该参数
              slug,
            },
          })

          // 分类
          if (category) {
            categoryMap[category] = (categoryMap[category] || []).concat(node)
          }

          // 标签
          if (tags) {
            (tags || []).forEach(tag => {
              tagMap[tag] = (tagMap[tag] || []).concat(node)
            })
          }

          // 归档
          if (date) {
            const date$ = new Date(date)
            const year = date$.getUTCFullYear()
            const month = date$.getUTCMonth() + 1
            const day = date$.getUTCDay()

            archiveMap[year] = archiveMap[year] || {}
            archiveMap[year][month] = archiveMap[year][month] || {}
            archiveMap[year][month][day] = (archiveMap[year][month][day] || []).concat(node)
          }
        })

        console.dir(tagMap)
        console.dir(archiveMap)
        console.dir(categoryMap)

        resolve()
      })
      .catch(reject)
  })
}
