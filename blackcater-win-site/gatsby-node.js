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
        allMarkdownRemark {
          edges {
            node {
              fields {
                slug
              }
            }
          }
        }
      }
    `)
      .then(({ data }) => {
        data.allMarkdownRemark.edges.map(({ node }) => {
          createPage({
            path: node.fields.slug,
            component: path.resolve(__dirname, 'src/templates/post.js'),
            context: {
              // 你可以在 graphql 中使用该参数
              slug: node.fields.slug,
            },
          })
        })

        resolve()
      })
      .catch(reject)
  })
}
